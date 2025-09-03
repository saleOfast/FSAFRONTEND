import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {
  Input,
  Select,
  TreeSelect,
  Modal,
  Form,
  InputNumber,
  Upload,
  Button,
  message,
  Switch,
  DatePicker,
  Row,
  Col,
  Card
} from 'antd';
import { getProductCategoryActions, getProductsActions } from 'redux-store/action/productAction';
import { AppDispatch } from 'redux-store/store';
import '../../style/orderList.css';
import { deleteProductService } from 'services/productService';
import DeleteItem from '../common/deleteItem';
import { useAuth } from 'context/AuthContext';
import { UserRole } from 'enum/common';
import { handleImageError } from 'utils/common';

const { Option } = Select;
const { TextArea } = Input;

export default function AdminProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [form] = Form.useForm();

  // Fetch data from Redux store
  const productData = useSelector((state: any) => state?.product?.productList);
  const productCategoryData = useSelector((state: any) => state?.product?.category);

  // Local state for product list
  const [productList, setProductList] = useState<any[]>([]);
  const [value, setValue] = useState<any>("Category");
  const [toggleDelete, setToggleDelete] = useState(false);
  const [productName, setProductName] = useState('');
  const [productId, setProductID] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    dispatch(getProductsActions({}));
    dispatch(getProductCategoryActions());
  }, [dispatch]);

  useEffect(() => {
    setProductList(productData);
  }, [productData]);

  // Search function
  const searchProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const searchTerm = value.toLowerCase();

    const filteredProducts = productData.filter((item: any) =>
      item?.productName?.toLowerCase().includes(searchTerm) ||
      item?.brand?.name?.toLowerCase().includes(searchTerm) ||
      item?.category?.name?.toLowerCase().includes(searchTerm)
    );

    setProductList(filteredProducts);
  };

  // Handle brand filtering
  const uniqueBrands = Array.from(new Set(productData?.map((item: any) => item?.brand?.name)));
  const brandOptions = [{ label: "All", value: "all" }, ...uniqueBrands.filter(Boolean).map((brand) => ({ label: brand, value: brand }))];

  const handleBrandChange = (value: string) => {
    const filteredProducts = value === "all" ? productData : productData.filter((item: any) =>
      item?.brand?.name?.toLowerCase().includes(value.toLowerCase())
    );
    setProductList(filteredProducts);
  };

  // Handle category filtering
  const handleCategoryChange = (selectedValue: any) => {
    setValue(selectedValue);
    const filteredProducts = selectedValue === -1
      ? productData
      : productData.filter((item: any) => item?.category?.productCategoryId === selectedValue);
    setProductList(filteredProducts);
  };

  // Handle delete toggle
  const toggleHandler = (id: string, name: string) => {
    setToggleDelete(true);
    setProductID(id);
    setProductName(name);
  };

  // Show modal for adding new product
  const showModal = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  // Show modal for editing existing product
  const showEditModal = (product: any) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    // Pre-fill form with existing product data
    form.setFieldsValue({
      productName: product.productName,
      category: product.category?.productCategoryId,
      mrp: product.mrp,
      rlp: product.rlp,
      caseQty: product.caseQty,
      isActive: product.isActive,
      isFocused: product.isFocused
      // Add other fields as needed
    });
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
    // Here you would typically dispatch an action to save the product
    message.success(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
    setIsModalVisible(false);
    form.resetFields();
  };

  // Upload handler (mock implementation)
  const handleUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="mrb">
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={() => navigate(-1)} className="back-button" />
        <h1 className="page-title pr-18">Product</h1>
      </header>

      {authState?.user?.role !== UserRole.SSM && authState?.user?.role !== UserRole.RETAILER && (
        <div className="addIcon" onClick={showModal}>
          <PlusOutlined className="plusIcon" />
        </div>
      )}

      <main>
        {/* Search Bar */}
        <div className="searchProduct">
          <Input
            prefix={<SearchOutlined className="fs-16" />}
            placeholder="Search Items by Product Name, Brand, Category"
            onChange={searchProduct}
            className="searchContainer p-7"
          />
        </div>

        {/* Filters */}
        <div className="selection-line">
          <Select id="brandSelect" defaultValue="Brand" className="selectFiltBtn" onChange={handleBrandChange} options={brandOptions} />
          <TreeSelect
            showSearch
            className="selectFiltBtn"
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Select Category"
            allowClear
            treeDefaultExpandAll
            onChange={handleCategoryChange}
            treeData={[
              { value: -1, label: "All" },
              ...productCategoryData.map((category: any) => ({
                value: category.productCategoryId,
                label: category.name
              }))
            ]}
          />
        </div>

        {/* Delete Modal */}
        <DeleteItem
          toggle={toggleDelete}
          name={productName}
          itemsId={productId}
          deleteService={deleteProductService}
          closeModal={(e: any) => setToggleDelete(e)}
        />

        {/* Add/Edit Product Modal */}
        <Modal
          title={
            <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </div>
          }
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={900}
          closeIcon={<CloseOutlined />}
          style={{ top: 20 }}
        >
          <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '0 8px' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ 
                isActive: true, 
                isFocused: false,
                productStatus: 'active',
                discountStatus: 'active',
                currency: 'INR'
              }}
            >
              <Card size="small" style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 16, fontSize: '16px', fontWeight: 'bold'  }}>Product Information</h3>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="productName"
                      label="Product Name"
                      rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                      <Input placeholder="Enter Product name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true, message: 'Please select a category' }]}
                    >
                      <Select placeholder="Select Category">
                        {productCategoryData.map((category: any) => (
                          <Option key={category.productCategoryId} value={category.productCategoryId}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="subCategory"
                      label="Sub Category"
                    >
                      <Select placeholder="Select Sub Category">
                        <Option value="sub1">Sub Category 1</Option>
                        <Option value="sub2">Sub Category 2</Option>
                        <Option value="sub3">Sub Category 3</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="mrp"
                      label="MRP"
                      rules={[{ required: true, message: 'Please enter MRP' }]}
                    >
                      <InputNumber 
                        min={0} 
                        placeholder="Enter MRP" 
                        style={{ width: '100%' }} 
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="rlp"
                      label="RLP"
                      rules={[{ required: true, message: 'Please enter RLP' }]}
                    >
                      <InputNumber 
                        min={0} 
                        placeholder="Enter RLP" 
                        style={{ width: '100%' }} 
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="batchNumber"
                      label="Batch Number"
                    >
                      <Input placeholder="Enter Batch Number" />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="manufacturingDate"
                      label="Manufacturing Date"
                    >
                      <DatePicker 
                        format="DD/MM/YYYY"
                        placeholder="dd/mm/yyyy"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="expiryDate"
                      label="Expiry Date"
                      rules={[{ required: true, message: 'Please select expiry date' }]}
                    >
                      <DatePicker 
                        format="DD/MM/YYYY"
                        placeholder="dd/mm/yyyy"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="selfLife"
                      label="Self Life"
                    >
                      <DatePicker 
                        format="DD/MM/YYYY"
                        placeholder="dd/mm/yyyy"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="productStatus"
                      label="Product Status"
                      rules={[{ required: true, message: 'Please select status' }]}
                    >
                      <Select placeholder="Select Status">
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="unitOfMeasurement"
                      label="Unit of Measurement"
                    >
                      <Select placeholder="Select Unit of Measurement">
                        <Option value="pcs">Pieces</Option>
                        <Option value="kg">Kilograms</Option>
                        <Option value="g">Grams</Option>
                        <Option value="l">Liters</Option>
                        <Option value="ml">Milliliters</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="caseQty"
                      label="Case Quantity"
                      rules={[{ required: true, message: 'Please enter case quantity' }]}
                    >
                      <InputNumber 
                        min={1} 
                        placeholder="Enter Case Quantity" 
                        style={{ width: '100%' }} 
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                {/* Focused Field - Added here */}
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="isFocused"
                      label="Focused"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* Empty column for alignment */}
                  </Col>
                </Row>
              </Card>
              
              <Card size="small" style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 16, fontSize: '16px', fontWeight: 'bold'  }}>Inventory Details</h3>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="maxStockLevel"
                      label="Maximum Stock Level"
                    >
                      <InputNumber 
                        min={0} 
                        placeholder="Enter Maximum Stock Level" 
                        style={{ width: '100%' }} 
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="currency"
                      label="Currency"
                      rules={[{ required: true, message: 'Please select currency' }]}
                    >
                      <Select placeholder="Select Currency">
                        <Option value="INR">Indian Rupee (₹)</Option>
                        <Option value="USD">US Dollar ($)</Option>
                        <Option value="EUR">Euro (€)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="purchasePrice"
                      label="Purchase Price"
                    >
                      <InputNumber 
                        min={0} 
                        placeholder="Enter Purchase Price" 
                        style={{ width: '100%' }} 
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="sellingPrice"
                      label="Selling Price"
                      rules={[{ required: true, message: 'Please enter selling price' }]}
                    >
                      <InputNumber 
                        min={0} 
                        placeholder="Enter Selling Price" 
                        style={{ width: '100%' }} 
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="mxp"
                      label="MXP"
                    >
                      <InputNumber 
                        min={0} 
                        placeholder="Enter MXP" 
                        style={{ width: '100%' }} 
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="storageLocation"
                      label="Storage Location"
                    >
                      <Select placeholder="Select Storage Location">
                        <Option value="warehouse">Warehouse</Option>
                        <Option value="store">Store</Option>
                        <Option value="shelf">Shelf</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="stockInDate"
                      label="Stock In Date"
                    >
                      <DatePicker 
                        format="DD/MM/YYYY"
                        placeholder="dd/mm/yyyy"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="stockOutDate"
                      label="Stock Out Date"
                    >
                      <DatePicker 
                        format="DD/MM/YYYY"
                        placeholder="dd/mm/yyyy"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="storageCondition"
                      label="Storage Condition"
                    >
                      <Input placeholder="Enter Storage Condition" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* Empty column for alignment */}
                  </Col>
                </Row>
              </Card>
              
              <Card size="small" style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 16, fontSize: '16px', fontWeight: 'bold'  }}>Discount Information</h3>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="discountType"
                      label="Discount Type"
                    >
                      <Select placeholder="Select Discount Type">
                        <Option value="percentage">Percentage</Option>
                        <Option value="fixed">Fixed Amount</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="discountValue"
                      label="Discount Value"
                    >
                      <InputNumber 
                        min={0} 
                        placeholder="Enter Discount Value" 
                        style={{ width: '100%' }} 
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="discountStatus"
                      label="Discount Status"
                    >
                      <Select placeholder="Select Status">
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* Empty column for alignment */}
                  </Col>
                </Row>
              </Card>
              
              <Card size="small" style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 16, color: 'black' }}>Product Image</h3>
                
                <Form.Item
                  name="productImage"
                  label="Choose File"
                >
                  <Upload
                    name="productImage"
                    listType="picture"
                    beforeUpload={() => false} // Prevent automatic upload
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
                
                <Form.Item
                  name="productDescription"
                  label="Product Description"
                >
                  <TextArea rows={4} placeholder="Enter product description" />
                </Form.Item>
              </Card>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <Button onClick={handleCancel} size="large">
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" size="large">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        {/* Product List */}
        <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
          {productList?.map((data, index) => {
            const { productName, productId, brand, mrp, rlp, category, caseQty, isActive, image, isFocused } = data;

            return (
              <div key={index} className="orderContainer" style={{ cursor: "pointer" }}>
                <div className="ordHeadline">
                  <span className="ordertitle">{productName}</span>

                  {/* Status Container - Moved to the right side */}
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                    {/* Active/Inactive Indicator */}
                    <div className={isActive ? "activetag" : "inActivetag"} style={{ marginRight: '8px' }}>
                      <span className={isActive ? "blinker" : "blinker-inActive"}></span>
                      <span>{isActive ? "Active" : "Inactive"}</span>
                    </div>

                    <div className="active-focused" style={{ marginRight: '16px' }}>
                      <div>
                        {isFocused ?
                          <CheckCircleFilled className='checkIcon' />
                          :
                          <CloseCircleFilled className='closeIcon' />
                        }
                      </div>
                      <div className="focus-text">{isFocused ? "Focused" : "Not Focused"}</div>
                    </div>
                  
                    {/* Edit and Delete Icons */}
                    {authState?.user?.role !== UserRole.SSM && authState?.user?.role !== UserRole.RETAILER && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <FormOutlined 
                          onClick={(e) => {
                            e.stopPropagation();
                            showEditModal(data);
                          }} 
                          style={{ color: '#1890ff' }}
                        />
                        <DeleteOutlined 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHandler(productId, productName);
                          }} 
                          style={{ color: '#ff4d4f' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="orderList">
                  <div className="title">
                    <div className='mrpPrice'>
                      <div>
                        <span>Brand: <span className='fbold'>{brand?.name}</span></span>
                      </div>
                      <div>
                        <span>MRP: <span className='fbold'>₹ {mrp}</span></span>
                      </div>
                      <div>
                        <span>RLP: <span className='fbold'>₹ {rlp}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="title">
                    <div className='mrpPrice'>
                      <div>
                        <span>Category: <span className='fbold'>{category?.name}</span></span>
                      </div>
                      <div>
                        <span>SKU ID: <span className='fbold'>{productId}</span></span>
                      </div>
                      <div>
                        <span>Case Qty: <span className='fbold'>{caseQty}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="title fxbtm">
                    <img src={image} alt="productImg" width={60} height={60} onError={handleImageError} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}