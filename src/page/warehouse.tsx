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

interface WarehouseData {
    key: string;
    id: string;
    name: string;
    location: string;
    type: string;
    manager: string;
    capacity: string;
    status: 'Active' | 'Inactive';
}

const Warehouse = () => {
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
    const columns: ColumnsType<WarehouseData> = [
        {
            title: 'Warehouse ID',
            dataIndex: 'id',
            key: 'id',
            responsive: ['xs', 'sm', 'md', 'lg'] as Breakpoint[],
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
            render: () => (
                <Space>
                    <Button type="link" icon={<EyeOutlined />} />
                    <Button type="link" icon={<EditOutlined />} />
                    <Button type="link" danger icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    const data: WarehouseData[] = [
        {
            key: '1',
            id: 'WH001',
            name: 'Main Distribution Center',
            location: 'Los Angeles, CA',
            type: 'Distribution',
            manager: 'Sarah Johnson',
            capacity: '50,000 sq ft',
            status: 'Active',
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
        },
        {
            key: '4',
            id: 'WH003',
            name: 'Cold Storage Facility',
            location: 'San Diego, CA',
            type: 'Cold Storage',
            manager: 'Robert Kim',
            capacity: '15,000 sq ft',
            status: 'Inactive',
        },
        {
            key: '5',
            id: 'WH003',
            name: 'Cold Storage Facility',
            location: 'San Diego, CA',
            type: 'Cold Storage',
            manager: 'Robert Kim',
            capacity: '15,000 sq ft',
            status: 'Inactive',
        },
    ];

    return (
        <div style={{ backgroundColor: '#f4f6fa', minHeight: '100vh' }}>
            {/* Header */}
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Warehouse</h1>
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
                                onClick={handleOpenModal}   // <-- add this line
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
                <div style={{ marginTop: '32px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
                        Warehouses ({data.length})
                    </h2>
                    <div style={{ overflowX: 'auto' }}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={{ pageSize: 5 }}
                            bordered
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                </div>
            </div>
            <Modal
                title="Create New Warehouse"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCloseModal}
                okText="Save"
                cancelText="Cancel"
                width={900} // wider modal for big form
            >
                <p style={{ marginBottom: 20, color: "#666" }}>
                    Fill in the details below to create a new warehouse location.
                </p>

                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Warehouse ID"
                                name="warehouseId"
                                rules={[{ required: true, message: "Warehouse ID is required" }]}
                            >
                                <Input placeholder="Auto-generated or enter ID" disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
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
                        <Col span={12}>
                            <Form.Item
                                label="Warehouse Type"
                                name="warehouseType"
                                rules={[{ required: true, message: "Please select warehouse type" }]}
                            >
                                <Select placeholder="Select Type">
                                    <Select.Option value="distribution">Distribution Center</Select.Option>
                                    <Select.Option value="cold">Cold Storage</Select.Option>
                                    <Select.Option value="storage">Storage</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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
                        <Col span={12}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: "Please enter address" }]}
                            >
                                <Input placeholder="Enter address" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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
                        <Col span={12}>
                            <Form.Item
                                label="State"
                                name="state"
                                rules={[{ required: true, message: "Please enter state" }]}
                            >
                                <Input placeholder="Enter state" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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
                        <Col span={12}>
                            <Form.Item
                                label="Contact Person"
                                name="contactPerson"
                                rules={[{ required: true, message: "Please enter contact person" }]}
                            >
                                <Input placeholder="Enter contact person" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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
                        <Col span={12}>
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
                        <Col span={12}>
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
                        <Col span={12}>
                            <Form.Item
                                label="Manager Name"
                                name="managerName"
                                rules={[{ required: true, message: "Please enter manager name" }]}
                            >
                                <Input placeholder="Enter manager name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Manager Contact" name="managerContact">
                                <Input placeholder="Enter manager contact" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Status */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Status" name="status" initialValue="active">
                                <Select>
                                    <Select.Option value="active">Active</Select.Option>
                                    <Select.Option value="inactive">Inactive</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Auto-filled system fields */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Created Date" name="createdDate">
                                <Input disabled value={new Date().toLocaleDateString()} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Last Updated Date" name="lastUpdatedDate">
                                <Input disabled value={new Date().toLocaleDateString()} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Created By" name="createdBy">
                                <Input disabled value="Current User" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Last Modified By" name="lastModifiedBy">
                                <Input disabled value="Current User" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </div>
    );
};

export default Warehouse;
