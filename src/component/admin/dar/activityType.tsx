import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { ArrowLeftOutlined, CodepenOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux-store/store";
import previousPage from "utils/previousPage";
import { Input, message, Modal, Table, Tag } from "antd";
import DeleteItem from "../common/deleteItem";
import { capitalizeSubstring } from "utils/capitalize";
import { setLoaderAction } from "redux-store/action/appActions";
import { addActivityTypeService, deleteActivityTypeService, getActivityTypeService, updateActivityTypeService } from "services/usersSerivce";

export default function ActivityType() {
 

  const [activityTypeData, setActivityTypeData] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [filteredData, setFilteredData] = useState<any[]>([]);
  useEffect(() => {
    setFilteredData(activityTypeData);
  }, [activityTypeData])

  const searchStore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = activityTypeData.filter((item: any) =>
      (item?.activity_type_name?.toLowerCase())?.includes(value.toLowerCase())
    );
    setFilteredData(FS);
  };
  async function fetchData() {
    try {
      dispatch(setLoaderAction(true));
      setIsLoading(true);
      const res = await getActivityTypeService({});
      if (res?.data?.status === 200) {
        setActivityTypeData(res?.data?.data);
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


 
  const [toggleDelete, setToggleDelete] = useState(false);
  const [deleteName, setDeleteName] = useState('');
  const [deleteId, setdeleteID] = useState('');
  const toggleHandler = (id: string, name: string) => {
    setToggleDelete(true);
    setdeleteID(id);
    setDeleteName(name)
  }

  const columns: any = [
    {
      title: 'Activity Type Name',
      dataIndex: 'name',
      key: 'name',
      fixed: "left",
      width: 80,
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Activity Type Code',
      dataIndex: 'code',
      key: 'code',
      width: 160,
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
      title: 'Active/Inactive',
      dataIndex: 'action',
      key: 'action',
      width: 60,
      render: (text: any, record: any) => {
        return <CodepenOutlined onClick={()=>showConfirm(record?.activity_type_id, record?.name, "enableDisable", record?.status)} style={{color:"purple", fontSize:"18px"}}/>
      },
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      width: 40,

      render: (text: any, record: any) => {
        return <EditOutlined className="linkto" style={{color:"blue"}} onClick={()=>showConfirm(record?.activity_type_id, record?.name, "update", "")}/>;
      },
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to="#" onClick={() => toggleHandler(record?.activity_type_id, record?.name)} style={{ color: "red" }}><DeleteOutlined /></Link>;
      },
    },
  ];


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activityTypeName, setActivityTypeName] = useState("");
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"add" | "update"| "enableDisable">("add");
  const [statusVal, setStatusVal] = useState<boolean>(false);

  
  // Function to open modal and set state
  const showConfirm = (id: any, initialName: string, action: "add" | "update" | "enableDisable", status: any) => {
    setActivityTypeName(initialName);
    setCurrentId(id);
    setActionType(action);
    setIsModalVisible(true);
    setStatusVal(status);
  };

  // Function to handle OK click
  const handleOk = async () => {
    try {
      dispatch(setLoaderAction(true));
      let response;

      if (actionType === "add") {
        response = await addActivityTypeService({ activity_type_name: activityTypeName });
      } else if (actionType === "update" && currentId !== null) {
        response = await updateActivityTypeService({
          activity_type_name: activityTypeName,
          activity_type_id: currentId,
        });
      } else if (actionType === "enableDisable" && currentId !== null) {
        response = await updateActivityTypeService({
          activity_type_id: currentId,
          status: !statusVal
        });
      }
     
      dispatch(setLoaderAction(false));
      if (response?.data?.status === 200) {
        message.success(`${actionType === "add" ? "Added" : "Updated"} Successfully`);
        setIsModalVisible(false);
        setIsUpdate(!isUpdate)
      }else {
        message.error("Something Went Wrong");
      }
    } catch (error:any) {
      dispatch(setLoaderAction(false));
      if(error?.response?.data?.status == 409){
        message.error(error?.response?.data?.message);
      }else{
      message.error("Something Went Wrong");
    }
    }
  };
  return (
    <div>

      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Activity Type</h1>
      </header>

      <div className="addIcon" style={{cursor:"pointer"}}
      onClick={() => showConfirm(null, "", "add", "")}>
        <PlusOutlined
          className="plusIcon"
        />
      </div>
      <Modal
        title={
          actionType === "add" ? "Add Activity Type" : 
          actionType === "update" ? "Update Activity Type" : 
          actionType === "enableDisable" ?`Are you Sure Want to ${statusVal ? "Disable" : "Enable"}?` : ""}
        open={isModalVisible} // Controlled visibility
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
       { actionType !== "enableDisable" ? <Input
          placeholder="Please Enter Activity Type"
          value={activityTypeName} // Controlled input value
          onChange={(e) => setActivityTypeName(e.target.value)} // Update state properly
          style={{marginBottom:"20px"}}
        />:<div style={{marginBottom:"40px"}}>Activity Type : <span style={{fontWeight:"500"}}>{ activityTypeName}</span></div>}
      </Modal>
      <main>
        <div className="searchproduct">
          <div className="searchStoreType">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Activity Type"
              onChange={searchStore}
              className="searchContainer"
            />
          </div>
          <div>
            <DeleteItem
              toggle={toggleDelete}
              name={deleteName}
              itemsId={deleteId}
              deleteService={deleteActivityTypeService}
              closeModal={(e: any) => {
                setToggleDelete(e);
              }} />
            <Table className="content"
              columns={columns}
              dataSource={

                filteredData?.map((data: any) => ({
                  activity_type_id: data?.activity_type_id,
                  name: `${capitalizeSubstring(data?.activity_type_name)}`,
                  status: data?.status,
                  code: data?.activity_type_code,
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
