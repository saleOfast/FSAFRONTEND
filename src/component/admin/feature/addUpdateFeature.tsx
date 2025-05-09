import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { featureSchema } from "../../../utils/formValidations";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HookFormInputField from "component/HookFormInputField";
import { Button, Form, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { addFeatureService, getFeatureByIdService, updateFeatureService } from "services/usersSerivce";
import HookFormSelectField from "component/HookFormSelectField";
export default function AddUpdateFeature() {

  const dispatch = useDispatch();
  const redirect = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const featureId: string | null = searchParams.get('featureId');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(featureSchema),
    defaultValues: {
      name: "",
      status: true
    }
  })

  useEffect(() => {
    async function getData() {
      try {
        if (featureId) {
          setIsLoading(true);
          const res = await getFeatureByIdService(featureId);
          setIsLoading(false);
          setValue("name", res?.data?.data?.name)
          setValue("status", res?.data?.data?.isActive)

        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getData();
  }, [featureId])

  const onSubmit = async (values: any) => {
    const { name, status, key } = values;
    if (featureId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateFeatureService({ key, isActive: status });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Updated Successfully")
          redirect("/config/feature")
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

        const response = await addFeatureService({ name, isActive: status });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Added Successfully")
          redirect("/config/feature")
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
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{featureId ? "Update Feature " : "Add New Feature"}</h1>
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
              name="name"
              placeholder="Enter Feature"
              label={featureId ? "Update Feature" : "Feature"}
              required
            />
           <HookFormSelectField
              control={control}
              type="text"
              name="status"
              placeholder="Select"
              label={featureId ? "Update Status" : "Status"}
              optionData={[{label:"Enabled", value:true}, {label:"Disabled", value:false}]}
              required
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
