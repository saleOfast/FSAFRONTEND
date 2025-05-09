import Table, { ColumnsType } from 'antd/es/table';
import AttendanceModal from 'component/attendance/AttendanceModal';
import RupeeSymbol from 'component/RupeeSymbol';
import { VisitTypeEnum } from 'enum/common';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setLoaderAction } from 'redux-store/action/appActions';
import { getHomeMonthAchievement, getHomeTodayAchievement, getHomeTodayOrderValue } from 'services/authService';
import { IDashboardData } from 'types/Dashboard';
interface DataType {
    key: string;
    pStore: string;
    vStore: string;
    nStore: string;
}
export const Home = () => {
    const [todayAchieveData, setTodayAchieveData] = useState<any>();
    const [todayOrderData, setTodayOrderData] = useState<any>();
    const [monthlyAchieveData, setMonthlyAchieveData] = useState<any>();

    // console.log({homeData})
    const dispatch = useDispatch();
    async function fetchTodayAchievement() {
        try {
          dispatch(setLoaderAction(true));
          const res = await getHomeTodayAchievement();
          setTodayAchieveData(res?.data?.data)
          dispatch(setLoaderAction(false));
        } catch (error) {
          dispatch(setLoaderAction(false));
        }
      }
      async function fetchOrderValue() {
        try {
          dispatch(setLoaderAction(true));
          const res = await getHomeTodayOrderValue();
          setTodayOrderData(res?.data?.data)
          dispatch(setLoaderAction(false));
        } catch (error) {
          dispatch(setLoaderAction(false));
        }
      }
      async function fetchMonthAchievement() {
        try {
          dispatch(setLoaderAction(true));
          const res = await getHomeMonthAchievement();
          setMonthlyAchieveData(res?.data?.data)
          dispatch(setLoaderAction(false));
        } catch (error) {
          dispatch(setLoaderAction(false));
        }
      }
    useEffect(() => {
       
        fetchTodayAchievement();
        fetchOrderValue();
        fetchMonthAchievement();
      }, []);

      const getValueTargetPercent = useMemo(() => {
        if (monthlyAchieveData?.valueTarget && monthlyAchieveData?.valueTarget.target > 0) {
          const r = (monthlyAchieveData?.valueTarget?.achieved / monthlyAchieveData?.valueTarget?.target) * 100;
          return  r.toFixed(2)
        }
        return 0;
      }, [monthlyAchieveData?.valueTarget])
    
      const getStoreTargetPercent = useMemo(() => {
        if (monthlyAchieveData?.storeTarget && monthlyAchieveData?.storeTarget?.target > 0) {
          const r = (monthlyAchieveData?.storeTarget.achieved / monthlyAchieveData?.storeTarget?.target) * 100;
          return  r.toFixed(2)
        }
        return 0;
      }, [monthlyAchieveData?.storeTarget])
    
      const getOrderCollectionPercent = useMemo(() => {
        if (monthlyAchieveData?.collectionTarget?.target && monthlyAchieveData?.collectionTarget?.achieved) {
          const r = (monthlyAchieveData?.collectionTarget?.achieved / monthlyAchieveData?.collectionTarget?.target) * 100;
          return r.toFixed(2)
        }
        return 0;
      }, [monthlyAchieveData?.storeTarget])
    
    const todayDate = new Date();
    const options: any = {
        weekday: 'long', // "Sunday"
        day: '2-digit', // "21"
        month: 'long', // "July"
        year: 'numeric' // "2024"
    };

    const formattedDateParts: any = new Intl.DateTimeFormat('en-IN', options).formatToParts(todayDate);
    const formattedDate: any = `${formattedDateParts.find((part: any) => part.type === 'weekday').value}, ` +
        `${formattedDateParts.find((part: any) => part.type === 'day').value} ` +
        `${formattedDateParts.find((part: any) => part.type === 'month').value}, ` +
        `${formattedDateParts.find((part: any) => part.type === 'year').value}`;

    const columns1: ColumnsType<DataType> = [
        {
            title: 'Planned Stores',
            dataIndex: 'pStore',
            key: 'pStore',
            width: "33.33%",
            render: text => <Link to="/visit"><div style={{color: "blue", textAlign: 'center', padding:"0px!important" }}>{todayAchieveData?.plannedStores}</div></Link> ,
        },
        {
            title: 'Visited Stores',
            dataIndex: 'vStore',
            key: 'vStore',
            width: "33.33%",
            render: text => <Link to="/visit?visited=true"><div style={{color: "blue", textAlign: 'center' }}>{todayAchieveData?.visitedStores}</div></Link>,
        },
        {
            title: 'New Stores',
            dataIndex: 'nStore',
            key: 'nStore',
            width: "33.33%",
            render: text => <Link to="/stores?newStore=true"><div style={{color: "blue", textAlign: 'center' }}>{todayAchieveData?.newStores}</div></Link>,
        },
    ];
    const columns2: ColumnsType<DataType> = [
        {
            title: 'Total Orders',
            dataIndex: 'tOrder',
            key: 'tOrder',
            width: "33.33%",
            render: text => <Link to="/order?duration=today"><div style={{color: "blue", textAlign: 'center', padding:"0px!important" }}>{todayAchieveData?.totalOrder}</div></Link>,
        },
        {
            title: 'Visit Orders',
            dataIndex: 'vOrder',
            key: 'vOrder',
            width: "33.33%",
            render: text => <Link to={`/order?duration=today&orderType=${VisitTypeEnum.PHYSICAL}`} style={{color: "blue", textAlign: 'center' }}><div style={{ textAlign: 'center' }}>{todayAchieveData?.visitOrder}</div></Link>,
        },
        {
            title: 'Phone Orders',
            dataIndex: 'pOrder',
            key: 'pOrder',
            width: "33.33%",
            render: text => <Link to={`/order?duration=today&orderType=${VisitTypeEnum.TELEVISIT}`}><div style={{color: "blue", textAlign: 'center' }}>{todayAchieveData?.phoneOrder}</div></Link>,
        },
    ];
    const columns3: ColumnsType<DataType> = [
        {
            title: 'Visit Orders Value',
            dataIndex: 'vOrderValue',
            key: 'vOrderValue',
            width: "50%",
            render: text => <div style={{ textAlign: 'center', padding:"0px!important" }}><RupeeSymbol/>{todayOrderData?.visitOrder??0}</div>,
        },
        {
            title: 'Phone Orders Value',
            dataIndex: 'pOrderValue',
            key: 'pOrderValue',
            width: "50%",
            render: text => <div style={{ textAlign: 'center' }}><RupeeSymbol/>{todayOrderData?.phoneOrder??0}</div>,
        },
       
    ];
    const columns4: ColumnsType<DataType> = [
        {
            title: 'Sales Target',
            dataIndex: 'sTarget',
            key: 'sTarget',
            width: "33.33%",
            render: text => <div style={{ textAlign: 'center', padding:"0px!important" }}>{`${getValueTargetPercent}%`}</div>,
        },
        {
            title: 'Store Target',
            dataIndex: 'oTarget',
            key: 'oTarget',
            width: "33.33%",
            render: text => <div style={{ textAlign: 'center' }}>{`${getStoreTargetPercent}%`}</div>,
        },
        {
            title: 'Collection Target',
            dataIndex: 'cTarget',
            key: 'cTarget',
            width: "33.33%",
            render: text => <div style={{ textAlign: 'center' }}>{`${getOrderCollectionPercent}%`}</div>,
        },
    ];
    const todayAchievementStores: any = [
        {
            pStore: 12,
            vStore: 8,
            nStore: 3
        }
    ]
    const todayAchievementOrders: any = [
        {
            tOrder: 10,
            vOrder: 10,
            pOrder: 20
        }
    ]
    return (
        <div className="mrBtmMob" style={{background: "#f0f2f7", height: "100vh"}}>
        <div className="homeDesk">
        
           <div className='homeDeskContainer'>
             <div style={{  fontSize: "18px", fontWeight: "bold", marginBottom: "10px", paddingTop: "50px" }} className='dflex-center'>
                <div className="adminH">{formattedDate}</div>

            </div>
            {/* <div className='dflex-center' style={{ margin: "0 20px 0 20px" }}>
                <div style={{ background: "green", width: "100%", height: "60px", flexDirection: "column", gap: "7px" }} className='dflex-center'>
                    <span style={{ color: "white", fontSize: "15px", fontWeight: 500 }}>CHECK-IN</span>
                    <button style={{ background: "white", color: "black", borderRadius: "0px", fontSize: "11px", padding: "3px 10px" }}>Check-in</button>
                </div>
                <div style={{ background: "#C65911", width: "100%", height: "60px", flexDirection: "column", gap: "7px" }} className='dflex-center'>
                    <span style={{ color: "white", fontSize: "15px", fontWeight: 500 }}>CHECK-OUT</span>
                    <button style={{ background: "white", color: "black", borderRadius: "0px", fontSize: "11px", padding: "3px 10px" }}>Check-out</button>

                </div>
            </div> */}
            <AttendanceModal/>

            </div>
            <div className='homeDeskContainer'>
            <div>
            <div style={{ background: "rgb(7, 13, 121)",color:"white",height:"30px", padding: "5px", margin: "8px 0 10px 0", fontWeight: 500, fontSize: "16px" }} className='dflex-center'>
                Today's Achievements
            </div>
            <div style={{ margin: "0 16px 10px 16px", textAlign: "center" }}>
                <Table columns={columns1}
                    dataSource={
                        todayAchievementStores?.map((data: any, index: any) => ({
                            key: index,
                            pStore: data?.pStore,
                            vStore: data?.vStore,
                            nStore: data?.nStore,
                        }))
                    }
                    size="small" pagination={false}
                    rowClassName={"rowClassName"}
                
                />
                </div>

                <div style={{ margin: "0 16px 0 16px", textAlign: "center" }}>
                <Table columns={columns2}
                    dataSource={
                        todayAchievementStores?.map((data: any, index: any) => ({
                            key: index,
                            tOrder: data?.tOrder || 8,
                            vOrder: data?.vOrder || 5,
                            pOrder: data?.pOrder || 3,
                        }))
                    }
                    size="small" pagination={false}
                    rowClassName={"rowClassName"}

                />
                </div>
                </div>
                </div>
                <div className='homeDeskContainer'>
                <div>
                <div style={{ background: "rgb(7, 13, 121)",color:"white",height:"30px", padding: "5px", margin: "8px 0 10px 0", fontWeight: 500, fontSize: "16px" }} className='dflex-center'>
                Today's Order Value
            </div>
            <div className='dflex-center' style={{marginBottom:"6px", fontWeight:"bold"}}>
                <RupeeSymbol/>{`${todayOrderData?.totalOrder??0}`}
            </div>
            <div style={{ margin: "0 16px 10px 16px", textAlign: "center" }}>
                <Table columns={columns3}
                    dataSource={
                        todayAchievementOrders?.map((data: any, index: any) => ({
                            key: index,
                            vOrderValue: data?.pStore || "10,000/=",
                            pOrderValue: data?.vStore || "2,800/=",
                        }))
                    }
                    size="small" pagination={false}
                    rowClassName={"rowClassName"}

                />
                </div>
                </div>
                </div>
                <div className='homeDeskContainer'>
                <div>
                <div style={{ background: "rgb(7, 13, 121)",color:"white", padding: "5px",height:"30px", margin: "8px 0 10px 0", fontWeight: 500, fontSize: "16px" }} className='dflex-center'>
                Current Month Achievements
            </div>
            <div style={{ margin: "0 16px 8px 16px", textAlign: "center" }}>
                <Table columns={columns4}
                    dataSource={
                        todayAchievementStores?.map((data: any, index: any) => ({
                            key: index,
                            sTarget: "30%",
                            oTarget: "25%",
                            cTarget: "40%",
                        }))
                    }
                    size="small" pagination={false}
                    rowClassName={"rowClassName"}
                />
                </div>
                </div>
                </div>
                {/* </div> */}
                <Link to="/dashboard" className='linkto' style={{width:"100%"}}><div style={{background:"#6b0e80", height:"30px", padding:"8px", fontWeight:"600", color:"white"}} className='dflex-center'>
                  <span>Dashboard</span>
                </div></Link>
                <style>
                    {`
                    .rowClassName{
                    padding: 3px!important
                    }
                    .ant-table-tbody > tr > td {
    padding: 3px!important; /* Adjust the padding as needed */
}
    :where(.css-dev-only-do-not-override-af4yj3).ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, :where(.css-dev-only-do-not-override-af4yj3).ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th{
    padding: 3px!important;
    padding-left: 4px!important;
    text-align: center
    }
    :where(.css-dev-only-do-not-override-af4yj3).ant-table-wrapper .ant-table-thead >tr>th{
        background-color:#b5b7e4;
        fontSize:"10px"
     }
    :where(.css-af4yj3).ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, :where(.css-dev-only-do-not-override-af4yj3).ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th{
      padding: 3px!important;
      padding-left: 4px!important;
      text-align: center
    }
    :where(.css-af4yj3).ant-table-wrapper .ant-table-thead >tr>th{
      background-color:#b5b7e4;
      fontSize:"10px"
                    }
                    `}
                </style>
        </div>
        </div>
    )
}
