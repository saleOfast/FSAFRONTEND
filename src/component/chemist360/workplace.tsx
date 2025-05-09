import {
  EditOutlined,
  MinusCircleOutlined,
  MinusOutlined,
  MobileOutlined,
  PhoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Flex, Input, Modal, Row } from "antd";
import React, { useState } from "react";
import { Typography } from "antd";

// Sample API response structure
const sampleData = [
  {
    id: 1,
    practiceType: "Private",
    organizationName: "Rahul Clinic",
    city: "Noida",
    state: "UP",
    territory: "Wrocus",
    practiceSize: "Large",
    patientVolume: "200 Patients",
    availability: "9 AM - 5 PM",
  },
  // Add more objects as per API response
];
const { Title } = Typography;

export const Workplace = () => {
  const [workplaces, setWorkPlaces] = useState(sampleData);
  const [modal1Open, setModal1Open] = useState(false);

  // Define the state type explicitly for 'visible'
  const [visible, setVisible] = useState<{ [key: number]: boolean }>({});

  // Toggle visibility of a specific workplace
  const toggleVisibility = (id: number) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="profDet">
    <Flex justify="space-between" style={{ marginBottom: "10px" }}>
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
        Work Place
      </Title>
      <Button
        type="primary"
        onClick={() => setModal1Open(true)}
        style={{ marginRight: "16px", height: "40px" }}
      >
        Add workplace
      </Button>
    </Flex>
    <div
      style={{
        border: "1px solid gray",
        margin: "10px",
        borderRadius: "10px",
        height: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // backgroundColor: "#E3F9F2",
          backgroundColor:'white',
          height: "38px",
          padding: "10px 20px", // Added some horizontal padding for spacing
          borderRadius: "8px", // Added rounded corners for a softer look
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Optional for subtle shadow
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <MobileOutlined
            style={{ fontSize: "18px", marginRight: "8px", color:'black'}}  // color: "#51D7AD" 
          />{" "}
          {/* Increased icon size and added spacing */}
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              margin: 0,
              // color: "#51D7AD",
              color:'black'
            }}
          >
            Primary hospital/clinic
          </p>
        </div>
        <MinusOutlined style={{ fontSize: "20px", color:'black'}} />   
        {/* //color: #51D7AD {" "} */}
        {/* Increased icon size and changed color */}
      </div>

      <hr style={{ marginTop: "-2px" }} />
      <Flex justify="space-around" align="flex-start" className="prodetinfo" >
        <div
          style={{ display: "flex", flexDirection: "column", width: "240px",}}
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
            PracticeType(Private/Public)
          </Title>
          <Title
            level={5}
            style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
          >
            Private
          </Title>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", width: "240px" }}
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
            OrganizationName
          </Title>
          <Title
            level={5}
            style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
          >
            New Medical center
          </Title>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", width: "240px" }}
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
            {" "}
            City
          </Title>
          <Title
            level={5}
            style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
          >
            Noida
          </Title>
        </div>
      </Flex>
      {/* <Divider style={{ margin: "3px 0" }} /> */}
      <Flex
        style={{}}
        justify={"space-around"}
        align={"flex-start"}
        className="prodetinfo"
      >
        <div
          style={{ display: "flex", flexDirection: "column", width: "240px" }}
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
            Mumbai
          </Title>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", width: "240px" }}
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
            PracticeSize and patientVolume
          </Title>
          <Title
            level={5}
            style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
          >
            2000
          </Title>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", width: "240px" }}
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
            Availability
          </Title>
          <Title
            level={5}
            style={{ color: "#585959", marginTop: "3px", fontSize: "16px" }}
          >
            09:00 AM - 12:00 PM
          </Title>
        </div>
      </Flex>
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: "#FDECEF",
        backgroundColor:'white',
        height: "38px",
        padding: "10px 20px", // Added some horizontal padding for spacing
        borderRadius: "8px", // Added rounded corners for a softer look
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Optional for subtle shadow
        marginTop: "10px",
        margin: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <MobileOutlined
          style={{ fontSize: "18px", marginRight: "8px",color:'black'  }}
          // color: "#F27188"
        />{" "}
        {/* Increased icon size and added spacing */}
        <p
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            margin: 0,
            // color: "#F27188",
            color:'black'
          }}
        >
          Secondary Practice Location
        </p>
      </div>
      <PlusOutlined style={{ fontSize: "18px", color:'black' }} />{" "}
      {/* //color: "#F27188" */}
      {/* Increased icon size and changed color */}
    </div>

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
      title="Add Work Place"
      centered
      open={modal1Open}
      onOk={() => setModal1Open(false)}
      onCancel={() => setModal1Open(false)}
      width={800}
    >
      <Row gutter={[24, 24]} style={{ padding: "20px" }}>
        <Col span={12}>
        PracticeType(Private/Public)
          <Input
            placeholder="PracticeType(Private/Public)"
            style={{ padding: "12px" }}
          />{" "}
        
        </Col>
        <Col span={12}>
        Organization Name
          <Input
            placeholder="Organization Name"
            style={{ padding: "12px" }}
          />
         
        </Col>
        <Col span={12}>
        City
          <Input placeholder="City" style={{ padding: "12px" }} />
     
        </Col>
        <Col span={12}>
        Territory
          <Input placeholder="Territory" style={{ padding: "12px" }} />
        
        </Col>
        <Col span={12}>
        PracticeSize and patientVolume
          <Input
            placeholder="PracticeSize and patientVolume"
            style={{ padding: "12px" }}
          />
      
        </Col>
        <Col span={12}>
        Availability
          <Input placeholder="Availability" style={{ padding: "12px" }} />
       
        </Col>
      </Row>
    </Modal>
  </div>
  );
};
