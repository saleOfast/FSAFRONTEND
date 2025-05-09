import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Table, Tag } from "antd";
import Pills from "component/Pills";
import RupeeSymbol from "component/RupeeSymbol";
import { PaymentStatus } from "enum/order";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderListByStoreIdService } from "services/orderService";
import { IGetOrderHistoryData } from "types/Order";
import { IVisitParams } from "types/Visits";
import { dateFormatterNew } from "utils/common";

function PastOrdersDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<IVisitParams>();
  const [orderList, setOrderList] = useState<IGetOrderHistoryData[]>([]);

  useEffect(() => {
    async function getOrderHistory() {
      try {
        if (params.storeId) {
          setIsLoading(true);
          const res = await getOrderListByStoreIdService(params.storeId)
          setIsLoading(false);
          if (res && res.data.status === 200) {
            setOrderList(res.data.data)
          }
        }
      } catch (error) {

      }
    }
    getOrderHistory();
  }, [params.storeId]);

  const columns: any = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Order Amount',
      dataIndex: 'order_amount',
      key: 'order_amount',
    },
    {
      title: 'Collection Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => {
        return (
          <Tag color={text === PaymentStatus.SUCCESS ? "green" : "red"} style={{fontWeight: 500}}>{text === PaymentStatus.SUCCESS ? "Paid" : "Pending"}</Tag>
        )
      },
    },
  ];

  const dataSource: any = orderList?.map((item: any, index: any) => ({
    key: index,
    date: dateFormatterNew(item?.orderDate ?? ""),
    order_id: item?.orderId ?? "",
    order_amount: item?.netAmount ?? "",
    status: item?.paymentStatus ?? ""
  }));

  return (
    // <table className="pastOrderTable">
    //   <thead>
    //     <tr>
    //       <th className="inveContainer">Date</th>
    //       <th className="inveContainer">Order ID</th>
    //       <th className="inveContainer">Order Amount</th>
    //       <th className="inveContainer">Collection Status</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {isLoading && <tr className="invenData">
    //       <td colSpan={4} className="text-align-center"><Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /></td>
    //     </tr>}
    //     {
    //       !isLoading && (
    //         orderList?.length === 0 ?
    //           <div>No order found</div>
    //           :
    //           orderList?.map(i => {
    //             return (
    //               <tr className="invenData" key={i.orderId}>
    //                 <td className="invenData">{dateFormatterNew(i.orderDate)}</td>
    //                 <td className="invenDataId"><Link to={`/order/order-summary/${i.orderId}`}>{i.orderId}</Link></td>
    //                 <td className="invenData"><RupeeSymbol />{i.netAmount}</td>
    //                 <td className="invenData">
    //                   <Pills
    //                     type={i.paymentStatus === PaymentStatus.SUCCESS ? "success" : "error"}>
    //                     {i.paymentStatus === PaymentStatus.SUCCESS ? "paid" : "pending"}
    //                   </Pills>
    //                 </td>
    //               </tr>
    //             )
    //           })

    //       )
    //     }
    //   </tbody>
    // </table>
    <div>
      <main className=''>
        <Table

          dataSource={
            dataSource
          }
          bordered
          columns={columns}
          size="small"
          pagination={false}
        />
      </main>
    </div>
  );
}


export default PastOrdersDetails