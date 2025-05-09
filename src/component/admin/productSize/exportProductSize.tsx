import React, { useState } from 'react';
import { Button, Modal, Table } from 'antd';
import * as XLSX from 'xlsx';

interface ExportSizeDataProps {
  data: any[]; // Accept the data as props
  isModalOpen: boolean;
  handleExportOk: () => void;
  handleExportCancel: () => void;
}

const ExportSizeData: React.FC<ExportSizeDataProps> = ({isModalOpen, handleExportOk,handleExportCancel, data }) => {
 
    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'sizeId',
            key: 'sizeId',

        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
       
        
    ];
  const exportProductSize = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sizes');
    XLSX.writeFile(workbook, 'sizes_data.xlsx');
  };

  return (
    <>
      <Table

                    dataSource={
                     data?.map((item: any) => ({
                            sizeId: item?.sizeId,
                            name: item?.name,
                            
                        }))
                    }
                    bordered
                    columns={columns}
                    size="small"
                    pagination={false}
                />
    </>
  );
};

export default ExportSizeData;
