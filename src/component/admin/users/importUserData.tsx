import React, { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined, FormOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Modal, Upload } from 'antd';
import { handleImageError } from 'utils/common';
import { AppDispatch } from 'redux-store/store';
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { uploadFileToS3 } from 'utils/uploadS3';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getOrderSignedUrlService } from 'services/orderService';
import { DiscountType, GetUserRole, UserRole } from 'enum/common';
import { createUserImportService } from 'services/usersSerivce';
import { App } from "antd";
/*---------------------------------------------------------------*/

import * as XLSX from 'xlsx'; // Import the xlsx library
import { UserData, UserImportData } from 'types/User';
import { capitalizeSubstring } from 'utils/capitalize';
import { createUserService, getUserDetailsByEmpIdService } from 'services/usersSerivce';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createNewUserSchema } from 'utils/formValidations';
import { getManagerActions } from 'redux-store/action/usersAction';
import { DateTime } from 'luxon';

const { Dragger } = Upload;

function ImportUserData({ isModalOpen, handleOk, handleCancel }: any) {
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const redirect = useNavigate();
  const managersData = useSelector((state: any) => state.users.userManager);
  const managersList = useMemo(() => managersData, [managersData]);
  useEffect(() => {
    dispatch(getManagerActions());
  }, [dispatch])
  const [data, setData] = useState<any>(null)

  const [toggleDelete, setToggleDelete] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserID] = useState('');
  const toggleHandler = (userId: string, name: string) => {
    setToggleDelete(true);
    setUserID(userId);
    setUserName(name)
  }
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);

  const empId: string | null = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [managerData, setManagerData] = useState<any>(null)

  const [isDiscountActiveValue, setIsDiscountActiveValue] = useState<boolean>(false)
  const dateFormatting = (data: string) => {
    const date = new Date(data);
    return date.toISOString().split('T')[0];
  }

  useEffect(() => {
    dispatch(getManagerActions());
  }, [dispatch])
  const initialFormData = {
    "firstname": "",
    "lastname": "",
    "email": "",
    "password": "",
    "address": "",
    "age": "",
    "phone": "",
    "zone": "",
    "dob": "",
    "joining_date": "",
    "managerId": "",
    "role": "",
    "learningRole": "",
    "city": "",
    "state": "",
    "pincode": "",
  }

  const {
    control,
    setValue,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(createNewUserSchema(empId)),
    defaultValues: initialFormData
  })
  useEffect(() => {
    async function getUserData() {
      try {
        if (empId) {
          setIsLoading(true);
          const res = await getUserDetailsByEmpIdService(empId);
          setData(res?.data?.data?.managerId)
          setManagerData(res?.data?.data?.manager)
          setIsLoading(false);
          setValue("firstname", res?.data?.data?.firstname)
          setValue("lastname", res?.data?.data?.lastname)
          setValue("email", res?.data?.data?.email)
          setValue("phone", res?.data?.data?.phone)
          // setValue("zone", res?.data?.data?.zone)
          // setValue("age", res?.data?.data?.age)
          setValue("role", res?.data?.data?.role)
          setValue("joining_date", formatDate(res?.data?.data?.joining_date))
          setValue("dob", formatDate(res?.data?.data?.dob))
          setValue("address", res?.data?.data?.address)
          setValue("managerId", res?.data?.data?.manager)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getUserData();
  }, [empId])

  /********************************downloadTemplete************** */
  const formatDate = (data: string) => {
    const date = new Date(data);
    return date.toISOString().split('T')[0];
  };
  const downloadTemplate = () => {
    const managerNames = managersList?.map((data: any) => `${data.firstname} ${data.lastname}`);

    const templateData = [
      {
        'First Name*': '',
        'Last Name*': '',
        'Phone *': '',
        'Password *': '',
        'Email': '',
        'Address': '',
        'Date of Birth': '',
        'Joining Date *': '',
        'Reporting Manager *': '',
        'Role *': '',
        "City": "",
        "State": "",
        "Pincode": "",
      }
    ];

    // Create a new workbook and add the template data
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Template');

    const managerSheetData = managerNames.map((name: string) => [name]);
    const managerSheet = XLSX.utils.aoa_to_sheet(managerSheetData);
    XLSX.utils.book_append_sheet(workbook, managerSheet, 'Manager List');
    for (let row = 2; row <= 10000; row++) {
      worksheet[`I${row}`] = {
        t: 's', v: '',  // Placeholder value
        s: {
          validation: {
            type: 'list',
            showDropDown: true,
            formula1: `'Manager List'!$A$1:$A${managerNames.length}`
          }
        }
      };
    }
    // Download the template as Excel file
    XLSX.writeFile(workbook, 'User_Import_Template.xlsx');
  };


  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const managersMap = managersList?.reduce((acc: any, data: any) => {
        const label = `${data.firstname} ${data.lastname}`;
        acc[label] = data.emp_id; // Set label as the key and emp_id as the value
        return acc;
      }, {});

      const mappedData = rawData.map((row: any) => {

        const managerName = row['Reporting Manager *'];
        // const managerId = managersMap[managerName] || null; // Get emp_id or null if not found
        // const managerName = row['Reporting Manager *']?.trim(); // Trim in case of leading/trailing spaces
        const managerId = managersMap[managerName] || null;
        // console.log(managerId,"=====manager=");

        console.log(row, "*************************")
        console.log(managersList, "*************************")
        console.log(managersMap, "-----------------------")

        return {
          firstname: row['First Name*'],
          lastname: row['Last Name*'] || '',  // Handle optional field
          phone: String(row['Phone *']),
          password: row['Password *'],
          email: row['Email'] || '',  // Handle optional field
          address: row['Address'] || '',  // Handle optional field
          dob: row['Date of Birth'] || '',  // Handle optional field
          joining_date: row['Joining Date *'],
          managerId: row['Reporting Manager *'],  // Assign managerId or null if not found
          role: row['Role *'],
          city: row['City'],
          state: row['State'],
          pincode: String(row['Pincode']),
        };
      });

      // // Proceed with valid data
      // console.log("Valid data:", jsonData);

      const requiredFields = ['First Name*', 'Phone *', 'Password *', 'Joining Date *', 'Reporting Manager *', 'Role *'];

      const isValid = (row: any) => {
        for (const field of requiredFields) {
          if (!row[field] || row[field].trim() === '') {
            return false; // If any required field is missing or empty, return false
          }
        }
        return true;
      };

      const invalidRows = jsonData.filter((row: any) => !isValid(row));
      console.log(invalidRows, "======>>>>");

      if (invalidRows.length > 0) {
        console.error("Some rows are missing required fields:", invalidRows);
        return;
      }
      console.log(mappedData, "***********************")
      setJsonData(mappedData); // Save the mapped data to state
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

  
  const handleExportUnsavedUsers = (unsavedUsers: any[]) => {
    if (unsavedUsers.length === 0) return; // Don't run if no unsaved brands

    const worksheet = XLSX.utils.json_to_sheet(unsavedUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unsaved Users");

    // Download the file
    XLSX.writeFile(workbook, "unSavedUsers.xlsx");
  };

  async function onSubmit() {
    try {
      if (jsonData.length === 0) {
        console.log(jsonData, "======>>>>>>");

        message.error("No data to submit.");
        dispatch(setLoaderAction(false));
        return;
      }
      let formData: any = []

      dispatch(setLoaderAction(true));
      // for (const values of jsonData) {
      //   const { firstname, lastname, email, password, address, age, phone, zone, joining_date, dob, managerId, city, state, pincode, role, learningRole = "null" } = values;
      //   const serialDate = joining_date;
      //   const baseDate = DateTime.fromISO('1900-01-01');
      //   console.log(serialDate);
      //   const jsDate = baseDate.plus({ days: - 1 });

      //   const serialDate2 = dob;
      //   const baseDate2 = DateTime.fromISO('1900-01-01');
      //   const jsDob = baseDate2.plus({ days: - 1 });
      //   const daata = {
      //     firstname,
      //     lastname,
      //     dob: jsDob,
      //     email,
      //     password: String(password),
      //     address, 
      //     age: 0,
      //     phone, 
      //     zone: "",
      //     joining_date: jsDate,
      //     city,
      //     state,
      //     pincode,
      //     managerId: Number(managerId),
      //     role: role,
      //     learningRole: "null"
      //   }
      //   formData.push(daata)
      //   console.log(formData,"=======f========");
        
      // }
      for (const values of jsonData) {
        const { firstname, lastname, email, password, address, age, phone, zone, joining_date, dob, managerId, city, state, pincode, role, learningRole = "null" } = values;
      
        // Validate and sanitize role
        const formattedRole = role?.trim().toUpperCase();
        const validRoles = ["ADMIN", "DIRECTOR", "RSM", "ASM", "SO", "SSM", "MANAGER", "DISTRIBUTOR", "RETAILER", "SUPER_ADMIN", "CHANNEL"];
      
        if (!validRoles.includes(formattedRole)) {
          console.error("Invalid role:", formattedRole);
          message.error(`Invalid role: ${formattedRole}`);
          continue; // Skip this user if role is invalid
        }

        // const serialDate = joining_date;
        const baseDate = DateTime.fromISO('1900-01-01');
        const jsDate = baseDate.plus({ days: - 1 });

        // const serialDate2 = dob;
        const baseDate2 = DateTime.fromISO('1900-01-01');
        const jsDob = baseDate2.plus({ days: - 1 });

        const daata = {
          firstname,
          lastname,
          dob: jsDob,
          email,
          password: String(password),
          address, 
          age: 0,
          phone, 
          zone: "",
          joining_date: jsDate,
          city,
          state,
          pincode,
          managerId: Number(managerId),
          role: formattedRole,  // Use sanitized role
          learningRole: "null"
        };
      
        formData.push(daata);
      }
      
      const response: any = await createUserImportService(formData);
      console.log(response, "response.......");

      dispatch(setLoaderAction(false));
      if (response?.data?.status === 200) {
        message.success("Added Successfully");
        message.success(response?.data?.message);
          
        redirect("/admin/users")
      } else if (response?.data?.data?.status === 1062) {

      } else {
        message.error("Something Went Wrong")
        const unsavedUsers = response?.data?.data9?.unsavedUsers || [];
        const successfulCount = response?.data?.data9?.successfulCount;
        message.success(successfulCount + " users are successfully added");
        // Automatically export unsaved brands if there are one or more
        if (unsavedUsers.length > 0) {
          handleExportUnsavedUsers(unsavedUsers);
        } else {
          console.log('All User saved successfully!');
        }
      }
    }
    catch (error: any) {
      dispatch(setLoaderAction(false));
      console.log("problem=========>>>", error)
      console.log(error.response.data);
      message.error("Something Went Wrong");
    }

  };

  /*------------------------------------------------------------------------------*/
  return (
    <>
      {/* 
      <Modal title="Import Data" open={isModalOpen} onOk={()=>{handleOk();onSubmit()}}  onCancel={() => {
        handleCancel();
        setJsonData([]); // Clear JSON data on Cancel
        setFileList([]);
      }}> 
       */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: "100%" }}>
            <span style={{ position: 'absolute', left: 0 }}>
              <Button type="primary" onClick={() => { handleOk(); onSubmit() }} style={{ marginRight: '10px' }}>
                OK
              </Button>
              <Button onClick={() => {
                handleCancel();
                setJsonData([]);
                setFileList([]);
              }}>Cancel</Button>
            </span>
            <span>User</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
          setJsonData([]);
          setFileList([]);
        }}
        footer={null}
        style={{ width: "100%" }} // Remove default footer
        width={"90%"}
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

            <Dragger {...props} accept=".xlsx"> {/* Accept only Excel files */}
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag Excel file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for uploading Excel files (.xlsx). The file will be converted to JSON data.
              </p>
            </Dragger>

            {/* /*---------------------------------------------------*/}
            <div>
              {/* <table className="storeCatTable">
              <thead>
                <tr>
                  {/* <th className="createvisittable">Emp. Id</th> */}
              {/* <th className="createvisittable">First Name*</th>
                  <th className="createvisittable">Last Name*</th>
                  <th className="createvisittable">Phone *</th>
                  <th className="createvisittable">Password *</th>
                 
                  <th className="createvisittable">Email</th>
                  <th className="createvisittable">Address</th> */}
              {/* <th className="createvisittable">Zone</th> */}
              {/* <th className="createvisittable">Manager Id</th> */}
              {/* <th className="createvisittable">Date of Birth</th>
                 
                  <th className="createvisittable">Joining Date *</th>
                  <th className="createvisittable">Reporting Manager </th>
                 
                  <th className="createvisittable">Role *</th> */}
              {/* {/* <th className="createvisittable">Reset Password</th> */}

              {/* <th className="createvisittable"></th>
                  <th className="createvisittable"></th>  */}
              {/* </tr>
              </thead>
              <tbody>
                {jsonData && setJsonData?.length > 0 &&
                  jsonData?.map((data: UserImportData, idx: any) => {
                    const {emp_id,firstname, lastname, email, password, address,  phone, zone, joining_date, dob, managerId, role, learningRole = "null" } = data;

                    console.log({data})
                    return (
                      <tr key={idx}>
                       {/* <td className="fs-14">{emp_id}</td> */}

              {/*                         
                       <td className="fs-14">{firstname || 'N/A'}</td>
        <td className="fs-14">{lastname || 'N/A'}</td>
        */}
              {/* <td className="fs-14">{phone || 'N/A'}</td>
        <td className="fs-14">{email || 'N/A'}</td>
        <td className="fs-14">{password || 'N/A'}</td>
        <td className="fs-14">{address || 'N/A'}</td>
        <td className="fs-14">{dob || 'N/A'}</td>
        <td className="fs-14">{joining_date || 'N/A'}</td>
        <td className="fs-14">{managerId || 'N/A'}</td>
        <td className="fs-14">{role ? GetUserRole[role] : 'N/A'}</td> */}


              {/* <td className="fs-14"><Link to={`/auth/confirm-password?empId=${emp_id}&role=${UserRole.ADMIN}`}><EditOutlined /></Link></td>
                        <td>
                  <Link to={`/admin/add-new-users?userId=${emp_id}`} className='linkDefault'>
                    <FormOutlined />
                  </Link>
                  </td>
                  <td>
                    <DeleteOutlined onClick={() => toggleHandler(emp_id, name)} className="deleteIcon"/>
                  </td> */}
              {/* </tr> */}
              {/* ) */}


              {/* </tbody>
            </table>  */}
              <table className="storeCatTable">
                <thead>
                  <tr>
                    {/* <th className="createvisittable">Emp. Id</th> */}
                    <th className="createvisittable">First Name*</th>
                    <th className="createvisittable">Last Name*</th>
                    <th className="createvisittable">Phone*</th>
                    <th className="createvisittable">Password*</th>
                    <th className="createvisittable">Email</th>
                    <th className="createvisittable">Address</th>
                    <th className="createvisittable">dob</th>
                    <th className="createvisittable">Joining Date*</th>
                    <th className="createvisittable">Reporting Manager(Id)*</th>
                    <th className="createvisittable">Role*</th>
                    <th className="createvisittable">City</th>
                    <th className="createvisittable">State</th>
                    <th className="createvisittable">Pincode</th>
                  </tr>
                </thead>
                <tbody>
                  {jsonData && setJsonData?.length > 0 &&
                    jsonData?.map((data: UserImportData, idx: any) => {
                      const { firstname, lastname, phone, password, email, address, dob, joining_date, managerId, role, city, state, pincode } = data;

                      console.log(data, "datttttttt")
                      return (
                        <tr key={idx}>
                          {/*   */}
                          {/* <td className="fs-14"><Link to={`/profile?userId=${emp_id}`} className="linkt">{capitalizeSubstring(name)}</Link></td> */}
                          <td className="fs-14">{firstname || ''}</td>
                          <td className="fs-14">{lastname || ''}</td>
                          <td className="fs-14">{phone || ''}</td>
                          <td className="fs-14">{password || ''}</td>
                          <td className="fs-14">{email || ''}</td>
                          <td className="fs-14">{address || ''}</td>
                          <td className="fs-14">{dob || ''}</td>
                          <td className="fs-14">{joining_date || ''}</td>
                          <td className="fs-14">{managerId || ''}</td>
                          <td className="fs-14">{role || ''}</td>
                          <td className="fs-14">{city || ''}</td>
                          <td className="fs-14">{state || ''}</td>
                          <td className="fs-14">{pincode || ''}</td>



                        </tr>
                      )
                    })}

                </tbody>
              </table>
            </div>
            {/* /*---------------------------------------------------*/}
          </li>
        </ul>
      </Modal>
    </>
  );
}

export default ImportUserData;