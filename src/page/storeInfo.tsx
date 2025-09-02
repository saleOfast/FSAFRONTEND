import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Row,
    Space,
    Table,
    Tag,
    Grid,
    Select,
    Input,
    Form,
    Modal
} from 'antd';
import React, { useState } from 'react';
import previousPage from 'utils/previousPage';
import type { ColumnsType } from 'antd/es/table';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import { SearchOutlined } from "@ant-design/icons";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Option } = Select;


const { useBreakpoint } = Grid;

export interface Store {
    storeId: string;              // Unique identifier
    storeName: string;            // Store Name
    customerId: string;           // Customer ID
    location: {
        address: string;            // Street address
        city: string;
        state: string;
        zip: string;
    };
    contactPerson: string;        // Primary contact person
    contactPhone: string;         // Phone number
    email: string;                // Email address
    capacity: number;             // Store capacity
    storeType: string;            // e.g., Retail, Warehouse, Franchise
    operationalHours: string;     // e.g., "9 AM - 9 PM"
    managerName: string;
    managerContact: string;
    status: "Active" | "Inactive"; // Only two values allowed
    createdDate: string;          // ISO date string
    lastUpdatedDate: string;      // ISO date string
    createdBy: string;
    lastModifiedBy: string;
}

const Storeinfo = () => {
    const columns = [
        {
            title: "StoreId (Unique identifier)",
            dataIndex: "storeId",
            key: "storeId",
        },
        {
            title: "Store Name",
            dataIndex: "storeName",
            key: "storeName",
        },
        {
            title: "CustomerId",
            dataIndex: "customerId",
            key: "customerId",
        },
        {
            title: "Address",
            dataIndex: ["location", "address"],
            key: "address",
        },
        {
            title: "City",
            dataIndex: ["location", "city"],
            key: "city",
        },
        {
            title: "State",
            dataIndex: ["location", "state"],
            key: "state",
        },
        {
            title: "Zip",
            dataIndex: ["location", "zip"],
            key: "zip",
        },
        {
            title: "Contact Person",
            dataIndex: "contactPerson",
            key: "contactPerson",
        },
        {
            title: "Contact Phone",
            dataIndex: "contactPhone",
            key: "contactPhone",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Capacity",
            dataIndex: "capacity",
            key: "capacity",
        },
        {
            title: "Store Type",
            dataIndex: "storeType",
            key: "storeType",
        },
        {
            title: "Operational Hours",
            dataIndex: "operationalHours",
            key: "operationalHours",
        },
        {
            title: "Manager Name",
            dataIndex: "managerName",
            key: "managerName",
        },
        {
            title: "Manager Contact",
            dataIndex: "managerContact",
            key: "managerContact",
        },
        {
            title: "Status (Active/Inactive)",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Created Date",
            dataIndex: "createdDate",
            key: "createdDate",
        },
        {
            title: "Last Updated Date",
            dataIndex: "lastUpdatedDate",
            key: "lastUpdatedDate",
        },
        {
            title: "Created By",
            dataIndex: "createdBy",
            key: "createdBy",
        },
        {
            title: "Last Modified By",
            dataIndex: "lastModifiedBy",
            key: "lastModifiedBy",
        },
    ];
    const data: Store[] = [
        {
            storeId: "STR001",
            storeName: "Fresh Mart",
            customerId: "CUST1001",
            location: {
                address: "123 Main St",
                city: "Mumbai",
                state: "Maharashtra",
                zip: "400001",
            },
            contactPerson: "Rahul Mehta",
            contactPhone: "+91-9876543210",
            email: "rahul@freshmart.com",
            capacity: 500,
            storeType: "Retail",
            operationalHours: "9:00 AM - 10:00 PM",
            managerName: "Amit Kumar",
            managerContact: "+91-9123456789",
            status: "Active",
            createdDate: "2025-01-01T10:30:00Z",
            lastUpdatedDate: "2025-08-20T15:45:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },

    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const screens = useBreakpoint();

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSubmit = () => {
        form.validateFields().then((values) => {
            console.log("Form Values:", values);
            setIsModalOpen(false);
            form.resetFields();
        });
    };



    return (
        <div style={{ backgroundColor: '#f4f6fa', minHeight: '100vh' }}>
            {/* Header */}
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Store</h1>
            </header>

            {/* Content */}
            <div style={{ padding: '4px' }}>
                {/* Top Card */}
                <Card
                    style={{
                        borderRadius: 12,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        border: 'none',
                        backgroundColor: '#ffffff',
                    }}
                    bodyStyle={{
                        padding: '24px',
                    }}
                >
                    <Row gutter={[16, 16]} align="middle">
                        {/* Text Section */}
                        <Col xs={24} sm={24} md={16}>
                            <div>
                                <p
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '24px',
                                        marginBottom: '6px',
                                        color: '#2c3e50',
                                    }}
                                >
                                    Store Management
                                </p>
                                <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
                                    Manage your Store locations and operations
                                </p>
                            </div>
                        </Col>

                        {/* Button Section */}
                        <Col
                            xs={24}
                            sm={24}
                            md={8}
                            style={{
                                display: 'flex',
                                justifyContent: screens.xs ? 'center' : 'flex-end',
                            }}
                        >
                            <Button
                                type="primary"
                                size="large"
                                block={screens.xs}
                                style={{
                                    width: screens.xs ? '100%' : '180px',
                                    height: '48px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    background: '#6164A5',
                                    borderColor: '#4B6CB7',
                                }}
                                onClick={handleOpenModal}   // <-- add this line
                            >
                                <PlusOutlined /> Add Store
                            </Button>
                        </Col>
                    </Row>
                </Card>
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    {/* Search Input */}
                    <Col flex="auto">
                        <Input
                            prefix={<SearchOutlined style={{ color: "#B0B0B0", padding: '18px' }} />}
                            placeholder="Search Store by name, ID, or city..."
                            size="large"
                            allowClear
                        />
                    </Col>

                    {/* Status Filter */}
                    <Col>
                        <Select
                            defaultValue="all"
                            size="large"
                            style={{ minWidth: 150, height: '50px' }}
                            suffixIcon={<span style={{ fontSize: "12px" }}>▼</span>}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                            <Option value="archived">Archived</Option>
                        </Select>
                    </Col>
                </Row>

                {/* Table Section */}
                <div style={{ overflowX: 'auto' }}>
                    <Table<Store>
                        columns={columns}
                        dataSource={data}
                        pagination={{ pageSize: 5 }}
                        bordered
                        scroll={{ x: true }}   // 👈 minimum scrollable width
                    />
                </div>

            </div>
            <Modal
                title="Create New Store"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCloseModal}
                okText="Save"
                cancelText="Cancel"
                width={900} // wider modal for big form
            >
                <p style={{ marginBottom: 20, color: "#666" }}>
                    Fill in the details below to create a new Store location.
                </p>

                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Store Number"
                                name="StoreNumber"
                                rules={[{ required: true, message: "Store Number is required" }]}
                            >
                                <Input placeholder="Enter Store Number" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Product Name"
                                name="productName"
                                rules={[{ required: true, message: "Product name is required" }]}
                            >
                                <Input placeholder="Enter product name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Sales Channel"
                                name="salesChannel"
                                rules={[{ required: true, message: "Please select sales channel" }]}
                            >
                                <Select placeholder="Select Sales Channel">
                                    <Select.Option value="retail">Retail</Select.Option>
                                    <Select.Option value="distributor">Distributor</Select.Option>
                                    <Select.Option value="online">Online</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Channel Store"
                                name="channelStore"
                                rules={[{ required: true, message: "Channel Store is required" }]}
                            >
                                <Input placeholder="Enter channel Store" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Barcode / UPC"
                                name="barcode"
                                rules={[{ required: true, message: "Barcode/UPC is required" }]}
                            >
                                <Input placeholder="Enter Barcode or UPC" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <Input placeholder="Enter short description" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Attribute - Color"
                                name="attributeColor"
                            >
                                <Input placeholder="Enter color" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Attribute - Size"
                                name="attributeSize"
                            >
                                <Input placeholder="Enter size" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Stock Level"
                                name="stockLevel"
                                rules={[{ required: true, message: "Please enter stock level" }]}
                            >
                                <Input type="number" placeholder="Enter stock level" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Warehouse Location"
                                name="warehouseLocation"
                            >
                                <Input placeholder="Enter warehouse location" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Product Description"
                                name="productDescription"
                            >
                                <Input.TextArea placeholder="Enter detailed product description" rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal>

        </div>
    );
};

export default Storeinfo;
