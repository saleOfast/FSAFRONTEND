import {
  Button,
  Col,
  DatePicker,
  Divider,
  Flex,
  FloatButton,
  Input,
  message,
  Modal,
  Row,
} from "antd";
import { Typography } from "antd";
import { CustomerServiceOutlined, EditOutlined } from "@ant-design/icons";
import React, { useRef, useCallback, useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { useLocation, useParams } from "react-router-dom";
import { updateStoreService } from "services/storeService";
import { set } from "date-fns";
import { boolean } from "yup";
import dayjs from "dayjs";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const { Title } = Typography;
export const Profile = ({ storeDetails, setStoreDetails }: any) => {
  const chartRef: any = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...storeDetails });
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalMessage, setModalMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const visitAnalysis=storeDetails?.visitAnalysis
  console.log(visitAnalysis,"visitAnalysis")
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (storeDetails?.visitAnalysis) {
      const formattedData = storeDetails.visitAnalysis.map((item: any) => {
        const [month, year] = item.month.split("-");
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth(); // Convert month name to index
        return {
          x: new Date(parseInt(year), monthIndex), // Convert to Date object
          y: item.visitCount, // Visit count for Y-axis
        };
      });

      setChartData(formattedData);
    }
  }, [storeDetails]); // Runs whenever storeDetails updates



  const showModal = () => {
    setFormData({...storeDetails }); // Populate form with current data
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsUpdating(true);
    try {
      await updateStoreService({
        ...formData,
        assignToRetailor: 1,
      });
      message.success("Updated successfully");
      setModalMessage({ type: "success", text: "Updated successfully!" });
      setStoreDetails(formData);
      setTimeout(() => {
        setIsModalOpen(false);
        setModalMessage(null); // Clear message after closing
      }, 1000);
    } catch (error) {
      message.error("Updated failed");
      console.error("Update failed:", error);
      setModalMessage({
        type: "error",
        text: "Update failed, please try again.",
      });
    }
    setIsUpdating(false);

    // setIsModalOpen(false);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalMessage(null);
    }, 300); // Slight delay to allow modal close animation
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  
  const toggleDataSeries: any = useCallback((e: any) => {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chartRef.current?.render();
  }, []);
  const options: any = {
    theme: "light2",
    height: 280,
    animationEnabled: true,
    axisY: { title: "No. of Visits" },
    toolTip: { shared: true },
    legend: { cursor: "pointer", itemclick: toggleDataSeries },
    data: [
      {
        type: "spline",
        name: "Visits",
        showInLegend: true,
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "#,##0 Visits",
        dataPoints: chartData, // Use transformed data
      },
    ],
    axisX: {
      labelFormatter: function (e: any) {
        var month = e.value.toLocaleString("en-US", { month: "short" });
        var year = e.value.getFullYear();
        return `${month} ${year}`;
      },
    },
    interval: 1,
  };

  const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      <Typography.Title
        type="secondary"
        level={5}
        style={{ whiteSpace: "nowrap" }}
      >
        {props.text}
      </Typography.Title>
    </Flex>
  );

  return (
    <div>
      {/* <FloatButton
                shape="square"
                type="primary"
                style={{ insetInlineEnd: 24 }}
                icon={<EditOutlined />}
            /> */}

      <Flex style={{}} className="docproCont">
        <div
          className="docprochart"
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            gap: "20px",
            width: "fixed",
          }}
        >
          <Title
            level={5}
            style={{
              fontSize: "18px",
              color: "#353748",
              marginBottom: "0px",
              marginTop: "0px",
              float: "left",
            }}
          >
            Pre Call Analysis
          </Title>

         
          <CanvasJSChart options={options} onRef={(ref: any) => (chartRef.current = ref)} />;
        </div>
        <Divider type="vertical" className="dividcp" />

        <div className="profDet">
          <Flex justify="space-between" style={{ marginBottom: "0px" }}>
            <Title
              level={5}
              style={{
                fontSize: "18px", 
                color: "#353748",
                marginBottom: "0px",
                marginTop: "0px",
                float: "left",
              }}
              className="protitdet"
            >
              Profile Details
            </Title>
            <Button
              onClick={showModal}
              type="primary"
              style={{ marginRight: "28px" }}
            >
              Edit <EditOutlined />
            </Button>
          </Flex>
          <Flex
            justify="space-around"
            align="flex-start"
            className="prodetinfo"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Qualification
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.qualification || "N/A"}
              </Title>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Speciality
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.speciality || "N/A"}
              </Title>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Languages Known
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.language_known || "N/A"}
              </Title>
            </div>
          </Flex>
          <Divider style={{ margin: "3px 0" }} />
          <Flex
            style={{}}
            justify={"space-around"}
            align={"flex-start"}
            className="prodetinfo"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Email
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.email || "N/A"}
              </Title>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Mobile
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.mobileNumber}
              </Title>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Address
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.addressLine1}, {storeDetails?.addressLine2}
                {storeDetails?.townCity}
              </Title>
            </div>
          </Flex>
          <Divider style={{ margin: "3px 0" }} />
          <Flex
            style={{}}
            justify={"space-around"}
            align={"flex-start"}
            className="prodetinfo"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Date of Birth
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.DOB
                  ? new Date(storeDetails.DOB).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "N/A"}
              </Title>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Date of wedding
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {new Date(storeDetails?.dateOfWedding).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                ) || "N/A"}
              </Title>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                State
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.state || "N/A"}
              </Title>
            </div>
          </Flex>
          <Divider style={{ margin: "3px 0" }} />
          <Flex
            style={{}}
            justify={"space-around"}
            align={"flex-start"}
            className="prodetinfo"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Territory
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.district || "N/A"}
              </Title>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Registration No.
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.RegistrationNumber || "N/A"}
              </Title>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <Title
                level={5}
                style={{
                  color: "#646672",
                  marginBottom: "0px",
                  marginTop: "16px",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Unique Doctor Code
              </Title>
              {/* <Title level={5} style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }} >GM079233</Title> */}
              <Typography.Title
                // editable
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.doctorCode || "N/A"}
              </Typography.Title>
            </div>
          </Flex>
        </div>
      </Flex>
      <style>
        {`
                  .profDet{
                     width: 100%;
                  }  
                 .docprochart{
                     width: 30%;  
                     margin-left: 24px;
                     }  
                  .dividcp{
                      height: 50vh;
                   }
                    .protitdet{
                     margin-left: 24px;
                   }        
                @media (max-width: 576px) {
                .docproCont{
                     flex-direction: column;
                     margin-bottom: 80px;
                   }
                 .docprochart{
                     width: 90%; 
                     margin-left: 12px;

                     }
                  .profDet{
                     width: 100%;
                  } 
                   .dividcp{
                      height: 7vh;
                   }  
                   .protitdet{
                     margin-left: 12px;
                   }
                    .prodetinfo{
                      flex-direction: column;
                      margin-left: 24px;
                    }
                  }
        
          `}
      </style>
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        // width={800}
        okButtonProps={{ disabled: isUpdating, loading: isUpdating }}
        okText="Update"
        style={{
          top: 50,
          right: 12,
        }}
      >
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <label>Qualification:</label>
            <Input
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="Enter Qualification"
              style={{ padding: "10px" }}
            />
          </Col>
          <Col span={12}>
            <label style={{ marginTop: "10px" }}>Enter Speciality:</label>
            <Input
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              placeholder="Enter Speciality"
              style={{ padding: "10px" }}
            />
          </Col>

          <Col span={12}>
            <label style={{ marginTop: "10px" }}> Languages Known:</label>
            <Input
              name="language_known"
              value={formData.language_known}
              onChange={handleChange}
              placeholder="Enter Languages Known"
              style={{ padding: "10px" }}
            />
          </Col>

          <Col span={12}>
            <label style={{ marginTop: "10px" }}>Email:</label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              style={{ padding: "10px" }}
            />
          </Col>

          <Col span={12}>
            <label style={{ marginTop: "10px" }}>Mobile:</label>
            <Input
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter Mobile Number"
              style={{ padding: "10px" }}
            />
          </Col>

          <Col span={12}>
            <label style={{ marginTop: "10px" }}>Address:</label>
            <Input
              name="address"
              value={formData.user?.address}
              onChange={handleChange}
              placeholder="Enter Address"
              style={{ padding: "10px" }}
            />
          </Col>

          <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
            <label>Date of Birth:</label>
            <DatePicker
              style={{ padding: "10px" }}
              getPopupContainer={(triggerNode) =>
                triggerNode.parentNode as HTMLElement
              }
              value={formData.DOB ? dayjs(formData.DOB) : null}
              onChange={(date) => setFormData({ ...formData, DOB: date })}
              format="YYYY-MM-DD" // Ensure the date is displayed in the correct format
            />
          </Col>

          <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
            <label>Date of Wedding:</label>
            <DatePicker
              style={{ padding: "10px" }}
              getPopupContainer={(triggerNode) =>
                triggerNode.parentNode as HTMLElement
              }
              value={
                formData.dateOfWedding ? dayjs(formData.dateOfWedding) : null
              }
              onChange={(date, dateString) =>
                setFormData({ ...formData, dateOfWedding: dateString })
              }
            />
          </Col>

          <Col span={12}>
            <label style={{ marginTop: "10px" }}>State:</label>
            <Input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter State"
              style={{ padding: "10px" }}
            />
          </Col>

          <Col span={12}>
            <label style={{ marginTop: "10px" }}>Territory:</label>
            <Input
              name="territory"
              value={formData.territory}
              onChange={handleChange}
              placeholder="Enter Territory"
              style={{ padding: "10px" }}
            />
          </Col>

          <Col span={12}>
            <label style={{ marginTop: "10px" }}>Registration No.:</label>
            <Input
              name="RegistrationNumber"
              value={formData.RegistrationNumber}
              onChange={handleChange}
              placeholder="Enter Registration"
              style={{ padding: "10px" }}
            />
          </Col>

          <Col span={12}>
            <label style={{ marginTop: "10px" }}>Unique Doctor Code:</label>
            <Input
              name="doctorCode"
              value={formData.doctorCode}
              onChange={handleChange}
              placeholder="Enter Unique Doctor Code"
              style={{ padding: "10px" }}
            />
          </Col>
        </Row>
        {modalMessage && (
          <div
            style={{
              marginTop: 10,
              padding: 8,
              borderRadius: 5,
              background:
                modalMessage.type === "success" ? "#f6ffed" : "#fff1f0",
              color: modalMessage.type === "success" ? "#52c41a" : "#ff4d4f",
              textAlign: "center",
            }}
          >
            {modalMessage.text}
          </div>
        )}
      </Modal>
    </div>
  );
};
