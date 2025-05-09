import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { ArrowLeftOutlined, CodepenOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, FormOutlined, PlusOutlined, QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux-store/store";

import previousPage from "utils/previousPage";
import { Button, Cascader, Input, message, Modal, Table, Tag } from "antd";
import DeleteItem from "../common/deleteItem";
import { setLoaderAction } from "redux-store/action/appActions";
import { deleteLeaveHeadService, getLeaveHeadService, updateLeaveHeadService } from "services/usersSerivce";
interface Option {
  value: string;
  label: string;
  // children?: Option[];
}
export default function Leave() {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [leaveName, setLeaveName] = useState('');
  const [leaveId, setLeaveID] = useState('');


  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

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
      const res = await getLeaveHeadService();
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
  }, [isUpdate]);

  const toggleHandler = (Id: string, name: string) => {
    setToggleDelete(true);
    setLeaveID(Id);
    setLeaveName(name)
  }

  const { confirm } = Modal;

  
  const showConfirm =  (id:number, leaveName: string, status: boolean) => {
        confirm({
          icon: <ExclamationCircleOutlined />,
          content: `Are you Sure Want to ${status ? "Disable" : "Enable"} ${leaveName} ?`,
          async onOk() {
            try {
              dispatch(setLoaderAction(true));
              const response = await updateLeaveHeadService({head_leave_id: Number(id), status: !status });
              dispatch(setLoaderAction(false));
              if (response?.data?.status === 200) {
                message.success("Updated Successfully");
                setIsUpdate(true)
                // redirect("/config/leave")
              }else{
                 message.error("Something Went Wrong");
              }
            } catch (error: any) {
              dispatch(setLoaderAction(false));
              message.error("Something Went Wrong");
            }
          },
          onCancel() {
            // console.log('Cancel');
          },
        });
  };
  
 

  const columns: any = [
    {
      title: 'Leave Code',
      dataIndex: 'head_leave_code',
      key: 'head_leave_code',
      width: 80,
    },
    {
      title: 'Leave Name',
      dataIndex: 'head_leave_name',
      key: 'head_leave_name',
      fixed: "left",
      width: 160,
    
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Leave Short Name',
      dataIndex: 'head_leave_short_name',
      key: 'head_leave_short_name',
      width: 80,

    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text: any, record: any) => {
        return record?.status ? <Tag color="green" >Active</Tag> : <Tag color="red" >Inactive</Tag>;
      },
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to={`/config/add-leave?leaveId=${record?.head_leave_id}`}><EditOutlined /></Link>;
      },
    },
    {
      title: 'Active/Inactive',
      dataIndex: 'action',
      key: 'action',
      width: 40,
      render: (text: any, record: any) => {
        return <CodepenOutlined onClick={()=>showConfirm(record?.head_leave_id, record?.head_leave_name, record?.status)} style={{color:"purple", fontSize:"18px"}}/>
      },
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to="#" onClick={() => toggleHandler(record?.head_leave_id, record?.head_leave_name)} style={{ color: "red" }}><DeleteOutlined /></Link>;
      },
    },
  ];
  // type Option = { label: string; value: string };

const startYear = 1990;
const currentYear = new Date().getFullYear(); // Get the current year dynamically

const options: Option[] = Array.from(
  { length: currentYear - startYear + 1 }, // Add 2 to include the next financial year
  (_, i) => {
    const year1 = startYear + i;
    const year2 = year1 + 1;
    return { label: `${year1}-${year2}`, value: `${year1}` };
  }
).reverse();
const re = useNavigate()
// console.log(options);
const [yearVal, setYearVal] = useState<any>("")
const handleTimelineChange = (e:any) =>{
  console.log({e})
    //  if(Array.isArray(e)){
     setYearVal(e);
    // }
}
console.log(yearVal);

// const showConfirms =  (id:number, leaveName: string, status: boolean) => {
//   confirm({
//     title:"Select Financial Year",
//     icon: <QuestionCircleOutlined />,
//     content: <Cascader defaultValue={['Select Financial Year']} options={options} placeholder="Please select"
//       onChange={handleTimelineChange} 
//     // style={{width:"100%"}} 
//     />,
//     async onOk() {
//       await re(`/config/leave-view?year=${yearVal[0]}`)
//     },
//     onCancel() {
//       // console.log('Cancel');
//     },
//   });
// };
const showConfirms = (id: number, leaveName: string, status: boolean) => {
  let selectedYear: any = [];

  confirm({
    title: "Select Financial Year",
    icon: <QuestionCircleOutlined />,
    content: (
      <Cascader
        defaultValue={["Select Financial Year"]}
        options={options}
        placeholder="Please select"
        onChange={(value) => {
          console.log("Selected:", value);
          selectedYear = value; // Store the latest selected value
        }}
      />
    ),
    async onOk() {
      if (selectedYear.length > 0) {
        await re(`/config/leave-view?year=${selectedYear[0]}`);
      } else {
        // console.warn("No year selected!");
      }
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};
  
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Leave Head Master</h1>
      </header>
      <Link to="/config/add-leave">
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
              placeholder="Search Leave"
              onChange={searchStore}
              className="searchContainer"
              style={{ width: "80%", marginLeft: "30px" }}
            />
            <div className="brand" style={{ paddingTop: "10px" }}>
              {/* <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>FY Leave: </span> */}
              <Button className="fybtn" onClick={()=>showConfirms(1, "", false)}>+ {" "} {" "} Financial Year</Button>
             

            </div>
          </div>
          <div>
            <DeleteItem
              toggle={toggleDelete}
              name={leaveName}
              itemsId={leaveId}
              deleteService={deleteLeaveHeadService}
              closeModal={(e: any) => {
                setToggleDelete(e);
              }} />
            <Table className="content"
              columns={columns}
              dataSource={

                filteredData?.map((data: any) => ({
                  head_leave_name: data?.head_leave_name,
                  head_leave_short_name: data?.head_leave_short_name,
                  head_leave_code: data?.head_leave_code,
                  status: data?.status,
                  head_leave_id: data?.head_leave_id,
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
