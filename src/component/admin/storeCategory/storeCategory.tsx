import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, FormOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../redux-store/reducer";
import { AppDispatch } from "../../../redux-store/store";
import { setStoreCategoryAction } from "../../../redux-store/action/storeActions";
import { dateFormatter, dateFormatterNew } from "utils/common";
import { deleteStoreCategoryService } from "services/storeService";
import previousPage from "utils/previousPage";
import { Input, Table } from "antd";
import DeleteItem from "../common/deleteItem";
import { capitalizeSubstring } from "utils/capitalize";
export default function StoreCategory() {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [storeCategoryId, setStoreCategoryID] = useState('');

  const [storeCategoryList, setStoreCategoryList] = useState<any[]>([]);
  const storeCategoryData = useSelector(state => state?.store?.storeCategory);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setStoreCategoryAction());
  }, []);

  useEffect(() => {
    setStoreCategoryList(storeCategoryData);
  }, [storeCategoryData])

  const searchStore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = storeCategoryData.filter((item: any) =>
      (item?.categoryName?.toLowerCase())?.includes(value.toLowerCase())
    );
    setStoreCategoryList(FS);
  };
  const toggleHandler = (storeCategoryId: string, categoryName: string) => {
    setToggleDelete(true);
    setStoreCategoryID(storeCategoryId);
    setCategoryName(categoryName)
  }
  const columns: any = [
    {
      title: 'Category Id',
      dataIndex: 'storeCatId',
      key: 'storeCatId',
      fixed:"left",
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
        return <Link to={`/admin/store/add-update-category?categoryId=${record?.storeCatId}`}><EditOutlined /></Link>;
     },                          
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to="#" onClick={() => toggleHandler(record?.storeCatId, record?.name)} style={{color:"red"}}><DeleteOutlined /></Link>;
     },
    },
  ];
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button"/>
          <h1 className="page-title pr-18">Customer Category</h1>
        </header>
      <Link to="/admin/store/add-update-category">
        <div className="addIcon">
          <PlusOutlined className="plusIcon"/>
        </div>
      </Link>
      <main>
        <div className="searchStoreType">
        <Input 
          prefix={<SearchOutlined />} 
          placeholder="Search Store Category" 
          onChange={searchStore} 
          className="searchContainer"
          />
          </div>
        <div>
          <DeleteItem
            toggle={toggleDelete}
            name={categoryName}
            itemsId={storeCategoryId}
            deleteService={deleteStoreCategoryService}
            closeModal={(e: any) => {
              setToggleDelete(e);
            }} />
           <Table className="content"
              columns={columns}
              dataSource={

                storeCategoryList?.map((data: any, index:any) => ({
                  key: index,
                  storeCatId: data?.storeCategoryId,
                  name: `${capitalizeSubstring(data?.categoryName)}`,
                  date: dateFormatterNew(data?.createdAt),
                  edit: "",
                  delete: ""
                }))
              }
              bordered
              scroll={{x:"100%"}}
              size="small" pagination={false} />
        </div>
      </main>
    </div>
  );
}
