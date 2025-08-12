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
import { getPendingApprovalReportService, getPendingCollectionReportService, getUnbilledStoreReportService } from 'services/orderService'
export const UnbilledStoreReport = () => {
    const [trackingData, setTrackingData] = useState<any>([]);
    const dispatch = useDispatch<AppDispatch>();

    const { authState } = useAuth()
    const [selectedExecutive, setSelectedExecutive] = useState<any>("ALL");
    const [timePeriod, setTimePeriod] = useState<any>()
    function filterByDate(e: any) {
        let endTimeline = new Date(e?.target?.value)
        let date = endTimeline?.toISOString();
        setTimePeriod(date)
    }
    const handleDayTrackingData = async () => {
        try {
            dispatch(setLoaderAction(true));
            const response = await getUnbilledStoreReportService();
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
    let uniqueUsers = Array.from(new Set(trackingData.map((data: any) => data.empId)))
        .map(id => trackingData.find((data: any) => data.empId === id)).sort((a: any, b: any) => {
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
    trackingData?.filter((data: any) => authState?.user?.role === UserRole.SSM ? data?.empId === authState?.user?.id : (selectedExecutive === "ALL" || data?.empId === selectedExecutive))?.map((data: any, idx:any) => {
        return {
            empName: capitalizeSubstring(`${data?.firstname} ${data?.lastname}`) ?? "",
            date: dateFormatterNew(data?.createdAt) ?? "",
            storeName: capitalizeSubstring(data?.storeName)?? "",
            key: `unbillRep_${idx}`
        };
    });
    const columns: any = [
        {
            title: 'Sales Rep Name',
            dataIndex: 'empName',
            key: 'empName',
            width: 160,
            fixed: 'left'
        },
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'storeName',
            width: 160,

        },
       
        {
            title: 'Store Added Date',
            dataIndex: 'date',
            key: 'date',
            width: 130,

        },

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

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0'); // Day of the month

    // Format the date as YYYY-MM-DD
    const formattedTodayDate = `${year}-${month}-${day}`;
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });


    return (


        <div>

            <div>
                <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                    <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                    <h1 className="page-title pr-18">Unbilled Store Report</h1>
                </header>
                <div className="selection-line ">
                    <div className="category"  >
                        <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Medical Representative: </span>
                        {authState?.user?.role === UserRole.SSM ?
                            <Select
                                placeholder="Select Executive"
                                onChange={handleExecutiveChange}
                                defaultValue={authState?.user?.name}
                                options={
                                    []
                                }
                                className='selectTarFilt'
                            /> :
                            <Select
                                placeholder="Select Executive"
                                onChange={handleExecutiveChange}
                                defaultValue={"ALL"}
                                options={
                                    optionsUser
                                }
                                className='selectTarFilt'
                            />
                        }

                    </div>

                </div>
                {/* <div style={{ margin: "10px 20px" }}>
              <Cascader defaultValue={['Year', String(currentYear)]} options={options} onChange={filterHandler} placeholder="Please select" />
            </div> */}
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
                                Unbilled Store Report
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
                    onClick={() => downloadPDF("Unbilled_Store_Report")}
                >PDF</Button>
                <Button style={{ marginLeft: "10px" }}
                    onClick={() => exportToExcel("Unbilled_Store_Report")}
                >Excel</Button>

            </div>
        </div>
    )
}
