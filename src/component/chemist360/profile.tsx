import { Button, Col, DatePicker, Divider, Flex, FloatButton, Input, message, Modal, Row } from "antd";
import { Typography } from "antd";
import { CustomerServiceOutlined, EditOutlined } from "@ant-design/icons";
import React, { useRef, useCallback, useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import dayjs from "dayjs";
import { updateStoreService } from "services/storeService";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const { Title } = Typography;
export const Profile = ({ storeDetails, setStoreDetails }: any) => {
  const [formData, setFormData] = useState({ ...storeDetails });
  const [chartData, setChartData] = useState<any[]>([]);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  console.log(storeDetails, "nmmmmmm");
  const chartRef: any = useRef(null);

  const toggleDataSeries: any = useCallback((e: any) => {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chartRef.current?.render();
  }, []);

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

  const showModal = () => {
    setIsProfileModalOpen(true)
  }

  // Sync storeDetails when modal opens
  useEffect(() => {
    setFormData(storeDetails);
  }, [storeDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: ["availability", "patientVolume"].includes(name) ? Number(value) || 0 : value, // Convert to number
    }));
  };

  const handleDateChange = (date: any, dateString: any, key: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: dateString }));
  };

  //   const handleSubmit = () => {
  //      console.log("formData",formData)
  // handleOk(); // Close modal
  //   };
  const handleSubmit = async () => {
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
        setIsProfileModalOpen(false);
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
    setIsProfileModalOpen(false);

    // setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsProfileModalOpen(false)
  }

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
              marginBottom: "-30px",
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
                Languages Known
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.language_known || "N/A"}
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
                {storeDetails?.DOB
                  ? new Date(storeDetails.DOB).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    }
                  )
                  : ""}
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
                  ? new Date(storeDetails.dateOfWedding).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    }
                  )
                  : ""}
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
                Chemist Code
              </Title>
              {/* <Title level={5} style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }} >GM079233</Title> */}
              <Typography.Title
                // editable
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
                Chemist Added
              </Title>
              <Title
                level={5}
                style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
              >
                {storeDetails?.createdAt
                  ? new Date(storeDetails.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    }
                  )
                  : ""}
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
                  ? new Date(storeDetails?.updatedAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    }
                  )
                  : ""}
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
                {storeDetails?.availability}
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
        title="Edit Profile"
        open={isProfileModalOpen}
        onOk={handleSubmit} // Update store state when saving
        onCancel={handleCancel}
        width={1000}
      >
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <label>Languages Known</label>
            <Input name="language_known" value={formData.language_known} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>Email</label>
            <Input name="email" value={formData.email} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>Phone</label>
            <Input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>Address</label>
            <Input name="addressLine1" value={formData.addressLine1} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>Date of Birth</label>
            <DatePicker

              format="YYYY-MM-DD"
              value={formData.DOB ? dayjs(formData.DOB) : null}
              onChange={(date, dateString) => handleDateChange(date, dateString, "DOB")}
              style={{ width: "100%", padding: '10px' }}
              getPopupContainer={(trigger: any) => trigger.parentElement}

            />
          </Col>

          <Col span={12}>
            <label>Date Of Wedding</label>
            <DatePicker
              format="YYYY-MM-DD"
              value={formData.dateOfWedding ? dayjs(formData.dateOfWedding) : null}
              onChange={(date, dateString) => handleDateChange(date, dateString, "dateOfWedding")}
              style={{ width: "100%", padding: '10px' }}
              getPopupContainer={(trigger: any) => trigger.parentElement}
            />
          </Col>

          <Col span={12}>
            <label>Registration No</label>
            <Input name="RegistrationNumber" value={formData.RegistrationNumber} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>Chemist Code</label>
            <Input name="doctorCode" value={formData.doctorCode} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>Chemist Added</label>
            <DatePicker
              format="YYYY-MM-DD"
              value={formData.createdAt ? dayjs(formData.createdAt) : null}
              onChange={(date, dateString) => handleDateChange(date, dateString, "Chemist Added")}
              style={{ width: "100%", padding: '10px' }}
              getPopupContainer={(trigger: any) => trigger.parentElement}
            />
          </Col>
          <Col span={12}>
            <label>Last Updated</label>
            <DatePicker
              format="YYYY-MM-DD"
              value={formData.updatedAt ? dayjs(formData.updatedAt) : null}
              onChange={(date, dateString) => handleDateChange(date, dateString, "updatedAt")}
              style={{ width: "100%", padding: '10px' }}
              getPopupContainer={(trigger: any) => trigger.parentElement}
            />
          </Col>

          <Col span={12}>
            <label>Last Updated</label>
            <DatePicker
              format="YYYY-MM-DD"
              value={formData.updatedAt ? dayjs(formData.updatedAt) : null}
              onChange={(date, dateString) => handleDateChange(date, dateString, "updatedAt")}
              style={{ width: "100%", padding: '10px' }}
            />
          </Col>

          <Col span={12}>
            <label>Clinic/Hospital Name</label>
            <Input name="clinicName" value={formData.clinicName} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>Country</label>
            <Input name="Country" value={formData.Country} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>State</label>
            <Input name="state" value={formData.state} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>District</label>
            <Input name="district" value={formData.district} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>City</label>
            <Input name="townCity" value={formData.townCity} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>Patient Volume</label>
            <Input name="patientVolume" value={formData.patientVolume} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>
          <Col span={12}>
            <label>Avaliability </label>
            <Input name="availability" value={formData.availability} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>

          <Col span={12}>
            <label>Remarks</label>
            <Input name="availability" value={formData.remarks} onChange={handleChange} style={{ padding: "10px" }} />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
