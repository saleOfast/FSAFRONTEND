import React from 'react';
import { Modal, Button, message } from 'antd';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

interface ExportCollectionDataProps {
    isModalOpen: boolean;
    handleExportOk: () => void;
    handleExportCancel: () => void;
  collectionList: any[];  // Accept the collectionList as a prop
}

const ExportCollectionData: React.FC<ExportCollectionDataProps> = ({ isModalOpen, handleExportOk,handleExportCancel, collectionList }) => {
  
  const exportCollection = () => {
    const ws = XLSX.utils.json_to_sheet(collectionList);  // Use the data received via props
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Collections');
    XLSX.writeFile(wb, 'collections.xlsx');
    message.success('Collections exported successfully!');
  //  handleOk();  // Close modal after export
  };

  return (
  <>
  <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px", marginBottom: "10px" }}>
        {
          collectionList && collectionList?.length > 0 && collectionList?.map((item, index) => {
            const pendingAmount = item?.netAmount - item?.totalCollectedAmount;
            return (
              <div key={index}>
                <Link
                  to={`/visit/collect-payment?order_id=${item?.orderId}`}
                  className="linktoB">
                  <div className="store-list">
                    <div className="shoptitle">
                      <div className="mb-10 linktoB fw-bold">
                        {item?.storeName}
                      </div>
                      <div
                        className={(item?.status).toUpperCase() === 'PAID' ? "activetagC" : "inActivetag"}
                        style={{ background: (item?.status).toUpperCase() === 'PAID' ? "#2DB83D" : "#e61b23" }}
                      >
                        <span className="color-wht">{item?.status}</span>
                      </div>
                    </div>
                    <div className="fs-13">{item?.storeType} | Store ID: <span className="fw-bold">{item?.storeId}</span></div>
                    <div className="fs-13">Order ID: <span className="fw-bold">{item?.orderId}</span></div>
                    <div className="collecAmountTxt">
                      <div className="flexSpace fs-13">
                        <span>Amount: <span className="fw-bold">{item?.netAmount}</span></span>
                      </div>
                      {
                        item?.status.toUpperCase() === 'PENDING' && (
                          <div>Pending Amount: <span className="fw-bold">{pendingAmount.toFixed(2)}</span></div>
                        )
                      }
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
  </>
  );
};

export default ExportCollectionData;
