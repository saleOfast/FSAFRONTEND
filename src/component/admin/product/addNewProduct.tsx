import '../../style/createBeat.css'
import HookFormInputField from 'component/HookFormInputField'
import React, { useEffect, useRef, useState } from 'react'
import '../../style/createBeat.css'
import { productSchema } from "../../../utils/formValidations";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, message, Row, TreeSelect, Typography } from "antd";
import { AppDispatch } from 'redux-store/store';
import HookFormSelectField from 'component/HookFormSelectField';
import { useLocation, useNavigate } from 'react-router-dom';
import { addProductService, getProductByIdService, updateProductService } from 'services/productService';
import { getProductBrandActions, getProductCategoryActions } from 'redux-store/action/productAction';
import { ArrowLeftOutlined } from '@ant-design/icons';
import previousPage from "utils/previousPage";
import { getOrderSignedUrlService } from 'services/orderService';
import { uploadFileToS3 } from 'utils/uploadS3';
import styled from 'styled-components';
import { DiscountType } from 'enum/common';
const productStatusOptionData = [
    {
        label: "Active",
        value: true
    },
    {
        label: "Inactive",
        value: false
    }
]

const productDiscountTypeOptionData = [
    {
        label: "Percentage(%)",
        value: "PERCENTAGE"
    },
    {
        label: "Value",
        value: "VALUE"
    }
]

interface ISkuDiscount {
    discountType: DiscountType,
    value: number,
    isActive: boolean
}
const FormInputTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-top: 6px;
`

export default function AddNewProduct() {
    const redirect = useNavigate();
    const productBrandList = useSelector((state: any) => state.product.brand)
    const productCategoryList = useSelector((state: any) => state.product.category)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
    const productId: string | null = searchParams.get('productId');
    const [isLoading, setIsLoading] = useState(false);
    const [updateData, setUpdateData] = useState<any>([])
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [updateImage, setUpdateImage] = useState<any>(null)
    const [isSetBeatValue, setIsSetBeatValue] = useState<boolean>(false)
    const [categoryValue, setCategoryValue] = useState<any>()
    const [isProductActiveValue, setIsProductActiveValue] = useState<boolean>(false)
    const [isDiscountActiveValue, setIsDiscountActiveValue] = useState<boolean>(false)



    const onChangeBeat = (e:any) =>{
        if(productId){
            setIsSetBeatValue(true)
        }
    }
    const [catId, setCatId] = useState<any>();
    const onChangeCategory = (e:any) =>{
        // if(productId){
            setCategoryValue(e)
            // setCatId(e)
        // }
    }
    const onChangeIsActive =(e:any)=>{
        if(productId){
            setIsProductActiveValue(true)

        }
   }
   const onChangeIsDiscount =(e:any)=>{
    if(productId){
    setIsDiscountActiveValue(true)
         
    }
}
    function onChangeIsFocused(e:any){
        setIsChecked(!isChecked)
    }
    useEffect(() => {
        dispatch(getProductBrandActions());
        dispatch(getProductCategoryActions())
    }, [])

    const {
        control,
        handleSubmit,
        setValue,
    } = useForm({
        mode: "all",
        resolver: yupResolver(productSchema),
        defaultValues: {
            productName: "",
            mrp: "",
            rlp: "",
            brandId: "",
            categoryId: "",
            caseQty: "",
            discountValue: "",
            discountType: "",
            isDiscountActive: "",
            isActive: "",
            isFocused: false
        }
    })

    useEffect(() => {
        async function getproductDataById() {
            try {
                if (productId) {
                    setIsLoading(true);
                    const res = await getProductByIdService(productId);
                    setUpdateData(res?.data?.data)
                    setCategoryValue(String(res?.data?.data?.category?.name))
                    setCatId(res?.data?.data?.categoryId)
                    setIsLoading(false);
                    setValue("productName", res?.data?.data?.productName)
                    setValue("mrp", String(res?.data?.data?.mrp))
                    setValue("rlp", String(res?.data?.data?.rlp))
                    setValue("brandId", String(res?.data?.data?.brand?.name))
                    // setValue("categoryId", String(res?.data?.data?.category?.name))
                    setValue("caseQty", String(res?.data?.data?.caseQty))
                    setValue("isActive", String(res?.data?.data?.isActive === true ? "Active" : "Inactive"))
                    setValue("isFocused", res?.data?.data?.isFocused)
                    if (res?.data?.data?.skuDiscount) {
                        setValue("discountValue", String(res?.data?.data?.skuDiscount?.value))
                        setValue("discountType", String(res?.data?.data?.skuDiscount?.discountType ?? ""))
                        setValue("isDiscountActive", String(res?.data?.data?.skuDiscount?.isActive === true ? "Active" : "Inactive"))
                    }
                    setIsChecked(res?.data?.data?.isFocused)
                    setUpdateImage(res?.data?.data?.image)
                }
            } catch (error) {
                setIsLoading(false);
            }
        }
        getproductDataById();
    }, [productId])

    const [productImg, setProductImg] = useState<any>("")
    const handleFileChange = async (event: any) => {
        setProductImg(event.target.files[0])
    }
    console.log({categoryValue, isProductActiveValue, catId})
    const onSubmit = async (values: any) => {
        const { productName, mrp, rlp, brandId, categoryId, caseQty, isFocused,  isActive, discountType, discountValue, isDiscountActive } = values;
        // const isProductActive: any = isActive;
       
        const skuDiscount: ISkuDiscount = {
            discountType: discountType,
            isActive: isDiscountActiveValue,
            value: Number(discountValue)
        }
        if (productId) {
            if(!catId){
                return message.warning("Please Select Category")
               }
            const skuDiscountEdit: ISkuDiscount = {
                discountType: discountType,
                isActive: isDiscountActiveValue ? (isDiscountActive === "true" ? true : false) : isDiscountActive === "Active" ? true : false,
                value: Number(discountValue)
            }
            try {
                dispatch(setLoaderAction(true));
                let productImgRes
                if (productImg?.name) {
                    productImgRes = await getOrderSignedUrlService(productImg?.name);
                    await uploadFileToS3(productImgRes.data.data, productImg);
                }
                const response = await updateProductService({
                    productId: Number(productId),
                    productName, mrp: Number(mrp),
                    rlp: Number(rlp),
                    brandId: isSetBeatValue ? Number(brandId) : Number(updateData?.brand?.brandId) ,
                    categoryId: Number(catId),
                    caseQty: Number(caseQty),
                    isFocused: isFocused,
                    // isActive : isActive === "true" ? true : false,
                    isActive: isProductActiveValue ? (isActive === "true" ? true : false) : isActive === "Active" ? true : false,
                    skuDiscount: skuDiscountEdit,
                    image: productImg?.name ? (productImgRes ? productImgRes.data.data.fileUrl : "") : ""
                });
                dispatch(setLoaderAction(false));
                if (response) {
                    message.success("Updated Successfully")
                    redirect("/admin/product")
                }
            } catch (error: any) {
                dispatch(setLoaderAction(false));
                message.error(error?.response?.data?.message);
            }
        } else {
            if(!categoryValue){
                return message.warning("Please Select Category")
               }
            try {
                dispatch(setLoaderAction(true));
                let productImgRes = await getOrderSignedUrlService(productImg?.name);
                await uploadFileToS3(productImgRes.data.data, productImg);
                const response = await addProductService({
                    productName,
                    mrp: Number(mrp),
                    rlp: Number(rlp),
                    brandId: Number(brandId),
                    categoryId: Number(categoryValue),
                    caseQty: Number(caseQty),
                    skuDiscount: Object(skuDiscount),
                    isFocused: isFocused,
                    isActive: isActive === "true" ? true : false,
                    image: productImgRes ? productImgRes.data.data.fileUrl : ""
                });
                dispatch(setLoaderAction(false));
                if (response) {
                    message.success("Added Successfully")
                    redirect("/admin/product")
                }
            } catch (error: any) {
                dispatch(setLoaderAction(false));
                message.error(error?.response?.data?.message);
            }
        }
    };
    const fileInputRef = useRef<any>(updateImage);

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleCancel = () => {
        redirect({ pathname: "/admin/product" })
    }
 
    const mapCategoriesToCascaderOptions = (categories: any[]): any[] => {
        const map: { [key: number]: any } = {};
    
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
  const options: any[] = mapCategoriesToCascaderOptions(productCategoryList ?? []);
  const [parentUpdateId, setParentData] = useState<any>(null)
  const [parentUpdateName, setParentUpdateName] = useState<any>('')
  
      const onChange = (newValue: string) => {
        setParentData(newValue);
        // setTreeValue(newValue)
      };
    return (
        <div>
            <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">{productId ? "Update Medicine" : "Add New Medicine"}</h1>
            </header>
            <main className='dflex-center deskMr-16'>
                <Form
                    className="formWidth add-store-form-container"
                    style={{height: "auto", maxWidth: "100%"}}
                    onFinish={handleSubmit(onSubmit)}
                    autoComplete="off"
                    labelCol={{ span: 5 }}
                    >
                    <HookFormInputField
                        control={control}
                        type="text"
                        name="productName"
                        placeholder="Enter Product name"
                        label={"Product Name"}
                        required
                    />
                    <HookFormSelectField
                        control={control}
                        type="text"
                        name="brandId"
                        placeholder="Select Brand"
                        label={"Brand"}
                        showSearch
                        allowClear
                        callback={onChangeBeat}
                        optionData={
                            productBrandList?.map((data: any) => ({
                                label: data?.name,
                                value: data?.brandId,
                            }))
                        }
                        required
                    />
                    {/* <HookFormSelectField
                        control={control}
                        type="text"
                        name="categoryId"
                        placeholder="Select Category"
                        label={"Category"}
                        showSearch
                        allowClear
                        callback={onChangeCategory}
                        optionData={
                            productCategoryList?.map((data: any) => ({
                                label: data?.name,
                                value: data?.productCategoryId,
                            }))
                        }
                        required
                    /> */}
                      <div className="treeSelect" style={{marginBottom:"6px"}}>
                      <span style={{ color: "rgba(0, 0, 0, 0.88)", wordBreak:"normal", fontSize: "14px", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
    lineHeight: 1.5714285714285714 }} className='mrTree'><Typography.Text style={{wordBreak:"normal"}}>Category</Typography.Text><span style={{wordBreak:"normal"}}><Typography.Text type='danger' className='ml-1'>*</Typography.Text></span> </span>
    {/* <span> <Typography.Text>Category:</Typography.Text> <Typography.Text type='danger' className='ml-1'>*</Typography.Text>
    </span> */}
                    <TreeSelect
              showSearch
              className="treeWidthProduct"
              value={categoryValue}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Select Category"
              allowClear
              treeDefaultExpandAll
              onChange={onChangeCategory}
              treeData={options}
            /> </div>
                    <HookFormInputField
                        control={control}
                        type="number"
                        name="mrp"
                        placeholder="Enter MRP"
                        label={"MRP"}
                        required
                    />
                    <HookFormInputField
                        control={control}
                        type="number"
                        name="rlp"
                        placeholder="Enter RLP"
                        label={"RLP"}
                        required
                    />
                    <HookFormInputField
                        control={control}
                        type="number"
                        name="caseQty"
                        placeholder="Enter Case Quantity"
                        label={"Case Quantity"}
                        required
                    />
                    {/* <HookFormInputField
                        control={control}
                        type="number"
                        name="colour"
                        placeholder="Enter Colour"
                        label={"Colour"}
                        // required
                    /> */}
                    <HookFormSelectField
                        control={control}
                        type="text"
                        name="isActive"
                        placeholder="Active/Inactive"
                        label={"Product status"}
                        optionData={productStatusOptionData}
                        callback={onChangeIsActive}
                        required
                        style={{ marginTop: "-30px" }}
                        className='typeCheckbox'
                    />
                    <FormInputTitle>SKU Discount</FormInputTitle>
                    <Row className="mt-4">
                        <Col span={12} className="pl-12">
                            <HookFormSelectField
                                control={control}
                                type="text"
                                name="discountType"
                                placeholder="Select Discount Type"
                                label={""}
                                optionData={productDiscountTypeOptionData}
                            />
                        </Col>
                        <Col span={12} className="pl-12">
                            <HookFormInputField
                                control={control}
                                type="number"
                                name="discountValue"
                                placeholder="Enter Discount Value"
                            />
                        </Col>
                    </Row>
                    <HookFormSelectField
                        control={control}
                        type="text"
                        name="isDiscountActive"
                        placeholder="Active/Inactive"
                        label={"SKU Discount status"}
                        callback={onChangeIsDiscount}
                        optionData={[
                            {
                                label: "Active",
                                value: true
                            },
                            {
                                label: "Inactive",
                                value: false
                            }
                        ]}
                    />
                    <label>Product Image</label>
                    <input
                        type="file"
                        name="image"
                        ref={fileInputRef}
                        className="profileRef"
                        onChange={handleFileChange}
                        style={{ paddingBottom: "36px", marginBottom: "10px" }}
                    />
                    <HookFormInputField
                        control={control}
                        type="checkbox"
                        name="isFocused"
                        checked={isChecked}
                        callback={onChangeIsFocused}
                        label={"Focused Item"}
                        style={{ display: "auto" }}
                        className='typeCheckbox'
                    />
                    <div className="product-button-container" style={{ paddingBottom: "80px" }}>
                        <Button onClick={handleCancel} htmlType="button">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </div>
                </Form>
            </main>
        </div>
    )
}