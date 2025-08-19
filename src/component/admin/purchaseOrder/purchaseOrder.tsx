import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Checkbox,
  Table,
  Modal,
} from 'antd';
import React, { useState } from 'react';
import previousPage from 'utils/previousPage';

const { Text } = Typography;
const { Option } = Select;

const masters = {
  accounts: [
    { id: 'acc1', name: 'Account 1' },
    { id: 'acc2', name: 'Account 2' },
  ],
  outlets: [
    { id: 'out1', name: 'Outlet 1' },
    { id: 'out2', name: 'Outlet 2' },
  ],
  billingAddresses: [
    { id: 'b1', name: 'Billing Address 1' },
    { id: 'b2', name: 'Billing Address 2' },
  ],
  shippingAddresses: [
    { id: 's1', name: 'Shipping Address 1' },
    { id: 's2', name: 'Shipping Address 2' },
  ],
  orderTypes: ['General Trade', 'Modern Trade'],
};

const summaryFields = [
  'Total SKU',
  'Total Cases',
  'Total Pieces',
  'Total Basic Value',
  'Total Discount',
  'Total Net Value',
  'GST',
  'Shipping',
];

const allProducts = [
  { id: 'p1', name: 'Parle G Biscuits', unitPrice: 20, tax: 2 },
  { id: 'p2', name: 'Coca-Cola 500ml', unitPrice: 50, tax: 5 },
  { id: 'p3', name: 'Dabur Honey 250g', unitPrice: 150, tax: 15 },
  { id: 'p4', name: 'Maggi Noodles 2-Minute', unitPrice: 12, tax: 1.2 },
  { id: 'p5', name: 'Britannia Marie Gold', unitPrice: 25, tax: 2.5 },
];

const PurchaseOrder: React.FC = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newProductName, setNewProductName] = useState('');

  const handleRemoveProduct = (key: string) => {
    setProducts(products.filter(p => p.key !== key));
  };

  const handleAddProduct = (product: any) => {
    const newProduct = {
      key: `${products.length + 1}`,
      name: product.name,
      quantity: 1,
      unitPrice: product.unitPrice,
      tax: product.tax,
      total: product.unitPrice + product.tax,
    };
    setProducts([...products, newProduct]);
  };

  const handleAddNewProduct = () => {
    if (!newProductName.trim()) return;
    handleAddProduct({ name: newProductName, unitPrice: 0, tax: 0 });
    setNewProductName('');
    setIsModalVisible(false);
  };

  const handleEditProduct = (key: string, field: string, value: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.key === key
          ? {
            ...p,
            [field]: value,
            total:
              (field === 'quantity' ? value : p.quantity) *
              (field === 'unitPrice' ? value : p.unitPrice) +
              (field === 'tax' ? value : p.tax),
          }
          : p
      )
    );
  };

  const productColumns = [
    { title: 'Product', dataIndex: 'name', key: 'name' },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (val: number, record: any) => (
        <Input
          type="number"
          value={val}
          min={1}
          onChange={e => handleEditProduct(record.key, 'quantity', Number(e.target.value))}
        />
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (val: number, record: any) => (
        <Input
          type="number"
          value={val}
          min={0}
          onChange={e => handleEditProduct(record.key, 'unitPrice', Number(e.target.value))}
        />
      ),
    },
    {
      title: 'Tax',
      dataIndex: 'tax',
      key: 'tax',
      render: (val: number, record: any) => (
        <Input
          type="number"
          value={val}
          min={0}
          onChange={e => handleEditProduct(record.key, 'tax', Number(e.target.value))}
        />
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (val: number) => `₹ ${val.toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="link" danger onClick={() => handleRemoveProduct(record.key)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: '#8488BF' }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Purchase Order</h1>
      </header>

      <div className="content-container" style={{ padding: 16, fontWeight: 600, fontFamily: 'Inter' }}>
        <h2 style={{ marginBottom: 16 }}>Create Purchase Order</h2>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Card title={<span style={{ color: '#fff' }}>Purchase Order Details</span>} headStyle={{ background: '#8488BF' }}>
              <Form form={form} layout="vertical">
                <Row gutter={[16, 16]}>
                  {[
                    { label: 'Account Name', name: 'account', options: masters.accounts, placeholder: 'Select Account', required: true },
                    { label: 'Outlet Name', name: 'outlet', options: masters.outlets, placeholder: 'Select Outlet', required: true },
                    { label: 'PO Reference No', name: 'poRef', placeholder: 'Enter PO Number', required: false },
                    { label: 'Order Type', name: 'orderType', options: masters.orderTypes, placeholder: 'Select Order Type', required: true },
                  ].map((field, index) => (
                    <Col xs={24} md={12} key={index}>
                      <Form.Item
                        label={field.label}
                        name={field.name}
                        rules={field.required ? [{ required: true, message: `Please select ${field.label}` }] : []}
                      >
                        {field.options ? (
                          <Select placeholder={field.placeholder}>
                            {field.options.map((opt: any) =>
                              typeof opt === 'string' ? <Option key={opt} value={opt}>{opt}</Option> : <Option key={opt.id} value={opt.id}>{opt.name}</Option>
                            )}
                          </Select>
                        ) : (
                          <Input placeholder={field.placeholder} />
                        )}
                      </Form.Item>
                    </Col>
                  ))}
                </Row>

                <Card type="inner" style={{ borderRadius: 8, marginTop: 16 }}>
                  <Row gutter={8} style={{ marginBottom: 16 }}>
                    <Col flex="auto">
                      <Select
                        showSearch
                        placeholder="Search product to add to order"
                        style={{ width: '100%' }}
                        value={undefined}
                        onSearch={setSearchText}
                        onSelect={(value) => {
                          const product = allProducts.find(p => p.id === value);
                          if (product) handleAddProduct(product);
                          setSearchText('');
                        }}
                        filterOption={(input, option) => {
                          if (!option) return false; // if option is undefined, return false

                          const children = option.children;

                          const text = Array.isArray(children)
                            ? children.join('')
                            : typeof children === 'string'
                              ? children
                              : '';

                          return text.toLowerCase().includes(input.toLowerCase());
                        }}

                      >
                        {allProducts.filter(p => p.name.toLowerCase().includes(searchText.toLowerCase())).map(p => (
                          <Option key={p.id} value={p.id}>{p.name}</Option>
                        ))}
                      </Select>
                    </Col>
                    <Col>
                      <Button type="primary" onClick={() => setIsModalVisible(true)}>Add Product</Button>
                    </Col>
                  </Row>

                  {products.length > 0 ? (
                    <Table
                      columns={productColumns}
                      dataSource={products}
                      pagination={false}
                      bordered
                      size="middle"
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#8c8c8c', padding: 40 }}>
                      <div style={{ fontSize: 16, fontWeight: 500 }}>No results found</div>
                      <div style={{ fontSize: 14, marginTop: 4 }}>Search for products to add to your purchase order</div>
                    </div>
                  )}
                </Card>
              </Form>
            </Card>

            <Card title="Billing & Shipping" style={{ marginTop: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Select placeholder="Select Billing Address" style={{ width: '100%' }}>
                    {masters.billingAddresses.map(addr => <Option key={addr.id} value={addr.id}>{addr.name}</Option>)}
                  </Select>
                </Col>
                <Col xs={24} md={12}>
                  <Select placeholder="Select Shipping Address" style={{ width: '100%' }}>
                    {masters.shippingAddresses.map(addr => <Option key={addr.id} value={addr.id}>{addr.name}</Option>)}
                  </Select>
                </Col>
              </Row>

              <Checkbox style={{ marginTop: 12 }}>Alternative Address</Checkbox>

              <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
                <Col xs={24} md={12}>
                  <Text>Expected Delivery Date:</Text>
                  <DatePicker style={{ width: '100%', marginTop: 8 }} placeholder="Select date" />
                </Col>
                <Col xs={24} md={12}>
                  <Text>PO Expiry Date <span style={{ color: 'red' }}>*</span></Text>
                  <DatePicker style={{ width: '100%', marginTop: 8 }} placeholder="Select date" />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title={<span style={{ color: '#fff' }}>Summary</span>} headStyle={{ background: '#8488BF' }}>
              {summaryFields.map((label, idx) => (
                <Row justify="space-between" key={idx}>
                  <Col>{label}:</Col>
                  <Col>{label.includes('Value') || label === 'GST' ? '₹ 0.00' : 0}</Col>
                </Row>
              ))}

              <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0', paddingTop: 8 }} />
              <Row justify="space-between">
                <Col><Text strong>Grand Total:</Text></Col>
                <Col><Text strong style={{ color: '#1677ff' }}>₹ 0.00</Text></Col>
              </Row>

              <Button type="primary" block style={{ marginTop: 12, backgroundColor: '#8488BF' }}>Save as Draft</Button>
              <Button block style={{ marginTop: 8 }}>Preview Order</Button>
              <Button danger type="primary" block style={{ marginTop: 8, backgroundColor: '#f9595eff' }}>Submit Order</Button>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        title="Add New Product"
        open={isModalVisible}
        onOk={handleAddNewProduct}
        onCancel={() => setIsModalVisible(false)}
        okText="Add"
      >
        <Input
          placeholder="Enter product name"
          value={newProductName}
          onChange={e => setNewProductName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default PurchaseOrder;
