import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { handleImageError } from 'utils/common';
import { Link } from 'react-router-dom';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { useAuth } from 'context/AuthContext';
import { UserRole } from 'enum/common';

type ExportModalProps = {
  isModalOpen: boolean;
  handleExportOk: () => void;
  handleExportCancel: () => void;
  productList: any[];
};

const ExportProductData: React.FC<ExportModalProps> = ({ isModalOpen, handleExportOk,handleExportCancel, productList }) => {
 
  const exportToExcel = () => {
    const exportData = productList.map((product) => ({
      Product_Name: product.productName,
      Brand: product.brand?.name,
      MRP: product.mrp,
      RLP: product.rlp,
      Category: product.category?.name,
      Case_Qty: product.caseQty,
      Active_Status: product.isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, 'products.xlsx');
  };

  const { authState } = useAuth();
  const [toggleDelete, setToggleDelete] = useState(false);
  const [productName, setProductName] = useState('');
  const [productId, setProductID] = useState('');

  const toggleHandler = (productId: string, productName: string) => {
    setToggleDelete(true);
    setProductID(productId);
    setProductName(productName)
  }
  return (
    <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
    {productList && productList?.length > 0 &&
      productList?.map((data, index) => {
        const { productName, productId, brand, mrp, rlp, category, caseQty, isActive, image } = data;
        return (
          <div className='orderContainer' key={index}>
            <div className='ordHeadline'>
              <span className='ordertitle'>{productName}</span>
              <div className={isActive ? "activetag" : "inActivetag"} style={{ margin: "0 0px 10px 0px" }}>
                <span
                  className={isActive ? "blinker" : "blinker-inActive"}>
                </span>
                <span>{isActive ? "Active" : "Inactive"}</span>
              </div>
              {authState?.user?.role === UserRole.ADMIN && <span className='ordertitle'>
                <Link to={`/admin/product/add-new-product?productId=${productId}`} className='linkDefault'>
                  <FormOutlined style={{ fontSize: "14px" }} />
                </Link>
                <DeleteOutlined onClick={() => toggleHandler(productId, productName)} className="deleteIcon" style={{ fontSize: "14px", paddingLeft: "10px" }} />
              </span>}
            </div>
            <div className='orderList'>
              <div className='title'>
                <div className='mrpPrice'>
                  <div>
                    <div>
                      <span>Brand: <span className='fbold'>{brand?.name}</span></span>
                    </div>
                    <span>MRP: <span className='fbold'>₹ {mrp}</span></span>
                  </div>
                  <div>
                    <span>RLP: <span className='fbold'>₹ {rlp}</span></span>
                  </div>
                </div>
              </div>
              <div className='title'>
                <div className='mrpPrice'>
                  <div>
                    <div>
                      <span>Category: <span className='fbold'>{category?.name}</span></span>
                    </div>
                    <span>SKU ID: <span className='fbold'>{productId}</span></span>
                  </div>
                  <div>
                    <span>Case Qty: <span className='fbold'>{caseQty}</span></span>
                  </div>
                </div>
              </div>
              <div className='title fxbtm'>
                <img src={image} alt="productImg" width={60} height={60} 
                onError={handleImageError}/>
              </div>
            </div>
          </div>
        )
      })}
  </div>
  );
};

export default ExportProductData;
