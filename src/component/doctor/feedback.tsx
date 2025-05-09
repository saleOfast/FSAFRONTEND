import { StarFilled } from "@ant-design/icons";
import { Button, Col, Input, Modal, Rate, Row, Select } from "antd";
import { LS_KEYS } from "app-constants";
import { useAuth } from "context/AuthContext";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import {
  getProductCategoryActions,
  getProductsActions,
} from "redux-store/action/productAction";
import { AppDispatch } from "redux-store/store";
import {
  getFeedbackDataService,
  postFeedbackDataService,
} from "services/storeService";
import { getItemFromLS } from "utils/common";

// 2️⃣ Type the props correctly
const FeedbackItem: React.FC<{ feedback: any }> = ({ feedback }) => (
  <Col span={16} offset={4}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#00C68A",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Icon
        </div>
        <div>
          <p style={{ margin: "4px 0", fontWeight: "bold" }}>
            {feedback?.product?.productName || "Paracetamole"}
            {[...Array(feedback.rating)].map((_, index) => (
              <StarFilled
                key={index}
                style={{ color: "gold", marginLeft: "4px", marginRight: "6px" }}
              />
            ))}
          </p>
          <p style={{ margin: "2px 0", color: "#555" }}>
            Detailed by <strong>{feedback?.user?.firstname + " "+ feedback?.user?.lastname  || "Rahul"}</strong> @{" "}
            Date: {dayjs(feedback.createdAt).format("DD-MM-YYYY")}
          </p>
          <p style={{ margin: "2px 0", color: "#007BFF", cursor: "pointer" }}>
            Added Notes{" "}
            <span style={{ marginLeft: "20px", color: "black" }}>
              {feedback.remarks}
            </span>
          </p>
        </div>
      </div>
      <p style={{ margin: "2px 0", color: "#555" }}>
           
            {new Date(feedback.createdAt).toTimeString()}
          </p>
    </div>
    <hr />
  </Col>
);

export const Feedback  = ({ storeDetails, setStoreDetails }:any) => {
  const storeId=storeDetails?.storeId
  console.log("storeDetails",storeDetails.storeId)
  const [modal1Open, setModal1Open] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const localStorageData= getItemFromLS(LS_KEYS.userData)
  const userObject= localStorageData?JSON.parse(localStorageData):''
  console.log("user Id",userObject.name)
  const [formData, setFormData] = useState({
    productId: "",
    addedBy: userObject?.id,
    storeId: storeDetails?.storeId,
    remarks: "",
    rating: 0,
  });

  const productData = useSelector((state: any) => state?.product?.productList);

  const { authState } = useAuth();
  useEffect(() => {
    dispatch(getProductsActions({}));
    dispatch(getProductCategoryActions());
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    handleFeedbackData();
  }, []);

  const handleFeedbackData = async () => {
    try {
      dispatch(setLoaderAction(true));

      const response = await getFeedbackDataService(storeId);
      console.log("feedbackccccc", response);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        setFeedback(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log("formData", formData);
    try {
      dispatch(setLoaderAction(true));
      const response = await postFeedbackDataService(formData); // API Call
      dispatch(setLoaderAction(false));

      if (response.status === 200) {
        console.log("FeedbackData:", response.data);
        setModal1Open(false); // Close Modal
        handleFeedbackData(); // Refresh Data
        setFormData({
          // Clear Form
          productId: "",
          rating: 0,
          addedBy: userObject?.id,
          storeId: storeDetails?.storeId,
          remarks: "",
        });
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
      console.error("Error adding activity:", error);
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0 10px",
        }}
      >
        <p style={{ fontSize: "16px" }}>Product Feedback</p>
        <Button
          type="primary"
          onClick={() => setModal1Open(true)}
          style={{ marginRight: "16px", height: "40px", color: "white" }}
        >
          {/* //backgroundColor: "#00C68A", */}
          <span style={{ fontSize: "16px" }}>Add Feedback</span>
        </Button>
      </div>

      <Row>
        {feedback.map((feedback: any) => (
          <FeedbackItem key={feedback.id} feedback={feedback} />
        ))}
      </Row>
      <Modal
        title="Add Feedback"
        centered
        open={modal1Open}
        onOk={handleSubmit}
        onCancel={() => setModal1Open(false)}
        style={{ right: "10px" }}
      >
        <Row gutter={[24, 24]} style={{ padding: "20px" }}>
          <Col span={24}>
            <label>Select Product</label>
            <Select
              placeholder="Products"
              value={formData.productId || undefined}
              style={{ width: "100%", height: "45px" }}
              options={productData?.map((product: any) => ({
                value: product.productId,
                label: product.productName,
              }))}
              onChange={(value) => handleChange("productId", value)}
            />
          </Col>

          <Col span={24}>
            <label>Added By</label>
            <Input
              placeholder="Added By"
              style={{ padding: "12px" }}
              value={userObject.name}
              // onChange={(e) => handleChange("addedBy", e.target.value)}
            />
          </Col>

          <Col span={24}>
            <label>🗒️ Add Notes</label>
            <Input.TextArea
              placeholder="Add Notes"
              rows={4}
              style={{ padding: "12px" }}
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
            />
          </Col>
          <Col span={12}>
            <label>Rating</label>
            <Rate
              style={{ display: "block", padding: "12px 0" }}
              value={formData.rating}
              onChange={(value) => handleChange("rating", value)}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
