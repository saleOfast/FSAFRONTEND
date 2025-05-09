import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Input, Select, Table } from 'antd'
import { useAuth } from 'context/AuthContext'
import { UserRole } from 'enum/common'
import React, { Children, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLoaderAction } from 'redux-store/action/appActions'
import { AppDispatch } from 'redux-store/store'
import { getDayTrackingReportSerice } from 'services/visitsService'
import { capitalizeSubstring } from 'utils/capitalize'
import { dateFormatter, dateFormatterNew, downloadPDF, exportToExcel } from 'utils/common'
import previousPage from 'utils/previousPage'
import ReactPDF, { Page, Text, View, Document, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { getPendingCollectionReportService } from 'services/orderService'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon';
import { getStoreService } from 'services/storeService'
const filterDetails: any = {
    storeType: "all",
    // isUnbilled: false,
  }
// export const PendingCollectionReport = () => {
//     const [trackingData, setTrackingData] = useState<any>([]);
//     const[storeData,setStoreData]=useState<any>([]);
//     const dispatch = useDispatch<AppDispatch>();

//     const { authState } = useAuth()
//     const [selectedExecutive, setSelectedExecutive] = useState<any>("ALL");
  
//     console.log(storeData,"storeDatastoreDatastoreDatastoreData")
//     const [timePeriod, setTimePeriod] = useState<any>()
//     function filterByDate(e: any) {
//         let endTimeline = new Date(e?.target?.value)
//         let date = endTimeline?.toISOString();
//         setTimePeriod(date)
//     }

    
//     const handleDayTrackingData = async () => {
//         try {
//             dispatch(setLoaderAction(true));
//             const response = await getPendingCollectionReportService();
//             dispatch(setLoaderAction(false));
//             if (response && response.status === 200) {
//                 let { data } = response.data;
//                 setTrackingData(data);
//             }
//         } catch (error) {
//             dispatch(setLoaderAction(false));
//         }
//     }
//     useEffect(() => {
//         handleDayTrackingData();
//     }, [timePeriod]);
//     const handleExecutiveChange = (value: any) => {
//         setSelectedExecutive(value);
//     };
//     let uniqueUsers = Array.from(new Set(trackingData.map((data: any) => data.empId)))
//         .map(id => trackingData.find((data: any) => data.empId === id)).sort((a: any, b: any) => {
//             return a?.firstname?.localeCompare(b?.firstname);
//         })

//     const optionsUser: any = [
//         { label: "ALL", value: "ALL" },
//         ...uniqueUsers.map(data => ({
//             label: capitalizeSubstring(`${data?.firstname} ${data?.lastname}`),
//             value: data?.empId,
//         }))
//     ];
   
//     // import { DateTime } from 'luxon'; // Assuming you're using luxon for date handling

// // Function to calculate dues status based on paymentMode and createdAt
// function calculateDuesStatus(paymentMode: string | null, createdAt: string): string {
//     // Return blank string if paymentMode is null or empty
//     if (!paymentMode || paymentMode.trim() === '') {
//         return '';
//     }
//     let days = 0;
//     if (paymentMode.toLowerCase() === 'cod') {
//         days = 0;
//     } else {
//         days = parseInt(paymentMode.match(/\d+/)?.[0] || '0', 10);
//     }
//     const createdDate = DateTime.fromISO(createdAt);
//     const dueDate = createdDate.plus({ days });
//     const currentDate = DateTime.now();
//     if (currentDate > dueDate) {
//         return 'Overdue';
//     } else {
//         return 'Pending';
//     }
// }

//     const dataSourceWithTotals =
//         trackingData?.filter((data: any) => authState?.user?.role === UserRole.SSM ? data?.empId === authState?.user?.id : (selectedExecutive === "ALL" || data?.empId === selectedExecutive))?.map((data: any, idx:any) => ({
//             empId: data?.empId,
//             empName: capitalizeSubstring(`${data?.firstname} ${data?.lastname}`) ?? "",
//             storeName: capitalizeSubstring(data?.storeName),
//             storeId:data.storeId,
//             pendingAmount: data?.pendingAmount,
//             orderId: data?.orderId,
//             orderDate: dateFormatterNew(data?.createdAt),
//             key: `pendColl_${idx}`,
//             due: calculateDuesStatus(data?.paymentMode, data?.createdAt)
//         }))
//         const columns: any = [
//            ...(authState?.user?.role !== UserRole.RETAILER ? [{
//                 title: 'Emp ID',
//                 dataIndex: 'empId',
//                 key: 'empId',
//                 fixed: "left",
//                 width: 80,
//             },
//             {
//                 title: 'Emp Name',
//                 dataIndex: 'empName',
//                 key: 'empName',
//                 width: 160,
                
//             }]:[]),
//             {
//               title: 'Store Name',
//               dataIndex: 'storeName',
//               key: 'storeName',
//               width: 130,
    
//           },
//           {
//             title: 'order Id',
//             dataIndex: 'orderId',
//             key: 'orderId',
//             width: 130,
//             render: (text: any, record: any) => {
//                 return <Link to={`/order/order-summary/${record?.orderId}`}>{text}</Link>;
//               },
//         },
//         {
//             title: 'Order Date',
//             dataIndex: 'orderDate',
//             key: 'orderDate',
//             width: 130,
  
//         },
//         {
//             title: 'Due Status',
//             dataIndex: 'due',
//             key: 'due',
//             width: 130,
//             render: (text: any, record: any) => {
//                 return  <span style={{color: text === "Overdue" ? "red" : "orange", fontWeight:"500"}}>{text}</span>
//               },
//         },
//             {
//                 title: 'Total Pending Amount',
//                 dataIndex: 'pendingAmount',
//                 key: 'pendingAmount',
//                 width: 130,
    
//             },
            
//         ];
//     const [minDate, setMinDate] = useState('');
//     const [maxDate, setMaxDate] = useState('');

//     useEffect(() => {
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//         // Set the start of the current month
//         const startOfMonth = `${year}-${month}-01`;
//         setMinDate(startOfMonth);

//         // Set the end of the current month
//         const endOfMonth = new Date(year, now.getMonth() + 1, 0).getDate();
//         const endOfMonthDate = `${year}-${month}-${String(endOfMonth).padStart(2, '0')}`;
//         setMaxDate(endOfMonthDate);
//     }, []);

//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const day = String(now.getDate()).padStart(2, '0'); // Day of the month

//     // Format the date as YYYY-MM-DD
//     const formattedTodayDate = `${year}-${month}-${day}`;
//     const styles = StyleSheet.create({
//         page: {
//             flexDirection: 'row',
//             backgroundColor: '#E4E4E4'
//         },
//         section: {
//             margin: 10,
//             padding: 10,
//             flexGrow: 1
//         }
//     });
//     useEffect(()=>{
//         getStore()

//     },[])
//     const getStore=async()=>{

//         try {
//              dispatch(setLoaderAction(true));
//              const response=await getStoreService(filterDetails,{pageNumber:1,pageSize:100})
//              dispatch(setLoaderAction(false));
//              if(response && response.status===200)
//              {
//                 let{data}=response.data;
//                 setStoreData(data.stores)

//              }
//         } catch (error) {
//             dispatch(setLoaderAction(false))
            
//         }
       
//     }

   
//     return (
//         <div>
//             <div>
//                 <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
//                     <ArrowLeftOutlined onClick={previousPage} className="back-button" />
//                     <h1 className="page-title pr-18">{authState?.user?.role === UserRole.RETAILER ? "Pending Payment":"Pending Collection Report"}</h1>
//                 </header>
//                 <div className="selection-line ">
//                     {/* <div className="brand" style={{ paddingLeft: "10px" }}>
//                         <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Target Period: </span>
//                         <Input
//                             type='date'
//                             className='selectTarFilt'
//                             min={minDate}
//                             max={maxDate}
//                             onChange={filterByDate}
//                             defaultValue={formattedTodayDate}
//                         />

//                     </div> */}
                    
//                     {/* medical representative */}
//                     {authState?.user?.role !== UserRole.RETAILER  && 
//                     <div className="category"  >
//                         <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Medical Representative: </span>
                        
//                         {authState?.user?.role === UserRole.SSM ?
//                             <Select
//                                 placeholder="Select Executive"
//                                 onChange={handleExecutiveChange}
//                                 defaultValue={authState?.user?.name}
//                                 options={
//                                     []
//                                 }
//                                 className='selectTarFilt'
//                             /> :
//                             <Select
//                                 placeholder="Select Executive"
//                                 onChange={handleExecutiveChange}
//                                 defaultValue={"ALL"}
//                                 options={
//                                     optionsUser
//                                 }
//                                 className='selectTarFilt'
//                             />
//                         }
//                     </div>}
                      
//                    {/* client  */}
//                    {authState?.user?.role !== UserRole.RETAILER  && 
//                     <div className="category"  >
//                         <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Client: </span>
//                         {
//                             <Select
//                             placeholder="Select Store"
//                             onChange={handleExecutiveChange}
//                             options={
//                                 storeData.map((store:any)=>({
//                                     label:store.storeName,
//                                     value:store.storeId


//                                 }))
//                             }
                            
//                             />
//                         }
                        
//                         {/* {authState?.user?.role === UserRole.SSM ?
//                             <Select
//                                 placeholder="Select Executive"
//                                 onChange={handleExecutiveChange}
//                                 defaultValue={authState?.user?.name}
//                                 options={
//                                     []
//                                 }
//                                 className='selectTarFilt'
//                             /> :
//                             <Select
//                                 placeholder="Select Executive"
//                                 onChange={handleExecutiveChange}
//                                 defaultValue={"ALL"}
//                                 options={
//                                     optionsUser
//                                 }
//                                 className='selectTarFilt'
//                             />
//                         } */}
//                     </div>}
//                 </div>
//                 {/* <div style={{ margin: "10px 20px" }}>
//               <Cascader defaultValue={['Year', String(currentYear)]} options={options} onChange={filterHandler} placeholder="Please select" />
//             </div> */}
//                 <main className='content' id="pdf-content" style={{ backgroundColor: '#f0f0f0', height: "auto" }}>
//                     <Table
//                         id="excel-content"
//                         dataSource={
//                             dataSourceWithTotals
//                         }
//                         title={() => (
//                             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
//                                 <img src={`${process.env.PUBLIC_URL}/logo2.png`} width={100} height="24px" alt="logo" style={{ marginRight: "auto" }} />
//                                 <div style={{ flex: 1, textAlign: 'center', fontSize: '16px', fontWeight: 'bold', marginRight: "120px" }}>
//                                 {authState?.user?.role === UserRole.RETAILER ? "Pending Payment":"Pending Collection Report"}
//                                 </div>
//                             </div>
//                         )}
//                         style={{ textAlign: "center" }}
//                         bordered
//                         columns={columns}
//                         // rowClassName={rowClassName}
//                         size="small"
//                         pagination={false}
//                         scroll={{ x: "100%" }}
//                     />
//                 </main>
//                 <div style={{ margin: "20px 0 10px 20px", fontWeight: "bold" }}>Download File</div>
//                 <Button style={{ marginLeft: "20px" }}
//                     onClick={() => downloadPDF("Pending_Collection_Report")}
//                 >PDF</Button>
//                 <Button style={{ marginLeft: "10px" }}
//                     onClick={() => exportToExcel("Pending_Collection_Report")}
//                 >Excel</Button>
//             </div>
//         </div>
//     )
// }

// ... (imports remain unchanged)

export const PendingCollectionReport = () => {
    const [trackingData, setTrackingData] = useState<any>([]);
    const [storeData, setStoreData] = useState<any>([]);
    const dispatch = useDispatch<AppDispatch>();

    const { authState } = useAuth();
    const [selectedExecutive, setSelectedExecutive] = useState<any>("ALL");
    const [selectedStore, setSelectedStore] = useState<any>("ALL");
    const [timePeriod, setTimePeriod] = useState<any>();

    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const startOfMonth = `${year}-${month}-01`;
        setMinDate(startOfMonth);

        const endOfMonth = new Date(year, now.getMonth() + 1, 0).getDate();
        const endOfMonthDate = `${year}-${month}-${String(endOfMonth).padStart(2, '0')}`;
        setMaxDate(endOfMonthDate);
    }, []);

    useEffect(() => {
        handleDayTrackingData();
    }, [timePeriod]);

    useEffect(() => {
        getStore();
    }, []);

    const filterByDate = (e: any) => {
        let endTimeline = new Date(e?.target?.value);
        let date = endTimeline?.toISOString();
        setTimePeriod(date);
    };

    const handleDayTrackingData = async () => {
        try {
            dispatch(setLoaderAction(true));
            const response = await getPendingCollectionReportService();
            dispatch(setLoaderAction(false));
            if (response && response.status === 200) {
                let { data } = response.data;
                setTrackingData(data);
            }
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    };

    const handleExecutiveChange = (value: any) => {
        setSelectedExecutive(value);
    };

    const getStore = async () => {
        try {
            dispatch(setLoaderAction(true));
            const response = await getStoreService(filterDetails, { pageNumber: 1, pageSize: 100 });
            dispatch(setLoaderAction(false));
            if (response && response.status === 200) {
                let { data } = response.data;
                setStoreData(data.stores);
            }
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    };

    const calculateDuesStatus = (paymentMode: string | null, createdAt: string): string => {
        if (!paymentMode || paymentMode.trim() === '') return '';
        let days = paymentMode.toLowerCase() === 'cod' ? 0 : parseInt(paymentMode.match(/\d+/)?.[0] || '0', 10);
        const createdDate = DateTime.fromISO(createdAt);
        const dueDate = createdDate.plus({ days });
        const currentDate = DateTime.now();
        return currentDate > dueDate ? 'Overdue' : 'Pending';
    };

    let uniqueUsers = Array.from(new Set(trackingData.map((data: any) => data.empId)))
        .map(id => trackingData.find((data: any) => data.empId === id))
        .sort((a: any, b: any) => a?.firstname?.localeCompare(b?.firstname));

    const optionsUser: any = [
        { label: "ALL", value: "ALL" },
        ...uniqueUsers.map(data => ({
            label: capitalizeSubstring(`${data?.firstname} ${data?.lastname}`),
            value: data?.empId,
        }))
    ];

    const dataSourceWithTotals =
        trackingData?.filter((data: any) => {
            console.log("===>>datatatatat", data?.storeId)
            console.log("===>>datatatatatselectedStore", selectedStore)
            const matchesExecutive = authState?.user?.role === UserRole.SSM
                ? data?.empId === authState?.user?.id
                : (selectedExecutive === "ALL" || data?.empId === selectedExecutive);
            const matchesStore = selectedStore === "ALL" || data?.storeId === selectedStore;
            return matchesExecutive && matchesStore;
        })?.map((data: any, idx: any) => ({
            empId: data?.empId,
            empName: capitalizeSubstring(`${data?.firstname} ${data?.lastname}`) ?? "",
            storeName: capitalizeSubstring(data?.storeName),
            storeId: data.storeId,
            pendingAmount: data?.pendingAmount,
            orderId: data?.orderId,
            orderDate: dateFormatterNew(data?.createdAt),
            key: `pendColl_${idx}`,
            due: calculateDuesStatus(data?.paymentMode, data?.createdAt)
        }));

    const columns: any = [
        ...(authState?.user?.role !== UserRole.RETAILER ? [
            {
                title: 'Emp ID',
                dataIndex: 'empId',
                key: 'empId',
                fixed: "left",
                width: 80,
            },
            {
                title: 'Emp Name',
                dataIndex: 'empName',
                key: 'empName',
                width: 160,
            }
        ] : []),
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'storeName',
            width: 130,
        },
        {
            title: 'Order Id',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 130,
            render: (text: any, record: any) => {
                return <Link to={`/order/order-summary/${record?.orderId}`}>{text}</Link>;
            },
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            width: 130,
        },
        {
            title: 'Due Status',
            dataIndex: 'due',
            key: 'due',
            width: 130,
            render: (text: any) => (
                <span style={{ color: text === "Overdue" ? "red" : "orange", fontWeight: "500" }}>{text}</span>
            ),
        },
        {
            title: 'Total Pending Amount',
            dataIndex: 'pendingAmount',
            key: 'pendingAmount',
            width: 130,
        },
    ];

    return (
        <div>
            <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">
                    {authState?.user?.role === UserRole.RETAILER ? "Pending Payment" : "Pending Collection Report"}
                </h1>
            </header>

            <div className="selection-line">
                {authState?.user?.role !== UserRole.RETAILER && (
                    <>
                        {/* Executive Filter */}
                        <div className="category">
                            <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>
                                Medical Representative:
                            </span>
                            {authState?.user?.role === UserRole.SSM ? (
                                <Select
                                    placeholder="Select Executive"
                                    defaultValue={authState?.user?.name}
                                    disabled
                                    className="selectTarFilt"
                                />
                            ) : (
                                <Select
                                    placeholder="Select Executive"
                                    onChange={handleExecutiveChange}
                                    defaultValue={"ALL"}
                                    options={optionsUser}
                                    className="selectTarFilt"
                                />
                            )}
                        </div>

                        {/* Store Filter */}
                        <div className="category">
                            <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>
                                Client:
                            </span>
                            <Select
                                placeholder="Select Store"
                                onChange={(value) => setSelectedStore(value)}
                                defaultValue={"ALL"}
                                options={[
                                    { label: "ALL", value: "ALL" },
                                    ...storeData.map((store: any) => ({
                                        label: store.storeName,
                                        value: store.storeId
                                    }))
                                ]}
                                className="selectTarFilt"
                            />
                        </div>
                    </>
                )}
            </div>

            <main className="content" id="pdf-content" style={{ backgroundColor: '#f0f0f0', height: "auto" }}>
                <Table
                    id="excel-content"
                    dataSource={dataSourceWithTotals}
                    title={() => (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <img src={`${process.env.PUBLIC_URL}/logo2.png`} width={100} height="24px" alt="logo" />
                            <div style={{ flex: 1, textAlign: 'center', fontSize: '16px', fontWeight: 'bold', marginRight: "120px" }}>
                                {authState?.user?.role === UserRole.RETAILER ? "Pending Payment" : "Pending Collection Report"}
                            </div>
                        </div>
                    )}
                    style={{ textAlign: "center" }}
                    bordered
                    columns={columns}
                    size="small"
                    pagination={false}
                    scroll={{ x: "100%" }}
                />
            </main>

            <div style={{ margin: "20px 0 10px 20px", fontWeight: "bold" }}>Download File</div>
            <Button style={{ marginLeft: "20px" }} onClick={() => downloadPDF("Pending_Collection_Report")}>PDF</Button>
            <Button style={{ marginLeft: "10px" }} onClick={() => exportToExcel("Pending_Collection_Report")}>Excel</Button>
        </div>
    );
};
