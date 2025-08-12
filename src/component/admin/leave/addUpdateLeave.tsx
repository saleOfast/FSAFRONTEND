import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { leaveHeadSchema, productBrandSchema } from "../../../utils/formValidations";
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
import { addLeaveHeadService, getLeaveHeadByIdService, updateLeaveHeadService } from "services/usersSerivce";
export default function AddUpdateLeave() {

  const dispatch = useDispatch();
  const redirect = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const leaveId: string | null = searchParams.get('leaveId');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(leaveHeadSchema),
    defaultValues: {
      head_leave_name: "",
      head_leave_short_name: ""
    }
  })

  useEffect(() => {
    async function getproductBrandData() {
      try {
        if (leaveId) {
          setIsLoading(true);
          const res = await getLeaveHeadByIdService(leaveId);
          setIsLoading(false);
          setValue("head_leave_name", res?.data?.data?.head_leave_name)
          setValue("head_leave_short_name", res?.data?.data?.head_leave_short_name)

        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getproductBrandData();
  }, [leaveId])

  const onSubmit = async (values: any) => {
    const {head_leave_name, head_leave_short_name } = values;
    if (leaveId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateLeaveHeadService({head_leave_id: Number(leaveId), head_leave_name, head_leave_short_name });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Updated Successfully")
          redirect("/config/leave")
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

        const response = await addLeaveHeadService({ head_leave_name, head_leave_short_name, status: true });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Added Successfully")
          redirect("/config/leave")
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
        <h1 className="page-title pr-18">{leaveId ? "Update Leave " : "Add New Leave"}</h1>
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
              name="head_leave_name"
              placeholder="Enter Leave Name"
              label={leaveId ? "Update Head Leave Name" : "Head Leave Name"}
              // required
            />
             <HookFormInputField
              control={control}
              type="text"
              name="head_leave_short_name"
              placeholder="Enter Short Name"
              label={leaveId ? "Update Leave Short Name" : "Leave Short Name"}
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
