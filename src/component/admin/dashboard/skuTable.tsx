import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capitalizeSubstring } from 'utils/capitalize';

interface DataType {
  key: string;
  name: string;
  brand: string;
  sales: string;
}



const SkuTable = React.memo(({ topSKU, isSalesColumn }: any) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
  ...(isSalesColumn ? [ {
      title: 'Sales (in Rs.)',
      dataIndex: 'sales',
      key: 'sales',
    }]: [])
  ];
  return (<Table columns={columns}
    dataSource={
      topSKU?.map((data: any, index: any) => ({
        key: index,
        name: capitalizeSubstring(data?.productname),
        brand: capitalizeSubstring(data?.brandname),
        sales: `₹${data?.total_sales}`,
      }))
    }
    size="small" pagination={false} />
  )
})

export default SkuTable;