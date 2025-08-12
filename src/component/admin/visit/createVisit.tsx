import React, { useEffect, useState } from "react";
import "../../style/createBeat.css";
import Footer from "../../common/footer";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, message, Table, TableColumnsType, TableProps } from "antd";
import HookFormInputField from "component/HookFormInputField";
import { setLoaderAction } from "redux-store/action/appActions";
import { visitSchema } from "utils/formValidations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux-store/store";
import HookFormSelectField from "component/HookFormSelectField";
import { getUsersActions } from "redux-store/action/usersAction";
import { createVisitsService } from "services/visitsService";
import { getStoresByBeatIdService } from "services/usersSerivce";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";
import { useAuth } from "context/AuthContext";
import { UserRole } from "enum/common";
import { getStoreBeatService } from "services/storeService";
type FilterDetails = {
  storeType: string;
};

type Pagination = {
  pageNumber: number;
  pageSize: number;
}
export default function CreateVisit() {
  const filterDetails: FilterDetails = {
    storeType: "all",
    // isUnbilled: false,
  }

  const pagination: Pagination = {
    pageNumber: 1,
    pageSize: 100
  }
  const [selectedStores, setSelectedStores] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedBeat, setSelectedBeat] = useState();


  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();
  const checkedStore = (value: any) => {
    setSelectedStores(value)
  }
  const redirect = useNavigate();
  // const beatList = useSelector((state: any) => state?.store?.storeBeat);
  const usersSSMList = useSelector((state: any) => state?.users?.usersSSM?.filter((d:any)=>d.role === UserRole.SSM));
  let userSelfCreateVisit: any = null;
  let userData: any = usersSSMList ?? [];
  if (authState?.user?.role === UserRole.SSM) {
    userSelfCreateVisit = [{
      name: authState?.user?.name,
      emp_id: authState?.user?.id
    }]

    userData = userSelfCreateVisit
  }
  const dispatch = useDispatch<AppDispatch>();
  const [storeData, setStoreData] = useState<any[]>([]);
  const [beatList, setBeatList] = useState<any[]>([]);

  
  useEffect(() => {
    dispatch(getUsersActions());
  }, [])
  
  useEffect(() => {
    async function getStoresData() {
      try {
        if (selectedBeat) {
          setIsLoading(true);
          const res = await getStoresByBeatIdService(selectedBeat);
          setStoreData(res?.data?.data)
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getStoresData();
  }, [selectedBeat])

  useEffect(() => {
    async function getBeat() {
      try {
        // if (selectedBeat) {
          setIsLoading(true);
          const res = await getStoreBeatService({isVisit:true});
          setBeatList(res?.data?.data)
          setIsLoading(false);
        // }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getBeat();
  }, [])

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {
    control,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(visitSchema),
    defaultValues: {
      beat: "",
      visitDate: "",
      emp_id: "",
      store: []
    }
  })

  const onSubmit = async (values: any) => {
    const { beat, visitDate, emp_id } = values;
    try {
      dispatch(setLoaderAction(true));
      const response = await createVisitsService({
        store: selectedRowKeys, visitDate: visitDate, emp_id: Number(emp_id), beat: Number(beat),
        storeId: 7
      });
      dispatch(setLoaderAction(false));
      if (response) {
        message.success("Added Successfully")
        redirect(authState?.user?.role === "SSM" ? "/visit" : "/admin/visit")
      }
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      message.error("Something Went Wrong");
    }
  };



  type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

  interface DataType {
    key: React.Key;
    storeName: string;
    storeId: number;
  }
  
  const columns: TableColumnsType<DataType> = [
    { title: 'StoreName', dataIndex: 'storeName' },
    { title: 'storeId', dataIndex: 'storeId' },
    
  ];
  
  const dataSource = Array.from<DataType>(storeData).map<DataType>((data, i) => ({
    key: data?.storeId,
    storeName: data?.storeName,
    storeId: data?.storeId
  }));
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // const hasSelected = selectedRowKeys.length > 0;
  return (
    <div>
      <FullPageLoaderWithState isLoading={isLoading} />
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Create Visit</h1>
      </header>
      <main className="mb-60">
        <Form
          className="add-store-form createbeat"
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off">
          <HookFormSelectField
            control={control}
            type="text"
            name="beat"
            placeholder="Select Beat"
            label={"Select Beat"}
            showSearch
            allowClear
            optionData={
              beatList?.map((data: any) => ({
                label: data?.beatName,
                value: data?.beatId,
              }))
            }
            filterOption={(inputValue: any, option: any) => {
              return option.label.toLowerCase().includes(inputValue.toLowerCase())
            }}
            callback={setSelectedBeat}
            required
          />
          <HookFormInputField
            control={control}
            type="date"
            name="visitDate"
            placeholder=""
            label={"Select Date"}
            required
          />
          <HookFormSelectField
            control={control}
            type="text"
            name="emp_id"
            placeholder="Search"
            label={"Select Sales Executive"}
            showSearch
            allowClear
            optionData={
              (userData)?.map((data: any) => ({
                label: `${data?.name}`,
                value: data?.emp_id,
              }))
            }
            filterOption={(inputValue: any, option: any) => {
              return option.label.toLowerCase().includes(inputValue.toLowerCase())
            }}
            callback={setSelectedUser}
            required
          />
          {/* <HookFormCheckbox
            data={storeData}
            control={control}
            callback={checkedStore}
            type={"text"}
            name={"store"}
          /> */}
           <div className="table-btm">
            <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} scroll={{ y: 240 }} pagination={false} />
           </div> 
          <div className="take-orders-summary">
            <div
              className=" orders-btn">
              <Button onClick={() => redirect(-1)}>Cancel</Button>
              <button type="submit" className="btn-save">
                Save
              </button>
            </div>
          </div>
        </Form>
      </main>
      <Footer />
      <style>
        {`
        :where(.css-dev-only-do-not-override-af4yj3).ant-table-wrapper .ant-table-tbody .ant-table-row.ant-table-row-selected >.ant-table-cell{
        background: #efeff2;
        }
        .createbeat {
         height: 76vh;
        }
         .table-btm{
            margin-bottom:60px;
            }
            .take-orders-summary{
            bottom:60px;
         }
         @media only screen and (min-width: 30em) {
         .take-orders-summary{
            bottom:0px;
         }
            .table-btm{
            margin-bottom:0px;
            }
        }
        `}
      </style>
    </div>
  );
}
