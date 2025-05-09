//Product Color
import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Modal, Table, Upload } from 'antd';
import { dateFormatterNew, handleImageError } from 'utils/common';
import { AppDispatch } from 'redux-store/store';
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { uploadFileToS3 } from 'utils/uploadS3';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrderSignedUrlService } from 'services/orderService';
import { addColourService, addImportColourService, addProductCategoryService, addProductService, CreateProductRequestService, getProductByIdService, updateProductService } from 'services/productService';
import { DiscountType } from 'enum/common';
import { saveAs } from 'file-saver';
/*---------------------------------------------------------------*/


import * as XLSX from 'xlsx'; // Import the xlsx library
import { capitalizeSubstring } from 'utils/capitalize';

const { Dragger } = Upload;

function ImportProductColorData({ isModalOpen, handleOk, handleCancel }: any) {
 /*************************templte download**************** */
 const downloadTemplate = () => {
  
  const worksheet = XLSX.utils.json_to_sheet([]);  
  

  XLSX.utils.sheet_add_aoa(worksheet, [['Name*']]); 


  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Color");


  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'ColorTemplate.xlsx');  // This will download the file
 // saveAs(blob, 'BrandTemplate.xlsx');  // This will download the file
};
  const [jsonData, setJsonData] = useState<any[]>([]); // State to store the JSON data
  const [fileList, setFileList] = useState<any[]>([]); // 
  const dispatch = useDispatch<AppDispatch>();
  const redirect = useNavigate();
  const [parentUpdateId, setParentData] = useState<any>(null)
 
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
const handleExportUnsavedProductColors = (unsavedProductColors : any[]) => {
  if (unsavedProductColors .length === 0) return; // Don't run if no unsaved brands

  const worksheet = XLSX.utils.json_to_sheet(unsavedProductColors );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Unsaved Product Colors");

  // Download the file
  XLSX.writeFile(workbook, "unsaved_ProductColors.xlsx");
};
  
// async function onSubmit(values: any) {
//     const { productName, mrp, rlp, brandId, categoryId, caseQty, isFocused,  isActive, discountType, discountValue, isDiscountActive } = values;
//     // const isProductActive: any = isActive;
   
//     // const skuDiscount: ISkuDiscount = {
//     //     discountType: discountType,
//     //     isActive: isDiscountActiveValue,
//     //     value: Number(discountValue)
//     // }
//     // if (productId) {
//     //     const skuDiscountEdit: ISkuDiscount = {
//     //         discountType: discountType,
//     //         isActive: isDiscountActiveValue ? (isDiscountActive === "true" ? true : false) : isDiscountActive === "Active" ? true : false,
//     //         value: Number(discountValue)
//     //     }
//     //     try {
//     //         dispatch(setLoaderAction(true));
//     //         let productImgRes
//     //         if (productImg?.name) {
//     //             productImgRes = await getOrderSignedUrlService(productImg?.name);
//     //             await uploadFileToS3(productImgRes.data.data, productImg);
//     //         }
//     //         const response = await updateProductService({
//     //             productId: Number(productId),
//     //             productName, mrp: Number(mrp),
//     //             rlp: Number(rlp),
//     //             brandId: isSetBeatValue ? Number(brandId) : Number(updateData?.brand?.brandId) ,
//     //             categoryId: isSetCategoryValue ? Number(categoryId) : Number(updateData?.category?.productCategoryId),
//     //             caseQty: Number(caseQty),
//     //             isFocused: isFocused,
//     //             isActive: isProductActiveValue ? (isActive === "true" ? true : false) : isActive === "Active" ? true : false,
//     //             skuDiscount: skuDiscountEdit,
//     //             image: productImg?.name ? (productImgRes ? productImgRes.data.data.fileUrl : "") : ""
//     //         });
//     //         dispatch(setLoaderAction(false));
//     //         if (response) {
//     //             message.success("Updated Successfully")
//     //             redirect("/admin/product")
//     //         }
//     //     } catch (error: any) {
//     //         dispatch(setLoaderAction(false));
//     //         message.error(error?.response?.data?.message);
//     //     }
//     // } 
//     const skuDiscount: ISkuDiscount = {
//         discountType: discountType,
//         isActive: isDiscountActiveValue,
//         value: Number(discountValue)
//     }
//         try {
//             dispatch(setLoaderAction(true));
//            let productImgRes = await getOrderSignedUrlService(productImg?.name);
//            await uploadFileToS3(productImgRes.data.data, productImg);
//             const response = await CreateProductRequestService({
//                 productName,
//                 mrp: Number(mrp),
//                 rlp: Number(rlp),
//                 brandId: Number(brandId),
//                       categoryId: Number(categoryId),
//                 caseQty: Number(caseQty),
//               skuDiscount: Object(skuDiscount),
//                 isFocused: isFocused,
//                 isActive: isActive,
//                 image: productImgRes ? productImgRes.data.data.fileUrl : ""
//             });
//             dispatch(setLoaderAction(false));
//             if (response) {
//                 message.success("Added Successfully")
//                 redirect("/admin/product")
//             }
//         } catch (error: any) {
//             dispatch(setLoaderAction(false));
//             message.error(error?.response?.data?.message);
//         }
//     };




const columns: any = [
   
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    
 
    // {
    //   title: '',
    //   dataIndex: 'edit',
    //   key: 'edit',
    //   width: 40,

    //   render: (text: any, record: any) => {
    //     return <Link to={`/admin/add-new-category?productCategoryId=${record?.id}`}><EditOutlined /></Link>;
    //  },                          
    // },
    // {
    //   title: '',
    //   dataIndex: 'delete',
    //   key: 'delete',
    //   width: 40,

    //   render: (text: any, record: any) => {
    //     return <Link to="#" onClick={() => toggleHandler(record?.id, record?.name)} style={{color:"red"}}><DeleteOutlined /></Link>;
    //  },
    // },
  ]; 
//   const searchParams = new URLSearchParams(location?.search);
//   const colourId: string | null = searchParams.get('colourId'); 
  async function onSubmit(){
   
      try {
      //  let id: any = colourId ?? null
        dispatch(setLoaderAction(true));
        if (jsonData.length === 0) {
          message.error("No data to submit.");
          dispatch(setLoaderAction(false));
          return;
        }
        let formData:any=[]
        for (const values of jsonData) {
            const { name } = values;
            const dataa={ name }
            formData.push(dataa)
         }
        const response: any = await addImportColourService(formData);
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Added Successfully");
          const unsavedProductColors = response.data.data7?.unsavedProductColors || [];
            const successfulColourCount=response.data.data7?.successfulColourCount
            message.success(successfulColourCount+" no. of colors added Successfully");
            // Automatically export unsaved brands if there are one or more
          if (unsavedProductColors .length > 0) {
            handleExportUnsavedProductColors(unsavedProductColors);
          } else {
              console.log('All Colors saved successfully!');
          }
          redirect("/config/colour")
        }else{
          message.error("Something Went Wrong");
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
                Import
              </Button>
              <Button onClick={() => {
        handleCancel();
        setJsonData([]); 
        setFileList([]);}}>Cancel</Button>
            </span>
            <span>Product Color</span>
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
                            colourId: item?.colourId,
                            name: item?.name,
                            
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

export default ImportProductColorData;
