import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import previousPage from "utils/previousPage";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HookFormInputField from "component/HookFormInputField";
import { Button, Cascader, Form, message, TreeSelect, Typography } from "antd";
import { addProductCategoryService, getProductCategoryByIdService, updateProductCategoryService } from "services/productService";
import { useLocation, useNavigate } from "react-router-dom";
import { productCategorySchema, updateCategorySchema } from "utils/formValidations";
import HookFormSelectField from "component/HookFormSelectField";
import { AppDispatch } from "redux-store/store";
import { getProductCategoryActions } from "redux-store/action/productAction";

export default function AddNewCategory() {
  // const dispatch = useDispatch();
  const redirect = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const productCategoryId: string | null = searchParams.get('productCategoryId');
  const [isLoading, setIsLoading] = useState(false);
  const productCategoryData = useSelector((state: any) => state?.product?.category);
  const [productCategoryList, setProductCategoryList] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getProductCategoryActions());
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver:
      yupResolver(productCategoryId ? updateCategorySchema : productCategorySchema),
    defaultValues: {
      name: "",
      parentId: ""
    }
  })
  const [parentUpdateId, setParentData] = useState<any>(null)
  const [parentUpdateName, setParentUpdateName] = useState<any>('')
  const [value, setTreeValue] = useState<string>();
  useEffect(() => {
    async function getproductCategoryDataById() {
      try {
        if (productCategoryId) {
          setIsLoading(true);
          const res = await getProductCategoryByIdService(productCategoryId);
          setParentData(res?.data?.data?.parentId)
          setTreeValue(res?.data?.data?.parent?.name)
          setIsLoading(false);
          setValue("name", res?.data?.data?.name)
          setValue("parentId", res?.data?.data?.parent?.name ?? "")
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getproductCategoryDataById();
  }, [productCategoryId])
  console.log(+parentUpdateId)
  const onSubmit = async (values: any) => {
    const { name, parentId } = values;
    let id: any = parentUpdateId ?? null
    if (productCategoryId) {

      try {
        dispatch(setLoaderAction(true));
        const response = await updateProductCategoryService({ name, catId: Number(productCategoryId), parentId: id });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Updated Successfully")
          redirect("/admin/category")
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    } else {
      try {
        dispatch(setLoaderAction(true));
        const response = await addProductCategoryService({ name, parentId: id });
        dispatch(setLoaderAction(false));
        if (response?.data?.status === 200) {
          message.success("Added Successfully")
          redirect("/admin/category")
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }
  };

  const displayRender = (labels: string[]) => labels[labels.length - 1];
  const onChangeHandler: any = (value: any) => {
    setParentData(value[0])
    console.log(value[0]);
  };
  type Category = {
    productCategoryId: number;
    empId: number;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    parentId: number | null;
    children: Category[];
    parent: Category | null;
  };

  type CascaderOption = {
    value: number;
    label: string;
    children?: CascaderOption[];
  };

  // Recursive function to map data to Cascader options
  const mapCategoriesToCascaderOptions = (categories: Category[]): CascaderOption[] => {
    const map: { [key: number]: CascaderOption } = {};

    categories.forEach(category => {
      map[category.productCategoryId] = {
        value: category.productCategoryId,
        label: category.name,
        children: [],
      };
    });

    categories.forEach(category => {
      if (category.parentId !== null) {
        const parent = map[category.parentId];
        if (parent) {
          parent.children?.push(map[category.productCategoryId]);
        }
      }
    });

    return Object.values(map).filter(option => !categories.some(cat => cat.productCategoryId === option.value && cat.parentId !== null));
  };

  // Example data (using your provided data)


  // Transform data
  const options: CascaderOption[] = mapCategoriesToCascaderOptions(productCategoryData ?? []);
  console.log({productCategoryData})


  const onChange = (newValue: string) => {
    setParentData(newValue);
    setTreeValue(newValue)
  };

  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{productCategoryId ? "Update Category " : "Add New Category"}</h1>
      </header>
      <main className='content'>
        <div className="">
          <Form
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off"
          // className="formWidth add-store-form-container"
          // layout="horizontal"
          // labelCol={{ span: 6 }}
          >
            <HookFormInputField
              control={control}
              type="text"
              name="name"
              placeholder="Enter Category Name"
              label={productCategoryId ? "Update Category Name" : "Category Name"}
              required
            />
            <div className="treeSelect" style={{ gap: "15px" }} >
              {/* <span style={{
                color: "rgba(0, 0, 0, 0.88)", fontSize: "14px", wordBreak: "break-word", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
                lineHeight: 1.5714285714285714
              }}>Parent Category: </span> */}
               <Typography.Text>Parent Category:</Typography.Text> 
              <TreeSelect
                showSearch
                className="treeWidth"
                value={value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Select Category"
                allowClear
                treeDefaultExpandAll
                onChange={onChange}
                treeData={options}
              />
            </div>
            {/* <HookFormSelectField
              control={control}
              type="text"
              name="parentId"
              placeholder="Select Parent Category"
              label={"Select Parent Category"}
              showSearch
              // mode="multiple"
              allowClear
              defaultValue={[]}
              // optionData={[
              //   {label: "ddd", value:"ddd"}
              // ]}
              optionData={
                productCategoryData?.map((data: any) => ({
                  label: data?.name,
                  value: data?.productCategoryId,
                }))
              }
            /> */}
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
        </div>
      </main>
    </div>
  );
}
