import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { noOrderReasonSchema } from "../../../utils/formValidations";
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
import { addNoOrderService, getNoOrderByIdService, updateNoOrderService } from "services/orderService";
export default function AddUpdateNoOrder() {

  const dispatch = useDispatch();
  const redirect = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const reasonId: string | null = searchParams.get('reasonId');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(noOrderReasonSchema),
    defaultValues: {
      description: "",
    }
  })

  useEffect(() => {
    async function getproductBrandData() {
      try {
        if (reasonId) {
          setIsLoading(true);
          const res = await getNoOrderByIdService(reasonId);
          setIsLoading(false);
          setValue("description", res?.data?.data?.description)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getproductBrandData();
  }, [reasonId])

  const onSubmit = async (values: any) => {
    const { description } = values;
    if (reasonId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateNoOrderService({ description , reasonId: Number(reasonId) });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Updated Successfully")
          redirect("/noOrder-reason")
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

        const response = await addNoOrderService({ description });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Added Successfully")
          redirect("/noOrder-reason")
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
        <h1 className="page-title pr-18">{reasonId ? "Update No Order Reason " : "Add New No Order Reason "}</h1>
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
              name="description"
              placeholder="Enter No order Reason"
              label={reasonId ? "Update No Order" : "No Order Reason"}
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
