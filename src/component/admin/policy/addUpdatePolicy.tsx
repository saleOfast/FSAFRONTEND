import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { policyHeadSchema, productBrandSchema } from "../../../utils/formValidations";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HookFormInputField from "component/HookFormInputField";
import { Button, Form, message } from "antd";
import { addProductBrandService, getProductBrandByIdService, updateProductBrandService } from "services/productService";
import { useLocation, useNavigate } from "react-router-dom";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { addPolicyHeadService, getPolicyHeadByIdService, updatePolicyHeadService } from "services/usersSerivce";
import HookFormCheckboxField from "component/HookFormCheckboxField";
export default function AddUpdatePolicy() {

  const dispatch = useDispatch();
  const redirect = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const policyId: string | null = searchParams.get('policyId');
  const [isLoading, setIsLoading] = useState(false);
  const [updateData, setUpdateData] = useState("");
  const [isTravel, setIsTravel] = useState<any>(false);

  const callback = (e:boolean) =>{
    setIsTravel(e)
  }
  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(policyHeadSchema),
    defaultValues: {
      policy_name: "",
      // is_travel: false
    }
  })

  useEffect(() => {
    async function getPolicyData() {
      try {
        if (policyId) {
          setIsLoading(true);
          const res = await getPolicyHeadByIdService(policyId);
          setIsLoading(false);
          setValue("policy_name", res?.data?.data?.policy_name);
          setIsTravel(res?.data?.data?.is_travel)
          // setValue("is_travel", )
          setUpdateData(res?.data?.data?.policy_code)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getPolicyData();
  }, [policyId])

  const onSubmit = async (values: any) => {
    const { policy_name } = values;
    if (policyId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updatePolicyHeadService({ policy_name, policy_id: Number(policyId), is_travel: isTravel, policy_code: updateData });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Updated Successfully")
          redirect("/config/policy")
        }else{
          message.error("Something Went Wrong");
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    } else {
      try {
        dispatch(setLoaderAction(true));

        const response = await addPolicyHeadService({ policy_name, is_travel: isTravel, policy_code: "" });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Added Successfully")
          redirect("/config/policy")
        }else{
          message.error("Something Went Wrong");
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }
  };

  return (
    <div>
      <FullPageLoaderWithState isLoading={isLoading} />
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{policyId ? "Update Policy Head " : "Add Policy Head"}</h1>
      </header>
      <main className="content">
        <div className="searchContainer">
          <Form
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off"
            className="formWidth">

            <HookFormInputField
              control={control}
              type="text"
              name="policy_name"
              placeholder="Enter Policy Name"
              label={policyId ? "Update Policy Name" : "Policy Name"}
              required
            />
            <HookFormCheckboxField
              control={control}
              type="checkbox"
              name="is_travel"
              placeholder="Enter Policy Name"
              label={policyId ? "Update Travel Type:" : "Travel Type : "}
              callback={callback}
              value={isTravel}
              // required
            />
            <div className="take-orders-summary">
              <div
                className=" orders-btn">
                <Button onClick={() => redirect(-1)}>Cancel</Button>
                <button type="submit" className="btn-save">
                  Save
                </button>
              </div>
            </div>
          </Form>
          <div></div>
        </div>
      </main>
    </div>
  );
}
