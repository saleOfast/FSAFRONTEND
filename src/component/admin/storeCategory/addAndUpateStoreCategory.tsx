import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { storeCategorySchema } from "../../../utils/formValidations";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HookFormInputField from "component/HookFormInputField";
import { Button, Form, message } from "antd";
import { addStoreCategoryService, getStoreCategoryByIdService, updateStoreCategoryService } from "services/storeService";
import { useLocation, useNavigate } from "react-router-dom";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function AddAndUpdateStoreCategory() {
  const dispatch = useDispatch();
  const redirect = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const categoryId: string | null = searchParams.get('categoryId');
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(storeCategorySchema),
    defaultValues: {
      categoryName: "",
    }
  })

  useEffect(() => {
    async function getproductBrandData() {
			try {
				if (categoryId) {
					setIsLoading(true);
					const res = await getStoreCategoryByIdService(categoryId);
					setIsLoading(false);
          setValue("categoryName", res?.data?.data?.categoryName)
				}
			} catch (error) {
				setIsLoading(false);
			}
		}
		getproductBrandData();
  }, [categoryId])


  const onSubmit = async (values: any) => {
    const { categoryName } = values;
    if(categoryId){
    try {
      dispatch(setLoaderAction(true));
      const response = await updateStoreCategoryService({ categoryName, categoryId:Number(categoryId) });
      dispatch(setLoaderAction(false));
      if (response) {
        message.success("Updated Successfully")
        redirect("/admin/store-category")
      }
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      message.error("Something Went Wrong");
    }
  }else{
      try {
        dispatch(setLoaderAction(true));
        const response = await addStoreCategoryService({ categoryName });
        dispatch(setLoaderAction(false));
        if (response) {
          message.success("Added Successfully")
          redirect("/admin/store-category")
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }
  }

  return (
    <div>
			<FullPageLoaderWithState isLoading={isLoading} />
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button"/>
          <h1 className="page-title pr-18">{categoryId ? "Update Customer Category" : "Add New Customer Category" }</h1>
        </header>
      <main className="content">
        <div className="searchContainer">
          <Form
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off">

            <HookFormInputField
              control={control}
              type="text"
              name="categoryName"
              placeholder="Enter Store Category Name"
              label={categoryId ? "Update Store Category Name" : "Store Category Name"}
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
  )
}
