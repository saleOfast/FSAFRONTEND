import { ArrowLeftOutlined, PlusOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Row,
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
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import { SearchOutlined } from "@ant-design/icons";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import '../style/stores.css';
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
    const [gridView, setGridView] = useState(false);
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
        {
            storeId: "STR002",
            storeName: "Super Store",
            customerId: "CUST1002",
            location: {
                address: "456 Park Avenue",
                city: "Delhi",
                state: "Delhi",
                zip: "110001",
            },
            contactPerson: "Priya Sharma",
            contactPhone: "+91-9876543211",
            email: "priya@superstore.com",
            capacity: 750,
            storeType: "Retail",
            operationalHours: "8:00 AM - 9:00 PM",
            managerName: "Rajesh Singh",
            managerContact: "+91-9123456790",
            status: "Active",
            createdDate: "2025-01-05T11:00:00Z",
            lastUpdatedDate: "2025-08-21T16:00:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },
        {
            storeId: "STR003",
            storeName: "Mega Mall",
            customerId: "CUST1003",
            location: {
                address: "789 MG Road",
                city: "Bangalore",
                state: "Karnataka",
                zip: "560001",
            },
            contactPerson: "Anil Kumar",
            contactPhone: "+91-9876543212",
            email: "anil@megamall.com",
            capacity: 1000,
            storeType: "Warehouse",
            operationalHours: "7:00 AM - 11:00 PM",
            managerName: "Suresh Reddy",
            managerContact: "+91-9123456791",
            status: "Active",
            createdDate: "2025-01-10T09:30:00Z",
            lastUpdatedDate: "2025-08-22T14:30:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },
        {
            storeId: "STR004",
            storeName: "City Center",
            customerId: "CUST1004",
            location: {
                address: "321 Commercial Street",
                city: "Chennai",
                state: "Tamil Nadu",
                zip: "600001",
            },
            contactPerson: "Lakshmi Iyer",
            contactPhone: "+91-9876543213",
            email: "lakshmi@citycenter.com",
            capacity: 600,
            storeType: "Retail",
            operationalHours: "9:00 AM - 10:00 PM",
            managerName: "Venkat Raman",
            managerContact: "+91-9123456792",
            status: "Active",
            createdDate: "2025-01-15T10:00:00Z",
            lastUpdatedDate: "2025-08-23T15:00:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },
        {
            storeId: "STR005",
            storeName: "Express Store",
            customerId: "CUST1005",
            location: {
                address: "654 High Street",
                city: "Pune",
                state: "Maharashtra",
                zip: "411001",
            },
            contactPerson: "Vikram Patil",
            contactPhone: "+91-9876543214",
            email: "vikram@expressstore.com",
            capacity: 400,
            storeType: "Retail",
            operationalHours: "8:00 AM - 9:00 PM",
            managerName: "Sandeep Desai",
            managerContact: "+91-9123456793",
            status: "Active",
            createdDate: "2025-01-20T11:30:00Z",
            lastUpdatedDate: "2025-08-24T16:30:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },
        {
            storeId: "STR006",
            storeName: "Prime Retail",
            customerId: "CUST1006",
            location: {
                address: "987 Market Road",
                city: "Hyderabad",
                state: "Telangana",
                zip: "500001",
            },
            contactPerson: "Kiran Reddy",
            contactPhone: "+91-9876543215",
            email: "kiran@primeretail.com",
            capacity: 850,
            storeType: "Franchise",
            operationalHours: "9:00 AM - 10:00 PM",
            managerName: "Ravi Kumar",
            managerContact: "+91-9123456794",
            status: "Active",
            createdDate: "2025-01-25T12:00:00Z",
            lastUpdatedDate: "2025-08-25T17:00:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },
        {
            storeId: "STR007",
            storeName: "Quick Mart",
            customerId: "CUST1007",
            location: {
                address: "147 Station Road",
                city: "Kolkata",
                state: "West Bengal",
                zip: "700001",
            },
            contactPerson: "Soumitra Das",
            contactPhone: "+91-9876543216",
            email: "soumitra@quickmart.com",
            capacity: 350,
            storeType: "Retail",
            operationalHours: "7:00 AM - 10:00 PM",
            managerName: "Amitava Banerjee",
            managerContact: "+91-9123456795",
            status: "Active",
            createdDate: "2025-02-01T10:15:00Z",
            lastUpdatedDate: "2025-08-26T15:15:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },
        {
            storeId: "STR008",
            storeName: "Global Store",
            customerId: "CUST1008",
            location: {
                address: "258 Business Park",
                city: "Ahmedabad",
                state: "Gujarat",
                zip: "380001",
            },
            contactPerson: "Harsh Shah",
            contactPhone: "+91-9876543217",
            email: "harsh@globalstore.com",
            capacity: 900,
            storeType: "Warehouse",
            operationalHours: "8:00 AM - 8:00 PM",
            managerName: "Jayesh Patel",
            managerContact: "+91-9123456796",
            status: "Active",
            createdDate: "2025-02-05T09:45:00Z",
            lastUpdatedDate: "2025-08-27T14:45:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },
        {
            storeId: "STR009",
            storeName: "Metro Store",
            customerId: "CUST1009",
            location: {
                address: "369 Mall Road",
                city: "Jaipur",
                state: "Rajasthan",
                zip: "302001",
            },
            contactPerson: "Arjun Meena",
            contactPhone: "+91-9876543218",
            email: "arjun@metrostore.com",
            capacity: 650,
            storeType: "Retail",
            operationalHours: "9:00 AM - 9:00 PM",
            managerName: "Vikram Rathore",
            managerContact: "+91-9123456797",
            status: "Active",
            createdDate: "2025-02-10T11:00:00Z",
            lastUpdatedDate: "2025-08-28T16:00:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },
        {
            storeId: "STR010",
            storeName: "Elite Store",
            customerId: "CUST1010",
            location: {
                address: "741 Premium Plaza",
                city: "Chandigarh",
                state: "Punjab",
                zip: "160001",
            },
            contactPerson: "Manpreet Singh",
            contactPhone: "+91-9876543219",
            email: "manpreet@elitestore.com",
            capacity: 550,
            storeType: "Franchise",
            operationalHours: "10:00 AM - 10:00 PM",
            managerName: "Gurpreet Kaur",
            managerContact: "+91-9123456798",
            status: "Active",
            createdDate: "2025-02-15T10:30:00Z",
            lastUpdatedDate: "2025-08-29T15:30:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },
        {
            storeId: "STR011",
            storeName: "Value Store",
            customerId: "CUST1011",
            location: {
                address: "852 Trade Center",
                city: "Lucknow",
                state: "Uttar Pradesh",
                zip: "226001",
            },
            contactPerson: "Amit Verma",
            contactPhone: "+91-9876543220",
            email: "amit@valuestore.com",
            capacity: 700,
            storeType: "Retail",
            operationalHours: "8:00 AM - 9:00 PM",
            managerName: "Rohit Tiwari",
            managerContact: "+91-9123456799",
            status: "Active",
            createdDate: "2025-02-20T12:15:00Z",
            lastUpdatedDate: "2025-08-30T17:15:00Z",
            createdBy: "System Admin",
            lastModifiedBy: "Store Manager",
        },
    ]);

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

    const handleGridView = () => {
        setGridView(true);
    };

    const handleListView = () => {
        setGridView(false);
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
        <div style={{ fontFamily: 'roboto' }}>
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
                        boxShadow: 'none',
                        border: 'none',
                        backgroundColor: 'transparent',
                        marginLeft: '10px',
                    }}
                    bodyStyle={{
                        padding: '4px',
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


                <div className="search">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search Store by Name, Category, Id"
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
                    <div className="filterdiv">
                        <Select
                            defaultValue="all"
                            className="w-130"
                        >
                            <Option value="all">All Status</Option>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                            <Option value="archived">Archived</Option>
                        </Select>
                    </div>
                </div>

                {/* Grid/List View Section */}
                {gridView ? (
                    <div
                        className="content"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "20px",
                            // marginTop: "24px",
                            marginBottom: "10px",
                        }}
                    >
                        {data && data.length > 0 && data.map((item, index) => {
                            return (
                                <div key={index}>
                                    <div 
                                        className="store-list"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleViewClick(item)}
                                    >
                                        <div className="shoptitle">
                                            <div className="fontb">{item?.storeName}</div>
                                        </div>
                                        <div className="storeConlist">
                                            <div>
                                                <div className="storeIdTxt">
                                                    {item?.storeType} | store ID: {item?.storeId}
                                                </div>
                                                <div className="flexSpace storeAddTxt">
                                                    <span>
                                                        {item?.location?.address}, {item?.location?.city}, {item?.location?.state}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <>
                       
                        <table className="store-table1" style={{ textDecoration: 'none', fontSize: '13px' }}>
                            <thead>
                                <tr>
                                    <th>StoreId</th>
                                    <th>Store Name</th>
                                    <th>Address</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Zip</th>
                                    <th>Contact Person</th>
                                    <th>Contact Phone</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <a
                                                onClick={() => handleViewClick(item)}
                                                style={{ textDecoration: 'none', color: '#1890ff', cursor: 'pointer' }}
                                            >
                                                {item?.storeId}
                                            </a>
                                        </td>
                                        <td>{item?.storeName}</td>
                                        <td>{item?.location?.address}</td>
                                        <td>{item?.location?.city}</td>
                                        <td>{item?.location?.state}</td>
                                        <td>{item?.location?.zip}</td>
                                        <td>{item?.contactPerson}</td>
                                        <td>{item?.contactPhone}</td>
                                        <td>
                                            <Popconfirm
                                                title="Delete Store"
                                                description="Are you sure you want to delete this store?"
                                                onConfirm={() => handleDelete(item.storeId)}
                                                okText="Yes"
                                                cancelText="No"
                                                okType="danger"
                                            >
                                                <Button
                                                    type="link"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    title="Delete Store"
                                                    style={{ padding: 0 }}
                                                >
                                                </Button>
                                            </Popconfirm>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

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
                    paddingRight: '8px',
                    overflowY: 'auto'
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
                    paddingRight: '8px',
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
                    </Button>
                ]}
            >
                {isEditing ? renderEditForm() : renderViewContent()}
            </Modal>
        </div>
    );
};

export default Storeinfo;