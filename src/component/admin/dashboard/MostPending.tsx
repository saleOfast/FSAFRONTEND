import { Table, TableColumnsType } from "antd";
import { dispatch } from "d3";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { AppDispatch } from "redux-store/store";
import { getPendingAmount } from "services/dashboardService";

interface DataType {
  key: React.Key;
  storeID: string;
  storeName: string;
  totalPendingAmount: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "storeId",
    dataIndex: "storeId",
  },
  {
    title: "storeName",
    dataIndex: "storeName",
  },
  {
    title: "totalPendingAmount",
    dataIndex: "totalPendingAmount",
  },
];
// const data: DataType[] = [
//   {
//     key: "1",
//     name: "John Brown",
//     age: 32,
//     address: "New York No. 1 Lake Park",
//   },
//   {
//     key: "2",
//     name: "Jim Green",
//     age: 42,
//     address: "London No. 1 Lake Park",
//   },
//   {
//     key: "3",
//     name: "Joe Black",
//     age: 32,
//     address: "Sydney No. 1 Lake Park",
//   },
// ];

const MostPending = () => {
  const [pendingAmount, setPendingAmount] = useState<DataType[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    handlePendingAmount();
  }, []);

  const handlePendingAmount = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getPendingAmount();
      console.log("+++", response.data.data);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        const sorted = data.sort(
            (a: DataType, b: DataType) => b.totalPendingAmount - a.totalPendingAmount
          );
            // Optionally, you can take top N (e.g., top 1 or top 3)
        const topMost = sorted.slice(0, 5); // Change to `.slice(0, 3)` for top 3

        setPendingAmount(topMost);
      }
    } catch (error) {
      console.log(error, "error");
      dispatch(setLoaderAction(false));
    }
  };
  return (
    <>
    {
        pendingAmount?.filter(()=>{
            return 
        })
    }
    
      <div>
      <Table<DataType> columns={columns} dataSource={pendingAmount} size="middle" />
    </div>
    </>
  
  );
};

export default MostPending;
