import React, { useEffect, useState } from 'react';
import { CrownOutlined, FormOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, message, Modal, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { setLoaderAction } from 'redux-store/action/appActions';
import { ICreateStoreReq } from 'types/Store';
import { createStoreService,createStoreImportService } from 'services/storeService';
import { getValidationErrors } from 'utils/errorEvaluation';
import { DiscountTypeEnum } from 'enum/product';
import StoreCategory from 'component/admin/storeCategory/storeCategory';
import { getUsersActions } from 'redux-store/action/usersAction';
import { AppDispatch } from 'redux-store/store';
import { capitalizeSubstring } from 'utils/capitalize';
import { Console } from 'console';

const { Dragger } = Upload;

function ImportStoreData({ isModalOpen, handleOk, handleCancel }: any) {
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [unsavedStores, setUnsavedStores] = useState<any[]>([]);
  /***************templete************** */
  const downloadTemplate = () => {
    const templateData = [
      [
        "Store Name*", "GST/UID*", "Assign to SSM*", "Assign to Retailor", "Store Type*",
        "Address Line 1*", "Address Line 2*", "Town/City*", "District*", "State*",
        "Pincode*", "Latitude", "Longitude", "Owner Name*", "Phone Number*", "Email",
        "Opening Time", "Opening Time Am Pm", "Closing Time",
        "Closing Time Am Pm", "Store status*", "Premium store*",
        "Flat Discount Type", "Flat Discount Value", "Active Flat Discount",
        "Visibility Discount Type", "Visibility Discount Value",
        "Active Visibility Discount",
      ]
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  
    // Set column widths
    worksheet['!cols'] = Array(templateData[0].length).fill({ width: 20 }); // Default width in 'characters'
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'Store_Data_Template.xlsx');
  };
  
  // Function to convert Excel to JSON
  // const handleFile = (file: File) => {
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const convertedJson = XLSX.utils.sheet_to_json(worksheet);
  //     setJsonData(convertedJson);
  //   };
  //   reader.readAsArrayBuffer(file);
  // };
  const storeCategoryOptionData = useSelector((state: any) => state.store.storeCategory.map((i: any) => ({
    categoryName: i.categoryName,
    storeCategoryId: i.storeCategoryId
  })));
  const usersSSMList = useSelector((state: any) => state?.users?.usersSSM);
  let userData: any = usersSSMList ?? [];
  useEffect(() => {
    dispatch(getUsersActions());
  }, [])
  
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const convertedJson = XLSX.utils.sheet_to_json(worksheet);
      
         // Create a userDataMap to easily retrieve emp_id by label
         const userDataMap = userData.reduce((acc: any, data: any) => {
          const label = `${capitalizeSubstring(data?.name)} (${data?.role})`;
          acc[label] = data?.emp_id; // Map label to emp_id
          return acc;
        }, {});
      // Map the Excel columns to the desired fields
      const mappedData = convertedJson.map((item: any) => {

        const storeCategory = storeCategoryOptionData.find(
          (option: any) => option.categoryName === item["Store Type*"]
        );
        
        // Extract the storeCategoryId from the matched category
        const storeCategoryId = storeCategory ? storeCategory.storeCategoryId : null; // Handle case if not found
        
        // const assignToSSM=optionData.find(
        //   (option: any) => option.label === item["Assign to SSM*"]
        // );
        // const empId = assignToSSM ? assignToSSM.value : null;
        
        
        // Function to retrieve the value by label
        // const getValueByLabel = (label:any) => {
        //   return userDataMap[label] || null; // Return the emp_id or null if not found
        // };
        
   
   // Retrieve emp_id based on the label from "Assign to SSM*"
   const receivedLabel = item["Assign to SSM*"];
   const empId = userDataMap[receivedLabel] || null;
        console.log(empId,"/////////////////////////////////");
        console.log(userDataMap,"-------------------------");
        return {
        emp_id: item["Assign to SSM*"],
        // empId:empId,
        assignToRetailor: item["Assign to Retailor"],
        storeName: item["Store Name*"],
        uid: item["GST/UID*"],
        storeType: item["Store Type*"],
        isActive: item["Store status*"] === 'Active',
        
        addressLine1: item["Address Line 1*"],
        addressLine2: item["Address Line 2*"],
        townCity: item["Town/City*"],
        district: item["District*"],
        state: item["State*"],
        email: item["Email"],
        pinCode: String(item["Pincode*"]),
        lat:String(item["Latitude"]),
        long:String(item["Longitude"]),
        ownerName: item["Owner Name*"],
        mobileNumber: String(item["Phone Number*"]),
        openingTime: String(item["Opening Time"]),
        openingTimeAmPm: item["Opening Time Am Pm"],
        closingTime: String(item["Closing Time"]),
        closingTimeAmPm: item["Closing Time Am Pm"],
        isPremiumStore: item["Premium store"] === 'Yes',
        flatDiscountType: item["Flat Discount Type"],
        flatDiscountValue: Number(item["Flat Discount Value"]),
        isActiveFlatDiscount: item["Active Flat Discount"] === 'Yes',
        visibilityDiscountType: item["Visibility Discount Type"],
        visibilityDiscountValue: Number(item["Visibility Discount Value"]),
        isActiveVisibilityDiscount: item["Active Visibility Discount"] === 'Yes',
    }});

      const requiredFields = [
        "Store Name*", "GST/UID*", "Assign to SSM*", "Store Type*",
        "Address Line 1*", "Town/City*", "District*", "State*", "Pincode*",
        "Owner Name*", "Phone Number*", "Store status*", "Premium store*"
      ];
      const isValid = (row: any) => {
        for (const field of requiredFields) {
          if (!row[field] || row[field].trim() === '') {
            return false; // If any required field is missing or empty, return false
          }
        }
        return true; // All required fields are present
      };
      
      const invalidRows = jsonData.filter((row: any) => !isValid(row));
    
      if (invalidRows.length > 0) {
        console.error("Some rows are missing required fields:", invalidRows);
        return;
      }
  console.log(mappedData,"***********************")
      setJsonData(mappedData);
    };
    reader.readAsArrayBuffer(file);
  };
  

  // const handleFile = (file: File) => { 
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const convertedJson = XLSX.utils.sheet_to_json(worksheet);
      
  //     // Get the store categories from your Redux state
     
      
  //     // Map the Excel columns to the desired fields
  //     const mappedData = convertedJson.map((item: any) => {
  //       // Find the corresponding storeCategoryId by matching categoryName with "Store Type*"
  //       const storeCategory = storeCategoryOptionData.find(
  //         (option: any) => option.categoryName === item["Store Type*"]
  //       );
        
  //       // Extract the storeCategoryId from the matched category
  //       const storeCategoryId = storeCategory ? storeCategory.storeCategoryId : null; // Handle case if not found
        
  //       return {
  //         emp_id: item["Assign to SSM*"],
  //         storeName: item["Store Name*"],
  //         uid: item["GST/UID*"],
  //         storeType: storeCategoryId, // Map storeCategoryId to storeType
  //         isActive: item["Store status*"] === 'Active',
          
  //         addressLine1: item["Address Line 1*"],
  //         addressLine2: item["Address Line 2"],
  //         townCity: item["Town/City*"],
  //         state: item["State*"],
  //         email: item["Email"],
  //         pinCode: item["Pincode*"],
  //         lat: item["Latitude"],
  //         long: item["Longitude"],
  //         ownerName: item["Owner Name*"],
  //         mobileNumber: item["Phone Number*"],
  //         openingTime: item["Opening Time"],
  //         openingTimeAmPm: item["Opening Time Am Pm"],
  //         closingTime: item["Closing Time"],
  //         closingTimeAmPm: item["Closing Time Am Pm"],
  //         isPremiumStore: item["Premium store"] === 'Yes',
  //         flatDiscountType: item["Flat Discount Type"],
  //         flatDiscountValue: Number(item["Flat Discount Value"]),
  //         isActiveFlatDiscount: item["Active Flat Discount"] === 'Yes',
  //         visibilityDiscountType: item["Visibility Discount Type"],
  //         visibilityDiscountValue: Number(item["Visibility Discount Value"]),
  //         isActiveVisibilityDiscount: item["Active Visibility Discount"] === 'Yes',
  //       };
  //     });
  
  //     const requiredFields = [
  //       "Store Name*", "GST/UID*", "Assign to SSM*", "Store Type*",
  //       "Address Line 1*", "Town/City*", "State*", "Pincode*",
  //       "Owner Name*", "Phone Number*", "Store status*", "Premium store*"
  //     ];
  
  //     const isValid = (row: any) => { 
  //       for (const field of requiredFields) {
  //           const value = row[field];
  //           // Check if the value is a string and not empty
  //           if (typeof value !== 'string' || value.trim() === '') {
  //               return false; // If any required field is missing or empty, return false
  //           }
  //       }
  //       return true; // All required fields are present
  //   };
  
  //     const invalidRows = convertedJson.filter((row: any) => !isValid(row));
  
  //     if (invalidRows.length > 0) {
  //       console.error("Some rows are missing required fields:", invalidRows);
  //       return;
  //     }
  
  //     console.log(mappedData, "***********************");
  //     setJsonData(mappedData);
  //   };
  
  //   reader.readAsArrayBuffer(file);
  // };
  
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
      handleFile(file as File);
    },
    onChange(info) {
      const { status } = info.file;
      setFileList(info.fileList);
      if (status === 'done') {
        message.success(`${info.file.name} file processed successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file processing failed.`);
      }
    },
    fileList: fileList,
  };

  const handleExportUnsavedStores = (unsavedStores: any[]) => {
    if (unsavedStores.length === 0) return; // Don't run if no unsaved brands
  
    const worksheet = XLSX.utils.json_to_sheet(unsavedStores);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unsaved Stores");
  
    // Download the file
    XLSX.writeFile(workbook, "unsaved_Stores.xlsx");
  };
  async function onSubmit(){
    
    try {
      dispatch(setLoaderAction(true));

      let formData:any=[]
      for (const values of jsonData) {
        const { empId, storeName, uid, storeType, isActive, lat, long, addressLine1, addressLine2, townCity, state, email, pinCode, ownerName, mobileNumber, openingTime, openingTimeAmPm, closingTime, closingTimeAmPm, isPremiumStore,
          flatDiscountType, flatDiscountValue, isActiveFlatDiscount, visibilityDiscountType, visibilityDiscountValue, isActiveVisibilityDiscount, orderDiscountRange1, orderValueRange1, isActiveOrderValueRange1, orderDiscountRange2, 
          orderValueRange2, isActiveOrderValueRange2, orderDiscountRange3, orderValueRange3, isActiveOrderValueRange3
         } = values
         const visibilityDiscount = {
          isActive: isPremiumStore ? isActiveVisibilityDiscount : false,
          discountType: isPremiumStore ? visibilityDiscountType : DiscountTypeEnum.PERCENTAGE,
          value: isPremiumStore ? Number(visibilityDiscountValue) : 0
        }
        const flatDiscount = {
          isActive: isPremiumStore ? isActiveFlatDiscount: false,
          discountType: isPremiumStore ?  flatDiscountType : DiscountTypeEnum.PERCENTAGE,
          value: isPremiumStore ? Number(flatDiscountValue) : 0
        }
        const orderValueDiscount = [
          {
            amountRange: isPremiumStore ? orderDiscountRange1 : "0",
            discountType: DiscountTypeEnum .PERCENTAGE,
            value: isPremiumStore ? Number(orderValueRange1): 0,
            isActive: isPremiumStore ? isActiveOrderValueRange1 : false
          },
          {
            amountRange:isPremiumStore ? orderDiscountRange2 : "0",
            discountType: DiscountTypeEnum.PERCENTAGE,
            value: isPremiumStore ? Number(orderValueRange2): 0,
            isActive: isPremiumStore ? isActiveOrderValueRange2 :false
          },
          {
            amountRange: isPremiumStore ? orderDiscountRange3 : "0",
            discountType:  DiscountTypeEnum.PERCENTAGE,
            value:isPremiumStore ? Number(orderValueRange3) : 0,
            isActive: isPremiumStore ? isActiveOrderValueRange3 : false
          }
        ]
        const dataa = {
          ...values,
          openingTime: values.openingTime,
          openingTimeAmPm: values.openingTimeAmPm,
          closingTime: values.closingTime,
          closingTimeAmPm: values.closingTimeAmPm,
          storeType: Number(values.storeType),
          assignTo: Number(values.emp_id),
          visibilityDiscount,
          flatDiscount,
          orderValueDiscount
        };

        formData.push(dataa)
      }
      console.log(formData)
      const res: any = await createStoreImportService(formData);
      if(res){
        message.success(res.data.message);
        const unsavedStores=res.data.data3?.unsavedStores || [];
       const successfulStoreCount=res.data.data3?.successfulStoreCount
       message.success(successfulStoreCount+" No. of Stores are succesfully added");
       if (unsavedStores.length > 0) {
          handleExportUnsavedStores(unsavedStores);
      } else {
          console.log('All Stores saved successfully!');
      }
      }
      
      dispatch(setLoaderAction(false));
      navigate("/stores");
    } catch (error) {
      dispatch(setLoaderAction(false));
      message.error(getValidationErrors(error));
    }
  };

  return (
    <>
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
            <span>Store</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
          setJsonData([]); 
          setFileList([]);}}
        footer={null} // Remove default footer
      >
         <h4>Kindly follow these instructions to import data:</h4>
   
   <ul>
<li>Download the template by clicking the "Download Template" button.
<Button type="primary" onClick={downloadTemplate}>
   Download Template
 </Button>
</li>
<li>Fill out the "Name" column in the downloaded Excel file.</li>
<li>Drag and drop the updated excel sheet here.

        <Dragger {...props} accept=".xlsx">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag Excel file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for uploading Excel files (.xlsx). The file will be converted to JSON data.
          </p>
        </Dragger>

        <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px", marginBottom: "10px" }}>
          {jsonData.length > 0 && jsonData.map((item, index) => (
            <div className="store-list" key={index}>
              <div className="shoptitle">
                <Link to={`/stores/store-details?store_id=${item.storeId}`} className="linktoB">
                  <div className="fontb">{item.storeName}</div>
                </Link>
                <Link to={`/stores/store-details?store_id=${item.storeId}`} className="linktoB">
                  <div className={item.isActive ? "activetag" : "inActivetag"}>
                    <span className={item.isActive ? "blinker" : "blinker-inActive"} />
                    <span>{item.isActive ? "Active" : "Inactive"}</span>
                  </div>
                </Link>
                <span>
                  <Link to={`/stores/add-store?storeId=${item.storeId}`} className='linkDefault'>
                    <FormOutlined style={{ fontSize: "14px" }} />
                  </Link>
                </span>
              </div>
              <Link to={`/stores/store-details?store_id=${item.storeId}`} className="linktoB">
                <div className="storeConlist">
                  <div>
                    <div className="storeIdTxt">
                      {item.storeCat?.categoryName} | store ID: {item.storeId}
                    </div>
                    <div className="flexSpace storeAddTxt">
                      <span>{item.addressLine1}, {item.addressLine2}, {item.state}</span>
                    </div>
                  </div>
                  {item.isPremiumStore && (
                    <div className="premiumtag">
                      <div className="bli">
                        <CrownOutlined className="crownIcon" />
                      </div>
                      <span className="premiumText">Premium</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
        </li>
        </ul>
      </Modal>
    </>
  );
}

export default ImportStoreData;
