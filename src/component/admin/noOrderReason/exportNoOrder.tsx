import React, { useState } from 'react';
import { Button, Modal, Table } from 'antd';
import * as XLSX from 'xlsx'; // You will need this library to export to Excel

interface AppProps {
  data: any[]; // Define the prop type
  isModalOpen: boolean;
  handleExportOk: () => void;
  handleExportCancel: () => void;
}

const ExportNoOrder: React.FC<AppProps> = ({ isModalOpen, handleExportOk,handleExportCancel,data }) => {
    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'reasonId',
            key: 'reasonId',
         
        },
        {
            title: 'Reason Description',
            dataIndex: 'description',
            key: 'description',
        },
      
    ];

  

  const exportNoOrder = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'No Order Reasons');
    XLSX.writeFile(workbook, 'NoOrderReasons.xlsx');
  };

  return (
    <>
     <Table
                       columns={columns} 
                       dataSource={
                         data?.map((item: any) => ({
                            reasonId: item?.reasonId,
                            description: item?.description,
                           
                        }))
                       }
                       bordered
                    
                       size="small"
                       pagination={false}
                   />
    
    </>
  );
};

export default ExportNoOrder;
