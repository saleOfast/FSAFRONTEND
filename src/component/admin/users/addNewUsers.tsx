import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, message, Row, Col } from "antd";
import HookFormInputField from "component/HookFormInputField";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createNewUserSchema } from "utils/formValidations";

import { ArrowLeftOutlined } from "@ant-design/icons";
import previousPage from "utils/previousPage";
import "../style/addNewUsers.css";
import HookFormSelectField from "component/HookFormSelectField";
import { createUserService, getRoleService, getUserDetailsByEmpIdService, updateUserService } from "services/usersSerivce";
import { getManagerActions } from "redux-store/action/usersAction";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux-store/store";
import { setLoaderAction } from "redux-store/action/appActions";
import { GetUserRole, GetUserRoleById, UserRole } from "enum/common";
import { UserData } from "types/User";

const initialFormData = {
  "firstname": "",
  "lastname": "",
  "email": "",
  "password": "",
  "address": "",
  "city": "",
  "state": "",
  "pincode": "",
  "age": "",
  "phone": "",
  "zone": "",
  "dob": "",
  "joining_date": "",
  "managerId": "",
  "role": "",
  "learningRole": ""
}

export default function AddNewUsers() {
  const managersData = useSelector((state: any) => state.users.userManager);
  const dispatch = useDispatch<AppDispatch>();
  const managersList = useMemo(() => managersData, [managersData]);

  useEffect(() => {
    dispatch(getManagerActions());
  }, [dispatch])
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const empId: string | null = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);

  const redirect = useNavigate();

  const FormInputTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 6px;
`;
  const {
    control,
    setValue,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(createNewUserSchema(empId)),
    defaultValues: initialFormData
  })
  const dateFormatting = (data: string) => {
    const date = new Date(data);
    return date.toISOString().split('T')[0];
  }
  const [data, setData] = useState<any>(null)
  const [managerData, setManagerData] = useState<any>(null)
  const [roleData, setRoleData] = useState<any>([])

  useEffect(() => {
    async function fetchData() {
      try {
        dispatch(setLoaderAction(true));
        setIsLoading(true)
        const res = await getRoleService({ isActive: true });
        if (res?.data?.status === 200) {
          setRoleData(res?.data?.data)
          dispatch(setLoaderAction(false));
          setIsLoading(false)
        }
        setIsLoading(false)
        dispatch(setLoaderAction(false));
      } catch (error) {
        dispatch(setLoaderAction(false));
        setIsLoading(false)
      }
    }
    fetchData();
  }, []);
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
          setValue("joining_date", dateFormatting(res?.data?.data?.joining_date))
          setValue("dob", res?.data?.data?.dob ? dateFormatting(res?.data?.data?.dob) : "")
          setValue("address", res?.data?.data?.address)
          setValue("city", res?.data?.data?.city)
          setValue("state", res?.data?.data?.state)
          setValue("pincode", (res?.data?.data?.pincode))
          setValue("managerId", res?.data?.data?.manager)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getUserData();
  }, [])

  const onSubmit = async (values: any) => {
    const { firstname, lastname, email, password, address, city, state, pincode, age, phone, zone, joining_date, dob, managerId, role, learningRole = "null" } = values;
    if (empId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateUserService({
          empId: Number(empId), firstname, lastname, dob: dob == "" ? null : dob, email, address, city, state, pincode, age: Number(age), phone, zone, joining_date, managerId: managerId === managerData ? data : Number(managerId), role, learningRole: "null"
        });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Updated Successfully")
          redirect("/admin/users")
        } else if (response?.data?.data?.status === 1062) {
          message.warning(response?.data?.data?.message)
        } else {
          message.error("Something Went Wrong")
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }
    else {
      try {
        dispatch(setLoaderAction(true));
        const response = await createUserService({
          firstname, lastname, dob: dob == "" ? null : dob, email, password, address, city, state, pincode, age: Number(age), phone, zone, joining_date, managerId: Number(managerId), role, learningRole: "null"
        });
        dispatch(setLoaderAction(false));
        if (response?.data?.data?.status === 200) {
          message.success("Added Successfully")
          redirect("/admin/users")
        } else if (response?.data?.data?.status === 1062) {
          message.error(response?.data?.data?.message)
        } else {
          message.error("Something Went Wrong")
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }
  };
  function getEnumKeyByEnumValue(enumObj: any, value: number): string | undefined {
    return Object.entries(enumObj).find(([key, val]) => val === value)?.[0];
  }
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{empId ? "Update User" : "Add New User"}</h1>
      </header>
      <main className="deskMr-16 formContents ant-typography ant-row ant-form-item ant-form-item-label ant-input-affix-wrapper ant-input ">
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off"
          className="formWidth createbeat"
          labelCol={{ span: 6 }}
          //  labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
          style={{ height: "auto", maxWidth: "100%", fontSize: "12px" }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="firstname"
                placeholder="Enter First Name"
                label={"First Name"}
                required
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="lastname"
                placeholder="Enter Last Name"
                label={"Last Name"}
              // required
              />
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="Contact Number"
                placeholder="Enter Aadhar Number"
                label={"Aadhar"}
                required
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="PAN"
                placeholder="Enter PAN Number"
                label={"PAN"}
              // required
              />
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="phone"
                placeholder="Enter Phone no."
                label={"Phone"}
                required
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} className="ant-input">
              {!empId && <HookFormInputField
                control={control}
                type="password"
                name="password"
                placeholder="Enter Password"
                label={"Password"}
                required
              />}
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="photo"
                placeholder=""
                label={"Photo"}
                required
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="Login Credentials"
                placeholder="N/A"
                label={"Login Credentials"}
                required
              />
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              {/* <HookFormInputField
                control={control}
                type="text"
                name="App Access Given"
                placeholder="Select App Access Given"
                label={"App Access Given"}
                required
              /> */}
              <HookFormSelectField
                control={control}
                name="appAccessGiven"
                label="App Access Given"
                placeholder="Select App Access Given"
                required
                optionData={[
                  { label: "Yes", value: true },
                  { label: "No", value: false }
                ]}
              />

            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              {/* <HookFormInputField
                control={control}
                type="text"
                name="Mode Of Access"
                placeholder="Select Mode Of Access(Picklist)"
                label={"Mode Of Access"}
                required
              /> */}
              <HookFormSelectField
                control={control}
                name="modeOfAccess"
                label="Mode Of Access"
                placeholder="Select Mode Of Access"
                required
                optionData={[
                  { label: "Android", value: "Android" },
                  { label: "iOS", value: "iOS" },
                  { label: "Windows", value: "Windows" }
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              {/* <HookFormInputField
                control={control}
                type="text"
                name="App Access Given"
                placeholder="Select App Access Given"
                label={"App Access Given"}
                required
              /> */}
              <HookFormInputField
                control={control}
                type="text"
                name="Login Shared"
                placeholder="Enter Login Credential Shared"
                label={"Login Credential Shared"}
                required
              />

            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              {/* <HookFormInputField
                control={control}
                type="text"
                name="Mode Of Access"
                placeholder="Select Mode Of Access(Picklist)"
                label={"Mode Of Access"}
                required
              /> */}
              <HookFormSelectField
                control={control}
                name="Training"
                label="Training Completed"
                placeholder="Training Completed"
                required
                optionData={[
                  { label: "Yes", value: "true" },
                  { label: "No", value: "false" },

                ]}
              />

            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              {/* <HookFormInputField
                control={control}
                type="text"
                name="App Access Given"
                placeholder="Select App Access Given"
                label={"App Access Given"}
                required
              /> */}
              <HookFormSelectField
                control={control}
                name="loginShared"
                label="Train Mode "
                placeholder="Select Train Mode"
                required
                optionData={[
                  { label: "Video", value: "Video" },
                  { label: "WhatsApp", value: "WhatsApp" },
                  { label: "In-Person", value: "In-Person" }
                ]}
              />


            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              {/* <HookFormInputField
                control={control}
                type="text"
                name="Mode Of Access"
                placeholder="Select Mode Of Access(Picklist)"
                label={"Mode Of Access"}
                required
              /> */}
              <HookFormInputField
                control={control}
                type="date"
                name="joining_dae"
                placeholder="Enter Train Run Date"
                label={"Train Run Date"}
                required
              />

            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              {/* <HookFormInputField
                control={control}
                type="text"
                name="App Access Given"
                placeholder="Select App Access Given"
                label={"App Access Given"}
                required
              /> */}
              <HookFormSelectField
                control={control}
                name="supervision"
                label="Supervision feedback "
                placeholder="Select Supervision Feedback"
                required
                optionData={[
                  { label: "Satisfactory", value: "Vide" },
                  { label: "Unsatisfying", value: "WhatsAp" },
                  { label: "Provisional", value: "In-Perso" }
                ]}
              />


            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              {/* <HookFormInputField
                control={control}
                type="text"
                name="Mode Of Access"
                placeholder="Select Mode Of Access(Picklist)"
                label={"Mode Of Access"}
                required
              /> */}
              <HookFormSelectField
                control={control}
                name="bill_country"
                label="Country"
                placeholder="Select Country"
                required
                optionData={[
                  { label: "India", value: "India" },
                  { label: "United States", value: "United States" },
                  { label: "Canada", value: "Canada" },
                  { label: "United Kingdom", value: "United Kingdom" },
                  { label: "Australia", value: "Australia" },
                  { label: "Germany", value: "Germany" },
                  { label: "France", value: "France" },
                  { label: "Singapore", value: "Singapore" },
                  { label: "UAE", value: "UAE" }
                  // Add more countries as needed
                ]}
              />


            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="email"
                name="email"
                placeholder="Enter Email"
                label={"Email"}
              // required
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="address"
                placeholder="Enter Address"
                label={"Address"}
              // required
              />
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="city"
                placeholder="Enter City"
                label={"City"}
              // required
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="state"
                placeholder="Enter State"
                label={"State"}
              // required
              />
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="number"
                name="pincode"
                placeholder="Enter Pin Code"
                label={"Pin Code"}
              // required
              />
            </Col>
            {/* <HookFormInputField
              control={control}
              type="text"
              name="zone"
              placeholder="Enter Zone"
              label={"Zone"}
              required
            /> */}
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="date"
                name="dob"
                placeholder="Enter Date of Birth"
                label={"Date of Birth"}
              // required
              />
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="date"
                name="joining_date"
                placeholder="Enter Joining Date"
                label={"Joining Date"}
                required
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormSelectField
                control={control}
                type="text"
                name="managerId"
                placeholder="Select Reporting Manager"
                label={"Reporting Manager"}

                showSearch
                allowClear
                optionData={
                  managersList?.map((data: any) => ({
                    label: `${data.firstname} ${data.lastname}`,
                    value: data?.emp_id,
                  }))
                }

                filterOption={(inputValue: any, option: any) => {
                  return option.label.toLowerCase().includes(inputValue.toLowerCase())
                }}
                required
              />
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormSelectField
                control={control}
                type="text"
                name="role"
                placeholder="Select Role"
                label={"Role"}
                showSearch
                allowClear
                // optionData={[
                //   { label: "Salesman", value: "SSM" },
                //   { label: "Manager", value: "RSM" },
                //   { label: "Admin", value: "ADMIN" },
                // ]}
                disabled={empId ? true : false}
                optionData={roleData.map((data: any) => {
                  const enumKey = getEnumKeyByEnumValue(GetUserRoleById, data.key);
                  // console.log({enumKey})
                  return ({ label: data?.name, value: enumKey })
                })
                }
                filterOption={(inputValue: any, option: any) => {
                  return option.label.toLowerCase().includes(inputValue.toLowerCase())
                }}
                required
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="Profile"
                placeholder="N/A"
                label={"Profile"}
              // required
              />
            </Col>
          </Row>
          <div className="saveUser">
            <div className=" orders-btn">
              <Button onClick={() => redirect(-1)}>Cancel</Button>
              <button type="submit" className="btn-save">Save</button>
            </div>
          </div>
        </Form>
      </main>
    </div>
  );
}
