import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'antd';
import * as XLSX from 'xlsx';
import { capitalizeSubstring } from 'utils/capitalize';
import { dateFormatterNew } from 'utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { setStoreCategoryAction } from 'redux-store/action/storeActions';

interface ExportExcelProps {
  data: any[];
  isModalOpen: boolean;
  handleExportOk: () => void;
  handleExportCancel: () => void;
}

const ExportStoreCategoryData: React.FC<ExportExcelProps> = ({ isModalOpen, handleExportOk,handleExportCancel,data }) => {
    const columns: any = [
        {
          title: 'Category Id',
          dataIndex: 'storeCatId',
          key: 'storeCatId',
          fixed:"left",
          width: 80,
          // render: (text) => <a>{text}</a>,
        },
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
    


  const [storeCategoryList, setStoreCategoryList] = useState<any[]>([]);
  const storeCategoryData = useSelector((state:any) => state?.store?.storeCategory);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setStoreCategoryAction());
  }, []);

  useEffect(() => {
    setStoreCategoryList(storeCategoryData);
  }, [storeCategoryData])

  const exportToStoreCategory = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Store Categories");
    XLSX.writeFile(workbook, "StoreCategories.xlsx");
  };

  return (
    <>
      <Table className="content"
              columns={columns}
              dataSource={

                storeCategoryList?.map((data: any) => ({
                  storeCatId: data?.storeCategoryId,
                  name: `${capitalizeSubstring(data?.categoryName)}`,
                  date: dateFormatterNew(data?.createdAt),
                
                }))
              }
              bordered
              scroll={{x:"100%"}}
              size="small" pagination={false} />
    </>
  );
};

export default ExportStoreCategoryData;
