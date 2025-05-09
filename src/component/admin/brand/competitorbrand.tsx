import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, FormOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../redux-store/reducer";
import { AppDispatch } from "../../../redux-store/store";
import { getCompetitorProductBrandActions, getProductBrandActions } from "../../../redux-store/action/productAction";
import { dateFormatter, dateFormatterNew } from "utils/common";
import { deleteProductBrandService } from "services/productService";
import previousPage from "utils/previousPage";
import { Input, Table } from "antd";
import DeleteItem from "../common/deleteItem";
import { capitalizeSubstring } from "utils/capitalize";

export default function Competitorbrand() {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [brandId, setBrandID] = useState('');

  const productBrandData = useSelector(state => state?.product?.competitorBrand);
  console.log(productBrandData,"productBrandData")
  const [productBrand, setProductBrand] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getCompetitorProductBrandActions(1));
  }, []);

  useEffect(() => {
    setProductBrand(productBrandData);
  }, [productBrandData])

  const searchStore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = productBrandData.filter((item: any) =>
      (item?.name?.toLowerCase())?.includes(value.toLowerCase())
    );
    setProductBrand(FS);
  };

  const toggleHandler = (brandId: string, name: string) => {
    setToggleDelete(true);
    setBrandID(brandId);
    setBrandName(name)
  }

  const columns: any = [
    {
      title: 'Brand Id',
      dataIndex: 'brandId',
      key: 'brandId',
      fixed: "left",
      width: 80,
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: 'Created Date',
      dataIndex: 'date',
      key: 'date',
      width: 80,

    },
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      width: 40,

      render: (text: any, record: any) => {
        console.log(record, "=============>>>");
        return <Link to={`/admin/new-otherbrand?brandId=${record?.brandId}&isCompetitor=1`}><EditOutlined /></Link>;
      },
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to="#" onClick={() => toggleHandler(record?.brandId, record?.name)} style={{ color: "red" }}><DeleteOutlined /></Link>;
      },
    },
  ];
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Competitor Brands</h1>
      </header>
      <Link to="/admin/new-otherbrand">
        <div className="addIcon">
          <PlusOutlined
            className="plusIcon"
          />
        </div>
      </Link>
      <main>
        <div className="searchproduct">
          <div className="searchStoreType">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Brand"
              onChange={searchStore}
              className="searchContainer"
            />
          </div>
          <div>
            <DeleteItem
              toggle={toggleDelete}
              name={brandName}
              itemsId={brandId}
              isBrand={true}
              isCompetitor={1}
              deleteService={deleteProductBrandService}
              closeModal={(e: any) => {
                setToggleDelete(e);
              }} />
            <Table className="content"
              columns={columns}
              dataSource={

                productBrand?.map((data: any) => ({
                  brandId: data?.CompetitorBrandId,
                  name: `${capitalizeSubstring(data?.name)}`,
                  date: dateFormatterNew(data?.createdAt),
                  edit: "",
                  delete: ""
                }))
              }
              bordered
              scroll={{ x: "100%" }}
              size="small" pagination={false} />
          </div>
        </div>
      </main>
    </div>
  );
}
