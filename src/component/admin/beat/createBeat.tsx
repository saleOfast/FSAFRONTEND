import HookFormInputField from 'component/HookFormInputField'
import React, { useEffect, useMemo, useState } from 'react'
import '../../style/createBeat.css'
import { beatSchema } from "../../../utils/formValidations";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, message, Row } from "antd";
import { createBeatService, getBeatByIdService, updateBeatService } from "services/storeService";
import { AppDispatch } from 'redux-store/store';
import { getStoreActions } from 'redux-store/action/storeActions';
import HookFormSelectField from 'component/HookFormSelectField';
import { useLocation, useNavigate } from 'react-router-dom';
import previousPage from 'utils/previousPage';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Country, State, City }  from 'country-state-city';
import { getUsersActions } from 'redux-store/action/usersAction';
import { UserRole } from 'enum/common';
import statesAndUTs from 'asset/stateString';

let country_state_district = require('@coffeebeanslabs/country_state_district');

type FilterDetails = {
  storeType: string;
  // isUnbilled: boolean;
};

type Pagination = {
  pageNumber: number;
  pageSize: number;
}
export default function CreateBeat() {
  const filterDetails: FilterDetails = {
    storeType: "all",
    // isUnbilled: false,
  }
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const beatId: string | null = searchParams.get('beatId');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    dispatch(getStoreActions(filterDetails, pagination));
  }, [])
  const [beatTypeSelect, setBeatTypeSelect] = useState()
  const beatTypeHandler = (e:any) =>{
    setBeatTypeSelect(e)
    setValue("salesRep", "");
  }
  

  const {
    control,
    setValue,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(beatSchema),
    defaultValues: {
      beatName: "",
      area: "",
      store: [],
      country: "",
      state: "",
      district: "",
      city: "",
      salesRep: "",
      beatType: ""
    }
  })
  const [assignTo, setAssignTo] = useState<any>();

  const [cityData, setCityData] = useState<any>();
  const [stateData, setStateData] = useState<any>();
  const [districtData, setDistrictData] = useState<any>();

  const [countryData, setCountryData] = useState<any>();

  const redirect = useNavigate();
  const storeList = useSelector((state: any) => state.store.storeList)

  let countryArray:any = Country.getCountryByCode("IN")
  let country: any = [].concat(countryArray)|| [];
   let countryCode:any= country.filter((data:any)=> data.name ==  countryData);
  let statesArray:any = State.getStatesOfCountry(countryCode[0]?.isoCode);
  let states: any = [].concat(statesArray)|| [];
  let stateCode:any= states.filter((data:any)=> data.name == stateData );
  let state:any = statesAndUTs?.filter((d:any)=> d?.name == stateData ) || [];

  let district:any = country_state_district.getDistrictsByStateId(state[0]?.id) || [];
//  const cityArray:any = City.getCitiesOfState(stateCode[0]?.countryCode, stateCode[0]?.isoCode);
 let city:any = [];
//  city.push({name:"Others"})
const uniqueStoreList = storeList.reduce((acc: any[], store: any) => {
  const trimmedTownCity = store.townCity.trim(); // Trim whitespace
  const storeState = store.state.trim(); // Trim state as well if necessary

  // Check if the townCity is already in the accumulator with the same state
  if (!acc.some(s => s.townCity.trim() === trimmedTownCity && stateData !== storeState)) {
    acc.push({ townCity: trimmedTownCity, state: storeState }); // Add unique store to accumulator
  }
  
  return acc;
}, []);
if (state?.length > 0 && stateData) {
  uniqueStoreList?.forEach((store: any) => {
    const townCityExists = city.some((c: any) =>  c?.name?.toLowerCase() === store.townCity?.toLowerCase());    
    if (store.townCity && !townCityExists) {
      city.push({ name: store.townCity });
    }
  });
}
const getCountrySelect = (e:any) =>{
  setCountryData(e);
  setValue('state', "");
  setValue('district', "");
  setValue('city', "");  
  setValue('store', []);
 }
 const getStateSelect = (e:any) =>{
  setStateData(e);
  setValue('city', "");
  setValue('district', "");
  setValue('store', []);
 }

 const getDistrictSelect = (e:any) =>{
  setDistrictData(e);
  setValue('city', "");
  setValue('store', []);
 }

 const getCitySelect = (e:any) =>{
  setCityData(e?.target?.value);
  setValue('store', []);
  if(e === "Others"){
    setValue("city", "");
}
 }
  const pagination: Pagination = {
    pageNumber: 1,
    pageSize: 100
  }
//  console.log({districtData, stateData, cityData})
const filteredStoreData:any = useMemo(() => {
  return storeList?.filter(({ state, district, townCity }:any) => {
    const isStateMatch = stateData ? state?.toLowerCase() === stateData?.toLowerCase() : true;
    const isDistrictMatch = districtData ? district?.toLowerCase() === districtData?.toLowerCase() : true;
    const isCityMatch = cityData ? townCity?.toLowerCase() === cityData?.toLowerCase() : true;

    return isStateMatch && isDistrictMatch && isCityMatch;
  });
}, [storeList, stateData, districtData, cityData]);
  
  const [roleValue, setRoleValue] = useState<any>()
  const usersSSMList = useSelector((state: any) => state?.users?.usersSSM?.filter((d:any)=> d.role === (beatTypeSelect ?? roleValue)  ));
  useEffect(() => {
    dispatch(getUsersActions());
  }, [])


  useEffect(() => {
    async function getproductBrandData() {
      try {
        if (beatId) {
          setIsLoading(true);
          const res = await getBeatByIdService(beatId);
          setIsLoading(false);
          setCountryData(res?.data?.data?.country);
          setStateData(res?.data?.data?.state);
          setDistrictData(res?.data?.data?.district);
          setCityData(res?.data?.data?.city);
          setAssignTo(res?.data?.data?.empId)
          setRoleValue(res?.data?.data?.user?.role)

          setValue("beatName", res?.data?.data?.beatName)
          setValue("area", res?.data?.data?.area)
          setValue("country", res?.data?.data?.country)
          setValue("state", res?.data?.data?.state)
          setValue("district", res?.data?.data?.district)

          setValue("city", res?.data?.data?.city)
          setValue("store", [...res?.data?.data?.store])
          setValue("salesRep", res?.data?.data?.empId as any);
          setValue("beatType", res?.data?.data?.user?.role );

          
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getproductBrandData();
  }, [beatId])

  
  const onSubmit = async (values: any) => {
    const { beatName, area, district, store, country, state, city, salesRep } = values;
    if (beatId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateBeatService({ beatId: Number(beatId), beatName, area:"", store, country, state, district, city, salesRep :Number(salesRep) });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Updated Successfully")
          redirect("/admin/beat")
        } else {
          message.error("Something Went Wrong");
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    } else {
      try {
        dispatch(setLoaderAction(true));
        const response = await createBeatService({ beatName, area:"", store, country, state, district, city, salesRep:Number(salesRep) });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Added Successfully")
          redirect("/admin/beat")
        } else {
          message.error("Something Went Wrong");
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }
  };
  const FormInputTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 6px;
`
const handleResetStore = () => {
  setValue('store', []); // This will reset the selected store
};
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{beatId ? "Update Beat" : "Create Beat"}</h1>
      </header>
      <main className='content CbeatContainer'>
        <Form
          className="add-store-form createbeat"
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off" 
          // layout="horizontal"
          // labelCol={{ span: 2 }}
          >
          <HookFormInputField
            control={control}
            type="text"
            name="beatName"
            placeholder="Enter Beat name"
            label={"Beat Name"}
            required
          />
          {/* <HookFormInputField
            control={control}
            type="text"
            name="area"
            placeholder="Search Area"
            label={"Area"}
            required
          /> */}
           <HookFormSelectField
            control={control}
            type="text"
            name="beatType"
            placeholder="Select Beat Type"
            label={"Beat Type"}
            showSearch
            allowClear
            // defaultValue={userRoleFilter[0]?.role ?? ""}
            callback={beatTypeHandler}
            optionData={
              [
                {label:"Sales Rep", value: UserRole.SSM},
                {label:"Channel", value: UserRole.CHANNEL},
                {label:"Retailer", value: UserRole.RETAILER}
              ]
            }
            filterOption={(inputValue: any, option: any) => {
              return option.label.toLowerCase().includes(inputValue.toLowerCase())
            }}
            required
          />
          <HookFormSelectField
            control={control}
            type="text"
            name="salesRep"
            placeholder="Select Sales Reps/Channel Partner"
            label={"Sales Reps/Channel"}
            showSearch
            allowClear
            // defaultValue={Number(empData)}
            optionData={
              (usersSSMList)?.map((data: any) => ({
                label: data?.name,
                value: data?.emp_id,
              }))
            }
            filterOption={(inputValue: any, option: any) => {
              return option.label.toLowerCase().includes(inputValue.toLowerCase())
            }}
            required
          />
          
              <Row className="mt-4">
            <Col span={12} className="pr-12">
            <HookFormSelectField
                control={control}
                type="text"
                name="country"
                placeholder="Select Country"
                label={"Country"}
                showSearch
                optionData={ 
                  country?.map((data: any) => ({
                    label: data?.name,
                    value: data?.name
                  })) || []
                }
                required
                filterOption={(inputValue: any, option: any) => {
                  return option.label.toLowerCase().includes(inputValue.toLowerCase())
                }}
                callback={getCountrySelect}
              />
            </Col>
            <Col span={12} className="pl-12">
            <HookFormSelectField
                control={control}
                type="text"
                name="state"
                placeholder="Select State"
                label={"State"}
                showSearch
                optionData={ 
                  states?.map((data: any) => ({
                    label: data?.name,
                    value: data?.name
                  })) || []
                }
                required
                filterOption={(inputValue: any, option: any) => {
                  return option.label.toLowerCase().includes(inputValue.toLowerCase())
                }}
                callback={getStateSelect}
                // disabled={true}

              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={12} className="pr-12">
            <HookFormSelectField
                control={control}
                type="text"
                name="district"
                placeholder="Select District"
                label={"District"}
                showSearch
                optionData={ 
                  district?.map((data: any) => ({
                    label: data?.name,
                    value: data?.name
                  })) || []
                }
                required
                filterOption={(inputValue: any, option: any) => {
                  return option.label.toLowerCase().includes(inputValue.toLowerCase())
                }}
                callback={getDistrictSelect}
                // disabled={true}

              />
            </Col>
            <Col span={12} className="pl-12">
            <HookFormInputField
           control={control}
           type="text"
           name="city"
           placeholder="Enter Town/City"
           label={"Town/City"}
           callback={getCitySelect}
         />
              {/* { cityData === "Others" ?
           <HookFormInputField
           control={control}
           type="text"
           name="city"
           placeholder="Enter Town/City"
           label={"Town/City"}
           required
           callback={getCitySelect}
         />
         :
                <HookFormSelectField
                control={control}
                type="text"
                name="city"
                placeholder="Select city"
                label={"City"}
                showSearch
                optionData={ 
                  city?.map((data: any) => ({
                    label: data?.name,
                    value: data?.name
                  })) || []
                }
            
                filterOption={(inputValue: any, option: any) => {
                  return option.label.toLowerCase().includes(inputValue.toLowerCase())
                }}
                callback={getCitySelect}
                
              />
              }  */}
            </Col>
          </Row>
          <HookFormSelectField
            control={control}
            type="text"
            name="store"
            placeholder="Select Store"
            label={"Add Store"}
            showSearch
            mode="multiple"
            allowClear={true}
            defaultValue={[]}
            optionData={
              beatId
                ? storeList?.map((store: any) => ({
                    label: store.storeName, // Display store name (update mode)
                    value: store.storeId, // Store the store ID
                  }))
                : filteredStoreData?.map((data: any) => ({
                    label: data?.storeName, // Display store name (add mode)
                    value: data?.storeId, // Store store ID
                  }))
            }
            required
            // onChange={handleResetStore}
          />
          <div className="beat-btn">
            <div
              className=" orders-btn">
              <Button onClick={() => redirect(-1)}>Cancel</Button>
              <button type="submit" className="btn-save">
                Save
              </button>
            </div>
          </div>
        </Form>
      </main>
    </div>
  )
}