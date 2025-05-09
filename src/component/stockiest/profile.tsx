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
import { updateStoreService } from "services/storeService";
import dayjs from "dayjs";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const { Title } = Typography;
export const Profile = ({ storeDetails, setStoreDetails }: any) => {
  const chartRef: any = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const visitAnalysis=storeDetails?.visitAnalysis
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
  const [formData, setFormData] = useState({...storeDetails});
  // Sync storeDetails when modal opens
  useEffect(() => {
    setFormData(storeDetails);
  }, [storeDetails]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: ["availability", "patientVolume"].includes(name)
        ? Number(value) || 0
        : value, // Convert to number
    }));
  };

  const handleDateChange = (date: any, dateString: any, key: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: dateString }));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleSave = async () => {
    // setIsUpdating(true);
    try {
      await updateStoreService({
        ...formData,
        assignToRetailor: 1,
      });
      message.success("Updated successfully");
      //   setModalMessage({ type: "success", text: "Updated successfully!" });
      setStoreDetails(formData);
      setTimeout(() => {
        setIsModalOpen(false);
        // setModalMessage(null); // Clear message after closing
      }, 1000);
    } catch (error) {
      message.error("Updated failed");
      console.error("Update failed:", error);
      //   setModalMessage({
      //     type: "error",
      //     text: "Update failed, please try again.",
      //   });
    }
    // setIsProfileModalOpen(false);

    setIsModalOpen(false);
  };

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
              marginBottom: "-20px",
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
              style={{ marginRight: "16px" }}
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
                Languages Known
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.language_known}
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
                Email
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.email}
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
                Phone
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.mobileNumber}
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
                Address
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.addressLine1}
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
                Date of Birth
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.DOB}
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
                {storeDetails?.dateOfWedding
                  ? dayjs(storeDetails.dateOfWedding).format("DD-MM-YYYY")
                  : "N/A"}
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
                Registration No.
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.RegistrationNumber}
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
                Stockist Code
              </Title>
              {/* <Title level={5} style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }} >GM079233</Title> */}
              <Typography.Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.doctorCode}
              </Typography.Title>
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
                Stockist Added
              </Title>
              <Title level={5} style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}>
  {storeDetails?.createdAt ? dayjs(storeDetails.createdAt).format("DD-MM-YYYY") : "N/A"}
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
                Last Updated{" "}
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.updatedAt
                  ? dayjs(storeDetails.updatedAt).format("DD-MM-YYYY")
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
                Clinic/Hospital Name
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.clinicName}
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
                Country{" "}
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                India
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
                State
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.state}
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
                District
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.district}
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
                City
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
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
                Patient Volume
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.patientVolume}
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
                Avaliability
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.availability}{" "}
              </Title>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              {/* <Title level={5} style={{ color: "#646672", marginBottom: "0px", marginTop: "16px", fontSize: "14px", fontWeight: "400" }}>Clinic/Hospital Name</Title>
                            <Title level={5} style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }} >WholeBody Care Clinic</Title> */}
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
        title="Edit Stockist"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Row gutter={[12, 18]}>
          <Col span={12}>
            <label>Languages Known</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="language_known"
              name="language_known"
              value={formData?.language_known || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Email</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="email"
              name="email"
              value={formData?.email || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Phone</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="mobileNumber"
              name="mobileNumber"
              value={formData?.mobileNumber || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Address</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="addressLine1"
              name="addressLine1"
              value={formData?.addressLine1 || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Date of Birth</label>
            <DatePicker
              format="YYYY-MM-DD"
              value={formData.DOB ? dayjs(formData.DOB) : null}
              onChange={(date, dateString) =>
                handleDateChange(date, dateString, "DOB")
              }
              style={{ width: "100%", padding: "10px" }}
              getPopupContainer={(trigger: any) => trigger.parentElement}
            />
          </Col>
          <Col span={12}>
            <label>Date Of Wedding</label>
            <DatePicker
              format="YYYY-MM-DD"
              value={
                formData.dateOfWedding ? dayjs(formData.dateOfWedding) : null
              }
              onChange={(date, dateString) =>
                handleDateChange(date, dateString, "dateOfWedding")
              }
              style={{ width: "100%", padding: "10px" }}
              getPopupContainer={(trigger: any) => trigger.parentElement}
            />
          </Col>
          <Col span={12}>
            <label>Registration No.</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="RegistrationNumber"
              name="RegistrationNumber"
              value={formData.RegistrationNumber || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Stockist Code</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="doctorCode"
              name="doctorCode"
              value={formData.doctorCode || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Stockist Added</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="createdAt"
              name="createdAt"
              value={formData.createdAt || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Last Updated</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="updatedAt"
              name="updatedAt"
              value={formData.updatedAt || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Clinic/Hospital Name</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="clinicName"
              name="clinicName"
              value={formData.clinicName || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Country</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="country"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>State</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="state"
              name="state"
              value={formData.state || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>District</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="district"
              name="district"
              value={formData.district || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>City</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="townCity"
              name="townCity"
              value={formData.townCity || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Patient Volume</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="patientVolume"
              name="patientVolume"
              value={formData.patientVolume || ""}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            <label>Availability</label>
            <Input
              style={{ padding: "10px" }}
              placeholder="availability"
              name="availability"
              value={formData.availability || ""}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
