import React, { Fragment, useCallback, useEffect, useState } from "react";
import statesAndUTs from "../../asset/stateString";
import { useForm } from "react-hook-form";
import { createStoreSchema } from "utils/formValidations";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Row, message } from "antd";
import HookFormInputField from "component/HookFormInputField";
import HookFormSelectField from "component/HookFormSelectField";
import styled from "styled-components";
import { ISelectOption } from "types/Common";
import {
  createStoreService,
  getStoreByIdService,
  updateStoreService,
} from "services/storeService";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { convertToDMS, getCoordinates, openGoogleMap } from "utils/common";
import { useSelector } from "redux-store/reducer";
import { ICreateStoreReq } from "types/Store";
import { getValidationErrors } from "utils/errorEvaluation";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import previousPage from "utils/previousPage";
import { AppDispatch } from "redux-store/store";
import { useAuth } from "context/AuthContext";
import { UserRole } from "enum/common";
import { getUsersActions } from "redux-store/action/usersAction";
import { capitalizeSubstring } from "utils/capitalize";
import { DiscountTypeEnum } from "enum/product";
import { Country, State, City } from "country-state-city";
import { getPaymentModeService } from "services/paymentService";
import "../../App.css";
let country_state_district = require("@coffeebeanslabs/country_state_district");
// const IndianCitiesDatabase = require('indian-cities-database');
// let { getCitiesOfDistrict } = require('indian-cities-database');

const initialFormData = {
  addressLine1: "",
  addressLine2: "",
  beat: "",
  closingTime: "",
  email: "",
  isActive: false,
  isPremiumStore: false,
  lat: "",
  long: "",
  mobileNumber: "",
  alterMobile: "",
  openingTime: "",
  openingTimeAmPm: "AM",
  closingTimeAmPm: "PM",
  ownerName: "",
  pinCode: "",
  state: "",
  district: "",
  storeName: "",
  uid: "",
  emp_id: "",
  assignToRetailor: "",
  storeType: "",
  townCity: "",
  paymentMode: "",

  flatDiscountType: "",
  flatDiscountValue: "",
  isActiveFlatDiscount: false,

  visibilityDiscountType: "",
  visibilityDiscountValue: "",
  isActiveVisibilityDiscount: false,

  orderDiscountRange1: "",
  orderValueRange1: "",
  isActiveOrderValueRange1: "",

  orderDiscountRange2: "",
  orderValueRange2: "",
  isActiveOrderValueRange2: "",

  orderDiscountRange3: "",
  orderValueRange3: "",
  isActiveOrderValueRange3: "",
};

const StoreTimingsOptionData = [
  {
    label: "01:00",
    value: "01:00",
  },
  {
    label: "02:00",
    value: "02:00",
  },
  {
    label: "03:00",
    value: "03:00",
  },
  {
    label: "04:00",
    value: "04:00",
  },
  {
    label: "05:00",
    value: "05:00",
  },
  {
    label: "06:00",
    value: "06:00",
  },
  {
    label: "07:00",
    value: "07:00",
  },
  {
    label: "08:00",
    value: "08:00",
  },
  {
    label: "09:00",
    value: "09:00",
  },
  {
    label: "10:00",
    value: "10:00",
  },
  {
    label: "11:00",
    value: "11:00",
  },
  {
    label: "12:00",
    value: "12:00",
  },
];

const StoreTimingsAmPmOptionData: ISelectOption[] = [
  {
    label: "AM",
    value: "AM",
  },
  {
    label: "PM",
    value: "PM",
  },
];

const premiumStoreOptionData = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
];

const storeStatusOptionData = [
  {
    label: "Active",
    value: true,
  },
  {
    label: "Inactive",
    value: false,
  },
];

const discountTypeOptionData = [
  {
    label: "Percentage(%)",
    value: DiscountTypeEnum.PERCENTAGE,
  },
  {
    label: "Value",
    value: DiscountTypeEnum.VALUE,
  },
];

const FormInputTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 6px;
`;
const AddStore = () => {
  const navigate = useNavigate();
  const storeCategoryOptionData = useSelector((state) =>
    state.store.storeCategory.map((i) => ({
      label: i.categoryName,
      value: i.storeCategoryId,
    }))
  );
  // for(let i=storeCategoryOptionData;i<st)
  // storeCategoryOptionData.forEach(r=>console.log(r))
  // console.log(chemistData,",,,,,,,,,,")

  console.log("storeCategoryOptionData", storeCategoryOptionData);
  const [isPremiumStore, setIsPremiumStore] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const storeId: any = searchParams.get("storeId");
  const { authState } = useAuth();
  const [storeDetails, setStoreDetails] = useState<any>();
  const [paymentModeData, setPaymentModeData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getOrderSummaryData() {
      try {
        setIsLoading(true);
        const res = await getPaymentModeService();
        setIsLoading(false);
        setPaymentModeData(res.data.data);
      } catch (error) {
        setIsLoading(false);
      }
    }
    getOrderSummaryData();
  }, []);

  const [otherCity, setOtherCity] = useState<any>();
  const [defaultCity, setDefaultCity] = useState<any>();
  const [cityData, setCityData] = useState<any>();

  let states = State.getStatesOfCountry("IN");
  let stateCode: any = states.filter((data: any) => data.name == cityData);
  let state: any =
    statesAndUTs?.filter(
      (d: any) => d?.name == (cityData || storeDetails?.state)
    ) || [];
  // let districts = country_state_district.getAllDistricts();
  let statess = country_state_district.getAllStates();
  // console.log({state, statess})
  let district: any =
    country_state_district.getDistrictsByStateId(state[0]?.id) || [];
  const cityArray: any = City.getCitiesOfState("IN", stateCode[0]?.isoCode);
  const city: any = [].concat(cityArray) || [];
  city.push({ name: "Others" });

  const getStateSelect = (e: any) => {
    setCityData(e);
    setValue("townCity", "");
    setValue("district", "");
  };

  const getDistrictSelect = (e: any) => {
    setValue("townCity", "");
  };
  const getOtherSelect = (e: any) => {
    setOtherCity(e);
    if (e === "Others") {
      setValue("townCity", "");
      setDefaultCity("");
    }
  };
  useEffect(() => {
    if (storeId) {
      handleStoreDetails();
    }
  }, [storeId]);
  const { control, handleSubmit, setValue, watch, getValues } = useForm({
    mode: "all",
    resolver: yupResolver(createStoreSchema),
    defaultValues: initialFormData,
  });
  // const chemistData = storeCategoryOptionData?.find((item) => {
  //   console.log(item);
  //   return +item.value === +getValues().storeType;
  // });

  console.log("ddddd", getValues());

  async function handleStoreDetails() {
    try {
      dispatch(setLoaderAction(true));
      const response = await getStoreByIdService(storeId);
      dispatch(setLoaderAction(false));
      if (response && response?.data?.status === 200) {
        let { data } = response.data;
        setStoreDetails(data);
        setValue("addressLine1", data?.addressLine1);
        setValue("addressLine2", data?.addressLine2);
        setValue("closingTime", data?.closingTime);
        setValue("closingTimeAmPm", data?.closingTimeAmPm || "PM");
        setValue("email", data?.email);
        setValue("isActive", data?.isActive);
        setValue("isPremiumStore", data?.isPremiumStore);
        setValue("lat", data?.lat);
        setValue("long", data?.long);
        setValue("mobileNumber", data?.mobileNumber);
        setValue("openingTime", data?.openingTime);
        setValue("openingTimeAmPm", data?.openingTimeAmPm || "AM");
        setValue("ownerName", data?.ownerName);
        setValue("pinCode", data?.pinCode);
        setValue("state", data?.state);
        setValue("storeName", data?.storeName);
        setValue("storeType", data?.storeType);
        setValue("townCity", data?.townCity);
        setValue("uid", data?.uid);
        setValue("emp_id", data?.empId);
        setValue("assignToRetailor", data?.retailorId ?? "");

        setValue("alterMobile", data?.alterMobile);
        setValue("district", data?.district);
        setValue("paymentMode", data?.paymentMode);
        setValue("flatDiscountType", data?.flatDiscount?.discountType);
        setValue("flatDiscountValue", data?.flatDiscount?.value);
        setValue("isActiveFlatDiscount", data?.flatDiscount?.isActive);
        setValue(
          "visibilityDiscountType",
          data?.visibilityDiscount?.discountType
        );
        setValue("visibilityDiscountValue", data?.visibilityDiscount?.value);
        setValue(
          "isActiveVisibilityDiscount",
          data?.visibilityDiscount?.isActive
        );
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  }

  const onSubmit = async (value: any) => {
    const {
      emp_id,
      assignToRetailor,
      storeName,
      uid,
      storeType,
      isActive,
      lat,
      long,
      addressLine1,
      addressLine2,
      townCity,
      state,
      district,
      email,
      pinCode,
      ownerName,
      mobileNumber,
      alterMobile,
      openingTime,
      openingTimeAmPm,
      closingTime,
      closingTimeAmPm,
      paymentMode,
      isPremiumStore,
      flatDiscountType,
      flatDiscountValue,
      isActiveFlatDiscount,
      visibilityDiscountType,
      visibilityDiscountValue,
      isActiveVisibilityDiscount,
      orderDiscountRange1,
      orderValueRange1,
      isActiveOrderValueRange1,
      orderDiscountRange2,
      orderValueRange2,
      isActiveOrderValueRange2,
      orderDiscountRange3,
      orderValueRange3,
      isActiveOrderValueRange3,
    } = value;
    const visibilityDiscount = {
      isActive: isPremiumStore ? isActiveVisibilityDiscount : false,
      discountType: isPremiumStore
        ? visibilityDiscountType
        : DiscountTypeEnum.PERCENTAGE,
      value: isPremiumStore ? Number(visibilityDiscountValue) : 0,
    };
    const flatDiscount = {
      isActive: isPremiumStore ? isActiveFlatDiscount : false,
      discountType: isPremiumStore
        ? flatDiscountType
        : DiscountTypeEnum.PERCENTAGE,
      value: isPremiumStore ? Number(flatDiscountValue) : 0,
    };
    const orderValueDiscount = [
      {
        amountRange: isPremiumStore ? orderDiscountRange1 : "0",
        discountType: DiscountTypeEnum.PERCENTAGE,
        value: isPremiumStore ? Number(orderValueRange1) : 0,
        isActive: isPremiumStore ? isActiveOrderValueRange1 : false,
      },
      {
        amountRange: isPremiumStore ? orderDiscountRange2 : "0",
        discountType: DiscountTypeEnum.PERCENTAGE,
        value: isPremiumStore ? Number(orderValueRange2) : 0,
        isActive: isPremiumStore ? isActiveOrderValueRange2 : false,
      },
      {
        amountRange: isPremiumStore ? orderDiscountRange3 : "0",
        discountType: DiscountTypeEnum.PERCENTAGE,
        value: isPremiumStore ? Number(orderValueRange3) : 0,
        isActive: isPremiumStore ? isActiveOrderValueRange3 : false,
      },
    ];
    if (storeId) {
      try {
        dispatch(setLoaderAction(true));
        const res = await updateStoreService({
          assignTo: Number(emp_id),
          assignToRetailor: Number(assignToRetailor),
          storeId: Number(storeId),
          storeName,
          isActive: isActive,
          storeType: Number(storeType),
          uid,
          lat,
          long,
          addressLine1,
          addressLine2,
          townCity,
          state,
          district,
          email,
          pinCode,
          ownerName,
          mobileNumber,
          alterMobile,
          openingTime,
          openingTimeAmPm,
          closingTime,
          closingTimeAmPm,
          paymentMode,
          isPremiumStore,
          visibilityDiscount,
          flatDiscount,
        });
        message.success(res.data.message);
        dispatch(setLoaderAction(false));
        navigate({ pathname: "/stores" });
      } catch (error) {
        dispatch(setLoaderAction(false));
        message.error(getValidationErrors(error));
      }
    } else {
      try {
        const formData: ICreateStoreReq = {
          ...value,
          openingTime: value.openingTime,
          openingTimeAmPm: value.openingTimeAmPm,
          closingTime: value.closingTime,
          closingTimeAmPm: value.closingTimeAmPm,
          storeType: Number(value.storeType),
          assignTo: Number(emp_id),
          assignToRetailor: Number(assignToRetailor),
          visibilityDiscount,
          flatDiscount,
          orderValueDiscount,
        };
        dispatch(setLoaderAction(true));
        const res = await createStoreService(formData);
        message.success(res.data.message);
        dispatch(setLoaderAction(false));
        navigate({ pathname: "/stores" });
      } catch (error) {
        dispatch(setLoaderAction(false));
        message.error(getValidationErrors(error));
      }
    }
  };

  const handleCancel = () => {
    navigate({ pathname: "/stores" });
  };
  const handleGeoLocation = useCallback(async () => {
    try {
      setValue("lat", "");
      setValue("long", "");
      dispatch(setLoaderAction(true));
      const res = await getCoordinates();
      dispatch(setLoaderAction(false));
      if (res) {
        setValue("lat", res.latitude.toString());
        setValue("long", res.longitude.toString());
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  }, [dispatch, setValue]);

  const premiumHandler = (e: boolean) => {
    setIsPremiumStore(e);
  };

  const usersSSMList = useSelector((state: any) => state?.users?.usersSSM);
  let userData: any = usersSSMList ?? [];
  useEffect(() => {
    dispatch(getUsersActions());
  }, []);
  const [storeTypeData, setstoreTypeData] = useState();
  console.log("mmmmm", storeTypeData);

  return (
    <div>
      <header
        className="heading heading-container"
        style={{ backgroundColor: "#8488BF" }}
      >
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18 ">
          {storeId
            ? "Update Doctor/Chemist/stockist"
            : "Add Customer"}
        </h1>
      </header>
      <div className="dflex-center">
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off"
          className=" add-store-form-container ant-form-item-label 
           ant-form-item ant-form-item-control ant-select-selector-item  ant-select-input 
           ant-select-selection-placeholder ant-select-selector"
          // layout="horizontal"
          // labelCol={{ span: 6 }}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          // wrapperCol={{ span: 14 }}
          style={{ width: "100%" }}
        // disabled={componentDisabled}
        >
          <Row gutter={24}>
            <Col span={24}>
              <FormInputTitle className="customer-heading">Customer Onboarding Information</FormInputTitle>

              {/* Add all other "Bill to" fields using names like bill_addressLine2, bill_state, etc. */}
            </Col>
          </Row>
          <Row gutter={[24, 16]} >
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormSelectField
                control={control}
                type="text"
                name="storeType"
                placeholder="Select Store Type(Picklist)"
                label={"Customer Type"}
                showSearch
                callback={(v: any) => setstoreTypeData(v)}
                optionData={storeCategoryOptionData}
                filterOption={(inputValue: any, option: any) => {
                  return option.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }}
                required
                style={{ width: "100%", }}
              />
              {/* Add all other "Bill to" fields using names like bill_addressLine2, bill_state, etc. */}

            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>

              <HookFormInputField
                control={control}
                type="text"
                name="storeName"
                placeholder="Enter Customer Name"
                label={"Customer Name"}
                required
              // style={{ fontSize: "9px" }}
              />
              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>


              <HookFormInputField

                control={control}
                type="text"
                name="uid"
                placeholder="Enter GST/UID"
                // style={{ fontSize: "9px" }}
                label={"GST/UID"}
                required
              />
              {/* Add all other "Bill to" fields using names like bill_addressLine2, bill_state, etc. */}

            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormSelectField
                control={control}
                type="text"
                name="emp_id"
                placeholder="Select Sales Executive"
                label={"Assign to SSM"}
                showSearch
                allowClear
                optionData={userData
                  ?.filter((data: any) => data?.role === UserRole.SSM)
                  ?.map((data: any) => ({
                    label: `${capitalizeSubstring(data?.name)} (${data?.role})`,
                    value: data?.emp_id,
                  }))}
                filterOption={(inputValue: any, option: any) => {
                  return option.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }}
                required
              />

              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>
          </Row>
          <Row gutter={[24, 16]} >
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormSelectField
                control={control}
                type="text"
                name="status"
                placeholder="Select Status (Picklist)"
                label={"Status"}
                showSearch
                // callback={(v: any) => setstoreTypeData(v)}
                optionData={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                  { label: "Blacklisted", value: "blacklisted" }
                ]}
                // filterOption={(inputValue: any, option: any) => {
                //   return option.label.toLowerCase().includes(inputValue.toLowerCase());
                // }}
                required
              />

              {/* Add all other "Bill to" fields using names like bill_addressLine2, bill_state, etc. */}

            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>

              <HookFormInputField
                control={control}
                type="Default"
                name="Created By"
                placeholder="Enter Created By"
                label={"Created By"}
                required
              // style={{ fontSize: "9px" }}
              />
              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>
          </Row>
          <Row gutter={[24, 16]} >
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="Default"
                name="Created On"
                placeholder="Enter Created On"
                label={"Created On"}
                required

              />
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>

              <HookFormSelectField
                control={control}
                type="text"
                name="Customer Category"
                placeholder="Select Customer Category (Picklist)"
                label={"Customer Category"}
                showSearch
                callback={(v: any) => setstoreTypeData(v)}
                optionData={[
                  { label: "Platinum", value: "Platinum" },
                  { label: "Gold", value: "Gold" },
                  { label: "Silver", value: "Silver" }
                ]}
                filterOption={(inputValue: any, option: any) => {
                  return option.label.toLowerCase().includes(inputValue.toLowerCase());
                }}
                required
              />

              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>
          </Row>
          <Row gutter={[24, 16]} >
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormSelectField
                control={control}
                type="text"
                name="preferredProducts" // 👈 field name meaningful rakho
                placeholder="Select Preferred Products (Picklist)"
                label={"Preferred Products"}
                showSearch
                callback={(v: any) => setstoreTypeData(v)}
                optionData={[
                  { label: "Milk", value: "milk_tofu" },
                  { label: "Tofu", value: "tofu" },
                  { label: "Curd", value: "curd" }
                ]}
                filterOption={(inputValue: any, option: any) => {
                  return option.label.toLowerCase().includes(inputValue.toLowerCase());
                }}
                required
              />

            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="PAN Number"
                placeholder="Enter PAN Number"
                label={"PAN Number"}
                required

              />

              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <FormInputTitle>Customer Financial Detail</FormInputTitle>

              {/* Add all other "Bill to" fields using names like bill_addressLine2, bill_state, etc. */}
            </Col>
          </Row>
          <Row gutter={[24, 16]} >
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormSelectField
                control={control}
                type="text"
                name="paymentTerms"
                placeholder="Select No. of Days/Payment Mode"
                label={"Payment Terms"}
                showSearch
                allowClear
                optionData={paymentModeData?.map((data: any) => ({
                  label:
                    data?.name?.toLowerCase() == "cod"
                      ? data?.name
                      : `${data?.name} Days`,
                  value: data?.name,
                }))}
                filterOption={(inputValue: any, option: any) => {
                  return option.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }}
              />
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>

              <HookFormSelectField
                control={control}
                type="text"
                name="paymentMethod" // 👈 Meaningful and unique name
                placeholder="Select Payment Method (Picklist)"
                label={"Payment Mode"}
                showSearch
                callback={(v: any) => setstoreTypeData(v)}
                optionData={[
                  { label: "Cash", value: "cash" },
                  { label: "UPI", value: "upi" },
                  { label: "Bank", value: "bank" }
                ]}
                filterOption={(inputValue: any, option: any) => {
                  return option.label.toLowerCase().includes(inputValue.toLowerCase());
                }}
                required
              />


              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>
          </Row>

          {/* <HookFormSelectField
            control={control}
            type="text"
            name="storeType"
            placeholder="Select Store Type(Picklist)"
            label={"Customer Type"}
            showSearch
            // value={}
            callback={(v: any) => setstoreTypeData(v)}
            optionData={storeCategoryOptionData}
            filterOption={(inputValue: any, option: any) => {
              return option.label
                .toLowerCase()
                .includes(inputValue.toLowerCase());
            }}
            required

          /> */}
          {/* <HookFormInputField
            control={control}
            type="text"
            name="storeName"
            placeholder="Enter Store Name"
            label={"Customer Name"}
            required
          // style={{ fontSize: "9px" }}
          /> */}




          {/* <IF condition={chemistData?.value !== 31} > */}
          {/* {storeTypeData==32 && */}
          {/* <HookFormInputField
            control={control}
            type="text"
            name="storeName"
            placeholder="Enter Store Name"
            label={"Customer Name"}
            required
            // style={{ fontSize: "9px" }}
          /> */}
          {/* } */}

          {/* </IF> */}

          {/* <HookFormInputField

            control={control}
            type="text"
            name="uid"
            placeholder="Enter GST/UID"
            // style={{ fontSize: "9px" }}
            label={"GST/UID"}

            required

          /> */}

          {authState?.user?.role !== UserRole.SSM && (
            <>
              {" "}
              {/* <HookFormSelectField
                control={control}
                type="text"
                name="emp_id"
                placeholder="Select Sales Executive"
                label={"Assign to SSM"}
                showSearch
                allowClear
                optionData={userData
                  ?.filter((data: any) => data?.role === UserRole.SSM)
                  ?.map((data: any) => ({
                    label: `${capitalizeSubstring(data?.name)} (${data?.role})`,
                    value: data?.emp_id,
                  }))}
                filterOption={(inputValue: any, option: any) => {
                  return option.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }}
                required
              /> */}
              {/* {storeTypeData !== 40 && (
                <HookFormSelectField
                  control={control}
                  type="text"
                  name="assignToRetailor"
                  placeholder="Select Retailor"
                  label={"Assign to Retailor"}
                  showSearch
                  allowClear
                  optionData={userData
                    ?.filter((data: any) => data?.role === UserRole.RETAILER)
                    ?.map((data: any) => ({
                      label: `${capitalizeSubstring(data?.name)} (${data?.role
                        })`,
                      value: data?.emp_id,
                    }))}
                  filterOption={(inputValue: any, option: any) => {
                    return option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase());
                  }}
                  required

                />
              )} */}
            </>
          )}
          <Row gutter={[24, 16]}>
            {/* Bill to Address */}
            <Col xs={24} md={12}>
              <div>
                <FormInputTitle>Bill to Address</FormInputTitle>

                <HookFormInputField
                  control={control}
                  name="bill_addressLine1"
                  label="Address Line 1"
                  placeholder="Enter Address Line 1"
                  required
                />
                <HookFormInputField
                  control={control}
                  name="bill_addressLine2"
                  label="Address Line 2"
                  placeholder="Enter Address Line 2"
                  required
                />
                <HookFormSelectField
                  control={control}
                  type="text"
                  name="bill_state"
                  label="State"
                  placeholder="Select State"
                  showSearch
                  optionData={states.map((data: any) => ({
                    label: data.name,
                    value: data.name,
                  }))}
                  filterOption={(inputValue: any, option: any) =>
                    option.label.toLowerCase().includes(inputValue.toLowerCase())
                  }
                  required
                  callback={getStateSelect}
                />
                <HookFormSelectField
                  control={control}
                  type="text"
                  name="bill_district"
                  label="District"
                  placeholder="Select District"
                  showSearch
                  optionData={district.map((data: any) => ({
                    label: data.name,
                    value: data.name,
                  }))}
                  filterOption={(inputValue: any, option: any) =>
                    option.label.toLowerCase().includes(inputValue.toLowerCase())
                  }
                  required
                  callback={getDistrictSelect}
                />
                <HookFormInputField
                  control={control}
                  name="bill_city"
                  label="Town/City"
                  placeholder="Enter Town/City"
                  required
                />
                <HookFormInputField
                  control={control}
                  name="bill_country"
                  label="Country"
                  placeholder="Enter Country"
                  required
                />
                <HookFormInputField
                  control={control}
                  name="bill_pincode"
                  label="Pincode"
                  placeholder="Enter Pincode"
                  required
                />
              </div>
            </Col>

            {/* Ship to Address */}
            <Col xs={24} md={12}>
              <div>
                <FormInputTitle>Ship to Address</FormInputTitle>

                <HookFormInputField
                  control={control}
                  name="ship_addressLine1"
                  label="Address Line 1"
                  placeholder="Enter Address Line 1"
                  required
                />
                <HookFormInputField
                  control={control}
                  name="ship_addressLine2"
                  label="Address Line 2"
                  placeholder="Enter Address Line 2"
                  required
                />
                <HookFormSelectField
                  control={control}
                  type="text"
                  name="ship_state"
                  label="State"
                  placeholder="Select State"
                  showSearch
                  optionData={states.map((data: any) => ({
                    label: data.name,
                    value: data.name,
                  }))}
                  filterOption={(inputValue: any, option: any) =>
                    option.label.toLowerCase().includes(inputValue.toLowerCase())
                  }
                  required
                  callback={getStateSelect}
                />
                <HookFormSelectField
                  control={control}
                  type="text"
                  name="ship_district"
                  label="District"
                  placeholder="Select District"
                  showSearch
                  optionData={district.map((data: any) => ({
                    label: data.name,
                    value: data.name,
                  }))}
                  filterOption={(inputValue: any, option: any) =>
                    option.label.toLowerCase().includes(inputValue.toLowerCase())
                  }
                  required
                  callback={getDistrictSelect}
                />
                <HookFormInputField
                  control={control}
                  name="ship_city"
                  label="Town/City"
                  placeholder="Enter Town/City"
                  required
                />
                <HookFormInputField
                  control={control}
                  name="ship_country"
                  label="Country"
                  placeholder="Enter Country"
                  required
                />
                <HookFormInputField
                  control={control}
                  name="ship_pincode"
                  label="Pincode"
                  placeholder="Enter Pincode"
                  required
                />
              </div>
            </Col>
          </Row>



          <span >
            <div
              // style={{ flexDirection: "column", gap: "5px" }}
              className="dflex"
            >
              <Button
                type="primary"
                size="large"
                className="addStoBtn"
                onClick={handleGeoLocation}
              >
                Get Geo-Location
              </Button>
              {!storeId ? (
                <>
                  {watch()?.lat && watch().long && (
                    <div className="geoLoc">Geo-Location Captured</div>
                  )}
                </>
              ) : (
                <>
                  {storeDetails?.lat && storeDetails?.long && (
                    <div className="geoLoc">Geo-Location Captured</div>
                  )}
                </>
              )}
            </div>
            {!storeId ? (
              <>
                {watch()?.lat && watch().long && (
                  <>
                    <div
                      style={{ flexDirection: "column", gap: "5px" }}
                      className="dflex"
                    >
                      <span>
                        <span style={{ fontWeight: 500 }}>Latitude:</span>{" "}
                        {convertToDMS(watch()?.lat, true)}

                      </span>
                      <span>
                        <span style={{ fontWeight: 500 }}>Longitude:</span>{" "}
                        {convertToDMS(watch()?.long, false)}
                      </span>
                    </div>
                    <img
                      src="https://sfa.saleofast.com/images/map.png"
                      width={90}
                      height={50}
                      style={{ cursor: "pointer" }}
                      onClick={() => openGoogleMap(watch()?.lat, watch()?.long)}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                {storeDetails?.lat && storeDetails?.long && (
                  <>
                    <div
                      style={{ flexDirection: "column", gap: "5px" }}
                      className="dflex"
                    >
                      <span>
                        <span style={{ fontWeight: 500 }}>Latitude:</span>{" "}
                        {convertToDMS(storeDetails?.lat, true)}
                      </span>
                      <span>
                        <span style={{ fontWeight: 500 }}>Longitude:</span>{" "}
                        {convertToDMS(storeDetails?.long, false)}
                      </span>
                    </div>
                    <img
                      src="https://sfa.saleofast.com/images/map.png"
                      width={90}
                      height={50}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        openGoogleMap(storeDetails?.lat, storeDetails?.long)
                      }
                    />
                  </>
                )}
              </>
            )}
          </span>
          <Row gutter={24}>
            <Col span={24}>
              <FormInputTitle>Contact Details</FormInputTitle>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                name="bill_addressLine1"
                label="Pincode"
                placeholder="Enter Pincode"
                required
              />
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>

              <HookFormInputField
                control={control}
                type="text"
                name="ownerName"
                placeholder="Enter Owner Name"
                label={"Owner Name"}
                required
              />

              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>

          </Row>
          {/* <HookFormInputField
            control={control}
            type="text"
            name="ownerName"
            placeholder="Enter Owner Name"
            label={"Owner Name"}
            required
          /> */}
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="qualification"
                placeholder="Enter qualification"
                label={"Qualification"}
              // required
              />
              {/* Add all other "Bill to" fields using names like bill_addressLine2, bill_state, etc. */}
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="text"
                name="speciality"
                placeholder="Enter speciality"
                label={"Speciality"}
              // required
              />

              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>

          </Row>
          {/* <HookFormInputField
            control={control}
            type="text"
            name="qualification"
            placeholder="Enter qualification"
            label={"Qualification"}
          // required
          /> */}
          {/* <HookFormInputField
            control={control}
            type="text"
            name="speciality"
            placeholder="Enter speciality"
            label={"Speciality"}
          // required
          /> */}
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="tel"
                name="mobileNumber"
                placeholder="Enter Phone Number"
                label={"Phone Number"}
                required
              />
              {/* Add all other "Bill to" fields using names like bill_addressLine2, bill_state, etc. */}
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="tel"
                name="alterMobile"
                placeholder="Enter Alternate Phone Number"
                label={"Alternate Phone No"}
              />

              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>

          </Row>
          {/* <HookFormInputField
            control={control}
            type="tel"
            name="mobileNumber"
            placeholder="Enter Phone Number"
            label={"Phone Number"}
            required
          /> */}
          {/* <HookFormInputField
            control={control}
            type="tel"
            name="alterMobile"
            placeholder="Enter Alternate Phone Number"
            label={"Alternate Phone No"}
          /> */}

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
              {/* Add all other "Bill to" fields using names like bill_addressLine2, bill_state, etc. */}
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormInputField
                control={control}
                type="date"
                name="DOB"
                placeholder="Enter date of birth"
                label={"Date of birth"}
              // required
              />

              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>

          </Row>
          {/* <HookFormInputField
            control={control}
            type="email"
            name="email"
            placeholder="Enter Email"
            label={"Email"}
          // required
          /> */}
          {/* <HookFormInputField
            control={control}
            type="date"
            name="DOB"
            placeholder="Enter date of birth"
            label={"Date of birth"}
          // required
          /> */}

          {(storeTypeData == 40 || storeTypeData == 34) && (
            <HookFormInputField
              control={control}
              type="text"
              pattern="[A-Za-z)0-9]"
              name="registrationNo"
              placeholder="Enter Registration Number"
              label={"Registration number"}
            // required
            />
          )}

          {(storeTypeData == 40 || storeTypeData == 34) && (
            <HookFormInputField
              control={control}
              type="text"
              name="clinicname"
              placeholder="Enter Clinic Name"
              label={"Clinic Name"}
            // required
            />
          )}

          {(storeTypeData == 40 || storeTypeData == 34) && (
            <HookFormInputField
              control={control}
              type="number"
              name="patientVolume"
              placeholder="Enter Patient Volume"
              label={"Patient Volume"}
            // required
            />
          )}

          <FormInputTitle>Opening hours</FormInputTitle>
          <Row className="mt-4">
            <Col xs={24} sm={24} md={12} lg={12} className="pr-12">
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
            <Col xs={24} sm={24} md={12} lg={12} className="pr-12">
              <HookFormSelectField
                control={control}
                type="text"
                name="openingTimeAmPm"
                placeholder=""
                label={""}
                optionData={StoreTimingsAmPmOptionData}
              />
            </Col>
          </Row>
          <FormInputTitle>Closing hours</FormInputTitle>
          <Row className="mt-4">
            <Col xs={24} sm={24} md={12} lg={12} className="pr-12">
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
            <Col xs={24} sm={24} md={12} lg={12} className="pr-12">
              <HookFormSelectField
                control={control}
                type="text"
                name="closingTimeAmPm"
                placeholder=""
                label={""}
                optionData={StoreTimingsAmPmOptionData}
              />
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              {/* <HookFormSelectField
                control={control}
                type="text"
                name="paymentMode"
                placeholder="Select No. of Days/Payment Mode"
                label={"Payment Mode"}
                showSearch
                allowClear
                optionData={paymentModeData?.map((data: any) => ({
                  label:
                    data?.name?.toLowerCase() == "cod"
                      ? data?.name
                      : `${data?.name} Days`,
                  value: data?.name,
                }))}
                filterOption={(inputValue: any, option: any) => {
                  return option.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }}
              /> */}
              {/* Add all other "Bill to" fields using names like bill_addressLine2, bill_state, etc. */}
              <HookFormSelectField
                control={control}
                type="text"
                name="isPremiumStore"
                placeholder="Premium store"
                label={"Premium store"}
                optionData={premiumStoreOptionData}
                required
                callback={premiumHandler}
              />
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <HookFormSelectField
                control={control}
                type="text"
                name="isActive"
                placeholder="Store status"
                label={"Store status"}
                optionData={storeStatusOptionData}
                required
              />

              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>

          </Row>
          {/* <HookFormSelectField
            control={control}
            type="text"
            name="paymentMode"
            placeholder="Select No. of Days/Payment Mode"
            label={"Payment Mode"}
            showSearch
            allowClear
            optionData={paymentModeData?.map((data: any) => ({
              label:
                data?.name?.toLowerCase() == "cod"
                  ? data?.name
                  : `${data?.name} Days`,
              value: data?.name,
            }))}
            filterOption={(inputValue: any, option: any) => {
              return option.label
                .toLowerCase()
                .includes(inputValue.toLowerCase());
            }}
          /> */}
          {/* <HookFormSelectField
            control={control}
            type="text"
            name="isActive"
            placeholder="Store status"
            label={"Store status"}
            optionData={storeStatusOptionData}
            required
          /> */}
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={12}>
              {/* <HookFormSelectField
                control={control}
                type="text"
                name="isPremiumStore"
                placeholder="Premium store"
                label={"Premium store"}
                optionData={premiumStoreOptionData}
                required
                callback={premiumHandler}
              /> */}
              {/* Add all other "Bill to" fields using names like bill_addressLine2, bill_state, etc. */}
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>


              {/* Add all other "Ship to" fields using names like ship_addressLine2, ship_state, etc. */}
            </Col>

          </Row>
          {/* <HookFormSelectField
            control={control}
            type="text"
            name="isPremiumStore"
            placeholder="Premium store"
            label={"Premium store"}
            optionData={premiumStoreOptionData}
            required
            callback={premiumHandler}
          /> */}
          {(storeDetails?.isPremiumStore || isPremiumStore) && (
            <Fragment>
              <FormInputTitle>Premium Flat Discount</FormInputTitle>
              <Row className="mt-4">
                <Col span={8} className="pl-12">
                  <HookFormSelectField
                    control={control}
                    type="text"
                    name="flatDiscountType"
                    placeholder="Select Discount Type"
                    label={""}
                    optionData={discountTypeOptionData}
                  />
                </Col>
                <Col span={8} className="pl-12">
                  <HookFormInputField
                    control={control}
                    type="number"
                    name="flatDiscountValue"
                    placeholder="Enter Value"
                  />
                </Col>
                <Col span={8} className="pl-12">
                  <HookFormSelectField
                    control={control}
                    type="text"
                    name="isActiveFlatDiscount"
                    placeholder="IsActive"
                    optionData={premiumStoreOptionData}
                  />
                </Col>
              </Row>
              <FormInputTitle>Premium Visibility Discount</FormInputTitle>
              <Row className="mt-4">
                <Col span={8} className="pl-12">
                  <HookFormSelectField
                    control={control}
                    type="text"
                    name="visibilityDiscountType"
                    placeholder="Select Discount Type"
                    label={""}
                    optionData={discountTypeOptionData}
                  />
                </Col>
                <Col span={8} className="pl-12">
                  <HookFormInputField
                    control={control}
                    type="number"
                    name="visibilityDiscountValue"
                    placeholder="Enter Value"
                  />
                </Col>
                <Col span={8} className="pl-12">
                  <HookFormSelectField
                    control={control}
                    type="text"
                    name="isActiveVisibilityDiscount"
                    placeholder="IsActive"
                    optionData={premiumStoreOptionData}
                  />
                </Col>
              </Row>
            </Fragment>
          )}
          
          <div className="button-container" style={{ marginBottom: "50px" }}>
            <Button onClick={handleCancel} htmlType="button">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>

  );
};

export default AddStore;
