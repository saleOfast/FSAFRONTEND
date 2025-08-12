import {
  ArrowLeftOutlined,
  CameraOutlined,
  DownOutlined,
  FileDoneOutlined,
  MoneyCollectOutlined,
  StopOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import VisitCheckout from "./visitCheckout";
import VisitsTakPicture from "./VisitsTakPicture";
import { getOrderCountByVisitIdService, getPastNoOrderService, getVisitsByVisitIdService, visitsCheckInService } from "services/visitsService";
import { useDispatch } from "react-redux";
import { IVisitCheckInReq, IVisitParams, IVisitsData } from "types/Visits";
import { setLoaderAction } from "../../redux-store/action/appActions";
import { dateFormatter, dateFormatterNew } from "utils/common";
import { Button, Dropdown, MenuProps, message, Space, Tabs, TabsProps } from "antd";
import { VisitStatus } from "enum/visits";
import previousPage from "utils/previousPage";
import { useAuth } from "context/AuthContext";
import { GetFeatureService, UserRole } from "enum/common";
import RequestDiscount from "component/order/requestDiscount";
import useCoordinates from "hooks/useCoordinates";
import { getValidationErrors } from "utils/errorEvaluation";
import { getFeatureService } from "services/usersSerivce";
import PastOrdersDetails from "component/order/PastOrdersDetails";
import VisitPictures from "page/visits/visitPictures";
import NoOrderReasonOutlet from "component/admin/noOrderReason/noOrderReasonOutlet";

export default function VisitDetails() {
  const [showPicture, setShowPicture] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>();
  const [visitDetail, setVisitDetail] = useState<IVisitsData | null>(null);
  const [isTakenOrder, setIsTakenOrder] = useState<any>(true);
  // console.log({isTakenOrder})
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams<IVisitParams>()
  const [showCheckout, setShowCheckout] = useState(false);
  const pathname: any = location.pathname;
  const { authState } = useAuth();
  const getIsOrderList = useCallback(async () => {
    try {
      if (params?.visitId && params?.storeId) {
        dispatch(setLoaderAction(true))
        const res = await getOrderCountByVisitIdService(+params?.visitId, +params?.storeId);
        dispatch(setLoaderAction(false))
        setIsTakenOrder(res.data.data)
      }
    } catch (error) {
      dispatch(setLoaderAction(false))
    }
  }, [dispatch, params.visitId, params.storeId]);
  const getVisitDetails = useCallback(async () => {
    try {
      if (params.visitId) {
        dispatch(setLoaderAction(true))
        const res = await getVisitsByVisitIdService(+params.visitId);
        dispatch(setLoaderAction(false))
        setVisitDetail(res.data.data)
      }
    } catch (error) {
      dispatch(setLoaderAction(false))
    }
  }, [dispatch, params.visitId]);


  useEffect(() => {
    getVisitDetails();
    getIsOrderList();
    // getNoOrderReason();
  }, []);

  const getStoreAddress = useCallback(() => {
    let address = "";
    if (visitDetail?.storeDetails.addressLine1) {
      address += visitDetail.storeDetails.addressLine1;
    }
    if (visitDetail?.storeDetails.addressLine2) {
      address += ", " + visitDetail.storeDetails.addressLine2;
    }
    if (visitDetail?.storeDetails.state) {
      address += ", " + visitDetail.storeDetails.state;
    }
    return address;
  }, [visitDetail]);

  const includesInventoryOrPictures = ["/inventory", "/pictures", "/no-order-reason"].some(item => pathname.includes(item));
  const [toggle, setToggle] = useState(false);
  const [specialDiscount, setSpecialDiscount] = useState(0);
  const [visitId, setVisitId] = useState<any>();


  const toggleHandler = (orderId: number) => {
    setToggle(true);
    setVisitId(orderId);
  }


  const navigate = useNavigate();
  const coordinates = useCoordinates();

  const handleCancel = () => {
    setToggle(false);
  };
  // let handleCheckIn :any = (action:any)=>{return null};
  // if(authState?.user?.role === UserRole.SSM){
  //  handleCheckIn = useCallback(async (action:any) => {
  //   console.log(">>.", action)
  //   try {
  //     const reqBody: IVisitCheckInReq = {
  //       checkIn: new Date().toISOString(),
  //       visitId: Number(visitDetail?.visitId),
  //       action: action
  //     }
  //     if (coordinates?.coordinate?.latitude) {
  //       reqBody.checkInLat = coordinates.coordinate?.latitude.toString();
  //     }

  //     if (coordinates?.coordinate?.longitude) {
  //       reqBody.checkInLong = coordinates?.coordinate?.longitude.toString();
  //     }
  //     dispatch(setLoaderAction(true));
  //     await visitsCheckInService(reqBody);
  //     dispatch(setLoaderAction(false));
  //     // navigate({ pathname: `/visit-details/${visitDetail?.storeDetails.storeId}/${visitDetail?.visitId}` })
  //   } catch (error) {
  //     dispatch(setLoaderAction(false));
  //     message.warning(getValidationErrors(error))
  //   }
  // }, []);
  // }

  const handleCheckIn = useCallback(async (action: string) => {
    // if (authState?.user?.role === UserRole.SSM) {
      try {
        const reqBody: IVisitCheckInReq = {
          checkIn: new Date().toISOString(),
          visitId: Number(visitDetail?.visitId),
          action: action
        };

        if (coordinates?.coordinate?.latitude) {
          reqBody.checkInLat = coordinates.coordinate?.latitude.toString();
        }

        if (coordinates?.coordinate?.longitude) {
          reqBody.checkInLong = coordinates?.coordinate?.longitude.toString();
        }

        dispatch(setLoaderAction(true));
        await visitsCheckInService(reqBody);
        dispatch(setLoaderAction(false));
        // navigate({ pathname: `/visit-details/${visitDetail?.storeDetails.storeId}/${visitDetail?.visitId}` })
      } catch (error) {
        dispatch(setLoaderAction(false));
        message.warning(getValidationErrors(error));
      }
    // }
  }, [authState, coordinates, dispatch, getValidationErrors, setLoaderAction, visitsCheckInService, visitDetail?.visitId]);

  const pictureTakenRef = useRef(false);

  const handleTakePictureClick = () => {
    // Check if the picture has been taken before
    if (!pictureTakenRef.current) {
      pictureTakenRef.current = true; // Set the ref to true to prevent further calls
      setShowPicture(true);
      handleCheckIn("Take Picture");
    } else {
      pictureTakenRef.current = false; // Set the ref to true to prevent further calls
      setShowPicture(true);
    }
  };
  const items: MenuProps['items'] = [
    {
      label: <Link to={`/order/order-list/${visitDetail?.storeDetails.storeId}/${visitDetail?.visitId}`} className="linktoB" onClick={() => handleCheckIn("Take order by list")}>Order by list</Link>,
      key: '0',
    },
    {
      label: <Link to={`/order/form/${visitDetail?.storeDetails.storeId}/${visitDetail?.visitId}?isOrderForm=true`} className="linktoB" onClick={() => handleCheckIn("Take order by form")}>Order by form</Link>,
      key: '1',
    },
  ]

  interface Feature {
    name: keyof typeof GetFeatureService; // name should be a key of GetFeatureService
  }

  const onChange = (key: string) => {
    console.log(key);
  };
  
  const handleTabChange = (key: string) => {
    if (key === "3") {
      navigate("no-order-reason", { state: { visitDetail } });
    }
  };
  
  const itemsTab: TabsProps['items'] = [
    {
      key: '1',
      label: 'Orders',
      children: <PastOrdersDetails />,
    },
    {
      key: '2',
      label: 'Pictures',
      children: <VisitPictures />,
    },
    {
      key: '3',
      label: (
        <span
          // style={{
          //   fontWeight: pathname.includes("/no-order-reason") ? "bold" : "normal",
          //   cursor: "pointer",
          // }}
          onClick={() => handleTabChange("3")}
        >
          No Order Reason
        </span>
      ),
      children: <NoOrderReasonOutlet />,
    },
  ];
  
  return (
    <>
      <div>
        <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
          <ArrowLeftOutlined onClick={previousPage} className="back-button" />
          <h1 className="page-title pr-18">VISIT ID: {params.visitId}</h1>
        </header>
        <RequestDiscount
          toggle={toggle}
          requestText={"Reason for Cancel"}
          visitId={params?.visitId}
          closeModal={(e: any) => {
            setToggle(e);
          }} />
        <main className="deskVisitMg">
          {/* <VisitCheckout
            showCheckout={showCheckout}
            fileUrl={fileUrl ?? ""}
            setShowCheckout={setShowCheckout}
            visitId={params?.visitId ? +params.visitId : undefined}
            isVisitAndStoreId={isTakenOrder}
            visitDetails={visitDetail} /> */}

          <div className="inventoryDetails">
            <div className="shoptitle">
              <div>
                <div className="visitDName">
                  {visitDetail?.storeDetails.storeName}
                </div>
                <span className="visitfontcolor fs-13">
                  {visitDetail?.storeDetails?.storeCat?.categoryName} | <span className="linktoB">store ID: {visitDetail?.storeDetails.storeId}</span>
                </span>
                <div className="flexSpace visitfontcolor fs-13">
                  <span>{getStoreAddress()}</span>
                </div>
              </div>

              <div className="checkinCont">

                <div className="checkin">
                  <div className="visitText">Visit Date: <span className="tcolor">{visitDetail?.visitDate && dateFormatterNew(visitDetail?.visitDate)}</span></div>
                  {
                    visitDetail?.checkIn &&
                    <div className="visitText">Check-in:  <span className="tcolor">{dateFormatter(visitDetail?.checkIn, "hh:mm a")}</span></div>
                  }
                  {
                    visitDetail?.checkOut &&
                    <div className="visitText">Check-out:  <span className="tcolor">{dateFormatter(visitDetail?.checkOut, "hh:mm a")}</span></div>
                  }
                  {/* {
                    visitDetail?.visitStatus === VisitStatus.PENDING && authState?.user?.role === UserRole.SSM &&
                    <Button
                      type="primary"
                      onClick={() => {
                        setShowCheckout(true);
                      }}>
                      Check-Out
                    </Button>
                  } */}
                </div>
              </div>
            </div>
            <div className="takeData">
              <div className="inventUpdate" style={{ cursor: "pointer" }}
                onClick={handleTakePictureClick}>
                <div className="invenText">
                  <CameraOutlined className="fs-18" />
                  <div>Take</div>
                  <div>Picture</div>
                </div>
                {
                  showPicture &&
                  <VisitsTakPicture
                    show={showPicture}
                    setShow={setShowPicture}
                    setFileUrl={setFileUrl}
                    getVisitDetails={getVisitDetails} />
                }
              </div>
              <div className="inventUpdate" style={{ cursor: "pointer" }}>
                {/* <Link
                  to={`/order/order-list/${visitDetail?.storeDetails.storeId}/${visitDetail?.visitId}`}
                  className="linktoB"
                > */}
                <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    {/* <Space> */}
                    <div className="invenText">
                      <FileDoneOutlined className="fs-18" />
                      <div style={{ marginLeft: "20px" }}><span>Take</span>
                        <DownOutlined style={{ right: 0, marginLeft: "10px" }} />

                      </div>
                      <div>Order</div>
                    </div>
                    {/* </Space> */}
                  </a>
                </Dropdown>

                {/* </Link> */}
              </div>
              <div className="inventUpdate" onClick={() => handleCheckIn("Collect Payment")}>
                <Link
                  to={`/collection/${visitDetail?.storeDetails.storeId}`}
                  className="linktoB"
                >
                  <div className="invenText">
                    <MoneyCollectOutlined className="fs-18" />
                    <div>Collect</div>
                    <div>Payment</div>
                  </div>
                </Link>
              </div>
              {/* {authState?.user?.role === UserRole.RETAILER && */}
                {/* <div className="inventUpdate" onClick={() => handleCheckIn("Update inventory")}>
                  <Link
                    to={`/visit/inventory/${visitDetail?.storeDetails.storeId}`}
                    className="linktoB"
                  >
                    <div className="invenText">
                      <FileDoneOutlined className="fs-18" />
                      <div>Update</div>
                      <div>Inventory</div>
                    </div>
                  </Link>
                </div> */}
              {/* } */}
              {!isTakenOrder &&
                <div className="inventUpdate" style={{ cursor: "pointer" }}
                  onClick={() => { toggleHandler(Number(params?.visitId)); handleCheckIn("No Order") }}>
                  <div className="invenText">
                    <StopOutlined className="fs-18" />
                    <div>No</div>
                    <div>Order</div>
                  </div>
                  {
                    showPicture && toggle &&
                    <VisitsTakPicture
                      show={showPicture}
                      setShow={setShowPicture}
                      setFileUrl={setFileUrl}
                      getVisitDetails={getVisitDetails} />
                  }
                </div>}
            </div>

            {/* <Link to={`/order/order-list/${visitDetail?.storeDetails.storeId}/${visitDetail?.visitId}`} className="text-decoration-none">
            <div className="deskTakeFlex"> <div className="takeOrder takeOrderbtn ">
                <Button
                  type="primary"
                  size="middle"
                  className="deskTakeOrderBtn">
                  Take Order
                </Button>
              </div></div>
            </Link> */}

          </div>
          {/* <div className="mt-162">
            <span className="visitDTab"
              style={{
                textDecoration: includesInventoryOrPictures ? "none" : "underline",
                padding: includesInventoryOrPictures ? "none" : "4px",

              }}
            >
              <Link
                to=""
                style={{
                  fontWeight: includesInventoryOrPictures ? "normal" : "bold",
                }}
                className="linkto clr-brown">
                Orders
              </Link>
            </span>
            <span className="visitDOrder"
              style={{
                textDecoration: pathname.includes("/pictures") ? "underline" : "none",
                padding: pathname.includes("/pictures") ? "4px" : "none",
              }}>
              <Link
                to={{ pathname: "pictures" }}
                style={{
                  fontWeight: pathname.includes("/pictures") ? "bold" : "normal",
                }}
                state={{ storeId: visitDetail?.storeDetails.storeId }}
                className="linkto clr-brown">
                Pictures
              </Link>
            </span>
            <span className="visitDOrder"
              style={{
                textDecoration: pathname.includes("/no-order-reason") ? "underline" : "none",
                padding: pathname.includes("/no-order-reason") ? "4px" : "none",
                marginLeft: "10px"
              }}>
              <Link
                to={{ pathname: "no-order-reason" }}
                style={{
                  fontWeight: pathname.includes("/no-order-reason") ? "bold" : "normal",
                }}
                state={{ visitDetail }}
                // onClick={getNoOrderReason}
                className="linkto clr-brown">
                No Order Reason
              </Link>
            </span>
          </div> */}
          <div className="mt-162">
          <Tabs defaultActiveKey="1" items={itemsTab} style={{width:"100%"}} />
          </div>
          {/* <Outlet /> */}
        </main>
        <style>
          {`
          .ant-tabs-nav{
          width: auto!important;
          }
          `}
        </style>
      </div>
    </>
  );
}
