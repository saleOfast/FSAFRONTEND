import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { getProductCategoryActions } from 'redux-store/action/productAction';
import { capitalizeSubstring } from 'utils/capitalize';
import { dateFormatterNew } from 'utils/common';

interface ExportCategoryDataProps {
  data: any[];
  isModalOpen: boolean;
  handleExportOk: () => void;
  handleExportCancel: () => void;
}

const ExportCategoryData: React.FC<ExportCategoryDataProps> = ({ data }) => {
    const columns: any = [
        {
          title: 'Category Id',
          dataIndex: 'id',
          key: 'id',
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
          title: 'Level',
          dataIndex: 'level',
          key: 'level',
          width: 80,
    
        },
        {
          title: 'Parent Category',
          dataIndex: 'category',
          key: 'category',
          width: 160,
    
        },
        {
          title: 'Created Date',
          dataIndex: 'date',
          key: 'date',
          width: 80,
    
        },
       
      ];
      const productCategoryData = useSelector((state:any) => state?.product?.category);
      const [productCategoryList, setProductCategoryList] = useState<any[]>([]);
      const dispatch = useDispatch<AppDispatch>();
    
      useEffect(() => {
        dispatch(getProductCategoryActions());
      }, []);
    
      useEffect(() => {
        setProductCategoryList(productCategoryData);
      }, [productCategoryData])
    console.log(productCategoryList);
    const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productCategoryList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    XLSX.writeFile(workbook, "CategoryData.xlsx");
  };

  return (
    <>
    <Table
              columns={columns}
              dataSource={

                productCategoryList?.map((data: any) => ({
                  id: data?.productCategoryId,
                  name: `${capitalizeSubstring(data?.name)}`,
                  level: data?.parentId ? "Children" : "Parent",
                  category: data?.parentId ? data?.parent?.name : "",
                  date: dateFormatterNew(data?.createdAt),
                
                }))
              }
              bordered
              scroll={{x:"100%"}}
              size="small" pagination={false} />
    </>
  );
};

export default ExportCategoryData;
