import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capitalizeSubstring } from 'utils/capitalize';
import { dateFormatterDigit } from 'utils/common';
import { Link } from 'react-router-dom';

interface DataType {
  key: string;
  ssm: string;
  outlet: string;
  beat: string;
  created_date: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'SSM',
    dataIndex: 'ssm',
    key: 'ssm',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Outlet',
    dataIndex: 'outlet',
    key: 'outlet',
  },
  {
    title: 'Opening Date',
    dataIndex: 'created_date',
    key: 'v',
  },
];
const UnbilledStoresTable = React.memo(({unbilledStores}:any) =>{
  return(
   <><Table 
   columns={columns} 
   dataSource={
    unbilledStores?.slice(0,5).map((data:any, index:any)=>({
      key: index,
      ssm: `${capitalizeSubstring(data?.firstname ?? "")} ${capitalizeSubstring(data?.lastname?? "")}`,
      outlet: capitalizeSubstring(data?.store_name),
      // beat: 'NA',
      created_date: dateFormatterDigit(data?.created_at)
    }))
  } 
   size="small" 
   pagination={false}
   />
   {unbilledStores && unbilledStores?.length > 5 &&
    <Link to="/unbilled-stores">
   <div className='viewAll'>
    View All
    </div>
    </Link>
    }
   </>
  )
})

export default UnbilledStoresTable;