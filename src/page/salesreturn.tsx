import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Progress, Button, Tag, Table, Modal, Input, Select, Space, Form, DatePicker, Drawer, InputNumber, Descriptions, Typography, Grid } from "antd";
import {
    InboxOutlined,
    ClockCircleOutlined,
    LineChartOutlined,
    ArrowUpOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    PlusOutlined,
    EditOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    SearchOutlined
} from "@ant-design/icons";
import previousPage from "utils/previousPage";
import { setLoaderAction } from "redux-store/action/appActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "redux-store/store";
import { getAllOrdersListService } from "services/orderService";
import { IPagination } from "types/Common";
import { DEFAULT_PAGE_SIZE } from "app-constants";
import { DurationEnum } from "enum/common";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import "../style/stores.css";

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface OptionType {
    value: string;
    label?: React.ReactNode;
}

const cardData = [
    {
        title: "Total Returns",
        value: 4,
        suffix: "",
        description: "+2 from last week",
        icon: <InboxOutlined />,
    },
    {
        title: "Pending Review",
        value: 1,
        suffix: "",
        description: "Needs attention",
        icon: <ClockCircleOutlined />,
    },
    {
        title: "Total Value",
        value: 927.97,
        prefix: "$",
        precision: 2,
        description: "Returns this month",
        icon: <LineChartOutlined />,
    },
    {
        title: "Completion Rate",
        value: 25,
        suffix: "%",
        progress: true,
        description: "",
        icon: <ArrowUpOutlined />,
    },
];

const data = [
    {
        key: "1",
        returnId: "RET-001",
        orderNumber: "ORD-2024-001",
        customer: "John Smith",
        date: "2024-01-15",
        status: "Pending",
        value: "$149.99",
    },
    {
        key: "2",
        returnId: "RET-002",
        orderNumber: "ORD-2024-002",
        customer: "Sarah Johnson",
        date: "2024-01-14",
        status: "Approved",
        value: "$298.00",
    },
    {
        key: "3",
        returnId: "RET-003",
        orderNumber: "ORD-2024-003",
        customer: "Mike Davis",
        date: "2024-01-13",
        status: "Processing",
        value: "$399.99",
    },
    {
        key: "4",
        returnId: "RET-004",
        orderNumber: "ORD-2024-004",
        customer: "Emily Brown",
        date: "2024-01-12",
        status: "Completed",
        value: "$79.99",
    },
];

const Salesreturn: React.FC = () => {
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingRecord, setViewingRecord] = useState<any>(null);
    const [editForm] = Form.useForm();
    const [isModalOpenSaleReturn, setIsModalOpenSaleReturn] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const [orderList, setOrderList] = useState<any[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [cloneOrderList, setCloneOrderList] = useState<any[]>([]);
    const searchParams = new URLSearchParams(location?.search);
    const orderType: string | null = searchParams.get("orderType");
    const duration: string | null = searchParams.get("duration");
    const [filter, setFilter] = useState({
        duration: duration ? DurationEnum.TODAY : "",
        isCallType: orderType ? orderType : "",
    });
    const dispatch = useDispatch<AppDispatch>();
    const [selectedProductId, setSelectedProductId] = useState<any | null>(null);
    const screens = useBreakpoint();
    
    // Load gridView preference from localStorage or default to false (List view)
    const getDefaultGridView = () => {
        const saved = localStorage.getItem('salesReturnPageGridView');
        if (saved !== null) {
            return saved === 'true';
        }
        return false; // Default to list view
    };
    
    const [gridView, setGridView] = useState(getDefaultGridView());
    const [searchValue, setSearchValue] = useState("");
    
    const handleGridView = () => {
        setGridView(true);
        localStorage.setItem('salesReturnPageGridView', 'true');
    };
    
    const handleListView = () => {
        setGridView(false);
        localStorage.setItem('salesReturnPageGridView', 'false');
    };
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };
    
    const filteredData = data.filter((item) => {
        if (!searchValue) return true;
        const searchTerm = searchValue.toLowerCase();
        return (
            item.returnId?.toLowerCase().includes(searchTerm) ||
            item.orderNumber?.toLowerCase().includes(searchTerm) ||
            item.customer?.toLowerCase().includes(searchTerm) ||
            item.status?.toLowerCase().includes(searchTerm)
        );
    });

    useEffect(() => {
        getOrderList(filter);
    }, []);

    const getOrderList = async (filter?: any) => {
        try {
            dispatch(setLoaderAction(true));
            const pagination: IPagination = {
                pageNumber: pageNumber,
                pageSize: DEFAULT_PAGE_SIZE,
            };
            const response = await getAllOrdersListService(filter, pagination);
            dispatch(setLoaderAction(false));
            if (response && response.status === 200) {
                const { orders, pagination } = response.data.data;
                setOrderList(orders);
                setCloneOrderList(orders);
                setTotalRecords(pagination.totalRecords);
            }
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    };

    const filteredOrders = selectedProductId
        ? orderList.filter((order: any) =>
            order.products.some((p: any) => p.productId === selectedProductId)
        )
        : orderList;

    const handleViewClick = (record: any) => {
        setViewingRecord(record);
        setIsViewEditModalOpen(true);
        setIsEditing(false);
        editForm.setFieldsValue({
            ...record,
            storeName: record.store?.storeName || "-",
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (viewingRecord) {
            editForm.setFieldsValue({
                ...viewingRecord,
                storeName: viewingRecord.store?.storeName || "-",
            });
        }
    };

    const handleCloseViewEditModal = () => {
        setIsViewEditModalOpen(false);
        setViewingRecord(null);
        setIsEditing(false);
        editForm.resetFields();
    };

    const handleEditSubmit = () => {
        editForm.validateFields().then((values) => {
            console.log("Updated Values:", values);
            setIsEditing(false);
            if (viewingRecord) {
                setViewingRecord({...viewingRecord, ...values});
            }
        });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleOk = () => {
        setIsModalOpen(false);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = (record: any) => {
        setSelectedRecord(record);
        setIsModalOpenSaleReturn(true);
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: "Return ID",
            dataIndex: "returnId",
            key: "returnId",
            render: (text: string, record: any) => (
                <a
                    onClick={() => handleViewClick(record)}
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                >
                    {text}
                </a>
            ),
        },
        {
            title: "Order Number",
            dataIndex: "orderNumber",
            key: "orderNumber",
        },
        {
            title: "Customer",
            dataIndex: "customer",
            key: "customer",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                switch (status) {
                    case "Pending":
                        return (
                            <Tag icon={<ClockCircleOutlined />} color="black">
                                Pending
                            </Tag>
                        );
                    case "Approved":
                        return (
                            <Tag icon={<CheckCircleOutlined />} color="black">
                                Approved
                            </Tag>
                        );
                    case "Processing":
                        return (
                            <Tag icon={<InboxOutlined />} color="black">
                                Processing
                            </Tag>
                        );
                    case "Completed":
                        return (
                            <Tag icon={<CheckCircleOutlined />} color="black">
                                Completed
                            </Tag>
                        );
                    default:
                        return <Tag>{status}</Tag>;
                }
            },
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
        },
        {
            title: "Actions",
            key: "actions",
            render: () => (
                <Button type="default" shape="round" style={{ color: 'black' }}>
                    View Details
                </Button>
            ),
        },
    ];

    const ReturnColumns = [
        {
            title: "Order ID",
            dataIndex: "orderId",
            key: "orderId",
            render: (text: string, record: any) => (
                <a
                    onClick={() => handleViewClick(record)}
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                >
                    {text}
                </a>
            ),
        },
        {
            title: "Date",
            dataIndex: "orderDate",
            key: "orderDate",
        },
        {
            title: "Customer Name",
            key: "storeName",
            render: (_: any, record: any) => record.store?.storeName || "-",
        },
        {
            title: "Order Status",
            dataIndex: "orderStatus",
            key: "orderStatus",
        },
        {
            title: "Payment Status",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Button
                    type="primary"
                    style={{
                        width: '65px',
                        height: '26px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: '#6164A5',
                        borderColor: '#4B6CB7',
                    }}
                    onClick={() => handleOpenModal(record)}
                >
                    Select
                </Button>
            ),
        },
    ];

    const SelectReturnTable = [
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
        },
        {
            title: "Ordered Qty",
            dataIndex: "orderedQty",
            key: "orderedQty",
        },
        {
            title: "Return Qty",
            dataIndex: "returnQty",
            key: "returnQty",
            render: (_: any, record: any) => (
                <InputNumber
                    min={0}
                    max={record.orderedQty}
                    value={record.returnQty}
                />
            ),
        },
        {
            title: "Reason",
            dataIndex: "reason",
            key: "reason",
            render: (_: any, record: any) => (
                <Input
                    placeholder="Enter reason"
                    value={record.reason}
                />
            ),
        },
    ];

    const renderViewContent = () => {
        if (!viewingRecord) return null;
        
        return (
            <div style={{ overflowX: 'auto' }}>
                <Descriptions 
                    column={screens.xs ? 1 : 2} 
                    bordered
                    size="small"
                >
                    <Descriptions.Item label="Return ID">{viewingRecord.returnId}</Descriptions.Item>
                    <Descriptions.Item label="Order Number">{viewingRecord.orderNumber}</Descriptions.Item>
                    <Descriptions.Item label="Customer">{viewingRecord.customer}</Descriptions.Item>
                    <Descriptions.Item label="Date">{viewingRecord.date}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={
                            viewingRecord.status === "Completed" ? "green" : 
                            viewingRecord.status === "Approved" ? "blue" :
                            viewingRecord.status === "Processing" ? "orange" : "default"
                        }>
                            {viewingRecord.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Value">{viewingRecord.value}</Descriptions.Item>
                </Descriptions>
            </div>
        );
    };

    const renderEditForm = () => {
        return (
            <Form layout="vertical" form={editForm}>
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Return ID"
                            name="returnId"
                            rules={[{ required: true, message: "Return ID is required" }]}
                        >
                            <Input placeholder="Enter Return ID" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Order Number"
                            name="orderNumber"
                            rules={[{ required: true, message: "Order Number is required" }]}
                        >
                            <Input placeholder="Enter Order Number" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Customer"
                            name="customer"
                            rules={[{ required: true, message: "Customer is required" }]}
                        >
                            <Input placeholder="Enter Customer" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Date"
                            name="date"
                            rules={[{ required: true, message: "Date is required" }]}
                        >
                            <Input placeholder="Enter Date" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: "Status is required" }]}
                        >
                            <Select placeholder="Select Status">
                                <Option value="Pending">Pending</Option>
                                <Option value="Approved">Approved</Option>
                                <Option value="Processing">Processing</Option>
                                <Option value="Completed">Completed</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Value"
                            name="value"
                            rules={[{ required: true, message: "Value is required" }]}
                        >
                            <Input placeholder="Enter Value" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    };

    return (
        <div  style={{ overflowX: 'hidden', fontFamily: 'roboto' }}>
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Sales & Return</h1>
            </header>

            <Row gutter={[16, 16]} style={{ marginTop: '20px', padding: '0 10px' }}>
                {cardData.map((item, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                        <Card bordered={true} className="rounded-xl shadow-sm" bodyStyle={{ padding: '16px' }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: 500 }}>{item.title}</span>
                                {item.icon}
                            </div>

                            <Statistic
                                value={item.value}
                                suffix={item.suffix}
                                prefix={item.prefix}
                                precision={item.precision}
                                valueStyle={{ fontSize: "24px", fontWeight: 600 }}
                            />

                            {item.progress ? (
                                <Progress
                                    percent={item.value}
                                    showInfo={false}
                                    strokeColor="black"
                                />
                            ) : (
                                <div style={{ color: "gray", fontSize: "13px" }}>
                                    {item.description}
                                </div>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>

            <div style={{ padding: 10, marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 style={{ marginBottom: 0 }}>Recent</h2>
                    <Button
                        type="primary"
                        size="large"
                        style={{
                            width: '120px',
                            height: '40px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            background: '#6164A5',
                            borderColor: '#4B6CB7',
                        }}
                        onClick={showModal}
                    >
                        <PlusOutlined />New Return
                    </Button>
                </div>
                <p style={{ marginBottom: 10 }}>Manage and track all return requests</p>

                <div className="search">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search by Return ID, Order Number, Customer, Status"
                        value={searchValue}
                        onChange={handleSearch}
                        allowClear
                    />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                            <AppstoreOutlined style={{ fontSize: '15px' }} onClick={handleGridView} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginRight: '10px' }}>
                            <UnorderedListOutlined style={{ fontSize: '15px' }} onClick={handleListView} />
                        </div>
                    </div>
                </div>

                {gridView ? (
                    <div
                        className="content"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "20px",
                            marginTop: "24px",
                            marginBottom: "10px",
                        }}
                    >
                        {filteredData && filteredData.length > 0 && filteredData.map((item, index) => {
                            const getStatusColor = (status: string) => {
                                switch (status) {
                                    case "Completed":
                                        return "#2DB83D";
                                    case "Approved":
                                        return "#1890ff";
                                    case "Processing":
                                        return "#faad14";
                                    default:
                                        return "#e61b23";
                                }
                            };

                            return (
                                <div key={index}>
                                    <div
                                        className="store-list"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleViewClick(item)}
                                    >
                                        <div className="shoptitle">
                                            <div className="fontb">{item?.returnId}</div>
                                            <div
                                                style={{
                                                    background: getStatusColor(item?.status),
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    color: 'white',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {item?.status}
                                            </div>
                                        </div>
                                        <div className="storeConlist">
                                            <div>
                                                <div className="storeIdTxt">
                                                    Order: {item?.orderNumber}
                                                </div>
                                                <div className="fs-13">Customer: <span className="fw-bold">{item?.customer}</span></div>
                                                <div className="fs-13">Date: <span className="fw-bold">{item?.date}</span></div>
                                                <div className="fs-13">Value: <span className="fw-bold">{item?.value}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <table className="store-table" style={{ textDecoration: 'none', fontSize: '13px', width: '100%', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th>Return ID</th>
                                <th>Order Number</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData?.map((item, index) => {
                                const getStatusColor = (status: string) => {
                                    switch (status) {
                                        case "Completed":
                                            return "#2DB83D";
                                        case "Approved":
                                            return "#1890ff";
                                        case "Processing":
                                            return "#faad14";
                                        default:
                                            return "#e61b23";
                                    }
                                };

                                return (
                                    <tr key={index}>
                                        <td>
                                            <a
                                                onClick={() => handleViewClick(item)}
                                                style={{ textDecoration: 'none', color: '#1890ff', cursor: 'pointer' }}
                                            >
                                                {item?.returnId}
                                            </a>
                                        </td>
                                        <td>{item?.orderNumber}</td>
                                        <td>{item?.customer}</td>
                                        <td>{item?.date}</td>
                                        <td>
                                            <span
                                                style={{
                                                    background: getStatusColor(item?.status),
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    color: 'white',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {item?.status}
                                            </span>
                                        </td>
                                        <td>{item?.value}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            
            <Modal
                title="Sales Return"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={screens.xs ? '95%' : 1000}
                style={{ top: 20 }}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                getContainer={false}
                forceRender
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            style={{ width: "100%" }}
                            placeholder="Search & select products"
                            onChange={(value) => setSelectedProductId(value || null)}
                        >
                            {orderList.flatMap((order: any) =>
                                order.products.map((p: any) => (
                                    <Select.Option
                                        key={`${order.orderId}-${p.productId}`}
                                        value={p.productId}
                                    >
                                        {p?.productName} ({order.orderId})
                                    </Select.Option>
                                ))
                            )}
                        </Select>
                        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                            <Table
                                columns={ReturnColumns}
                                dataSource={filteredOrders}
                                pagination={{ pageSize: 5 }}
                                bordered={false}
                                scroll={{ x: 'max-content' }}
                                style={{ minWidth: '700px' }}
                            />
                        </div>
                    </Col>
                </Row>
            </Modal>
            
            <Modal
                title="Order Details"
                width={screens.xs ? '95%' : 1000}
                style={{ top: 20 }}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                getContainer={false}
                forceRender
                open={isModalOpenSaleReturn}
                onOk={() => setIsModalOpenSaleReturn(false)}
                onCancel={() => setIsModalOpenSaleReturn(false)}
                bodyStyle={{ padding: 16 }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <Table
                        columns={SelectReturnTable}
                        dataSource={filteredOrders}
                        pagination={{ pageSize: 5 }}
                        bordered={false}
                        scroll={{ x: 'max-content' }}
                        style={{ minWidth: '600px' }}
                    />
                </div>
            </Modal>

            <Modal
                title={
                    isEditing 
                        ? `Edit Return - ${viewingRecord?.returnId || ''}` 
                        : `View Return - ${viewingRecord?.returnId || ''}`
                }
                open={isViewEditModalOpen}
                onOk={isEditing ? handleEditSubmit : handleCloseViewEditModal}
                onCancel={handleCloseViewEditModal}
                okText={isEditing ? "Update" : "Close"}
                cancelText={isEditing ? "Cancel Edit" : "Cancel"}
                width={screens.xs ? '95%' : 900}
                style={{ top: 20 }}
                bodyStyle={{
                    maxHeight: '70vh',
                    padding: '16px',
                    overflowY: 'auto'
                }}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                getContainer={false}
                forceRender
                footer={[
                    !isEditing && (
                        <Button key="edit" type="primary" onClick={handleEditClick}>
                            <EditOutlined /> Edit
                        </Button>
                    ),
                    isEditing && (
                        <Button key="cancel" onClick={handleCancelEdit}>
                            Cancel 
                        </Button>
                    ),
                    <Button 
                        key="ok" 
                        type={isEditing ? "primary" : "default"} 
                        onClick={isEditing ? handleEditSubmit : handleCloseViewEditModal}
                    >
                        {isEditing ? "Save" : "Close"}
                    </Button>,
                ]}
            >
                {isEditing ? renderEditForm() : renderViewContent()}
            </Modal>
        </div>
    );
};

export default Salesreturn;