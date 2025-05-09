import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { colourSchema, noOrderReasonSchema } from "../../../utils/formValidations";
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
import { addColourService, getColourByIdService, updateColourService } from "services/productService";
export default function AddUpdateColour() {

  const dispatch = useDispatch();
  const redirect = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const colourId: string | null = searchParams.get('colourId');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(colourSchema),
    defaultValues: {
      name: "",
    }
  })

  useEffect(() => {
    async function getData() {
      try {
        if (colourId) {
          setIsLoading(true);
          const res = await getColourByIdService(colourId);
          setIsLoading(false);
          setValue("name", res?.data?.data?.name)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getData();
  }, [colourId])

  const onSubmit = async (values: any) => {
    const { name } = values;
    if (colourId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateColourService({ name , colourId: Number(colourId) });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Updated Successfully")
          redirect("/config/colour")
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

        const response = await addColourService({ name });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Added Successfully")
          redirect("/config/colour")
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
        <h1 className="page-title pr-18">{colourId ? "Update Colour " : "Add New Colour "}</h1>
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
              placeholder="Enter Colour Name"
              label={colourId ? "Update Colour" : "Colour"}
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
