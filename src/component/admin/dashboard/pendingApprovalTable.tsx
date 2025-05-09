import React, { useEffect, useState } from 'react';
import { Button, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capitalizeSubstring } from 'utils/capitalize';
import { SpecialDiscountStatus } from 'enum/order';
import { Link } from 'react-router-dom';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
interface DataType {
  key: string;
  ssm: string;
  outlet: string;
  discount: string;
  action: string[];
}



const PendingApprovalTable = ({ pendingApproval, onChangeHandler }: any) => {

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};
const [isMobile, setIsMobile] = useState<boolean>(false);
useEffect(() => {
  setIsMobile(isMobileDevice());
}, []);
if(pendingApproval > 5){
  return pendingApproval.slice(0,-1)
}
const columns: ColumnsType<DataType> = [
  {
    title: 'Order Id',
    dataIndex: 'orderId',
    key: 'orderId',
    render: (text) => <Link to={`/order/order-summary/${text}`}>{text}</Link>,
  },
  {
    title: 'Outlet',
    dataIndex: 'outlet',
    key: 'outlet',
  },
  {
    title: isMobile ? 'Disc': 'Discount',
    dataIndex: 'discount',
    key: 'discount',
  },
  {
    title: isMobile ? 'Amt' : 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={
          pendingApproval?.slice(0, 5)?.map((data: any, index: any) => ({
            key: data?.order_id,
            orderId: data?.order_id,
            // ssm: `${capitalizeSubstring(data?.firstname)} ${capitalizeSubstring(data?.lastname)}`,
            outlet: capitalizeSubstring(data?.store_name),
            discount: `${data?.specialdiscountvalue ?? "NA"}%`,
            amount: `₹${data?.orderamount}`,
            // action: <div style={{display:"flex", gap:"5px", flexWrap:"wrap"}}><Button style={{background:"#c03232", color:"white"}}><CloseOutlined /></Button> <Button style={{background:"green", color:"white"}}><CheckOutlined  /></Button></div>
            action: (
              <Select
                defaultValue="Pending"
                placeholder="Pending"
                value={capitalizeSubstring(data?.discount_status?.toLowerCase() ?? "Pending")}
                onChange={onChangeHandler}
                options={[
                  { label: 'Approved', value: JSON.stringify({ specialDiscountStatus: SpecialDiscountStatus.APPROVED, orderId: data?.order_id, specialdiscountvalue: data?.specialdiscountvalue }) },
                  { label: 'Rejected', value: JSON.stringify({ specialDiscountStatus: SpecialDiscountStatus.REJECTED, orderId: data?.order_id, specialdiscountvalue: data?.specialdiscountvalue }) },
                ]}
              />
            ),
          }))
        }
        size="small"
        style={{fontSize:"7px!important"}}
        pagination={false}
        // footer={() => 'View All'}
      />
      {pendingApproval && pendingApproval?.length > 5 &&
    <Link to="/Pending-approval">
   <div className='viewAll'>
    View All
    </div>
    </Link>
    }
   
    </div>
  )
}

export default PendingApprovalTable;