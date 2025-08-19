import { ArrowLeftOutlined, PlusOutlined, DollarOutlined, AppstoreOutlined, WarningOutlined, ArrowUpOutlined } from '@ant-design/icons';
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
    Reorder: string;
    Cost: string;
    status: 'Active' | 'Inactive';
}

const InventoryDashboard = () => {
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
            title: 'Product ID',
            dataIndex: 'id',
            key: 'id',
            responsive: ['xs', 'sm', 'md', 'lg'] as Breakpoint[],
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Batch Number',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Warehouse',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'On Hand',
            dataIndex: 'manager',
            key: 'manager',
        },
        {
            title: 'Available',
            dataIndex: 'capacity',
            key: 'capacity',
        },
        {
            title: 'Reorder Level',
            dataIndex: 'Reorder',
            key: 'Reorder',
        },
        {
            title: 'Cost Price',
            dataIndex: 'Cost',
            key: 'Cost',
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
            id: 'PRD001',
            name: 'Premium Coffee Beans',
            location: 'BCH-2025-001',
            type: 'Main Distribution Center',
            manager: '500KG',
            capacity: '400KG',
            Reorder: '100KG',
            Cost: '$25.50',
            status: 'Active',
        },
        {
            key: '2',
            id: 'PRD002',
            name: 'Organic Green Tea Leaves',
            location: 'BCH-2025-002',
            type: 'North Regional Warehouse',
            manager: '75KG',
            capacity: '50KG',
            Reorder: '200KG',
            Cost: '$18.75',
            status: 'Active',
        },
        {
            key: '3',
            id: 'PRD003',
            name: 'Specialty Chocolate',
            location: 'BCH-2025-003',
            type: 'Cold Storage Facility',
            manager: '30 BOX',
            capacity: '20 BOX',
            Reorder: '50 BOX',
            Cost: '$45.00',
            status: 'Inactive',
        },
        {
            key: '4',
            id: 'PRD004',
            name: 'Herbal Supplements',
            location: 'BCH-2025-004',
            type: 'Regional Warehouse',
            manager: '1000 BOTTLES',
            capacity: '800 BOTTLES',
            Reorder: '200 BOTTLES',
            Cost: '$12.00',
            status: 'Inactive',
        },
        {
            key: '5',
            id: 'PRD005',
            name: 'Frozen Fruits',
            location: 'BCH-2025-005',
            type: 'Cold Storage Facility',
            manager: '50 BOX',
            capacity: '100 BOX',
            Reorder: '20 BOX',
            Cost: '$30.00',
            status: 'Inactive',
        },
    ];

    return (
        <div style={{ backgroundColor: '#fefefe', minHeight: '100vh' }}>
            {/* Header */}
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Inventory</h1>
            </header>

            {/* Content */}
            <div style={{ padding: '4px' }}>
                {/* Top Card */}
                <Card
                    style={{
                        borderRadius: 12,
                        // boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
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
                                        fontSize: '27px',
                                        marginBottom: '6px',
                                        color: '#2c3e50',
                                    }}
                                >
                                    Inventory Management
                                </p>
                                <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
                                    Manage your inventory across all warehouses
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
                                    width: screens.xs ? '100%' : '200px',
                                    height: '48px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    background: '#6164A5',
                                    borderColor: '#4B6CB7',
                                }}
                                onClick={handleOpenModal}   // <-- add this line
                            >
                                <PlusOutlined /> Add Inventory Item
                            </Button>
                        </Col>
                    </Row>
                </Card>
                <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card
                            bordered={false}
                            style={{ textAlign: "left", border: "1px solid #c7bdbdff" }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "14px",
                                    color: "#555",
                                    fontWeight: "600",
                                }}
                            >
                                Total Items
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <p style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>3</p>
                                <AppstoreOutlined style={{ color: "#1677ff", marginBottom: "20px", fontSize: 22 }} />
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            bordered={false}
                            style={{ textAlign: "left", border: "1px solid #c7bdbdff" }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "14px",
                                    color: "#555",
                                    fontWeight: "600",
                                }}
                            >
                                Low Stock Items
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "24px",
                                        fontWeight: "700",
                                        color: "red",
                                    }}
                                >
                                    2
                                </p>
                                <WarningOutlined style={{ color: "red", marginBottom: "20px", fontSize: 22 }} />
                            </div>
                        </Card>
                    </Col>


                    <Col xs={24} sm={12} md={6}>
                        <Card
                            bordered={false}
                            style={{ textAlign: "left", border: "1px solid #c7bdbdff" }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "14px",
                                    color: "#555",
                                    fontWeight: "600",
                                }}
                            >
                                Active Items
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "24px",
                                        fontWeight: "700",
                                        color: "green",
                                    }}
                                >
                                    2
                                </p>
                                <ArrowUpOutlined style={{ color: "green", marginBottom: "20px", fontSize: 22 }} />
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            bordered={false}
                            style={{ textAlign: "left", border: "1px solid #c7bdbdff" }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "14px",
                                    color: "#555",
                                    fontWeight: "600",
                                }}
                            >
                                Total Value
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "24px",
                                        fontWeight: "700",
                                    }}
                                >
                                    $14K
                                </p>
                                <DollarOutlined style={{ color: "#1677ff", marginBottom: "20px", fontSize: 22 }} />
                            </div>
                        </Card>
                    </Col>

                </Row>

                {/* Low Stock Alert Section */}
                <Card
                    style={{
                        backgroundColor: "#fff5f5",
                        border: "1px solid #fa6f6fff",
                        marginBottom: 24,
                    }}
                    bodyStyle={{ padding: 16 }}
                ><p
                    style={{
                        fontWeight: "800",
                        color: "#bd4d4dff",
                        marginBottom: 12,
                        fontFamily: "Inter",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "20px",
                    }}
                >
                        <WarningOutlined style={{ color: "#bd4d4dff", fontSize: 18 }} />
                        Low Stock Alert (2 items)
                    </p>
                    <Row gutter={[8, 8]}>
                        <Col span={24}>
                            <Card size="small" style={{ border: "1px solid #f5c2c7" }}>
                                <Row justify="space-between" align="middle">
                                    <Col style={{ fontWeight: "600" }}>Organic Green Tea Leaves</Col>
                                    <Col>
                                        <Tag color="#f54545ff" style={{ fontWeight: "bold" }}>
                                            50 / 200 KG
                                        </Tag>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card size="small" style={{ border: "1px solid #f5c2c7" }}>
                                <Row justify="space-between" align="middle">
                                    <Col style={{ fontWeight: "600" }}>Specialty Chocolate</Col>
                                    <Col>
                                        <Tag color="#f54545ff" style={{ fontWeight: "bold" }}>
                                            20 / 50 BOX
                                        </Tag>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Card>

                <Row gutter={12} style={{ marginBottom: 16 }}>
                    {/* Search Input */}
                    <Col flex="auto">
                        <Input
                            prefix={<SearchOutlined style={{ color: "#B0B0B0", padding: '18px' }} />}
                            placeholder="Search  by product name, ID, or batch number..."
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
                        Inventory Items({data.length})
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
                title={<span style={{ fontWeight: "bold", fontSize: "20px" }}>Create New Inventory Item</span>}
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCloseModal}
                okText="Save"
                cancelText="Cancel"
                width={900}
            >
                <p style={{ marginBottom: 20, color: "#666" }}>
                    Fill in the details below to add a new inventory item.
                </p>

                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<span style={{ fontWeight: "bold" }}>Product ID</span>}
                                name="productId"
                                rules={[{ required: true, message: "Product ID is required" }]}
                            >
                                <Input placeholder="Enter product ID" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span style={{ fontWeight: "bold" }}>Product Name</span>}
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
                                label={<span style={{ fontWeight: "bold" }}>Warehouse</span>}
                                name="warehouse"
                                rules={[{ required: true, message: "Please select warehouse" }]}
                            >
                                <Select placeholder="Select warehouse">
                                    <Option value="wh1">Main Warehouse</Option>
                                    <Option value="wh2">Cold Storage</Option>
                                    <Option value="wh3">Regional Warehouse</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<span style={{ fontWeight: "bold" }}>Batch Number</span>} name="batchNumber">
                                <Input placeholder="Enter batch number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={<span style={{ fontWeight: "bold" }}>Serial Number</span>} name="serialNumber">
                                <Input placeholder="Enter serial number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span style={{ fontWeight: "bold" }}>Quantity On Hand</span>}
                                name="quantity"
                                rules={[{ required: true, message: "Please enter quantity" }]}
                            >
                                <Input type="number" placeholder="Enter quantity" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<span style={{ fontWeight: "bold" }}>Reorder Level</span>}
                                name="reorderLevel"
                                rules={[{ required: true, message: "Please enter reorder level" }]}
                            >
                                <Input type="number" placeholder="Enter reorder level" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span style={{ fontWeight: "bold" }}>Cost Price</span>}
                                name="costPrice"
                                rules={[{ required: true, message: "Please enter cost price" }]}
                            >
                                <Input type="number" placeholder="Enter cost price" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<span style={{ fontWeight: "bold" }}>Unit of Measure</span>}
                                name="unit"
                                rules={[{ required: true, message: "Please select unit" }]}
                            >
                                <Select placeholder="Select unit">
                                    <Option value="pcs">Pieces</Option>
                                    <Option value="kg">Kilograms</Option>
                                    <Option value="ltr">Liters</Option>
                                    <Option value="box">Box</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span style={{ fontWeight: "bold" }}>Status</span>}
                                name="status"
                                initialValue="active"
                                rules={[{ required: true, message: "Please select status" }]}
                            >
                                <Select>
                                    <Option value="active">Active</Option>
                                    <Option value="inactive">Inactive</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default InventoryDashboard;