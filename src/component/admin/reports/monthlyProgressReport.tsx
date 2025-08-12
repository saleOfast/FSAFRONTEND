import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Select, Table } from 'antd'
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
import { getMonthlyOrderReportService, getMonthlyProgressReportService, getPendingCollectionReportService } from 'services/orderService'
import dayjs from 'dayjs'
export const MonthlyProgressReport = () => {
    const [trackingData, setTrackingData] = useState<any>([]);
    const dispatch = useDispatch<AppDispatch>();

    const { authState } = useAuth()
    const [selectedExecutive, setSelectedExecutive] = useState<any>("ALL");
    let newDate = new Date();
    newDate.toISOString()
    const [timePeriod, setTimePeriod] = useState<any>(newDate)
    const handleChange = (d: any, dateString: any) => {
        const date = new Date(dateString);
        let monthData = date?.toISOString();
        setTimePeriod(monthData)
    };
    const handleDayTrackingData = async () => {
        try {
            dispatch(setLoaderAction(true));
             let response:any=null;
             if(authState?.user?.role === UserRole.RETAILER){
                response = await getMonthlyOrderReportService(timePeriod);
             }else{
                response = await getMonthlyProgressReportService(timePeriod); 
             }
            dispatch(setLoaderAction(false));
            if (response && response.status === 200) {
                let { data } = response.data;
                setTrackingData(data);
            }
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    }
    useEffect(() => {
        handleDayTrackingData();
    }, [timePeriod]);
    const handleExecutiveChange = (value: any) => {
        setSelectedExecutive(value);
    };
    let uniqueUsers = Array?.from(new Set(trackingData?.map((data: any) => data?.empId)))
        .map(id => trackingData?.find((data: any) => data?.empId === id))?.sort((a: any, b: any) => {
            return a?.firstname?.localeCompare(b?.firstname);
        })

    const optionsUser: any = [
        { label: "ALL", value: "ALL" },
        ...uniqueUsers.map(data => ({
            label: capitalizeSubstring(`${data?.firstname} ${data?.lastname}`),
            value: data?.empId,
        }))
    ];

    const dataSourceWithTotals =
        trackingData?.filter((data: any) => authState?.user?.role === UserRole.SSM ? data?.empId === authState?.user?.id : (selectedExecutive === "ALL" || data?.empId === selectedExecutive))?.map((data: any, idx:any) => ({
            empName: capitalizeSubstring(`${data?.firstname} ${data?.lastname}`) ?? "",
            sale: data?.sale ?? 0,
            newStore: data?.newStore ?? 0,
            orders: data?.orderCount ?? 0,
            collection: data?.collection ?? 0,
            date: dateFormatterNew(data?.orderdate) ?? "",
            key: `monthProg_${idx}`
        }))
    const columns: any = [
        ...(authState?.user?.role === UserRole.RETAILER ?[{
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 130,

        }]:[]),
       ...(authState?.user?.role !== UserRole.RETAILER ?[ {
            title: 'Emp Name',
            dataIndex: 'empName',
            key: 'empName',
            fixed: "left",
            width: 160
        },
        {
            title: 'No. of New Store',
            dataIndex: 'newStore',
            key: 'newStore',
            width: 130,

        }]:[]),
        {
            title: 'No. of Orders',
            dataIndex: 'orders',
            key: 'orders',
            width: 130,

        },
        {
            title: authState?.user?.role === UserRole.RETAILER ? 'Total Amount':'Total Sale',
            dataIndex: 'sale',
            key: 'sale',
            width: 130,
        },
        ...(authState?.user?.role !== UserRole.RETAILER ?[{
            title: 'collection',
            dataIndex: 'collection',
            key: 'collection',
            width: 130,

        }]:[]),

    ];
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        // Set the start of the current month
        const startOfMonth = `${year}-${month}-01`;
        setMinDate(startOfMonth);

        // Set the end of the current month
        const endOfMonth = new Date(year, now.getMonth() + 1, 0).getDate();
        const endOfMonthDate = `${year}-${month}-${String(endOfMonth).padStart(2, '0')}`;
        setMaxDate(endOfMonthDate);
    }, []);

    
    const now = dayjs();
    const formattedTodayDate = now.startOf('month');
    // Convert the Date object to a format compatible with DatePicker
    
    
   

    return (


        <div>

            <div>
                <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                    <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                    <h1 className="page-title pr-18">{authState?.user?.role === UserRole.RETAILER ? "Monthly Order Report" :"Monthly Progress Report"}</h1>
                </header>
                {/* <span>sss</span> */}
                <div className="selection-line ">
                    <Form.Item 
                      label={<span className="dflex-center" style={{marginTop:"10px", fontWeight:600, fontSize:"16px"}} >Select Month:</span>}
                    // label="Select Month" style={{marginTop:"10px"}} className='dflex-center'
                    >
                        <DatePicker
                            picker="month"
                            className="selectTarFilt"
                            onChange={handleChange}
                            defaultValue={formattedTodayDate}

                        />
                    </Form.Item>
                    
                </div>

                <main className='content' id="pdf-content" style={{ backgroundColor: '#f0f0f0', height: "auto" }}>


                    <Table
                        id="excel-content"
                        dataSource={
                            dataSourceWithTotals
                        }
                        title={() => (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                <img src={`${process.env.PUBLIC_URL}/logo2.png`} width={100} height="24px" alt="logo" style={{ marginRight: "auto" }} />
                                <div style={{ flex: 1, textAlign: 'center', fontSize: '16px', fontWeight: 'bold', marginRight: "120px" }}>
                                {authState?.user?.role === UserRole.RETAILER ? "Monthly Order Report" :"Monthly Progress Report"}
                                </div>
                            </div>
                        )}
                        style={{ textAlign: "center" }}
                        bordered
                        columns={columns}
                        // rowClassName={rowClassName}
                        size="small"
                        pagination={false}
                        scroll={{ x: "100%" }}

                    />

                </main>
                <div style={{ margin: "20px 0 10px 20px", fontWeight: "bold" }}>Download File</div>
                <Button style={{ marginLeft: "20px" }}
                    onClick={() => downloadPDF("Monthly_Progress_Report")}
                >PDF</Button>
                <Button style={{ marginLeft: "10px" }}
                    onClick={() => exportToExcel("Monthly_progress_Report")}
                >Excel</Button>

            </div>
        </div>
    )
}
