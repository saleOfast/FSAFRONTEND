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
import "../style/stores.css";

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
    
    // Load gridView preference from localStorage or default to false (List view)
    const getDefaultGridView = () => {
        const saved = localStorage.getItem('warehousePageGridView');
        if (saved !== null) {
            return saved === 'true';
        }
        return false; // Default to list view
    };
    
    const [gridView, setGridView] = useState(getDefaultGridView());
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
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
        {
            key: '4',
            id: 'WH004',
            name: 'East Coast Distribution Hub',
            location: 'New York, NY',
            type: 'Distribution',
            manager: 'Michael Brown',
            capacity: '75,000 sq ft',
            status: 'Active',
            address: '321 Broadway',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            contactPerson: 'Michael Brown',
            contactPhone: '(555) 111-2222',
            email: 'michael@example.com',
            operationalHours: '06:00 - 20:00',
            managerContact: '(555) 111-2222'
        },
        {
            key: '5',
            id: 'WH005',
            name: 'Midwest Storage Center',
            location: 'Chicago, IL',
            type: 'Storage',
            manager: 'Jennifer Wilson',
            capacity: '40,000 sq ft',
            status: 'Active',
            address: '555 Michigan Ave',
            city: 'Chicago',
            state: 'IL',
            zip: '60601',
            contactPerson: 'Jennifer Wilson',
            contactPhone: '(555) 333-4444',
            email: 'jennifer@example.com',
            operationalHours: '07:00 - 19:00',
            managerContact: '(555) 333-4444'
        },
        {
            key: '6',
            id: 'WH006',
            name: 'Southern Regional Warehouse',
            location: 'Houston, TX',
            type: 'Distribution',
            manager: 'David Martinez',
            capacity: '60,000 sq ft',
            status: 'Active',
            address: '888 Main Street',
            city: 'Houston',
            state: 'TX',
            zip: '77001',
            contactPerson: 'David Martinez',
            contactPhone: '(555) 555-6666',
            email: 'david@example.com',
            operationalHours: '08:00 - 18:00',
            managerContact: '(555) 555-6666'
        },
        {
            key: '7',
            id: 'WH007',
            name: 'Pacific Northwest Facility',
            location: 'Seattle, WA',
            type: 'Storage',
            manager: 'Emily Davis',
            capacity: '35,000 sq ft',
            status: 'Active',
            address: '999 Pine Street',
            city: 'Seattle',
            state: 'WA',
            zip: '98101',
            contactPerson: 'Emily Davis',
            contactPhone: '(555) 777-8888',
            email: 'emily@example.com',
            operationalHours: '08:00 - 17:00',
            managerContact: '(555) 777-8888'
        },
        {
            key: '8',
            id: 'WH008',
            name: 'Arizona Logistics Center',
            location: 'Phoenix, AZ',
            type: 'Distribution',
            manager: 'James Anderson',
            capacity: '45,000 sq ft',
            status: 'Inactive',
            address: '777 Central Ave',
            city: 'Phoenix',
            state: 'AZ',
            zip: '85001',
            contactPerson: 'James Anderson',
            contactPhone: '(555) 999-0000',
            email: 'james@example.com',
            operationalHours: '09:00 - 18:00',
            managerContact: '(555) 999-0000'
        },
        {
            key: '9',
            id: 'WH009',
            name: 'Florida Distribution Point',
            location: 'Miami, FL',
            type: 'Distribution',
            manager: 'Maria Garcia',
            capacity: '55,000 sq ft',
            status: 'Active',
            address: '666 Ocean Drive',
            city: 'Miami',
            state: 'FL',
            zip: '33101',
            contactPerson: 'Maria Garcia',
            contactPhone: '(555) 222-3333',
            email: 'maria@example.com',
            operationalHours: '07:00 - 19:00',
            managerContact: '(555) 222-3333'
        },
    ]);

    const handleGridView = () => {
        setGridView(true);
        localStorage.setItem('warehousePageGridView', 'true');
    };
    
    const handleListView = () => {
        setGridView(false);
        localStorage.setItem('warehousePageGridView', 'false');
    };
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };
    
    const filteredData = data.filter((item) => {
        const matchesSearch = !searchValue || 
            item.id?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.location?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.type?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.status?.toLowerCase().includes(searchValue.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && item.status === 'Active') ||
            (statusFilter === 'inactive' && item.status === 'Inactive');
        
        return matchesSearch && matchesStatus;
    });

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
        <div  style={{  fontFamily: 'roboto' }}>
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
                <div className="search">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search warehouses by name, ID, location, type, or status..."
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
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </div>

                {/* Grid/List View Section */}
                <div style={{ marginTop: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
                        Warehouses ({filteredData.length})
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
                                const getStatusColor = (status: string) => {
                                    switch (status) {
                                        case "Active":
                                            return "#2DB83D";
                                        default:
                                            return "#e61b23";
                                    }
                                };

                                return (
                                    <div key={index}>
                                        <div
                                            className="store-list"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleViewClick(item)}
                                        >
                                            <div className="shoptitle">
                                                <div className="fontb">{item?.name}</div>
                                                <div
                                                    style={{
                                                        background: getStatusColor(item?.status),
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        color: 'white',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    {item?.status}
                                                </div>
                                            </div>
                                            <div className="storeConlist">
                                                <div>
                                                    <div className="storeIdTxt">
                                                        ID: {item?.id} | Type: {item?.type}
                                                    </div>
                                                    <div className="fs-13">Location: <span className="fw-bold">{item?.location}</span></div>
                                                    <div className="fs-13">Manager: <span className="fw-bold">{item?.manager}</span></div>
                                                    <div className="fs-13">Capacity: <span className="fw-bold">{item?.capacity}</span></div>
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
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Manager</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData?.map((item, index) => {
                                    const getStatusColor = (status: string) => {
                                        switch (status) {
                                            case "Active":
                                                return "#2DB83D";
                                            default:
                                                return "#e61b23";
                                        }
                                    };

                                    return (
                                        <tr key={index}>
                                            <td>
                                                <a
                                                    onClick={() => handleViewClick(item)}
                                                    style={{ textDecoration: 'none', color: '#1890ff', cursor: 'pointer' }}
                                                >
                                                    {item?.id}
                                                </a>
                                            </td>
                                            <td>{item?.name}</td>
                                            <td>{item?.location}</td>
                                            <td>{item?.type}</td>
                                            <td>{item?.manager}</td>
                                            <td>{item?.capacity}</td>
                                            <td>
                                                <span
                                                    style={{
                                                        background: getStatusColor(item?.status),
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        color: 'white',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    {item?.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
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
                    padding: '24px',
                    overflowX: 'hidden',
                    overflowY: 'auto'
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
                    padding: '24px',
                    overflowX: 'hidden',
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
                    </Button>,
                ]}
            >
                {isEditing ? renderEditForm() : renderViewContent()}
            </Modal>

        </div>
    );
};

export default Warehouse;