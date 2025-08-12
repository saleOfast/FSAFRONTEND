import React, { useEffect, useState } from "react";
// import "../../style/orderList.css";
import { ArrowLeftOutlined, EyeOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "redux-store/reducer";
import { AppDispatch } from "redux-store/store";
import { getProductSchemeActions } from "redux-store/action/productAction";
// import { deleteProductSchemeService } from "services/productService";
import previousPage from "utils/previousPage";
import { useAuth } from "context/AuthContext";
import { UserRole } from "enum/common";
import { Button, Col, Input, message, Row, Select, Switch, Table, Form, Tag } from "antd";
import { setLoaderAction } from "redux-store/action/appActions";
import { getActiveSchemeService, updateSchemeService } from "services/productService";
import HookFormSelectField from "component/HookFormSelectField";
import { yupResolver } from "@hookform/resolvers/yup";
import { beatSchema, leaveApplication } from "utils/formValidations";
import { useForm } from "react-hook-form";
import HookFormInputField from "component/HookFormInputField";
import { addLeaveApplicationService, getLeaveApplicationService, getLeaveHeadCountService, getUserPendingLeaveService } from "services/usersSerivce";
import { getValidationErrors } from "utils/errorEvaluation";
// import DeleteItem from "../common/deleteItem";
const columns: any = [
    {
        title: 'Submitted By',
        dataIndex: 'submit_by',
        key: 'submit_by',
        fixed: "left",
        width: 120,
    },
    {
        title: 'Leave Name',
        dataIndex: 'leave_name',
        key: 'leave_name',
        width: 120,
    },
    {
        title: 'Leave Short Name',
        dataIndex: 'l_short_name',
        key: 'l_short_name',
        width: 80,

    },
    {
        title: 'From Date',
        dataIndex: 'to_date',
        key: 'to_date',
        width: 100,

    },
    {
        title: 'Leave Days',
        dataIndex: 'leave_days',
        key: 'leave_days',
        width: 80,

    },
    {
        title: 'Reasons',
        dataIndex: 'reason',
        key: 'reason',
        width: 120,

    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 100,

        render: (text: any, record: any) => {
            return (
                <Tag color={text === "pending" ? "yellow" : text === "approved" ? "green" : text === "approved" ? "red" : ""} style={{ fontWeight: 500 }}>{text}</Tag>
            )
        },
    },
];
export default function LeaveApplication() {
    const dispatch = useDispatch<AppDispatch>();
    const [leaveData, setLeaveData] = useState<any>([]);
    const [leaveApplData, setLeaveApplData] = useState<any>([]);

    const [noOfDays, setNoOfDays] = useState<any>({ totalCount: 0 });
    const [userPendingleaveData, setUserPendingleave] = useState<any>();
    console.log({ userPendingleaveData })

    const {
        control,
        setValue,
        handleSubmit,
    } = useForm({
        mode: "all",
        resolver: yupResolver(leaveApplication),
        defaultValues: {
            no_of_days: 0,
            from_date: "",
            to_date: "",
            reason: "",
            left_leave: "",
            leave_type: ""
        },
    });
    async function fetchUserPendingLeaves(id: any, left_leave: any) {

        try {
            dispatch(setLoaderAction(true));
            // setIsLoading(true);
            const res = await getUserPendingLeaveService({ id, left_leave });
            if (res?.data?.status === 200) {

                setUserPendingleave(res?.data?.data);
                setValue("left_leave", String(res?.data?.data?.left_leave))
            } else {
                message.error("Failed to fetch data");
            }
        } catch (error) {
            message.error("Error fetching data");
        } finally {
            // setIsLoading(false);
            dispatch(setLoaderAction(false));
        }
    }
    async function fetchLeaveTypeData() {

        try {
            dispatch(setLoaderAction(true));
            // setIsLoading(true);
            const res = await getLeaveHeadCountService({ mode: "user" });
            if (res?.data?.status === 200) {
                setLeaveData(res?.data?.data);
            } else {
                message.error("Failed to fetch data");
            }
        } catch (error) {
            message.error("Error fetching data");
        } finally {
            // setIsLoading(false);
            dispatch(setLoaderAction(false));
        }
    }
    async function fetchLeaveListData() {

        try {
            dispatch(setLoaderAction(true));
            // setIsLoading(true);
            const res = await getLeaveApplicationService({});
            if (res?.data?.status === 200) {
                setLeaveApplData(res?.data?.data);
            } else {
                message.error("Failed to fetch data");
            }
        } catch (error) {
            message.error("Error fetching data");
        } finally {
            // setIsLoading(false);
            dispatch(setLoaderAction(false));
        }
    }

    useEffect(() => {
        fetchLeaveTypeData();
        fetchLeaveListData();
        // fetchUserPendingLeaves();
    }, []);
    const [userInfo, setUserInfo] = useState<any>({
        head_leave_id: null,
        head_leave_cnt_id: null,
        from_date: "",
        to_date: "",
        reason: "",
    });
    const handleInputChange = (name: string, value: any) => {
        setUserInfo((prevState: any) => ({
            ...prevState, // Preserve other state values
            [name]: value, // Update only the specific field
        }));
    };






    const calculateDays = (value: any) => {
        const from_date: any = new Date(userInfo.from_date);
        const to_date: any = new Date(value);

        if (from_date && to_date) {
            const diffInMs: any = Math.abs(from_date - to_date);
            const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
            const totalDays = diffInDays + 1; // Calculate before updating state

            setNoOfDays({ ...noOfDays, totalCount: Number(totalDays) }); // Update state asynchronously

            setValue("no_of_days", totalDays); // Use local variable instead of noOfDays.totalCount
        }
    };



    const onSubmit = async (values: any) => {
        console.log('Success:', values);
        const remaining = Number(userPendingleaveData?.left_leave)
        console.log({ remaining, noOfDays })
        if (noOfDays.totalCount > remaining) {
            message.error("You cannot apply for more days than your remaining leaves");
            return;
        }


        try {
            dispatch(setLoaderAction(true));
            const { leave_type, ...filteredValues } = values;
            const res = await addLeaveApplicationService({ ...filteredValues, head_leave_id: userInfo?.head_leave_id, head_leave_cnt_id: userInfo?.head_leave_cnt_id })
            if (res?.data?.status === 200) {
                message.success(res.data.message)
                dispatch(setLoaderAction(false));
                setUserInfo({
                    head_leave_id: null,
                    head_leave_cnt_id: null,
                })
                setValue("from_date", "");
                setValue("to_date", "");
                setValue("reason", "");
                setValue("no_of_days", 0)
                setValue("left_leave", "")
                setValue("leave_type", "")
                await fetchLeaveListData();

            } else {
                message.error("Something Went Wrong")
            }

            //   navigate({ pathname: "/stores" })
        } catch (error) {
            dispatch(setLoaderAction(false));
            message.error(getValidationErrors(error))
            // message.error(error)

        }

    };
    return (
        <div className='btmMarginMob'>
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Apply Leave</h1>
            </header>
            <main  style={{}}>
                <Form
                    className="add-store-form createbeat"
                    onFinish={handleSubmit(onSubmit)}
                    autoComplete="off"
                    style={{ height: "auto" }}
                // layout="horizontal"
                // labelCol={{ span: 2 }}
                >
                    <Row gutter={[12, 12]}>
                        <Col span={12}>
                            <HookFormSelectField
                                control={control}
                                type="text"
                                name="leave_type"
                                placeholder="Select Leave Type"
                                label={"Leave Type"}
                                showSearch
                                allowClear
                                callback={(value: string) => {
                                    const parsedValue = JSON.parse(value);
                                    console.log("Parsed Value:", parsedValue);
                                    fetchUserPendingLeaves(parsedValue.headLeaveCntId, parsedValue.totalHeadLeave);
                                    setUserInfo({ ...userInfo, head_leave_id: parsedValue.headLeaveId, total_head_leave: parsedValue.totalHeadLeave, head_leave_cnt_id: parsedValue.headLeaveCntId })
                                }}
                                optionData={leaveData?.map((data: any) => ({
                                    value: JSON.stringify({
                                        headLeaveId: data?.headLeaveId,
                                        totalHeadLeave: data?.totalHeadLeave,
                                        headLeaveCntId: data?.headLeaveCntId
                                    }), // Convert object to string
                                    label: data?.headLeave?.head_leave_name,
                                }))}
                                filterOption={(inputValue: any, option: any) =>
                                    option.label.toLowerCase().includes(inputValue.toLowerCase())
                                }
                                required
                            /></Col>
                        <Col span={12}>
                            <HookFormInputField
                                control={control}
                                type="date"
                                name="from_date"
                                placeholder="From"
                                label={"From"}
                                callback={(e: any) => handleInputChange("from_date", e?.target?.value)}
                            // required
                            />
                        </Col>
                        <Col  span={12}>
                        <HookFormInputField
                                control={control}
                                type="date"
                                name="to_date"
                                placeholder="To"
                                label={"To"}
                                callback={(e: any) => calculateDays(e?.target?.value)}
                            // callback={calculateDays}
                            // required
                            />
                        </Col>
                        <Col  span={12}>
                        <HookFormInputField
                                control={control}
                                type="number"
                                name="no_of_days"
                                placeholder="Number of Days"
                                label={"Number of Days"}
                                disabled
                            // required
                            />
                              </Col>
                              <Col span={12}>
                              <HookFormInputField
                                control={control}
                                type="number"
                                name="left_leave"
                                placeholder="Remaining Leaves"
                                label={"Remaining Leaves"}
                                disabled

                            // required
                            />
                              </Col>
                              <Col span={12}>
                              <HookFormInputField
                                control={control}
                                type="text"
                                name="reason"
                                placeholder="Please Enter Reason"
                                label={"Reason"}
                                required
                            />
                              </Col>
                    </Row>



                   

                    <div className="" style={{marginTop:"10px"}}>
                        <div
                            className=" orders-btn">
                            <Button
                            //   onClick={() => redirect(-1)}
                            >Cancel</Button>
                            <button type="submit" className="btn-save">
                                Save
                            </button>
                        </div>
                    </div>
                </Form>
            </main>
            <main style={{ marginTop: "10px" }}>
                <div className="searchproduct">
                    <div>
                        <main className='content'>
                            <Table

                                dataSource={
                                    leaveApplData.map((d: any) => ({
                                        submit_by: d?.user?.firstname,
                                        leave_name: d?.LeaveHead?.head_leave_name,
                                        l_short_name: d?.LeaveHead?.head_leave_short_name,
                                        from_date: d?.from_date,
                                        to_date: d?.to_date,
                                        leave_days: d?.no_of_days,
                                        reason: d?.reason,
                                        status: d?.leave_app_status
                                    }))
                                }
                                bordered
                                scroll={{ x: "100%" }}
                                columns={columns}
                                size="small"
                                pagination={false}
                            />
                        </main>
                    </div>
                </div>
            </main>
        </div>
    );
}
