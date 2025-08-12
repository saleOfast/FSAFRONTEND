import React, { useEffect, useMemo, useState } from "react";
import AttendanceModal from "../component/attendance/AttendanceModal";
import "../style/dashboard.css";
import GaugeChart from "react-gauge-chart";
import { IDashboardData } from "types/Dashboard";
import { getDashboardService } from "services/dashboardService";
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
interface Option {
  value: string;
  label: string;
  children?: Option[];
}




export const Dashboard = () => {

  const [toggle, settoggle] = useState(false);
  const [profileImg, setProfileImg] = useState<any>();
  const [dashboardData, setDashboardData] = useState<IDashboardData>();
  const dispatch = useDispatch();
  const {authState} = useAuth()
  // const [switchText, setSwtichText] = useState<boolean>(false)
  const [timePeriod, setTimePeriod] = useState<any>([])
//  const { authState } = useAuth();
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
        const res = await getDashboardService(timePeriod || [TimelineEnum.YEAR, String(currentYear)]);
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
        <header style={{ justifyContent: "space-between", color:"#8488BF"}} >
          <h4 className="adminHText">  <h4 className="adminHText">{capitalizeFirstLetter(getDashboardLabel(authState?.user?.role))}</h4></h4>
         {/* {authState?.user?.role !== UserRole.CHANNEL && <button
            onClick={() => {
              settoggle(true);
            }}
            className="adminbtnAtt">
            Mark Attendance
          </button>} */}

        </header>
        <div className="content" style={{ background: "rgb(222, 225, 230)" }}>
          <div>
            {/* <Switch
              defaultChecked
              onChange={onChange}
              checkedChildren={currentMonth} unCheckedChildren="All" /> */}
            <Cascader defaultValue={['Year', String(currentYear)]} options={options} onChange={onChangeHandler} placeholder="Please select" />
            {/* <span style={{ textAlign: "center", marginLeft: "10px", fontWeight: "bold" }}>{"Filter"}</span> */}
          </div>
          <main className="mt-30">

            <div className="chartDirection" style={{ marginTop: "-10px" }}>
              <div className='chartbg' style={{ marginTop: "0" }}>
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
                <div className="valueTarContent">
                  <span>0</span>
                  <span>Sales Target</span>
                  <div className="valueTarTxt">
                    <span>Target</span>
                    <span><RupeeSymbol />{formattedAmount(dashboardData?.valueTarget.target)}</span>
                  </div>
                </div>
              </div>
              <div className="chartbg">
                <div className="chartContainer">
                  <span>Achieved</span>
                  <span>{formattedAmount(dashboardData?.storeTarget?.achieved)}</span>
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
                    <span>{formattedAmount(dashboardData?.storeTarget.target)}</span>
                  </div>
                </div>
              </div>
              <div className="chartbg">
                <div className="chartContainer">
                  <span>Achieved</span>
                  <span>₹{formattedAmount(dashboardData?.collectionTarget?.achieved)}</span>
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
                    <span>₹{formattedAmount(dashboardData?.collectionTarget?.target)}</span>
                  </div>
                </div>
              </div>
              {/* <div className="barChartContainer">
                <ResponsiveContainer
                  aspect={1}
                  className="dashgraph chartbg">
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
                  className='adminchartbg'>
                  <div>
                    Sales
                  </div>
                  {/* <span>This {switchText ? "Month" : "Year"}</span> */}
                  <h1 className="salesamount" style={{ paddingLeft: "16px" }}>₹{formattedAmount(dashboardData?.sales?.currSales) ?? "0"}</h1>
                  {salesGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{salesGrowth.percentage !== "NaN%" ? salesGrowth?.percentage || 0 : 0}</span> {salesGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : salesGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}

                </div>
                <div
                  className='adminchartbg'>
                  <div>
                    New Stores
                  </div>
                  {/* <span>This {switchText ? "Month" : "Year"}</span> */}
                  <h1 className="salesamount" style={{ paddingLeft: "16px" }}>{dashboardData?.storeCount?.currStoreCount ? dashboardData?.storeCount?.currStoreCount : "0"}</h1>
                  {storeCountGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{storeCountGrowth?.percentage !== "NaN%" ? storeCountGrowth?.percentage || 0 : 0}</span> {storeCountGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : storeCountGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}

                </div>
                {!isMobile ? <>
                  <div
                    className='adminchartbg'>
                    <div>
                      Orders
                    </div>
                    {/* <span>This {switchText ? "Month" : "Year"}</span> */}
                    <h1 className="salesamount" >{formattedAmount(Number(dashboardData?.orderCount?.currOrderCount) ?? "0")}</h1>
                    {orderCountGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{orderCountGrowth.percentage !== "NaN%" ? orderCountGrowth?.percentage || 0 : 0}</span> {orderCountGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : orderCountGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}

                  </div>
                  <div
                    className='adminchartbg'>
                    <div>
                      Collections
                    </div>
                    {/* <span>This {switchText ? "Month" : "Year"}</span> */}
                    <h1 className="salesamount" style={{ paddingLeft: "16px" }}>₹{formattedAmount(dashboardData?.collection?.currCollection) ?? "0"}</h1>
                    {collectionGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{collectionGrowth?.percentage !== "NaN%" ? collectionGrowth?.percentage || 0 : 0}</span> {collectionGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : collectionGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}

                  </div>
                </>
                  : null}

              </div>
              {isMobile && <div className="dflex-dir" style={{ marginTop: "12px" }}>
                <div
                  className='adminchartbg'
                >
                  <div>
                    Orders
                  </div>
                  {/* <span>This {switchText ? "Month" : "Year"}</span> */}
                  <h1 className="salesamount" >{formattedAmount(Number(currentMontValue?.totalOrderCount) ?? "0")}</h1>
                  {orderCountGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{orderCountGrowth.percentage !== "NaN%" ? orderCountGrowth?.percentage || 0 : 0}</span> {orderCountGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : orderCountGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}

                </div>
                <div
                  className='adminchartbg'
                >
                  <div>
                    Collections
                  </div>
                  {/* <span>This {switchText ? "Month" : "Year"}</span> */}
                  <h1 className="salesamount" style={{ paddingLeft: "16px" }}>₹{formattedAmount(dashboardData?.orderVsCollection?.collected) ?? "0"}</h1>
                  {collectionGrowth?.percentage && <span className=""><span style={{ fontWeight: "bold" }}>{collectionGrowth?.percentage !== "NaN%" ? collectionGrowth?.percentage || 0 : 0}</span> {collectionGrowth?.trend === "positive" ? <CaretUpOutlined style={{ color: "rgb(120, 201, 87)" }} /> : collectionGrowth?.trend === "negative" ? <CaretDownOutlined style={{ color: "red" }} /> : <PauseCircleFilled />}</span>}

                </div>
              </div>}
            </div>

            {/* ======================================================================== */}

            <div className="chartDirectionAdmin" style={{ marginTop: "10px" }}>
              <div className="dflex-dir" style={{ marginBottom: "10px" }}>
                <div className='adminchartbg'>
                  <Link to="/visit" className="linkto">

                    <div>
                      Today Visit
                    </div>
                    {/* <span>Visit</span> */}
                    <h1 className="salesamount" style={{ paddingLeft: "16px" }}>{dashboardData?.todayVisitCount ?? "0"}</h1>

                  </Link>

                </div>
                <div className='adminchartbg'>
                  <Link to="/unbilled-stores" className="linkto">

                    <div>
                      Unbilled Stores
                    </div>
                    {/* <span>Stores</span> */}
                    <h1 className="salesamount" style={{ paddingLeft: "16px" }}>{dashboardData?.unBilledStoreCount ?? "0"}</h1>

                  </Link>

                </div>
                {!isMobile ? <>
                  <div className='adminchartbg'>
                    <Link to="/schemes" className="linkto">
                      <div>
                        Scheme
                      </div>
                      <h1 className="salesamount" >
                      {dashboardData?.schemeCount}
                      </h1>
                    </Link>

                  </div>
                  <div
                    className='adminchartbg'>
                    <Link to="/focused-items" className="linkto">
                      <div>
                        Focused Items
                      </div>
                      <h1 className="salesamount" style={{ paddingLeft: "16px" }}>
                        {dashboardData?.focusedProductCount ?? 0}
                      </h1>
                    </Link>
                  </div>
                </>
                  : null}

              </div>
              {isMobile && <div className="dflex-dir" style={{ marginTop: "12px", marginBottom: "20px" }}>
                <div className='adminchartbg'>
                  <Link to="/schemes" className="linkto">
                    <div>
                      Scheme
                    </div>
                    <h1 className="salesamount" >
                      {dashboardData?.schemeCount}
                    </h1>
                  </Link>
                </div>
                <div className='adminchartbg'>
                  <Link to="/focused-items" className="linkto">
                    <div>
                      Focused Items
                    </div>
                    <h1 className="salesamount" style={{ paddingLeft: "16px" }}>
                      {dashboardData?.focusedProductCount ?? 0}
                    </h1>
                  </Link>
                </div>
              </div>
              }
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
