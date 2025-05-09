import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Select,
  Steps,
  TimePicker,
} from "antd";
import {
  getActivitydataServices,
  postActivityDataServices,
} from "services/storeService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux-store/store";
import { setLoaderAction } from "redux-store/action/appActions";
import dayjs from "dayjs";
import { useAuth } from "context/AuthContext";
import {
  getProductCategoryActions,
  getProductsActions,
} from "redux-store/action/productAction";
import { getUsersActions } from "redux-store/action/usersAction";

import { Typography } from "antd";
import { getItemFromLS } from "utils/common";
import { LS_KEYS } from "app-constants";
const { Title } = Typography;

const Activities = ({ storeDetails }: any) => {
  const storeId=storeDetails?.storeId
  const localStorageData= getItemFromLS(LS_KEYS.userData)
  const userObject= localStorageData?JSON.parse(localStorageData):''
    // console.log("user Id",userObject.id)
  const [modal1Open, setModal1Open] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [formData, setFormData] = useState({
    activityType: "",
    productId: "",
    jointWorks: "",
    duration: "",
    remarks: "",
    date: "",
    addedBy: userObject?.id,
    storeId: storeDetails?.storeId,
  });

  const usersData = useSelector((state: any) => state?.users?.usersSSM);
  console.log(usersData,",,,,,,,,,,")

  useEffect(() => {
    dispatch(getUsersActions());
  }, []);

  const productData = useSelector((state: any) => state?.product?.productList);
  console.log(">>>>>>",productData)

  const { authState } = useAuth();
  useEffect(() => {
    dispatch(getProductsActions({}));
    dispatch(getProductCategoryActions());
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    handleActivityData();
  }, []);
  const handleActivityData = async () => {
    try {
      dispatch(setLoaderAction(true));

      const response = await getActivitydataServices(storeId);
      console.log("+++,", response.data.data);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;

        setActivityData(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  // const handleChanges = (key: any, value: any) => {
  //   setFormData((prev) => ({ ...prev, [key]: value }));
  //   console.log(`selected ${value}`);
  // };

  const handleChange = (key: any, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const handleTimeChange = (time: dayjs.Dayjs | null) => {
    console.log("Selected Time:", time?.format("HH:mm:ss")); // Debugging
    setFormData((prev) => ({
      ...prev,
      duration: time ? time.format("HH:mm:ss") : "", // Store full time format
    }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null, dateString: string) => {
    console.log("Selected Date:", dateString); // Debugging
    setFormData((prev) => ({
      ...prev,
      date: date ? date.format("YYYY-MM-DD") : "", // Ensure correct format
    }));
  };

  // ✅ Handle Form Submission
  const handleSubmit = async () => {
    console.log("formData", formData);
    try {
      dispatch(setLoaderAction(true));
      const response = await postActivityDataServices(formData); // API Call
      dispatch(setLoaderAction(false));

      if (response.status === 200) {
        console.log("Activity added:", response.data);
        setModal1Open(false); // Close Modal
        handleActivityData(); // Refresh Data
        setFormData({
          // Clear Form
          activityType: "",
          productId: "",
          jointWorks: "",
          duration: "",
          remarks: "",
          date: "",
          addedBy: storeDetails.empId,
          storeId: storeDetails.storeId,
        });
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
      console.error("Error adding activity:", error);
    }
  };

  return (
    <div style={{ marginBottom: "35px" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0 10px",
        }}
      >
        {/* <p>Oct 2024 ^</p> */}
        <Title level={5} style={{ marginLeft: "10px" ,margin:0}}>
          {" "}
          Activity Timeline
        </Title>
        <Button
          type="primary"
          onClick={() => setModal1Open(true)}
          style={{
            marginRight: "16px",
            height: "40px",
             
            color: "white",
          }}
        >
          Add Activity
        </Button>
      </div>

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
            <Title
              level={4}
              style={{ textAlign: "start", marginBottom: "30px" }}
            >
              {/* Activity Timeline */}
            </Title>

            <Steps
              direction="vertical"
              current={1} // Highlights the second step (0-based index)
              progressDot={(dot, { index }) => (
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: index % 2 === 0 ? "#90D5FF" : "#00008B", // Alternating Green & Blue
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></span>
              )}
              items={activityData.map((activity: any) => ({
                title: (
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>
                    {activity?.date
                      ? new Date(activity?.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}
                    {/* {activity?.date} */}
                  </span>
                ),
                description: (
                  <span style={{ fontSize: "12px", color: "#777" }}>
                    {
                      activity?.time
                      // || "No Time"
                    }
                  </span>
                ),
              }))}
            />
          </div>
        </Col>

        {/* Activity Cards - Full Width on Mobile */}
        <Col xs={24} sm={24} md={19} lg={19} xl={16} xxl={19}>
  {activityData.map((activity: any, index: number) => {
    const isLightBackground = index % 2 === 0;
    return (
      <Card
        key={activity.activityId}
        style={{
          width: "100%",
          marginBottom: "10px",
          marginRight: "10px", // Add right margin to create space
          // background: isLightBackground ? "#90D5FF" : "#00008B",
          backgroundColor: "#3CA5F4",
          // color: isLightBackground ? "black" : "white",
          color: "white",
          borderRadius: "10px",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          padding: "10px",
        }}
        bodyStyle={{ padding: "10px" }}
      >
        {/* Card Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Title
            level={5}
            style={{
              margin: 0,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {activity?.activityType || "Face to Face"}
          </Title>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              backgroundColor: "white",
              padding: "5px",
              borderRadius: "5px",
              color: "black",
            }}
          >
            Added by: {activity?.user?.firstname || "User"}{" "}
            {activity?.user?.lastname || "Name"}
          </p>
        </div>

        {/* Grid Layout for Content */}
        <Row gutter={[8, 8]}>
          {/* Promoted Product */}
          <Col xs={24} sm={12} md={12} lg={12}>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                // color: isLightBackground ? "black" : "white",
                color: "white",
              }}
            >
              Promoted Product
            </p>
            <Title
              level={5}
              style={{
                margin: 0,
                fontWeight: "bold",
                // color: isLightBackground ? "black" : "white",
                color: "white",
              }}
            >
              {activity?.product?.productName || "N/A"}
            </Title>
          </Col>

          {/* Joint Work */}
          <Col xs={24} sm={12} md={12} lg={12}>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                // color: isLightBackground ? "black" : "white",
                color: "white",
              }}
            >
              Joint Work
            </p>
            <p
              style={{
                margin: 0,
                fontWeight: "bold",
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
                // color: isLightBackground ? "black" : "white",
                color: "white",
              }}
            >
              {activity?.jointWorks?.map((item: any, idx: number) => (
                <span key={idx}>
                  {item?.user?.firstname} {item?.user?.lastname}
                </span>
              ))}
            </p>
          </Col>

          {/* Remarks (Full Width) */}
          <Col xs={24}>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                // color: isLightBackground ? "black" : "white",
                color: "white",
              }}
            >
              Remarks
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 600,
                // color: isLightBackground ? "black" : "white",
                color: "white",
              }}
            >
              {activity?.remarks || "Will check sample & provide feedback"}
            </p>
          </Col>
        </Row>
      </Card>
    );
  })}
</Col>

      </Row>
      {/* Extend line height and adjust dots */}
      <style>
        {`
          .ant-steps-item-tail {
            height: 200px !important; /* Increases the vertical line */
          }

          .ant-steps-item-icon {
            margin-bottom: 190px !important; /* Moves the dot down to align with the card */
          }

          .ant-steps-item-content {
            margin-top: -10px; /* Adjusts the content slightly for better alignment */
          }
        `}
      </style>

      {/* Modal */}
      <Modal
        title="Add Activity"
        centered
        open={modal1Open}
        onOk={handleSubmit} // ✅ Submit Form
        onCancel={() => setModal1Open(false)}
        style={{ right: "10px" }}
      >
        <Row gutter={[24, 24]} style={{ padding: "20px" }}>
          {/* <Col span={12}>
            <label>Store Id</label>
            <Input
              placeholder="Store Id "
              value={formData?.storeId}
              // onChange={(e) => handleChange("addedBy",storeDetails?.empId)}
              style={{ padding: "10px" }}
            />
          </Col> */}
          {/* <Col span={12}>
            <label>Added By</label>
            <Input
              placeholder="Added By"
              value={formData?.addedBy}
              style={{ padding: "10px" }}
            />
          </Col> */}

          <Col span={12}>
            <label>Meet Type </label>
            <Select
              placeholder="Select Meetup Type"
              value={formData.activityType || undefined}
              style={{ width: "100%", height: "45px" }}
              options={[
                { value: "FACE_TO_FACE_MEETING", label: "Face to Face" },
                { value: "PHONE_CALL", label: "Call" },
                // { value: "Online Meeting", label: "Online Meeting" },
              ]}
              onChange={(value) => handleChange("activityType", value)}
            />
          </Col>

          <Col span={12}>
            <label>Promote Product </label>
            <Select
              placeholder="Promoted Product"
              value={formData.productId || undefined}
              style={{ width: "100%", height: "45px" }}
              options={productData?.map((item: any) => ({
                value: item?.productId,
                label: item?.productName,
              }))}
              onChange={(value) => handleChange("productId", value)}
            />
          </Col>
          <Col span={24}>
            <label>Joint Works </label>
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
                height: "45px",
              }}
              value={formData.jointWorks || undefined}
              placeholder="Joint work"
              onChange={(value) => handleChange("jointWorks", value)}
              options={usersData?.map((item: any) => ({
                label: item.name,
                value: item.emp_id,
              }))}
            />
          </Col>
          <Col span={12}>
            <label>Duration</label>

            {/* <label>Duration (HH:mm:ss)</label> */}
            <TimePicker
              style={{ padding: "10px", width: "100%" }}
              format="HH:mm:ss" // Ensure it captures hours, minutes, and seconds
              placeholder="Select duration"
              value={
                formData.duration ? dayjs(formData.duration, "HH:mm:ss") : null
              } // Ensure it's controlled
              onChange={handleTimeChange}
              getPopupContainer={(triggerNode) =>
                triggerNode.parentNode as HTMLElement
              }
            />
          </Col>
          <Col span={12}>
            <label>Date </label>

            <DatePicker
              style={{ padding: "10px", width: "100%" }}
              getPopupContainer={(triggerNode) =>
                triggerNode.parentNode as HTMLElement
              }
              onChange={handleDateChange}
              format="YYYY-MM-DD" // Ensure the date is displayed in the correct format
              value={formData.date ? dayjs(formData.date, "YYYY-MM-DD") : null}
            />
          </Col>
          <Col span={24}>
            <label>Remarks </label>
            <Input
              placeholder="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              style={{ padding: "10px" }}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Activities;
