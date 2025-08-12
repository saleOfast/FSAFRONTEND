import { ArrowLeftOutlined, FormOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "redux-store/reducer";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Input, Select, Space, message } from "antd";
import { getInventoryList, updateInventory } from "services/inventoryService";
import { IInventoryState, InventoryReqBody } from "types/Inventory";
import { setLoaderAction } from "redux-store/action/appActions";
import RupeeSymbol from "component/RupeeSymbol";
import "../style/inventory.css";
import previousPage from "utils/previousPage";
import { getStoresByEmpIdService } from "services/usersSerivce";
import { useAuth } from "context/AuthContext";

function Inventory() {
  const productBrandList = useSelector(state => [{ label: "All Brand", value: "" }, ...state.product.brand.map(i => ({ label: i.name, value: i.brandId }))]);
  const productCategoryList = useSelector(state => [{ label: "All Category", value: "" }, ...state.product.category.map(i => ({ label: i.name, value: i.productCategoryId }))]);

  const [inventoryData, setInventoryData] = useState<IInventoryState[]>([]);

  const [searchText, setSearchText] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);

  const dispatch = useDispatch();
  const params = useParams<{ storeId: string }>();

  const filteredInventoryList = useMemo(() => {
    let filteredResult = inventoryData;
    if (searchText.length > 0) {
      filteredResult = inventoryData.filter(i => i.product.productName.toLowerCase().includes(searchText.toLowerCase()));
    }
    if (selectedBrand) {
      filteredResult = filteredResult.filter(i => i.product.brandId === +selectedBrand);
    }
    if (selectedCategory) {
      filteredResult = filteredResult.filter(i => i.product.categoryId === +selectedCategory);
    }
    return filteredResult

  }, [inventoryData, searchText, selectedBrand, selectedCategory])
  const [storeData, setStoreData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {authState} = useAuth();
  useEffect(() => {
    async function getStoresData() {
      try {
        if (authState?.user?.id) {
          setIsLoading(true);
          const res = await getStoresByEmpIdService(authState?.user?.id);
          setStoreData(res?.data?.data)
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getStoresData();
  }, [authState?.user?.id])
  async function getList() {
    if (params.storeId || storeData) {
      try {
        dispatch(setLoaderAction(true));
        const result = await getInventoryList(storeData[0]?.storeId ?? params.storeId );
        dispatch(setLoaderAction(false));
        if (result.status === 200) {
          setInventoryData(result.data.data.map(i => ({
            ...i,
            noOfCaseT: i.noOfCase,
            noOfPieceT: i.noOfPiece,
          })))
          setIsEdit(false)
        }
      } catch (error) {
        dispatch(setLoaderAction(false));
      }
    }
  }
  useEffect(() => {
    getList();
  }, [params.storeId || storeData]);


  const handleBrandChange = (value: any) => {
    setSelectedBrand(value);
  };

  const handleCategoryChange = (value: any) => {
    setSelectedCategory(value);
  };

  const handleSave = async () => {
    try {
      dispatch(setLoaderAction(true));
      const reqBody: InventoryReqBody = {
        inventory: inventoryData.map(i => ({
          inventoryId: i.inventoryId,
          noOfCase: i.noOfCaseT,
          noOfPiece: i.noOfPieceT
        }))
      }
      const res = await updateInventory(reqBody)
      dispatch(setLoaderAction(false));
      if (res.data.status === 200) {
        message.success("Inventory updated successfully");
        getList()
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  }

  const handleCancel = () => {
    setInventoryData(prev => prev.map(i => ({ ...i, noOfCaseT: i.noOfCase, noOfPieceT: i.noOfPiece })))
    setIsEdit(false);
  }

  const handleInputChange = (inventoryId: number, value: string, type: "case" | "piece") => {
    setInventoryData(prev => {
      return prev.map(i => {
        if (i.inventoryId === inventoryId) {
          return {
            ...i,
            ...(type === "case" ? { noOfCaseT: value ? +value : "" as any } : { noOfPieceT: value ? +value : "" as any })
          }
        }
        return i;
      })
    })
  }


  return (
    <div className="inventory-cont">
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Store Inventory</h1>
      </header>
      <main className="mb-60 content">
        <div className="search">
          <Input prefix={<SearchOutlined />} placeholder="Search Store" onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <div className="selection-line" style={{ background: "none" }}>
          <div className="brand">
            <Select
              value={selectedBrand}
              className="linktoB"
              onChange={handleBrandChange}
              options={productBrandList}
            />
          </div>

          <div className="category">
            <Space>
              <Select
                value={selectedCategory}
                className="linktoB"
                onChange={handleCategoryChange}
                options={productCategoryList}
              />
            </Space>
          </div>
        </div>
        <div className="edit" onClick={() => setIsEdit(true)}>
          <FormOutlined /> Edit
        </div>
        {
          filteredInventoryList.map(i => (
            <div className="inventoryContent" key={i.inventoryId}>
              <div className="title">
                <div className="mrpPrice">
                  <div>
                    <div>{i.product.productName}</div>
                    <div>{i.product.category.name} </div>
                  </div>
                  <div>
                    <span>MRP: <RupeeSymbol />{i.product.mrp}</span>
                    <span className="pl-12">RLP: <RupeeSymbol />{i.product.rlp}</span>
                  </div>
                </div>
              </div>
              <div className="cases">
                <div className="casesValue">
                  <div>Cases</div>
                  <div>
                    {
                      isEdit ?
                        <input
                          type="number"
                          className="caseInput"
                          value={i.noOfCaseT}
                          onChange={e => handleInputChange(i.inventoryId, e.target.value, "case")} />
                        :
                        i.noOfCase
                    }
                  </div>
                </div>
                <div className="casesValue">
                  <div>piece</div>
                  <div>
                    {
                      isEdit ?
                        <input
                          type="number"
                          className="caseInput"
                          value={i.noOfPieceT}
                          onChange={e => handleInputChange(i.inventoryId, e.target.value, "piece")} />
                        :
                        i.noOfPiece
                    }
                  </div>
                </div>
              </div>
            </div>
          ))
        }
        {
          isEdit &&
          <div className="inventory-btn-cont">
            <Button type="default" onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save</Button>
          </div>
        }
      </main>
    </div>
  );
}


export default Inventory;