import React, { useState } from "react";
import previousPage from "utils/previousPage";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Card, Tabs, Row, Col, Tag, Table, Switch, Space, Collapse } from "antd";

const { TabPane } = Tabs;
const { Panel } = Collapse;

const profiles = [
  {
    id: 1,
    name: "System Administrator",
    description: "Complete access to all functionality",
    users: 15,
    license: "Salesforce",
    lastModified: "Jan 15, 2024"
  },
  {
    id: 2,
    name: "Standard User",
    description: "Standard user access with basic permissions",
    users: 142,
    license: "Salesforce Platform",
    lastModified: "Feb 10, 2024"
  },
  {
    id: 3,
    name: "Sales Manager",
    description: "Sales-focused permissions with team management",
    users: 8,
    license: "Salesforce",
    lastModified: "Jan 28, 2024"
  },
];

// Tab Permissions Data
const tabData = [
  { key: 1, name: "Accounts", available: true, visible: true },
  { key: 2, name: "Contacts", available: true, visible: true },
  { key: 3, name: "Opportunities", available: true, visible: true },
  { key: 4, name: "Leads", available: true, visible: true },
  { key: 5, name: "Cases", available: false, visible: false },
  { key: 6, name: "Campaigns", available: false, visible: false },
  { key: 7, name: "Reports", available: true, visible: true },
];

// Object Permissions Data
const objectData = [
  { key: 1, object: "Account", create: true, read: true, edit: true, delete: false, viewAll: true, modifyAll: false },
  { key: 2, object: "Contact", create: true, read: true, edit: true, delete: false, viewAll: true, modifyAll: false },
  { key: 3, object: "Opportunity", create: true, read: true, edit: true, delete: true, viewAll: true, modifyAll: true },
  { key: 4, object: "Lead", create: true, read: true, edit: true, delete: false, viewAll: false, modifyAll: false },
  { key: 5, object: "Case", create: false, read: true, edit: false, delete: false, viewAll: false, modifyAll: false },
];

// System Permissions Data
const systemPermissionsData = [
  {
    key: 1,
    category: "Administrative Permissions",
    permissions: [
      { key: 'admin-1', name: "Modify All Data", enabled: true },
      { key: 'admin-2', name: "View All Data", enabled: true },
      { key: 'admin-3', name: "Manage Users", enabled: true },
      { key: 'admin-4', name: "View Setup and Configuration", enabled: true },
      { key: 'admin-5', name: "Customize Application", enabled: true },
    ]
  },
  {
    key: 2,
    category: "General User Permissions",
    permissions: [
      { key: 'general-1', name: "Edit Tasks", enabled: true },
      { key: 'general-2', name: "Edit Events", enabled: true },
      { key: 'general-3', name: "Import Leads", enabled: true },
      { key: 'general-4', name: "Transfer Leads", enabled: true },
      { key: 'general-5', name: "Create and Customize Reports", enabled: true },
    ]
  }
];

export default function Profile1() {
  const [selectedProfile, setSelectedProfile] = useState(profiles[0]);
  const [tabsData, setTabsData] = useState(tabData);
  const [objects, setObjects] = useState(objectData);
  const [systemPermissions, setSystemPermissions] = useState(systemPermissionsData);

  const handleToggleTab = (key: number, field: "available" | "visible") => {
    setTabsData((prev) =>
      prev.map((tab) =>
        tab.key === key ? { ...tab, [field]: !tab[field] } : tab
      )
    );
  };

  const handleToggleObject = (
    key: number,
    field: "create" | "read" | "edit" | "delete" | "viewAll" | "modifyAll"
  ) => {
    setObjects((prev) =>
      prev.map((obj) =>
        obj.key === key ? { ...obj, [field]: !obj[field] } : obj
      )
    );
  };

  const handleToggleSystemPermission = (categoryKey: number, permissionKey: string) => {
    setSystemPermissions(prev =>
      prev.map(category => {
        if (category.key === categoryKey) {
          return {
            ...category,
            permissions: category.permissions.map(permission =>
              permission.key === permissionKey
                ? { ...permission, enabled: !permission.enabled }
                : permission
            )
          };
        }
        return category;
      })
    );
  };

  // Tab Permissions Columns
  const tabColumns = [
    {
      title: <span className="font-bold">Tab Name</span>,
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-bold">{text}</span>,
    },
    {
      title: <span className="font-bold">Available</span>,
      dataIndex: "available",
      key: "available",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.available}
          onChange={() => handleToggleTab(record.key, "available")}
        />
      ),
    },
    {
      title: <span className="font-bold">Visible</span>,
      dataIndex: "visible",
      key: "visible",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.visible}
          onChange={() => handleToggleTab(record.key, "visible")}
        />
      ),
    },
  ];

  // Object Permissions Columns
  const objectColumns = [
    { 
      title: <span className="font-bold">Object</span>, 
      dataIndex: "object", 
      key: "object",
      render: (text: string) => <span className="font-bold">{text}</span>,
    },
    {
      title: <span className="font-bold">Create</span>,
      dataIndex: "create",
      key: "create",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.create}
          onChange={() => handleToggleObject(record.key, "create")}
        />
      ),
    },
    {
      title: <span className="font-bold">Read</span>,
      dataIndex: "read",
      key: "read",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.read}
          onChange={() => handleToggleObject(record.key, "read")}
        />
      ),
    },
    {
      title: <span className="font-bold">Edit</span>,
      dataIndex: "edit",
      key: "edit",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.edit}
          onChange={() => handleToggleObject(record.key, "edit")}
        />
      ),
    },
    {
      title: <span className="font-bold">Delete</span>,
      dataIndex: "delete",
      key: "delete",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.delete}
          onChange={() => handleToggleObject(record.key, "delete")}
        />
      ),
    },
    {
      title: <span className="font-bold">View All</span>,
      dataIndex: "viewAll",
      key: "viewAll",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.viewAll}
          onChange={() => handleToggleObject(record.key, "viewAll")}
        />
      ),
    },
    {
      title: <span className="font-bold">Modify All</span>,
      dataIndex: "modifyAll",
      key: "modifyAll",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.modifyAll}
          onChange={() => handleToggleObject(record.key, "modifyAll")}
        />
      ),
    },
  ];

  // System Permissions Columns
  const systemColumns = [
    {
      title: <span className="font-bold">Permission Name</span>,
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-bold">{text}</span>,
    },
    {
      title: <span className="font-bold">Enabled</span>,
      dataIndex: "enabled",
      key: "enabled",
      align: "center" as const,
      render: (enabled: boolean, record: any) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleSystemPermission(record.categoryKey, record.key)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header
        className="heading heading-container px-6"
        style={{ backgroundColor: "#8488BF" }}
      >
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18 font-bold">Profile</h1>
      </header>

      {/* Profile Layout */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {/* Main content container with proper spacing */}
        <div className="mx-6">
          <Row justify="space-between" align="middle" className="mb-6">
            <Col>
              <h1 className="text-2xl font-bold mb-2">
                {selectedProfile.name}
              </h1>
              <p className="text-gray-600 mb-2 font-medium">
                {selectedProfile.description}
              </p>
              <div className="flex items-center">
                <Tag color="blue" className="font-medium">{selectedProfile.license}</Tag>
                <span className="text-gray-500 ml-3 font-medium">
                  {selectedProfile.users} users assigned
                </span>
              </div>
            </Col>
            <Col>
              <Space>
                <Button type="default" icon={<EditOutlined />} className="font-medium">
                  Edit
                </Button>
                <Button type="default" icon={<CopyOutlined />} className="font-medium">
                  Clone
                </Button>
                <Button danger icon={<DeleteOutlined />} className="font-medium">
                  Delete
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Tabs - Added mt-8 for more spacing above the tabs */}
          <div className="mt-8">
            <Tabs defaultActiveKey="overview" type="card">
              <TabPane tab={<span className="font-bold">Overview</span>} key="overview">
                <Row gutter={16}>
                  {/* Profile Summary Card */}
                  <Col xs={24} md={8}>
                    <Card
                      title={<span className="font-bold">Profile Summary</span>}
                      headStyle={{
                        backgroundColor: '#f0f2f5',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #e8e8e8'
                      }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex flex-col justify-end flex-grow">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-600 font-bold">User License:</span>
                          <span className="text-sm font-bold">{selectedProfile.license}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-600 font-bold">Users Assigned:</span>
                          <span className="text-sm font-bold">{selectedProfile.users}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-bold">Last Modified:</span>
                          <span className="text-sm font-bold">{selectedProfile.lastModified}</span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  
                  {/* App Access Card */}
                  <Col xs={24} md={8}>
                    <Card
                      title={<span className="font-bold">App Access</span>}
                      headStyle={{
                        backgroundColor: '#f0f2f5',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #e8e8e8'
                      }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex flex-col justify-end flex-grow">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-600 font-bold">Visible Apps:</span>
                          <span className="text-sm font-bold">3/5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-bold">Default App:</span>
                          <span className="text-sm font-bold">Sales</span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  
                  {/* Object Access Card */}
                  <Col xs={24} md={8}>
                    <Card
                      title={<span className="font-bold">Object Access</span>}
                      headStyle={{
                        backgroundColor: '#f0f2f5',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #e8e8e8'
                      }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex flex-col justify-end flex-grow">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-600 font-bold">Standard Objects:</span>
                          <span className="text-sm font-bold">5/12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-bold">Custom Objects:</span>
                          <span className="text-sm font-bold">0/3</span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab={<span className="font-bold">Tabs</span>} key="tabs">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Tab Permissions</h3>
                  <p className="text-gray-500 font-medium">Control which tabs are available and visible to users with this profile</p>
                </div>
                <Card>
                  <Table
                    columns={tabColumns}
                    dataSource={tabsData}
                    pagination={false}
                    bordered
                    scroll={{ x: true }}
                  />
                </Card>
              </TabPane>

              <TabPane tab={<span className="font-bold">Object Permissions</span>} key="object">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">
                    Standard Object Permissions
                  </h3>
                  <p className="text-gray-500 font-medium">Manage CRUD permissions for standard objects</p>
                </div>
                <Card>
                  <Table
                    columns={objectColumns}
                    dataSource={objects}
                    pagination={false}
                    bordered
                    scroll={{ x: true }}
                  />
                </Card>
              </TabPane>

              <TabPane tab={<span className="font-bold">System Permissions</span>} key="system">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">System Permissions</h3>
                  <p className="text-gray-500 font-medium">Configure system-wide permissions for this profile</p>
                </div>
                <Row gutter={[16, 16]}>
                  {systemPermissions.map(category => (
                    <Col xs={24} lg={12} key={category.key}>
                      <Card
                        title={<span className="font-bold">{category.category}</span>}
                        className="mb-4"
                        headStyle={{ backgroundColor: '#f0f2f5', fontWeight: 'bold' }}
                      >
                        <Table
                          columns={systemColumns}
                          dataSource={category.permissions.map(p => ({
                            ...p,
                            categoryKey: category.key
                          }))}
                          pagination={false}
                          bordered
                          rowKey="key"
                          size="small"
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>

      <style>{
        `
        .ant-row-space-between {
          justify-content: space-between;
          margin: 15px;
        }
        .ant-tabs {
          margin: 15px;
        }
        .ant-tabs > .ant-tabs-nav {
          margin-top: 20px;
        }
        .ant-card-head-title {
          font-weight: 700 !important;
        }
        .font-medium {
          font-weight: 600;
        }
        .font-bold {
          font-weight: 700 !important;
        }
        .ant-card-body {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .ant-tabs-nav {
            width: 1420px !important; 
            padding-left: 5px;
        }
        .ant-table-thead > tr > th {
          font-weight: 700 !important;
        }
        @media (max-width: 768px) {
          .ant-tabs-nav {
            width: 100% !important;
            padding-left: 0;
          }
        }
        `
      }
      </style>
    </div>
  );
}