import React, { useEffect, useState } from "react";
import "../style/addNewBrand.css";
import { leaveHeadCountSchema,  } from "../../../utils/formValidations";
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
import { addLeaveHeadCountService,  getLeaveHeadCountByIdService, updateLeaveHeadCountService } from "services/usersSerivce";

export default function AddUpdateLeaveView() {

    const dispatch = useDispatch();
    const redirect = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
    const leaveCountId: any | null = searchParams.get('leaveCountId');
    const leaveHeadId: any | null = searchParams.get('leaveHeadId');
    const leaveName: any | null = searchParams.get('leaveName');
    
    const year: any | null = searchParams.get('year');

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
        resolver: yupResolver(leaveHeadCountSchema),
        defaultValues: {
            financial_end: "",
            financial_start: "" ,
            head_leave_cnt_id: "",
            head_leave_code: "",
            head_leave_id: "",
            head_leave_name: leaveName ?? "",
            total_head_leave: 0
            // is_travel: false
        }
    })

    useEffect(() => {
        async function getPolicyData() {
            try {
                if (leaveCountId!="null" && leaveCountId!="undefined") {
                    setIsLoading(true);
                    const res = await getLeaveHeadCountByIdService(leaveCountId);
                    setIsLoading(false);
                    setValue("total_head_leave", res?.data?.data?.totalHeadLeave);
                    // setValue("claim_type", res?.data?.data?.claim_type);
                    // setValue("cost_per_km", String(res?.data?.data?.cost_per_km));
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
    }, [leaveCountId])

    const onSubmit = async (values: any) => {
        console.log({ values })
        const {total_head_leave } = values;
        let reqInfo = {
            headLeaveId: Number(leaveHeadId),
            financialStart:new Date( `${year}-04-01`),
            financialEnd: new Date(`${(parseInt(year) + 1).toString()}-03-31`),
            totalHeadLeave:total_head_leave,
        }
        if (leaveCountId!="null" && leaveCountId!="undefined") {

           
            try {
                dispatch(setLoaderAction(true));
                
            const response = await updateLeaveHeadCountService({headLeaveId: Number(leaveHeadId),  headLeaveCntId: updateData?.headLeaveCntId, totalHeadLeave: total_head_leave});
                dispatch(setLoaderAction(false));
                if (response?.data?.status === 200) {
                    message.success("Updated Successfully")
                    redirect(`/config/leave-view?year=${year}`)
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

                const response = await addLeaveHeadCountService(reqInfo);
                dispatch(setLoaderAction(false));
                if (response?.data?.status === 200) {
                    message.success("Added Successfully")
                    redirect(`/config/leave-view?year=${year}`)
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
                <h1 className="page-title pr-18">{(leaveCountId!="null" && leaveCountId!="undefined") ? "Update Leave Count" : "Add Leave Count"}</h1>
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
                            // placeholder="Enter Policy Name"
                            label={"Head Leave Name"}
                            // required
                            disabled={true}
                        />
                        
                        <HookFormInputField
                            control={control}
                            type="number"
                            name="total_head_leave"
                            placeholder="Enter Total Leave"
                            label={(leaveCountId != "null" && leaveCountId != "undefined") ? "Update Total Leave" : "Add Total Leave"}
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
