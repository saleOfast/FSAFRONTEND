import { ArrowLeftOutlined, PlusOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
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
import "../style/stores.css";

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
    
    // Load gridView preference from localStorage or default to false (List view)
    const getDefaultGridView = () => {
        const saved = localStorage.getItem('skuPageGridView');
        if (saved !== null) {
            return saved === 'true';
        }
        return false; // Default to list view
    };
    
    const [gridView, setGridView] = useState(getDefaultGridView());
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
    const handleGridView = () => {
        setGridView(true);
        localStorage.setItem('skuPageGridView', 'true');
    };
    
    const handleListView = () => {
        setGridView(false);
        localStorage.setItem('skuPageGridView', 'false');
    };
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };
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
        {
            key: '4',
            skuNumber: "FAN-2L",
            productName: "Fanta",
            salesChannel: "Retail",
            channelSku: "FAN-R2000",
            barcode: "8901112223334",
            description: "2L PET Bottle",
            attributeColor: "Orange",
            attributeSize: "2L",
            stockLevel: 95,
            warehouseLocation: "WH-Chennai-04",
            productDescription: "Fanta orange flavored soft drink, 2L PET",
        },
        {
            key: '5',
            skuNumber: "THU-500",
            productName: "Thums Up",
            salesChannel: "Distributor",
            channelSku: "THU-D500",
            barcode: "8902223334445",
            description: "500ml PET Bottle",
            attributeColor: "Red",
            attributeSize: "500ml",
            stockLevel: 200,
            warehouseLocation: "WH-Kolkata-05",
            productDescription: "Thums Up strong cola drink, 500ml PET",
        },
        {
            key: '6',
            skuNumber: "LIM-250",
            productName: "Limca",
            salesChannel: "Retail",
            channelSku: "LIM-R250",
            barcode: "8903334445556",
            description: "250ml Glass Bottle",
            attributeColor: "Clear",
            attributeSize: "250ml",
            stockLevel: 175,
            warehouseLocation: "WH-Hyderabad-06",
            productDescription: "Limca lemon-lime drink, 250ml glass bottle",
        },
        {
            key: '7',
            skuNumber: "MAZ-750",
            productName: "Maaza",
            salesChannel: "Distributor",
            channelSku: "MAZ-D750",
            barcode: "8904445556667",
            description: "750ml PET Bottle",
            attributeColor: "Orange",
            attributeSize: "750ml",
            stockLevel: 110,
            warehouseLocation: "WH-Pune-07",
            productDescription: "Maaza mango fruit drink, 750ml PET",
        },
        {
            key: '8',
            skuNumber: "KIN-1L",
            productName: "Kinley",
            salesChannel: "Retail",
            channelSku: "KIN-R1000",
            barcode: "8905556667778",
            description: "1L PET Bottle",
            attributeColor: "Clear",
            attributeSize: "1L",
            stockLevel: 300,
            warehouseLocation: "WH-Ahmedabad-08",
            productDescription: "Kinley natural mineral water, 1L PET",
        },
        {
            key: '9',
            skuNumber: "SEV-600",
            productName: "7UP",
            salesChannel: "Retail",
            channelSku: "SEV-R600",
            barcode: "8906667778889",
            description: "600ml PET Bottle",
            attributeColor: "Clear",
            attributeSize: "600ml",
            stockLevel: 140,
            warehouseLocation: "WH-Jaipur-09",
            productDescription: "7UP lemon-lime carbonated drink, 600ml PET",
        },
    ]);

    const filteredData = data.filter((item) => {
        const matchesSearch = !searchValue || 
            item.skuNumber?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.productName?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.salesChannel?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.barcode?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchValue.toLowerCase());
        
        // For now, all items pass status filter since SKU doesn't have status field
        const matchesStatus = statusFilter === 'all';
        
        return matchesSearch && matchesStatus;
    });

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
        <div  style={{  fontFamily: 'roboto' }}>
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
                
              

                <div className="search">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search SKUs by SKU Number, Product Name, Barcode, or Description..."
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
                    <Select
                        defaultValue="all"
                        className="w-130"
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                    >
                        <Option value="all">All Status</Option>
                    </Select>
                </div>

                {/* Grid/List View Section */}
                <div style={{ marginTop: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
                        SKUs ({filteredData.length})
                    </h2>
                    
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
                                return (
                                    <div key={index}>
                                        <div
                                            className="store-list"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleViewClick(item)}
                                        >
                                            <div className="shoptitle">
                                                <div className="fontb">{item?.productName}</div>
                                            </div>
                                            <div className="storeConlist">
                                                <div>
                                                    <div className="storeIdTxt">
                                                        SKU: {item?.skuNumber} | Channel: {item?.salesChannel}
                                                    </div>
                                                    <div className="fs-13">Barcode: <span className="fw-bold">{item?.barcode}</span></div>
                                                    <div className="fs-13">Size: <span className="fw-bold">{item?.attributeSize}</span> | Color: <span className="fw-bold">{item?.attributeColor}</span></div>
                                                    <div className="fs-13">Stock Level: <span className="fw-bold">{item?.stockLevel}</span></div>
                                                    <div className="fs-13">Warehouse: <span className="fw-bold">{item?.warehouseLocation}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <table className="store-table" style={{ textDecoration: 'none', fontSize: '13px', width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>SKU Number</th>
                                    <th>Product Name</th>
                                    <th>Sales Channel</th>
                                    <th>Barcode</th>
                                    <th>Size</th>
                                    <th>Color</th>
                                    <th>Stock Level</th>
                                    <th>Warehouse</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <a
                                                    onClick={() => handleViewClick(item)}
                                                    style={{ textDecoration: 'none', color: '#1890ff', cursor: 'pointer' }}
                                                >
                                                    {item?.skuNumber}
                                                </a>
                                            </td>
                                            <td>{item?.productName}</td>
                                            <td>{item?.salesChannel}</td>
                                            <td>{item?.barcode}</td>
                                            <td>{item?.attributeSize}</td>
                                            <td>{item?.attributeColor}</td>
                                            <td>{item?.stockLevel}</td>
                                            <td>{item?.warehouseLocation}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
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
                    overflowY: 'auto',
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
                    overflowY: 'auto',
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