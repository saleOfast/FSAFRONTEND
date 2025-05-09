import { StarFilled } from "@ant-design/icons";
import { Button, Card, Col, Input, Modal, Rate, Row, Select, Typography } from "antd";
import { LS_KEYS } from "app-constants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import {
  getCompetitorProductBrandActions,
  getProductCategoryActions,
  getProductsActions,
} from "redux-store/action/productAction";
import { AppDispatch } from "redux-store/store";
import { addRcpaService, getRcpaService } from "services/storeService";
import { getItemFromLS } from "utils/common";

// TypeScript interface for feedback data
interface FeedbackData {
  id: number;
  productName: string;
  rating: number;
  detailedBy: string;
  time: string;
  timer: string;
  overallExperience: number;
}

const FeedbackItem: React.FC<{
  feedback: any;
  onView: (feedback: any) => void;
}> = ({ feedback, onView }) => (
  <Col span={16} offset={4}>
   <Card style={{ border: "1px solid #ddd", borderRadius: "8px", marginBottom: "5px", padding: "0px", }}>
      <Row gutter={[6, 6]} align="middle">
        {/* Product Icon */}
        {/* <Col span={4}>
          <div
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "#00C68A",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {feedback?.product?.productName?.charAt(0) || "P"}
          </div>
        </Col> */}

        {/* Product Info */}
        <Col span={24}>
          <p style={{ margin: "0px 0", fontWeight: "bold" }}>
            {feedback.product?.productName}{" "}
            {[...Array(feedback.rating)].map((_, index) => (
              <StarFilled key={index} style={{ color: "gold", marginLeft: "4px" }} />
            ))}
          </p>

          <p style={{ margin: "4px 0", color: "#555" }}>
            Detailed by <strong>{feedback.user?.firstname} {feedback.user?.lastname}</strong> @ {new Date(feedback.createdAt).toLocaleString()}
          </p>
        </Col>
      </Row>

      {/* Additional Info */}
      <Row gutter={[16, 8]} style={{ marginTop: "2px" }}>
        {feedback.PromotionalOffers && (
          <Col span={12}>
            <p style={{ margin: "2px 0", color: "green" }}>
              Promotional Offers: <strong>{feedback.PromotionalOffers}</strong>
            </p>
          </Col>
        )}
        {feedback.ServicesProvided && (
          <Col span={12}>
            <p style={{ margin: "2px 0", color: "#555" }}>
              Services Provided: <strong>{feedback.ServicesProvided}</strong>
            </p>
          </Col>
        )}
        {feedback.competitorBrand && (
          <Col span={12}>
            <p style={{ margin: "2px 0", color: "#555" }}>
              Competitor Brand: <strong>{feedback.competitorBrand}</strong>
            </p>
          </Col>
        )}
        {feedback.priceComparison && (
          <Col span={12}>
            <p style={{ margin: "2px 0", color: "#555" }}>
              Price Comparison: <strong>{feedback.priceComparison}</strong>
            </p>
          </Col>
        )}
        {feedback.quantitySold && (
          <Col span={12}>
            <p style={{ margin: "2px 0", color: "#555" }}>
              Quantity Sold: <strong>{feedback.quantitySold}</strong>
            </p>
          </Col>
        )}
        {feedback.deliveryIssues && (
          <Col span={12}>
            <p style={{ margin: "2px 0", color: "#555" }}>
              Delivery Issues: <strong>{feedback.deliveryIssues ? "Yes" : "No"}</strong>
            </p>
          </Col>
        )}
        {feedback.stockLevel && (
          <Col span={12}>
            <p style={{ margin: "2px 0", color: "#555" }}>
              Stock Level: <strong>{feedback.stockLevel}</strong>
            </p>
          </Col>
        )}
        {feedback.stockLevelCompetitor && (
          <Col span={12}>
            <p style={{ margin: "2px 0", color: "#555" }}>
            Competitor stock Levels : <strong>{feedback.stockLevelCompetitor}</strong>
            </p>
          </Col>
        )}
         
       
         

        {feedback.remarks && (
          <Col span={24}>
            <p style={{ margin: "2px 0", color: "#007BFF" }}>
              Remarks: <strong>{feedback.remarks}</strong>
            </p>
          </Col>
        )}
      </Row>

      {/* View Details */}
      {/* <Row justify="end">
        <Col>
          <p style={{ margin: "2px 0", color: "#007BFF", cursor: "pointer" }} onClick={() => onView(feedback)}>
            View Details
          </p>
        </Col>
      </Row> */}
    </Card>
    {/* <hr /> */}
  </Col>
);

export const Feedback = ({ storeDetails, setStoreDetails }: any) => {
  const productBrandData = useSelector((state:any) => state?.product?.competitorBrand);
  console.log("competitorBrandData",productBrandData)
  const storeId = storeDetails?.storeId;
  const localStorageData = getItemFromLS(LS_KEYS.userData);
  const userObject = localStorageData ? JSON.parse(localStorageData) : "";
  const productData = useSelector((state: any) => state?.product?.productList);
  console.log("Activity product data", productData);
  const dispatch = useDispatch<AppDispatch>();
  const [modal1Open, setModal1Open] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(
    null
  );
  const [rcpaData, setRcpaData] = useState([]);

  useEffect(() => {
    dispatch(getProductsActions({}));
    dispatch(getProductCategoryActions());
    dispatch(getCompetitorProductBrandActions())
  }, []);

  const [formData, setFormData] = useState({
    productId: "",
    quantitySold: "",
    stockLevel: "",
    stockLevelCompetitor: "",
    competitorBrand: "",
    priceComparison: "",
    PromotionalOffers: "",
    deliveryIssues: "",
    ServicesProvided: "",
    remarks: "",
    addedBy: userObject?.id,
    storeId: storeDetails?.storeId,
    rating: 0,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "stockLevel" ||
        field === "stockLevelCompetitor" ||
        field === "productId" ||
        field === "productId" ||
        field === "quantitySold"
          ? parseInt(value, 10) || 0 // Convert to number, default to 0 if NaN
          : value,
    }));
  };

  const handleViewClick = (feedback: FeedbackData) => {
    setSelectedFeedback(feedback);
  };
  useEffect(() => {
    handleRcpaData();
  }, []);
  const handleRcpaData = async () => {
    try {
      dispatch(setLoaderAction(true));

      const response = await getRcpaService(storeId);
      console.log("+++,", response.data.data);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;

        setRcpaData(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  const handleSubmit = async () => {
    console.log("formData", formData);
    try {
      dispatch(setLoaderAction(true));
      const response = await addRcpaService(formData); // API Call
      dispatch(setLoaderAction(false));

      if (response.status === 200) {
        console.log("RCPA added:", response.data);
        setModal1Open(false); // Close Modal
        handleRcpaData(); // Refresh Data
        setFormData({
          productId: "",
          quantitySold: "",
          stockLevel: "",
          stockLevelCompetitor: "",
          competitorBrand: "",
          priceComparison: "",
          PromotionalOffers: "",
          deliveryIssues: "",
          ServicesProvided: "",
          remarks: "",
          rating: 0,
          addedBy: "",
          storeId: "",
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
          Add RCPA
        </Button>
      </div>

      <Row>
        {rcpaData.map((feedback: any) => (
          <FeedbackItem
            key={feedback.id}
            feedback={feedback}
            onView={handleViewClick}
          />
        ))}
      </Row>

      <Modal
        title="Add RCPA"
        centered
        open={modal1Open}
        onOk={handleSubmit}
        onCancel={() => setModal1Open(false)}
        width={800}
      >
        <Row
          gutter={[24, 24]}
          style={{ padding: "20px" }}
          className="prodetinfo"
        >
          <Col span={12}>
            <label>Promote Product </label>
            <Select
              placeholder="Promoted Product"
              value={formData.productId}
              style={{ width: "100%", height: "35px" }}
              options={productData?.map((item: any) => ({
                value: item?.productId,
                label: item?.productName,
              }))}
              onChange={(value) => handleChange("productId", value)}
            />
          </Col>

          <Col span={12}>
            <label>Quantity sold in a week</label>
            <Input
              type="number"
              placeholder="Enter Quantity"
              value={formData.quantitySold}
              onChange={(e) => handleChange("quantitySold", e.target.value)}
            />
          </Col>

          <Col span={12}>
            <label>Stock Levels</label>
            <Input
              type="number"
              placeholder="Enter Stock Levels"
              value={formData.stockLevel}
              onChange={(e) => handleChange("stockLevel", e.target.value)}
            />
          </Col>

          <Col span={12}>
            <label>Competitor Brands</label>
            <Select
              placeholder="Select"
              style={{ width: "100%" }}
              options={productBrandData.map((item: any)=>({
                lable:item.CompetitorBrandId,
                value:item.name
              }))}
              onChange={(value) => handleChange("competitorBrand", value)}
            />
          </Col>

          <Col span={12}>
            <label>Stock Levels of Competitors</label>
            <Input
              type="number"
              placeholder="Enter Stock Levels"
              value={formData.stockLevelCompetitor}
              onChange={(e) =>
                handleChange("stockLevelCompetitor", e.target.value)
              }
            />
          </Col>

          <Col span={12}>
            <label> Competitors Price levels</label>
            <Select
              placeholder="Select"
              style={{ width: "100%" }}
              options={[
                { value: "LOWER", label: "LOWER " },
                { value: "SAME", label: "SAME" },
                { value: "HIGHER", label: "HIGHER" },
              ]}
              onChange={(value) => handleChange("priceComparison", value)}
            />
          </Col>

          <Col span={12}>
            <label>Competitor promotional offers</label>
            <Input
              type="text"
              placeholder="Offers"
              value={formData.PromotionalOffers}
              onChange={(e) =>
                handleChange("PromotionalOffers", e.target.value)
              }
            />
          </Col>

          <Col span={12}>
            <label>Services Provided</label>
            <Input
              type="text"
              placeholder="Services Provided"
              value={formData.ServicesProvided}
              onChange={(e) => handleChange("ServicesProvided", e.target.value)}
            />
          </Col>

          <Col span={12}>
            <label>Delivery Issues</label>
            <Select
              placeholder="Select"
              style={{ width: "100%" }}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              onChange={(value) => handleChange("deliveryIssues", value)}
            />
          </Col>
          <Col span={12}>
            <label>Remarks</label>
            <Input
              type="text"
              placeholder="Remarks"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
            />
          </Col>

          <Col span={12}>
            <label>⭐ Experience Rating</label>
            <Rate
              value={formData.rating}
              onChange={(value) => handleChange("rating", value)}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
