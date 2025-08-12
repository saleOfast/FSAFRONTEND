import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, FormOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../redux-store/reducer";
import { AppDispatch } from "../../../redux-store/store";
import { setStoreBeatAction } from "../../../redux-store/action/storeActions";
import { Input, Table } from "antd";
import previousPage from "utils/previousPage";
import DeleteItem from "../common/deleteItem";
import { deleteBeatService } from "services/storeService";
import { capitalizeSubstring } from "utils/capitalize";

export default function BeatList() {
  const beatData = useSelector(state => state?.store?.storeBeat);
  const dispatch = useDispatch<AppDispatch>();
  const [beatDataList, setBeatDataList] = useState<any[]>([]);

  useEffect(() => {
    dispatch(setStoreBeatAction());
  }, []);

  useEffect(() => {
    setBeatDataList(beatData);
  }, [beatData])

  const searchStore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = beatData.filter((item: any) =>
      (item?.beatName?.toLowerCase())?.includes(value.toLowerCase()) ||  
      (item?.country?.toLowerCase())?.includes(value.toLowerCase()) ||
      (item?.state?.toLowerCase())?.includes(value.toLowerCase()) ||  
      (item?.district?.toLowerCase())?.includes(value.toLowerCase()) ||
      (item?.city?.toLowerCase())?.includes(value.toLowerCase()) ||  
      (item?.user?.firstname?.toLowerCase())?.includes(value.toLowerCase()) ||
      (item?.user?.lastname?.toLowerCase())?.includes(value.toLowerCase()) 
    );
    setBeatDataList(FS);
  };
  const [toggleDelete, setToggleDelete] = useState(false);
  const [beatName, setBeatName] = useState('');
  const [beatId, setBeatID] = useState('');
  const toggleHandler = (beatId: string, name: string) => {
    setToggleDelete(true);
    setBeatID(beatId);
    setBeatName(name)
  }

  const columns: any = [
    {
      title: 'Beat Id',
      dataIndex: 'beatId',
      key: 'beatId',
      fixed:"left",
      width: 80,
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Beat Name',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: 'Sales Reps',
      dataIndex: 'salesRep',
      key: 'salesRep',
      width: 160,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      width: 120,
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: 120,
    },
    {
      title: 'District',
      dataIndex: 'district',
      key: 'district',
      width: 120,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      width: 120,
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
        return <Link to={`/admin/create-beat?beatId=${record?.beatId}`}><EditOutlined /></Link>;
     },                          
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to="#" onClick={() => toggleHandler(record?.beatId, record?.name)} style={{color:"red"}}><DeleteOutlined /></Link>;
     },
    },
  ];
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Beats</h1>
      </header>
      <Link to="/admin/create-beat">
        <div className="addIcon">
          <PlusOutlined
            className="plusIcon"
          />
        </div>
      </Link>
      <main>
        <div className="searchStoreType">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search Beat"
            onChange={searchStore}
            className="searchContainer"
          />
        </div>
        <DeleteItem
          toggle={toggleDelete}
          name={beatName}
          itemsId={beatId}
          deleteService={deleteBeatService}
          closeModal={(e: any) => {
            setToggleDelete(e);
          }} />
        <div>
          <Table className="content"
              columns={columns}
              dataSource={

                beatDataList?.map((data: any) => ({
                  key: data?.beatId,
                  beatId: data?.beatId,
                  name: `${capitalizeSubstring(data?.beatName)}`,
                  salesRep: `${capitalizeSubstring((data?.user?.firstname || "") +" "+ (data?.user?.lastname || ""))}`,
                  country: data?.country,
                  state: data?.state,
                  district: data?.district ?? "",
                  city: data?.city ?? "",
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
