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
interface Option {
  value: string;
  label: string;
  children?: Option[];
}
export const AttendanceReport = () => {
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
        const response = await getAttendanceReport(timePeriod);
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
        attendanceData?.filter((data:any)=> authState?.user?.role === UserRole.SSM ? data?.empId === authState?.user?.id :(selectedExecutive === "ALL" || data?.empId === selectedExecutive))?.map((data:any)=>({
        key: `att-${data.empId}`,
        empId : data.empId,
        date: data.checkIn ? reportDateFormatter(data.checkIn):"",
        checkOut: data.checkOut ? dateFormatter(data.checkOut, "hh:mm:ss a") : "",
        checkIn: data.checkIn ? dateFormatter(data.checkIn, "hh:mm:ss a") : "",
        empName: capitalizeSubstring(`${data?.firstname} ${data?.lastname}`) ?? "",
        totalHrs: `${data?.duration['hours'] ? data?.duration['hours']+"h" : "0h"} ${data?.duration['minutes'] ? data?.duration['minutes']+"m":"0m" }`
        }) )

        // const totalValue:any = {
        //   key: 'total',
        //   empId : 1,
        //   date: "26 may",
        //   checkOut: "9:30",
        //   checkIn: "10:20",
        //   empName: "Saleofast",
        //   totalHrs: "10h"
        // }
        // dataSourceWithTotals.push(totalValue)
    
    const columns: any = [
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
            
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          width: 130,

      },
        {
            title: 'Check-in Time',
            dataIndex: 'checkIn',
            key: 'checkIn',
            width: 130,

        },
        {
            title: 'Check-out Time',
            dataIndex: 'checkOut',
            key: 'checkOut',
            width: 130,

        },
        {
            title: 'Total Hours',
            dataIndex: 'totalHrs',
            key: 'totalHrs',
            width: 100,

        },
    ];

  //   const downloadPDF = () => {
  //     const input: any = document.getElementById('pdf-content'); // ID of the element to capture
  //     html2canvas(input).then((canvas: any) => {
  //         const imgData = canvas.toDataURL('image/png');
  //         const pdf = new jsPDF('p', 'mm', 'a4'); // Create a new PDF document
  //         const imgWidth = 210 - 20; // A4 width in mm minus the left and right margin (10mm each)
  //         const pageHeight = 295 - 20; // A4 height in mm minus the top and bottom margin (10mm each)
  //         const margin = 10;
  //         const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //         let heightLeft = imgHeight;
          
  //         let position = margin;
  
  //         // Add the first image
  //         pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;
  
  //         // Add subsequent pages if needed
  //         while (heightLeft > 0) {
  //             pdf.addPage();
  //             position = heightLeft - imgHeight;
  //             pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
  //             heightLeft -= pageHeight;
  //         }
  
  //         pdf.save('Attendance_Report.pdf');
  //     });
  // };


 


// const downloadPDF = () => {
//     const input:any = document.getElementById('pdf-content'); // ID of the element to capture
//     html2canvas(input).then((canvas:any) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4'); // Create a new PDF document
//       const imgWidth = 210; // A4 width in mm
//       const pageHeight = 295; // A4 height in mm
//       const margin = 10;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;

//       let position = 0;

//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save('Attendance_Report.pdf');
//     });
// };


// const exportToExcel = () => {
//     const table = document.getElementById('excel-content'); // ID of the table or HTML element to export
//     const workbook = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' });
//     const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

//     // Convert binary string to array buffer
//     const buf = new ArrayBuffer(wbout.length);
//     const view = new Uint8Array(buf);
//     for (let i = 0; i < wbout.length; i++) {
//       view[i] = wbout.charCodeAt(i) & 0xff;
//     }

//     // Save the file
//     saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'Attendance_Report.xlsx');
//   };
  
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
      value: TimelineEnum.TODAY,
      label: 'Today',
    },
    {
      value: TimelineEnum.WEEK,
      label: 'Week',
      children: [
        {
          value: '1',
          label: 'This Week',
        },
        {
          value: '0',
          label: 'Last Week',
        },
      ]
    },
    {
      value: TimelineEnum.MONTH,
      label: 'Month',
      children: [
        {
          value: '1',
          label: 'This Month',
        },
        {
          value: '0',
          label: 'Last Month',
        },
      ]
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
    
  ];
  
    return (
        <div>
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Attendance Report</h1>
            </header>
            <div className="selection-line ">
          <div className="brand" style={{ paddingLeft: "10px" }}>
            <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Target Period: </span>
            <Cascader defaultValue={['Today']} options={options} onChange={filterHandler} placeholder="Please select" className='selectTarFilt' />
            
          </div>
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
            />:
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
                        Attendance Report
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
            <Button style={{marginLeft:"20px"}} onClick={()=>downloadPDF("Attendance_Report")}>PDF</Button>
            <Button style={{marginLeft:"10px"}} onClick={()=>exportToExcel("Attendance_Report")}>Excel</Button>

        </div>
    )
}
