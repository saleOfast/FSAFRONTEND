import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Modal, Table, Upload } from 'antd';
import { handleImageError } from 'utils/common';
import { AppDispatch } from 'redux-store/store';
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { uploadFileToS3 } from 'utils/uploadS3';
import { useLocation, useNavigate } from 'react-router-dom';
import { addImportNoOrderService, addNoOrderService, getOrderSignedUrlService } from 'services/orderService';
import { addProductService, CreateProductRequestService, getProductByIdService, updateProductService } from 'services/productService';
import { DiscountType } from 'enum/common';
import { saveAs } from 'file-saver';
/*---------------------------------------------------------------*/


import * as XLSX from 'xlsx'; // Import the xlsx library

const { Dragger } = Upload;

function ImportNoOrderData({ isModalOpen, handleOk, handleCancel }: any) {
  const [jsonData, setJsonData] = useState<any[]>([]); // State to store the JSON data
  const [fileList, setFileList] = useState<any[]>([]); // 
  const dispatch = useDispatch<AppDispatch>();
  const redirect = useNavigate();
  interface ISkuDiscount {
    discountType: DiscountType,
    value: number,
    isActive: boolean
}
const [isDiscountActiveValue, setIsDiscountActiveValue] = useState<boolean>(false)
/******************************templete*************** */
const downloadTemplate = () => {
  
  const worksheet = XLSX.utils.json_to_sheet([]);  
  

  XLSX.utils.sheet_add_aoa(worksheet, [['No Order Reason*']]); 


  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "No Order Reason");


  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'NoOrderReasonTemplate.xlsx');  // This will download the file
 // saveAs(blob, 'BrandTemplate.xlsx');  // This will download the file
};
  // Function to convert Excel to JSON
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const convertedJson = XLSX.utils.sheet_to_json(worksheet);
      const columnNames = convertedJson.map((item: any) => item['No Order Reason*']);
      // Validate the 'Name*' field for all rows
 
      const isValid = convertedJson.every((item: any) => item['No Order Reason*'] && item['No Order Reason*'].trim() !== ''); 
      if (!isValid) {
        message.error("The 'No Order Reason*' column contains empty values. Please correct the Excel file.");
        setJsonData([]); // Clear JSON data
        return;
      }
      
      
       const mappedData = columnNames.map((description: string) => ({ description }));
       setJsonData(mappedData); // Save the valid JSON data to state
     };
    reader.readAsArrayBuffer(file);
  };
  
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isExcel) {
        message.error(`${file.name} is not an Excel file.`);
      }
      setFileList([]);
      return isExcel || Upload.LIST_IGNORE;
    },
    customRequest: ({ file }) => {
      handleFile(file as File); // Call the handleFile function when the file is uploaded
    },
    onChange(info) {
      const { status } = info.file;
      setFileList(info.fileList);
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file processed successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file processing failed.`);
      }
    },
    fileList: fileList,
  };
/*---------------------------------After submit---------------------------------------------*/
const handleExportUnSavedNoReasons = (unsavedNoReasons: any[]) => {
  if (unsavedNoReasons.length === 0) return; // Don't run if no unsaved brands

  const worksheet = XLSX.utils.json_to_sheet(unsavedNoReasons);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Unsaved No Reasons");

  // Download the file
  XLSX.writeFile(workbook, "unSavedNoReasons.xlsx");
};
  


const columns: any = [
  // {
  //     title: 'Id',
  //     dataIndex: 'reasonId',
  //     key: 'reasonId',
   
  // },
  {
      title: 'Reason Description',
      dataIndex: 'description',
      key: 'description',
  },

];
async function onSubmit(){
  
 
    try {
      dispatch(setLoaderAction(true));
      let formData:any=[]
      for (const values of jsonData) {
        const { description } = values;
        const daata={description}
        formData.push(daata);
  }
      const response:any = await addImportNoOrderService(formData);
     
      dispatch(setLoaderAction(false));
      if (response?.data?.status === 200) {
        message.success("Added Successfully");
        const unsavedNoReasons = response.data.data8?.unsavedNoReasons || [];
          const successfulReasonCount=response.data.data8?.successfulReasonCount;  
          message.success(successfulReasonCount+" no. of no reason Added Successfully");
          // Automatically export unsaved brands if there are one or more
        if (unsavedNoReasons.length > 0) {
          handleExportUnSavedNoReasons(unsavedNoReasons);
        } else {
            console.log('All brands saved successfully!');
        }
        redirect("/noOrder-reason")
      }else{
        message.error("Something Went Wrong");
      }
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      message.error("Something Went Wrong");
    }
 
};

  //   async function onSubmitImport(valuesArray: any[]) {
  //     try {
  //         dispatch(setLoaderAction(true));
  
  //         for (const values of valuesArray) {
  //             const { productName, mrp, rlp, brandId, categoryId, caseQty, isFocused, isActive, discountType, discountValue, isDiscountActive, productImg } = values;
  
  //             // Create SKU Discount object
  //             const skuDiscount: ISkuDiscount = {
  //                 discountType: discountType,
  //                 isActive: isDiscountActive,
  //                 value: Number(discountValue)
  //             };
  
  //             // Handle image upload if necessary
  //             let productImgRes;
  //             if (productImg?.name) {
  //                 productImgRes = await getOrderSignedUrlService(productImg.name);
  //                 await uploadFileToS3(productImgRes.data.data, productImg);
  //             }
  
  //             // Create the product request with the processed data
  //             const response = await CreateProductRequestService({
  //                 productName,
  //                 mrp: Number(mrp),
  //                 rlp: Number(rlp),
  //                 brandId: Number(brandId),
  //                 categoryId: Number(categoryId),
  //                 caseQty: Number(caseQty),
  //                 skuDiscount: skuDiscount,
  //                 isFocused: isFocused,
  //                 isActive: isActive,
  //                 image: productImgRes ? productImgRes.data.data.fileUrl : ""
  //             });
  
  //             // Handle success response for each product
  //             if (response) {
  //                 message.success(`Product ${productName} added successfully`);
  //             }
  //         }
  
  //         // Final cleanup after all products are processed
  //         dispatch(setLoaderAction(false));
  //         redirect("/admin/product");
  //     } catch (error: any) {
  //         dispatch(setLoaderAction(false));
  //         message.error(error?.response?.data?.message || "Error occurred while processing products");
  //     }
  // }
     
   
/*------------------------------------------------------------------------------*/
  return (
    <>
      {/* <Modal title="Import Data" open={isModalOpen} onOk={()=>{handleOk();onSubmit()}}  onCancel={() => {
        handleCancel();
        setJsonData([]); // Clear JSON data on Cancel
        setFileList([]);
      }}> */}
         <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0 }}>
              <Button type="primary" onClick={()=>{handleOk();onSubmit()}} style={{ marginRight: '10px' }}>
                Import
              </Button>
              <Button onClick={() => {
        handleCancel();
        setJsonData([]); 
        setFileList([]);}}>Cancel</Button>
            </span>
            <span>No Order Reason</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
          setJsonData([]); 
          setFileList([]);}}
        footer={null} // Remove default footer
      >
           <h3>Kindly follow these instructions to import data:</h3>
   
   <ul>
<li>Download the template by clicking the "Download Template" button.
<Button type="primary" onClick={downloadTemplate}>
   Download Template
 </Button>
</li>
<li>Fill out the all the  column in the downloaded Excel file.</li>
<li>Drag and drop the updated excel sheet here.

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
     
       </div>
        <Dragger {...props} accept=".xlsx"> {/* Accept only Excel files */}
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag Excel file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for uploading Excel files (.xlsx). The file will be converted to JSON data.
          </p>
        </Dragger>

        
        {/* /*---------------------------------------------------*/ }
        <main className='content'>
        <Table
                       
                       dataSource={
                        jsonData?.map((item: any) => ({
                          // reasonId: item?.reasonId,
                          description: item?.description,
                         
                      }))
                       }
                       bordered
                     columns={columns}
                       size="small"
                       pagination={false}
                   />
                   </main>
        {/* /*---------------------------------------------------*/ }
        </li>
        </ul>
      </Modal>
    </>
  );
}

export default ImportNoOrderData;
