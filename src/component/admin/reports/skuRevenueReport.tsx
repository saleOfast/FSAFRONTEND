import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Cascader, Select, Table } from 'antd'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoaderAction } from 'redux-store/action/appActions'
import { getAttendanceReport } from 'services/authService'
import { dateFormatter, downloadPDF, exportToExcel, reportDateFormatter } from 'utils/common'
import previousPage from 'utils/previousPage'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TimelineEnum, UserRole } from 'enum/common'
import { capitalizeFirstLetter, capitalizeSubstring } from 'utils/capitalize'
import { AppDispatch } from 'redux-store/store'
import { getUsersActions } from 'redux-store/action/usersAction'
import { useAuth } from 'context/AuthContext'
import ExcelJS from 'exceljs';
import { getSkuRevenueReportService } from 'services/orderService'
interface Option {
  value: string;
  label: string;
  children?: Option[];
}
export const SkuRevenueReport = () => {
    const [attendanceData, setAttendanceData] = useState<any>([]);
    const dispatch = useDispatch<AppDispatch>();
  // Use useMemo to filter users with role 'SSM'
   const {authState} = useAuth()
  const [selectedExecutive, setSelectedExecutive] = useState<any>("ALL");
const [timePeriod, setTimePeriod] = useState<any>([])

 
  let uniqueUsers = Array.from(new Set(attendanceData.map((data:any) => data.empId)))
  .map(id => attendanceData.find((data:any) => data.empId === id)).sort((a: any, b: any) => {
    return a?.firstname?.localeCompare(b?.firstname);
  })
  
  
   const optionsUser: any = [
      { label: "ALL", value: "ALL" },
      ...uniqueUsers.map(data => ({
        label: capitalizeSubstring(`${data?.firstname} ${data?.lastname}`),
        value: data?.empId,
      }))
    ];
  



const handleExecutiveChange = (value: any) => {
    setSelectedExecutive(value);
};

  const filterHandler: any = (value: any) => {
    setTimePeriod(value)
  };
    useEffect(() => {
      handleAttendanceData();
    }, [timePeriod]);
    const handleAttendanceData = async () => {
      try {
        dispatch(setLoaderAction(true));
        const response = await getSkuRevenueReportService(timePeriod);
        dispatch(setLoaderAction(false));
        if (response && response.status === 200) {
          let { data } = response.data;
          setAttendanceData(data);
        }
      } catch (error) {
        dispatch(setLoaderAction(false));
      }
    }

    const dataSourceWithTotals = 
        attendanceData?.filter((data:any)=> authState?.user?.role === UserRole.SSM ? data?.empId === authState?.user?.id :(selectedExecutive === "ALL" || data?.empId === selectedExecutive))?.map((data:any, idx:any)=>({
            sku : capitalizeSubstring(data?.productname) ?? "",
            revenue: data.revenue? `₹${data.revenue}` :0 ,
            key: `skuRevenue_${idx}`
        }) )

      
        const columns: any = [
            {
                title: 'SKU',
                dataIndex: 'sku',
                key: 'sku',
                fixed: "left",
                width: 160,
            },
            {
                title: 'Revenue',
                dataIndex: 'revenue',
                key: 'revenue',
                width: 140,
                
            },
           
        ];
  
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


  const quartersToShow = Math.ceil((currMonthIdx + 1)/3);
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
        <div>
            <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">SKU Revenue Report</h1>
            </header>
            <div className="selection-line ">
          <div className="bran" style={{ paddingLeft: "10px" }}>
            <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Target Period: </span>
            <Cascader defaultValue={['Year', currentYear]} options={options} onChange={filterHandler} placeholder="Please select" className='selectTarFilt' />
            
          </div>
        
        </div>
          
            <main className='content' id="pdf-content" style={{ backgroundColor: '#f0f0f0', height:"auto" }}>
            

                <Table
                 id="excel-content"
                    dataSource={
                        dataSourceWithTotals
                    }
                    title={() => (
                      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                      <img src={`${process.env.PUBLIC_URL}/logo2.png`} width={100} height="24px" alt="logo" style={{marginRight: "auto"}}/>
                      <div style={{ flex: 1, textAlign: 'center', fontSize: '16px', fontWeight: 'bold', marginRight: "120px" }}>
                      SKU Revenue Report
                      </div>
                    </div>
                      )}
                    bordered
                    columns={columns}
                    // rowClassName={rowClassName}
                    size="small"
                    pagination={false}
                    scroll={{x:"100%"}}
                />
          
            </main>
            <div style={{margin:"20px 0 10px 20px",fontWeight:"bold"}}>Download File</div>
            <Button style={{marginLeft:"20px"}} onClick={()=>downloadPDF("SKU_Revenue_Report")}>PDF</Button>
            <Button style={{marginLeft:"10px"}} onClick={()=>exportToExcel("SKU_Revenue_Report")}>Excel</Button>

        </div>
    )
}
