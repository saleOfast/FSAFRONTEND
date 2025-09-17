import { ArrowLeftOutlined, PlusOutlined, TagsOutlined } from '@ant-design/icons';
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
    Popconfirm,
    DatePicker
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
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface DiscountListData {
    key: string;
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    discountType: string;
    minOrderValue: number;
    maxDiscountAmount: number;
    usageLimit: number;
    status: 'Active' | 'Inactive' | 'Expired';
    createdDate: string;
    lastUpdatedDate: string;
    createdBy: string;
    lastModifiedBy: string;
}

interface DiscountItemData {
    key: string;
    discountListId: string;
    productId: string;
    discountValue: number;
    conditionRules: string;
    priorityLevel: number;
    remarks: string;
    createdDate: string;
    lastUpdatedDate: string;
    createdBy: string;
    lastModifiedBy: string;
}

const SchemeAndDiscount = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingRecord, setViewingRecord] = useState<DiscountListData | null>(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const screens = useBreakpoint();

    const [discountLists, setDiscountLists] = useState<DiscountListData[]>([
        {
            key: '1',
            id: 'DL001',
            name: 'Summer Sale 2023',
            description: 'Summer season discount for all products',
            startDate: '2023-06-01',
            endDate: '2023-08-31',
            discountType: 'Percentage',
            minOrderValue: 100,
            maxDiscountAmount: 500,
            usageLimit: 1000,
            status: 'Active',
            createdDate: '2023-05-15',
            lastUpdatedDate: '2023-05-15',
            createdBy: 'Admin User',
            lastModifiedBy: 'Admin User'
        },
        {
            key: '2',
            id: 'DL002',
            name: 'New Customer Offer',
            description: 'Special discount for first-time customers',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            discountType: 'Fixed Amount',
            minOrderValue: 50,
            maxDiscountAmount: 100,
            usageLimit: 500,
            status: 'Active',
            createdDate: '2023-01-01',
            lastUpdatedDate: '2023-01-01',
            createdBy: 'Admin User',
            lastModifiedBy: 'Admin User'
        },
        {
            key: '3',
            id: 'DL003',
            name: 'Holiday Season 2022',
            description: 'Christmas and New Year special discounts',
            startDate: '2022-12-01',
            endDate: '2022-12-31',
            discountType: 'Tiered',
            minOrderValue: 200,
            maxDiscountAmount: 300,
            usageLimit: 2000,
            status: 'Expired',
            createdDate: '2022-11-15',
            lastUpdatedDate: '2022-11-15',
            createdBy: 'Admin User',
            lastModifiedBy: 'Admin User'
        },
    ]);

    const [discountItems, setDiscountItems] = useState<DiscountItemData[]>([
        {
            key: '1',
            discountListId: 'DL001',
            productId: 'P1001',
            discountValue: 15,
            conditionRules: 'Apply to all categories',
            priorityLevel: 1,
            remarks: 'Summer special',
            createdDate: '2023-05-15',
            lastUpdatedDate: '2023-05-15',
            createdBy: 'Admin User',
            lastModifiedBy: 'Admin User'
        },
        {
            key: '2',
            discountListId: 'DL001',
            productId: 'P1002',
            discountValue: 20,
            conditionRules: 'Minimum 2 items',
            priorityLevel: 2,
            remarks: 'Bestseller product',
            createdDate: '2023-05-15',
            lastUpdatedDate: '2023-05-15',
            createdBy: 'Admin User',
            lastModifiedBy: 'Admin User'
        },
        {
            key: '3',
            discountListId: 'DL002',
            productId: 'P2001',
            discountValue: 10,
            conditionRules: 'New customers only',
            priorityLevel: 1,
            remarks: 'First purchase discount',
            createdDate: '2023-01-01',
            lastUpdatedDate: '2023-01-01',
            createdBy: 'Admin User',
            lastModifiedBy: 'Admin User'
        },
    ]);

    const handleDelete = (record: DiscountListData) => {
        // Filter out the deleted item
        const newData = discountLists.filter(item => item.key !== record.key);
        setDiscountLists(newData);
        message.success('Discount list deleted successfully');
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
            const newKey = (discountLists.length + 1).toString();

            // Add the new Discount List to the data array
            const newDiscountList: DiscountListData = {
                key: newKey,
                id: `DL${String(discountLists.length + 1).padStart(3, '0')}`,
                name: values.name,
                description: values.description,
                startDate: values.dateRange[0].format('YYYY-MM-DD'),
                endDate: values.dateRange[1].format('YYYY-MM-DD'),
                discountType: values.discountType,
                minOrderValue: values.minOrderValue,
                maxDiscountAmount: values.maxDiscountAmount,
                usageLimit: values.usageLimit,
                status: values.status,
                createdDate: new Date().toISOString().split('T')[0],
                lastUpdatedDate: new Date().toISOString().split('T')[0],
                createdBy: 'Current User',
                lastModifiedBy: 'Current User'
            };

            setDiscountLists([...discountLists, newDiscountList]);
            message.success('Discount list created successfully!');
            setIsModalOpen(false);
            form.resetFields();
        }).catch((errorInfo) => {
            console.log('Validation Failed:', errorInfo);
        });
    };

    const handleViewClick = (record: DiscountListData) => {
        setViewingRecord(record);
        setIsViewEditModalOpen(true);
        setIsEditing(false);
        // Set form values with the record data
        editForm.setFieldsValue({
            id: record.id,
            name: record.name,
            description: record.description,
            dateRange: [moment(record.startDate), moment(record.endDate)],
            discountType: record.discountType,
            minOrderValue: record.minOrderValue,
            maxDiscountAmount: record.maxDiscountAmount,
            usageLimit: record.usageLimit,
            status: record.status,
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
                description: viewingRecord.description,
                dateRange: [moment(viewingRecord.startDate), moment(viewingRecord.endDate)],
                discountType: viewingRecord.discountType,
                minOrderValue: viewingRecord.minOrderValue,
                maxDiscountAmount: viewingRecord.maxDiscountAmount,
                usageLimit: viewingRecord.usageLimit,
                status: viewingRecord.status,
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
                const updatedData = discountLists.map(item =>
                    item.key === viewingRecord.key
                        ? {
                            ...item,
                            name: values.name,
                            description: values.description,
                            startDate: values.dateRange[0].format('YYYY-MM-DD'),
                            endDate: values.dateRange[1].format('YYYY-MM-DD'),
                            discountType: values.discountType,
                            minOrderValue: values.minOrderValue,
                            maxDiscountAmount: values.maxDiscountAmount,
                            usageLimit: values.usageLimit,
                            status: values.status,
                            lastUpdatedDate: new Date().toISOString().split('T')[0],
                            lastModifiedBy: 'Current User'
                        }
                        : item
                );

                setDiscountLists(updatedData);
                setViewingRecord({
                    ...viewingRecord,
                    name: values.name,
                    description: values.description,
                    startDate: values.dateRange[0].format('YYYY-MM-DD'),
                    endDate: values.dateRange[1].format('YYYY-MM-DD'),
                    discountType: values.discountType,
                    minOrderValue: values.minOrderValue,
                    maxDiscountAmount: values.maxDiscountAmount,
                    usageLimit: values.usageLimit,
                    status: values.status,
                    lastUpdatedDate: new Date().toISOString().split('T')[0],
                    lastModifiedBy: 'Current User'
                });
                message.success('Discount list updated successfully!');
            }

            setIsEditing(false);
        }).catch((errorInfo) => {
            console.log('Validation Failed:', errorInfo);
        });
    };

    const columns: ColumnsType<DiscountListData> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            responsive: ['xs', 'sm', 'md', 'lg'] as Breakpoint[],
            width: 100,
            render: (text: string, record: DiscountListData) => (
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
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            width: 200,
            responsive: ['md', 'lg'] as Breakpoint[],
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 120,
            responsive: ['md', 'lg'] as Breakpoint[],
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 120,
            responsive: ['md', 'lg'] as Breakpoint[],
        },
        {
            title: 'Type',
            dataIndex: 'discountType',
            key: 'discountType',
            width: 120,
            responsive: ['md', 'lg'] as Breakpoint[],
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: DiscountListData['status']) => {
                let color = status === 'Active' ? 'green' : status === 'Inactive' ? 'orange' : 'red';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Action',
            key: 'actions',
            width: 100,
            fixed: screens.xs ? false : 'right' as const,
            render: (_, record) => (
                <Space>
                    {/* <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewClick(record)}
                    /> */}
                    <Popconfirm
                        title="Delete this Discount List"
                        description="Are you sure you want to delete this discount list?"
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

    const discountItemColumns: ColumnsType<DiscountItemData> = [
        {
            title: 'Product ID',
            dataIndex: 'productId',
            key: 'productId',
            width: 100,
        },
        {
            title: 'Discount Value',
            dataIndex: 'discountValue',
            key: 'discountValue',
            width: 120,
            render: (value) => `${value}%`,
        },
        {
            title: 'Condition Rules',
            dataIndex: 'conditionRules',
            key: 'conditionRules',
            ellipsis: true,
            width: 150,
        },
        {
            title: 'Priority Level',
            dataIndex: 'priorityLevel',
            key: 'priorityLevel',
            width: 100,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            ellipsis: true,
            width: 150,
        },
    ];

    const renderViewContent = () => {
        if (!viewingRecord) return null;

        // Filter discount items for the current discount list
        const currentDiscountItems = discountItems.filter(item => item.discountListId === viewingRecord.id);

        return (
            <div>
                <Descriptions
                    column={screens.xs ? 1 : 2}
                    bordered
                    size="small"
                    style={{ marginBottom: '24px' }}
                >
                    <Descriptions.Item label="Discount List ID">{viewingRecord.id}</Descriptions.Item>
                    <Descriptions.Item label="Description">{viewingRecord.description}</Descriptions.Item>
                    <Descriptions.Item label="Start Date">{viewingRecord.startDate}</Descriptions.Item>
                    <Descriptions.Item label="End Date">{viewingRecord.endDate}</Descriptions.Item>
                    <Descriptions.Item label="Discount Type">{viewingRecord.discountType}</Descriptions.Item>
                    <Descriptions.Item label="Minimum Order Value">{viewingRecord.minOrderValue}</Descriptions.Item>
                    <Descriptions.Item label="Maximum Discount Amount">{viewingRecord.maxDiscountAmount}</Descriptions.Item>
                    <Descriptions.Item label="Usage Limit">{viewingRecord.usageLimit}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={viewingRecord.status === "Active" ? "green" : viewingRecord.status === "Inactive" ? "orange" : "red"}>
                            {viewingRecord.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created Date">{viewingRecord.createdDate}</Descriptions.Item>
                    <Descriptions.Item label="Last Updated Date">{viewingRecord.lastUpdatedDate}</Descriptions.Item>
                    <Descriptions.Item label="Created By">{viewingRecord.createdBy}</Descriptions.Item>
                    <Descriptions.Item label="Last Modified By">{viewingRecord.lastModifiedBy}</Descriptions.Item>
                </Descriptions>

                <h3 style={{ marginBottom: '16px' }}>Discount Items</h3>
                <div style={{ overflowX: 'auto' }}>
                    <Table
                        columns={discountItemColumns}
                        dataSource={currentDiscountItems}
                        pagination={{ pageSize: 5 }}
                        bordered
                        size="small"
                        scroll={{ x: 600 }}
                    />
                </div>
            </div>
        );
    };

    const renderEditForm = () => {
        return (
            <Form layout="vertical" form={editForm}>
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Discount List ID"
                            name="id"
                            rules={[{ required: true, message: "Discount List ID is required" }]}
                        >
                            <Input placeholder="Discount List ID" disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Discount List Name"
                            name="name"
                            rules={[{ required: true, message: "Discount list name is required" }]}
                        >
                            <Input placeholder="Enter discount list name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            label="Date Range"
                            name="dateRange"
                            rules={[{ required: true, message: "Please select date range" }]}
                        >
                            <RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Discount Type"
                            name="discountType"
                            rules={[{ required: true, message: "Please select discount type" }]}
                        >
                            <Select placeholder="Select Discount Type">
                                <Option value="Percentage">Percentage</Option>
                                <Option value="Fixed Amount">Fixed Amount</Option>
                                <Option value="Tiered">Tiered</Option>
                                <Option value="Volume-based">Volume-based</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: "Please select status" }]}
                        >
                            <Select>
                                <Option value="Active">Active</Option>
                                <Option value="Inactive">Inactive</Option>
                                <Option value="Expired">Expired</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Minimum Order Value"
                            name="minOrderValue"
                        >
                            <Input type="number" placeholder="Enter minimum order value" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Maximum Discount Amount"
                            name="maxDiscountAmount"
                        >
                            <Input type="number" placeholder="Enter maximum discount amount" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Usage Limit"
                            name="usageLimit"
                        >
                            <Input type="number" placeholder="Enter usage limit" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <TextArea rows={1} placeholder="Enter description" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    };

    return (
        <div style={{ backgroundColor: '#f4f6fa', minHeight: '100vh', overflowX: 'hidden' }} className='discount-page'>
            {/* Header */}
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Scheme And Discount</h1>
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
                                    Discount Management
                                </p>
                                <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
                                    Manage your discount schemes and promotions
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
                                    width: screens.xs ? '100%' : '190px',
                                    height: '48px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    background: '#6164A5',
                                    borderColor: '#4B6CB7',
                                }}
                                onClick={handleOpenModal}
                            >
                                <PlusOutlined /> Add Discount List
                            </Button>
                        </Col>
                    </Row>
                </Card>
                
               
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    {/* Search Input */}
                    <Col flex="auto">
                        <Input
                            prefix={<SearchOutlined style={{ color: "#B0B0B0", padding: '18px' }} />}
                            placeholder="Search discount lists by name, ID, or description..."
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
                        Discount Lists ({discountLists.length})
                    </h2>
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <Table
                            columns={columns}
                            dataSource={discountLists}
                            pagination={{ pageSize: 5 }}
                            bordered
                            scroll={{ x: screens.xs ? 800 : 'max-content' }}
                            size="middle"
                        />
                    </div>
                </div>
            </div>

            {/* Create Discount List Modal */}
            <Modal
                title="Create New Discount List"
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
                    padding: '24px'
                }}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                getContainer={false}
                forceRender
            >
                <p style={{ marginBottom: 20, color: "#666" }}>
                    Fill in the details below to create a new discount list.
                </p>

                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Discount List ID"
                                name="id"
                            >
                                <Input placeholder="Auto-generated" disabled />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Discount List Name"
                                name="name"
                                rules={[{ required: true, message: "Discount list name is required" }]}
                            >
                                <Input placeholder="Enter discount list name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label="Date Range"
                                name="dateRange"
                                rules={[{ required: true, message: "Please select date range" }]}
                            >
                                <RangePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Discount Type"
                                name="discountType"
                                rules={[{ required: true, message: "Please select discount type" }]}
                            >
                                <Select placeholder="Select Discount Type">
                                    <Option value="Percentage">Percentage</Option>
                                    <Option value="Fixed Amount">Fixed Amount</Option>
                                    <Option value="Tiered">Tiered</Option>
                                    <Option value="Volume-based">Volume-based</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Status"
                                name="status"
                                initialValue="Active"
                                rules={[{ required: true, message: "Please select status" }]}
                            >
                                <Select>
                                    <Option value="Active">Active</Option>
                                    <Option value="Inactive">Inactive</Option>
                                    <Option value="Expired">Expired</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Minimum Order Value"
                                name="minOrderValue"
                            >
                                <Input type="number" placeholder="Enter minimum order value" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Maximum Discount Amount"
                                name="maxDiscountAmount"
                            >
                                <Input type="number" placeholder="Enter maximum discount amount" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Usage Limit"
                                name="usageLimit"
                            >
                                <Input type="number" placeholder="Enter usage limit" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <TextArea rows={1} placeholder="Enter description" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* View/Edit Discount List Modal */}
            <Modal
                title={
                    isEditing
                        ? `Edit Discount List: ${viewingRecord?.name || ''}`
                        : `View Discount List: ${viewingRecord?.name || ''}`
                }
                open={isViewEditModalOpen}
                onOk={isEditing ? handleEditSubmit : handleCloseViewEditModal}
                onCancel={handleCloseViewEditModal}
                okText={isEditing ? "Update" : "Close"}
                cancelText={isEditing ? "Cancel Edit" : "Cancel"}
                width={screens.xs ? '95%' : 900}
                style={{ top: 20 }}
                bodyStyle={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    padding: '24px'
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

export default SchemeAndDiscount;