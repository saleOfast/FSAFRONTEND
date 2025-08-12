import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { ArrowLeftOutlined, EyeOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "redux-store/reducer";
import { AppDispatch } from "redux-store/store";
import { getProductSchemeActions } from "redux-store/action/productAction";
// import { deleteProductSchemeService } from "services/productService";
import previousPage from "utils/previousPage";
import { useAuth } from "context/AuthContext";
import { UserRole } from "enum/common";
import { message, Switch, Table } from "antd";
import { setLoaderAction } from "redux-store/action/appActions";
import { getActiveSchemeService, updateSchemeService } from "services/productService";
// import DeleteItem from "../common/deleteItem";

export default function Scheme() {

  const [toggleDelete, setToggleDelete] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  const [schemeId, setSchemeID] = useState('');

  const productSchemeListData = useSelector(state => state?.product?.SchemeList);
  const [productSchemeList, setProductSchemeList] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
// console.log({productSchemeList})
  const { authState } = useAuth()


  const getCollectionList = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getActiveSchemeService();
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        const { data } = response.data;
        setProductSchemeList(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
  useEffect(() => {
    if(authState?.user?.role === UserRole.SSM || authState?.user?.role === UserRole.RETAILER){
    getCollectionList();
    }else{
    dispatch(getProductSchemeActions());
    }
  }, []);

  useEffect(() => {
    setProductSchemeList(productSchemeListData);
  }, [productSchemeListData])

  const searchStore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = productSchemeListData.filter((item: any) =>
      (item?.name?.toLowerCase())?.includes(value.toLowerCase())
    );
    setProductSchemeList(FS);
  };

  const toggleHandler = (schemeId: string, name: string) => {
    setToggleDelete(true);
    setSchemeID(schemeId);
    setSchemeName(name)
  }

  const openPdfInNewTab = (file: any) => {
    window.open(file, '_blank');
  };
  const onChangeStatus = async (value: boolean, key: number) => {
    // Optimistically update the UI
    const previousData = [...productSchemeList];
    const newData = productSchemeList.map((item: any) =>
      item.id === key ? { ...item, isEnable: value } : item
    );
    setProductSchemeList(newData);
    // setIsLoadingChange(true);

    try {
      dispatch(setLoaderAction(true));
      const response = await updateSchemeService({ id: key, isEnable: value });
      if (response?.data?.status === 200) {
        message.success("Updated Successfully");
      } else {
        message.error("Something went wrong");
        setProductSchemeList(previousData); // Revert to previous state on failure
      }
    } catch (error: any) {
      message.error("Error updating status");
      setProductSchemeList(previousData); // Revert to previous state on error
    } finally {
      // setIsLoadingChange(false);
      dispatch(setLoaderAction(false));
    }
  };

  const dataSource = productSchemeList?.map((item: any, idx:any) => ({
    id: item?.id,
    key: `scheme_${idx}`,
    name: item?.name,
    monthyear: `${item?.month} - ${item?.year}`,
    status: item?.isEnable,
    view: item?.file,
    edit: <Switch onChange={(e) => onChangeStatus(e, item?.id)} checkedChildren="Enabled" unCheckedChildren="Disabled" checked={item?.isEnable} />,
  }));
  const columns: any = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',

    },
    {
      title: 'Month & Year',
      dataIndex: 'monthyear',
      key: 'monthyear',
    },
    {
      title: 'View',
      dataIndex: 'view',
      key: 'view',
      render: (text: any, record: any) => {
        return <EyeOutlined className="eyeIcon" onClick={(e: any) => openPdfInNewTab(record?.view)} />

      },
    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => {
        return <span className={record?.status ? "schemeActive txtC" : "schemeInactive txtC"}>{record?.status ? "Active" : "Inactive"}</span>
      },
    },
    ...(authState?.user?.role !== UserRole.RETAILER && authState?.user?.role !== UserRole.SSM ? [{
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
    }] : []),
    // {
    //     title: '',
    //     dataIndex: 'delete',
    //     key: 'delete',
    //     render: (text: any, record: any) => {
    //         return <Link to="#" onClick={() => toggleHandler(record?.featureId, record?.featureName)} style={{color:"red"}}><DeleteOutlined /></Link>;
    //      },
    // }, 
  ];
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Marketing Material PDF</h1>
      </header>
      {(authState?.user?.role !== UserRole.RETAILER && authState?.user?.role !== UserRole.SSM )&& <Link to="/admin/add-new-scheme">
        <div className="addIcon">
          <PlusOutlined className="plusIcon" />
        </div>
      </Link>}
      <main style={{ marginTop: "10px" }}>
        <div className="searchproduct">
          <div>
            <main className='content'>
              <Table

                dataSource={
                  dataSource
                }
                bordered
                columns={columns}
                size="small"
                pagination={false}
              />
            </main>
          </div>
        </div>
      </main>
    </div>
  );
}
