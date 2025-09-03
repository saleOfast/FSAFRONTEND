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

interface SKU {
    skuNumber: string;
    productName: string;
    salesChannel: string;
    channelSku: string;
    barcode: string;
    description: string;
    attributeColor: string;
    attributeSize: string;
    stockLevel: number;
    warehouseLocation: string;
    productDescription: string;
}

const Sku = () => {
    const columns = [
        {
            title: "SKU Number",
            dataIndex: "skuNumber",
            key: "skuNumber",
        },
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
        },
        {
            title: "Sales Channel",
            dataIndex: "salesChannel",
            key: "salesChannel",
        },
        {
            title: "Channel SKU",
            dataIndex: "channelSku",
            key: "channelSku",
        },
        {
            title: "Barcode/UPC",
            dataIndex: "barcode",
            key: "barcode",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Attribute - Color",
            dataIndex: "attributeColor",
            key: "attributeColor",
        },
        {
            title: "Attribute - Size",
            dataIndex: "attributeSize",
            key: "attributeSize",
        },
        {
            title: "Stock Level",
            dataIndex: "stockLevel",
            key: "stockLevel",
        },
        {
            title: "Warehouse Location",
            dataIndex: "warehouseLocation",
            key: "warehouseLocation",
        },
        {
            title: "Product Description",
            dataIndex: "productDescription",
            key: "productDescription",
        },

    ];

    const data: SKU[] = [
        {
            skuNumber: "COC-500B",
            productName: "Coca-Cola",
            salesChannel: "Retail",
            channelSku: "COC-R500",
            barcode: "8901234567890",
            description: "500ml PET Bottle",
            attributeColor: "Red",
            attributeSize: "500ml",
            stockLevel: 120,
            warehouseLocation: "WH-Delhi-01",
            productDescription: "Coca-Cola refreshing soft drink, 500ml PET",
        },
        {
            skuNumber: "PEP-1L",
            productName: "Pepsi",
            salesChannel: "Distributor",
            channelSku: "PEP-D1000",
            barcode: "8909876543210",
            description: "1L PET Bottle",
            attributeColor: "Blue",
            attributeSize: "1L",
            stockLevel: 80,
            warehouseLocation: "WH-Mumbai-02",
            productDescription: "Pepsi cola drink, 1L PET bottle pack",
        },
        {
            skuNumber: "PEP-1L",
            productName: "Pepsi",
            salesChannel: "Distributor",
            channelSku: "PEP-D1000",
            barcode: "8909876543210",
            description: "1L PET Bottle",
            attributeColor: "Blue",
            attributeSize: "1L",
            stockLevel: 80,
            warehouseLocation: "WH-Mumbai-02",
            productDescription: "Pepsi cola drink, 1L PET bottle pack",
        },
        {
            skuNumber: "PEP-1L",
            productName: "Pepsi",
            salesChannel: "Distributor",
            channelSku: "PEP-D1000",
            barcode: "8909876543210",
            description: "1L PET Bottle",
            attributeColor: "Blue",
            attributeSize: "1L",
            stockLevel: 80,
            warehouseLocation: "WH-Mumbai-02",
            productDescription: "Pepsi cola drink, 1L PET bottle pack",
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
                <h1 className="page-title pr-18">SKUs</h1>
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
                                    SKUs Management
                                </p>
                                <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
                                    Manage your SKUs locations and operations
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
                                <PlusOutlined /> Add SKUs
                            </Button>
                        </Col>
                    </Row>
                </Card>
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    {/* Search Input */}
                    <Col flex="auto">
                        <Input
                            prefix={<SearchOutlined style={{ color: "#B0B0B0", padding: '18px' }} />}
                            placeholder="Search SKUs by name, ID, or city..."
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
                        SKUs ({data.length})
                    </h2>
                    <div style={{ overflowX: 'auto' }}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={{ pageSize: 5 }}
                            bordered
                            scroll={{ x: true }}
                        />
                    </div>
                </div>
            </div>
            <Modal
                title="Create New SKUs"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCloseModal}
                okText="Save"
                cancelText="Cancel"
                width={900} // wider modal for big form
            >
                <p style={{ marginBottom: 20, color: "#666" }}>
                    Fill in the details below to create a new SKUs location.
                </p>

                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="SKU Number"
                                name="skuNumber"
                                rules={[{ required: true, message: "SKU Number is required" }]}
                            >
                                <Input placeholder="Enter SKU Number" />
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
                                label="Channel SKU"
                                name="channelSku"
                                rules={[{ required: true, message: "Channel SKU is required" }]}
                            >
                                <Input placeholder="Enter channel SKU" />
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

export default Sku;
