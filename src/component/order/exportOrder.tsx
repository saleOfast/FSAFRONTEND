import * as XLSX from 'xlsx';
import { Button, Select } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, ExportOutlined, PhoneFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dateFormatter } from 'utils/common';
import { SpecialDiscountStatus } from 'enum/order';
import { useAuth } from 'context/AuthContext';
import { VisitTypeEnum } from 'enum/common';
import { setLoaderAction } from 'redux-store/action/appActions';
import { dispatch } from 'd3';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { IPagination } from 'types/Common';
import { DEFAULT_PAGE_SIZE } from 'app-constants';
import { getAllOrdersListService } from 'services/orderService';

interface ExportOrderDataProps {
  orderList: any[]; // Adjust the type based on your order data structure
  isModalOpen: boolean;
  handleExportOk: () => void;
  handleExportCancel: () => void;
}

const ExportOrderData: React.FC<ExportOrderDataProps> = ({ isModalOpen, handleExportOk,handleExportCancel }) => {
    const { authState } = useAuth();
    const [toggleDelete, setToggleDelete] = useState(false);
  const [specialDiscountStatus, setSpecialDiscountStatus] = useState<any>();
  const [orderDiscountId, setOrderDiscountId] = useState<any>();
  const [previousDiscount, setPreviousDiscount] = useState<any>();
  const dispatch = useDispatch<AppDispatch>();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
 // const [orderList, setOrderList] = useState<any[]>([]);
  const [cloneOrderList, setCloneOrderList] = useState<any[]>([]);
  
  useEffect(() => {
    getOrderList();
  }, []);
  const getOrderList = async (filter?: any) => {
    try {
      dispatch(setLoaderAction(true));
      const pagination: IPagination = {
        pageNumber: pageNumber,
        pageSize: DEFAULT_PAGE_SIZE
      }
      
      const response = await getAllOrdersListService(filter, pagination);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        const { orders, pagination } = response.data.data;
        setOrderList(orders);
        setCloneOrderList(orders);
        setTotalRecords(pagination.totalRecords);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
    const toggleHandler = (orderId: number, specialDiscountStatus: SpecialDiscountStatus, previousDiscounts: number) => {
        setToggleDelete(true);
        setOrderDiscountId(orderId);
        setSpecialDiscountStatus(specialDiscountStatus)
        setPreviousDiscount(previousDiscounts)
      }
      const formatStatus = (status: any) => {
        return status
          .toLowerCase()
          .split('_')
          .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };
      const [orderList, setOrderList] = useState<any[]>([]);
    const exportOrder = () => {
    if (!orderList || orderList.length === 0) {
      return;
    }

    const ws = XLSX.utils.json_to_sheet(orderList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders.xlsx');
  };
  const [orderStatus, setOrderStatus] = useState<any>();
  const [orderId, setOrderId] = useState<number>();
  const [changeStatus, setChangeStatus] = useState<boolean>(false)
  const handleOrderStatus = (value: string, orderId: number) => {
    setOrderStatus(value);
    setChangeStatus(!changeStatus)
    setOrderId(orderId)
  };
  return (
    <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px", marginBottom: "10px" }}>
    {
      orderList && orderList.length > 0 && orderList.map((data: any, index: any) => {
        const {isCallType, orderId, store, orderDate, storeId, products, orderStatus, specialDiscountValue, specialDiscountStatus, specialDiscountComment } = data
        return (
          <>
            <div className="store-list">
              <div className="order-content" key={index}>
                <div>
                  <Link
                    to={`/order/order-summary/${orderId}`}
                    className="linktoB">
                    <div className="orderIdTxt">
                      Order ID: {orderId}
                    </div>
                    <span className="fs-13">
                      <span>Store Name: <span className="fontb">{store?.storeName}</span></span>
                    </span>
                    <div className="flexSpace fs-13 pt-4">
                      {" "}
                      {store?.storeCat?.categoryName} | store ID: {storeId}
                    </div>
                    <div className="flexSpace fs-13 pt-4">
                      <span>Order Date: <span className="fontb">{dateFormatter(orderDate, "dd-MMM-yyyy")}</span></span>
                    </div>
                    {specialDiscountValue && Number(specialDiscountValue) > 0 &&
                      <div className="flexSpace fs-13 pt-4">
                        <span>Special Discount: <span className="fontb">{Number(specialDiscountValue)}%</span></span>
                      </div>}
                    {specialDiscountValue && Number(specialDiscountValue) > 0 &&
                      <div className="flexSpace fs-13 pt-4">
                        <span>Special Discount Status: <span className="fontb" style={{ color: specialDiscountStatus === SpecialDiscountStatus.APPROVED ? "green" : specialDiscountStatus === SpecialDiscountStatus.REJECTED ? "red" : "orange" }}>{specialDiscountStatus ?? "PENDING"}</span></span>
                      </div>}
                    {specialDiscountComment &&
                      <div className="flexSpace fs-13 pt-4">
                        <span>Rejected Comment: <span className="fontb">{specialDiscountComment}</span></span>
                      </div>}
                  </Link>
                  {specialDiscountStatus === SpecialDiscountStatus.REJECTED &&
                    <div className="flexSpace fs-13 pt-4">
                      <span>Raise New Request: <span className="fontb">
                        <Button
                          onClick={(e) => toggleHandler(orderId, SpecialDiscountStatus.REJECTED, Number(specialDiscountValue))}
                          style={{ background: "lightgrey", fontWeight: "bold" }}
                        >
                          Raise
                        </Button></span></span>
                    </div>}
                  <div className="flexSpace fs-13 pt-4">
                    <span>Order Status: <span className="fontb">
                      {authState?.user?.role === "SSM"
                        ?
                        <span style={{ color: "green" }}>{formatStatus(orderStatus)}</span>
                        :
                        <Select
                          defaultValue="Order Placed"
                          className="orderSta"
                          style={{ height: "26px", width:"130px" }}
                          value={orderStatus}
                          options={[
                            { label: 'Order Placed', value: "ORDER_PLACED" },
                            { label: 'Shipped', value: "SHIPPED" },
                            { label: 'Out For Delivery', value: "OUT_FOR_DELIVERY" },
                            { label: 'Delivered', value: "DELIVERED" },
                          ]}
                          onChange={(e) => { handleOrderStatus(e, orderId) }}
                        />}
                    </span>
                    </span>
                  </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
                <Link
                  to={`/order/order-summary/${orderId}`}
                  className="linktoB">
                  <div className="active-focused">
                    <div>
                      {products.some((i: any) => i.isFocused) ?
                        <CheckCircleFilled
                          className='checkIcon'
                        />
                        :
                        <CloseCircleFilled
                          className='closeIcon'
                        />
                      }
                    </div>
                    <div>Focused</div>
                    <div>Items</div>
                  </div>
                  </Link>

                  <Link
                  to={`/order/order-summary/${orderId}`}
                  className="linktoB">
                 {isCallType && isCallType === VisitTypeEnum.TELEVISIT ? 
                 <div className="active-focused" style={{fontSize: "11px"}}>
                    <div>
                    <PhoneFilled style={{fontSize: "14px"}}/>
                    </div>
                    <div>Phone </div>
                    <div>Order</div>
                  </div>
                  :
                  <div className="active-focused" style={{fontSize: "11px"}}>
                    <div>
                    <img src="https://sfa.saleofast.com/images/visit.jpg" alt="visitorder" width="20" height="26"/>
                    </div>
                    <div>Vist Order</div>
                    {/* <div>Order</div> */}
                  </div>
                  }
                  </Link>
                  </div>
              </div>
            </div>

          </>
        );
      })
    }
  </div>
  );
};

export default ExportOrderData;
