import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "redux-store/store";
import previousPage from "utils/previousPage";
import { useAuth } from "context/AuthContext";
import { Button, Col, Input, message, Modal, Row, Select,  Table, Tag } from "antd";
import { setLoaderAction } from "redux-store/action/appActions";
import { getExpenseService,  updateExpenseService } from "services/usersSerivce";
import { dateFormatterNew } from "utils/common";

export default function ExpenseManagement() {
    const dispatch = useDispatch<AppDispatch>();
    const [expenseApplData, setExpenseApplData] = useState<any>([]);
    const uniqueExpenseApplData = expenseApplData.filter(
        (item: any, index: any, self: any) =>
            index === self.findIndex((t: any) => t.user?.emp_id === item.user?.emp_id)
    );

    const [dateFilters, setDateFilters] = useState({
        from_date: ""
    });
    const [filters, setFilters] = useState<any>({
        status: "",
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
            user: "",
            from_date: "",
            to_date: ""
        });
    };
    const [isUpdate, setIsUpdate] = useState(false);

    const fetchExpenseListData = useCallback(async () => {
        try {
            dispatch(setLoaderAction(true));

            const { status, user, to_date } = filters;
            const { from_date } = dateFilters
            const res = await getExpenseService({
                mode: "rpt",
                from_date,
                to_date,
                status,
                userFil_id: user,
            });

            if (res?.data?.status === 200) {
                setExpenseApplData(res?.data?.data);
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
        fetchExpenseListData();
    }, [fetchExpenseListData]);

  
  
    const { confirm } = Modal;

    const [remarksVal, setRemarksVal] = useState<string>("")
    const remarksHandler = (e: string) => {
        console.log(e)
        setRemarksVal(e)
    }
    const showConfirm = (key: string, id: number, status: string) => {
        let remarksText: string = "";
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
                            onChange={(e: any) => remarksText = e.target.value}
                        /></div>
                </>,
            async onOk() {
                try {
                    dispatch(setLoaderAction(true));
                    const response = await updateExpenseService({ expence_id: id, report_status: status, remark: remarksText });
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
    const viewRemarks = (remarks: string, status: string) => {

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
            title: 'Application Submit To',
            dataIndex: 'submit_to',
            key: 'submit_to',
            width: 120,

        },
        {
            title: 'Policy Name',
            dataIndex: 'police_name',
            key: 'police_name',
            width: 100,

        },
        {
            title: 'Claim Type',
            dataIndex: 'claim_type',
            key: 'claim_type',
            width: 80,

        },
        {
            title: 'From Date',
            dataIndex: 'from_date',
            key: 'from_date',
            width: 100,

        },
        {
            title: 'To Date',
            dataIndex: 'to_date',
            key: 'to_date',
            width: 100,

        },
        {
            title: 'From Location',
            dataIndex: 'from_location',
            key: 'from_location',
            width: 100,

        },
        {
            title: 'To Location',
            dataIndex: 'to_location',
            key: 'to_location',
            width: 100,

        },
        {
            title: 'Total Expense',
            dataIndex: 'total_expense',
            key: 'total_expense',
            width: 80,

        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (text: any, record: any) => {
                return (
                    <Tag color={text === "PENDING" ? "orange" : text === "APPROVED" ? "green" : text === "REJECTED" ? "red" : ""} style={{ fontWeight: 500 }}>{text}</Tag>
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
                        {record?.status === "PENDING" ?
                            <> <Button onClick={() => showConfirm("accept", record?.expence_id, "APPROVED")}
                                type="default" style={{ borderColor: "green", color: "green", marginRight: "6px" }}>
                                Accept
                            </Button>
                                <Button danger onClick={() => showConfirm("reject", record?.expence_id, "REJECTED")}>Reject</Button></>
                            :
                            <Button style={{ borderColor: "purple", color: "purple", }} onClick={() => viewRemarks(record?.remark, record?.status)}>View</Button>
                        }
                    </>

                )
            },
        },

    ];
    return (
        <div>
            <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Expenses Approval</h1>
            </header>

            <main className='content' style={{ marginBottom: "0px" }}>
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={12} md={4} lg={4}>
                        <div className="field-group">
                            <label style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Select User</label>
                            <Select placeholder="Select" value={filters.user || undefined} onChange={(e: any) => handleFilterChange("user", e)}
                                options={[
                                    { label: "All", value: "" },
                                    ...uniqueExpenseApplData?.map((d: any) => ({
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
                            <Select value={filters.status || undefined} onChange={(e: any) => handleFilterChange("status", e)} placeholder="Select" options={[{ label: "All", value: "" }, { label: 'Pending', value: "PENDING" }, { label: 'Approved', value: "APPROVED" }, { label: 'Rejected', value: "REJECTED" },]} className="selectTargetFil" style={{ width: "100%" }} />
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4}>
                       
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
                                    expenseApplData?.map((d: any) => ({
                                        submit_by: `${d?.user?.firstname} ${d?.user?.lastname}`,
                                        submit_to: `${d?.manager?.firstname ?? ""} ${d?.manager?.lastname ?? ""}`,
                                        police_name: d?.policy?.policy_name,
                                        from_date: d?.from_date ? dateFormatterNew(d?.from_date):"",
                                        to_date: d?.to_date ? dateFormatterNew(d?.to_date):"",
                                        claim_type: d?.policyType?.claim_type,
                                        from_location: d?.from_location,
                                        to_location: d?.to_location,
                                        total_expense: d?.total_expence,
                                        reason: d?.reason,
                                        status: d?.report_status,
                                        leave_app_id: d?.leave_app_id,
                                        remark: d?.remark,
                                        expence_id: d?.expence_id
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
