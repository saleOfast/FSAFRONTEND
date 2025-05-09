import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Steps,
  Switch,
  TimePicker,
} from "antd";
import Title from "antd/es/skeleton/Title";
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
  getSessionDataService,
  postSessionDataServices,
} from "services/storeService";
import { getItemFromLS } from "utils/common";

const Sessions = ({storeDetails}:any) => {
  const localStorageData= getItemFromLS(LS_KEYS.userData)
  const userObject= localStorageData?JSON.parse(localStorageData):''
    // console.log("user Id",userObject.id)
    const storeId=storeDetails?.storeId
  
  const productData = useSelector((state: any) => state?.product?.productList);
  console.log("ProductCategory", storeDetails?.user.emp_id);

  useEffect(() => {
    dispatch(getProductsActions({}));
    dispatch(getProductCategoryActions());
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [sessionDatas, setSessionDatas] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    productId: "",
    about: "",
    duration: "",
    remarks: "",
    storeId:storeDetails?.storeId,
    addedBy: userObject?.id,
  });
  

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    handleSessionData();
  }, []);
  const handleSessionData = async () => {
    try {
      dispatch(setLoaderAction(true));

      const response = await getSessionDataService(storeId);
      console.log("+++,", response);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        console.log("getSessionDataService", data);
        setSessionDatas(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (time: dayjs.Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      duration: time ? dayjs(time).format("HH:mm:ss") : "",
    }));
  };

  const handleSubmit = async () => {
    console.log("formData", formData);
    try {
      dispatch(setLoaderAction(true));
      const response = await postSessionDataServices(formData); // API Call
      dispatch(setLoaderAction(false));

      if (response.status === 200) {
        // console.log("Activity added:", response.data);
        setModalOpen(false); // Close Modal
        handleSessionData(); // Refresh Data
        setFormData({
          title: "",
          productId: "",
          about: "",
          duration: "",
          remarks: "",
          storeId:storeDetails?.storeId,
          addedBy: userObject?.id,
        });
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
      console.error("Error adding activity:", error);
    }
  };

  // Define light and dark colors
  const lightColor = "#D8EDFD";
  const darkColor = "#A9CCE3";
  return (
    <div style={{ padding: "0px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "10px" }}
      >
        <Col>
          <h2 style={{marginLeft:'20px'}}>Sessions</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => setModalOpen(true)}
            style={{ padding: "10px", height: "42px" ,marginRight:'10px'}}
          >
            Add Session
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ margin: "0px" }}>
        {/* Steps Section - Hidden on Mobile, Visible on Larger Screens */}
        <Col xs={0} sm={0} md={5} lg={5} xl={5} xxl={5}>
          <div
            style={{
              padding: "15px",
              borderRadius: "10px",
              overflowY: "auto",
            }}
          >
            <p
              // level={4}
              // style={{ textAlign: "start", marginBottom: "30px" }}
            >
              {/* Activity Timeline */}
            </p>

            <Steps
              direction="vertical"
              current={1} // Highlights the second step (0-based index)
              progressDot={(dot, { index }) => (
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    // backgroundColor: index % 2 === 0 ? "#3CA5F4" : "#4CAF50", // Alternating Green & Blue
                    backgroundColor: "#3CA5F4",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></span>
              )}
              items={sessionDatas.map((sessions:any) => ({
                title: (
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>
                    { new Date(sessions?.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                    {/* {activity?.date} */}
                  </span>
                ),
                description: (
                  <span style={{ fontSize: "12px", color: "#777" }}>
                    {sessions?.time || "No Time"}
                  </span>
                ),
              }))}
            />
          </div>
        </Col>

        {/* Activity Cards - Full Width on Mobile */}
        <Col xs={24} sm={24} md={19} lg={19} xl={19} xxl={19}>
          {sessionDatas.map((sessions: any, index: number) => (
            <Card
              key={sessions.activityId}
              style={{
                width: "100%",
                marginBottom: "10px",
                // background: 
                //   index % 2 === 0
                //     ? "#3CA5F4" // Blue for even-indexed cards
                //     : "#00C68A", // Green for odd-indexed cards
                backgroundColor: "#3CA5F4",
                color: "white",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              }}
              bodyStyle={{ padding: "15px" }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  flexWrap: "wrap",
                }}
              >
                <p
                  // level={5}
                  style={{ margin: 0, fontWeight: "bold", color: "white" }}
                >
                  {sessions?.title} 
                  {/*   (survey) */}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    padding: "5px",
                    borderRadius: "5px",
                    background:'white',
                    color:'black'
                  }}
                >
               User: {`${sessions?.user?.firstname || "User"} ${sessions?.user?.lastname || ""}`.trim()}

                  {/* {sessions?.about || "Name"} */}
                </p>
              </div>

              {/* Grid Layout for Content */}
              <Row gutter={[16, 16]}>
                {/* Promoted Product */}
                <Col xs={24} sm={12} md={12} lg={12}>
                  <div>
                    <p style={{ margin: 0, fontSize: "16px", color: "white" }}>
                  Session About
                    </p>
                    <p
                      // level={5}
                      style={{ margin: 0, fontWeight: "bold", color: "white" }}
                    >
                      {sessions?.about} 
                    </p>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <div>
                    <p style={{ margin: 0, fontSize: "16px", color: "white" }}>
                     Product
                    </p>
                    <p
                      // level={5}
                      style={{ margin: 0, fontWeight: "bold", color: "white" }}
                    >
                      {sessions?.product?.productName || "N/A"}
                    </p>
                  </div>
                </Col>

                {/* Joint Work */}
                {/* <Col xs={24} sm={12} md={12} lg={12}>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px",color: "white"}}>
                      Joint Work
                    </p>
                    {sessions?.jointWorks?.map((item: any, idx: number) => (
                      <p
                        key={idx}
                        // level={5}
                        style={{
                          margin: 0,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        {item?.user?.firstname} {item?.user?.lastname}
                      </p>
                    ))}
                  </div>
                </Col> */}

                {/* Remarks (Full Width) */}
                <Col xs={24}>
                  <div>
                    <p style={{ margin: 0, fontSize: "16px",color: "white" }}>
                      Remarks
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "white",
                      }}
                    >
                      {sessions?.remarks ||
                        "Will check sample & provide feedback"}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>
      </Row>
      {/* Extend line height and adjust dots */}
      <style>
        {`
          .ant-steps-item-tail {
            height: 230px !important; /* Increases the vertical line */
          }

          .ant-steps-item-icon {
            margin-bottom: 210px !important; /* Moves the dot down to align with the card */
          }

          .ant-steps-item-content {
            margin-top: -10px; /* Adjusts the content slightly for better alignment */
          }
        `}
      </style>

      <Modal
        title="Add Session"
        centered
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <label>Title</label>
            <Input
              placeholder="Enter title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              style={{ height: "40px" }}
            />
          </Col>
          <Col span={12}>
            <label>Enter Product</label>
            <Select
              placeholder="Promoted Product"
              value={formData.productId || undefined}
              style={{ width: "100%", height: "40px" }}
              options={
                productData?.map((product: any) => ({
                  value: product?.productId,
                  label: product?.productName,
                })) || []
              }
              onChange={(value) => handleChange("productId", value)}
            />
          </Col>
          <Col span={12}>
            <label> About</label>
            <Input
              placeholder="Enter details"
              value={formData.about}
              onChange={(e) => handleChange("about", e.target.value)}
              style={{ height: "40px" }}
            />
          </Col>
          <Col span={12}>
            <label>Duration (HH:mm:ss)</label>
            <TimePicker
              format="HH:mm"
              placeholder="Select duration"
              onChange={handleTimeChange}
              getPopupContainer={(triggerNode) =>
                triggerNode.parentNode as HTMLElement
              }
              style={{ width: "100%", height: "40px" }}
            />
          </Col>

          <Col span={24}>
            <label>Remarks</label>
            <Input
              placeholder="Enter remarks"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              style={{ height: "40px" }}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Sessions;
