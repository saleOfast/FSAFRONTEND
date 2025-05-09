import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capitalizeSubstring } from 'utils/capitalize';

interface DataType {
  key: string;
  name: string;
  role: string;
  sales: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Sales (in Rs.)',
    dataIndex: 'sales',
    key: 'sales',
  },
];

const TopPerformersTable = ({ topPerformer }: any): any => {
  return (<Table columns={columns}
    dataSource={
      topPerformer?.map((data: any) => ({
        key: data?.empId,
        name: `${capitalizeSubstring(data?.firstname)} ${capitalizeSubstring(data?.lastname)}`,
        role: data?.role,
        sales: `₹${data?.totalamount}`
      }))
    }
    size="small" pagination={false} />)
}
export default TopPerformersTable;