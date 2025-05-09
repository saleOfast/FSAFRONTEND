import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { ArrowLeftOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux-store/store";

import previousPage from "utils/previousPage";
import { Input, message, Table } from "antd";
import DeleteItem from "../common/deleteItem";
import { setLoaderAction } from "redux-store/action/appActions";
import { deletePolicyTypeService, getLeaveHeadCountService } from "services/usersSerivce";

export default function LeaveView() {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [deleteName, setDeleteName] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const redirect = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const searchParams = new URLSearchParams(location?.search);
  const year: string | null = searchParams.get('year');

  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  useEffect(() => {
    setFilteredData(data);
  }, [data])

  const searchStore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = data.filter((item: any) =>
      (item?.policy_type_name?.toLowerCase())?.includes(value.toLowerCase())
    );
    setFilteredData(FS);
  };
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData() {
    if (year) {
      try {
        dispatch(setLoaderAction(true));
        setIsLoading(true);
        const res = await getLeaveHeadCountService({year});
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
  }
  useEffect(() => {
    fetchData();
  }, []);

  const toggleHandler = (Id: string, name: string) => {
    setToggleDelete(true);
    setDeleteId(Id);
    setDeleteName(name);

    const searchParams = new URLSearchParams(location.search);
    redirect({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  }

  const columns: any = [
    {
      title: 'Leave Code',
      dataIndex: 'head_leave_code',
      key: 'head_leave_code',
      width: 160,
      fixed: "left",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Leave Name',
      dataIndex: 'head_leave_name',
      key: 'head_leave_name',
      width: 80,
    },
    {
      title: 'Leave Short Name',
      dataIndex: 'head_leave_short_name',
      key: 'head_leave_short_name',
      width: 80,

    },
    {
      title: 'Total Leave',
      dataIndex: 'total_leave',
      key: 'total_leave',
      width: 80,
      // render: (text: any, record: any) => {
      //   return record?.status ? <Tag color="green" >Active</Tag> : <Tag color="red" >Inactive</Tag>;
      // },
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to={`/config/add-update-leave-count?leaveCountId=${record?.headLeaveCntId ?? null}&year=${year}&leaveHeadId=${record?.head_leave_id}&leaveName=${record?.head_leave_name}`}><EditOutlined /></Link>;
      },
    },
    
   
  ];
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Leave List: FY {year}-{Number(year)+1}</h1>
      </header>
      {/* <Link to={`/config/add-update-policyTypes?policyId=${year}`}>
        <div className="addIcon">
          <PlusOutlined
            className="plusIcon"
          />
        </div>
      </Link> */}
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
              deleteService={deletePolicyTypeService}
              closeModal={(e: any) => {
                setToggleDelete(e);
              }} />
            <Table className="content"
              columns={columns}
              dataSource={

                filteredData?.map((data: any) => ({
                  head_leave_name: data?.head_leave_name,
                  head_leave_code: data?.head_leave_code,
                  // policy_type_name: `${capitalizeSubstring(data?.policy_type_name)}`,
                  head_leave_short_name: data?.head_leave_short_name,
                  total_leave: Array.isArray(data?.leave_head_count) ? data?.leave_head_count[0]?.totalHeadLeave : "",
                  head_leave_id: data?.head_leave_id,
                  headLeaveCntId: Array.isArray(data?.leave_head_count) ? data?.leave_head_count[0]?.headLeaveCntId : "",
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
