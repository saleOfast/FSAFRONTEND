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
import { deleteProductService, addProductService, updateProductService } from 'services/productService';
import DeleteItem from '../common/deleteItem';
import { useAuth } from 'context/AuthContext';
import { UserRole } from 'enum/common';
import { handleImageError } from 'utils/common';

const { Option } = Select;
const { TextArea } = Input;

// Custom CSS to fix date picker z-index issue
const datePickerStyles = `
  .ant-picker-dropdown {
    z-index: 9999 !important;
  }
  .ant-picker-panel-container {
    z-index: 9999 !important;
  }
  .ant-select-dropdown {
    z-index: 9999 !important;
  }
`;

// Types for additional fields
interface AdditionalFields {
  availableSizes: string[];
  grammage: string[];
  brightness: string[];
  packSize: string[];
}

// File to Base64 converter function
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Sub-category mapping based on product name
const getSubCategoriesByProductName = (productName: string | undefined) => {
  const productNameLower = productName?.toLowerCase() || '';
  
  if (productNameLower.includes('office and copier paper') || productNameLower.includes('copier')) {
    return [
      { value: 'JK Cedar', label: 'JK Cedar' },
      { value: 'JK Copier Plus Anti-Microbial', label: 'JK Copier Plus Anti-Microbial' },
      { value: 'JK Copier', label: 'JK Copier' }
    ];
  } else if (productNameLower.includes('writing and printing paper')) {
    return [
      { value: 'JK Finesse', label: 'JK Finesse' },
      { value: 'JK Elektra', label: 'JK Elektra' }
    ];
  }
  
  return []; // Return empty array if no match found
};

// Available Sizes options
const availableSizesOptions = [
  { value: 'A4', label: 'A4' },
  { value: 'A3', label: 'A3' },
  { value: 'A5', label: 'A5' },
  { value: 'F5', label: 'F5' },
  { value: 'US Letter Size(11"x8.5")', label: 'US Letter Size(11"x8.5")' },
  { value: 'Folio', label: 'Folio' },
  { value: 'B4', label: 'B4' }
];

// Grammage options
const grammageOptions = [
  { value: '75g/m2', label: '75g/m2' },
  { value: '80g/m2', label: '80g/m2' }
];

// Brightness options
const brightnessOptions = [
  { value: '92 (Min)', label: '92 (Min)' }
];

// Pack Size options
const packSizeOptions = [
  { value: '500 Sheets', label: '500 Sheets' }
];

// Get additional fields based on sub-category
const getAdditionalFieldsBySubCategory = (subCategory: string): AdditionalFields => {
  switch (subCategory) {
    case 'JK Cedar':
      return {
        availableSizes: ['A4', 'A3', 'Folio'],
        grammage: ['100g/m2'],
        brightness: ['96 (Min)'],
        packSize: ['500 Sheets']
      };
    case 'JK Copier Plus Anti-Microbial':
      return {
        availableSizes: ['A4', 'A5', 'Folio'],
        grammage: ['75g/m2', '80g/m2'],
        brightness: ['94 (Min)'],
        packSize: ['100 Sheets', '500 Sheets']
      };
    case 'JK Copier':
      return {
        availableSizes: ['A4', 'A3', 'A5', 'F5', 'US Letter Size(11"x8.5")', 'Folio', 'B4'],
        grammage: ['75g/m2', '80g/m2'],
        brightness: ['92 (Min)'],
        packSize: ['500 Sheets']
      };
    case 'JK Finesse':
      return {
        availableSizes: [],
        grammage: [],
        brightness: [],
        packSize: []
      };
    case 'JK Elektra':
      return {
        availableSizes: [],
        grammage: [],
        brightness: [],
        packSize: []
      };
    default:
      return {
        availableSizes: [],
        grammage: [],
        brightness: [],
        packSize: []
      };
  }
};

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
  const [availableSubCategories, setAvailableSubCategories] = useState<any[]>([]);
  const [additionalFields, setAdditionalFields] = useState<AdditionalFields>({
    availableSizes: [],
    grammage: [],
    brightness: [],
    packSize: []
  });
  const [loading, setLoading] = useState(false);
  
  // New states for image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  // Fetch data from backend
  useEffect(() => {
    dispatch(getProductsActions({}));
    dispatch(getProductCategoryActions());
  }, [dispatch]);

  useEffect(() => {
    // Set product list from Redux store (backend data)
    setProductList(productData || []);
  }, [productData]);

  // Handle product name change to update sub-categories
  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const productName = e.target.value;
    
    // Update available sub-categories based on product name
    const subCategories = getSubCategoriesByProductName(productName);
    setAvailableSubCategories(subCategories);
    
    // If no sub-categories available for the product name, clear the sub-category field
    if (subCategories.length === 0) {
      form.setFieldsValue({ 
        subCategory: undefined,
        availableSizes: undefined,
        grammage: undefined,
        brightness: undefined,
        packSize: undefined
      });
      setAdditionalFields({
        availableSizes: [],
        grammage: [],
        brightness: [],
        packSize: []
      });
    }
  };

  // Handle sub-category change to update additional fields
  const handleSubCategoryChange = (value: string) => {
    const fields = getAdditionalFieldsBySubCategory(value);
    setAdditionalFields(fields);
    
    // Auto-fill the additional fields in the form
    form.setFieldsValue({
      availableSizes: fields.availableSizes,
      grammage: fields.grammage,
      brightness: fields.brightness,
      packSize: fields.packSize
    });
  };

  // Handle individual field changes
  const handleAvailableSizesChange = (value: string[]) => {
    setAdditionalFields(prev => ({...prev, availableSizes: value}));
  };

  const handleGrammageChange = (value: string[]) => {
    setAdditionalFields(prev => ({...prev, grammage: value}));
  };

  const handleBrightnessChange = (value: string[]) => {
    setAdditionalFields(prev => ({...prev, brightness: value}));
  };

  const handlePackSizeChange = (value: string[]) => {
    setAdditionalFields(prev => ({...prev, packSize: value}));
  };

  // Handle file upload
  const handleUpload = (info: any) => {
    let fileList = [...info.fileList];

    // Limit to only one file
    fileList = fileList.slice(-1);

    // Read file and set preview
    fileList = fileList.map(file => {
      if (file.response) {
        // Component already show file url from response
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(fileList);

    // Get the actual file
    const file = info.file;
    
    if (file.status === 'removed') {
      // File removed
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (file.originFileObj) {
      const selectedFile = file.originFileObj;
      
      // Validate file type
      const isImage = selectedFile.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        setFileList([]);
        return;
      }

      // Validate file size (2MB)
      const isLt2M = selectedFile.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        setFileList([]);
        return;
      }

      setImageFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Upload props
  const uploadProps = {
    beforeUpload: (file: File) => {
      // Prevent automatic upload
      return false;
    },
    fileList,
    onChange: handleUpload,
    multiple: false,
    accept: 'image/*',
    listType: 'picture' as const,
  };

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
    setAvailableSubCategories([]);
    setAdditionalFields({
      availableSizes: [],
      grammage: [],
      brightness: [],
      packSize: []
    });
    // Reset image states
    setImageFile(null);
    setImagePreview(null);
    setFileList([]);
    form.resetFields();
  };

  // Show modal for editing existing product
  const showEditModal = (product: any) => {
    console.log('Editing product:', product);
    
    setEditingProduct(product);
    setIsModalVisible(true);
    
    // Reset image states first
    setImageFile(null);
    setImagePreview(null);
    setFileList([]);
    
    // Set available sub-categories based on existing product name
    const subCategories = getSubCategoriesByProductName(product.productName);
    setAvailableSubCategories(subCategories);
    
    // Set additional fields based on sub-category
    if (product.subCategory) {
      const fields = getAdditionalFieldsBySubCategory(product.subCategory);
      setAdditionalFields(fields);
    } else {
      // If product has existing values, set them
      setAdditionalFields({
        availableSizes: product.availableSizes || [],
        grammage: product.grammage || [],
        brightness: product.brightness || [],
        packSize: product.packSize || []
      });
    }

    // Use setTimeout to ensure form is ready before setting values
    setTimeout(() => {
      // Pre-fill form with existing product data
      form.setFieldsValue({
        productName: product.productName,
        category: product.category?.productCategoryId,
        mrp: product.mrp,
        rlp: product.rlp,
        caseQty: product.caseQty,
        isActive: product.isActive,
        isFocused: product.isFocused,
        subCategory: product.subCategory,
        availableSizes: product.availableSizes || [],
        grammage: product.grammage || [],
        brightness: product.brightness || [],
        packSize: product.packSize || [],
        productStatus: product.productStatus || 'active',
        discountStatus: product.discountStatus || 'active',
        currency: product.currency || 'INR',
        batchNumber: product.batchNumber,
        manufacturingDate: product.manufacturingDate,
        expiryDate: product.expiryDate,
        selfLife: product.selfLife,
        unitOfMeasurement: product.unitOfMeasurement,
        maxStockLevel: product.maxStockLevel,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        mxp: product.mxp,
        storageLocation: product.storageLocation,
        stockInDate: product.stockInDate,
        stockOutDate: product.stockOutDate,
        storageCondition: product.storageCondition,
        discountType: product.discountType,
        discountValue: product.discountValue,
        productDescription: product.productDescription
      });
      
      // Set image preview if product has image
      if (product.image && product.image !== '/default-product-image.png') {
        setImagePreview(product.image);
        // Create a mock file list for display
        setFileList([{
          uid: '-1',
          name: 'product-image',
          status: 'done',
          url: product.image
        }]);
      }
    }, 100);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
    setAvailableSubCategories([]);
    setAdditionalFields({
      availableSizes: [],
      grammage: [],
      brightness: [],
      packSize: []
    });
    // Reset image states
    setImageFile(null);
    setImagePreview(null);
    setFileList([]);
    form.resetFields();
    setLoading(false);
  };

  // Handle form submission with Backend API calls - FIXED VERSION
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log('Form values:', values);
      
      // Handle image - convert to base64 if new image is uploaded
      let productImage = '/default-product-image.png';
      if (imageFile) {
        try {
          productImage = await convertToBase64(imageFile);
        } catch (error) {
          console.error('Error converting image to base64:', error);
          message.warning('Using default image due to upload error');
        }
      } else if (editingProduct && editingProduct.image) {
        // Keep existing image if editing and no new image uploaded
        productImage = editingProduct.image;
      }

      // Format dates for backend (convert Moment.js to string)
      const formatDateForBackend = (date: any) => {
        if (!date) return undefined;
        // If it's a Moment.js object, format it
        if (date.format && typeof date.format === 'function') {
          return date.format('YYYY-MM-DD');
        }
        // If it's already a string, return as is
        return date;
      };

      // Prepare data for backend API - FIXED: Properly format the data
      const productData: any = {
        productName: values.productName,
        categoryId: values.category,
        mrp: values.mrp,
        rlp: values.rlp,
        caseQty: values.caseQty,
        isActive: values.isActive !== undefined ? values.isActive : true,
        isFocused: values.isFocused !== undefined ? values.isFocused : false,
        image: productImage,
        subCategory: values.subCategory,
        availableSizes: values.availableSizes || [],
        grammage: values.grammage || [],
        brightness: values.brightness || [],
        packSize: values.packSize || [],
        productStatus: values.productStatus || 'active',
        discountStatus: values.discountStatus || 'active',
        currency: values.currency || 'INR',
        batchNumber: values.batchNumber,
        manufacturingDate: formatDateForBackend(values.manufacturingDate),
        expiryDate: formatDateForBackend(values.expiryDate),
        selfLife: formatDateForBackend(values.selfLife),
        unitOfMeasurement: values.unitOfMeasurement,
        maxStockLevel: values.maxStockLevel,
        purchasePrice: values.purchasePrice,
        sellingPrice: values.sellingPrice,
        mxp: values.mxp,
        storageLocation: values.storageLocation,
        stockInDate: formatDateForBackend(values.stockInDate),
        stockOutDate: formatDateForBackend(values.stockOutDate),
        storageCondition: values.storageCondition,
        discountType: values.discountType,
        discountValue: values.discountValue,
        productDescription: values.productDescription,
        // FIXED: Properly format brandId and skuDiscount
        brandId: 1, // Changed from string to number
        skuDiscount: {
          type: values.discountType || 'percentage',
          value: values.discountValue || 0
        } // Changed from number to object
      };

      console.log('Data being sent to backend:', productData);

      let response;

      if (editingProduct) {
        // Update existing product via API
        const updateData = {
          ...productData,
          productId: editingProduct.productId
        };
        response = await updateProductService(updateData);
        message.success('Product updated successfully!');
      } else {
        // Add new product via API
        response = await addProductService(productData);
        message.success('Product added successfully!');
      }

      console.log('Backend response:', response);

      // Refresh product list from backend
      dispatch(getProductsActions({}));

      // Close modal and reset states
      setIsModalVisible(false);
      resetFormStates();

    } catch (error: any) {
      console.error('Error saving product:', error);
      console.error('Error details:', error.response?.data);
      
      // Show specific error message from backend if available
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to save product. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to reset form states
  const resetFormStates = () => {
    setAvailableSubCategories([]);
    setAdditionalFields({
      availableSizes: [],
      grammage: [],
      brightness: [],
      packSize: []
    });
    setImageFile(null);
    setImagePreview(null);
    setFileList([]);
    form.resetFields();
    setEditingProduct(null);
  };

  // Handle product deletion success
  const handleDeleteSuccess = () => {
    if (productId) {
      // Refresh product list from backend after deletion
      dispatch(getProductsActions({}));
      message.success('Product deleted successfully!');
    }
    
    setToggleDelete(false);
    setProductID('');
    setProductName('');
  };

  // Custom getPopupContainer function for DatePicker
  const getPopupContainer = (trigger: HTMLElement) => {
    return trigger.parentNode as HTMLElement;
  };

  return (
    <div className="mrb">
      {/* Add style tag for fixing z-index */}
      <style>{datePickerStyles}</style>
      
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
          onDeleteSuccess={handleDeleteSuccess}
        />

        {/* Add/Edit Product Modal */}
        <Modal
          title={
            <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </div>
          }
          open={isModalVisible}
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
                      <Input 
                        placeholder="Enter Product name" 
                        onChange={handleProductNameChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true, message: 'Please select a category' }]}
                    >
                      <Select 
                        placeholder="Select Category"
                        getPopupContainer={getPopupContainer}
                      >
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
                      label="Sub Product"
                    >
                      <Select 
                        placeholder={
                          availableSubCategories.length > 0 
                            ? "Select Sub Product" 
                            : "Enter product name to see sub-categories"
                        }
                        getPopupContainer={getPopupContainer}
                        disabled={availableSubCategories.length === 0}
                        onChange={handleSubCategoryChange}
                      >
                        {availableSubCategories.map((subCategory) => (
                          <Option key={subCategory.value} value={subCategory.value}>
                            {subCategory.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>   
                    {availableSubCategories.length === 0 && (
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '-8px' }}>
                        Sub-categories will appear when you enter a valid product name
                      </div>
                    )}
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

                {/* Additional Fields Section */}
                <Card size="small" type="inner" style={{ marginBottom: 16, backgroundColor: '#f9f9f9' }}>
                  <h4 style={{ marginBottom: 16, fontSize: '14px', fontWeight: 'bold', color: '#000000' }}>Product Specifications</h4>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="availableSizes"
                        label="Available Sizes"
                      >
                        <Select 
                          mode="multiple"
                          placeholder="Select Available Sizes"
                          getPopupContainer={getPopupContainer}
                          value={additionalFields.availableSizes}
                          onChange={handleAvailableSizesChange}
                          options={availableSizesOptions}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="grammage"
                        label="Grammage (gsm)"
                      >
                        <Select 
                          mode="multiple"
                          placeholder="Select Grammage"
                          getPopupContainer={getPopupContainer}
                          value={additionalFields.grammage}
                          onChange={handleGrammageChange}
                          options={grammageOptions}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="brightness"
                        label="Brightness (% ISO)"
                      >
                        <Select 
                          mode="multiple"
                          placeholder="Select Brightness"
                          getPopupContainer={getPopupContainer}
                          value={additionalFields.brightness}
                          onChange={handleBrightnessChange}
                          options={brightnessOptions}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="packSize"
                        label="Pack Size"
                      >
                        <Select 
                          mode="multiple"
                          placeholder="Select Pack Size"
                          getPopupContainer={getPopupContainer}
                          value={additionalFields.packSize}
                          onChange={handlePackSizeChange}
                          options={packSizeOptions}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
                
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
                        getPopupContainer={getPopupContainer}
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
                        getPopupContainer={getPopupContainer}
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
                        getPopupContainer={getPopupContainer}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="productStatus"
                      label="Product Status"
                      rules={[{ required: true, message: 'Please select status' }]}
                    >
                      <Select 
                        placeholder="Select Status"
                        getPopupContainer={getPopupContainer}
                      >
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
                      <Select 
                        placeholder="Select Unit of Measurement"
                        getPopupContainer={getPopupContainer}
                      >
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
                    <Form.Item
                      name="isActive"
                      label="Active"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
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
                      <Select 
                        placeholder="Select Currency"
                        getPopupContainer={getPopupContainer}
                      >
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
                      <Select 
                        placeholder="Select Storage Location"
                        getPopupContainer={getPopupContainer}
                      >
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
                        getPopupContainer={getPopupContainer}
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
                        getPopupContainer={getPopupContainer}
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
                      <Select 
                        placeholder="Select Discount Type"
                        getPopupContainer={getPopupContainer}
                      >
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
                      <Select 
                        placeholder="Select Status"
                        getPopupContainer={getPopupContainer}
                      >
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
                  label="Upload Product Image"
                >
                  <Upload
                    {...uploadProps}
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                  <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
                    Supported formats: JPG, PNG, GIF. Max size: 2MB
                  </div>
                </Form.Item>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div style={{ marginBottom: 16, textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Image Preview:</div>
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                )}
                
                <Form.Item
                  name="productDescription"
                  label="Product Description"
                >
                  <TextArea rows={4} placeholder="Enter product description" />
                </Form.Item>
              </Card>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <Button onClick={handleCancel} size="large" disabled={loading}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" size="large" loading={loading}>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        {/* Product List */}
        <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
          {productList?.length > 0 ? (
            productList.map((data, index) => {
              const { productName, productId, brand, mrp, rlp, category, caseQty, isActive, image, isFocused, subCategory, availableSizes, grammage, brightness, packSize } = data;

              return (
                <div key={productId || index} className="orderContainer" style={{ cursor: "pointer" }}>
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
                          <span>Brand: <span className='fbold'>{brand?.name || 'Default Brand'}</span></span>
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
                          <span>Sub Category: <span className='fbold'>{subCategory || 'N/A'}</span></span>
                        </div>
                        <div>
                          <span>Case Qty: <span className='fbold'>{caseQty}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Fields Display */}
                    {(availableSizes && availableSizes.length > 0) || (grammage && grammage.length > 0) || (brightness && brightness.length > 0) || (packSize && packSize.length > 0) ? (
                      <div className="title">
                        <div className='mrpPrice'>
                          {availableSizes && availableSizes.length > 0 && (
                            <div>
                              <span>Sizes: <span className='fbold'>{Array.isArray(availableSizes) ? availableSizes.join(', ') : availableSizes}</span></span>
                            </div>
                          )}
                          {grammage && grammage.length > 0 && (
                            <div>
                              <span>Grammage: <span className='fbold'>{Array.isArray(grammage) ? grammage.join(', ') : grammage}</span></span>
                            </div>
                          )}
                          {brightness && brightness.length > 0 && (
                            <div>
                              <span>Brightness: <span className='fbold'>{Array.isArray(brightness) ? brightness.join(', ') : brightness}</span></span>
                            </div>
                          )}
                          {packSize && packSize.length > 0 && (
                            <div>
                              <span>Pack Size: <span className='fbold'>{Array.isArray(packSize) ? packSize.join(', ') : packSize}</span></span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                    
                    <div className="title fxbtm">
                      <img 
                        src={image} 
                        alt="productImg" 
                        width={60} 
                        height={60} 
                        onError={handleImageError}
                        style={{ 
                          objectFit: 'cover', 
                          borderRadius: '4px',
                          border: '1px solid #d9d9d9'
                        }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#999' }}>
              No products found. Click the + button to add a new product.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}