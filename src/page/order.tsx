import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  PhoneFilled,
  PlusOutlined,
  SearchOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Button, Input, Select, Skeleton, message } from "antd";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setLoaderAction } from "redux-store/action/appActions";
import { AppDispatch } from "redux-store/store";
import { getAllOrdersListService, updateOrderTrackStatusService, createOrderService } from "services/orderService";
import { getStoreByIdService } from "services/storeService";
import { dateFormatter } from "utils/common";
import "../style/order.css";
import { DurationEnum, UserRole, VisitTypeEnum } from "enum/common";
import previousPage from "utils/previousPage";
import { IPagination } from "types/Common";
import { DEFAULT_PAGE_SIZE } from "app-constants";
import LoadMore from "component/LoadMore";
import { useSelector } from "redux-store/reducer";
import { useAuth } from "context/AuthContext";
import { OrderStatus, PaymentStatus, SpecialDiscountStatus } from "enum/order";
import RequestDiscount from "component/order/requestDiscount";
import { boolean } from "yup";
import { ICreateOrderReq } from "types/Order";
import { IVisitsData } from "types/Visits";
import { useNavigate, useParams } from "react-router-dom";
import { getValidationErrors } from "utils/errorEvaluation";
import { DiscountTypeEnum } from "enum/product";



export default function Order() {

  const [orderList, setOrderList] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  let [visitDetails, setVisitDetails] = useState<IVisitsData | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [isVisibility, setIsVisibility] = useState(false);
  let [selectedStore, setSelectedStore] = useState<any>();
  let [selectedVisitType, setSelectedVisitType] = useState<any>(null);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  // ... (previous imports remain the same)


  // ... (previous state and hooks remain the same)

  const handleReorder = useCallback(async (orderId: number) => {
    try {
      dispatch(setLoaderAction(true));
      // Get the order details you want to reorder
      const orderToReorder = orderList.find(order => order.orderId === orderId);

      if (!orderToReorder) {
        message.error("Order not found");
        return;
      }

      // Create a new order with the same products

      const requestBody: ICreateOrderReq = {
        orderAmount: Number(orderToReorder.orderAmount),
        orderDate: new Date().toISOString(),
        products: orderToReorder.products.map((product: any) => ({
          categoryId: product.categoryId,
          brandId: product.brandId,                                                                                  
          productId: product.productId,                           
          productName: product.productName,                                  
          mrp: product.mrp,
          rlp: product.rlp,
          noOfCase: product.noOfCase,
          noOfPiece: product.noOfPiece,
          skuDiscount: product.skuDiscount,
          isFocused: product.isFocused,
          caseQty: product.caseQty,
        })),
        visitId: orderToReorder.visitId,
        storeId: orderToReorder.storeId,
        isCallType: orderToReorder.isCallType,
        orderStatus: OrderStatus.ORDERSAVED,
        netAmount: Number(orderToReorder.netAmount),
        isVisibility: Boolean(orderToReorder.isVisibility)
      };

      const res = await createOrderService(requestBody);
      if (res.data.status === 200) {
        message.success("Order recreated successfully");
        dispatch(setLoaderAction(false));
        navigate(`/order/checkout/${orderToReorder.storeId}/${orderToReorder.visitId}/${res.data.data.orderId}`);
      } else {
        dispatch(setLoaderAction(false));
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
      message.error(getValidationErrors(error));
    }
  }, [dispatch, navigate, orderList]);



  const { authState } = useAuth();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [cloneOrderList, setCloneOrderList] = useState<any[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const orderType: string | null = searchParams.get("orderType");
  const duration: string | null = searchParams.get("duration");

  const [filter, setFilter] = useState({
    duration: duration ? DurationEnum.TODAY : "",
    isCallType: orderType ? orderType : "",
  });

  const isLoading = useSelector((state) => state.app.isLoading);

  useEffect(() => {
    getOrderList(filter);
  }, []);

  const getOrderList = async (filter?: any) => {
    try {
      dispatch(setLoaderAction(true));
      const pagination: IPagination = {
        pageNumber: pageNumber,
        pageSize: DEFAULT_PAGE_SIZE,
      };
      const response = await getAllOrdersListService(filter, pagination);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        const { orders, pagination } = response.data.data;
        // if(orders?.length === 0){
        //   setOrderList([{}]);
        // }else{
        setOrderList(orders);
        // }
        setCloneOrderList(orders);
        setTotalRecords(pagination.totalRecords);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
  const [orderStatus, setOrderStatus] = useState<any>();
  const [orderId, setOrderId] = useState<number>();
  const [changeStatus, setChangeStatus] = useState<boolean>(false);
  const handleOrderStatus = (value: string, orderId: number) => {
    setOrderStatus(value);
    setChangeStatus(!changeStatus);
    setOrderId(orderId);
  };

  useEffect(() => {
    onSubmit();
  }, [orderStatus, changeStatus, orderId]);

  const onSubmit = async () => {
    if (orderId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateOrderTrackStatusService({
          orderStatus,
          orderId: Number(orderId),
        });
        dispatch(setLoaderAction(false));
        if (response.data.status === 200) {
          message.success("Updated Successfully");
          getOrderList();
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }
  };
  
  const handleChange = (value: any) => {
    setFilter((prev) => {
      const newFilters = {
        ...prev,
        duration: value,
      };
      getOrderList(newFilters);
      return newFilters;
    });
  };

  const handleOrderStatusChange = (value: any) => {
    // let data = cloneOrderList
    // let FS:any = cloneOrderList ?? []
    // if(e !== "all"){
    //    FS = cloneOrderList.filter((item: any) =>{
    //   return(
    //     item?.orderStatus.includes(e)
    //   )
    // })}
    //  setOrderList(FS);
    setFilter((prev) => {
      const newFilters = {
        ...prev,
        orderStatus: value,
      };
      getOrderList(newFilters);
      return newFilters;
    });
  };
  const searchStore = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    const searchTerm = value.toLowerCase();
    const FS = cloneOrderList.filter((item: any) => {
      return (
        (item.orderId && (item?.orderId).toString().includes(value)) ||
        (item.store && item?.store?.storeName?.toLowerCase().includes(searchTerm)) ||
        (item.store?.storeCat && item?.store?.storeCat?.categoryName.toLowerCase().includes(searchTerm))
      )
    }
      // (item?.orderId).toString().includes(value)
    );
    setOrderList(FS);
  };




  const handleLoadMore = useCallback(async () => {
    try {
      dispatch(setLoaderAction(true));
      const newPageNumber = pageNumber + 1;
      const pagination: IPagination = {
        pageNumber: newPageNumber,
        pageSize: DEFAULT_PAGE_SIZE,
      };
      const response = await getAllOrdersListService(filter, pagination);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        const { orders, pagination } = response.data.data;
        const newOrder = [...orderList, ...orders];
        setOrderList(newOrder);
        setCloneOrderList(newOrder);
        setTotalRecords(pagination.totalRecords);
        setPageNumber(newPageNumber);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  }, [dispatch, filter, orderList, pageNumber]);
  const formatStatus = (status: any) => {
    return status
      .toLowerCase()
      .split("_")
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const [toggleDelete, setToggleDelete] = useState(false);
  const [specialDiscountStatus, setSpecialDiscountStatus] = useState<any>();
  const [orderDiscountId, setOrderDiscountId] = useState<any>();
  const [previousDiscount, setPreviousDiscount] = useState<any>();

  const toggleHandler = (
    orderId: number,
    specialDiscountStatus: SpecialDiscountStatus,
    previousDiscounts: number
  ) => {
    setToggleDelete(true);
    setOrderDiscountId(orderId);
    setSpecialDiscountStatus(specialDiscountStatus)
    setPreviousDiscount(previousDiscounts)
  }
  let skeleton: any = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

  return (
    <div>
      <RequestDiscount
        toggle={toggleDelete}
        orderId={orderDiscountId}
        specialDiscountStatus={specialDiscountStatus}
        previousDiscount={previousDiscount}
        closeModal={(e: any) => {
          setToggleDelete(e);
        }} />
      {authState?.user?.role !== UserRole.CHANNEL &&
        <Link to="./order-list">
          <div className="addIcon">
            <PlusOutlined className="plusIcon" />
          </div>
        </Link>}
      <div className="store-v1">
        <header
          className="heading heading-container"
          style={{ backgroundColor: "#070D79" }}
        >
          <ArrowLeftOutlined onClick={previousPage} className="back-button" />
          <h1 className="page-title pr-18">Order</h1>
        </header>
        <main>
          <div className="search">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Order by Id, Store Name, Store Category"
              onChange={searchStore}
            />
            <Select
              // defaultValue="all"
              className="selectFiltBtn"
              // value={filter.duration}
              onChange={handleOrderStatusChange}
              placeholder="Filter by Order Status"
              options={[
                { label: "All", value: "all" },
                { label: "Order Placed", value: "ORDER_PLACED" },
                { label: "Shipped", value: "SHIPPED" },
                { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
                { label: "Delivered", value: "DELIVERED" },
                { label: "Cancelled", value: "CANCELLED" },
              ]}
            />
            <Select
              // defaultValue="all"
              className="selectFiltBtn"
              // value={filter.duration}
              placeholder="Filter by Time Period"
              options={[
                { label: "All", value: DurationEnum.ALL },
                { label: "Today", value: DurationEnum.TODAY },
                { label: "Week", value: DurationEnum.WEEK },
              ]}
              onChange={handleChange}
            />
          </div>
          <div
            className="content"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "24px",
              marginBottom: "10px",
            }}
          >
            {
              orderList && orderList?.length > 0 && orderList.map((data: any, index: any) => {
                const { isCallType, orderId, store, orderDate, storeId, products, orderStatus, specialDiscountValue, specialDiscountStatus, specialDiscountComment, paymentStatus } = data;
                console.log(store, "========store=====");
                return (
                  <div className="store-list" key={`order-${orderId}`}>
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
                          {authState?.user?.role === UserRole.RETAILER && orderStatus !== OrderStatus.CANCELLED && <div className="flexSpace fs-13 pt-4">
                            <span>Payment Status: <span className="fontb" style={{ color: paymentStatus === PaymentStatus.PENDING ? "red" : "green" }}>{paymentStatus}</span></span>
                          </div>}
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
                            {authState?.user?.role === UserRole.SSM || authState?.user?.role === UserRole.RETAILER || authState?.user?.role === UserRole.CHANNEL || orderStatus === OrderStatus.CANCELLED || orderStatus === OrderStatus.ORDERSAVED || orderStatus === OrderStatus.DELIVERED
                              ?
                              <span style={{ color: "green" }}>
                                {orderStatus === OrderStatus.CANCELLED ? <span style={{ color: "red" }}>{formatStatus(orderStatus)}</span> : orderStatus === OrderStatus.DELIVERED ? <span style={{ color: "green" }}>{formatStatus(orderStatus)}</span> : orderStatus === OrderStatus.ORDERSAVED ? <span style={{ color: "#bf7b04" }}>{formatStatus(orderStatus)}</span> : <span style={{ color: "green" }}>{formatStatus(orderStatus)}</span>}</span>
                              :
                              <Select
                                defaultValue="Order Placed"
                                className="orderSta"
                                style={{ height: "26px", width: "130px" }}
                                value={orderStatus}
                                options={[
                                  { label: 'Order Placed', value: "ORDER_PLACED" },
                                  { label: 'Shipped', value: "SHIPPED" },
                                  { label: 'Out For Delivery', value: "OUT_FOR_DELIVERY" },
                                  { label: 'Delivered', value: "DELIVERED" },
                                  { label: 'Cancelled', value: "CANCELLED" },
                                ]}
                                onChange={(e) => { handleOrderStatus(e, orderId) }}
                              />}
                          </span>
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <Link
                          to={`/order/order-summary/${orderId}`}
                          className="linktoB">
                          <div className="active-focused">
                            <div>
                              {products?.some((i: any) => i.isFocused) ?
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
                        <div>
                          {/* <Button style={{ background: "#e3a66d", fontWeight: "bold", color:"black", marginLeft:"6px" }} type="primary" >Reorder</Button> */}
                          <Button
                            style={{ background: "#e3a66d", fontWeight: "bold", color: "black", marginLeft: "6px" }}
                            type="primary"
                            onClick={() => handleReorder(orderId)}


                          >
                            Reorder
                          </Button>

                        </div>
                        <Link
                          to={`/order/order-summary/${orderId}`}
                          className="linktoB">
                          {/* {isCallType &&  */}
                          {isCallType === VisitTypeEnum.TELEVISIT &&
                            <div className="active-focused" style={{ fontSize: "11px" }}>
                              <div>
                                <PhoneFilled style={{ fontSize: "14px" }} />
                              </div>
                              <div>Phone </div>
                              <div>Order</div>
                            </div>}
                          {isCallType === VisitTypeEnum.RETAILER_ORDER &&
                            <div className="active-focused" style={{ fontSize: "11px" }}>
                              <div>
                                <ShopOutlined style={{ fontSize: "18px" }} />
                              </div>
                              <div>Retailor</div>
                              <div>Order</div>
                            </div>}
                          {isCallType === VisitTypeEnum.PHYSICAL &&
                            <div className="active-focused" style={{ fontSize: "11px" }}>
                              <div>
                                <img src="https://mrapp.saleofast.com/images/visit.jpg" alt="visitorder" width="20" height="26" />
                              </div>
                              <div>Vist Order</div>
                            </div>
                          }
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
              // :
              // skeleton?.map((item:any, index:any) => {
              //   return (
              //     <div key={index}>
              //         <div className="store-list">
              //         <Skeleton active />
              //         </div>
              //     </div>
              //   );
              // })
            }
          </div>
          {
            totalRecords > 0 && orderList.length < totalRecords &&
            <LoadMore isLoading={isLoading} onClick={handleLoadMore} />
          }
        </main>
      </div>
      <style>
        {`
        .orderSta .ant-select-selection-item{
        font-size: 12px;
        }
        `}
      </style>
    </div>
  );
};