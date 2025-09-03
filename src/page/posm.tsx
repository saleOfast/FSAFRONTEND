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
    DatePicker
} from 'antd';
import React, { useState } from 'react';
import previousPage from 'utils/previousPage';
import type { ColumnsType } from 'antd/es/table';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import { SearchOutlined } from "@ant-design/icons";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Option } = Select;


const { useBreakpoint } = Grid;
export interface POSM {
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
    const posmColumns = [
        {
            title: "POSM ID",
            dataIndex: "posmId",
            key: "posmId",
        },
        {
            title: "POSM Code",
            dataIndex: "posmCode",
            key: "posmCode",
        },
        {
            title: "POSM Name",
            dataIndex: "posmName",
            key: "posmName",
        },
        {
            title: "POSM Type",
            dataIndex: "posmType",
            key: "posmType",
        },
        {
            title: "Quantity Allocated",
            dataIndex: "quantityAllocated",
            key: "quantityAllocated",
        },
        {
            title: "Quantity Distributed",
            dataIndex: "quantityDistributed",
            key: "quantityDistributed",
        },
        {
            title: "Quantity Returned",
            dataIndex: "quantityReturned",
            key: "quantityReturned",
        },
        {
            title: "Distributor ID",
            dataIndex: "distributorId",
            key: "distributorId",
        },
        {
            title: "Outlet ID",
            dataIndex: "outletId",
            key: "outletId",
        },
        {
            title: "Campaign ID",
            dataIndex: "campaignId",
            key: "campaignId",
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Assigned To",
            dataIndex: "assignedTo",
            key: "assignedTo",
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
            key: "remarks",
        },
    ];


    const data: POSM[] =
        [
            {
                "posmId": "P001",
                "posmCode": "POSM-1001",
                "posmName": "Summer Sale Poster",
                "posmType": "Poster",
                "quantityAllocated": 200,
                "quantityDistributed": 180,
                "quantityReturned": 20,
                "distributorId": "D123",
                "outletId": "O456",
                "campaignId": "C789",
                "startDate": "2025-09-01",
                "endDate": "2025-09-30",
                "status": "Active",
                "assignedTo": "John Doe",
                "remarks": "Displayed at entrance"
            }

        ]

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
                                <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
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
                                onClick={handleOpenModal}   // <-- add this line
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
                            columns={posmColumns}
                            dataSource={data}
                            pagination={{ pageSize: 5 }}
                            bordered
                        // scroll={{ x: 'max-content' }}
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
                            >
                                <Select placeholder="Select POSM Type">
                                    <Select.Option value="poster">Poster</Select.Option>
                                    <Select.Option value="standee">Standee</Select.Option>
                                    <Select.Option value="shelfTicker">Shelf Ticker</Select.Option>
                                    <Select.Option value="flyer">Flyer</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Quantity Allocated"
                                name="quantityAllocated"
                            >
                                <Input type="number" placeholder="Enter allocated quantity" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Quantity Distributed"
                                name="quantityDistributed"
                            >
                                <Input type="number" placeholder="Enter distributed quantity" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Quantity Returned"
                                name="quantityReturned"
                            >
                                <Input type="number" placeholder="Enter returned quantity" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Distributor ID"
                                name="distributorId"
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
                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name="status"
                            >
                                <Select placeholder="Select Status">
                                    <Select.Option value="active">Active</Select.Option>
                                    <Select.Option value="inactive">Inactive</Select.Option>
                                    <Select.Option value="returned">Returned</Select.Option>
                                    <Select.Option value="lost">Lost</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Remarks"
                                name="remarks"
                            >
                                <Input.TextArea rows={2} placeholder="Enter remarks" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Created Date"
                                name="createdDate"
                            >
                                <DatePicker style={{ width: "100%" }} disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Last Updated Date"
                                name="lastUpdatedDate"
                            >
                                <DatePicker style={{ width: "100%" }} disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>


            </Modal>

        </div>
    );
};

export default PointOfSalesMaterial;
