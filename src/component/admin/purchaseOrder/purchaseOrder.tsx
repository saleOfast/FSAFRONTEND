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
import type { ColumnsType } from 'antd/es/table';
import React, { useState, useEffect, useMemo } from 'react';
import previousPage from 'utils/previousPage';

const { Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const masters = {
  accounts: [
    { id: 'acc1', name: 'Saraswati Paper' },
  ],
  outlets: [
    { id: 'out1', name: 'Karol Bagh' },
    { id: 'out2', name: 'Chawri Bazar' },
  ],
  billingAddresses: [
    { id: 'b1', name: 'Noida' },
    { id: 'b2', name: 'Greater Noida' },
  ],
  shippingAddresses: [
    { id: 's1', name: 'Noida ' },
    { id: 's2', name: 'Greater Noida' },
  ],
  orderTypes: ['General Trade', 'Modern Trade'],
  units: ['Box', 'Packet', 'piece'],
  productCategories: [
    'Office and Copier Paper',
    'Writing and Printing Paper'
  ]
};

const allProducts = [
  { 
    id: 'P001', 
    name: 'JK Cedar', 
    unitPrice: 450, 
    tax: 5, 
    category: 'Office and Copier Paper',
    description: 'Premium office paper with 100gsm weight and 96% brightness',
    sizes: ['A4', 'A3', 'Folio'],
    grammage: '100g/m2',
    brightness: '96% (Min)',
    packSize: '500 Sheets'
  },
  { 
    id: 'P002', 
    name: 'JK Copier Plus Anti-Microbial', 
    unitPrice: 380, 
    tax: 5, 
    category: 'Office and Copier Paper',
    description: 'Anti-microbial copier paper with protection',
    sizes: ['A4', 'A5', 'Folio'],
    grammage: '75g/m2, 80g/m2',
    brightness: '94% (Min)',
    packSize: '100 Sheets, 500 Sheets'
  },
  { 
    id: 'P003', 
    name: 'JK Copier', 
    unitPrice: 320, 
    tax: 5, 
    category: 'Office and Copier Paper',
    description: 'Standard copier paper for everyday use',
    sizes: ['A4', 'A3', 'A5', 'FS', 'US Letter Size(11"x8.5")', 'Folio', 'B4'],
    grammage: '75g/m2, 80g/m2',
    brightness: '92% (Min)',
    packSize: '500 Sheets'
  },
  { 
    id: 'P004', 
    name: 'JK Finesse', 
    unitPrice: 520, 
    tax: 5, 
    category: 'Writing and Printing Paper',
    description: 'High-quality writing and printing paper',
    sizes: ['Reel & Sheet'],
    grammage: '58 - 120g/m2',
    brightness: '91% (Min)',
    packSize: 'Custom'
  },
  { 
    id: 'P005', 
    name: 'JK Elektra', 
    unitPrice: 480, 
    tax: 5, 
    category: 'Writing and Printing Paper',
    description: 'Reliable writing and printing paper',
    sizes: ['Reel & Sheet'],
    grammage: '58 - 120g/m2',
    brightness: '88% (Min)',
    packSize: 'Custom'
  },
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
        product.name.toLowerCase().includes(modalSearchText.toLowerCase()) ||
        product.description.toLowerCase().includes(modalSearchText.toLowerCase())
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
    const productsWithUniqueKeys = editingProducts.map(product => ({
      ...product,
      key: `${Date.now()}-${product.id}`
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
        description: product.description,
      };
      setSelectedProducts([...selectedProducts, newSelectedProduct]);

      const newEditingProduct = {
        key: `${Date.now()}-${editingProducts.length}`,
        id: product.id,
        name: product.name,
        description: product.description,
        qty: 1,
        piece: 0,
        unit: masters.units[0],
        unitPrice: product.unitPrice,
        discountPercentage: 10,
        discountAmount: (product.unitPrice * 0.1),
        tax: product.tax,
        distributorPrice: product.unitPrice - (product.unitPrice * 0.1),
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

          if (field === 'discountPercentage') {
            updatedProduct.discountAmount = (updatedProduct.unitPrice * (value || 0)) / 100;
          }

          if (field === 'discountAmount') {
            updatedProduct.discountPercentage = updatedProduct.unitPrice > 0
              ? ((value || 0) / updatedProduct.unitPrice) * 100
              : 0;
          }

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

          if (field === 'discountPercentage') {
            updatedProduct.discountAmount = (updatedProduct.unitPrice * (value || 0)) / 100;
          }

          if (field === 'discountAmount') {
            updatedProduct.discountPercentage = updatedProduct.unitPrice > 0
              ? ((updatedProduct.discountAmount || 0) / updatedProduct.unitPrice) * 100
              : 0;
          }

          if (field === 'unitPrice') {
            if (discountType === 'percentage') {
              updatedProduct.discountAmount = (value * (updatedProduct.discountPercentage || 0)) / 100;
            } else {
              updatedProduct.discountPercentage = value > 0
                ? ((updatedProduct.discountAmount || 0) / value) * 100
                : 0;
            }
          }

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

  const currencyParser = (value: string | undefined): number => {
    return Number(value?.replace('₹', '') || 0);
  };

  const percentageParser = (value: string | undefined): number => {
    return Number(value?.replace('%', '') || 0);
  };

  // Fixed responsive product columns for main table - Desktop only improvements
  const getProductColumns = (): ColumnsType<any> => {
    const baseColumns: ColumnsType<any> = [
      { 
        title: 'Product Name', 
        dataIndex: 'name', 
        key: 'name',
        width: screens.md ? 200 : 120,
        ellipsis: true,
        fixed: screens.md ? 'left' : false,
        render: (text: string) => (
          <Text strong style={{ fontSize: screens.md ? '14px' : '13px' }}>{text}</Text>
        )
      },
      {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
        width: screens.md ? 120 : 80,
        align: screens.md ? 'center' : 'left',
        render: (val: string, record: any) => (
          <Select
            value={val}
            style={{ width: screens.md ? '100%' : '100%', minWidth: screens.md ? 100 : 80 }}
            onChange={(value) => handleEditProduct(record.key, 'unit', value)}
            size={screens.md ? 'middle' : 'small'}
            variant={screens.md ? 'outlined' : 'outlined'}
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
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        width: screens.md ? 100 : 60,
        align: screens.md ? 'center' : 'left',
        render: (val: number, record: any) => (
          <InputNumber
            value={val}
            min={0}
            onChange={(value) =>
              handleEditProduct(record.key, 'qty', Number(value || 0))
            }
            size={screens.md ? 'middle' : 'small'}
            style={{ width: screens.md ? '90%' : '100%' }}
            controls={screens.md ? true : true}
          />
        ),
      },
      {
        title: 'Unit Price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: screens.md ? 140 : 100,
        align: screens.md ? 'right' : 'left',
        render: (val: number, record: any) => (
          <InputNumber
            value={val}
            min={0}
            formatter={value => `₹${value}`}
            parser={currencyParser}
            onChange={(value) => handleEditProduct(record.key, 'unitPrice', Number(value || 0))}
            size={screens.md ? 'middle' : 'small'}
            style={{ width: screens.md ? '95%' : '100%' }}
            controls={screens.md ? true : true}
          />
        ),
      },
      {
        title: screens.md ? 'Discount Type' : 'D.Type',
        key: 'discountType',
        width: screens.md ? 130 : 100,
        align: screens.md ? 'center' : 'left',
        render: () => (
          <Select
            value={discountType}
            style={{ width: screens.md ? '90%' : '100%', minWidth: screens.md ? 120 : 100 }}
            onChange={(value) => setDiscountType(value)}
            size={screens.md ? 'middle' : 'small'}
            variant={screens.md ? 'outlined' : 'outlined'}
          >
            <Option value="percentage">%</Option>
            <Option value="amount">Amount</Option>
          </Select>
        ),
      },
      {
        title: discountType === 'percentage' ? 'Disc. %' : 'Disc. Amt',
        key: 'discount',
        width: screens.md ? 130 : 100,
        align: screens.md ? 'right' : 'left',
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
                size={screens.md ? 'middle' : 'small'}
                style={{ width: screens.md ? '95%' : '100%' }}
                controls={screens.md ? true : true}
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
                size={screens.md ? 'middle' : 'small'}
                style={{ width: screens.md ? '95%' : '100%' }}
                controls={screens.md ? true : true}
              />
            );
          }
        },
      },
      {
        title: screens.md ? 'Dist. Price' : 'Dist.Price',
        dataIndex: 'distributorPrice',
        key: 'distributorPrice',
        width: screens.md ? 140 : 100,
        align: screens.md ? 'right' : 'left',
        render: (val: number) => <Text strong>₹{val ? val.toFixed(2) : '0.00'}</Text>,
      },
      {
        title: 'Total',
        key: 'total',
        width: screens.md ? 140 : 80,
        align: screens.md ? 'right' : 'left',
        render: (_: any, record: any) => {
          const total =
            (record.qty + (record.piece || 0)) * record.unitPrice - (record.discountAmount || 0);
          return <Text strong style={{ color: '#1890ff' }}>₹{Math.max(total, 0).toFixed(2)}</Text>;
        },
      },
    ];

    const actionColumn: any = {
      title: 'Action',
      key: 'action',
      width: screens.md ? 120 : 80,
      fixed: screens.md ? 'right' : false,
      align: screens.md ? 'center' : 'left',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: screens.md ? 12 : 8, justifyContent: screens.md ? 'center' : 'flex-start' }}>
          <EditOutlined
            style={{ 
              color: '#1677ff', 
              fontSize: screens.md ? 18 : 16, 
              cursor: 'pointer',
              padding: screens.md ? '4px' : '2px',
              borderRadius: '4px',
              backgroundColor: screens.md ? '#f0f8ff' : 'transparent'
            }}
            onClick={() => {
              console.log("Edit clicked for:", record);
            }}
          />
          <DeleteOutlined
            style={{ 
              color: 'red', 
              fontSize: screens.md ? 18 : 16, 
              cursor: 'pointer',
              padding: screens.md ? '4px' : '2px',
              borderRadius: '4px',
              backgroundColor: screens.md ? '#fff2f0' : 'transparent'
            }}
            onClick={() => handleRemoveProduct(record.key)}
          />
        </div>
      ),
    };

    return [...baseColumns, actionColumn];
  };

  // Columns for product selection in modal - Desktop improvements only
  const modalProductColumns: ColumnsType<any> = [
    { 
      title: 'Product Name', 
      dataIndex: 'name', 
      key: 'name',
      width: screens.md ? 200 : 150,
      ellipsis: true,
      fixed: screens.md ? 'left' : false,
      render: (text: string) => screens.md ? <Text strong>{text}</Text> : text
    },
    { 
      title: 'Product ID', 
      dataIndex: 'id', 
      key: 'id',
      width: screens.md ? 120 : 100,
      align: screens.md ? 'center' : 'left',
    },
    { 
      title: 'Category', 
      dataIndex: 'category', 
      key: 'category',
      width: screens.md ? 180 : 120,
      ellipsis: true
    },
    { 
      title: 'Description', 
      dataIndex: 'description', 
      key: 'description', 
      ellipsis: true,
      width: screens.md ? 250 : 200
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: screens.md ? 120 : 100,
      align: screens.md ? 'right' : 'left',
      render: (val: number) => `₹${val}`
    },
    {
      title: 'Select',
      key: 'select',
      width: screens.md ? 120 : 100,
      fixed: screens.md ? 'right' : false,
      align: screens.md ? 'center' : 'left',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          size={screens.md ? 'middle' : 'small'}
          onClick={() => handleModalProductSelect(record)}
          disabled={selectedProducts.some(p => p.id === record.id)}
          style={{ 
            fontSize: screens.md ? '13px' : '12px',
            padding: screens.md ? '4px 12px' : '2px 8px',
          }}
        >
          {selectedProducts.some(p => p.id === record.id) ? 'Selected' : 'Select'}
        </Button>
      ),
    },
  ];

  // Columns for editing in modal - Desktop improvements only
  const modalEditColumns: ColumnsType<any> = [
    { 
      title: 'Product Name', 
      dataIndex: 'name', 
      key: 'name',
      width: screens.md ? 180 : 150,
      ellipsis: true,
      fixed: screens.md ? 'left' : false,
      render: (text: string) => screens.md ? <Text strong>{text}</Text> : text
    },
    { 
      title: 'Product ID', 
      dataIndex: 'id', 
      key: 'id',
      width: screens.md ? 120 : 100,
      align: screens.md ? 'center' : 'left',
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      width: screens.md ? 120 : 100,
      align: screens.md ? 'center' : 'left',
      render: (val: number, record: any) => (
        <InputNumber
          value={val}
          min={1}
          onChange={(value) => handleEditProductInModal(record.key, 'qty', Number(value || 1))}
          size={screens.md ? 'middle' : 'small'}
          style={{ width: screens.md ? '90%' : '100%' }}
          controls={screens.md ? true : true}
        />
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: screens.md ? 120 : 100,
      align: screens.md ? 'center' : 'left',
      render: (val: string, record: any) => (
        <Select
          value={val}
          style={{ width: screens.md ? '90%' : '100%' }}
          onChange={(value) => handleEditProductInModal(record.key, 'unit', value)}
          size={screens.md ? 'middle' : 'small'}
          variant={screens.md ? 'outlined' : 'outlined'}
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
      width: screens.md ? 140 : 120,
      align: screens.md ? 'right' : 'left',
      render: (val: number, record: any) => (
        <InputNumber
          value={val}
          min={0}
          formatter={value => `₹${value}`}
          parser={currencyParser}
          onChange={(value) => handleEditProductInModal(record.key, 'unitPrice', Number(value || 0))}
          size={screens.md ? 'middle' : 'small'}
          style={{ width: screens.md ? '95%' : '100%' }}
          controls={screens.md ? true : true}
        />
      ),
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      width: screens.md ? 140 : 120,
      align: screens.md ? 'right' : 'left',
      render: (val: number, record: any) => (
        <InputNumber
          value={val}
          min={0}
          max={100}
          formatter={value => `${value}%`}
          parser={percentageParser}
          onChange={(value) => handleEditProductInModal(record.key, 'discountPercentage', Number(value || 0))}
          size={screens.md ? 'middle' : 'small'}
          style={{ width: screens.md ? '95%' : '100%' }}
          controls={screens.md ? true : true}
        />
      ),
    },
    {
      title: 'Dist. Price',
      dataIndex: 'distributorPrice',
      key: 'distributorPrice',
      width: screens.md ? 140 : 120,
      align: screens.md ? 'right' : 'left',
      render: (val: number) => <Text strong>₹{val ? val.toFixed(2) : '0.00'}</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      width: screens.md ? 100 : 80,
      fixed: screens.md ? 'right' : false,
      align: screens.md ? 'center' : 'left',
      render: (_: any, record: any) => (
        <DeleteOutlined
          style={{ 
            color: 'red', 
            fontSize: screens.md ? 18 : 16, 
            cursor: 'pointer',
            padding: screens.md ? '4px' : '2px',
            borderRadius: '4px',
            backgroundColor: screens.md ? '#fff2f0' : 'transparent'
          }}
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
                      label: 'Customer Name',
                      name: 'account',
                      options: masters.accounts,
                      placeholder: 'Select Account',
                      required: true,
                    },
                    {
                      label: 'Store Name',
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
                          <Select placeholder={field.placeholder} size={screens.md ? 'middle' : 'small'}>
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
                            size={screens.md ? 'middle' : 'small'}
                          />
                        ) : (
                          <Input placeholder={field.placeholder} size={screens.md ? 'middle' : 'small'} />
                        )}
                      </Form.Item>
                    </Col>
                  ))}
                </Row>

                {/* ---- Product Table - Desktop improvements only ---- */}
                <Card type="inner" style={{ borderRadius: 8, marginTop: 16 }}>
                  <Row gutter={8} style={{ marginBottom: 16 }}>
                    <Col span={24} style={{ textAlign: "right" }}>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                        size={screens.md ? 'middle' : 'small'}
                      >
                        Add Product
                      </Button>
                    </Col>
                  </Row>
                  {products.length > 0 ? (
                    screens.md ? (
                      // Desktop table with improved styling
                      <div style={{ 
                        width: '100%', 
                        overflowX: 'auto',
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px'
                      }}>
                        <Table
                          columns={getProductColumns()}
                          dataSource={products}
                          pagination={false}
                          bordered
                          size="middle"
                          scroll={{ x: screens.md ? 1200 : 800 }}
                          style={{ 
                            minWidth: screens.md ? '100%' : 800,
                            tableLayout: 'fixed'
                          }}
                          components={{
                            body: {
                              cell: (props: any) => (
                                <td 
                                  {...props} 
                                  style={{ 
                                    ...props.style,
                                    padding: screens.md ? '12px 8px' : '8px 4px',
                                    fontSize: screens.md ? '14px' : '13px'
                                  }}
                                />
                              ),
                            },
                          }}
                        />
                      </div>
                    ) : (
                      // Mobile view - unchanged
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
                            style={{
                              border: '1px solid #d9d9d9',
                              backgroundColor: '#fafafa',
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
                            <Row style={{ marginTop: 8 }} gutter={8}>
                              <Col span={12}>
                                <Text style={{ fontSize: 12 }}>Price:</Text>
                                <InputNumber
                                  value={p.unitPrice}
                                  min={0}
                                  formatter={value => `₹${value}`}
                                  parser={currencyParser}
                                  onChange={(value) => handleEditProduct(p.key, 'unitPrice', Number(value || 0))}
                                  size="small"
                                  style={{ width: '100%' }}
                                />
                              </Col>
                              <Col span={12}>
                                <Text style={{ fontSize: 12 }}>Discount:</Text>
                                {discountType === 'percentage' ? (
                                  <InputNumber
                                    value={p.discountPercentage}
                                    min={0}
                                    max={100}
                                    formatter={value => `${value}%`}
                                    parser={percentageParser}
                                    onChange={(value) => handleEditProduct(p.key, 'discountPercentage', Number(value || 0))}
                                    size="small"
                                    style={{ width: '100%' }}
                                  />
                                ) : (
                                  <InputNumber
                                    value={p.discountAmount}
                                    min={0}
                                    formatter={value => `₹${value}`}
                                    parser={currencyParser}
                                    onChange={(value) => handleEditProduct(p.key, 'discountAmount', Number(value || 0))}
                                    size="small"
                                    style={{ width: '100%' }}
                                  />
                                )}
                              </Col>
                            </Row>
                            <Row style={{ marginTop: 8 }} gutter={8}>
                              <Col span={12}>
                                <Text style={{ fontSize: 12 }}>Qty:</Text>
                                <InputNumber
                                  value={p.qty}
                                  min={0}
                                  onChange={(e) =>
                                    handleEditProduct(
                                      p.key,
                                      'qty',
                                      Number(e || 0)
                                    )
                                  }
                                  size="small"
                                  style={{ width: '100%' }}
                                />
                              </Col>
                              <Col span={12}>
                                <Text style={{ fontSize: 12 }}>Unit:</Text>
                                <Select
                                  value={p.unit}
                                  style={{ width: '100%' }}
                                  onChange={(value) => handleEditProduct(p.key, 'unit', value)}
                                  size="small"
                                >
                                  {masters.units.map((u) => (
                                    <Option key={u} value={u}>
                                      {u}
                                    </Option>
                                  ))}
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
                  <Select 
                    placeholder="Select Billing Address" 
                    style={{ width: '100%' }}
                    size={screens.md ? 'middle' : 'small'}
                  >
                    {masters.billingAddresses.map((addr) => (
                      <Option key={addr.id} value={addr.id}>
                        {addr.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} md={12}>
                  <Select 
                    placeholder="Select Shipping Address" 
                    style={{ width: '100%' }}
                    size={screens.md ? 'middle' : 'small'}
                  >
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
                    size={screens.md ? 'middle' : 'small'}
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
                size={screens.md ? 'middle' : 'small'}
              >
                Save as Draft
              </Button>
              <Button 
                block 
                style={{ marginTop: 8 }}
                size={screens.md ? 'middle' : 'small'}
              >
                Preview Order
              </Button>
              <Button
                danger
                type="primary"
                block
                style={{ marginTop: 8, backgroundColor: '#f9595eff' }}
                size={screens.md ? 'middle' : 'small'}
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
        open={isModalVisible}
        onCancel={handleModalCancel}
        width={screens.md ? 1000 : '95%'}
        style={{ maxWidth: '95vw' }}
        footer={[
          <Button key="cancel" onClick={handleModalCancel} size={screens.md ? 'middle' : 'small'}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleModalSubmit}
            icon={<SaveOutlined />}
            size={screens.md ? 'middle' : 'small'}
          >
            Submit
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={screens.md ? 8 : 10}>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
              size={screens.md ? 'middle' : 'small'}
            >
              <Option value="All">All Categories</Option>
              {masters.productCategories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={screens.md ? 16 : 14}>
            <Input
              placeholder="Search products by name or description"
              value={modalSearchText}
              onChange={(e) => setModalSearchText(e.target.value)}
              size={screens.md ? 'middle' : 'small'}
            />
          </Col>
        </Row>

        <Text strong style={{ display: 'block', marginBottom: 12 }}>Available Products:</Text>
        {screens.md ? (
          // Desktop table in modal
          <div style={{ width: '100%', overflowX: 'auto', marginBottom: 16 }}>
            <Table
              columns={modalProductColumns}
              dataSource={filteredProducts}
              pagination={{ pageSize: 5 }}
              size="middle"
              scroll={{ x: 1000 }}
              style={{ 
                border: '1px solid #f0f0f0',
                borderRadius: '8px'
              }}
              components={{
                body: {
                  cell: (props: any) => (
                    <td 
                      {...props} 
                      style={{ 
                        ...props.style,
                        padding: '12px 8px',
                        fontSize: '14px'
                      }}
                    />
                  ),
                },
              }}
            />
          </div>
        ) : (
          // Mobile view in modal - unchanged
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
                    <div style={{ fontSize: 12 }}>ID: {product.id}</div>
                    <div style={{ fontSize: 12 }}>Category: {product.category}</div>
                    <div style={{ fontSize: 11, color: '#666' }}>{product.description}</div>
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

        {editingProducts.length > 0 && (
          <div>
            <Text strong style={{ display: 'block', marginBottom: 12, fontWeight: 600, fontSize: 16 }}>
              Selected Products:
            </Text>
            {screens.md ? (
              // Desktop table for editing products
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <Table
                  columns={modalEditColumns}
                  dataSource={editingProducts}
                  pagination={false}
                  size="middle"
                  scroll={{ x: 1100 }}
                  style={{ 
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px'
                  }}
                  components={{
                    body: {
                      cell: (props: any) => (
                        <td 
                          {...props} 
                          style={{ 
                            ...props.style,
                            padding: '12px 8px',
                            fontSize: '14px'
                          }}
                        />
                      ),
                    },
                  }}
                />
              </div>
            ) : (
              // Mobile view for editing products - unchanged
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
                        <div style={{ fontSize: 12 }}>ID: {p.id}</div>
                      </Col>
                      <Col>
                        <DeleteOutlined
                          style={{ color: 'red' }}
                          onClick={() => handleModalProductRemove(p.id)}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginTop: 8 }} gutter={8}>
                      <Col span={12}>
                        <Text style={{ fontSize: 12 }}>Quantity:</Text>
                        <InputNumber
                          value={p.qty}
                          min={1}
                          onChange={(value) => handleEditProductInModal(p.key, 'qty', Number(value || 1))}
                          style={{ width: '100%' }}
                          size="small"
                        />
                      </Col>
                      <Col span={12}>
                        <Text style={{ fontSize: 12 }}>Unit:</Text>
                        <Select
                          value={p.unit}
                          style={{ width: '100%' }}
                          onChange={(value) => handleEditProductInModal(p.key, 'unit', value)}
                          size="small"
                        >
                          {masters.units.map((u) => (
                            <Option key={u} value={u}>
                              {u}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>

                    <Row style={{ marginTop: 8 }} gutter={8}>
                      <Col span={12}>
                        <Text style={{ fontSize: 12 }}>Unit Price:</Text>
                        <InputNumber
                          value={p.unitPrice}
                          min={0}
                          formatter={value => `₹${value}`}
                          parser={currencyParser}
                          onChange={(value) => handleEditProductInModal(p.key, 'unitPrice', Number(value || 0))}
                          style={{ width: '100%' }}
                          size="small"
                        />
                      </Col>
                      <Col span={12}>
                        <Text style={{ fontSize: 12 }}>Discount (%):</Text>
                        <InputNumber
                          value={p.discountPercentage}
                          min={0}
                          max={100}
                          formatter={value => `${value}%`}
                          parser={percentageParser}
                          onChange={(value) => handleEditProductInModal(p.key, 'discountPercentage', Number(value || 0))}
                          style={{ width: '100%' }}
                          size="small"
                        />
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
export default PurchaseOrder;