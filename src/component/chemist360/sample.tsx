import { Button, Table, Row, Col, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "context/AuthContext";
import {
  getProductCategoryActions,
  getProductsActions,
} from "redux-store/action/productAction";
import { AppDispatch } from "redux-store/store";
import { setLoaderAction } from "redux-store/action/appActions";
import {
  getOtherWorkPlaceDataByDateService,
  // getOtherWorkPlaceDataByDateService,
  getSampleDataService,
  postSampleDataService,
} from "services/storeService";
import moment from "moment";
import Card from "antd/es/card/Card";
import { getItemFromLS } from "utils/common";
import { LS_KEYS } from "app-constants";

interface SampleData {
  storeId: string;
  addedBy: string;
  productId: string;
  quantity: string;
  remarks: string;
   
}

interface Product {
  productId: string;
  productName: string;
}

interface SampleResponse {
  samplesId: string;
  product: Product;
  quantity: number;
  user: { firstname: string; lastname: string };
  remarks: string;
  date: string;
}

const Sample= ({storeDetails}:any) => {
  const dispatch = useDispatch<AppDispatch>();
  const storeId = storeDetails?.storeId;
  console.log("storeId",storeId)
  const localStorageData= getItemFromLS(LS_KEYS.userData)
  const userObject= localStorageData?JSON.parse(localStorageData):''
    // console.log("user Id",userObject.id)
  const [sampleResponseData, setSampleResponseData] = useState<
    SampleResponse[]
  >([]);
 
  const [sampleResponseDataByDate, setSampleResponseDataByDate] = useState(
    useState<SampleResponse[]>([])
  );
  console.log("sampleResponseDataByDate", sampleResponseDataByDate)

  const [modalOpen, setModalOpen] = useState(false);
  const [sampleData, setSampleData] = useState<SampleData>({
    storeId,
    addedBy: userObject?.id,
    productId: "",
    quantity: "",
    remarks: "",
  });
  const [state, setState] = useState(false);

  const productData = useSelector((state: any) => state?.product?.productList);

  useEffect(() => {
    handleSampleDataByDate();
  }, []);
  const handleSampleDataByDate = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getOtherWorkPlaceDataByDateService(storeId);
      dispatch(setLoaderAction(false));
      if (response.status === 200) {
        setSampleResponseDataByDate(response.data.data || []);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
      console.error("Error fetching sample data:", error);
    }
  };


  useEffect(() => {
    dispatch(getProductsActions({}));
    dispatch(getProductCategoryActions());
  }, [dispatch]);

  useEffect(() => {
    if (storeId) handleSampleData();
  }, [storeId]);

  const handleSampleData = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getSampleDataService(storeId);
      dispatch(setLoaderAction(false));
      if (response.status === 200) {
        setSampleResponseData(response?.data?.data || []);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
      console.error("Error fetching sample data:", error);
    }
  };

  const handleChange = (key: keyof SampleData, value: string) => {
    setSampleData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await postSampleDataService(sampleData);
      dispatch(setLoaderAction(false));
      if (response.status === 200) {
        setModalOpen(false);
        handleSampleData();
        handleSampleDataByDate();
        setSampleData({
          storeId,
          addedBy: userObject?.id,
          productId: "",
          quantity: "",
          remarks: "",
        });
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
      console.error("Error adding sample:", error);
    }
  };

  // for all data table
  const columns: ColumnsType<SampleResponse> = [
    {
      title: "Product Sample",
      dataIndex: "product",
      key: "productSample",
      render: (product) => <b>{product?.productName || "N/A"}</b>,
      align: "center",
      width: 200,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 120,
    },
    {
      title: "Added by",
      dataIndex: "user",
      key: "addedBy",
      render: (user) => `${user?.firstname} ${user?.lastname}` || "Unknown",
      align: "center",
      width: 200,
    },
    {
      title: "Remarks/Notes",
      dataIndex: "remarks",
      key: "notes",
      render: (text) => <i>{text}</i>,
      align: "center",
      width: 300,
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) =>
        text ? moment(text).format("DD/MM/YYYY HH:mm:ss") : "N/A",
      align: "center",
      width: 180,
    },
  ];
 

  const columnss = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: "20%",
      render: (product: any) => <b>{product?.productName || "N/A"}</b>,
    },
    {
      title: "Added By",
      dataIndex: "user",
      key: "user",
      render: (user:any) => `${user?.firstname}` || "Unknown",

      width: "20%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "20%",
    },
    {
      title: "Remarks/Notes",
      dataIndex: "remarks",
      key: "remarks",
      width: "20%",
    },
  ];
  return (
    <div style={{ padding: "6px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          className="main-title"
          style={{ fontSize: "16px", fontWeight: "bold" }}
        >
          Sales Distribution
        </p>
        <Button
          type="primary"
          style={{ height: "40px" }}
          onClick={() => setModalOpen(true)}
        >
          Add Sample
        </Button>
      </div>

      <Card
        style={{
          borderRadius: "16px",
          padding: "10px",
          marginBottom: "20px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {sampleResponseDataByDate.map((item:any, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div
              style={{
                fontSize: "16px",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              {new Date(item.date).toLocaleDateString("en-GB")}
            </div>
            <Table
              dataSource={item.samples}
              columns={columnss}
              pagination={false}
              bordered
              style={{ borderRadius: "10px", overflow: "hidden" }}
            />
          </div>
        ))}
      </Card>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "15px",
        }}
      >
        <Button
          type="primary"
          onClick={() => setState(!state)}
          style={{ height: "40px" }}
        >
          {state ? "View Less" : "View More"}
        </Button>
      </div>

      {/* For all data table */}
      {state && (
        <Table
          dataSource={sampleResponseData}
          columns={columns}
          pagination={false}
          bordered
          rowKey={(record) => record.samplesId}
        />
      )}

      <Modal
        title="Add Sample"
        centered
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
      >
        <Row gutter={[24, 24]}>
          <Col span={24} md={12}>
            <label>Product Sample</label>
            <Select
              placeholder="Select Product"
              style={{ width: "100%" }}
              options={productData?.map((item: Product) => ({
                value: item.productId,
                label: item.productName,
              }))}
              onChange={(value) => handleChange("productId", value)}
            />
          </Col>
          <Col span={24} md={12}>
            <label>Quantity</label>
            <Input
              placeholder="Enter Quantity"
              onChange={(e) => handleChange("quantity", e.target.value)}
              value={sampleData.quantity}
            />
          </Col>
          <Col span={24}>
            <label>Remarks</label>
            <TextArea
              placeholder="Add remarks..."
              rows={4}
              onChange={(e) => handleChange("remarks", e.target.value)}
              value={sampleData.remarks}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Sample;
