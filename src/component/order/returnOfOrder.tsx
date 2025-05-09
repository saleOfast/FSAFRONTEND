import react from 'react';
import React, { useEffect, useRef, useState } from 'react'
/*-------------------------------------------*/
import styled from "styled-components";
import HookFormSelectField from "component/HookFormSelectField";
import { useForm } from "react-hook-form";
import { Button, Steps ,Row,Col} from 'antd';
/*-----------------------------------------*/

export const ReturnOfObjet=()=>{
  const FormInputTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 6px;

`
const StoreTimingsOptionData = [
	{
	  label: "Product Defects",
	  value: "Product Defects"
	},
	{
	  label: "Incorrect Item",
	  value: "Incorrect Item"
	},
	{
	  label: "Size or Fit Issues",
	  value: "Size or Fit Issues"
	},
	{
	  label: "Quality Issues",
	  value: "Quality Issues"
	},
  {
	  label: "other",
	  value: "other"
	},
  ];
  const {
    control,
    handleSubmit,
    setValue,
    watch
  } = useForm({
    mode: "all",
    // resolver: yupResolver(createStoreSchema),
    // defaultValues: initialFormData
  })
  
  const [showInput, setShowInput] = useState(false);
  function   showInputhandler(e:any){
    console.log({e})
    if(e === "other"){
      setShowInput(true)
    }
  }

    return (
      <div><FormInputTitle>Reason for return</FormInputTitle>
         
		  <Row className="pr-12">
      <Col span={12} className="pr-12">
              <HookFormSelectField
                control={control}
                type="text"
                name="your reason"
                placeholder=""
                label={""}
                optionData={StoreTimingsOptionData}
                callback={showInputhandler}
                required
              />
              {showInput && (
                <Row className="pr-12">
          <Col span={12} className="pr-12"> <input type="text" placeholder="Please tell us reason" /></Col>
          {/* <Col span={12} className="pr-12"><Button>Submit</Button></Col>
                */}</Row> 

                )}
            </Col>
			</Row></div>
    );
  }
