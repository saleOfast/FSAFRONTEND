import { AntDesignOutlined, ArrowLeftOutlined, CheckCircleFilled, CheckCircleOutlined, CloseCircleFilled, CrownOutlined, MailOutlined, PhoneOutlined, UserOutlined, } from "@ant-design/icons";
import "../../style/stores.css";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../common/footer";
import { getStoreByIdService, getStorePastOrderService } from "../../services/storeService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux-store/store";
import { setLoaderAction } from "redux-store/action/appActions";
import { dateFormatterNew, openGoogleMap } from "utils/common";
import previousPage from "utils/previousPage";
import { Avatar, Breadcrumb, Flex, Tabs, TabsProps } from "antd";
import { Typography } from 'antd';
import { Profile } from "./profile";
import { Workplace } from "./workplace";
import { Feedback } from "./feedback";
import Activities from "./activities";
import Sessions from "./sessions"
import Sample from './sample'
import Collection from "./collection";
import Order from "./order";
import Gift from "./gift";
 

const { Title } = Typography;

export default function DoctorDetails() {

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const storeId: any = searchParams.get('store_id');

  const [storeDetails, setStoreDetails] = useState<any>([]);
  console.log("storeDetails",storeDetails)
  const [pastOrdersList, setPastOrdersList] = useState<any[]>([]);

  useEffect(() => {
    if (storeId) {
      handleStoreDetails();
    }
  }, [storeId]);

  const handleStoreDetails = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getStoreByIdService(storeId);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        setStoreDetails(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Profile',
      children: <Profile storeDetails={storeDetails} setStoreDetails={setStoreDetails} />,
    },
    {
      key: '2',
      label: 'Workplace',
      children: <Workplace storeDetails={storeDetails} setStoreDetails={setStoreDetails}/>,
    },
    {
      key: '3',
      label: 'Activities',
      children: <Activities storeDetails={storeDetails}/>,
    },
    {
      key: '4',
      label: 'Feedback',
      children: <Feedback storeDetails={storeDetails} setStoreDetails={setStoreDetails}/>,
    },
    {
      key: '5',
      label: 'Sessions',
      children: <Sessions storeDetails={storeDetails} />,
    },
    {
      key: '6',
      label: 'Sample',
      children: <Sample storeDetails={storeDetails}/>,
    },
    {
      key: '7',
      label: 'Collection',
      // children: <Sample/>,
    },
    {
      key: '8',
      label: 'Order',
      children: <Order />
    },
    {
      key: '9',
      label: 'Gift',
      children: <Gift storeDetails={storeDetails}/>
    },
    
  ];
  let BreadcrumbItems: any = [
    {
      title: 'Doctor Master',
      href: '',
    },
    {
      title: 'Doctor 360',
    },

  ]
  const [isCentered, setIsCentered] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsCentered(window.innerWidth > 768); // Centered if screen width > 768px
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
     <header style={{ backgroundColor: "#070D79", display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
    {/* Left Arrow */}
    <ArrowLeftOutlined onClick={previousPage} className="back-button" style={{ marginLeft: '25px' }} />

    {/* Center Title */}
    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
      <h1 className="page-title" style={{ margin: 0 }}>{'Doctor 360'}</h1>
    </div>

    {/* Placeholder for balancing layout */}
    <div style={{ width: '25px', marginRight: '25px' }}></div>
  </header>
  <div style={{paddingRight:'1px'}}>
      <Flex justify="space-between" align="center">
        <Breadcrumb
          separator=">"
          items={BreadcrumbItems}
          style={{ margin: "20px 24px", color: "lightblue" }}
        />
        <Flex className="lasuptxt" style={{marginRight:'20px'}}>
          <Title level={5} style={{ color: "#646672", margin: "0px", fontWeight: "400", marginRight: "10px" }} className="lastxt">Last Updated:</Title>
          <Title level={5} style={{ color: "#646672", margin: "0px", fontWeight: "400", marginRight: "10px" }} className="lastxt">{new Date(storeDetails?.updatedAt).toLocaleDateString("en-GB",{
            day:"2-digit",
            month:"2-digit",
            year:'numeric'
          })||"05 Jun, 2023"}</Title>

        </Flex>
      </Flex>
      <div style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
        <Avatar
          style={{ marginLeft: "20px" }}
          // size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
          size={90}

          icon={<img src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png" alt="d" />}
        />
        <div style={{ display: "flex", flexDirection: "column", }}>
          <Title level={4} style={{ color: "#282A3C", marginBottom: "0px", marginTop: "16px" }}>{storeDetails?.storeName} 
            {/* <CheckCircleOutlined style={{ color: "green" }}/> */}
             </Title>
          <Title level={5} style={{ color: "#282A3C", marginTop: "3px" }} className="docDesign">{storeDetails?.qualification} ({storeDetails?.speciality})</Title>
        </div>
      </div>
      {/* <Tabs defaultActiveKey="1" items={items} centered
        tabBarStyle={{
          background: "#F3F3F8",
        }} /> */}
      <Tabs
        defaultActiveKey="1"
        items={items}
        centered={isCentered}
        tabBarStyle={{
          background: "#F3F3F8",
          flexWrap: "wrap", // Ensures wrapping on small screens
        }}
        moreIcon={null} // Hides the default "more" icon on overflow
      />
      {/* </div> */}
      <Footer />
      <style>
        {
          `
          .ant-tabs-nav{
             width: auto!important;
             padding: 0;
          }
             .ant-tabs-tab {
               font-size: 16px !important; /* Increase font size */
               padding: 10px 20px !important; /* Increase spacing */
               margin-right: 3px !important; /* Adjust gap between tabs */
               font-weight: 500!important;
               color: #585959!important;
            }

             .custom-tabs .ant-tabs-tab {
                  font-size: 20px !important;
                   padding: 12px 24px !important;
                   margin-right: 20px !important;
               }
          @media (max-width: 576px) {
               .lasuptxt{
                  flex-direction: column;
                }
                  .lastxt{
                  font-size: 12px!important;
                  font-weight: 500!important;
                  }
                   .custom-tabs .ant-tabs-tab {
                     font-size: 16px !important;
                    //  padding: 12px 24px !important;
                     margin-right: 12px !important;
               }
              .ant-tabs-tab {
               padding: 10px 12px !important; /* Increase spacing */
               margin-right: 0px !important; /* Adjust gap between tabs */
              
            }
           }
          `
        }
      </style>
      </div>
    </div>
  );
}
