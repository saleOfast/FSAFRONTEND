import React, { useCallback, useEffect, useState } from "react";
// import "../../style/orderList.css";
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, EyeOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "redux-store/reducer";
import { AppDispatch } from "redux-store/store";
import { getProductSchemeActions } from "redux-store/action/productAction";
// import { deleteProductSchemeService } from "services/productService";
import previousPage from "utils/previousPage";
import { useAuth } from "context/AuthContext";
import { UserRole } from "enum/common";
import { Button, Col, Input, message, Modal, Row, Select, Switch, Table, Tag } from "antd";
import { setLoaderAction } from "redux-store/action/appActions";
import { getActiveSchemeService, updateSchemeService } from "services/productService";
import { getLeaveApplicationService, getLeaveHeadCountService, getLeaveHeadService, updateLeaveApplicationService } from "services/usersSerivce";
import { dateFormatterNew } from "utils/common";
// import DeleteItem from "../common/deleteItem";

export default function LeaveApproval() {

    const [toggleDelete, setToggleDelete] = useState(false);


    const dispatch = useDispatch<AppDispatch>();
    // console.log({productSchemeList})
    const { authState } = useAuth()



    const toggleHandler = (schemeId: string, name: string) => {
        setToggleDelete(true);

    }
    const [leaveHeadData, setLeaveHeadData] = useState<any>([]);
    const [leaveApplData, setLeaveApplData] = useState<any>([]);
    const uniqueLeaveApplData = leaveApplData.filter(
        (item: any, index: any, self: any) =>
            index === self.findIndex((t: any) => t.user?.emp_id === item.user?.emp_id)
    );

    async function fetchLeaveHeadData() {
        try {
            dispatch(setLoaderAction(true));
            const res = await getLeaveHeadService();
            if (res?.data?.status === 200) {
                setLeaveHeadData(res?.data?.data);
            } else {
                message.error("Failed to fetch data");
            }
        } catch (error) {
            message.error("Error fetching data");
        } finally {
            dispatch(setLoaderAction(false));
        }
    }
    const [dateFilters, setDateFilters] = useState({
        from_date: ""
    });
    const [filters, setFilters] = useState<any>({
        status: "",
        leaveHead: "",
        user: "",
        to_date: "",
    });
    //   console.log({filters})
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        if (key == "from_date") {
            setDateFilters((prev: any) => ({ ...prev, [key]: value }));
        } else {
            setFilters((prev: any) => ({ ...prev, [key]: value }));

        }
    };
    const clearAllFilters = () => {
        setFilters({
            status: "",
            leaveHead: "",
            user: "",
            from_date: "",
            to_date: ""
        });
    };
    const [isUpdate, setIsUpdate] = useState(false);

    const fetchLeaveListData = useCallback(async () => {
        try {
            dispatch(setLoaderAction(true));

            const { status, leaveHead, user, to_date } = filters;
            const { from_date } = dateFilters
            const res = await getLeaveApplicationService({
                mode: "rpt",
                from_date,
                to_date,
                status,
                head_leave_id: leaveHead,
                userFil_id: user,
            });

            if (res?.data?.status === 200) {
                setLeaveApplData(res?.data?.data);
            } else {
                message.error("Failed to fetch data");
            }
        } catch (error) {
            message.error("Error fetching data");
        } finally {
            dispatch(setLoaderAction(false));
        }
    }, [filters, isUpdate]);
    useEffect(() => {
        fetchLeaveListData();
    }, [fetchLeaveListData]);

    useEffect(() => {
        fetchLeaveHeadData();
    }, []);

    const { confirm } = Modal;

    const [remarksVal, setRemarksVal] = useState<string>("")
  const remarksHandler = (e:string) =>{
    console.log(e)
    setRemarksVal(e)
   }
    const showConfirm = (key: string, id: number, status: string) => {
        let remarksText:string="";
        confirm({
            icon: key === "accept" ? <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />
                : <CloseCircleOutlined style={{ color: "red", fontSize: "20px" }} />,
            title: key === "accept" ? "Accept Remarks" : "Reject Remarks",
            content:
                <>
                    <div>
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter your text here"
                            onChange={(e:any) => remarksText = e.target.value}
                        /></div>
                </>,
            async onOk() {
                try { 
                    dispatch(setLoaderAction(true));
                    const response = await updateLeaveApplicationService({ leave_app_id: id, leave_app_status: status, remarks: remarksText });
                    dispatch(setLoaderAction(false));
                    if (response?.data?.status === 200) {
                        message.success("Updated Successfully");
                        setIsUpdate(!isUpdate)
                    } else {
                        message.error("Something Went Wrong");
                    }
                } catch (error: any) {
                    dispatch(setLoaderAction(false));
                    message.error("Something Went Wrong");
                }
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    };
    const viewRemarks = (remarks:string, status:string) => {
        
        confirm({
          title: status === "approved" ? "Approved Remarks" : status === "rejected" ? "Rejected Remarks" : "Remarks",
        //   icon: <QuestionCircleOutlined />,
          content: remarks,
         onOk() {
           
          },
        //   onCancel() {
        //     console.log("Cancel");
        //   },
        });
      };
    const columns: any = [
        {
            title: 'Submit By',
            dataIndex: 'submit_by',
            key: 'submit_by',
            fixed: "left",
            width: 120,
        },
        {
            title: 'Application Submit to',
            dataIndex: 'submit_to',
            key: 'submit_to',
            width: 120,
        },
        {
            title: 'Leave Type',
            dataIndex: 'police_type',
            key: 'police_type',
            width: 120,
        },
        {
            title: 'From Date',
            dataIndex: 'from_date',
            key: 'from_date',
            width: 120,
        },
        {
            title: 'To Date',
            dataIndex: 'to_date',
            key: 'to_date',
            width: 120,
        },
        {
            title: 'Leave Days',
            dataIndex: 'leave_days',
            key: 'leave_days',
            width: 80,
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            width: 120,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (text: any, record: any) => {
                return (
                    <Tag color={text === "pending" ? "orange" : text === "approved" ? "green" : text === "rejected" ? "red" : ""} style={{ fontWeight: 500 }}>{text}</Tag>
                )
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 180,
            render: (text: any, record: any) => {
                return (
                    <>
                        {record?.status === "pending" ?
                            <> <Button onClick={() => showConfirm("accept", record?.leave_app_id, "approved")}
                                type="default" style={{ borderColor: "green", color: "green", marginRight: "6px" }}>
                                Accept
                            </Button>
                                <Button danger onClick={() => showConfirm("reject", record?.leave_app_id, "rejected")}>Reject</Button></>
                            :
                            <Button style={{ borderColor: "purple", color: "purple",}} onClick={() => viewRemarks(record?.remarks, record?.status)}>View</Button>
                           }
                    </>

                )
            },
        },
    ];
    return (
        <div>
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Leave Approval</h1>
            </header>
            {/* {(authState?.user?.role !== UserRole.RETAILER && authState?.user?.role !== UserRole.SSM) && <Link to="/admin/add-new-scheme">
                <div className="addIcon">
                    <PlusOutlined className="plusIcon" />
                </div>
            </Link>} */}
            <main className='content' style={{ marginBottom: "0px" }}>

                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={12} md={4} lg={4}>
                        <div className="field-group">
                            <label style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Select User</label>
                            <Select placeholder="Select" value={filters.user || undefined} onChange={(e: any) => handleFilterChange("user", e)}
                                options={[
                                    { label: "All", value: "" },
                                    ...uniqueLeaveApplData?.map((d: any) => ({
                                        label: `${d?.user?.firstname} ${d?.user?.lastname}`,
                                        value: d?.user?.emp_id
                                    }))
                                ]} className="selectTargetFil" style={{ width: "100%" }} />
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4}>
                        <div className="field-group">
                            <label style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>From</label>
                            <Input type="date" value={filters.from_date || undefined} onChange={(e: any) => handleFilterChange("from_date", e?.target?.value)} style={{ width: "100%" }} />
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4}>
                        <div className="field-group">
                            <label style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>To</label>
                            <Input type="date" value={filters.to_date || undefined} onChange={(e: any) => handleFilterChange("to_date", e?.target?.value)} style={{ width: "100%" }} />
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4}>
                        <div className="field-group">
                            <label style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Select Status</label>
                            <Select value={filters.status || undefined} onChange={(e: any) => handleFilterChange("status", e)} placeholder="Select" options={[{ label: "All", value: "" }, { label: 'Pending', value: "pending" }, { label: 'Approved', value: "approved" }, { label: 'Rejected', value: "rejected" },]} className="selectTargetFil" style={{ width: "100%" }} />
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4}>
                        <div className="field-group">
                            <label style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Select Leave Head</label>
                            <Select onChange={(e: any) => handleFilterChange("leaveHead", e)} placeholder="Select" options={[
                                { label: "All", value: "" },
                                ...leaveHeadData?.map((d: any) => ({
                                    label: d?.head_leave_name,
                                    value: d?.head_leave_id
                                }))
                            ]}
                                value={filters.leaveHead || undefined}
                                className="selectTargetFil" style={{ width: "100%" }} />
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4} style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center", marginTop: "12px" }} >
                        <div  >
                            {/* <Button style={{ background: "#6164A6", color: "white", marginRight: "10px" }}>
                                Search
                            </Button> */}
                            <Button onClick={clearAllFilters} style={{ background: "#6164A6", color: "white", marginRight: "10px" }}>
                                Clear All
                            </Button>

                        </div>

                    </Col>
                </Row>





            </main>
            <main style={{ marginTop: "10px" }}>
                <div className="searchproduct">
                    <div>
                        <main className='content'>
                            <Table

                                dataSource={
                                    leaveApplData?.map((d: any) => ({
                                        submit_by: `${d?.user?.firstname} ${d?.user?.lastname}`,
                                        submit_to: `${d?.manager?.firstname ?? ""} ${d?.manager?.lastname ?? ""}`,
                                        police_type: d?.LeaveHead?.head_leave_name,
                                        from_date: dateFormatterNew(d?.from_date),
                                        to_date: dateFormatterNew(d?.to_date),
                                        leave_days: d?.no_of_days,
                                        reason: d?.reason,
                                        status: d?.leave_app_status,
                                        leave_app_id: d?.leave_app_id,
                                        remarks: d?.remarks
                                    }))
                                }
                                bordered
                                columns={columns}
                                size="small"
                                pagination={false}
                                scroll={{ x: "100%" }}
                            />
                        </main>
                    </div>
                </div>
            </main>
        </div>
    );
}
