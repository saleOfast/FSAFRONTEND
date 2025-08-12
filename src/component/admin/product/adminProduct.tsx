import { ArrowLeftOutlined, DeleteOutlined, FormOutlined, PlusOutlined, SearchOutlined, CheckCircleFilled, CloseCircleFilled, } from '@ant-design/icons';
import { Input, Select, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProductCategoryActions, getProductsActions } from 'redux-store/action/productAction';
import { AppDispatch } from 'redux-store/store';
import '../../style/orderList.css';
import { deleteProductService } from 'services/productService';
import DeleteItem from '../common/deleteItem';
import { useAuth } from 'context/AuthContext';
import { UserRole } from 'enum/common';
import { handleImageError } from 'utils/common';

export default function AdminProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { authState } = useAuth();

  // Fetch data from Redux store
  const productData = useSelector((state: any) => state?.product?.productList);
  const productCategoryData = useSelector((state: any) => state?.product?.category);

  // Local state for product list
  const [productList, setProductList] = useState<any[]>([]);
  const [value, setValue] = useState<any>("Category");
  const [toggleDelete, setToggleDelete] = useState(false);
  const [productName, setProductName] = useState('');
  const [productId, setProductID] = useState('');

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

  return (
    <div className="mrb">
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={() => navigate(-1)} className="back-button" />
        <h1 className="page-title pr-18">Medicine</h1>
      </header>

      {authState?.user?.role !== UserRole.SSM && authState?.user?.role !== UserRole.RETAILER && (
        <Link to="./add-new-product">
          <div className="addIcon">
            <PlusOutlined className="plusIcon" />
          </div>
        </Link>
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

        {/* Product List */}
        <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
          {productList?.map((data, index) => {
            const { productName, productId, brand, mrp, rlp, products, category, caseQty, isActive, image, isFocused } = data;

            return (
              <div key={index} className="orderContainer" onClick={() => navigate(`/admin/product/add-new-product?productId=${productId}`)} style={{ cursor: "pointer" }}>
                <div className="ordHeadline">
                  <span className="ordertitle">{productName}</span>

                  {/* Status Container */}
                  <div className="status-container">
                    {/* Active/Inactive Indicator */}
                    <div className={isActive ? "activetag" : "inActivetag"}>
                      <span className={isActive ? "blinker" : "blinker-inActive"}></span>
                      <span>{isActive ? "Active" : "Inactive"}</span>
                    </div>

                    <div className="active-focused">
                      <div>
                        {isFocused ?
                          <CheckCircleFilled className='checkIcon' />
                          :
                          <CloseCircleFilled className='closeIcon' />
                        }
                      </div>
                      <div className="focus-text">{isFocused ? "Focused" : "Not Focused"}</div>
                    </div>
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
