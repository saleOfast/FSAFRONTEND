import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'antd';
import * as XLSX from 'xlsx'; // Import XLSX to handle Excel export
import { getProductBrandActions } from 'redux-store/action/productAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { capitalizeSubstring } from 'utils/capitalize';
import { Link } from 'react-router-dom';
import { dateFormatterNew } from 'utils/common';

interface ExportBrandDataProps {
  isModalOpen: boolean;
  handleExportOk: () => void;
  handleExportCancel: () => void;
  data: any[]; // The productBrand data passed as props
}

const ExportBrandData: React.FC<ExportBrandDataProps> = ({ isModalOpen,  handleExportOk, handleExportCancel, data }) => {
    const columns: any = [
        // {
        //   title: 'Brand Id',
        //   dataIndex: 'brandId',
        //   key: 'brandId',
        //   fixed:"left",
        //   width: 80,
          // render: (text) => <a>{text}</a>,
        // },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 160,
        },
        {
          title: 'Created Date',
          dataIndex: 'date',
          key: 'date',
          width: 80,
    
        },
     
      ];
    const productBrandData = useSelector((state:any) => state?.product?.brand);
  
    const [productBrand, setProductBrand] = useState<any[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    
    useEffect(() => {
      dispatch(getProductBrandActions());
    }, []);
    
    useEffect(() => {
      setProductBrand(productBrandData);
    }, [productBrandData])
  console.log(data);
  console.log(productBrandData)
  // Function to export data to Excel
  const exportToBrand = () => {
  //const worksheet = XLSX.utils.json_to_sheet(productBrandData);
  const exportData = productBrandData.map((data: any) => {
    const { brandId, empId, ...rest } = data; // Destructure brandId and empId out
    return rest; // Return the remaining properties without brandId and empId
  });

  // Convert the filtered data to an Excel sheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Brands');
    XLSX.writeFile(workbook, 'brands_data.xlsx');
  };

  return (
    <>
    <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
    <Table
        columns={columns}
        dataSource={productBrand?.map((data: any) => ({
          key: data?.brandId,
         // brandId: data?.brandId,
          name: `${capitalizeSubstring(data?.name)}`,
          date: dateFormatterNew(data?.createdAt),
        }))}
        bordered
        scroll={{ x: '100%' }}
        size="small"
        pagination={false}
      />
                </div>
    </>
  );
};

export default ExportBrandData;
