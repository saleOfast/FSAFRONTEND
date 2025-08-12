import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { productBrandSchema } from "../../../utils/formValidations";
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
export default function AddAndUpdateBrand() {

  const dispatch = useDispatch();
  const redirect = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const brandId: string | null = searchParams.get('brandId');
  const [isLoading, setIsLoading] = useState(false);
  let isCompetitor = true

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(productBrandSchema),
    defaultValues: {
      name: "",
    }
  })

  useEffect(() => {
    async function getproductBrandData() {
      try {
        if (brandId) {
          setIsLoading(true);
          const res = await getProductBrandByIdService(brandId, '0');
          setIsLoading(false);
          setValue("name", res?.data?.data?.name)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getproductBrandData();
  }, [brandId])

  const onSubmit = async (values: any) => {
    const { name } = values;
    if (brandId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateProductBrandService({ name, brandId: Number(brandId), isCompetitor: 0 });
        dispatch(setLoaderAction(false));
        if (response) {
          message.success("Updated Successfully")
          redirect("/admin/brand")
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    } else {
      try {
        dispatch(setLoaderAction(true));

        const response = await addProductBrandService({ name, isCompetitor: 0 });
        dispatch(setLoaderAction(false));
        if (response) {
          message.success("Added Successfully")
          redirect("/admin/brand")
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
        <h1 className="page-title pr-18">{brandId ? "Update Brand " : "Add New Brand"}</h1>
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
              placeholder="Enter Brand Name"
              label={brandId ? "Update Brand Name" : "Brand Name"}
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
