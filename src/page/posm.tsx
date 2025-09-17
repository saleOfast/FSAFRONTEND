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
    DatePicker,
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
import moment from 'moment';
const { Option } = Select;
const { Text } = Typography;

const { useBreakpoint } = Grid;
export interface POSM {
    key: string;
    posmId: string;              // Unique identifier for the POSM item
    posmCode: string;            // Unique code or SKU for the POSM
    posmName: string;            // Name/description of the POS Material
    posmType: string;            // Type/category e.g., poster, standee, shelf ticker
    quantityAllocated: number;   // Quantity allocated to distributor/outlet
    quantityDistributed: number; // Quantity actually distributed
    quantityReturned: number;    // Returned POSM quantity
    distributorId: string;       // Distributor receiving the POSM
    outletId: string;            // Specific outlet/store receiving POSM
    campaignId: string;          // Marketing campaign or promotion linked
    startDate: string;           // Start date of POSM usage or campaign (ISO format)
    endDate: string;             // End date of POSM usage or campaign (ISO format)
    status: "Active" | "Inactive" | "Returned" | "Lost"; // Enum-like string union
    assignedTo: string;          // Salesperson or employee responsible
    remarks?: string;            // Optional remarks/notes
}

const PointOfSalesMaterial = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingRecord, setViewingRecord] = useState<POSM | null>(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const screens = useBreakpoint();
    const [data, setData] = useState<POSM[]>([
        {
            key: '1',
            posmId: "P001",
            posmCode: "POSM-1001",
            posmName: "Summer Sale Poster",
            posmType: "Poster",
            quantityAllocated: 200,
            quantityDistributed: 180,
            quantityReturned: 20,
            distributorId: "D123",
            outletId: "O456",
            campaignId: "C789",
            startDate: "2025-09-01",
            endDate: "2025-09-30",
            status: "Active",
            assignedTo: "John Doe",
            remarks: "Displayed at entrance"
        }
    ]);

    const handleDelete = (record: POSM) => {
        // Filter out the deleted item
        const newData = data.filter(item => item.key !== record.key);
        setData(newData);
        message.success('POSM deleted successfully');
    };

    const posmColumns: ColumnsType<POSM> = [
        {
            title: "POSM ID",
            dataIndex: "posmId",
            key: "posmId",
            width: 100,
        },
        {
            title: "POSM Code",
            dataIndex: "posmCode",
            key: "posmCode",
            width: 120,
            render: (text: string, record: POSM) => (
                <a
                    onClick={() => handleViewClick(record)}
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                >
                    {text}
                </a>
            ),
        },
        {
            title: "POSM Name",
            dataIndex: "posmName",
            key: "posmName",
            width: 150,
            ellipsis: true,
        },
        {
            title: "POSM Type",
            dataIndex: "posmType",
            key: "posmType",
            width: 100,
        },
        {
            title: "Qty Allocated",
            dataIndex: "quantityAllocated",
            key: "quantityAllocated",
            width: 100,
        },
        {
            title: "Qty Distributed",
            dataIndex: "quantityDistributed",
            key: "quantityDistributed",
            width: 110,
        },
        {
            title: "Qty Returned",
            dataIndex: "quantityReturned",
            key: "quantityReturned",
            width: 100,
        },
        {
            title: "Distributor ID",
            dataIndex: "distributorId",
            key: "distributorId",
            width: 110,
            ellipsis: true,
        },
        {
            title: 'Action',
            key: 'actions',
            width: 80,
            fixed: 'right' as const,
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Delete this POSM"
                        description="Are you sure you want to delete this POSM?"
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

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleViewClick = (record: POSM) => {
        setViewingRecord(record);
        setIsViewEditModalOpen(true);
        setIsEditing(false);
        // Set form values with the record data
        editForm.setFieldsValue({
            ...record,
            startDate: record.startDate ? moment(record.startDate) : null,
            endDate: record.endDate ? moment(record.endDate) : null,
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
                startDate: viewingRecord.startDate ? moment(viewingRecord.startDate) : null,
                endDate: viewingRecord.endDate ? moment(viewingRecord.endDate) : null,
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
            // Generate a unique key for the new item
            const newKey = (data.length + 1).toString();
            
            // Add the new POSM to the data array
            const newPosm: POSM = {
                key: newKey,
                ...values,
                startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : '',
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : '',
            };
            
            setData([...data, newPosm]);
            message.success('POSM added successfully');
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
                        ? { 
                            ...item, 
                            ...values,
                            startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : item.startDate,
                            endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : item.endDate,
                        } 
                        : item
                );
                
                setData(updatedData);
                setViewingRecord({
                    ...viewingRecord, 
                    ...values,
                    startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : viewingRecord.startDate,
                    endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : viewingRecord.endDate,
                });
                message.success('POSM updated successfully');
            }
            
            setIsEditing(false);
        }).catch((errorInfo) => {
            console.log('Validation Failed:', errorInfo);
        });
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
                    <Descriptions.Item label="POSM ID">{viewingRecord.posmId}</Descriptions.Item>
                    <Descriptions.Item label="POSM Code">{viewingRecord.posmCode}</Descriptions.Item>
                    <Descriptions.Item label="POSM Name">{viewingRecord.posmName}</Descriptions.Item>
                    <Descriptions.Item label="POSM Type">{viewingRecord.posmType}</Descriptions.Item>
                    <Descriptions.Item label="Quantity Allocated">{viewingRecord.quantityAllocated}</Descriptions.Item>
                    <Descriptions.Item label="Quantity Distributed">{viewingRecord.quantityDistributed}</Descriptions.Item>
                    <Descriptions.Item label="Quantity Returned">{viewingRecord.quantityReturned}</Descriptions.Item>
                    <Descriptions.Item label="Distributor ID">{viewingRecord.distributorId}</Descriptions.Item>
                    <Descriptions.Item label="Outlet ID">{viewingRecord.outletId}</Descriptions.Item>
                    <Descriptions.Item label="Campaign ID">{viewingRecord.campaignId}</Descriptions.Item>
                    <Descriptions.Item label="Assigned To">{viewingRecord.assignedTo}</Descriptions.Item>
                    <Descriptions.Item label="Start Date">{viewingRecord.startDate}</Descriptions.Item>
                    <Descriptions.Item label="End Date">{viewingRecord.endDate}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={viewingRecord.status === "Active" ? "green" : "default"}>
                            {viewingRecord.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Remarks" span={screens.xs ? 1 : 2}>
                        {viewingRecord.remarks || "N/A"}
                    </Descriptions.Item>
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
                            label="POSM ID"
                            name="posmId"
                            rules={[{ required: true, message: "POSM ID is required" }]}
                        >
                            <Input placeholder="Enter unique POSM ID" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="POSM Code"
                            name="posmCode"
                            rules={[{ required: true, message: "POSM Code is required" }]}
                        >
                            <Input placeholder="Enter POSM Code / SKU" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="POSM Name"
                            name="posmName"
                            rules={[{ required: true, message: "POSM Name is required" }]}
                        >
                            <Input placeholder="Enter POSM Name" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="POSM Type"
                            name="posmType"
                            rules={[{ required: true, message: "POSM Type is required" }]}
                        >
                            <Select placeholder="Select POSM Type">
                                <Option value="poster">Poster</Option>
                                <Option value="standee">Standee</Option>
                                <Option value="shelfTicker">Shelf Ticker</Option>
                                <Option value="flyer">Flyer</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Quantity Allocated"
                            name="quantityAllocated"
                            rules={[{ required: true, message: "Quantity Allocated is required" }]}
                        >
                            <Input type="number" placeholder="Enter allocated quantity" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Quantity Distributed"
                            name="quantityDistributed"
                            rules={[{ required: true, message: "Quantity Distributed is required" }]}
                        >
                            <Input type="number" placeholder="Enter distributed quantity" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Quantity Returned"
                            name="quantityReturned"
                        >
                            <Input type="number" placeholder="Enter returned quantity" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Distributor ID"
                            name="distributorId"
                        >
                            <Input placeholder="Enter Distributor ID" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Outlet ID"
                            name="outletId"
                        >
                            <Input placeholder="Enter Outlet ID" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Campaign ID"
                            name="campaignId"
                        >
                            <Input placeholder="Enter Campaign ID" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Assigned To"
                            name="assignedTo"
                        >
                            <Input placeholder="Enter assigned salesperson/employee" />
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
                                <Option value="Returned">Returned</Option>
                                <Option value="Lost">Lost</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Start Date"
                            name="startDate"
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="End Date"
                            name="endDate"
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Remarks"
                            name="remarks"
                        >
                            <Input.TextArea rows={2} placeholder="Enter remarks" />
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
                <h1 className="page-title pr-18">POSM</h1>
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
                                    POSM Management
                                </p>
                                <p style={{ margin: 0, fontSize: '15px', color: '##666' }}>
                                    Manage your POSM locations and operations
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
                                <PlusOutlined /> Add POSM
                            </Button>
                        </Col>
                    </Row>
                </Card>
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    {/* Search Input */}
                    <Col flex="auto">
                        <Input
                            prefix={<SearchOutlined style={{ color: "#B0B0B0", padding: '18px' }} />}
                            placeholder="Search POSM by name, ID, or city..."
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
                        POSM ({data.length})
                    </h2>
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <Table
                            columns={posmColumns}
                            dataSource={data}
                            pagination={{ pageSize: 5 }}
                            bordered
                            scroll={{ x: 'max-content' }}
                            size="middle"
                        />
                    </div>
                </div>
            </div>

            {/* Add New POSM Modal */}
            <Modal
                title="Create New POSM"
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
                    Fill in the details below to create a new POSM location.
                </p>

                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="POSM ID"
                                name="posmId"
                                rules={[{ required: true, message: "POSM ID is required" }]}
                            >
                                <Input placeholder="Enter unique POSM ID" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="POSM Code"
                                name="posmCode"
                                rules={[{ required: true, message: "POSM Code is required" }]}
                            >
                                <Input placeholder="Enter POSM Code / SKU" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="POSM Name"
                                name="posmName"
                                rules={[{ required: true, message: "POSM Name is required" }]}
                            >
                                <Input placeholder="Enter POSM Name" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="POSM Type"
                                name="posmType"
                                rules={[{ required: true, message: "POSM Type is required" }]}
                            >
                                <Select placeholder="Select POSM Type">
                                    <Option value="poster">Poster</Option>
                                    <Option value="standee">Standee</Option>
                                    <Option value="shelfTicker">Shelf Ticker</Option>
                                    <Option value="flyer">Flyer</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Quantity Allocated"
                                name="quantityAllocated"
                                rules={[{ required: true, message: "Quantity Allocated is required" }]}
                            >
                                <Input type="number" placeholder="Enter allocated quantity" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Quantity Distributed"
                                name="quantityDistributed"
                                rules={[{ required: true, message: "Quantity Distributed is required" }]}
                            >
                                <Input type="number" placeholder="Enter distributed quantity" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Distributor ID"
                                name="distributorId"
                                rules={[{ required: true, message: "Distributor ID is required" }]}
                            >
                                <Input placeholder="Enter Distributor ID" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Outlet ID"
                                name="outletId"
                            >
                                <Input placeholder="Enter Outlet ID" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Campaign ID"
                                name="campaignId"
                            >
                                <Input placeholder="Enter Campaign ID" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Assigned To"
                                name="assignedTo"
                                rules={[{ required: true, message: "Assigned To is required" }]}
                            >
                                <Input placeholder="Enter assigned salesperson/employee" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Start Date"
                                name="startDate"
                                rules={[{ required: true, message: "Start Date is required" }]}
                            >
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="End Date"
                                name="endDate"
                                rules={[{ required: true, message: "End Date is required" }]}
                            >
                                <DatePicker style={{ width: "100%" }} />
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
                                    <Option value="Returned">Returned</Option>
                                    <Option value="Lost">Lost</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Quantity Returned"
                                name="quantityReturned"
                            >
                                <Input type="number" placeholder="Enter returned quantity" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Remarks"
                                name="remarks"
                            >
                                <Input.TextArea rows={2} placeholder="Enter remarks" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* View/Edit POSM Modal */}
            <Modal
                title={
                    isEditing 
                        ? `Edit POSM - ${viewingRecord?.posmCode || ''}` 
                        : `View POSM - ${viewingRecord?.posmCode || ''}`
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
                    </Button>,
                ]}
            >
                {isEditing ? renderEditForm() : renderViewContent()}
            </Modal>
        </div>
    );
};

export default PointOfSalesMaterial;