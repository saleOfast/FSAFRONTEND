import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Progress, Button, Tag, Table, Modal, Input, AutoComplete, AutoCompleteProps, Checkbox, Select, Space, Form, DatePicker, Drawer, InputNumber } from "antd";
import {
    InboxOutlined,
    ClockCircleOutlined,
    LineChartOutlined,
    ArrowUpOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    PlusOutlined,
    CheckOutlined,
    CloseOutlined,
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
import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";
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

const columns = [
    {
        title: "Return ID",
        dataIndex: "returnId",
        key: "returnId",
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
            <Button type="default" shape="round" color="black">
                View Details
            </Button>
        ),
    },
];

const { Search } = Input;
const { Option } = Select;
const Salesreturn: React.FC = () => {

    const [selectedReturn, setelectedReturn] = useState(false);
    const [isModalOpenSaleReturn, setIsModalOpenSaleReturn] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [options, setOptions] = useState<any[]>([]);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const location = useLocation();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [orderList, setOrderList] = useState<any[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [cloneOrderList, setCloneOrderList] = useState<any[]>([]);
    const searchParams = new URLSearchParams(location?.search);
    const orderType: string | null = searchParams.get("orderType");
    const duration: string | null = searchParams.get("duration");
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

    const [filter, setFilter] = useState({
        duration: duration ? DurationEnum.TODAY : "",
        isCallType: orderType ? orderType : "",
    });
    const dispatch = useDispatch<AppDispatch>();

    const options = [
        { value: "parle G", label: "parle G" },
        { value: "Coca Cola", label: "Coca Cola" },
        { value: "Good day", label: "Good day" },
    ];
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
    const [selectedProductId, setSelectedProductId] = useState<any | null>(null);

    // ✅ Filter orders based on selected product
    const filteredOrders = selectedProductId
        ? orderList.filter((order: any) =>
            order.products.some((p: any) => p.productId === selectedProductId)
        )
        : orderList;

    const handleOpenModal = (record: any) => {
        setSelectedRecord(record);
        setIsModalOpenSaleReturn(true);
        setIsModalOpen(false)
    };

    const ReturnColumns = [
        {
            title: "Order ID",
            dataIndex: "orderId",
            key: "orderId",
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
            title: "Actions", // ✅ Combine Edit/Delete under one column
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
                // onChange={(val) => handleUpdate(record.key, "returnQty", val)}
                />
            ),
        },
        // {
        //     title: "Price",
        //     dataIndex: "price",
        //     key: "price",
        //     render: (price: number) => `₹${price}`,
        // },
        {
            title: "Reason",
            dataIndex: "reason",
            key: "reason",
            render: (_: any, record: any) => (
                <Input
                    placeholder="Enter reason"
                    value={record.reason}
                // onChange={(e) => handleUpdate(record.key, "reason", e.target.value)}
                />
            ),
        },
    ];



    return (
        <div>
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Sales & Return</h1>
            </header>

            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                {cardData.map((item, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                        <Card bordered={true} className="rounded-xl shadow-sm" >
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ marginBottom: 0 }}>Recent  </h2>
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

                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    bordered={false}
                    scroll={{ x: "max-content" }} // ✅ enables horizontal scroll
                    style={{ width: "100%" }}
                />
            </div>
            <Modal
                title="Sales Return"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                style={{ top: 20 }}
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
                                        key={`${order.orderId}-${p.productId}`} // unique key
                                        value={p.productId}                     // ✅ value added
                                    >
                                        {p?.productName} ({order.orderId})
                                    </Select.Option>
                                ))
                            )}

                        </Select>
                        <div style={{ marginTop: '20px' }}>

                            <Table
                                columns={ReturnColumns}
                                dataSource={filteredOrders}

                                pagination={{ pageSize: 5 }}
                                bordered={false}
                                scroll={{ x: "max-content" }} // ✅ enables horizontal scroll
                                style={{ width: "100%" }}
                            />


                        </div>


                    </Col>
                </Row>


            </Modal>
            {/* selected sales return modal */}
            <Modal
                title="Order Details"
                width={1000}
                style={{ top: 20 }}

                open={isModalOpenSaleReturn}
                onOk={() => setIsModalOpenSaleReturn(false)}
                onCancel={() => setIsModalOpenSaleReturn(false)}
                bodyStyle={{ padding: 16 }}
            >



                {/* {selectedRecord ? (
                    <div>
                        <p><b>Order ID:</b> {selectedRecord.orderId}</p>
                        <p><b>Customer:</b> {selectedRecord.store?.storeName}</p>
                        <p><b>Status:</b> {selectedRecord.orderStatus}</p>
                    </div>
                ) : null} */}

                <Table
                    columns={SelectReturnTable}
                    dataSource={filteredOrders}
                    pagination={{ pageSize: 5 }}
                    bordered={false}
                    scroll={{ x: "max-content" }} // ✅ enables horizontal scroll
                    style={{ width: "100%" }}
                />

            </Modal>



            {/* inline responsive style for search height */}
            <style>{`
        .custom-search .ant-input,
        .custom-search .ant-btn {
          height: 45px !important;
          font-size: 15px;
        }
     
      `}</style>

        </div >
    );
};

export default Salesreturn;
