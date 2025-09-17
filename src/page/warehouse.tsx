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
    message,
    Descriptions,
    Typography,
    Popconfirm
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

interface WarehouseData {
    key: string;
    id: string;
    name: string;
    location: string;
    type: string;
    manager: string;
    capacity: string;
    status: 'Active' | 'Inactive';
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    contactPerson?: string;
    contactPhone?: string;
    email?: string;
    operationalHours?: string;
    managerContact?: string;
}

const Warehouse = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingRecord, setViewingRecord] = useState<WarehouseData | null>(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const screens = useBreakpoint();
    const [data, setData] = useState<WarehouseData[]>([
        {
            key: '1',
            id: 'WH001',
            name: 'Main Distribution Center',
            location: 'Los Angeles, CA',
            type: 'Distribution',
            manager: 'Sarah Johnson',
            capacity: '50,000 sq ft',
            status: 'Active',
            address: '123 Main St',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001',
            contactPerson: 'Sarah Johnson',
            contactPhone: '(555) 123-4567',
            email: 'sarah@example.com',
            operationalHours: '08:00 - 18:00',
            managerContact: '(555) 123-4567'
        },
        {
            key: '2',
            id: 'WH002',
            name: 'North Regional Warehouse',
            location: 'San Francisco, CA',
            type: 'Storage',
            manager: 'Lisa Chen',
            capacity: '30,000 sq ft',
            status: 'Active',
            address: '456 Oak Ave',
            city: 'San Francisco',
            state: 'CA',
            zip: '94102',
            contactPerson: 'Lisa Chen',
            contactPhone: '(555) 987-6543',
            email: 'lisa@example.com',
            operationalHours: '07:00 - 17:00',
            managerContact: '(555) 987-6543'
        },
        {
            key: '3',
            id: 'WH003',
            name: 'Cold Storage Facility',
            location: 'San Diego, CA',
            type: 'Cold Storage',
            manager: 'Robert Kim',
            capacity: '15,000 sq ft',
            status: 'Inactive',
            address: '789 Harbor Dr',
            city: 'San Diego',
            state: 'CA',
            zip: '92101',
            contactPerson: 'Robert Kim',
            contactPhone: '(555) 456-7890',
            email: 'robert@example.com',
            operationalHours: '09:00 - 19:00',
            managerContact: '(555) 456-7890'
        },
    ]);

    const handleDelete = (record: WarehouseData) => {
        // Filter out the deleted item
        const newData = data.filter(item => item.key !== record.key);
        setData(newData);
        message.success('Warehouse deleted successfully');
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    
    const handleSubmit = () => {
        form.validateFields().then((values) => {
            console.log("Form Values:", values);
            // Generate a unique key for the new item
            const newKey = (data.length + 1).toString();
            
            // Add the new Warehouse to the data array
            const newWarehouse: WarehouseData = {
                key: newKey,
                id: `WH${String(data.length + 1).padStart(3, '0')}`,
                name: values.warehouseName,
                location: `${values.city}, ${values.state}`,
                type: values.warehouseType,
                manager: values.managerName,
                capacity: `${values.capacity} sq ft`,
                status: values.status,
                address: values.address,
                city: values.city,
                state: values.state,
                zip: values.zip,
                contactPerson: values.contactPerson,
                contactPhone: values.contactPhone,
                email: values.email,
                operationalHours: values.operationalHours,
                managerContact: values.managerContact
            };
            
            setData([...data, newWarehouse]);
            message.success('Warehouse created successfully!');
            setIsModalOpen(false);
            form.resetFields();
        }).catch((errorInfo) => {
            console.log('Validation Failed:', errorInfo);
        });
    };

    const handleViewClick = (record: WarehouseData) => {
        setViewingRecord(record);
        setIsViewEditModalOpen(true);
        setIsEditing(false);
        // Set form values with the record data
        editForm.setFieldsValue({
            id: record.id,
            name: record.name,
            location: record.location,
            type: record.type,
            manager: record.manager,
            capacity: record.capacity.replace(' sq ft', ''),
            status: record.status,
            address: record.address || '',
            city: record.city || '',
            state: record.state || '',
            zip: record.zip || '',
            contactPerson: record.contactPerson || '',
            contactPhone: record.contactPhone || '',
            email: record.email || '',
            operationalHours: record.operationalHours || '',
            managerContact: record.managerContact || '',
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
                id: viewingRecord.id,
                name: viewingRecord.name,
                location: viewingRecord.location,
                type: viewingRecord.type,
                manager: viewingRecord.manager,
                capacity: viewingRecord.capacity.replace(' sq ft', ''),
                status: viewingRecord.status,
                address: viewingRecord.address || '',
                city: viewingRecord.city || '',
                state: viewingRecord.state || '',
                zip: viewingRecord.zip || '',
                contactPerson: viewingRecord.contactPerson || '',
                contactPhone: viewingRecord.contactPhone || '',
                email: viewingRecord.email || '',
                operationalHours: viewingRecord.operationalHours || '',
                managerContact: viewingRecord.managerContact || '',
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
            
            // Update the data array with the edited values
            if (viewingRecord) {
                const updatedData = data.map(item => 
                    item.key === viewingRecord.key 
                        ? { 
                            ...item, 
                            ...values,
                            capacity: `${values.capacity} sq ft`,
                            location: `${values.city}, ${values.state}`
                        } 
                        : item
                );
                
                setData(updatedData);
                setViewingRecord({
                    ...viewingRecord, 
                    ...values,
                    capacity: `${values.capacity} sq ft`,
                    location: `${values.city}, ${values.state}`
                });
                message.success('Warehouse updated successfully!');
            }
            
            setIsEditing(false);
        }).catch((errorInfo) => {
            console.log('Validation Failed:', errorInfo);
        });
    };

    const columns: ColumnsType<WarehouseData> = [
        {
            title: 'Warehouse ID',
            dataIndex: 'id',
            key: 'id',
            responsive: ['xs', 'sm', 'md', 'lg'] as Breakpoint[],
            render: (text: string, record: WarehouseData) => (
                <a
                    onClick={() => handleViewClick(record)}
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                >
                    {text}
                </a>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Manager',
            dataIndex: 'manager',
            key: 'manager',
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            key: 'capacity',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: WarehouseData['status']) => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                   
                    <Popconfirm
                        title="Delete this Warehouse"
                        description="Are you sure you want to delete this warehouse?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const renderViewContent = () => {
        if (!viewingRecord) return null;
        
        return (
            <div style={{ overflowX: 'hidden' }}>
                <Descriptions 
                    column={screens.xs ? 1 : 2} 
                    bordered
                    size="small"
                >
                    <Descriptions.Item label="Warehouse ID">{viewingRecord.id}</Descriptions.Item>
                    <Descriptions.Item label="Warehouse Name">{viewingRecord.name}</Descriptions.Item>
                    <Descriptions.Item label="Location">{viewingRecord.location}</Descriptions.Item>
                    <Descriptions.Item label="Type">{viewingRecord.type}</Descriptions.Item>
                    <Descriptions.Item label="Manager">{viewingRecord.manager}</Descriptions.Item>
                    <Descriptions.Item label="Capacity">{viewingRecord.capacity}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={viewingRecord.status === "Active" ? "green" : "red"}>
                            {viewingRecord.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">{viewingRecord.address}</Descriptions.Item>
                    <Descriptions.Item label="City">{viewingRecord.city}</Descriptions.Item>
                    <Descriptions.Item label="State">{viewingRecord.state}</Descriptions.Item>
                    <Descriptions.Item label="ZIP">{viewingRecord.zip}</Descriptions.Item>
                    <Descriptions.Item label="Contact Person">{viewingRecord.contactPerson}</Descriptions.Item>
                    <Descriptions.Item label="Contact Phone">{viewingRecord.contactPhone}</Descriptions.Item>
                    <Descriptions.Item label="Email">{viewingRecord.email}</Descriptions.Item>
                    <Descriptions.Item label="Operational Hours">{viewingRecord.operationalHours}</Descriptions.Item>
                    <Descriptions.Item label="Manager Contact">{viewingRecord.managerContact}</Descriptions.Item>
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
                            label="Warehouse ID"
                            name="id"
                            rules={[{ required: true, message: "Warehouse ID is required" }]}
                        >
                            <Input placeholder="Warehouse ID" disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Warehouse Name"
                            name="name"
                            rules={[{ required: true, message: "Warehouse name is required" }]}
                        >
                            <Input placeholder="Enter warehouse name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Location"
                            name="location"
                            rules={[{ required: true, message: "Please enter location" }]}
                        >
                            <Input placeholder="Enter location" />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Warehouse Type"
                            name="type"
                            rules={[{ required: true, message: "Please select warehouse type" }]}
                        >
                            <Select placeholder="Select Type">
                                <Select.Option value="Distribution">Distribution Center</Select.Option>
                                <Select.Option value="Cold Storage">Cold Storage</Select.Option>
                                <Select.Option value="Storage">Storage</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Manager"
                            name="manager"
                            rules={[{ required: true, message: "Please enter manager" }]}
                        >
                            <Input placeholder="Enter manager name" />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Capacity (sq ft)"
                            name="capacity"
                            rules={[{ required: true, message: "Please enter capacity" }]}
                        >
                            <Input placeholder="Enter capacity" type="number" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Address"
                            name="address"
                        >
                            <Input placeholder="Enter address" />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="City"
                            name="city"
                        >
                            <Input placeholder="Enter city" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="State"
                            name="state"
                        >
                            <Input placeholder="Enter state" />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="ZIP Code"
                            name="zip"
                        >
                            <Input placeholder="Enter ZIP code" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Contact Person"
                            name="contactPerson"
                        >
                            <Input placeholder="Enter contact person" />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Contact Phone"
                            name="contactPhone"
                        >
                            <Input placeholder="Enter phone" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input placeholder="Enter email" />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Operational Hours"
                            name="operationalHours"
                        >
                            <Input placeholder="e.g., 08:00 - 18:00" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Manager Contact"
                            name="managerContact"
                        >
                            <Input placeholder="Enter manager contact" />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: "Please select status" }]}
                        >
                            <Select>
                                <Select.Option value="Active">Active</Select.Option>
                                <Select.Option value="Inactive">Inactive</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    };

    return (
        <div style={{ backgroundColor: '#f4f6fa', minHeight: '100vh', overflowX: 'hidden' }} className='warehouse-page'>
            {/* Header */}
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Warehouse</h1>
            </header>

            {/* Content */}
            <div style={{ padding: '4px', overflowX: 'hidden' }}>
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
                                    Warehouse Management
                                </p>
                                <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
                                    Manage your warehouse locations and operations
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
                                <PlusOutlined /> Add Warehouse
                            </Button>
                        </Col>
                    </Row>
                </Card>
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    {/* Search Input */}
                    <Col flex="auto">
                        <Input
                            prefix={<SearchOutlined style={{ color: "#B0B0B0", padding: '18px' }} />}
                            placeholder="Search warehouses by name, ID, or city..."
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
                <div style={{ marginTop: '32px', overflowX: 'hidden' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
                        Warehouses ({data.length})
                    </h2>
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={{ pageSize: 5 }}
                            bordered
                            scroll={{ x: 'max-content' }}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            </div>
            
            {/* Create Warehouse Modal */}
            <Modal
                title="Create New Warehouse"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCloseModal}
                okText="Save"
                cancelText="Cancel"
                width={screens.xs ? '95%' : 700}
                style={{ top: 20 }}
                bodyStyle={{ 
                    maxHeight: '70vh', 
                    overflowY: 'auto',
                    padding: '24px',
                    overflowX: 'hidden'
                }}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                getContainer={false}
                forceRender
            >
                <p style={{ marginBottom: 20, color: "#666" }}>
                    Fill in the details below to create a new warehouse location.
                </p>

                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Warehouse ID"
                                name="warehouseId"
                            >
                                <Input placeholder="Auto-generated" disabled />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Warehouse Name"
                                name="warehouseName"
                                rules={[{ required: true, message: "Warehouse name is required" }]}
                            >
                                <Input placeholder="Enter warehouse name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Warehouse Type"
                                name="warehouseType"
                                rules={[{ required: true, message: "Please select warehouse type" }]}
                            >
                                <Select placeholder="Select Type">
                                    <Select.Option value="Distribution">Distribution Center</Select.Option>
                                    <Select.Option value="Cold Storage">Cold Storage</Select.Option>
                                    <Select.Option value="Storage">Storage</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Capacity (sq ft)"
                                name="capacity"
                                rules={[{ required: true, message: "Please enter capacity" }]}
                            >
                                <Input placeholder="Enter capacity" type="number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Address Fields */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: "Please enter address" }]}
                            >
                                <Input placeholder="Enter address" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="City"
                                name="city"
                                rules={[{ required: true, message: "Please enter city" }]}
                            >
                                <Input placeholder="Enter city" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="State"
                                name="state"
                                rules={[{ required: true, message: "Please enter state" }]}
                            >
                                <Input placeholder="Enter state" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="ZIP Code"
                                name="zip"
                                rules={[{ required: true, message: "Please enter zip code" }]}
                            >
                                <Input placeholder="Enter ZIP code" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Contact Info */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Contact Person"
                                name="contactPerson"
                                rules={[{ required: true, message: "Please enter contact person" }]}
                            >
                                <Input placeholder="Enter contact person" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Contact Phone"
                                name="contactPhone"
                                rules={[{ required: true, message: "Please enter phone" }]}
                            >
                                <Input placeholder="Enter phone" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Please enter email" },
                                    { type: "email", message: "Enter a valid email" },
                                ]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Operational Hours"
                                name="operationalHours"
                                rules={[{ required: true, message: "Please enter operational hours" }]}
                            >
                                <Input placeholder="e.g., 08:00 - 18:00" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Manager Info */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Manager Name"
                                name="managerName"
                                rules={[{ required: true, message: "Please enter manager name" }]}
                            >
                                <Input placeholder="Enter manager name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item 
                                label="Manager Contact" 
                                name="managerContact"
                                rules={[{ required: true, message: "Please enter manager contact" }]}
                            >
                                <Input placeholder="Enter manager contact" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Status */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item 
                                label="Status" 
                                name="status" 
                                initialValue="Active"
                                rules={[{ required: true, message: "Please select status" }]}
                            >
                                <Select>
                                    <Select.Option value="Active">Active</Select.Option>
                                    <Select.Option value="Inactive">Inactive</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            
            {/* View/Edit Warehouse Modal */}
            <Modal
                title={
                    isEditing 
                        ? `Edit Warehouse: ${viewingRecord?.name || ''}` 
                        : `View Warehouse: ${viewingRecord?.name || ''}`
                }
                open={isViewEditModalOpen}
                onOk={isEditing ? handleEditSubmit : handleCloseViewEditModal}
                onCancel={handleCloseViewEditModal}
                okText={isEditing ? "Update" : "Close"}
                cancelText={isEditing ? "Cancel Edit" : "Cancel"}
                width={screens.xs ? '95%' : 700}
                style={{ top: 20 }}
                bodyStyle={{ 
                    maxHeight: '70vh', 
                    overflowY: 'auto',
                    padding: '24px',
                    overflowX: 'hidden'
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

export default Warehouse;