import { ArrowLeftOutlined } from "@ant-design/icons";
import { Table, TableColumnsType } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { AppDispatch } from "redux-store/store";
import { getMrVisitReport } from "services/visitsService";
import previousPage from "utils/previousPage";

interface DataType {
  key: React.Key;
  mr: string;
  doctor: number;
  chemist: number;
  stockiest: number;
  total: number;
}

export const MrAnalysis = () => {
  const [mrReport, setMrReport] = useState<DataType[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const columns: TableColumnsType<DataType> = [
    {
      title: "MR",
      dataIndex: "mr",
      render: (text, record) =>
        record.key === "footer" ? (
          <strong style={{ fontWeight: 600 }}>Total(Visits)</strong>
        ) : (
          text
        ),
    },
    {
      title: "Doctor(Visits)",
      dataIndex: "doctor",
      render: (text, record) =>
        record.key === "footer" ? <strong>{text}</strong> : text,
    },
    {
      title: "Chemist(Visits)",
      dataIndex: "chemist",
      render: (text, record) =>
        record.key === "footer" ? <strong>{text}</strong> : text,
    },
    {
      title: "Stockiest(Visits)",
      dataIndex: "stockiest",
      render: (text, record) =>
        record.key === "footer" ? <strong>{text}</strong> : text,
    },
    {
      title: "Total(Visits)",
      dataIndex: "total",
      render: (text, record) =>
        record.key === "footer" ? <strong>{text}</strong> : text,
    },
  ];

  const handleMrVisitTrackingData = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getMrVisitReport("1", "10");
      dispatch(setLoaderAction(false));

      if (response && response.status === 200) {
        const { mrWise, grandTotal } = response.data.data;

        const mappedData: DataType[] = mrWise.map((item: any, index: number) => ({
          key: index.toString(),
          mr: item.name,
          doctor: item.doctor,
          chemist: item.chemist,
          stockiest: item.stockist,
          total: item.total,
        }));

        // Add the footer row at the bottom
        mappedData.push({
          key: "footer",
          mr: "Total(Visits)",
          doctor: grandTotal.doctor,
          chemist: grandTotal.chemist,
          stockiest: grandTotal.stockist,
          total: grandTotal.total,
        });

        setMrReport(mappedData);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
      console.error("Failed to fetch MR report", error);
    }
  };

  useEffect(() => {
    handleMrVisitTrackingData();
  }, []);

  return (
    <div>
      <header
        className="heading heading-container"
        style={{ backgroundColor: "#070D79" }}
      >
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">MR Analysis Report</h1>
      </header>

      <div style={{ padding: "20px" }}>
        <Table<DataType>
          columns={columns}
          dataSource={mrReport}
          size="middle"
          pagination={false}
          rowClassName={(record) => (record.key === "footer" ? "ant-table-footer-row" : "")}
        />
      </div>
    </div>
  );
};
