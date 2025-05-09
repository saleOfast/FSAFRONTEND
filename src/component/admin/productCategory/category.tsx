import "../../style/orderList.css";
import { ArrowLeftOutlined, EditOutlined, } from "@ant-design/icons";
import { Link } from "react-router-dom";
import previousPage from "utils/previousPage";
import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { DeleteOutlined, FormOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../redux-store/reducer";
import { AppDispatch } from "../../../redux-store/store";
import { getProductCategoryActions } from "../../../redux-store/action/productAction";
import { dateFormatter, dateFormatterNew } from "utils/common";
import { deleteProductCategoryService } from "services/productService";
import { Input } from "antd";
import DeleteItem from "../common/deleteItem";
import Table, { ColumnsType } from "antd/es/table";
import { capitalizeSubstring } from "utils/capitalize";

export default function Category() {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [productCategoryName, setProductCategoryName] = useState('');
  const [productCategoryId, setProductCategoryID] = useState('');
  const productCategoryData = useSelector(state => state?.product?.category);
  const [productCategoryList, setProductCategoryList] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getProductCategoryActions());
  }, []);

  useEffect(() => {
    setProductCategoryList(productCategoryData);
  }, [productCategoryData])

  const searchStore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = productCategoryData.filter((item: any) =>
      (item?.name?.toLowerCase())?.includes(value.toLowerCase())
    );
    setProductCategoryList(FS);
  };

  const toggleHandler = (productCategoryId: string, name: string) => {
    setToggleDelete(true);
    setProductCategoryID(productCategoryId);
    setProductCategoryName(name)
  }
  interface DataType {
    key: string;
    id: number;
    name: string;
    level: string;
    category: string;
    date: Date;
    edit: any;
    delete: any;
  }

  const columns: any = [
    {
      title: 'Category Id',
      dataIndex: 'id',
      key: 'id',
      fixed:"left",
      width: 80,
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Namee',
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 80,

    },
    {
      title: 'Parent Category',
      dataIndex: 'category',
      key: 'category',
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
        return <Link to={`/admin/add-new-category?productCategoryId=${record?.id}`}><EditOutlined /></Link>;
     },                          
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to="#" onClick={() => toggleHandler(record?.id, record?.name)} style={{color:"red"}}><DeleteOutlined /></Link>;
     },
    },
  ];
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Medician Category</h1>
      </header>
      <DeleteItem
        toggle={toggleDelete}
        name={productCategoryName}
        itemsId={productCategoryId}
        deleteService={deleteProductCategoryService}
        closeModal={(e: any) => {
          setToggleDelete(e);
        }} />
      <Link to="/admin/add-new-category">
        <div className="addIcon">
          <PlusOutlined className="plusIcon" />
        </div>
      </Link>
      <main className="content">
        <div className="searchproduct">
          <div className="searchStoreType" style={{marginBottom:"10px"}}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Category"
              onChange={searchStore}
              className="searchContainer"
            />
          </div>
          <div>
            <Table
              columns={columns}
              dataSource={

                productCategoryList?.map((data: any, index:any) => ({
                  key: index,
                  id: data?.productCategoryId,
                  name: `${capitalizeSubstring(data?.name)}`,
                  level: data?.parentId ? "Children" : "Parent",
                  category: data?.parentId ? data?.parent?.name : "",
                  date: dateFormatterNew(data?.createdAt),
                  edit: "",
                  delete: ""
                }))
              }
              bordered
              scroll={{x:"100%"}}
              size="small" pagination={false} />
           
          </div>
        </div>
      </main>
    </div>
  );
}
