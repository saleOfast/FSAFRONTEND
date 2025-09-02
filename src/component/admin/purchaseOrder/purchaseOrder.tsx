import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
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
  Grid,
  InputNumber,
  Modal,
} from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import previousPage from 'utils/previousPage';

const { Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

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
  units: ['Box', 'Packet', 'piece'],

  productCategories: [
    'Beverages',
    'Snacks',
    'Dairy',
    'Bakery',
    'Personal Care',
    'Household',
    'Frozen Foods'
  ]
};

const allProducts = [
  { id: 'P101', name: 'Parle G Biscuits', unitPrice: 20, tax: 2, category: 'Snacks' },
  { id: 'P102', name: 'Coca-Cola 500ml', unitPrice: 50, tax: 5, category: 'Beverages' },
  { id: 'P103', name: 'Dabur Honey 250g', unitPrice: 150, tax: 15, category: 'Personal Care' },
  { id: 'P104', name: 'Maggi Noodles 2-Minute', unitPrice: 12, tax: 1.2, category: 'Snacks' },
  { id: 'P105', name: 'Britannia Marie Gold', unitPrice: 25, tax: 2.5, category: 'Bakery' },
  { id: 'P106', name: 'Amul Milk 1L', unitPrice: 60, tax: 6, category: 'Dairy' },
  { id: 'P107', name: 'Surf Excel', unitPrice: 200, tax: 20, category: 'Household' },
];

const PurchaseOrder: React.FC = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<any[]>([]);
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('percentage');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalSearchText, setModalSearchText] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredProducts, setFilteredProducts] = useState<any[]>(allProducts);
  const [editingProducts, setEditingProducts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const screens = useBreakpoint();

  useEffect(() => {
    let filtered = allProducts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (modalSearchText) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(modalSearchText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, modalSearchText]);

  const showModal = () => {
    setIsModalVisible(true);
    setSelectedProducts([]);
    setModalSearchText('');
    setSelectedCategory('All');
    setEditingProducts([]);
    setIsEditing(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedProducts([]);
    setModalSearchText('');
    setSelectedCategory('All');
    setEditingProducts([]);
    setIsEditing(false);
  };

  const handleModalSubmit = () => {
    // Add the editing products to the main products list with unique keys
    const productsWithUniqueKeys = editingProducts.map(product => ({
      ...product,
      key: `${Date.now()}-${product.id}` // Create unique key using timestamp and product ID
    }));

    setProducts([...products, ...productsWithUniqueKeys]);
    setIsModalVisible(false);
    setSelectedProducts([]);
    setModalSearchText('');
    setSelectedCategory('All');
    setEditingProducts([]);
    setIsEditing(false);
  };

  const handleModalProductSelect = (product: any) => {
    if (!selectedProducts.some(p => p.id === product.id)) {
      const newSelectedProduct = {
        key: `${Date.now()}-${selectedProducts.length}`,
        id: product.id,
        name: product.name,
        category: product.category,
        unitPrice: product.unitPrice,
        tax: product.tax,
      };
      setSelectedProducts([...selectedProducts, newSelectedProduct]);

      // Also add to editing products with default values
      const newEditingProduct = {
        key: `${Date.now()}-${editingProducts.length}`,
        id: product.id,
        name: product.name,
        qty: 1,
        piece: 0, // Add missing piece field
        unit: masters.units[0],
        unitPrice: product.unitPrice,
        discountPercentage: 10,
        discountAmount: (product.unitPrice * 0.1),
        tax: product.tax,
        distributorPrice: product.unitPrice - (product.unitPrice * 0.1), // Add distributor price calculation
      };
      setEditingProducts([...editingProducts, newEditingProduct]);
    }
  };

  const handleModalProductRemove = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    setEditingProducts(editingProducts.filter(p => p.id !== productId));
  };

  const handleEditProductInModal = (key: string, field: string, value: any) => {
    setEditingProducts((prev) =>
      prev.map((p) => {
        if (p.key === key) {
          const updatedProduct = { ...p, [field]: value };

          // If discount percentage changes, recalculate discount amount
          if (field === 'discountPercentage') {
            updatedProduct.discountAmount = (updatedProduct.unitPrice * (value || 0)) / 100;
          }

          // If discount amount changes, recalculate discount percentage
          if (field === 'discountAmount') {
            updatedProduct.discountPercentage = updatedProduct.unitPrice > 0
              ? ((value || 0) / updatedProduct.unitPrice) * 100
              : 0;
          }

          // Recalculate distributor price when unit price or discount changes
          if (field === 'unitPrice' || field === 'discountPercentage' || field === 'discountAmount') {
            updatedProduct.distributorPrice = updatedProduct.unitPrice - (updatedProduct.discountAmount || 0);
          }

          return updatedProduct;
        }
        return p;
      })
    );
  };

  const handleRemoveProduct = (key: string) => {
    setProducts(products.filter((p) => p.key !== key));
  };

  const handleEditProduct = (key: string, field: string, value: any) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.key === key) {
          const updatedProduct = { ...p, [field]: value };

          // If discount percentage changes, recalculate discount amount
          if (field === 'discountPercentage') {
            updatedProduct.discountAmount = (updatedProduct.unitPrice * (value || 0)) / 100;
          }

          // If discount amount changes, recalculate discount percentage
          if (field === 'discountAmount') {
            updatedProduct.discountPercentage = updatedProduct.unitPrice > 0
              ? ((value || 0) / updatedProduct.unitPrice) * 100
              : 0;
          }

          // If unit price changes, recalculate discount amounts
          if (field === 'unitPrice') {
            if (discountType === 'percentage') {
              updatedProduct.discountAmount = (value * (updatedProduct.discountPercentage || 0)) / 100;
            } else {
              updatedProduct.discountPercentage = value > 0
                ? ((updatedProduct.discountAmount || 0) / value) * 100
                : 0;
            }
          }

          // Recalculate distributor price
          updatedProduct.distributorPrice = updatedProduct.unitPrice - (updatedProduct.discountAmount || 0);

          return updatedProduct;
        }
        return p;
      })
    );
  };

  const summary = useMemo(() => {
    let totalSKU = products.length;
    let totalQty = 0;
    let totalPieces = 0;
    let basicValue = 0;
    let discountValue = 0;
    let gst = 0;

    products.forEach((p) => {
      const qty = p.qty || 0;
      const pcs = p.piece || 0;
      const lineBasic = (qty + pcs) * p.unitPrice;
      const lineDiscount = p.discountAmount || 0;
      const lineNet = lineBasic - lineDiscount;
      const lineGst = (lineNet * p.tax) / 100;

      totalQty += qty;
      totalPieces += pcs;
      basicValue += lineBasic;
      discountValue += lineDiscount;
      gst += lineGst;
    });

    const netValue = basicValue - discountValue;
    const grandTotal = netValue + gst;

    return {
      totalSKU,
      totalQty,
      totalPieces,
      basicValue,
      discountValue,
      netValue,
      gst,
      grandTotal,
    };
  }, [products]);

  // Fix the parser functions to return numbers
  const currencyParser = (value: string | undefined): number => {
    return Number(value?.replace('₹', '') || 0);
  };

  const percentageParser = (value: string | undefined): number => {
    return Number(value?.replace('%', '') || 0);
  };

  const productColumns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      render: (val: string, record: any) => (
        <Select
          value={val}
          style={{ width: 100 }}
          onChange={(value) => handleEditProduct(record.key, 'unit', value)}
        >
          {masters.units.map((u) => (
            <Option key={u} value={u}>
              {u}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      render: (val: number, record: any) => (
        <Input
          type="number"
          value={val}
          min={0}
          onChange={(e) =>
            handleEditProduct(record.key, 'qty', Number(e.target.value || 0))
          }
        />
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (val: number, record: any) => (
        <InputNumber
          value={val}
          min={0}
          formatter={value => `₹${value}`}
          parser={currencyParser}
          onChange={(value) => handleEditProduct(record.key, 'unitPrice', Number(value || 0))}
        />
      ),
    },
    {
      title: 'Discount Type',
      key: 'discountType',
      render: () => (
        <Select
          value={discountType}
          style={{ width: 120 }}
          onChange={(value) => setDiscountType(value)}
        >
          <Option value="percentage">Percentage</Option>
          <Option value="amount">Amount</Option>
        </Select>
      ),
    },
    {
      title: discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount',
      key: 'discount',
      render: (_: any, record: any) => {
        if (discountType === 'percentage') {
          return (
            <InputNumber
              value={record.discountPercentage}
              min={0}
              max={100}
              formatter={value => `${value}%`}
              parser={percentageParser}
              onChange={(value) => handleEditProduct(record.key, 'discountPercentage', Number(value || 0))}
            />
          );
        } else {
          return (
            <InputNumber
              value={record.discountAmount}
              min={0}
              formatter={value => `₹${value}`}
              parser={currencyParser}
              onChange={(value) => handleEditProduct(record.key, 'discountAmount', Number(value || 0))}
            />
          );
        }
      },
    },
    {
      title: 'Distributor Price',
      dataIndex: 'distributorPrice',
      key: 'distributorPrice',
      render: (val: number) => <span>₹{val ? val.toFixed(2) : '0.00'}</span>,
    },
    {
      title: 'Total Price',
      key: 'total',
      render: (_: any, record: any) => {
        const total =
          (record.qty + (record.piece || 0)) * record.unitPrice - (record.discountAmount || 0);
        return <span>₹{Math.max(total, 0).toFixed(2)}</span>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 12 }}>
          <EditOutlined
            style={{ color: '#1677ff', fontSize: 18, cursor: 'pointer' }}
            onClick={() => {
              console.log("Edit clicked for:", record);
            }}
          />
          <DeleteOutlined
            style={{ color: 'red', fontSize: 18, cursor: 'pointer' }}
            onClick={() => handleRemoveProduct(record.key)}
          />
        </div>
      ),
    },
  ];

  // Columns for the product selection table in modal
  const modalProductColumns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Product ID', dataIndex: 'id', key: 'id' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    {
      title: 'Select',
      key: 'select',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleModalProductSelect(record)}
          disabled={selectedProducts.some(p => p.id === record.id)}
        >
          Select
        </Button>
      ),
    },
  ];

  // Columns for the editing table in modal - Removed Edit icon
  const modalEditColumns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Product ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      render: (val: number, record: any) => (
        <InputNumber
          value={val}
          min={1}
          onChange={(value) => handleEditProductInModal(record.key, 'qty', Number(value || 1))}
        />
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      render: (val: string, record: any) => (
        <Select
          value={val}
          style={{ width: 100 }}
          onChange={(value) => handleEditProductInModal(record.key, 'unit', value)}
        >
          {masters.units.map((u) => (
            <Option key={u} value={u}>
              {u}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (val: number, record: any) => (
        <InputNumber
          value={val}
          min={0}
          formatter={value => `₹${value}`}
          parser={currencyParser}
          onChange={(value) => handleEditProductInModal(record.key, 'unitPrice', Number(value || 0))}
        />
      ),
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (val: number, record: any) => (
        <InputNumber
          value={val}
          min={0}
          max={100}
          formatter={value => `${value}%`}
          parser={percentageParser}
          onChange={(value) => handleEditProductInModal(record.key, 'discountPercentage', Number(value || 0))}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <DeleteOutlined
          style={{ color: 'red', fontSize: 18, cursor: 'pointer' }}
          onClick={() => handleModalProductRemove(record.id)}
        />
      ),
    },
  ];

  return (
    <div>
      <header
        className="heading heading-container"
        style={{ backgroundColor: '#8488BF' }}
      >
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Purchase Order</h1>
      </header>

      <div
        className="content-container"
        style={{ padding: 16, fontWeight: 600, fontFamily: 'Inter' }}
      >
        <h2 style={{ marginBottom: 16 }}>Create Purchase Order</h2>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Card
              title={<span style={{ color: '#fff' }}>Purchase Order Details</span>}
              headStyle={{ background: '#8488BF' }}
            >
              <Form form={form} layout="vertical">
                <Row gutter={[16, 16]}>
                  {[
                    {
                      label: 'Account Name',
                      name: 'account',
                      options: masters.accounts,
                      placeholder: 'Select Account',
                      required: true,
                    },
                    {
                      label: 'Outlet Name',
                      name: 'outlet',
                      options: masters.outlets,
                      placeholder: 'Select Outlet',
                      required: true,
                    },
                    {
                      label: 'PO Reference No',
                      name: 'poRef',
                      placeholder: 'Enter PO Number',
                      required: false,
                    },

                    {
                      label: 'PO Expiry Date',
                      name: 'poExpiryDate',
                      type: 'date',
                      placeholder: 'Select Expiry Date',
                      required: false,
                    },

                    {
                      label: 'Order Type',
                      name: 'orderType',
                      options: masters.orderTypes,
                      placeholder: 'Select Order Type',
                      required: true,
                    },
                  ].map((field, index) => (
                    <Col xs={24} md={12} key={index}>
                      <Form.Item
                        label={field.label}
                        name={field.name}
                        rules={
                          field.required
                            ? [
                              {
                                required: true,
                                message: `Please select ${field.label}`,
                              },
                            ]
                            : []
                        }
                      >
                        {field.options ? (
                          <Select placeholder={field.placeholder}>
                            {field.options.map((opt: any) =>
                              typeof opt === 'string' ? (
                                <Option key={opt} value={opt}>
                                  {opt}
                                </Option>
                              ) : (
                                <Option key={opt.id} value={opt.id}>
                                  {opt.name}
                                </Option>
                              )
                            )}
                          </Select>
                        ) : field.type === 'date' ? (
                          <DatePicker
                            placeholder={field.placeholder}
                            style={{ width: '100%' }}
                          />
                        ) : (
                          <Input placeholder={field.placeholder} />
                        )}
                      </Form.Item>
                    </Col>
                  ))}
                </Row>

                {/* ---- Product Table ---- */}
                <Card type="inner" style={{ borderRadius: 8, marginTop: 16 }}>
                  <Row gutter={8} style={{ marginBottom: 16 }}>
                    <Col span={24} style={{ textAlign: "right" }}>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                      >
                        Add Product
                      </Button>
                    </Col>
                  </Row>
                  {products.length > 0 ? (
                    screens.md ? (
                      <Table
                        columns={productColumns as any}
                        dataSource={products}
                        pagination={false}
                        bordered
                        size="middle"
                      />
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12,
                          width: '100%',
                        }}
                      >
                        {products.map((p) => (
                          <Card
                            key={p.key}
                            size="small"
                            className='ant-card ant-card-body'
                            style={{
                              border: '1px solid ',
                              backgroundColor: '#f0f2f7',
                              width: '100%',
                            }}
                          >
                            <Row justify="space-between" align="middle">
                              <Col>
                                <b>{p.name}</b>
                              </Col>
                              <Col>
                                <DeleteOutlined
                                  style={{ color: 'red' }}
                                  onClick={() => handleRemoveProduct(p.key)}
                                />
                              </Col>
                            </Row>
                            <Row style={{ marginTop: 8 }}>
                              <Col span={12}>
                                <Text>Price:</Text>
                                <InputNumber
                                  value={p.unitPrice}
                                  min={0}
                                  formatter={value => `₹${value}`}
                                  parser={currencyParser}
                                  onChange={(value) => handleEditProduct(p.key, 'unitPrice', Number(value || 0))}
                                />
                              </Col>
                              <Col span={12}>
                                <Text>Discount:</Text>
                                {discountType === 'percentage' ? (
                                  <InputNumber
                                    value={p.discountPercentage}
                                    min={0}
                                    max={100}
                                    formatter={value => `${value}%`}
                                    parser={percentageParser}
                                    onChange={(value) => handleEditProduct(p.key, 'discountPercentage', Number(value || 0))}
                                  />
                                ) : (
                                  <InputNumber
                                    value={p.discountAmount}
                                    min={0}
                                    formatter={value => `₹${value}`}
                                    parser={currencyParser}
                                    onChange={(value) => handleEditProduct(p.key, 'discountAmount', Number(value || 0))}
                                  />
                                )}
                              </Col>
                            </Row>
                            <Row style={{ marginTop: 8 }} gutter={12}>
                              <Col span={12}>
                                <Text>Qty:</Text>
                                <Input
                                  type="number"
                                  value={p.qty}
                                  min={0}
                                  onChange={(e) =>
                                    handleEditProduct(
                                      p.key,
                                      'qty',
                                      Number(e.target.value || 0)
                                    )
                                  }
                                />
                              </Col>
                              <Col span={12}>
                                <Text>Piece:</Text>
                                <Input
                                  type="number"
                                  value={p.piece || 0}
                                  min={0}
                                  onChange={(e) =>
                                    handleEditProduct(
                                      p.key,
                                      'piece',
                                      Number(e.target.value || 0)
                                    )
                                  }
                                />
                              </Col>
                            </Row>
                            {/* Unit and Discount Type in a single row on mobile */}
                            <Row style={{ marginTop: 8 }} gutter={12}>
                              <Col span={12}>
                                <Text>Unit:</Text>
                                <Select
                                  value={p.unit}
                                  style={{ width: '100%' }}
                                  onChange={(value) => handleEditProduct(p.key, 'unit', value)}
                                >
                                  {masters.units.map((u) => (
                                    <Option key={u} value={u}>
                                      {u}
                                    </Option>
                                  ))}
                                </Select>
                              </Col>
                              <Col span={12}>
                                <Text>Discount Type:</Text>
                                <Select
                                  value={discountType}
                                  style={{ width: '100%' }}
                                  onChange={(value) => setDiscountType(value)}
                                >
                                  <Option value="percentage">Percentage</Option>
                                  <Option value="amount">Amount</Option>
                                </Select>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                      </div>
                    )
                  ) : (
                    <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                      No products added yet. Click "Add Product" to get started.
                    </div>
                  )}
                </Card>
              </Form>
            </Card>

            {/* ---- Billing & Shipping ---- */}
            <Card title="Billing & Shipping" style={{ marginTop: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Select placeholder="Select Billing Address" style={{ width: '100%' }}>
                    {masters.billingAddresses.map((addr) => (
                      <Option key={addr.id} value={addr.id}>
                        {addr.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} md={12}>
                  <Select placeholder="Select Shipping Address" style={{ width: '100%' }}>
                    {masters.shippingAddresses.map((addr) => (
                      <Option key={addr.id} value={addr.id}>
                        {addr.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>

              <Checkbox style={{ marginTop: 12 }}>Alternative Address</Checkbox>

              <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
                <Col xs={24} md={12}>
                  <Text>Expected Delivery Date:</Text>
                  <DatePicker
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="Select date"
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* ---- Summary ---- */}
          <Col xs={24} md={8}>
            <Card
              title={<span style={{ color: '#fff' }}>Summary</span>}
              headStyle={{ background: '#8488BF' }}
            >
              <Row justify="space-between">
                <Col>Total SKU:</Col>
                <Col>{summary.totalSKU}</Col>
              </Row>
              <Row justify="space-between">
                <Col>Total Qty:</Col>
                <Col>{summary.totalQty}</Col>
              </Row>
              <Row justify="space-between">
                {/* <Col>Total Pieces:</Col> */}
                {/* <Col>{summary.totalPieces}</Col> */}
              </Row>
              <Row justify="space-between">
                <Col>Total Basic Value:</Col>
                <Col>₹{summary.basicValue.toFixed(2)}</Col>
              </Row>
              <Row justify="space-between">
                <Col>Total Discount:</Col>
                <Col>₹{summary.discountValue.toFixed(2)}</Col>
              </Row>
              <Row justify="space-between">
                <Col>Net Value:</Col>
                <Col>₹{summary.netValue.toFixed(2)}</Col>
              </Row>
              <Row justify="space-between">
                <Col>GST:</Col>
                <Col>₹{summary.gst.toFixed(2)}</Col>
              </Row>
              <div
                style={{
                  borderTop: '1px solid #f0f0f0',
                  margin: '8px 0',
                  paddingTop: 8,
                }}
              />
              <Row justify="space-between">
                <Col>
                  <Text strong>Grand Total:</Text>
                </Col>
                <Col>
                  <Text strong style={{ color: '#1677ff' }}>
                    ₹{summary.grandTotal.toFixed(2)}
                  </Text>
                </Col>
              </Row>

              <Button
                type="primary"
                block
                style={{ marginTop: 12, backgroundColor: '#8488BF' }}
              >
                Save as Draft
              </Button>
              <Button block style={{ marginTop: 8 }}>
                Preview Order
              </Button>
              <Button
                danger
                type="primary"
                block
                style={{ marginTop: 8, backgroundColor: '#f9595eff' }}
              >
                Submit Order
              </Button>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Add Product Modal */}
      <Modal
        title="Add Products"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        width={900}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleModalSubmit}
            icon={<SaveOutlined />}
          >
            Submit
          </Button>,
        ]}
      >
        {/* Category filter and search bar in a single row on mobile */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          {screens.md ? (
            <>
              <Col xs={24} sm={5}>
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  style={{ width: '100%' }}
                >
                  <Option value="All">All Categories</Option>
                  {masters.productCategories.map(category => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={19}>
                <Input
                  placeholder="Search products by name"
                  value={modalSearchText}
                  onChange={(e) => setModalSearchText(e.target.value)}
                />
              </Col>
            </>
          ) : (
            <Col xs={24}>
              <Row gutter={8}>
                <Col span={10}>
                  <Select
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    style={{ width: '100%' }}
                  >
                    <Option value="All">All Categories</Option>
                    {masters.productCategories.map(category => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={14}>
                  <Input
                    placeholder="Search products"
                    value={modalSearchText}
                    onChange={(e) => setModalSearchText(e.target.value)}
                  />
                </Col>
              </Row>
            </Col>
          )}
        </Row>

        {/* Product Selection Table - Mobile Card View */}
        <Text strong style={{ display: 'block', marginBottom: 12 }}>Available Products:</Text>
        {screens.md ? (
          <Table
            columns={modalProductColumns}
            dataSource={filteredProducts}
            pagination={{ pageSize: 5 }}
            size="small"
            style={{ marginBottom: 16 }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              width: '100%',
              marginBottom: 16
            }}
          >
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                size="small"
                style={{
                  border: '1px solid #e8e8e8',
                  backgroundColor: selectedProducts.some(p => p.id === product.id)
                    ? '#f0f9ff'
                    : '#fafafa',
                }}
              >
                <Row justify="space-between" align="middle">
                  <Col span={18}>
                    <div><strong>{product.name}</strong></div>
                    <div>ID: {product.id}</div>
                    <div>Category: {product.category}</div>
                  </Col>
                  <Col span={6} style={{ textAlign: 'right' }}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleModalProductSelect(product)}
                      disabled={selectedProducts.some(p => p.id === product.id)}
                    >
                      {selectedProducts.some(p => p.id === product.id) ? 'Selected' : 'Select'}
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        )}

        {/* Selected Products Editing Table - Mobile Card View */}
        {editingProducts.length > 0 && (
          <div>
            <Text strong style={{ display: 'block', marginBottom: 12, fontWeight: 600, fontSize: 16 }}>
              Selected Products:
            </Text>
            {screens.md ? (
              <Table
                columns={modalEditColumns}
                dataSource={editingProducts}
                pagination={false}
                size="small"
                style={{ marginTop: 16 }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  width: '100%',
                }}
              >
                {editingProducts.map((p) => (
                  <Card
                    key={p.key}
                    size="small"
                    style={{
                      border: '1px solid #e8e8e8',
                      backgroundColor: '#f0f2f7',
                    }}
                  >
                    <Row justify="space-between" align="middle">
                      <Col>
                        <div><strong>{p.name}</strong></div>
                        <div>ID: {p.id}</div>
                      </Col>
                      <Col>
                        <DeleteOutlined
                          style={{ color: 'red' }}
                          onClick={() => handleModalProductRemove(p.id)}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginTop: 8 }} gutter={12}>
                      <Col span={12}>
                        <Text>Quantity:</Text>
                        <InputNumber
                          value={p.qty}
                          min={1}
                          onChange={(value) => handleEditProductInModal(p.key, 'qty', Number(value || 1))}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Text>Unit:</Text>
                        <Select
                          value={p.unit}
                          style={{ width: '100%' }}
                          onChange={(value) => handleEditProductInModal(p.key, 'unit', value)}
                        >
                          {masters.units.map((u) => (
                            <Option key={u} value={u}>
                              {u}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>

                    {/* Unit and Discount Type in a single row on mobile */}
                    <Row style={{ marginTop: 8 }} gutter={12}>
                      <Col span={12}>
                        <Text>Unit Price:</Text>
                        <InputNumber
                          value={p.unitPrice}
                          min={0}
                          formatter={value => `₹${value}`}
                          parser={currencyParser}
                          onChange={(value) => handleEditProductInModal(p.key, 'unitPrice', Number(value || 0))}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Text>Discount Type:</Text>
                        <Select
                          value={discountType}
                          style={{ width: '100%' }}
                          onChange={(value) => setDiscountType(value)}
                        >
                          <Option value="percentage">Percentage</Option>
                          <Option value="amount">Amount</Option>
                        </Select>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 8 }} gutter={12}>
                      <Col span={12}>
                        <Text>Discount (%):</Text>
                        <InputNumber
                          value={p.discountPercentage}
                          min={0}
                          max={100}
                          formatter={value => `${value}%`}
                          parser={percentageParser}

                          onChange={(value) => handleEditProductInModal(p.key, 'discountPercentage', Number(value || 0))}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col span={12} style={{ marginTop: 8 }}></Col>
                    </Row>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      <style>
        {
          `
          @media (max-width: 768px) {
            .ant-card .ant-card-body {
              padding: 4px;
              border-radius: 8px 8px 8px 8px;
            }
          }
          `
        }
      </style>
    </div>
  );
};
export default PurchaseOrder;