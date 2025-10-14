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

interface SKU {
    key: string;
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingRecord, setViewingRecord] = useState<SKU | null>(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const screens = useBreakpoint();
    const [data, setData] = useState<SKU[]>([
        {
            key: '1',
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
            key: '2',
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
            key: '3',
            skuNumber: "SPR-330",
            productName: "Sprite",
            salesChannel: "Retail",
            channelSku: "SPR-R330",
            barcode: "8905678912345",
            description: "330ml Can",
            attributeColor: "Green",
            attributeSize: "330ml",
            stockLevel: 150,
            warehouseLocation: "WH-Bangalore-03",
            productDescription: "Sprite lemon-lime drink, 330ml can",
        },
    ]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleViewClick = (record: SKU) => {
        setViewingRecord(record);
        setIsViewEditModalOpen(true);
        setIsEditing(false);
        // Set form values with the record data
        editForm.setFieldsValue(record);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form to original values
        if (viewingRecord) {
            editForm.setFieldsValue(viewingRecord);
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
            // Generate a unique key for the new item
            const newKey = (data.length + 1).toString();
            
            // Add the new SKU to the data array
            const newSku: SKU = {
                key: newKey,
                ...values
            };
            
            setData([...data, newSku]);
            message.success('SKU added successfully');
            setIsModalOpen(false);
            form.resetFields();
        }).catch((errorInfo) => {
            console.log('Validation Failed:', errorInfo);
        });
    };

    const handleEditSubmit = () => {
        editForm.validateFields().then((values) => {
            console.log("Updated Values:", values);
            
            // Update the data array with the edited values
            if (viewingRecord) {
                const updatedData = data.map(item => 
                    item.key === viewingRecord.key 
                        ? { ...item, ...values } 
                        : item
                );
                
                setData(updatedData);
                setViewingRecord({...viewingRecord, ...values});
                message.success('SKU updated successfully');
            }
            
            setIsEditing(false);
        }).catch((errorInfo) => {
            console.log('Validation Failed:', errorInfo);
        });
    };

    const handleDelete = (record: SKU) => {
        // Filter out the deleted item
        const newData = data.filter(item => item.key !== record.key);
        setData(newData);
        message.success('SKU deleted successfully');
    };

// 👇 type columns explicitly
const columns: ColumnsType<SKU> = [
  {
    title: "SKU Number",
    dataIndex: "skuNumber",
    key: "skuNumber",
    width: 120,
    fixed: screens.xs ? undefined : "left", // ✅ properly typed
    render: (text: string, record: SKU) => (
      <a
        onClick={() => handleViewClick(record)}
        style={{ color: "#1890ff", cursor: "pointer" }}
      >
        {text}
      </a>
    ),
  },
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
    width: 120,
  },
  {
    title: "Sales Channel",
    dataIndex: "salesChannel",
    key: "salesChannel",
    width: 120,
  },
  {
    title: "Channel SKU",
    dataIndex: "channelSku",
    key: "channelSku",
    width: 120,
  },
  {
    title: "Barcode",
    dataIndex: "barcode",
    key: "barcode",
    width: 120,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Color",
    dataIndex: "attributeColor",
    key: "attributeColor",
    width: 80,
  },
  {
    title: "Size",
    dataIndex: "attributeSize",
    key: "attributeSize",
    width: 80,
  },
  {
    title: "Action",
    key: "action",
    width: 80,
    fixed: screens.xs ? undefined : "right", // ✅ properly typed
    render: (_: unknown, record: SKU) => (
      <Space size="middle">
        <Popconfirm
          title="Delete this SKU"
          description="Are you sure you want to delete this SKU?"
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
            <div style={{ overflowX: 'auto' }}>
                <Descriptions 
                    column={screens.xs ? 1 : 2} 
                    bordered
                    size="small"
                >
                    <Descriptions.Item label="SKU Number">{viewingRecord.skuNumber}</Descriptions.Item>
                    <Descriptions.Item label="Product Name">{viewingRecord.productName}</Descriptions.Item>
                    <Descriptions.Item label="Sales Channel">{viewingRecord.salesChannel}</Descriptions.Item>
                    <Descriptions.Item label="Channel SKU">{viewingRecord.channelSku}</Descriptions.Item>
                    <Descriptions.Item label="Barcode/UPC">{viewingRecord.barcode}</Descriptions.Item>
                    <Descriptions.Item label="Description">{viewingRecord.description}</Descriptions.Item>
                    <Descriptions.Item label="Attribute - Color">{viewingRecord.attributeColor}</Descriptions.Item>
                    <Descriptions.Item label="Attribute - Size">{viewingRecord.attributeSize}</Descriptions.Item>
                    <Descriptions.Item label="Stock Level">{viewingRecord.stockLevel}</Descriptions.Item>
                    <Descriptions.Item label="Warehouse Location">{viewingRecord.warehouseLocation}</Descriptions.Item>
                    <Descriptions.Item label="Product Description" span={screens.xs ? 1 : 2}>
                        {viewingRecord.productDescription}
                    </Descriptions.Item>
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
                            label="SKU Number"
                            name="skuNumber"
                            rules={[{ required: true, message: "SKU Number is required" }]}
                        >
                            <Input placeholder="Enter SKU Number" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
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
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Sales Channel"
                            name="salesChannel"
                            rules={[{ required: true, message: "Please select sales channel" }]}
                        >
                            <Select placeholder="Select Sales Channel">
                                <Option value="retail">Retail</Option>
                                <Option value="distributor">Distributor</Option>
                                <Option value="online">Online</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
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
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Barcode / UPC"
                            name="barcode"
                            rules={[{ required: true, message: "Barcode/UPC is required" }]}
                        >
                            <Input placeholder="Enter Barcode or UPC" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <Input placeholder="Enter short description" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Attribute - Color"
                            name="attributeColor"
                        >
                            <Input placeholder="Enter color" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Attribute - Size"
                            name="attributeSize"
                        >
                            <Input placeholder="Enter size" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Stock Level"
                            name="stockLevel"
                            rules={[{ required: true, message: "Please enter stock level" }]}
                        >
                            <Input type="number" placeholder="Enter stock level" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Warehouse Location"
                            name="warehouseLocation"
                        >
                            <Input placeholder="Enter warehouse location" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Product Description"
                            name="productDescription"
                        >
                            <Input.TextArea placeholder="Enter detailed product description" rows={2} />
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
                                onClick={handleOpenModal}
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
                <div style={{ marginTop: '32px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
                        SKUs ({data.length})
                    </h2>
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={{ pageSize: 5 }}
                            bordered
                            scroll={{ x: screens.xs ? 800 : '100%' }}
                            size="middle"
                        />
                    </div>
                </div>
            </div>
            
            {/* Add New SKU Modal */}
            <Modal
                title="Create New SKUs"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCloseModal}
                okText="Save"
                cancelText="Cancel"
                width={Math.min(900, window.innerWidth - 40)}
                style={{ top: 20 }}
                bodyStyle={{
                    maxHeight: '70vh',
                    // overflowY: 'auto',
                }}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                getContainer={false}
                forceRender
            >
                <p style={{ marginBottom: 20, color: "#666" }}>
                    Fill in the details below to create a new SKUs location.
                </p>

                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="SKU Number"
                                name="skuNumber"
                                rules={[{ required: true, message: "SKU Number is required" }]}
                            >
                                <Input placeholder="Enter SKU Number" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
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
                        <Col xs={24} sm={12}>
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

                        <Col xs={24} sm={12}>
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
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Barcode / UPC"
                                name="barcode"
                                rules={[{ required: true, message: "Barcode/UPC is required" }]}
                            >
                                <Input placeholder="Enter Barcode or UPC" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <Input placeholder="Enter short description" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Attribute - Color"
                                name="attributeColor"
                            >
                                <Input placeholder="Enter color" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Attribute - Size"
                                name="attributeSize"
                            >
                                <Input placeholder="Enter size" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Stock Level"
                                name="stockLevel"
                                rules={[{ required: true, message: "Please enter stock level" }]}
                            >
                                <Input type="number" placeholder="Enter stock level" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Warehouse Location"
                                name="warehouseLocation"
                            >
                                <Input placeholder="Enter warehouse location" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Product Description"
                                name="productDescription"
                            >
                                <Input.TextArea placeholder="Enter detailed product description" rows={2} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* View/Edit SKU Modal */}
            <Modal
                title={
                    isEditing 
                        ? `Edit SKU - ${viewingRecord?.skuNumber || ''}` 
                        : `View SKU - ${viewingRecord?.skuNumber || ''}`
                }
                open={isViewEditModalOpen}
                onOk={isEditing ? handleEditSubmit : handleCloseViewEditModal}
                onCancel={handleCloseViewEditModal}
                okText={isEditing ? "Update" : "Close"}
                cancelText={isEditing ? "Cancel Edit" : "Cancel"}
                width={Math.min(900, window.innerWidth - 40)}
                style={{ top: 20 }}
                bodyStyle={{
                    maxHeight: '70vh',
                    // overflowY: 'auto',
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

export default Sku;