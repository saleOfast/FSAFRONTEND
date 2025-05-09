import { ArrowLeftOutlined, CheckCircleFilled, CloseCircleFilled, CrownOutlined, MailOutlined, PhoneOutlined, UserOutlined, } from "@ant-design/icons";
import "../../style/stores.css";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../common/footer";
import { getStoreByIdService, getStorePastOrderService } from "../../services/storeService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux-store/store";
import { setLoaderAction } from "redux-store/action/appActions";
import { dateFormatterNew, openGoogleMap } from "utils/common";
import previousPage from "utils/previousPage";

export default function StoreDetails() {

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const storeId: any = searchParams.get('store_id');

  const [storeDetails, setStoreDetails] = useState<any>([]);
  const [pastOrdersList, setPastOrdersList] = useState<any[]>([]);

  useEffect(() => {
    if (storeId) {
      handleStoreDetails();
      getPastOrderList();
    }
  }, [storeId]);

  const handleStoreDetails = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getStoreByIdService(storeId);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        setStoreDetails(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  const getPastOrderList = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getStorePastOrderService(storeId);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        setPastOrdersList(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{storeDetails?.storeName ? storeDetails?.storeName : ''}</h1>
      </header>
      <div>
      {
        storeDetails?.storeName && (
          <main style={{display:"flex", justifyContent: "center", width:"100%"}}>
            <div className="storeDetails">
              <div className="shoptitle">
                <div>
                  <div className="storeName">
                    {storeDetails?.storeName ? storeDetails?.storeName : ''}
                  </div>
                  <div className='storeIdText'>
                    {storeDetails?.storeCat?.categoryName} | store ID: {storeDetails?.storeId}
                  </div>
                  {/* <span
                    className="flexSpace beatIdText"
                  >
                    <span>#Beat - {storeDetails?.beat}</span>
                  </span> */}
                </div>
                {
                  storeDetails?.isPremiumStore && (
                    <div className="premiumtag">
                      <div className="bli">
                        <CrownOutlined className="crownIcon" />
                      </div>
                      <span className="premiumText">Premium</span>
                    </div>
                  )
                }
              </div>

              <div className="shopaddress">
                <div className='storeAddText' style={{fontWeight:"bold"}}>
                  Store Address
                </div>
                <div className={storeDetails?.isActive ? "activeStore" : "inActiveStore"}>
                  <span
                    className={storeDetails?.isActive ? "blinker" : "blinker-inActiveStore"}
                  ></span>
                  <span>{storeDetails?.isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
              <span className="storeIdText"></span>
              <div
                className="flexSpace StoreAdd1"
              >
                <span className='addressLine' style={{fontWeight:"normal"}}>
                  {storeDetails?.addressLine1}, {storeDetails?.addressLine2},<br />
                  {storeDetails?.townCity}, {storeDetails?.state},<br />
                  Pin Code - {storeDetails?.pinCode}
                </span>

                <div className="operthours">
                  <span className="operText" style={{fontWeight:"bold"}}>Operating Hours</span>
                  <span
                    className="operTime" style={{fontWeight:"normal"}}
                  >
                    {storeDetails?.openingTime + " " + (storeDetails?.openingTimeAmPm??"")} to {storeDetails?.closingTime + " " + (storeDetails?.closingTimeAmPm??"")}
                  </span>
                </div>
              </div>
              {/* <div className="shopaddress">
                <div className="contDetails">
                  Contact Details
                </div>
              </div>
              <span className="userText" style={{fontWeight:"normal"}}>
                <UserOutlined className="contIcon" />{storeDetails?.ownerName}
              </span>
              <div
                className="flexSpace contText "  style={{fontWeight:"normal"}}
              >
                <span> <PhoneOutlined className="contIcon" />{storeDetails?.mobileNumber}</span>
              </div> */}
              <div className='' style={{fontWeight:"bold", marginTop:"16px"}}>
                  Payment Mode: <span style={{fontWeight:"normal"}}>{storeDetails?.paymentMode ? storeDetails?.paymentMode?.toLowerCase() == "cod" ? "COD" :  `${storeDetails?.paymentMode} Days` : "NA"}</span>
                </div>
              <div className="ownerDetails">
              <div><div className="shopaddress">
                <div className="contDetails" style={{fontWeight:"bold"}}>
                  Owner Details
                </div>
              </div>
              <span className="userText" style={{fontWeight:"normal"}}>
                <UserOutlined className="contIcon" />{storeDetails?.ownerName}
              </span>
              <div
                className="flexSpace contText "  style={{fontWeight:"normal"}}
              >
                <span> <PhoneOutlined className="contIcon" />{storeDetails?.mobileNumber}</span>
              </div>
              <div className="flexSpace contText" style={{fontWeight:"normal"}}>
                <span><MailOutlined className="contIcon" />{storeDetails?.email}</span>
              </div>
              </div>
              <div><div className="shopaddress">
                <div className="contDetails" style={{fontWeight:"bold"}}>
                  Sales Person Details
                </div>
              </div>
              <span className="userText" style={{fontWeight:"normal"}}>
                <UserOutlined className="contIcon" />{storeDetails?.user?.firstname} {storeDetails?.user?.lastname}
              </span>
              <div
                className="flexSpace contText "  style={{fontWeight:"normal"}}
              >
                <span> <PhoneOutlined className="contIcon" />{storeDetails?.user?.phone}</span>
              </div>
              <div className="flexSpace contText" style={{fontWeight:"normal"}}>
                <span><MailOutlined className="contIcon" />{storeDetails?.user?.email}</span>
              </div>
              </div>
              <div><div className="shopaddress">
                <div className="contDetails" style={{fontWeight:"bold"}}>
                  Store's Geo-location
                </div>
              </div>
              <img src="https://sfa.saleofast.com/images/map.png" width={110} height={60} style={{cursor:"pointer"}} onClick={()=>openGoogleMap(storeDetails?.lat,storeDetails?.long)}/>
              </div>
              </div>
              {/* <div className="flexSpace">
                <span><MailOutlined className="contIcon" />{storeDetails?.email}</span>
              </div> */}

              <div className="shoptitle">
                <div className="shopTxtSpace"></div>
              </div>
              <div className="" style={{paddingTop:"20px"}}></div>
              <div>
                <div className="shoptitle">
                  <div className="fw-bold">
                    Past Orders
                  </div>
                  <div className="activetag">
                    <Link to={`/order/past-orders?store_id=${storeDetails?.storeId}`}>
                      <span className="viewAllLink">
                        View All
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              {
                (pastOrdersList && pastOrdersList.length > 0) && pastOrdersList.map((item: any, ind: number) => {
                  return (
                    <Link to={`/order/order-summary/${item?.orderId}`} className='linkDefault'>
                      <div
                        key={ind}
                        className="pastorderListing">
                        <div>
                          {" "}
                          <span className='orderIdText'>
                            Order ID:  {item?.orderId}
                          </span>
                          <div
                            className="flexSpace orderDate"
                          >
                            <span>Order date: {dateFormatterNew(item?.orderDate)}</span>
                          </div>
                          <div
                            className="flexSpace orderDate"
                          >
                            <span>Total Pending Amount: <span style={{ fontWeight: "bold" }}>{Number(item?.netAmount) - Number(item?.collectedAmount)}</span></span>
                          </div>
                        </div>
                        <div className='focusedInd'>
                          <span>
                            {item.products.some((i: any) => i.isFocused) ?
                              <CheckCircleFilled
                                className='checkIcon'
                              />
                              :
                              <CloseCircleFilled
                                className='closeIcon'
                              />
                            }
                          </span>
                          <div className='focusedText'>Focused</div>
                          <div className='focusedText'>Items</div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              }
            </div>
          </main>
        )
      }
      </div>
      <Footer />

    </div>
  );
}
