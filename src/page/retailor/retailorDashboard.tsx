import React, { useEffect, useMemo, useState } from "react";
// import AttendanceModal from "../component/attendance/AttendanceModal";
import "../../style/dashboard.css";
import GaugeChart from "react-gauge-chart";
import { IDashboardData } from "types/Dashboard";
import { getDashboardService, getRetailorDashboardService } from "services/dashboardService";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import RupeeSymbol from "component/RupeeSymbol";
import { getProfileService } from "services/authService";
import { Cascader, Switch } from "antd";
import type { CascaderProps } from 'antd';
import { Link } from "react-router-dom";

import { formattedAmount, getDashboardLabel } from "utils/common";
import { capitalizeFirstLetter } from "utils/capitalize";
import { TimelineEnum, UserRole } from "enum/common";
import { CaretDownOutlined, CaretUpOutlined, PauseCircleFilled } from "@ant-design/icons";
import { useAuth } from "context/AuthContext";
import SkuTable from "component/admin/dashboard/skuTable";
interface Option {
  value: string;
  label: string;
  children?: Option[];
}




export const RetailorDashboard = () => {

  const [toggle, settoggle] = useState(false);
  const [profileImg, setProfileImg] = useState<any>();
  const [dashboardData, setDashboardData] = useState<any>();
  const dispatch = useDispatch();
  const {authState} = useAuth()
  // const [switchText, setSwtichText] = useState<boolean>(false)
  const [timePeriod, setTimePeriod] = useState<any>([])

  // const onChange = (checked: boolean) => {
  //   setSwtichText(!switchText)
  // };
  const onChangeHandler: any = (value: any) => {
    setTimePeriod(value)
  };
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        dispatch(setLoaderAction(true));
        const res = await getRetailorDashboardService(timePeriod || [TimelineEnum.YEAR, String(currentYear)]);
        setDashboardData(res.data.data)
        const profileRes = await getProfileService();
        setProfileImg(profileRes?.data?.data);
        dispatch(setLoaderAction(false));
      } catch (error) {
        dispatch(setLoaderAction(false));
      }
    }
    fetchDashboardData();
  }, [timePeriod]);

  const pdata = useMemo(() => {
    if (dashboardData?.orderVsCollection) {
      return [
        {
          name: "",
          ordered: dashboardData.orderVsCollection.ordered,
          collected: dashboardData.orderVsCollection.collected,
        },
      ];
    }
    return [];
  }, [dashboardData?.orderVsCollection])

  const getValueTargetPercent = useMemo(() => {
    if (dashboardData?.valueTarget && dashboardData?.valueTarget.target > 0) {
      const r = (dashboardData?.valueTarget?.achieved / dashboardData?.valueTarget?.target);
      return r > 1 ? 1 : r
    }
    return 0;
  }, [dashboardData?.valueTarget])

  const getStoreTargetPercent = useMemo(() => {
    if (dashboardData?.storeTarget && dashboardData?.storeTarget?.target > 0) {
      const r = dashboardData?.storeTarget.achieved / dashboardData?.storeTarget?.target;
      return r > 1 ? 1 : r
    }
    return 0;
  }, [dashboardData?.storeTarget])

  const getOrderCollectionPercent = useMemo(() => {
    if (dashboardData?.collectionTarget?.target && dashboardData?.collectionTarget?.achieved) {
      const r = dashboardData?.collectionTarget?.achieved / dashboardData?.collectionTarget?.target;
      return r > 1 ? 1 : r
    }
    return 0;
  }, [dashboardData?.storeTarget])


  const currentDate = new Date();
  // Array of month names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Get current month index (0-based)
  const currentMonthIndex = currentDate.getMonth();

  // Get short month name from array
  const currentMonth = monthNames[currentMonthIndex];
  const currentMonthData: any = dashboardData?.monthWiseStoreCount;
  const currentMontValue: any = currentMonthData?.[currentMonth];
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
      children: quarterText?.slice(0,quartersToShow).map((data): Option => {
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
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const getTextColor = (percent: any) => {
    if (percent < 0.25) return "#b54e45"; // Red
    if (percent < 0.50) return "#f5c966"; // Yellow
    if (percent < 0.75) return "#8abc5b"; // Light Green
    return "#4f8a5c"; // Dark Green
  };
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
  return (
    <div>
      <div className="dashboard-container">
        {/* <AttendanceModal
          toggle={toggle}
          closeModal={(e: any) => {
            settoggle(e);
          }}
        /> */}
        <header style={{ justifyContent: "space-between" }}>
          <h4 className="adminHText">  {capitalizeFirstLetter(getDashboardLabel(authState?.user?.role))}</h4>
          {/* <button
            onClick={() => {
              settoggle(true);
            }}
            className="adminbtnAtt">
            Mark Attendance
          </button> */}
        </header>
        <div className="content" style={{ background: "rgb(222, 225, 230)" }}>
          <div>
           
            <Cascader defaultValue={['Year', String(currentYear)]} options={options} onChange={onChangeHandler} placeholder="Please select" />
          </div>
          <main className="mt-30">
            <div >
            <div className="chartDirection" style={{ marginTop: "-10px", justifyContent:"space-between" }}>
              <div className='retailorChartbg' style={{ marginTop: "0", }}>
                <div className="chartContainer">
                  <span>Achieved</span>
                  <span><RupeeSymbol />{formattedAmount(dashboardData?.valueTarget?.achieved)}</span>
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
                <div className="valueTarContent" style={{marginTop: "-30px"}}>
                  <span>0</span>
                  <span>Order Value</span>
                  <div className="valueTarTxt">
                    <span>Target</span>
                    <span><RupeeSymbol />{formattedAmount(dashboardData?.valueTarget.target)}</span>
                  </div>
                </div>
              </div>
              <div className="chartDirectionAdmin">
              <div className="dflex-dir" style={{flexDirection:"column" }}>
               <div style={{display:"flex", gap:"20px"}}>
                 <div
                  className='adminchartbg' style={{padding: "10px 20px"}}>
                  <div>
                    Total Order Value
                  </div>
                  <h1 className="salesamount" style={{ paddingLeft: "16px" }}>₹{formattedAmount(dashboardData?.sales?.currSales) ?? "0"}</h1>
                  {salesGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{salesGrowth.percentage !== "NaN%" ? salesGrowth?.percentage || 0 : 0}</span> {salesGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : salesGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}

                </div>
                <div
                    className='adminchartbg' style={{padding: "10px 20px"}}>
                    <div>
                      No. of Orders
                    </div>
                    <h1 className="salesamount" >{formattedAmount(Number(dashboardData?.orderCount?.currOrderCount) ?? "0")}</h1>
                    {orderCountGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{orderCountGrowth.percentage !== "NaN%" ? orderCountGrowth?.percentage || 0 : 0}</span> {orderCountGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : orderCountGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}

                  </div>
               </div>
               <div  style={{display:"flex", gap:"20px"}}>
                    <div
                  className='adminchartbg' style={{padding: "10px 20px"}}>
                  <div>
                  No. of Orders with Pending Payment
                  </div>
                  <h1 className="salesamount" style={{ paddingLeft: "16px" }}>{dashboardData?.orderCountWithPendingPayment?.currOrder ? dashboardData?.orderCountWithPendingPayment?.currOrder : "0"}</h1>

                </div>
                  <div
                    className='adminchartbg' style={{padding: "10px 20px"}}>
                    <div>
                    Total Amount for Pending Payments
                    </div>
                    {/* <span>This {switchText ? "Month" : "Year"}</span> */}
                    <h1 className="salesamount" style={{ paddingLeft: "16px" }}>₹{formattedAmount(dashboardData?.orderValueWithPendingPayment?.currSales?.totalAmount) ?? "0"}</h1>
                    {/* {collectionGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{collectionGrowth?.percentage !== "NaN%" ? collectionGrowth?.percentage || 0 : 0}</span> {collectionGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : collectionGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>} */}

                  </div>
                  </div>
              </div>
            </div>
            </div>
          
            </div>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "0" : "20px", justifyContent: "space-between", width: "100%" }}>

                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Top 5 SKU</div>
                  <SkuTable topSKU={dashboardData?.sku?.topSKU} isSalesColumn={false}/>
                </div>
                <div className="admintablebg" style={{ width: isMobile ? "auto" : "100%" }}>
                  <div className="tabletitle">Bottom 5 SKU</div>
                  <SkuTable topSKU={dashboardData?.sku?.bottomSKU} isSalesColumn={false}/>
                </div>
              </div>
          </main>
        </div>
      </div>
    </div>
  );
};
