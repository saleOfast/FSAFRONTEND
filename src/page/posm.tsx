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
import '../style/stores.css';
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
    const [gridView, setGridView] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
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
        },
        {
            key: '2',
            posmId: "P002",
            posmCode: "POSM-1002",
            posmName: "Winter Promotion Standee",
            posmType: "Standee",
            quantityAllocated: 150,
            quantityDistributed: 140,
            quantityReturned: 10,
            distributorId: "D124",
            outletId: "O457",
            campaignId: "C790",
            startDate: "2025-10-01",
            endDate: "2025-12-31",
            status: "Active",
            assignedTo: "Jane Smith",
            remarks: "Near checkout counter"
        },
        {
            key: '3',
            posmId: "P003",
            posmCode: "POSM-1003",
            posmName: "Product Launch Flyer",
            posmType: "Flyer",
            quantityAllocated: 500,
            quantityDistributed: 450,
            quantityReturned: 50,
            distributorId: "D125",
            outletId: "O458",
            campaignId: "C791",
            startDate: "2025-08-15",
            endDate: "2025-09-15",
            status: "Inactive",
            assignedTo: "Mike Johnson",
            remarks: "Distributed to customers"
        },
        {
            key: '4',
            posmId: "P004",
            posmCode: "POSM-1004",
            posmName: "Festival Sale Banner",
            posmType: "Banner",
            quantityAllocated: 100,
            quantityDistributed: 95,
            quantityReturned: 5,
            distributorId: "D126",
            outletId: "O459",
            campaignId: "C792",
            startDate: "2025-10-20",
            endDate: "2025-11-20",
            status: "Active",
            assignedTo: "Sarah Williams",
            remarks: "Hanging at storefront"
        },
        {
            key: '5',
            posmId: "P005",
            posmCode: "POSM-1005",
            posmName: "Shelf Ticker - New Arrival",
            posmType: "Shelf Ticker",
            quantityAllocated: 300,
            quantityDistributed: 280,
            quantityReturned: 20,
            distributorId: "D127",
            outletId: "O460",
            campaignId: "C793",
            startDate: "2025-09-10",
            endDate: "2025-10-10",
            status: "Returned",
            assignedTo: "David Brown",
            remarks: "Placed on product shelves"
        },
        {
            key: '6',
            posmId: "P006",
            posmCode: "POSM-1006",
            posmName: "Clearance Sale Poster",
            posmType: "Poster",
            quantityAllocated: 250,
            quantityDistributed: 200,
            quantityReturned: 50,
            distributorId: "D128",
            outletId: "O461",
            campaignId: "C794",
            startDate: "2025-07-01",
            endDate: "2025-07-31",
            status: "Inactive",
            assignedTo: "Emily Davis",
            remarks: "Displayed in store windows"
        },
        {
            key: '7',
            posmId: "P007",
            posmCode: "POSM-1007",
            posmName: "Brand Awareness Standee",
            posmType: "Standee",
            quantityAllocated: 180,
            quantityDistributed: 175,
            quantityReturned: 5,
            distributorId: "D129",
            outletId: "O462",
            campaignId: "C795",
            startDate: "2025-11-01",
            endDate: "2025-12-31",
            status: "Active",
            assignedTo: "Robert Wilson",
            remarks: "At store entrance"
        },
        {
            key: '8',
            posmId: "P008",
            posmCode: "POSM-1008",
            posmName: "Holiday Special Flyer",
            posmType: "Flyer",
            quantityAllocated: 400,
            quantityDistributed: 380,
            quantityReturned: 20,
            distributorId: "D130",
            outletId: "O463",
            campaignId: "C796",
            startDate: "2025-12-01",
            endDate: "2025-12-31",
            status: "Active",
            assignedTo: "Lisa Anderson",
            remarks: "Handed out to customers"
        },
        {
            key: '9',
            posmId: "P009",
            posmCode: "POSM-1009",
            posmName: "Product Demo Banner",
            posmType: "Banner",
            quantityAllocated: 120,
            quantityDistributed: 100,
            quantityReturned: 20,
            distributorId: "D131",
            outletId: "O464",
            campaignId: "C797",
            startDate: "2025-08-01",
            endDate: "2025-08-31",
            status: "Lost",
            assignedTo: "James Martinez",
            remarks: "Used for product demonstration"
        },
        {
            key: '10',
            posmId: "P010",
            posmCode: "POSM-1010",
            posmName: "Seasonal Sale Shelf Ticker",
            posmType: "Shelf Ticker",
            quantityAllocated: 350,
            quantityDistributed: 320,
            quantityReturned: 30,
            distributorId: "D132",
            outletId: "O465",
            campaignId: "C798",
            startDate: "2025-10-15",
            endDate: "2025-11-15",
            status: "Active",
            assignedTo: "Maria Garcia",
            remarks: "Attached to product displays"
        },
        {
            key: '11',
            posmId: "P011",
            posmCode: "POSM-1011",
            posmName: "New Product Launch Poster",
            posmType: "Poster",
            quantityAllocated: 220,
            quantityDistributed: 200,
            quantityReturned: 20,
            distributorId: "D133",
            outletId: "O466",
            campaignId: "C799",
            startDate: "2025-09-20",
            endDate: "2025-10-20",
            status: "Active",
            assignedTo: "Thomas Lee",
            remarks: "Promoting new arrivals"
        }
    ]);

    const handleDelete = (record: POSM) => {
        // Filter out the deleted item
        const newData = data.filter(item => item.key !== record.key);
        setData(newData);
        message.success('POSM deleted successfully');
    };

    const handleGridView = () => {
        setGridView(true);
    };

    const handleListView = () => {
        setGridView(false);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
    };

    const filteredData = data.filter((item) => {
        const matchesSearch = !searchValue || 
            item.posmId?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.posmCode?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.posmName?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.posmType?.toLowerCase().includes(searchValue.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || 
            item.status?.toLowerCase() === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    });

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

    const handleEditClick = (record?: POSM) => {
        if (record) {
            handleViewClick(record);
            setIsEditing(true);
        } else {
            setIsEditing(true);
        }
    };

    const handleEditClickFromModal = () => {
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
        <div  style={{ fontFamily: 'roboto' }}>
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

                <div className="search">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search POSM by Name, Code, ID, Type"
                        allowClear
                        value={searchValue}
                        onChange={handleSearch}
                    />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                            <AppstoreOutlined style={{ fontSize: '15px' }} onClick={handleGridView} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginRight: '10px' }}>
                            <UnorderedListOutlined style={{ fontSize: '15px' }} onClick={handleListView} />
                        </div>
                    </div>
                    <div className="filterdiv">
                        <Select
                            defaultValue="all"
                            className="w-130"
                            value={statusFilter}
                            onChange={handleStatusFilter}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                            <Option value="returned">Returned</Option>
                            <Option value="lost">Lost</Option>
                        </Select>
                    </div>
                </div>

                {/* Grid/List View Section */}
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
                                        return "#52c41a";
                                    case "Inactive":
                                        return "#ff4d4f";
                                    case "Returned":
                                        return "#faad14";
                                    case "Lost":
                                        return "#ff4d4f";
                                    default:
                                        return "#d9d9d9";
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
                                            <div className="fontb">{item?.posmName}</div>
                                            <div
                                                style={{
                                                    background: getStatusColor(item?.status || ''),
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
                                                    {item?.posmType} | POSM ID: {item?.posmId}
                                                </div>
                                                <div className="fs-13">Code: <span className="fw-bold">{item?.posmCode}</span></div>
                                                <div className="fs-13">Allocated: <span className="fw-bold">{item?.quantityAllocated}</span></div>
                                                <div className="fs-13">Distributed: <span className="fw-bold">{item?.quantityDistributed}</span></div>
                                                <div className="fs-13">Assigned To: <span className="fw-bold">{item?.assignedTo}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <table className="store-table" style={{ textDecoration: 'none', fontSize: '13px', width: '100%', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th>POSM ID</th>
                                <th>POSM Code</th>
                                <th>POSM Name</th>
                                <th>Type</th>
                                <th>Quantity Allocated</th>
                                <th>Quantity Distributed</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData?.map((item: POSM, index: number) => {
                                const getStatusColor = (status: string) => {
                                    switch (status) {
                                        case "Active":
                                            return "#52c41a";
                                        case "Inactive":
                                            return "#ff4d4f";
                                        case "Returned":
                                            return "#faad14";
                                        case "Lost":
                                            return "#ff4d4f";
                                        default:
                                            return "#d9d9d9";
                                    }
                                };

                                return (
                                    <tr key={index}>
                                        <td>
                                            <a
                                                onClick={() => handleViewClick(item)}
                                                style={{ textDecoration: 'none', color: '#1890ff', cursor: 'pointer' }}
                                            >
                                                {item?.posmId}
                                            </a>
                                        </td>
                                        <td>{item?.posmCode}</td>
                                        <td>{item?.posmName}</td>
                                        <td>{item?.posmType}</td>
                                        <td>{item?.quantityAllocated}</td>
                                        <td>{item?.quantityDistributed}</td>
                                        <td>
                                            <span
                                                style={{
                                                    background: getStatusColor(item?.status || ''),
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    color: 'white',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {item?.status}
                                            </span>
                                        </td>
                                        <td>{item?.assignedTo}</td>
                                        <td>
                                            <Space>
                                                <EyeOutlined
                                                    onClick={() => handleViewClick(item)}
                                                    style={{ cursor: 'pointer', color: '#1890ff' }}
                                                />
                                                <EditOutlined
                                                    onClick={() => handleEditClick(item)}
                                                    style={{ cursor: 'pointer', color: '#52c41a' }}
                                                />
                                                <Popconfirm
                                                    title="Are you sure you want to delete this POSM?"
                                                    onConfirm={() => handleDelete(item)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <DeleteOutlined
                                                        style={{ cursor: 'pointer', color: '#ff4d4f' }}
                                                    />
                                                </Popconfirm>
                                            </Space>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
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
                    paddingRight: '8px',
                    overflowY: 'auto'
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
                    paddingRight: '8px',
                    overflowY: 'auto'
                }}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                getContainer={false}
                forceRender
                footer={[
                    !isEditing && (
                        <Button key="edit" type="primary" onClick={handleEditClickFromModal}>
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