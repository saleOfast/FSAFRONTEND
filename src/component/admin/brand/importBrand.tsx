import React, { useState } from 'react';
import { Button, message, Modal, Upload, UploadProps } from 'antd';
//import ImportBrandData from 'component/admin/brand/importBrandData';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { addImportBrandService } from 'services/productService';
import { setLoaderAction } from 'redux-store/action/appActions';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { useNavigate } from 'react-router-dom';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

// interface ImportBrandProps {
//   isModalOpen: boolean;
//   handleImportOk: () => void;
//   handleImportCancel: () => void;
//   }
  
  const ImportBrandData = ({ isModalOpen, handleOk,handleCancel }:any) => {
   //const [isModalOpen, setIsModalOpen] = useState(false); // Control main modal
//   const [isImportModalOpen, setIsImportModalOpen] = useState(false); // Control ImportBrandData modal
//   const [templateData, setTemplateData] = useState<any[]>([]); // State to hold template data
//  const[showImport,setShowImport]=useState(false);
//  function handleShowImport(){
//   setShowImport(true);
//   setIsImportModalOpen(true);
//  }

//   function handleImportOk(){
  
//     setIsImportModalOpen(false);
//   };
//   function handleImportCancel(){
   

//     setIsImportModalOpen(false);
//     console.log(isImportModalOpen,"nnnnnnnnnnnnnnnnnnn")
//   };
//  console.log(isImportModalOpen);
  const downloadTemplate = () => {
  
    const worksheet = XLSX.utils.json_to_sheet([]);  
    
  
    XLSX.utils.sheet_add_aoa(worksheet, [['Name*']]); 


    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Brands");

 
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'BrandTemplate.xlsx');  // This will download the file
   // saveAs(blob, 'BrandTemplate.xlsx');  // This will download the file
};
/*********************import excel sheet*************** */
const [jsonData, setJsonData] = useState<any[]>([]); // State to store the JSON data
const [fileList, setFileList] = useState<any[]>([]); // 
const dispatch = useDispatch<AppDispatch>();
const redirect = useNavigate();
//const [isModalOpen, setIsModalOpen] = useState(isImportModalOpen); // Control ImportBrandData modal

// let isOPen = isImportModalOpen;
// function handleImportCancel(data:any){
//   console.log("Import Cancel clicked");
//  console.log(data,"1")

// //  setIsModalOpen(data)
  
// };

const [isDiscountActiveValue, setIsDiscountActiveValue] = useState<boolean>(false)
const [unsavedBrands, setUnsavedBrands] = useState<any[]>([]);
// Function to convert Excel to JSON
const handleFile = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const convertedJson = XLSX.utils.sheet_to_json(worksheet);
    const columnNames = convertedJson.map((item: any) => item['Name*']);
      // Validate the 'Name*' field for all rows
  const isValid = convertedJson.every((item: any) => item['Name*'] && item['Name*'].trim() !== '');

  if (!isValid) {
    message.error("The 'Name*' column contains empty values. Please correct the Excel file.");
    setJsonData([]); // Clear JSON data
    return;
  }
  
  
   const mappedData = columnNames.map((name: string) => ({ name }));
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
const handleExportUnsavedBrands = (unsavedBrands: any[]) => {
  if (unsavedBrands.length === 0) return; // Don't run if no unsaved brands

  const worksheet = XLSX.utils.json_to_sheet(unsavedBrands);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Unsaved Brands");

  // Download the file
  XLSX.writeFile(workbook, "unsaved_brands.xlsx");
};

async function onSubmit() {
try {
  dispatch(setLoaderAction(true));
  
  // Check if jsonData has been populated
  if (jsonData.length === 0) {
    message.error("No data to submit.");
    dispatch(setLoaderAction(false));
    return;
  }
  let formData:any=[]
  // Iterate through each item in the JSON data
  for (const item of jsonData) {
    const { name } = item;
    
    // Prepare the data to be sent in the API request
    const brandData = { name };
    formData.push(brandData)
    // Call API to add the product brand
   
  }
  const response: any = await addImportBrandService(formData);
    
  if (response) {
  

    const unsavedBrands = response.data.data1?.unsavedBrands || [];
         const   successfulBrandCount =   response.data.data1?.successfulBrandCount;
         message.success(`Brand added successfully.`);
        //  message.success(successfulBrandCount+" Brands are succesfully added")
         // Automatically export unsaved brands if there are one or more
    if (unsavedBrands.length > 0) {
        handleExportUnsavedBrands(unsavedBrands);
    } else {
        console.log('All brands saved successfully!');
    }

  }
  else{
    message.error("Something Went Wrong");
  }
  // Redirect to brand list after successful submission
//  handleOk();
  redirect("/admin/brand");
} catch (error: any) {
  // Handle errors and notify the user
  message.error("Something went wrong while adding brands.");
} finally {
  dispatch(setLoaderAction(false));
}
}

const [toggleDelete, setToggleDelete] = useState(false);
const [brandName, setBrandName] = useState('');
const [brandId, setBrandID] = useState('');
const toggleHandler = (brandId: string, name: string) =>{
  setToggleDelete(true);
  setBrandID(brandId);
  setBrandName(name)
}
// console.log({isModalOpen, isImportModalOpen})
  return (
    <>

      {/* <Modal title="Brand" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}> */}
      <Modal  title={
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
        <h3>Kindly follow these instructions to import data:</h3>
   
        <ul>
    <li>Download the template by clicking the "Download Template" button.
    <Button type="primary" onClick={downloadTemplate}>
        Download Template
      </Button>
    </li>
    <li>Fill out the "Name" column in the downloaded Excel file.</li>
    <li>Drag and drop the updated excel sheet here.
   
        
        
      {/* <Modal  title={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0 }}>
              <Button type="primary" onClick={()=>{handleImportOk();onSubmit()}} style={{ marginRight: '10px' }}>
                Import
              </Button>
              <Button onClick={() => {
       
        setJsonData([]); 
        setFileList([]);}}>Cancel</Button>
            </span>
            <span>Brand</span>
          </div>
        }
        open={isImportModalOpen}
        onCancel={() => {
          
          setJsonData([]); 
          setFileList([]);}}
        footer={null} // Remove default footer
      > */}
        <Dragger {...props} accept=".xlsx"> {/* Accept only Excel files */}
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag Excel file to this area to upload</p>
          <p className="ant-upload-hint">
          Support for Excel files (.xlsx). Ensure the "name" column is filled in for all rows.
        </p>
        </Dragger>

        
        {/* /*---------------------------------------------------*/ }
        <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
        {jsonData && setJsonData?.length > 0 
        // && jsonData?.map((data, index)=>{
        //           // const {brandId, name, createdAt} = data;
        //           const { name} = data;
        //           return(
        //          <tr key={`productBrand-${index}`}>
      
        //           <td>{name}</td>
                 
        //         </tr>
        //           )
        //         })
        && (
          <div>
            <h3>Preview Imported Data:</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {jsonData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
                }
        </div>
      {/* </Modal> */}
    </li>
  </ul>
 </Modal>

     
     
    </>
  );
};

export default ImportBrandData;
