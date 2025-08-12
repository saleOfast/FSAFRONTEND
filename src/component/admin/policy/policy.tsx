import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, FormOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../redux-store/reducer";
import { AppDispatch } from "../../../redux-store/store";
import { getProductBrandActions } from "../../../redux-store/action/productAction";
import { dateFormatter, dateFormatterNew } from "utils/common";
import { deleteProductBrandService } from "services/productService";
import previousPage from "utils/previousPage";
import { Input, message, Table } from "antd";
import DeleteItem from "../common/deleteItem";
import { capitalizeSubstring } from "utils/capitalize";
import { setLoaderAction } from "redux-store/action/appActions";
import { deletePolicyHeadService, getPolicyHeadService } from "services/usersSerivce";

export default function Policy() {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [deleteName, setDeleteName] = useState('');
  const [deleteId, setDeleteId] = useState('');

  
  const dispatch = useDispatch<AppDispatch>();
  
  
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
   useEffect(() => {
    setFilteredData(data);
    }, [data])
  
  const searchStore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = data.filter((item: any) =>
      (item?.policy_name?.toLowerCase())?.includes(value.toLowerCase())
    );
    setFilteredData(FS);
  };
   
    async function fetchData() {
        try {
          dispatch(setLoaderAction(true));
          setIsLoading(true);
          const res = await getPolicyHeadService();
          if (res?.data?.status === 200) {
            setData(res?.data?.data);
          } else {
            message.error("Failed to fetch data");
          }
        } catch (error) {
          message.error("Error fetching data");
        } finally {
          setIsLoading(false);
          dispatch(setLoaderAction(false));
        }
      }
   useEffect(() => {
          fetchData();
      }, []);

  const toggleHandler = (Id: string, name: string) =>{
    setToggleDelete(true);
    setDeleteId(Id);
    setDeleteName(name)
  }

  const columns: any = [
    {
      title: 'Expense Type',
      dataIndex: 'policy_name',
      key: 'policy_name',
      fixed:"left",
      width: 80,
      render: (text: any, record: any) => {
        return record?.is_travel ? (
          <Link
            to={`/config/policyTypes?policyId=${record?.policy_id}`}
            style={{ textDecoration: "underline" }}
          >
            {text}
          </Link>
        ) : (
          <span>{text}</span>
        );
      },
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Policy Code',
      dataIndex: 'policy_code',
      key: 'policy_code',
      width: 160,
    },
    // {
    //   title: 'Created Date',
    //   dataIndex: 'date',
    //   key: 'date',
    //   width: 80,

    // },
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to={`/config/add-policy?policyId=${record?.policy_id}`}><EditOutlined /></Link>;
     },                          
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to="#" onClick={() => toggleHandler(record?.policy_id, record?.policy_name)} style={{color:"red"}}><DeleteOutlined /></Link>;
     },
    },
  ];
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button"/>
          <h1 className="page-title pr-18">Policy Head</h1>
        </header>
      <Link to="/config/add-policy">
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
          placeholder="Search Policy" 
          onChange={searchStore} 
          className="searchContainer"
          />
          </div>
          <div>
          <DeleteItem 
          toggle={toggleDelete} 
          name={deleteName} 
          itemsId={deleteId} 
          deleteService={deletePolicyHeadService}
          closeModal={(e: any) => {
            setToggleDelete(e);
          }}/>
            <Table className="content"
              columns={columns}
              dataSource={

                filteredData?.map((data: any) => ({
                  is_travel: data?.is_travel,
                  policy_id: data?.policy_id,
                  policy_code: data?.policy_code,
                  policy_name: `${capitalizeSubstring(data?.policy_name)}`,
                  // date: dateFormatterNew(data?.createdAt),
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
