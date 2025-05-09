import React, { useEffect, useState } from "react";
import "../../../style/newStores.css";
import { Link } from "react-router-dom";
import { dateFormatter } from "utils/common";
import { useSelector } from "../../../redux-store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux-store/store";
import { getStoreActions } from "../../../redux-store/action/storeActions";
import { StoreBillingEnum } from "enum/store";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getAllPendingApprovalOrderService } from "services/orderService";
import { setLoaderAction } from "redux-store/action/appActions";
import Table, { ColumnsType } from "antd/es/table";
import { capitalizeSubstring } from "utils/capitalize";
import { Select, message } from "antd";
import { SpecialDiscountStatus } from "enum/order";
import { updateApprovalSpecialDiscountService } from "services/dashboardService";
import RejectedComment from "component/order/rejectedComment";


interface DataType {
  key: string;
  ssm: string;
  outlet: string;
  discount: string;
  action: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'SSM',
    dataIndex: 'ssm',
    key: 'ssm',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Outlet',
    dataIndex: 'outlet',
    key: 'outlet',
  },
  {
    title: 'Discount',
    dataIndex: 'discount',
    key: 'discount',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];
export default function PendingApprovalAll() {
  const [isLoading, setIsLoading] = useState(false);
  const [isApprovedStore, setIsApprovedStore] = useState<any>({})
  const [isApprovedRejected, setIsApprovedRejected] = useState<any>({})
  const [isRejectedUpdate, setIsRejectedUpdate] = useState<any>(false)
  const [toggleDelete, setToggleDelete] = useState(false);
  const [rejectedToggle, setRejectedToggle] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<any>();
  const [pendingApprovalList, setPendingApprovalList] = useState<any>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getAllPendingApproval() {
      try {
        dispatch(setLoaderAction(true));
          const res = await getAllPendingApprovalOrderService();
          if (res && res.data.status === 200) {
            setPendingApprovalList(res.data.data)
          }
          dispatch(setLoaderAction(false));
      } catch (error) {
        dispatch(setLoaderAction(false));
      }
    }
    getAllPendingApproval();
  }, [isApprovedStore?.orderId, isRejectedUpdate]);



  const onChangeHandler = (data: any) => {
    let parsedValue = JSON.parse(data);
    if (parsedValue.specialDiscountStatus === SpecialDiscountStatus.APPROVED) {
      setIsApprovedStore(parsedValue)
    } else if (parsedValue.specialDiscountStatus === SpecialDiscountStatus.REJECTED) {
      setToggleDelete(true);
      setOrderId(parsedValue?.orderId);
      setIsApprovedRejected(parsedValue);
    }
  }
  const callbackRejectedRequest = (e: any) => {
    setIsRejectedUpdate(e)
  }

  useEffect(() => {
    async function fetchDashboardData() {
      if (isApprovedStore.orderId && SpecialDiscountStatus.APPROVED === isApprovedStore?.specialDiscountStatus) {
        try {

          dispatch(setLoaderAction(true));
          const response = await updateApprovalSpecialDiscountService({ specialDiscountStatus: isApprovedStore?.specialDiscountStatus, orderId: Number(isApprovedStore?.orderId), specialDiscountComment: "" });
          dispatch(setLoaderAction(false));
          setIsLoading(true)
          if (response.data.status === 200) {
            message.success("Request Approved")
            setIsLoading(false)
          }
        } catch (error: any) {
          dispatch(setLoaderAction(false));
          message.error("Something Went Wrong");
        }
      }
    }
    fetchDashboardData();
  }, [isApprovedStore.orderId]);
  
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Pending Approval Orders</h1>
      </header>
      <RejectedComment
          isApprovedRejected={isApprovedRejected}
          toggle={toggleDelete}
          orderId={orderId}
          callbackRejectedRequest={callbackRejectedRequest}
          closeModal={(e: any) => {
            setToggleDelete(e);
          }} />
      <div style={{margin: "12px"}}>
      <Table
        columns={columns}
        dataSource={
          pendingApprovalList?.map((data: any, index: any) => ({
            key: data?.order_id,
            ssm: `${capitalizeSubstring(data?.firstname)} ${capitalizeSubstring(data?.lastname)}`,
            outlet: capitalizeSubstring(data?.store_name),
            discount: `${data?.specialdiscountvalue ?? "NA"}%`,
            // action: "NA"
            action: (
              <Select
                defaultValue="Pending"
                placeholder="Pending"
                value={capitalizeSubstring(data?.discount_status?.toLowerCase() ?? "Pending")}
                onChange={onChangeHandler}
                options={[
                  { label: 'Approved', value: JSON.stringify({ specialDiscountStatus: SpecialDiscountStatus.APPROVED, orderId: data?.order_id, specialdiscountvalue: data?.specialdiscountvalue }) },
                  { label: 'Rejected', value: JSON.stringify({ specialDiscountStatus: SpecialDiscountStatus.REJECTED, orderId: data?.order_id, specialdiscountvalue: data?.specialdiscountvalue }) },
                ]}
              />
            ),
          }))
        }
        size="small"
        pagination={false}
        // footer={() => 'View All'}
      />
      </div>
    </div>
  );                                                                                                                                                                                                                                                                                        
}
