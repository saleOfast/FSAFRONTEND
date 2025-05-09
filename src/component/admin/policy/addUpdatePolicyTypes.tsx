import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { policyHeadSchema, policyTypesSchema, productBrandSchema } from "../../../utils/formValidations";
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
import { addPolicyHeadService, addPolicyTypeService, getPolicyHeadByIdService, getPolicyTypeByIdService, updatePolicyHeadService, updatePolicyTypeService } from "services/usersSerivce";
import HookFormCheckboxField from "component/HookFormCheckboxField";
import HookFormSelectField from "component/HookFormSelectField";
import { ExpenseReportClaimType } from "enum/common";
export default function AddUpdatePolicyTypes() {

    const dispatch = useDispatch();
    const redirect = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
    const policy_type_id: string | null = searchParams.get('policyTypeId');
    const policy_id: string | null = searchParams.get('policyId');

    const [isLoading, setIsLoading] = useState(false);
    const [updateData, setUpdateData] = useState<any>();
    const [isTravel, setIsTravel] = useState<any>(false);

    const callback = (e: boolean) => {
        setIsTravel(e)
    }
    const {
        control,
        handleSubmit,
        setValue,
    } = useForm({
        mode: "all",
        resolver: yupResolver(policyTypesSchema),
        defaultValues: {
            policy_type_name: "",
            claim_type: "" ,
            cost_per_km: ""
            // is_travel: false
        }
    })

    useEffect(() => {
        async function getPolicyData() {
            try {
                if (policy_type_id) {
                    setIsLoading(true);
                    const res = await getPolicyTypeByIdService(policy_type_id);
                    setIsLoading(false);
                    setValue("policy_type_name", res?.data?.data?.policy_type_name);
                    setValue("claim_type", res?.data?.data?.claim_type);
                    setValue("cost_per_km", String(res?.data?.data?.cost_per_km));
                    setUpdateData(res?.data?.data)

                    // setIsTravel(res?.data?.data?.is_travel)
                    // setValue("is_travel", )
                    // setUpdateData(res?.data?.data?.policy_code)
                }
            } catch (error) {
                setIsLoading(false);
            }
        }
        getPolicyData();
    }, [policy_type_id])

    const onSubmit = async (values: any) => {
        console.log({ values })
        const { policy_type_name, claim_type, cost_per_km } = values;
        if (policy_type_id) {
            try {
                dispatch(setLoaderAction(true));
                const response = await updatePolicyTypeService({
                    policy_type_name, claim_type, cost_per_km: cost_per_km,
                    policy_type_id: updateData?.policy_type_id,
                    policy_id: updateData?.policy_id
                });
                dispatch(setLoaderAction(false));
                if (response?.data?.status === 200) {
                    message.success("Updated Successfully")
                    redirect(`/config/policyTypes?policyId=${updateData?.policy_id}`)
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

                const response = await addPolicyTypeService({ policy_type_name, claim_type, cost_per_km, policy_id: String(policy_id)  });
                dispatch(setLoaderAction(false));
                if (response?.data?.status === 200) {
                    message.success("Added Successfully")
                    await redirect(`/config/policyTypes?policyId=${policy_id}`)
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
                <h1 className="page-title pr-18">{policy_type_id ? "Update Policy Type" : "Add Policy Type"}</h1>
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
                            name="policy_type_name"
                            placeholder="Enter Policy Name"
                            label={policy_type_id ? "Update Policy Name" : "Policy Name"}
                            // required
                        />
                        <HookFormSelectField
                            control={control}
                            type="text"
                            name="claim_type"
                            placeholder="Select Claim Type"
                            label={"Claim Type"}
                            showSearch
                            allowClear
                            optionData={[
                                { label: "TA", value: "TA" },
                                { label: "DA", value: "DA" },
                            ]}
                            filterOption={(inputValue: any, option: any) => {
                                return option.label.toLowerCase().includes(inputValue.toLowerCase())
                            }}
                            required
                        />
                        <HookFormInputField
                            control={control}
                            type="number"
                            name="cost_per_km"
                            placeholder="Enter Cost Per Km"
                            label={policy_type_id ? "Update Cost per Km" : "Cost per Km"}
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
