import React, { useEffect, useMemo, useState } from 'react'
import '../style/createBeat.css'
import Footer from '../common/footer'
import previousPage from 'utils/previousPage'
import { ArrowLeftOutlined, DeleteOutlined, FormOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ITargetData } from 'types/Dashboard'
import { setLoaderAction } from 'redux-store/action/appActions'
import { deleteTargetService, getTargetService } from 'services/dashboardService'
import { formattedAmount, monthFormatter } from 'utils/common'
import { capitalizeFirstLetter, capitalizeSubstring } from 'utils/capitalize'
import DeleteItem from 'component/admin/common/deleteItem'
import Table, { ColumnGroupType, ColumnsType } from 'antd/es/table'
import { Cascader, Select } from 'antd'
import RupeeSymbol from 'component/RupeeSymbol'
import GaugeChart from 'react-gauge-chart'
import { getUsersActions } from 'redux-store/action/usersAction'
import { AppDispatch } from 'redux-store/store'
import { useAuth } from 'context/AuthContext'
import { TimelineEnum, UserRole } from 'enum/common'
import { axisLeft } from 'd3'
import { getRoleService } from 'services/usersSerivce'


interface DataType {
  key: string;
  salesRep: string;
  my: string;
  storeTarget: string;
  storeAchievement: string;
  orderTarget: string;
  orderAchievement: string;
  collectionTarget: string;
  collectionAchievement: string;
}

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

export default function TargetDataTable() {
  const { authState } = useAuth();
  const [targetData, setTargetData] = useState<ITargetData[]>();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [dataRole, setDataRole] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
        try {
            dispatch(setLoaderAction(true));
            setIsLoading(true)
            const res = await getRoleService({isActive:true});
            if (res?.data?.status === 200) {
              const d = res?.data?.data
              .filter((d: any) => (d?.key === "da693r2" || d?.key === "da693r6") && d?.isActive === true)
              .map((d: any) => {
                // Add dynamic values based on the `key`
                let dynamicValue;
                
                if (d?.key === "da693r2") {
                  dynamicValue = UserRole.SSM;
                } else if (d?.key === "da693r6") {
                  dynamicValue = UserRole.RETAILER;
                }
            
                // Return the updated object with a new key-value pair
                return {
                  ...d,                 // Spread the original object
                  roleEnum: dynamicValue   // Add the dynamic value based on the `key`
                };
              });
              setDataRole(d);
                dispatch(setLoaderAction(false));
                setIsLoading(false)
            }
            setIsLoading(false)
            dispatch(setLoaderAction(false));
        } catch (error) {
            dispatch(setLoaderAction(false));
            setIsLoading(false)
        }
    }
    fetchData();
}, []);
  const usersSSM = useSelector((state: any) => state?.users?.usersSSM);
  const [isSelectedRole, setIsSelectedRole] = useState<any>(true);
  const [selectedRole, setSelectedRole] = useState<any>( authState?.user?.role === UserRole.RETAILER ? true : authState?.user?.role === UserRole.SSM ? UserRole.SSM : null);

    const handleRoleChange = (selectedOption: any) => {
        setIsSelectedRole(false);
        setSelectedRole(selectedOption)
        // setSelectedExecutive(selectedOption)
    };
  // Use useMemo to filter users with role 'SSM'
  const usersSSMList = useMemo(() => {
  const filteredUsers = usersSSM?.filter((data: any) => (selectedRole === UserRole.SSM ? data.role === UserRole.SSM : data.role === UserRole.RETAILER) ) || [];
  const sortedUsers = filteredUsers.sort((a: any, b: any) => {
     return a?.name?.localeCompare(b?.name)
  });

  return sortedUsers;
  }, [usersSSM, selectedRole]);


 
  const [selectedExecutive, setSelectedExecutive] = useState<any>("ALL");
  useEffect(()=>{
    if(authState?.user?.role === UserRole.SSM || authState?.user?.role === UserRole.RETAILER){
      setSelectedExecutive(authState?.user?.id)
    }
  }, [])
  
  // const [timeline, setTimeline] = useState<any>(null);

  useEffect(() => {
    dispatch(getUsersActions());
}, []);
  const handleExecutiveChange = (value: any) => {
      setSelectedExecutive(value);
  };
  const currentDate = new Date();

  const currentMonthIndex = currentDate.getMonth();
  const monthText = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const quarterMonthText = ["april", "may", "june", "july", "august", "september", "october", "november", "december", "january", "february", "march"];
  const currMonth = monthText[currentMonthIndex];
  const currMonthIdx = quarterMonthText.indexOf(currMonth);
  const today = new Date();
  let currentYear = today.getFullYear();
  currentYear = today.getMonth() < 3 ? currentYear - 1 : currentYear;
  const [timeline, setTimeline] = useState<any>();
  const quarterText = ["Q1", "Q2", "Q3", "Q4"];
 
  
  const startYear = 2023;
  const yearText: number[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    yearText.push(year);
  }
  const quartersToShow = Math.ceil((currMonthIdx + 1) / 3);

  const options: Option[] = [
    
    {
      value: TimelineEnum.QUARTER,
      label: 'Quarter',
      children: quarterText?.slice(0,quartersToShow)?.map((data): Option => {
        return {
          value: data,
          label: capitalizeFirstLetter(data)
        };
      }),
    },
    {
      value: TimelineEnum.YEAR,
      label: 'Year',
      children: yearText?.reverse()?.map((data:any): Option => {
        return {
          value: data,
          label: data
        };
      }),
    },
  ];

  const [memoCheck, setMemoCheck] = useState<boolean>(false)
  const handleTimelineChange : any= (value: any) => {
    setMemoCheck(true)
    setTimeline(value);
  };

  useEffect(() => {
    async function fetchTargetData() {
      try {
        dispatch(setLoaderAction(true));
        setIsLoading(true);
        const res = await getTargetService(timeline);
        setTargetData(res.data.data)
        dispatch(setLoaderAction(false));
        setIsLoading(false);

      } catch (error) {
        dispatch(setLoaderAction(false));
      }
    }
    fetchTargetData();
  }, [timeline]);
  let usersList:any = []
 usersList.push(usersSSMList.map((d:any)=>d?.emp_id))
  const dataSource = useMemo(() => {
    let filteredData: any =  [];
    if(authState?.user?.role === UserRole.SSM || authState?.user?.role ===  UserRole.RETAILER){
      filteredData =  targetData?.filter((data: any) => data?.target?.empId === authState?.user?.id) 
    }else{
      if(selectedExecutive !== "ALL"){
        filteredData =  targetData?.filter((data: any) => data?.target?.empId === selectedExecutive) 
      }else{
  filteredData = targetData?.filter((data: any) => usersList[0]?.includes(data?.target?.empId)); 

      }
    }
    let quarterMonths:any = {
      Q1: [4, 5, 6],  
      Q2: [7, 8, 9],  
      Q3: [10, 11, 12], 
      Q4: [1, 2, 3] 
    };
      // Determine the month indices for the selected quarter
      const selectedMonths:any = timeline ? quarterMonths[timeline[1]] : [];     
    return filteredData?.map((data:any, index:any) => {
       let filteredAllTarget:any = data?.target?.allTarget ?? [];
     if(timeline && timeline[0] === TimelineEnum.QUARTER){ 
       filteredAllTarget = data?.target?.allTarget?.filter((item: any, index:any) => {
        const itemDate = new Date(item?.month);
        const month = itemDate.getMonth() + 1;
        if(selectedMonths.includes(month)){
        return item;
        }
      });
    }
    // console.log({filteredAllTarget})
        
     return{
      key: index,
      salesRep: capitalizeSubstring(`${data?.target?.firstname} ${data?.target?.lastname}`),
      my: data?.timeline,
      empId: data?.target?.empId,
      storeTarget: filteredAllTarget?.reduce((acc: any, item: any) => acc + Number(item.storeTarget || 0), 0),
      storeAchievement: data?.achievedStores,
      orderTarget: filteredAllTarget?.reduce((acc: any, item: any) => acc + Number(item.orderTarget || 0), 0),
      orderAchievement: +data?.target?.totalAmount,
      collectionTarget: filteredAllTarget?.reduce((acc: any, item: any) => acc + Number(item.collectionTarget || 0), 0),
      collectionAchievement: +data?.target?.totalCollectedAmount,
    }}) || [];
  }, [targetData, selectedExecutive, timeline, memoCheck, usersList]);
  const totalStoreTarget = dataSource?.reduce((acc:any, item:any) => acc + Number(item.storeTarget || 0), 0);
  const totalStoreAchievement = dataSource?.reduce((acc:any, item:any) => acc + Number(item.storeAchievement || 0), 0);
  const totalOrderTarget = dataSource?.reduce((acc:any, item:any) => acc + Number(item.orderTarget || 0), 0);
  const totalOrderAchievement = dataSource?.reduce((acc:any, item:any) => acc + Number(item.orderAchievement || 0), 0);
  const totalCollectionTarget = dataSource?.reduce((acc:any, item:any) => acc + Number(item.collectionTarget || 0), 0);
  const totalCollectionAchievement = dataSource?.reduce((acc:any, item:any) => acc + Number(item.collectionAchievement || 0), 0);
  const dataSourceWithTotals: any = [
    ...dataSource
  ];
  let totalValue: any = {}

  if (dataSourceWithTotals && dataSourceWithTotals?.length > 0) {
    totalValue = {
      key: 'total',
      salesRep: 'Total',
      my: '',
      // empId: ,
      orderTarget: totalOrderTarget,
      orderAchievement: totalOrderAchievement,
      storeTarget: totalStoreTarget,
      storeAchievement: totalStoreAchievement,
      collectionTarget: totalCollectionTarget,
      collectionAchievement: totalCollectionAchievement.toFixed(2)
    }
    dataSourceWithTotals.push(totalValue)
  }
  // if(dataSourceWithTotals && dataSourceWithTotals?.length >0 ){
  //    `${<LoadingOutlined />}`
  // }else{}
  const rowClassName = (record: any, index: any) => {
    if (index === dataSourceWithTotals.length - 1) {
      return 'grey-background';
    }
    return '';
  };
  const getOrderCollectionPercent = useMemo(() => {
    // if (totalOrderTarget || totalOrderAchievement) {
      const r = (Number(totalCollectionAchievement) / Number(totalCollectionTarget));
      return r > 1 ? 1 : isNaN(r) ? 0 : r
    // }
    // return 0;
  }, [totalCollectionTarget, totalCollectionAchievement])

  const getValueTargetPercent = useMemo(() => {
    // if (totalOrderAchievement  && totalOrderTarget) {
      const r = (Number(totalOrderAchievement) / Number(totalOrderTarget));
      return r > 1 ? 1 :isNaN(r) ? 0 : r
    // }
    // return 0;
  }, [totalOrderAchievement])

  const getStoreTargetPercent = useMemo(() => {
    // if (totalStoreAchievement && totalStoreTarget) {
      const r = Number(totalStoreAchievement) / Number(totalStoreTarget);
      return r > 1 ? 1 : isNaN(r) ? 0 : r
    // }
    // return 0;
  }, [totalStoreAchievement])
  const getTextColor = (percent: any) => {
    if (percent < 0.25) return "#b54e45"; // Red
    if (percent < 0.50) return "#f5c966"; // Yellow
    if (percent < 0.75) return "#8abc5b"; // Light Green
    return "#4f8a5c"; // Dark Green
  };

  const columns: any = [
    ...(authState?.user?.role !== UserRole.RETAILER ? [{
      title: 'Sales Rep',
      dataIndex: 'salesRep',
      key: 'salesRep',
      width: 160,
      fixed: "left",
      render: (text: any, record: any) => {
        if (record.key === 'total') {
          return {
            children: <span className='dflex-center' style={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.88)", textAlign: "center" }}>{text}</span>,
            props: {
              colSpan: 2, // Merge this cell with the next one
            },
          };
        }
        return (authState?.user?.role === UserRole.SSM || authState?.user?.role === UserRole.RETAILER) ? <span style={{color:"blue"}}>{text}</span>:<Link to={`/target-achievement?userId=${record?.empId}`}>{text}</Link>;
      },
    }]:[]),
    {
      title: 'M-Y',
      dataIndex: 'my',
      key: 'my',
      render: (text: any, record: any) => {
        if (record.key === 'total') {
          return {
            children: text,
            props: {
              colSpan:  authState?.user?.role === UserRole.RETAILER ? 1 : 0, // Hide this cell as it is merged with the previous one
            },
          };
        }
        return text;
      },
      width: 120
    },
    ...(authState?.user?.role !== UserRole.RETAILER && selectedRole !== UserRole.RETAILER? [{
      title: 'New Store',
      children: [
        {
          title: 'Target',
          dataIndex: 'storeTarget',
          key: 'storeTarget',
          width: 90,
        },
        {
          title: 'Achievement',
          dataIndex: 'storeAchievement',
          key: 'storeAchievement',
          width: 110,
        },
      ],
    }]:[]),
    {
      title: 'New Order Value',
      children: [
        {
          title: 'Target',
          dataIndex: 'orderTarget',
          key: 'orderTarget',
          width: 90,
        },
        {
          title: 'Achievement',
          dataIndex: 'orderAchievement',
          key: 'orderAchievement',
          width: 110,
        },
      ],
    },
    ...(authState?.user?.role !== UserRole.RETAILER && selectedRole !== UserRole.RETAILER ? [  {
      title: 'Collection',
      children: [
        {
          title: 'Target',
          dataIndex: 'collectionTarget',
          key: 'collectionTarget',
          width: 90,
        },
        {
          title: 'Achievement',
          dataIndex: 'collectionAchievement',
          key: 'collectionAchievement',
          width: 110,
        },
      ],
    }]:[]),
  ];
 
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Target Vs Achievement</h1>
      </header>
      {(authState?.user?.role !== UserRole.SSM && authState?.user?.role !== UserRole.RETAILER) && <Link to="/target-achievement">
        <div className="addIcon">
          <PlusOutlined className="plusIcon" />
        </div>
      </Link>}
    
      <main className='content' style={{marginBottom:"40px"}}>
        <div className="target-filter ">
          <div className="brand" style={{ paddingLeft: "0px" }}>
            <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Target Period: </span>

              <Cascader defaultValue={['Year', String(currentYear)]} options={options}  placeholder="Please select"  onChange={handleTimelineChange}  />
            
          </div>
          {authState?.user?.role !== UserRole.RETAILER && authState?.user?.role !== UserRole.SSM && <div className="brand" style={{ paddingLeft: "0px" }}>
            <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Role: </span>
                        <Select
                            placeholder="Select Role"
                            onChange={handleRoleChange}
                            options ={ dataRole.map((data: any) => ({
                              label: data?.name,  
                              value: data?.roleEnum  
                            }))}
                            
                        />
          </div>}
          <div className="category"  >
            <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Executive: </span>
           {authState?.user?.role === UserRole.SSM || authState?.user?.role === UserRole.RETAILER ? 
           <Select
           placeholder="Select Executive"
           onChange={handleExecutiveChange}
           defaultValue={`${authState?.user?.name} (${authState?.user?.role})`} 
           options={
            []
         }
         className='selectTargetFil'
         />
           :
           <>
          
           <Select
              placeholder="Select Executive"
              onChange={handleExecutiveChange}
              defaultValue={"ALL"} 
              options={
               [{label: "ALL", value: "ALL"}, ...usersSSMList?.map((data: any) => ({
                label: `${capitalizeSubstring(data?.name)}  (${data?.role})`,
                value: data?.emp_id,
              }))]
            }
            className='selectTargetFil'
            disabled={isSelectedRole}
            // style={{width:"100%"}}
            /></>
           }
            
          </div>

        </div>
       {selectedRole && <div>
        <div className="chartDirection" style={{width:"100%", marginBottom: "10px", marginTop: "20px", display:"flex", justifyContent: "" }}>
          <div className='chartbg' style={{ marginTop: "0", background: "#f0f2f7" }}>
            <div className="chartContainer">
              <span>Achieved</span>
              <span><RupeeSymbol />{formattedAmount(totalOrderAchievement)}</span>
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
              <span>{authState?.user?.role === UserRole.RETAILER  ? "Order Value":"Sales Target"}</span>
              <div className="valueTarTxt">
                <span>Target</span>
                <span><RupeeSymbol />{formattedAmount(totalOrderTarget)}</span>
              </div>
            </div>
          </div>
          {( (authState?.user?.role === UserRole.RETAILER || selectedRole) && selectedRole !== UserRole.SSM )&&  <div style={{ position: 'relative'}} className='retailorTarget'>
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              // backgroundColor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}>
              <LoadingOutlined />
            </div>
          )}
         { selectedRole !== UserRole.SSM && 
         <Table
            columns={columns}
            dataSource={
              isLoading ? [] : dataSourceWithTotals
            }
            rowClassName={rowClassName}
            scroll={{x:"100%"}}
            size="small"
            pagination={false}
          />}
        </div>}
          {authState?.user?.role !== UserRole.RETAILER && selectedRole === UserRole.SSM &&<><div className="chartbg" style={{ background: "#f0f2f7" }}>
            <div className="chartContainer">
              <span>Achieved</span>
              <span>{totalStoreAchievement ?? 0}</span>
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
                <span>{totalStoreTarget ?? 0}</span>
              </div>
            </div>
          </div>
          <div className="chartbg" style={{ background: "#f0f2f7" }}>
            <div className="chartContainer">
              <span>Achieved</span>
              <span><RupeeSymbol />{formattedAmount(totalCollectionAchievement)}</span>
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
                <span><RupeeSymbol />{formattedAmount(totalCollectionTarget)}</span>
              </div>
            </div>
          </div>
          </>
          }

        </div>
        {( selectedRole  )&& selectedRole === UserRole.SSM && authState?.user?.role !== UserRole.RETAILER &&
        <div style={{ position: 'relative' }}>
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              // backgroundColor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}>
              <LoadingOutlined />
            </div>
          )}
          <Table
            columns={columns}
            dataSource={
              isLoading ? [] : dataSourceWithTotals
            }
            rowClassName={rowClassName}
            scroll={{x:"100%"}}
            size="small"
            pagination={false}
          
          />
        </div>}
        </div>}
      </main>
      <Footer />
      <style>
        {`
                .grey-background {
                    background-color: #fafafa;
                    font-weight: 600;
                    color: rgba(0, 0, 0, 0.88);
                   }
                `}
      </style>
    </div>

  )
}