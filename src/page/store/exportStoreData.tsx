import React from 'react'; 
import { Button, Modal, message } from 'antd';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { IStoreData } from 'types/Store';
import { Link } from 'react-router-dom';
import { CrownOutlined, FormOutlined } from '@ant-design/icons';

interface ExportStoreDataProps {
  storeData: IStoreData[];
  isModalOpen: boolean;
  handleExportOk: () => void;
  handleExportCancel: () => void;
}

const ExportStoreData: React.FC<ExportStoreDataProps> = ({ storeData, isModalOpen, handleExportOk, handleExportCancel      }) => {
  console.log({storeData})
  const handleExport = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(storeData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Stores');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'stores-data.xlsx');
      message.success('Data exported successfully.');
    } catch (error) {
      message.error('Failed to export data.');
    }
  };

  return (
    // <Modal
    //   title="Export Data"
    //   open={isModalOpen}
    //   onOk={() => {
    //     handleOk();
    //     handleExport();
    //   }}
    //   onCancel={() => {
    //     handleCancel();
    //   }}
    // >
     <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px", marginBottom: "10px" }}>
          {
            storeData && storeData.length > 0 && storeData.map((item, index) => {
              return (
                <div className="store-list" key={index}>
                  <div className="shoptitle">
                    <Link
                      to={`/stores/store-details?store_id=${item?.storeId}`}
                      className="linktoB">
                      <div className="fontb">
                        {item?.storeName}
                      </div>
                    </Link>
                    <Link
                      to={`/stores/store-details?store_id=${item?.storeId}`}
                      className="linktoB">
                      <div className={item?.isActive ? "activetag" : "inActivetag"}>
                        <span
                          className={item?.isActive ? "blinker" : "blinker-inActive"}
                        >
                        </span>
                        <span>{item?.isActive ? "Active" : "Inactive"}</span>
                      </div>
                    </Link>
                    <span>
                      <Link to={`/stores/add-store?storeId=${item?.storeId}`} className='linkDefault'>
                        <FormOutlined style={{ fontSize: "14px" }} />
                      </Link>
                    </span>
                  </div>
                  <Link
                    to={`/stores/store-details?store_id=${item?.storeId}`}
                    className="linktoB">
                    <div className="storeConlist">
                      <div>
                        <div className="storeIdTxt">
                          {item?.storeCat?.categoryName} | store ID: {item?.storeId}
                        </div>
                        <div className="flexSpace storeAddTxt">
                          <span>{item?.addressLine1}, {item?.addressLine2}, {item?.state}</span>
                        </div>
                      </div>
                      {
                        item?.isPremiumStore && (
                          <div className="premiumtag">
                            <div className="bli">
                              <CrownOutlined className="crownIcon" />
                            </div>
                            <span className="premiumText">Premium</span>
                          </div>
                        )
                      }
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
    // </Modal>
  );
};

export default ExportStoreData;
