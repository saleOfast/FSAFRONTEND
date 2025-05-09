import React, { useState,useCallback } from 'react';
import '../../style/createBeat.css'
import axios from 'axios';

import HookFormInputField from 'component/HookFormInputField';
import HookFormSelectField from 'component/HookFormSelectField';
import statesAndUTs from "../../../asset/stateString";
import { useForm } from "react-hook-form";
import { createStoreSchema } from "utils/formValidations";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Row, message } from "antd";
import styled from "styled-components";
import { ISelectOption } from "types/Common";
import { createStoreService } from "services/storeService";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { getCoordinates } from "utils/common";
import { useSelector } from "redux-store/reducer";
import { ICreateStoreReq } from "types/Store";
import { getValidationErrors } from "utils/errorEvaluation";
import { useNavigate } from "react-router-dom";
import previousPage from 'utils/previousPage';
import { ArrowLeftOutlined } from '@ant-design/icons';

const initialFormData = {
  addressLine1: "",
  addressLine2: "",
  beat: "",
  closingTime: "",
  email: "",
  isActive: false,
  isPremiumStore: false,
  lat: null,
  long: null,
  mobileNumber: "",
  alterMobile: "",
  openingTime: "",
  openingTimeAmPm: "AM",
  closingTimeAmPm: "AM",
  paymentMode: "",
  ownerName: "",
  pinCode: "",
  state: "",
  district: "",
  storeName: "",
  uid:"",
  storeType: "",
  townCity: "",
  emp_id: "",
  assignToRetailor: "",
  flatDiscountType: "",
  flatDiscountValue: "",
  isActiveFlatDiscount: false,

  visibilityDiscountType: "",
  visibilityDiscountValue: "",
  isActiveVisibilityDiscount: false,
};

const StoreTimingsOptionData = [
  {
    label: "01:00",
    value: "01:00"
  },
  {
    label: "02:00",
    value: "02:00"
  },
  {
    label: "03:00",
    value: "03:00"
  },
  {
    label: "04:00",
    value: "04:00"
  },
  {
    label: "05:00",
    value: "05:00"
  },
  {
    label: "06:00",
    value: "06:00"
  },
  {
    label: "07:00",
    value: "07:00"
  },
  {
    label: "08:00",
    value: "08:00"
  },
  {
    label: "09:00",
    value: "09:00"
  },
  {
    label: "10:00",
    value: "10:00"
  },
  {
    label: "11:00",
    value: "11:00"
  },
  {
    label: "12:00",
    value: "12:00"
  },
];

const StoreTimingsAmPmOptionData: ISelectOption[] = [
  {
    label: "AM",
    value: "AM"
  },
  {
    label: "PM",
    value: "PM"
  },
]

const premiumStoreOptionData = [
  {
    label: "Yes",
    value: true
  },
  {
    label: "No",
    value: false
  }
]

const storeStatusOptionData = [
  {
    label: "Active",
    value: true
  },
  {
    label: "Inactive",
    value: false
  }
]



const FormInputTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 6px;
`
export default function AddDistributor() {
  // Generate an array of time options (for example, every 30 minutes)
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const time = `${formattedHour}:${formattedMinute}`;
      timeOptions.push(<option key={time} value={time}>{time}</option>);
    }
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storeCategoryOptionData = useSelector(state => state.store.storeCategory.map(i => ({
    label: i.categoryName,
    value: i.storeCategoryId
  })));

  const {
    control,
    handleSubmit,
    setValue
  } = useForm({
    mode: "all",
    resolver: yupResolver(createStoreSchema),
    defaultValues: initialFormData
  })

  const onSubmit = async (value: any) => {
    try {
      const formData: ICreateStoreReq = {
        ...value,
        // have to remove
        beat: "Sector 72",
      }
      dispatch(setLoaderAction(true));
      const res = await createStoreService(formData)
      message.success(res.data.message)
      dispatch(setLoaderAction(false));
      navigate({ pathname: "/stores" })
    } catch (error) {
      dispatch(setLoaderAction(false));
      message.error(getValidationErrors(error))
    }
  };

  const handleClear = () => {

  }
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button"/>
          <h1 className="page-title pr-18">Add Distributor</h1>
        </header>
      <div className="add-store-form-container">
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off">
          <HookFormInputField
            control={control}
            type="text"
            name="storeName"
            placeholder="Enter Outlet Name"
            label={"Outlet Name"}
            required
          />

          <HookFormSelectField
            control={control}
            type="text"
            name="storeType"
            placeholder="Select Outlet Type"
            label={"Outlet Type"}
            showSearch
            optionData={storeCategoryOptionData}
            filterOption={(inputValue: any, option: any) => {
              return option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            }
            required
          />
          <FormInputTitle>Outlet Address</FormInputTitle>
          <HookFormInputField
            control={control}
            type="text"
            name="addressLine1"
            placeholder="Address line 1"
            label={"Address line 1"}
            required
          />

          <HookFormInputField
            control={control}
            type="text"
            name="addressLine2"
            placeholder="Enter Address line 2"
            label={"Address line 2"}
          />

          <HookFormInputField
            control={control}
            type="text"
            name="townCity"
            placeholder="Enter Town/city"
            label={"Town/city"}
            required
          />

          <HookFormSelectField
            control={control}
            type="text"
            name="state"
            placeholder="Select State"
            label={"State"}
            showSearch
            optionData={
              statesAndUTs.map((data) => ({
                label: data.name,
                value: data.name
              }))
            }
            required
          />
          <HookFormInputField
            control={control}
            type="text"
            name="pinCode"
            placeholder="Enter pincode"
            label={"Pincode"}
            required
          />
          <FormInputTitle>Contact Details</FormInputTitle>
          <HookFormInputField
            control={control}
            type="text"
            name="ownerName"
            placeholder="Enter owner name"
            label={"Owner name"}
            required
          />

          <HookFormInputField
            control={control}
            type="tel"
            name="mobileNumber"
            placeholder="Enter mobile number"
            label={"Mobile number"}
            required
          />

          <HookFormInputField
            control={control}
            type="email"
            name="email"
            placeholder="Enter email"
            label={"Email"}
            required
          />

          <FormInputTitle>Opening hours</FormInputTitle>
          <Row className='mt-4'>
            <Col span={12} className='pr-12'>
              <HookFormSelectField
                control={control}
                type="text"
                name="openingTime"
                placeholder=""
                label={""}
                optionData={StoreTimingsOptionData}
                required
              />
            </Col>
            <Col span={12} className='pl-12'>
              <HookFormSelectField
                control={control}
                type="text"
                name="openingTimeAmPm"
                placeholder=""
                label={""}
                optionData={StoreTimingsAmPmOptionData}
                required
              />
            </Col>
          </Row>

          <FormInputTitle>Closing hours</FormInputTitle>
          <Row className='mt-4'>
            <Col span={12} className='pr-12'>
              <HookFormSelectField
                control={control}
                type="text"
                name="closingTime"
                placeholder=""
                label={""}
                optionData={StoreTimingsOptionData}
                required
              />
            </Col>
            <Col span={12} className='pl-12'>
              <HookFormSelectField
                control={control}
                type="text"
                name="closingTimeAmPm"
                placeholder=""
                label={""}
                optionData={StoreTimingsAmPmOptionData}
                required
              />
            </Col>
          </Row>
          <HookFormSelectField
            control={control}
            type="text"
            name="isActive"
            placeholder="Store status"
            label={"Store status"}
            optionData={storeStatusOptionData}
            required
          />
          <div className="button-container">
            <Button onClick={handleClear} htmlType="button">
              Clear
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};


