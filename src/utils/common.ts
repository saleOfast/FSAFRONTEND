import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DateTime } from "luxon"
import { IGeoCoordinate } from "types/Common";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { UserRole } from "enum/common";

function getItemFromLS(key: string) {
    return localStorage.getItem(key);
}

function setItemIntoLS(key: string, value: string) {
    localStorage.setItem(key, value)
}

function removeItemFromLS(key: string) {
    localStorage.removeItem(key);
}

function navigateTo(path: string) {
    window.location.href = path;
}

function dateFormatter(date: string, formatter = "dd/MMM/yyyy") {
    // "dd MMM yyyy hh:mm a"
    return DateTime.fromISO(date).toFormat(formatter);
}
function reportDateFormatter(date: string, formatter = "d MMMM, EEE") {
    return DateTime.fromISO(date).toFormat(formatter);
}

function dateFormatterNew(date: string, formatter = "dd-MMM-yyyy") {
  const dt = DateTime.fromISO(date);
  
  if (!dt.isValid) {
      return "Invalid Date"; // or handle the error as needed
  }

  return dt.toFormat(formatter);
}
function dateFormatterDar(date: string, formatter = "dd-MMM-yyyy") {
  const dt = DateTime.fromISO(date, { zone: "utc" }); // Ensure it's parsed in UTC

  if (!dt.isValid) {
    return "Invalid Date"; // Handle invalid cases
  }

  return dt.toFormat(formatter);
}

function dateFormatterDigit(date: string, formatter = "dd-MM-yyyy") {
    // "dd MMM yyyy hh:mm a"
    return DateTime.fromISO(date).toFormat(formatter);
}


function monthFormatter(date: string, formatter = "MMM-yyyy") {
    // "dd MMM yyyy hh:mm a"
    return DateTime.fromISO(date).toFormat(formatter);
}


async function getCoordinates(): Promise<IGeoCoordinate | null> {
    return new Promise((res, rej) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position:any) => {
                res({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                // res({
                //     latitude: 20.98767,
                //     longitude: 75.6567,
                // });
            });
        } else {
            res(null);
        }
    })
}

const scrollToTop = () => {
    window.scrollTo(0, 0)
}

const smallestUnitINRCurrency = (payPartiallyNFull:number) =>{
    const rupees = Math.floor(payPartiallyNFull); // Get the integer part
    const paise = Math.round((payPartiallyNFull - rupees) * 100); // Get the fractional part and convert to paise
    
    // Convert rupees to paise and add paise
    const totalAmountInPaise = rupees * 100 + paise;
    return totalAmountInPaise;
}
const currencyFromSmallestUnit = (totalAmountInPaise: any) => {
    const rupees = Math.floor(totalAmountInPaise / 100); // Get the rupee part
    const paise = totalAmountInPaise % 100; // Get the remaining paise

    // Combine rupees and paise to get the total amount
    const totalAmount = rupees + paise / 100;
    return totalAmount;
}
 // Example usage:
 const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Prevents infinite loops in case 'none.jpg' is also missing
    event.currentTarget.onerror = null;
    // Replace the source of the image with the fallback image
    event.currentTarget.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKdFz6BgLdbnQBnRhETAp6nIZP9P4fUetEcOOfZJjm3L_jipJK05HqrdCCqDjOYpwX04&usqp=CAU';
  };

  const handleVisitPictureError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Prevents infinite loops in case 'none.jpg' is also missing
    event.currentTarget.onerror = null;
    // Replace the source of the image with the fallback image
    event.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png';
  };
    
  const formattedAmount = (amount:any) => {
    if (Number(amount)) {
      if (Number(amount) >= 1000) {
        return (Number(amount) / 1000).toFixed(1) + 'K';
      }
      return Number(amount).toString();
    }
    return 0;
  };
 
  const downloadPDF = (reportName: string) => {
    const input: any = document.getElementById('pdf-content'); // ID of the element to capture
    html2canvas(input).then((canvas: any) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // Create a new PDF document
        const imgWidth = 210 - 20; // A4 width in mm minus the left and right margin (10mm each)
        const pageHeight = 295 - 20; // A4 height in mm minus the top and bottom margin (10mm each)
        const margin = 10;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = margin;

        // Add the first image
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add subsequent pages if needed
        while (heightLeft > 0) {
            pdf.addPage();
            position = heightLeft - imgHeight;
            pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${reportName}.pdf`);
    });
};

const exportToExcel = async (reportName:string) => {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
  
    // Add the logo
    const logoPath = `${process.env.PUBLIC_URL}/logo2.png`; // Path to the logo
    const logoImage = await fetch(logoPath).then(res => res.arrayBuffer());
    const logoId = workbook.addImage({
      buffer: logoImage,
      extension: 'png',
    });
    worksheet.addImage(logoId, {
      tl: { col: 0, row: 0 },
      ext: { width: 100, height: 24 },
    });
  
    // Determine the number of columns
    const table:any = document.getElementById('excel-content');
    const numberOfColumns = table.querySelectorAll('th').length;
  
    // Add the title in the same row as the logo
    worksheet.getCell('B1').value = `${reportName}`;
    worksheet.getCell('B1').font = { size: 16, bold: true };
    worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
  
    // Merge cells for the title to span across the remaining columns
    worksheet.mergeCells(`B1:${String.fromCharCode(65 + numberOfColumns - 1)}1`);
  
    // Add the table data
    const tableHtml = table.outerHTML;
    
    // Use a temporary HTML element to convert table HTML to worksheet data
    const tempTable = document.createElement('div');
    tempTable.innerHTML = tableHtml;
    const tableData:any = XLSX.utils.table_to_sheet(tempTable.querySelector('table'));
  
    // Convert table data to rows and add them to the worksheet
    tableData['!cols'].forEach((col:any, idx:any) => {
      worksheet.getColumn(idx + 1).width = col.width;
    });
    const rows:any = XLSX.utils.sheet_to_json(tableData, { header: 1 });
    rows.forEach((row:any, rowIndex:any) => {
      row.forEach((cell:any, cellIndex:any) => {
        worksheet.getCell(rowIndex + 3, cellIndex + 1).value = cell;
      });
    });
  
    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${reportName}.xlsx`);
  };

  const getDashboardLabel = (role:any): any => {
    switch (role) {
      case UserRole.ADMIN:
        return "Admin Dashboard";
      case UserRole.MANAGER: // Assuming there is a manager role
        return "Manager Dashboard";
      case UserRole.RETAILER: // Assuming there is a manager role
        return "Retailer Dashboard";  
      default:
        return "Admin Dashboard"; // Fallback in case of unknown role or undefined
    }
  };

  
  // Function to convert decimal degrees to DMS format
function convertToDMS(decimalDegree:any, isLatitude:any) {
    const degree = Math.floor(Math.abs(decimalDegree)); // Get integer degree
    const minuteFloat = (Math.abs(decimalDegree) - degree) * 60; // Get minutes
    const minute = Math.floor(minuteFloat); // Integer minutes
    const second = ((minuteFloat - minute) * 60).toFixed(1); // Seconds rounded to 1 decimal

    // Determine the direction based on whether it's latitude or longitude
    const direction = decimalDegree >= 0
        ? (isLatitude ? 'N' : 'E')  // Positive values: N for latitude, E for longitude
        : (isLatitude ? 'S' : 'W'); // Negative values: S for latitude, W for longitude

    return `${degree}°${minute}'${second}"${direction}`;
}

function openGoogleMap(lat:any, lng:any) {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
}

// Example usage with latitude and longitude:
const debounce = (func:any, delay:any) => {
    let timeoutId:any='';
    return (...args:any) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };
  

export {
    getItemFromLS,
    setItemIntoLS,
    navigateTo,
    removeItemFromLS,
    dateFormatter,
    dateFormatterNew,
    getCoordinates,
    scrollToTop,
    smallestUnitINRCurrency,
    handleImageError,
    currencyFromSmallestUnit,
    monthFormatter,
    dateFormatterDigit,
    formattedAmount,
    reportDateFormatter,
    downloadPDF,
    exportToExcel,
    getDashboardLabel,
    convertToDMS,
    openGoogleMap,
    debounce,
    dateFormatterDar
}