import React, { Fragment, useEffect, useMemo, useState } from "react";
import "style/dashboard.css";
import { CaretDownFilled, CaretDownOutlined, CaretUpOutlined, PauseCircleFilled, UserOutlined } from "@ant-design/icons";
import GaugeChart from "react-gauge-chart";
import { capitalizeFirstLetter } from "utils/capitalize";
import PendingApprovalTable from "./pendingApprovalTable";
import UnbilledStoresTable from "./unbilledStoresTable";
import TopPerformersTable from "./topPerformers";
import WorstPerformersTable from "./worstPerformers";
import SkuTable from "./skuTable";
import { useAuth } from "context/AuthContext";
import { getAdminDashboardRevenueService, getAdminDashboardService, updateApprovalSpecialDiscountService } from "services/dashboardService";
import { setLoaderAction } from "redux-store/action/appActions";
import { useDispatch } from "react-redux";
import { Cascader, message, Progress, Row, Col, Button, Card } from "antd";
import RevenueChart from "./revenueChart";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";
import { SpecialDiscountStatus } from "enum/order";
import RejectedComment from "component/order/rejectedComment";
import { TimelineEnum, UserRole } from "enum/common";
import RupeeSymbol from "component/RupeeSymbol";
import { formattedAmount, getDashboardLabel } from "utils/common";
import Pending from "./LeastPending";
import LeastPending from "./LeastPending";
import MostPending from "./MostPending";
// import { LineChart } from '@mui/x-charts/LineChart';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

export const AdminDashboard = () => {
  const { authState } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState<any>({});

  const [revenueChartData, setRevenueChartData] = useState<any>({});
  const dispatch = useDispatch();
  const [isApprovedStore, setIsApprovedStore] = useState<any>({})
  const [isApprovedRejected, setIsApprovedRejected] = useState<any>({})
  const [isRejectedUpdate, setIsRejectedUpdate] = useState<any>(false)
  const [toggleDelete, setToggleDelete] = useState(false);
  const [rejectedToggle, setRejectedToggle] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<any>();

  const onChangeHandler = (data: any) => {
    let parsedValue = JSON.parse(data);
    if (parsedValue.specialDiscountStatus === SpecialDiscountStatus.APPROVED) {
      setIsApprovedStore(parsedValue)
    } else if (parsedValue.specialDiscountStatus === SpecialDiscountStatus.REJECTED) {
      setToggleDelete(true);
      setOrderId(parsedValue?.orderId);
      setIsApprovedRejected(parsedValue);
    }
  };

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
  const [timePeriod, setTimePeriod] = useState<any>([])

  // const onChange = (checked: boolean) => {
  //   setSwtichText(!switchText)
  // };
  const filterHandler: any = (value: any) => {
    setTimePeriod(value)
  };
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        dispatch(setLoaderAction(true));
        const res = await getAdminDashboardService(timePeriod);
        if (res?.data?.status === 200) {
          setDashboardData(res?.data?.data)
          setIsLoading(false)
        }
        setIsLoading(false)
        dispatch(setLoaderAction(false));
      } catch (error) {
        setIsLoading(false)
        dispatch(setLoaderAction(false));
      }
    }
    fetchDashboardData();
  }, [isApprovedStore?.orderId, isRejectedUpdate, timePeriod]);

  useEffect(() => {
    async function fetchDashboardRevenueChartData() {
      try {
        dispatch(setLoaderAction(true));
        const res = await getAdminDashboardRevenueService();
        if (res?.data?.status === 200) {
          setRevenueChartData(res?.data?.data)
        }
        dispatch(setLoaderAction(false));
      } catch (error) {
        dispatch(setLoaderAction(false));
      }
    }
    fetchDashboardRevenueChartData();
  }, []);

  const formattedSalesThisMonth = useMemo(() => {
    if (Number(dashboardData?.salesThisMonth?.totalOrderAmount)) {
      if (Number(dashboardData?.salesThisMonth?.totalOrderAmount) >= 1000) {
        return (Number(dashboardData?.salesThisMonth?.totalOrderAmount) / 1000).toFixed(1) + 'K';
      }
      return Number(dashboardData?.salesThisMonth?.totalOrderAmount).toString();
    }
    return 0;
  }, [Number(dashboardData?.salesThisMonth?.totalOrderAmount)]);


  const formattedCollectionThisMonth = useMemo(() => {
    if (Number(dashboardData?.newOrderThisMonth?.totalCollectedAmount)) {
      if (Number(dashboardData?.newOrderThisMonth?.totalCollectedAmount) >= 1000) {
        return (Number(dashboardData?.newOrderThisMonth?.totalCollectedAmount) / 1000).toFixed(1) + 'K';
      }
      return Number(dashboardData?.newOrderThisMonth?.totalCollectedAmount).toString();
    }
    return 0;
  }, [Number(dashboardData?.newOrderThisMonth?.totalCollectedAmount)]);
  const calculateGrowth = (current: any, previous: any) => {
    if (previous === 0 || previous === null || previous === undefined) return { percentage: false, trend: 'noChange' };
    const noChange = current - previous
    if (Number(noChange) === 0) return { percentage: "0%", trend: 'noChange' };
    const growth = ((current - previous) / previous) * 100;
    const trend = growth > 0 ? 'positive' : growth < 0 ? 'negative' : 'noChange';
    return { percentage: growth.toFixed(2) + '%', trend };
  };
  const salesGrowth = useMemo(() => {
    return calculateGrowth(
      Number(dashboardData?.sales?.currSales),
      Number(dashboardData?.sales?.preSales)
    );
  }, [Number(dashboardData?.sales?.currSales), Number(dashboardData?.sales?.preSales)]);
  const orderCountGrowth = useMemo(() => {
    return calculateGrowth(
      Number(dashboardData?.orderCount?.currOrderCount),
      Number(dashboardData?.orderCount?.preOrderCount)
    );
  }, [Number(dashboardData?.orderCount?.currOrderCount), Number(dashboardData?.orderCount?.preOrderCount)]);


  const collectionGrowth = useMemo(() => {
    return calculateGrowth(
      Number(dashboardData?.collection?.currCollection),
      Number(dashboardData?.collection?.preCollection)
    );
  }, [Number(dashboardData?.collection?.currCollection), Number(dashboardData?.collection?.preCollection)]);

  const storeCountGrowth = useMemo(() => {
    return calculateGrowth(
      Number(dashboardData?.storeCount?.currStoreCount),
      Number(dashboardData?.storeCount?.preStoreCount)
    );
  }, [Number(dashboardData?.storeCount?.currStoreCount), Number(dashboardData?.storeCount?.preStoreCount)]);

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const getOrderCollectionPercent = useMemo(() => {
    if (dashboardData?.collection?.currCollection && dashboardData?.collectionTarget?.currCollectionTarget) {
      const r = (Number(dashboardData?.collection?.currCollection) / Number(dashboardData?.collectionTarget?.currCollectionTarget));
      return r > 1 ? 1 : r
    }
    return 0;
  }, [dashboardData?.collection?.currCollection, dashboardData?.collectionTarget?.currCollectionTarget])
  const getValueTargetPercent = useMemo(() => {
    if (dashboardData?.sales?.currSales && dashboardData?.salesTarget?.currSalesTarget) {
      const r = (Number(dashboardData?.sales?.currSales) / Number(dashboardData?.salesTarget?.currSalesTarget));
      return r > 1 ? 1 : r
    }
    return 0;
  }, [dashboardData?.sales?.currSales])

  const getStoreTargetPercent = useMemo(() => {
    if (dashboardData?.storeCount?.currStoreCount && dashboardData?.storeTarget?.currStoreTarget) {
      const r = Number(dashboardData?.storeCount?.currStoreCount) / Number(dashboardData?.storeTarget?.currStoreTarget);
      return r > 1 ? 1 : r
    }
    return 0;
  }, [dashboardData?.storeCount?.currStoreCount])

  const getTextColor = (percent: any) => {
    if (percent < 0.25) return "#b54e45"; // Red
    if (percent < 0.50) return "#f5c966"; // Yellow
    if (percent < 0.75) return "#8abc5b"; // Light Green
    return "#4f8a5c"; // Dark Green
  };
  const currentDate = new Date();
  // Get current month index (0-based)
  const currentMonthIndex = currentDate.getMonth();
  const monthText = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const quarterMonthText = ["april", "may", "june", "july", "august", "september", "october", "november", "december", "january", "february", "march"];
  const currMonth = monthText[currentMonthIndex];
  const currMonthIdx = quarterMonthText.indexOf(currMonth);

  const quarterText = ["Q1", "Q2", "Q3", "Q4"];
  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const yearText: string[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    yearText.push(year.toString());
  }


  const quartersToShow = Math.ceil((currMonthIdx + 1) / 3);
  const options: Option[] = [
    {
      value: TimelineEnum.MONTH,
      label: 'Month',
      children: monthText?.slice(0, currentMonthIndex + 1)?.reverse()?.map((data): Option => {
        return {
          value: data,
          label: capitalizeFirstLetter(data)
        };
      }),
    },
    {
      value: TimelineEnum.QUARTER,
      label: 'Quarter',
      children: quarterText?.slice(0, quartersToShow)?.map((data): Option => {
        return {
          value: data,
          label: capitalizeFirstLetter(data)
        };
      }),
    },
    {
      value: TimelineEnum.YEAR,
      label: 'Year',
      children: yearText?.reverse()?.map((data): Option => {
        return {
          value: data,
          label: capitalizeFirstLetter(data)
        };
      }),
    },
  ];



  return (
    <Fragment>
      <div className="dashboard-container mb-40" >
        <RejectedComment
          isApprovedRejected={isApprovedRejected}
          toggle={toggleDelete}
          orderId={orderId}
          callbackRejectedRequest={callbackRejectedRequest}
          closeModal={(e: any) => {
            setToggleDelete(e);
          }} />
        <FullPageLoaderWithState isLoading={isLoading} />
        {/* <header style={{ backgroundColor: "white", justifyContent: "space-between" }}> */}
        <h4 className="adminHText">
          {capitalizeFirstLetter(getDashboardLabel(authState?.user?.role))}
        </h4>
        {/* </header> */}
        {dashboardData &&
          <div className="content adminContent " style={{ padding: "10px", marginTop: "10px" }}>
            <div style={{ marginBottom: "15px", }}>
              <Cascader style={{ boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.15)", fontWeight: "500", fontSize: "8px", fontFamily: "Montserrat, sans-serif", color: "#3F3F3F" }} defaultValue={['Year', String(currentYear)]} options={options} onChange={filterHandler} placeholder="Please select" />
            </div>
            <main>

              <div>
                <style>
                  {`
                      @media (max-width: 768px) {
                        .responsive-target-cards {
                          flex-direction: column !important;
                          padding: 10px !important;
                          border-radius: 20px !important;
                          margin-left: 0 !important;
                          margin-right: 0 !important;
                          border: 1px solid #e0e0e0 !important;
                          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;

                        }

                        .responsive-target-cards > .ant-col {
                          padding-left: 0 !important;
                          padding-right: 0 !important;
                          margin-bottom: 0 !important;
                        }

                        .ant-row {
                          row-gap: 0px !important;
                          border-radius: 20px !important;
                          
                        }

                        .smallDiv {
                          padding: 2px !important;
                          border-radius: 0px !important;
                          height: 70px !important;
                          margin-bottom: 0 !important;
                          border: none !important;
                          box-shadow: none !important;
                          padding-left: 9px !important;

                        
                        }

                        .smallDiv img {
                          width: 36px !important;
                          height: 36px !important;
                          margin-top: 10px !important;
                        }

                        .smallDiv > div {
                          margin-top: 10px !important;
                        }

                        .ant-col-xs-12{
                        padding-bottom: 16px !important;
                        }

                        .target {
                          position: relative !important;
                          left: 110px !important;
                          top: -10px;
                        }
                        .Achieved{
                            position: relative !important;
                            left: 9px !important;
                          }
                      }
                    `}
                </style>


                <div className="responsive-target-cards ant-row ant-col-xs-12" style={{ marginBottom: "20px" }}>
                  <Row gutter={[16, 16]} style={{ fontFamily: "Arial, sans-serif" }}>
                    {/* Card 1 - Sales Target */}
                    <Col xs={24} sm={24} md={8}>
                      <div style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "20px",
                        padding: "16px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        display: "flex",
                        height: "90px",

                      }} className="smallDiv">
                        <img
                          style={{ backgroundColor: "#8488BF", borderRadius: "10px", padding: "6px", marginRight: "12px", marginTop: "20px" }}
                          src="/icon.png"
                          alt="Sales Icon"
                          width="50px"
                          height="50px"
                        />
                        <div style={{ flex: 1, marginTop: "20px" }}>
                          <div style={{ fontWeight: "600", font: "Inter", fontSize: "15px", color: "#565656", marginRight: "5px", marginTop: "5px" }}>Sales Target</div>
                          <div style={{ width: "88%", font: "Inter", fontSize: "14px", fontWeight: "600" }}>
                            <Progress percent={74} strokeColor="#FE4C11" trailColor="#F2AEA2" strokeWidth={5} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7D7D7D", fontFamily: "Montserrat, sans-serif", fontWeight: "500" }}>
                            <span style={{
                              marginBottom: "20px", position: "relative",
                              top: "-10px",
                              left: "190px"
                            }} className="target">Target <RupeeSymbol />400</span>
                            <span style={{
                              fontSize: "8px",marginTop:'5px', marginBottom: "50px", fontStyle: "bold", fontWeight: "600", font: "Inter",
                              marginRight: "5px", color: "#000000"
                            }} className="Achieved">Achieved ₹10.6K</span>
                          </div>
                        </div>
                      </div>
                    </Col>

                    {/* Card 2 - Stores Target */}
                    <Col xs={24} sm={24} md={8}>
                      <div style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "20px",
                        padding: "16px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        display: "flex",
                        height: "90px",

                      }} className="smallDiv">
                        <img
                          style={{ backgroundColor: "#8488BF", borderRadius: "10px", padding: "6px", marginRight: "12px", marginTop: "20px" }}
                          src="/icon3.png"
                          alt="Store Icon"
                          width="50px"
                          height="50px"
                        />
                        <div style={{ flex: 1, marginTop: "20px" }}>
                          <div style={{ fontWeight: "600", fontSize: "15px", color: "#565656", marginTop: "5px" }}>Stores Target</div>
                          <div style={{ width: "88%", font: "Inter", fontSize: "14px", fontWeight: "600" }}>
                            <Progress percent={50} strokeColor="#FE4C11" trailColor="#F2AEA2" strokeWidth={5} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7D7D7D", fontWeight: "500", fontFamily: "Montserrat, sans-serif" }}>
                            <span style={{
                              marginBottom: "20px", position: "relative",
                              top: "-10px",
                              left: "190px"
                            }} className="target">Target 4</span>
                            <span style={{
                              fontSize: "8px",marginTop:'5px', marginBottom: "50px", fontStyle: "bold", fontWeight: "600", font: "Inter",
                              marginRight: "30px", color: "#000000"
                            }} className="Achieved">Achieved 2</span>
                          </div>
                        </div>
                      </div>
                    </Col>

                    {/* Card 3 - Collection Target */}

                    <Col xs={24} sm={24} md={8}>
                      <div style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "20px",
                        padding: "16px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        display: "flex",
                        height: "90px",

                      }} className="smallDiv">
                        <img
                          style={{ backgroundColor: "#8488BF", borderRadius: "10px", padding: "6px", marginRight: "12px", marginTop: "20px" }}
                          src="/icon1.png"
                          alt="Collection Icon"
                          width="50px"
                          height="50px"
                        />
                        <div style={{ flex: 1, marginTop: "20px" }}>
                          <div style={{ fontWeight: "600", fontSize: "15px", color: "#565656", marginTop: "5px" }}>Collection Target</div>
                          <div style={{ width: "88%", font: "Inter", fontSize: "14px", fontWeight: "600" }}>
                            <Progress percent={0} strokeColor="#FE4C11" trailColor="#F2AEA2" strokeWidth={5} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7D7D7D", fontWeight: "500", fontFamily: "Montserrat, sans-serif" }}>
                            <span style={{
                              marginBottom: "20px", position: "relative",
                              top: "-10px",
                              left: "190px"
                            }} className="target">Target <RupeeSymbol />4.0K</span>
                            <span style={{
                              fontSize: "8px",marginTop:'5px', marginBottom: "50px", fontStyle: "bold", fontWeight: "600", font: "Inter",
                              marginRight: "24px", color: "#000000"
                            }} className="Achieved">Achieved ₹0</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* <div className="chartDirection" style={{ marginBottom: "10px" }}>
                <div className='chartbg' style={{ marginTop: "0", background: "white" }}>
                  <div className="chartContainer">
                    <span>Achieved</span>
                    <span><RupeeSymbol />{formattedAmount(dashboardData?.sales?.currSales)}</span>
                  </div>
                  <GaugeChart
                    id="gauge-chart5"
                    nrOfLevels={420}
                    arcsLength={[0.25, 0.25, 0.25, 0.25]}
                    colors={["#b54e45", "#f5c966", "#8abc5b", "#4f8a5c"]}
                    percent={getValueTargetPercent}
                    arcPadding={0.02}
                    cornerRadius={3}
                    arcWidth={0.20}
                    textColor={getTextColor(getValueTargetPercent)}
                    needleBaseColor="black"
                    className="gaugechart fontb"
                  />
                  
                  <div className="valueTarContent">
                    <span>0</span>
                    <span>Sales Target</span>
                    <div className="valueTarTxt">
                      <span>Target</span>
                      <span><RupeeSymbol />{formattedAmount(dashboardData?.salesTarget?.currSalesTarget)}</span>
                    </div>
                  </div>
                </div>
                <div className="chartbg" style={{ background: "white" }}>
                  <div className="chartContainer">
                    <span>Achieved</span>
                    <span>{dashboardData?.storeCount?.currStoreCount}</span>
                  </div>
                  <GaugeChart
                    id="gauge-chart5"
                    nrOfLevels={420}
                    arcsLength={[0.25, 0.25, 0.25, 0.25]}
                    colors={["#b54e45", "#f5c966", "#8abc5b", "#4f8a5c"]}
                    percent={getStoreTargetPercent}
                    arcPadding={0.02}
                    cornerRadius={3}
                    arcWidth={0.20}
                    textColor={getTextColor(getStoreTargetPercent)}
                    needleBaseColor="black"
                    className="gaugechart fontb"
                  />
                  <div className="dashStoTar">
                    <span>0</span>
                    <span>Stores Target</span>
                    <div className="dashStoTarTxt">
                      <span>Target</span>
                      <span>{dashboardData?.storeTarget?.currStoreTarget}</span>
                    </div>
                  </div>
                </div>
                <div className="chartbg" style={{ background: "white" }}>
                  <div className="chartContainer">
                    <span>Achieved</span>
                    <span><RupeeSymbol />{formattedAmount(dashboardData?.collection?.currCollection)}</span>
                  </div>
                  <GaugeChart
                    id="gauge-chart5"
                    nrOfLevels={420}
                    arcsLength={[0.25, 0.25, 0.25, 0.25]}
                    colors={["#b54e45", "#f5c966", "#8abc5b", "#4f8a5c"]}
                    percent={getOrderCollectionPercent}
                    arcPadding={0.02}
                    cornerRadius={3}
                    arcWidth={0.20}
                    textColor={getTextColor(getOrderCollectionPercent)}
                    needleBaseColor="black"
                    className="gaugechart fontb"
                  />
                  <div className="dashStoTar">
                    <span>0</span>
                    <span>Collection</span>
                    <div className="dashStoTarTxt">
                      <span>Target</span>
                      <span><RupeeSymbol />{formattedAmount(dashboardData?.collectionTarget?.currCollectionTarget)}</span>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* <div className="chartDirectionAdmin">
                <div className="dflex-dir" style={{ marginBottom: "10px" }}>
                  <div
                    className='adminchartbg'
                  // style={{background: "#FFA755"}}
                  >
                    <div>
                      Sales
                    </div>
                    <h1 className="salesamount" >₹{formattedAmount(dashboardData?.sales?.currSales) ?? "0"}</h1>
                    {salesGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{salesGrowth.percentage !== "NaN%" ? salesGrowth?.percentage || 0 : 0}</span> {salesGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : salesGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}
                  </div>
                  <div
                    className='adminchartbg'>
                    <div>
                      New Stores
                    </div>
                    <h1 className="salesamount" style={{ paddingLeft: "16px" }}>{dashboardData?.storeCount?.currStoreCount ? dashboardData?.storeCount?.currStoreCount : "0"}</h1>
                    {storeCountGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{storeCountGrowth?.percentage !== "NaN%" ? storeCountGrowth?.percentage || 0 : 0}</span> {storeCountGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : storeCountGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}
                  </div>
                  {!isMobile ? <>
                    <div
                      className='adminchartbg'>
                      <div>
                        Orders
                      </div>
                      <h1 className="salesamount" >{formattedAmount(Number(dashboardData?.orderCount?.currOrderCount) ?? "0")}</h1>
                      {orderCountGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{orderCountGrowth.percentage !== "NaN%" ? orderCountGrowth?.percentage || 0 : 0}</span> {orderCountGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : orderCountGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}
                    </div>
                    <div
                      className='adminchartbg' >
                      <div>
                        Collections
                      </div>
                      <h1 className="salesamount" style={{ paddingLeft: "16px" }}>₹{formattedAmount(dashboardData?.collection?.currCollection) ?? "0"}</h1>
                      {collectionGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{collectionGrowth?.percentage !== "NaN%" ? collectionGrowth?.percentage || 0 : 0}</span> {collectionGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : collectionGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}
                    </div></>
                    : null}
                </div>
                {isMobile && <div className="dflex-dir" style={{ marginTop: "12px" }}>
                  <div
                    className='adminchartbg'>
                    <div>
                      Orders
                    </div>
                    <h1 className="salesamount" >{formattedAmount(Number(dashboardData?.orderCount?.currOrderCount) ?? "0")}</h1>
                    {orderCountGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{orderCountGrowth.percentage !== "NaN%" ? orderCountGrowth?.percentage || 0 : 0}</span> {orderCountGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : orderCountGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}

                  </div>
                  <div
                    className='adminchartbg'>
                    <div>
                      Collections
                    </div>
                    <h1 className="salesamount" style={{ paddingLeft: "16px" }}>₹{formattedAmount(dashboardData?.collection?.currCollection) ?? "0"}</h1>
                    {collectionGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{collectionGrowth?.percentage !== "NaN%" ? collectionGrowth?.percentage || 0 : 0}</span> {collectionGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : collectionGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}
                  </div>
                </div>}
              </div>



              
              <div className="admintablebg" style={{ marginTop: "12px" }}>
                <div className="tabletitle">Revenue</div>
                <RevenueChart
                  revenueCurrentWeekResults={revenueChartData?.RevenueCurrentWeekResults}
                  RevenueLastWeekResults={revenueChartData?.RevenueLastWeekResults}
                />
              </div> */}

              <style>
                {`
                  @media (max-width: 768px) {
                      .ant-card .ant-card-body{
                        padding: 8px;
                        border-radius: 20px;
                      }

                      .prior{
                        position: relative;
                        right: 110px !important; 
                      }
                    }
        `}
              </style>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <div>
                    <span style={{
                      color: "#171725",
                      fontFamily: "Inter",
                      fontSize: "24px",
                      margin: "20px 0 10px 10px",
                      fontWeight: "600"
                    }}>
                      Sales Target
                    </span>


                    <Row gutter={[8, 8]} style={{ marginTop: "30px", marginBottom: "30px", marginLeft: "15px" }} justify="start">
                      <Col xs={8}>
                        <Button block style={{
                          backgroundColor: "#8488BF",
                          color: "white",
                          borderRadius: "8px",
                          fontWeight: "400"
                        }}>Daily</Button>
                      </Col>
                      <Col xs={8}>
                        <Button block style={{
                          backgroundColor: "#8488BF",
                          color: "white",
                          borderRadius: "8px",
                          fontWeight: "400"
                        }}>Monthly</Button>
                      </Col>
                      <Col xs={8}>
                        <Button block style={{
                          backgroundColor: "#8488BF",
                          color: "white",
                          borderRadius: "8px",
                          fontWeight: "400"
                        }}>Yearly</Button>
                      </Col>
                    </Row>


                    <Row gutter={[16, 16]} style={{ marginTop: "20px", marginLeft: "15px" }}>
                      <Col xs={12} >
                        <Card style={{ backgroundColor: "#EFF5FF", borderRadius: "8px" }} className="new">
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "16px", fontWeight: "600" }}>Sales</span>
                            <span style={{ fontSize: "16px", color: "#D53D3D", fontWeight: "600" }}>-98.63%</span>
                          </div>
                          <h2 style={{ marginTop: "7px", fontSize: "32px", fontWeight: "600" }}>₹10.6K</h2>
                          <div style={{ marginTop: "5px", color: "#92929D", fontSize: "13px" }}>
                            Compared to (₹21340 last year)
                          </div>
                        </Card>
                      </Col>

                      <Col xs={12}>
                        <Card style={{ backgroundColor: "#EFF5FF", borderRadius: "8px" }} className="new">
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "16px", fontWeight: "600" }}>New Stores</span>
                            <span style={{ fontSize: "16px", color: "#D53D3D", fontWeight: "600" }}>-97.01%</span>
                          </div>
                          <h2 style={{ marginTop: "7px", fontSize: "32px", fontWeight: "600" }}>2</h2>
                          <div style={{ marginTop: "5px", color: "#92929D", fontSize: "13px" }}>
                            Compared to (₹19000 last year)
                          </div>
                        </Card>
                      </Col>

                      <Col xs={12} >
                        <Card style={{ backgroundColor: "#EFF5FF", borderRadius: "8px" }} className="new">
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "16px", fontWeight: "600" }}>Orders</span>
                            <span style={{ fontSize: "16px", color: "#D53D3D", fontWeight: "600" }}>-96.01%</span>
                          </div>
                          <h2 style={{ marginTop: "7px", fontSize: "32px", fontWeight: "600" }}>8</h2>
                          <div style={{ marginTop: "5px", color: "#92929D", fontSize: "13px" }}>
                            Compared to (₹21340 last year)
                          </div>
                        </Card>
                      </Col>

                      <Col xs={12} >
                        <Card style={{ backgroundColor: "#EFF5FF", borderRadius: "8px" }} className="new">
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "16px", fontWeight: "600" }}>Collections</span>
                            <span style={{ fontSize: "16px", color: "#3DD598", fontWeight: "600" }}>+0.5%</span>
                          </div>
                          <h2 style={{ marginTop: "7px", fontSize: "32px", fontWeight: "600" }}>₹20921</h2>
                          <div style={{ marginTop: "5px", color: "#92929D", fontSize: "13px" }}>
                            Compared to (₹19000 last year)
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col xs={24} lg={12}>
                  <span style={{
                    marginBottom: '16px',
                    color: "#171725",
                    fontFamily: "Inter",
                    fontSize: "24px",
                    fontWeight: "600",
                    marginTop: "-20px",
                    marginLeft: "15px"
                  }}>Revenue</span>
                  <div style={{ marginTop: "15px", paddingBottom: "20px" }}>
                    {/* <span style={{marginLeft:"10px", fontSize:"14px", fontWeight:"400", width:"177.84", font:"Inter",color:"#44444F" }}>Last Week</span>
                  <span style={{marginLeft:"300px", fontSize:"14px", fontWeight:"400", width:"177.84", font:"Inter",color:"#44444F"}}>Prior Week</span> */}
                    <div>
                      <div style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '12px',
                        // boxShadow: '0 2px 10px rgba(243, 239, 239, 1)',
                        fontFamily: 'Inter, sans-serif',
                        // width: '650px',
                        height: "400px"
                      }}>

                        <div style={{ display: 'flex', gap: '24px', marginBottom: '60px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: '#1C1C50',
                              marginRight: '6px',
                            }}></div>
                            <span style={{ fontSize: '14px' }}>Last Week</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginLeft: "185px" }} className="prior">
                            <div style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: '#82b6ff',
                              marginRight: '6px'
                            }}></div>
                            <span style={{ fontSize: '14px' }} >Prior Week</span>
                          </div>
                        </div>
                        <div style={{
                          position: 'relative',
                          height: '260px',
                          borderRadius: '10px',
                          background: '#fff',
                          overflow: 'hidden',
                          border: '1px solid #f0f0f0'
                        }}>
                          {[0, 1, 2, 3, 4, 5].map((_, i) => (
                            <div
                              key={i}
                              style={{
                                position: 'absolute',
                                top: `${i * 20}%`,
                                width: '100%',
                                height: '1px',
                                backgroundColor: '#eee'
                              }}
                            />
                          ))}
                          <div style={{ position: 'absolute', top: '0', left: '0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '12px', color: '#999', paddingLeft: '4px' }}>
                            {[1000, 800, 600, 400, 200, 0].map((val) => <div key={val}>{val}</div>)}
                          </div>
                          <div style={{ position: 'absolute', bottom: '4px', left: '48px', right: '0', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999', padding: '0 16px' }}>
                            {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m) => <div key={m}>{m}</div>)}
                          </div>
                          <svg viewBox="0 0 600 200" style={{ position: 'absolute', top: '40px', left: '48px', right: '0' }}>

                            <path
                              d="M0,100 C100,50 200,60 300,80 C400,100 500,90 600,110"
                              stroke="#82b6ff"
                              strokeWidth="3"
                              fill="none"
                            />
                            <path
                              d="M0,110 C100,80 200,90 300,100 C400,90 500,100 600,120"
                              stroke="#1C1C50"
                              strokeWidth="3"
                              fill="none"
                            />
                            <line x1="300" y1="0" x2="300" y2="160" stroke="#82b6ff" strokeWidth="2" />
                            <circle cx="300" cy="80" r="6" fill="#1C1C50" />
                          </svg>
                          <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: 'calc(50% - 40px)',
                            backgroundColor: '#fff',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            fontSize: '14px',
                            textAlign: 'center',
                            fontWeight: '600',
                            width: '80px'
                          }}>
                            $27632<br />
                            <span style={{ fontWeight: 'normal', fontSize: '12px' }}>August</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>


              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "0" : "20px", justifyContent: "space-between", width: "100%" }}>
                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Pending Approvals</div>
                  <PendingApprovalTable
                    pendingApproval={dashboardData?.PendingApprovalStores}
                    onChangeHandler={onChangeHandler}
                    isApprovedRejected={isApprovedRejected}
                    orderId={isApprovedStore.orderId}
                    isApprovalUpdate={"isApprovalUpdate"}
                  />
                </div>
                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Unbilled Stores</div>
                  <UnbilledStoresTable unbilledStores={dashboardData?.unBilledStore} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "0" : "20px", justifyContent: "space-between", width: "100%" }}>

                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Top 5 Performers</div>
                  <TopPerformersTable topPerformer={dashboardData?.topPerformer} />
                </div>
                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Bottom 5 Performers</div>
                  <WorstPerformersTable bottomPerformer={dashboardData?.bottomPerformer} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "0" : "20px", justifyContent: "space-between", width: "100%" }}>

                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Top 5 SKU</div>
                  <SkuTable topSKU={dashboardData?.sku?.topSKU} isSalesColumn={true} />
                </div>
                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Bottom 5 SKU</div>
                  <SkuTable topSKU={dashboardData?.sku?.bottomSKU} isSalesColumn={true} />
                </div>

              </div>
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "0" : "20px", justifyContent: "space-between", width: "100%" }}>

                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Least Pending Amount</div>
                  <LeastPending />
                </div>
                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Most Pending Amount</div>
                  <MostPending />
                </div>

              </div>

              {/* <div className="admintablebg">
                <div className="tabletitle">Top 5 SKUs</div>
                <SkuTable topSKU={dashboardData?.topSKU} />
              </div> */}
            </main>
          </div>
        }
      </div>
    </Fragment>
  );
};
