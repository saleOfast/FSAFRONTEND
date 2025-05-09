import React, { useEffect, useState } from "react";
import "../../style/addNewBrand.css";
import { noOrderReasonSchema, paymentModeSchema } from "../../../../utils/formValidations";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../../../redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HookFormInputField from "component/HookFormInputField";
import { Button, Form, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { addNoOrderService, getNoOrderByIdService, updateNoOrderService } from "services/orderService";
import { addPaymentModeService, getPaymentModeByIdService, updatePaymentModeService } from "services/paymentService";
export default function AddUpdatePaymentMode() {

  const dispatch = useDispatch();
  const redirect = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const paymentModeId: string | null = searchParams.get('paymentModeId');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(paymentModeSchema),
    defaultValues: {
      name: "",
    }
  })

  useEffect(() => {
    async function getproductBrandData() {
      try {
        if (paymentModeId) {
          setIsLoading(true);
          const res = await getPaymentModeByIdService(paymentModeId);
          setIsLoading(false);
          setValue("name", res?.data?.data?.name)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getproductBrandData();
  }, [paymentModeId])

  const onSubmit = async (values: any) => {
    const { name } = values;
    if (paymentModeId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updatePaymentModeService({ name , paymentModeId: Number(paymentModeId) });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Updated Successfully")
          redirect("/config/payment-mode")
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

        const response = await addPaymentModeService({ name });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Added Successfully")
          redirect("/config/payment-mode")
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
        <h1 className="page-title pr-18">{paymentModeId ? "Update Payment Mode " : "Add New Payment Mode"}</h1>
      </header>
      <main className="content">
        <div className="searchContainer">
          <Form
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off"
            className="formWidth">

            {/* <div style={{display:'flex', justifyContent:"flex-start", gap:"10px", width:"100%"}}> */}
              <HookFormInputField
              control={control}
              type="text"
              name="name"
              placeholder="Enter No. of Days"
              label={paymentModeId ? "Update Payment Mode " : "Add New Payment Mode"}
              required
              addonBefore="Days"
            />
        {/* //      <Button style={{ width: 80 }} disabled>
        //   {"Days"}
        // </Button></div> */}
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
