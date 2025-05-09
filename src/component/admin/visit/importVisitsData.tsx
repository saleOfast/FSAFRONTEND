import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Modal, Upload } from 'antd';
import { handleImageError } from 'utils/common';
import { AppDispatch } from 'redux-store/store';
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { uploadFileToS3 } from 'utils/uploadS3';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrderSignedUrlService } from 'services/orderService';
import { addProductService, CreateProductRequestService, getProductByIdService, updateProductService } from 'services/productService';
import { DiscountType } from 'enum/common';
/*---------------------------------------------------------------*/


import * as XLSX from 'xlsx'; // Import the xlsx library
import VisitsItem from 'component/visit/VisitsItem';
import useCoordinates from 'hooks/useCoordinates';
import { createVisitsImportService, createVisitsService } from 'services/visitsService';
import { useAuth } from 'context/AuthContext';

const { Dragger } = Upload;

function ImportVisitData({ isModalOpen, handleOk, handleCancel }: any) {
  const [jsonData, setJsonData] = useState<any[]>([]); // State to store the JSON data
  const [fileList, setFileList] = useState<any[]>([]); // 
  const dispatch = useDispatch<AppDispatch>();
  const redirect = useNavigate();
  interface ISkuDiscount {
    discountType: DiscountType,
    value: number,
    isActive: boolean
}
const { data: visitsData, isLoading, completedVisitCount, totalRecords } = useSelector((state:any) => state.visits);
const beatData = useSelector((state:any) => [
    {
      value: "",
      label: "All",
    },
    ...state.store.storeBeat.map((i:any) => ({
      label: i.beatName,
      value: i.beatId
    }))
  ]) || [];
const coordinates = useCoordinates();
const [isDiscountActiveValue, setIsDiscountActiveValue] = useState<boolean>(false)

  // Function to convert Excel to JSON
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const convertedJson = XLSX.utils.sheet_to_json(worksheet);
      setJsonData(convertedJson); // Save the JSON data to state
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
const { authState } = useAuth();
const [selectedStores, setSelectedStores] = useState<any[]>([]);
 
async function onSubmit(){

  try {
    dispatch(setLoaderAction(true));
    let formData:any=[]
    for (const values of jsonData) {
    const { beat, visitDate, emp_id ,storeId} = values;
    const daata={  visitDate, emp_id, beat,
      storeId: 7}
      formData.push(daata);
  }
    
    const response = await createVisitsImportService(formData);
    dispatch(setLoaderAction(false));
    if (response) {
      message.success("Added Successfully")
      redirect(authState?.user?.role === "SSM" ? "/visit" : "/admin/visit")
    }
  } catch (error: any) {
    dispatch(setLoaderAction(false));
    message.error("Something Went Wrong");
  }
};   
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
                OK
              </Button>
              <Button onClick={() => {
        handleCancel();
        setJsonData([]); 
        setFileList([]);}}>Cancel</Button>
            </span>
            <span>Brand</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
          setJsonData([]); 
          setFileList([]);}}
        footer={null} // Remove default footer
      >
        <Dragger {...props} accept=".xlsx"> {/* Accept only Excel files */}
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">Click or drag Excel file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for uploading Excel files (.xlsx). The file will be converted to JSON data.
          </p>
        </Dragger>

        
        {/* /*---------------------------------------------------*/ }
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px", marginBottom: "24px" }}>

{
  jsonData.map((item:any) => (
    <VisitsItem
      key={item.visitId}
      data={item}
      coordinates={coordinates.coordinate} />
  ))
}
</div>
        {/* /*---------------------------------------------------*/ }
      </Modal>
    </>
  );
}

export default ImportVisitData;
