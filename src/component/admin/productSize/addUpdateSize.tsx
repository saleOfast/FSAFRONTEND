import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { sizeSchema } from "../../../utils/formValidations";
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
import { addSizeService, getSizeByIdService, updateSizeService } from "services/productService";
export default function AddUpdateSize() {

  const dispatch = useDispatch();
  const redirect = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const sizeId: string | null = searchParams.get('sizeId');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(sizeSchema),
    defaultValues: {
      name: "",
    }
  })

  useEffect(() => {
    async function getData() {
      try {
        if (sizeId) {
          setIsLoading(true);
          const res = await getSizeByIdService(sizeId);
          setIsLoading(false);
          setValue("name", res?.data?.data?.name)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getData();
  }, [sizeId])

  const onSubmit = async (values: any) => {
    const { name } = values;
    if (sizeId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateSizeService({ name , sizeId: Number(sizeId) });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Updated Successfully")
          redirect("/config/size")
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

        const response = await addSizeService({ name });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Added Successfully")
          redirect("/config/size")
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
        <h1 className="page-title pr-18">{sizeId ? "Update Size " : "Add New Size "}</h1>
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
              placeholder="Enter Size Name"
              label={sizeId ? "Update Size" : "Size"}
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
