import React, { Fragment, useEffect, useMemo, useState } from "react";
import "style/dashboard.css";
import { CaretDownOutlined, CaretUpOutlined, PauseCircleFilled, UserOutlined } from "@ant-design/icons";
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
import { Cascader, message } from "antd";
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
        <header style={{ backgroundColor: "#070D79", justifyContent: "space-between" }}>
          <h4 className="adminHText">
            {capitalizeFirstLetter(getDashboardLabel(authState?.user?.role))}
          </h4>
        </header>
        {dashboardData &&
          <div className="content adminContent " style={{ padding: "10px", background: "#dee1e6" }}>
            <div style={{ marginBottom: "10px" }}>
              <Cascader defaultValue={['Year', String(currentYear)]} options={options} onChange={filterHandler} placeholder="Please select" />
            </div>
            <main>
              <div className="chartDirection" style={{ marginBottom: "10px" }}>
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
                {/* <div className="barChartContainer" style={{ background: "white", width: "345px" }}>
                  <ResponsiveContainer
                    aspect={1}
                    className="dashgraph chartbg" style={{ background: "white" }} >
                    <BarChart
                      width={0}
                      height={0}
                      data={pdata}
                      margin={{
                        top: 1,
                        right: 0,
                        left: 10,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" interval={"preserveStartEnd"} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="ordered" fill="#61af18" />
                      <Bar dataKey="collected" fill="#e28652" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="barChartCotent">
                    <span>Ordered VS</span>
                    <span>Collection</span>
                  </div>
                </div> */}
              </div>

              <div className="chartDirectionAdmin">
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
              </div>
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
                  <SkuTable topSKU={dashboardData?.sku?.topSKU} isSalesColumn={true}/>
                </div>
                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Bottom 5 SKU</div>
                  <SkuTable topSKU={dashboardData?.sku?.bottomSKU} isSalesColumn={true}/>
                </div>
           
              </div>
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "0" : "20px", justifyContent: "space-between", width: "100%" }}>

            <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
            <div className="tabletitle">Least Pending Amount</div>
            <LeastPending />
            </div>
           <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
          <div className="tabletitle">Most Pending Amount</div>
          <MostPending/>
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
