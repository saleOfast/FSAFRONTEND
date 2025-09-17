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
    Modal,
    Descriptions,
    Typography,
    Popconfirm,
    message
} from 'antd';
import React, { useState } from 'react';
import previousPage from 'utils/previousPage';
import type { ColumnsType } from 'antd/es/table';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import { SearchOutlined } from "@ant-design/icons";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Text } = Typography;

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingRecord, setViewingRecord] = useState<Store | null>(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const screens = useBreakpoint();
    const [data, setData] = useState<Store[]>([
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
    ]);

    const columns = [
        {
            title: "StoreId ",
            dataIndex: "storeId",
            key: "storeId",
            render: (text: string, record: Store) => (
                <a
                    onClick={() => handleViewClick(record)}
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                >
                    {text}
                </a>
            ),
        },
        {
            title: "Store Name",
            dataIndex: "storeName",
            key: "storeName",
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
            title: "Action",
            key: "action",
            render: (_: unknown, record: Store) => (
                <Space size="middle">
                    <Popconfirm
                        title="Delete Store"
                        description="Are you sure you want to delete this store?"
                        onConfirm={() => handleDelete(record.storeId)}
                        okText="Yes"
                        cancelText="No"
                        okType="danger"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            title="Delete Store"
                        >
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleViewClick = (record: Store) => {
        setViewingRecord(record);
        setIsViewEditModalOpen(true);
        setIsEditing(false);
        // Set form values with the record data
        editForm.setFieldsValue({
            ...record,
            address: record.location.address,
            city: record.location.city,
            state: record.location.state,
            zip: record.location.zip,
        });
    };

    const handleEditClickDirectly = (record: Store) => {
        setViewingRecord(record);
        setIsViewEditModalOpen(true);
        setIsEditing(true);
        // Set form values with the record data
        editForm.setFieldsValue({
            ...record,
            address: record.location.address,
            city: record.location.city,
            state: record.location.state,
            zip: record.location.zip,
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form to original values
        if (viewingRecord) {
            editForm.setFieldsValue({
                ...viewingRecord,
                address: viewingRecord.location.address,
                city: viewingRecord.location.city,
                state: viewingRecord.location.state,
                zip: viewingRecord.location.zip,
            });
        }
    };

    const handleCloseViewEditModal = () => {
        setIsViewEditModalOpen(false);
        setViewingRecord(null);
        setIsEditing(false);
        editForm.resetFields();
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            console.log("Form Values:", values);
            // Add the new store to data
            const newStore: Store = {
                storeId: `STR${String(data.length + 1).padStart(3, '0')}`,
                storeName: values.storeName,
                customerId: values.customerId,
                location: {
                    address: values.address,
                    city: values.city,
                    state: values.state,
                    zip: values.zip,
                },
                contactPerson: values.contactPerson,
                contactPhone: values.contactPhone,
                email: values.email,
                capacity: values.capacity,
                storeType: values.storeType,
                operationalHours: values.operationalHours,
                managerName: values.managerName,
                managerContact: values.managerContact,
                status: values.status,
                createdDate: new Date().toISOString(),
                lastUpdatedDate: new Date().toISOString(),
                createdBy: "Current User", // Replace with actual user
                lastModifiedBy: "Current User", // Replace with actual user
            };

            setData([...data, newStore]);
            message.success('Store added successfully!');
            setIsModalOpen(false);
            form.resetFields();
        });
    };

    const handleEditSubmit = () => {
        editForm.validateFields().then((values) => {
            console.log("Updated Values:", values);

            // Update the data with edited values
            const updatedData = data.map(item => {
                if (item.storeId === viewingRecord?.storeId) {
                    return {
                        ...item,
                        ...values,
                        location: {
                            address: values.address,
                            city: values.city,
                            state: values.state,
                            zip: values.zip,
                        },
                        lastUpdatedDate: new Date().toISOString(),
                        lastModifiedBy: "Current User", // Replace with actual user
                    };
                }
                return item;
            });

            setData(updatedData);
            message.success('Store updated successfully!');
            setIsEditing(false);

            // Update the viewing record with new values
            if (viewingRecord) {
                setViewingRecord({
                    ...viewingRecord,
                    ...values,
                    location: {
                        address: values.address,
                        city: values.city,
                        state: values.state,
                        zip: values.zip,
                    },
                    lastUpdatedDate: new Date().toISOString(),
                    lastModifiedBy: "Current User",
                });
            }
        });
    };

    const handleDelete = (storeId: string) => {
        // Filter out the store to be deleted
        const updatedData = data.filter(item => item.storeId !== storeId);
        setData(updatedData);
        message.success('Store deleted successfully!');

        // If we're currently viewing the store being deleted, close the modal
        if (viewingRecord && viewingRecord.storeId === storeId) {
            handleCloseViewEditModal();
        }
    };

    const renderViewContent = () => {
        if (!viewingRecord) return null;

        return (
            <div style={{ overflowX: 'auto' }}>
                <Descriptions
                    column={screens.xs ? 1 : 2}
                    bordered
                    size="small"
                >
                    <Descriptions.Item label="Store ID">{viewingRecord.storeId}</Descriptions.Item>
                    <Descriptions.Item label="Store Name">{viewingRecord.storeName}</Descriptions.Item>
                    <Descriptions.Item label="Customer ID">{viewingRecord.customerId}</Descriptions.Item>
                    <Descriptions.Item label="Address">{viewingRecord.location.address}</Descriptions.Item>
                    <Descriptions.Item label="City">{viewingRecord.location.city}</Descriptions.Item>
                    <Descriptions.Item label="State">{viewingRecord.location.state}</Descriptions.Item>
                    <Descriptions.Item label="Zip">{viewingRecord.location.zip}</Descriptions.Item>
                    <Descriptions.Item label="Contact Person">{viewingRecord.contactPerson}</Descriptions.Item>
                    <Descriptions.Item label="Contact Phone">{viewingRecord.contactPhone}</Descriptions.Item>
                    <Descriptions.Item label="Email">{viewingRecord.email}</Descriptions.Item>
                    <Descriptions.Item label="Capacity">{viewingRecord.capacity}</Descriptions.Item>
                    <Descriptions.Item label="Store Type">{viewingRecord.storeType}</Descriptions.Item>
                    <Descriptions.Item label="Operational Hours">{viewingRecord.operationalHours}</Descriptions.Item>
                    <Descriptions.Item label="Manager Name">{viewingRecord.managerName}</Descriptions.Item>
                    <Descriptions.Item label="Manager Contact">{viewingRecord.managerContact}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={viewingRecord.status === "Active" ? "green" : "default"}>
                            {viewingRecord.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created Date">{viewingRecord.createdDate}</Descriptions.Item>
                    <Descriptions.Item label="Last Updated Date">{viewingRecord.lastUpdatedDate}</Descriptions.Item>
                    <Descriptions.Item label="Created By">{viewingRecord.createdBy}</Descriptions.Item>
                    <Descriptions.Item label="Last Modified By">{viewingRecord.lastModifiedBy}</Descriptions.Item>
                </Descriptions>
            </div>
        );
    };

    const renderEditForm = () => {
        return (
            <Form layout="vertical" form={editForm}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Store ID"
                            name="storeId"
                            rules={[{ required: true, message: "Store ID is required" }]}
                        >
                            <Input placeholder="Enter Store ID" disabled />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Store Name"
                            name="storeName"
                            rules={[{ required: true, message: "Store Name is required" }]}
                        >
                            <Input placeholder="Enter Store Name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Customer ID"
                            name="customerId"
                        >
                            <Input placeholder="Enter Customer ID" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: "Address is required" }]}
                        >
                            <Input placeholder="Enter Address" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: "City is required" }]}
                        >
                            <Input placeholder="Enter City" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="State"
                            name="state"
                            rules={[{ required: true, message: "State is required" }]}
                        >
                            <Input placeholder="Enter State" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Zip"
                            name="zip"
                            rules={[{ required: true, message: "Zip code is required" }]}
                        >
                            <Input placeholder="Enter Zip" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Contact Person"
                            name="contactPerson"
                            rules={[{ required: true, message: "Contact person is required" }]}
                        >
                            <Input placeholder="Enter Contact Person" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Contact Phone"
                            name="contactPhone"
                            rules={[{ required: true, message: "Contact phone is required" }]}
                        >
                            <Input placeholder="Enter Contact Phone" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Email is required" },
                                { type: 'email', message: "Please enter a valid email" }
                            ]}
                        >
                            <Input placeholder="Enter Email" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Capacity"
                            name="capacity"
                            rules={[{ required: true, message: "Capacity is required" }]}
                        >
                            <Input type="number" placeholder="Enter Capacity" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Store Type"
                            name="storeType"
                            rules={[{ required: true, message: "Store type is required" }]}
                        >
                            <Select placeholder="Select Store Type">
                                <Option value="Retail">Retail</Option>
                                <Option value="Warehouse">Warehouse</Option>
                                <Option value="Franchise">Franchise</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Operational Hours"
                            name="operationalHours"
                            rules={[{ required: true, message: "Operational hours are required" }]}
                        >
                            <Input placeholder="Enter Operational Hours" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Manager Name"
                            name="managerName"
                        >
                            <Input placeholder="Enter Manager Name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Manager Contact"
                            name="managerContact"
                        >
                            <Input placeholder="Enter Manager Contact" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: "Status is required" }]}
                        >
                            <Select placeholder="Select Status">
                                <Option value="Active">Active</Option>
                                <Option value="Inactive">Inactive</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    };

    return (
        <div style={{ backgroundColor: '#f4f6fa', minHeight: '100vh', overflowX: 'hidden' }}>
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
                                onClick={handleOpenModal}
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
                            style={{ width: '100%' }}
                        />
                    </Col>

                    {/* Status Filter */}
                    <Col>
                        <Select
                            defaultValue="all"
                            size="large"
                            style={{ width: '100%', minWidth: 150, height: '50px' }}
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
                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <Table<Store>
                        columns={columns}
                        dataSource={data}
                        pagination={{ pageSize: 5 }}
                        bordered
                        scroll={{ x: 'max-content' }}
                        style={{ width: '100%' }}
                    />
                </div>

            </div>

            {/* Add New Store Modal */}
            <Modal
                title="Create New Store"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCloseModal}
                okText="Save"
                cancelText="Cancel"
                width={900}
                style={{ top: 20 }}
                bodyStyle={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    paddingRight: '8px'
                }}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                getContainer={false}
                forceRender
            >
                <p style={{ marginBottom: 20, color: "#666" }}>
                    Fill in the details below to create a new Store location.
                </p>

                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Store Name"
                                name="storeName"
                                rules={[{ required: true, message: "Store name is required" }]}
                            >
                                <Input placeholder="Enter Store Name" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Customer ID"
                                name="customerId"
                                rules={[{ required: true, message: "Customer ID is required" }]}
                            >
                                <Input placeholder="Enter Customer ID" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: "Address is required" }]}
                            >
                                <Input placeholder="Enter Address" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="City"
                                name="city"
                                rules={[{ required: true, message: "City is required" }]}
                            >
                                <Input placeholder="Enter City" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="State"
                                name="state"
                                rules={[{ required: true, message: "State is required" }]}
                            >
                                <Input placeholder="Enter State" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Zip"
                                name="zip"
                                rules={[{ required: true, message: "Zip code is required" }]}
                            >
                                <Input placeholder="Enter Zip" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Contact Person"
                                name="contactPerson"
                                rules={[{ required: true, message: "Contact person is required" }]}
                            >
                                <Input placeholder="Enter Contact Person" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Contact Phone"
                                name="contactPhone"
                                rules={[{ required: true, message: "Contact phone is required" }]}
                            >
                                <Input placeholder="Enter Contact Phone" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Email is required" },
                                    { type: 'email', message: "Please enter a valid email" }
                                ]}
                            >
                                <Input placeholder="Enter Email" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Capacity"
                                name="capacity"
                                rules={[{ required: true, message: "Capacity is required" }]}
                            >
                                <Input type="number" placeholder="Enter Capacity" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Store Type"
                                name="storeType"
                                rules={[{ required: true, message: "Store type is required" }]}
                            >
                                <Select placeholder="Select Store Type">
                                    <Option value="Retail">Retail</Option>
                                    <Option value="Warehouse">Warehouse</Option>
                                    <Option value="Franchise">Franchise</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Operational Hours"
                                name="operationalHours"
                                rules={[{ required: true, message: "Operational hours are required" }]}
                            >
                                <Input placeholder="Enter Operational Hours" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Manager Name"
                                name="managerName"
                            >
                                <Input placeholder="Enter Manager Name" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Manager Contact"
                                name="managerContact"
                            >
                                <Input placeholder="Enter Manager Contact" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name="status"
                                rules={[{ required: true, message: "Status is required" }]}
                            >
                                <Select placeholder="Select Status">
                                    <Option value="Active">Active</Option>
                                    <Option value="Inactive">Inactive</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* View/Edit Store Modal */}
            <Modal
                title={
                    isEditing
                        ? `Edit Store - ${viewingRecord?.storeId || ''}`
                        : `View Store - ${viewingRecord?.storeId || ''}`
                }
                open={isViewEditModalOpen}
                onOk={isEditing ? handleEditSubmit : handleCloseViewEditModal}
                onCancel={handleCloseViewEditModal}
                okText={isEditing ? "Save" : "Close"}
                cancelText={isEditing ? "Cancel Edit" : "Cancel"}
                width={screens.xs ? '95%' : 900}
                style={{ top: 20 }}
                bodyStyle={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    paddingRight: '8px'
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
                    </Button>
                ]}
            >
                {isEditing ? renderEditForm() : renderViewContent()}
            </Modal>
        </div>
    );
};

export default Storeinfo;