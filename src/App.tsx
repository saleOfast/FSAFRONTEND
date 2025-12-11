import "./App.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppRoutes from "route";
import { useAuth } from "context/AuthContext";
import { getItemFromLS } from "utils/common";
import { LS_KEYS } from "./app-constants";
import FullPageLoader from "component/FullPageLoader";
import Menu from "component/common/menu";
import { getProfileService } from "services/authService";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "./redux-store/action/appActions";
import { setStoreBeatAction, setStoreCategoryAction } from "./redux-store/action/storeActions";
import { AppDispatch } from "redux-store/store";
import "./style/style.css"
import { ConfigProvider, Dropdown, MenuProps, Space, Badge, Popover, List, Typography, Divider, Button, Drawer } from "antd";
import { getProductBrandActions, getProductCategoryActions } from "redux-store/action/productAction";
import { DownOutlined, LogoutOutlined, UserOutlined, BellOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { capitalizeFirstLetter } from "utils/capitalize";
import { UserRole } from "enum/common";
import Logout from "page/onboarding/logout";
import SideMenu from "component/common/menu";

const { Text } = Typography;

function App() {
  const { pathname } = useLocation();
  const redirect = useNavigate();
  const { setAuthState, authState } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const rolePaths: any = {
    [UserRole.SSM]: "/home",
    [UserRole.CHANNEL]: "/dashboard",
    [UserRole.RETAILER]: "/retailor/dashboard",
    [UserRole.ADMIN]: "/DistributorDashboard",
    [UserRole.DIRECTOR]: "/admin/dashboard",
    [UserRole.MANAGER]: "/admin/dashboard",
    [UserRole.RSM]: "/admin/dashboard",
    [UserRole.SUPER_ADMIN]: "/admin/dashboard",
  };
  
  useEffect(() => {
    async function setup() {
      try {
        const accessToken = getItemFromLS(LS_KEYS.accessToken);
        if (accessToken) {
          dispatch(setLoaderAction(true));
          const profileRes = await getProfileService();
          dispatch(setLoaderAction(false));
          const userData = profileRes?.data?.data;
          setAuthState({
            authenticated: true,
            isLoading: false,
            user: userData
          })
          dispatch(setStoreCategoryAction());
          dispatch(setStoreBeatAction());
          dispatch(getProductBrandActions())
          dispatch(getProductCategoryActions())
          if (pathname === "/") {
            redirect(rolePaths[userData?.role])
          }
        } else {
          setAuthState(p => ({
            ...p,
            isLoading: false,
          }))
        }
      } catch (error) {
        dispatch(setLoaderAction(false));
        setAuthState(p => ({
          ...p,
          isLoading: false,
        }))
      }
    }
    setup()
  }, []);

  const theme = {
    token: {
      colorPrimary: '#6164A6',
      colorSuccess: '#2DB83D',
    },
    components: {
      Form: {
        itemMarginBottom: 12,
        labelHeight: 20,
        verticalLabelPadding: '0 0 4px',
      },
    },
  };

  const noPaths = ["/", "/auth/forgot-password", "/403", "/auth/confirm-password", "/auth/verify-mail"];
  const [toggleLogout, setToggleLogout] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [desktopPopoverVisible, setDesktopPopoverVisible] = useState(false);
  
  // Sample notification data - replace with actual data from your API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Order Received",
      message: "You have received a new order #ORD-12345",
      time: "5 minutes ago",
      read: false,
      type: "order"
    },
    {
      id: 2,
      title: "Payment Successful",
      message: "Payment of ₹2,500 for order #ORD-12344 has been received",
      time: "1 hour ago",
      read: false,
      type: "payment"
    },
    {
      id: 3,
      title: "Low Stock Alert",
      message: "Product 'Wireless Headphones' is running low on stock",
      time: "2 hours ago",
      read: true,
      type: "inventory"
    }
  ]);

  const items: MenuProps['items'] = [
    {
      label: <Link to={`/profile?userId=${authState?.user?.id}`}><UserOutlined style={{ paddingRight: "10px" }} />Profile</Link>,
      key: '0',
    },
    {
      label: <div onClick={() => { setToggleLogout(!toggleLogout) }}>
        <LogoutOutlined style={{ paddingRight: "10px" }} />Logout</div>,
      key: '1',
    },
  ];

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    const iconStyle = { fontSize: '16px', marginRight: '8px' };
    
    switch(type) {
      case 'order':
        return <span style={{ ...iconStyle, color: '#1890ff' }}>📦</span>;
      case 'payment':
        return <span style={{ ...iconStyle, color: '#52c41a' }}>💰</span>;
      case 'inventory':
        return <span style={{ ...iconStyle, color: '#faad14' }}>⚠️</span>;
      default:
        return <BellOutlined style={{ ...iconStyle, color: '#6164A6' }} />;
    }
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Update notification count (only count unread ones)
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    setNotificationCount(unreadCount);
  };

  // Delete notification
  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    setNotificationCount(unreadCount);
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    setNotificationCount(0);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);
  };

  // Notification content component (reusable for both popover and drawer)
  const NotificationContent = ({ isMobile = false }) => (
    <div style={{ 
      width: isMobile ? '100%' : 380, 
      maxHeight: isMobile ? 'calc(100vh - 100px)' : 400, 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: isMobile ? 0 : '8px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 16px 12px',
        borderBottom: '1px solid #f0f0f0',
        background: '#fff',
        position: isMobile ? 'static' : 'sticky',
        top: 0,
        zIndex: 1,
        borderRadius: isMobile ? 0 : '8px 8px 0 0'
      }}>
        <Text strong style={{ fontSize: isMobile ? '18px' : '16px' }}>Notifications</Text>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {notificationCount > 0 && (
            <Button 
              type="link" 
              size="small"
              style={{ 
                fontSize: isMobile ? 14 : 12, 
                padding: '0 4px', 
                height: 'auto', 
                color: '#6164A6' 
              }}
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button 
              type="link" 
              size="small"
              danger
              style={{ 
                fontSize: isMobile ? 14 : 12, 
                padding: '0 4px', 
                height: 'auto' 
              }}
              onClick={clearAllNotifications}
            >
              Clear all
            </Button>
          )}
          {isMobile && (
            <Button 
              type="text" 
              size="small"
              icon={<CloseOutlined />}
              onClick={() => setMobileDrawerVisible(false)}
              style={{ marginLeft: '8px' }}
            />
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        maxHeight: isMobile ? 'none' : 300,
        padding: isMobile ? '8px 0' : 0
      }}>
        <List
          dataSource={notifications}
          locale={{ emptyText: (
            <div style={{ 
              textAlign: 'center', 
              padding: isMobile ? '60px 20px' : '40px 20px', 
              color: '#999' 
            }}>
              <BellOutlined style={{ 
                fontSize: isMobile ? 32 : 24, 
                marginBottom: 8, 
                opacity: 0.5 
              }} />
              <div style={{ fontSize: isMobile ? 16 : 14 }}>No notifications</div>
            </div>
          )}}
          renderItem={notification => (
            <List.Item 
              style={{ 
                padding: isMobile ? '16px' : '12px 16px', 
                cursor: 'pointer',
                backgroundColor: notification.read ? '#fafafa' : '#f0f7ff',
                borderBottom: '1px solid #f0f0f0',
                transition: 'all 0.2s',
                position: 'relative',
                margin: 0
              }}
              onClick={() => {
                markAsRead(notification.id);
                if (isMobile) {
                  setMobileDrawerVisible(false);
                }
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.backgroundColor = notification.read ? '#f5f5f5' : '#e6f7ff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.backgroundColor = notification.read ? '#fafafa' : '#f0f7ff';
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                width: '100%',
                gap: isMobile ? '16px' : '12px'
              }}>
                {/* Notification Icon */}
                <div style={{ 
                  marginRight: isMobile ? 0 : '12px', 
                  marginTop: '2px',
                  flexShrink: 0
                }}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                {/* Notification Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: isMobile ? '8px' : '4px',
                    gap: '8px'
                  }}>
                    <Text 
                      strong 
                      style={{ 
                        fontSize: isMobile ? 15 : 14, 
                        color: notification.read ? '#666' : '#1890ff',
                        lineHeight: '1.4'
                      }}
                    >
                      {notification.title}
                    </Text>
                    {!notification.read && (
                      <Badge 
                        dot 
                        size="small" 
                        color="red" 
                        style={{ 
                          marginLeft: '8px', 
                          flexShrink: 0 
                        }} 
                      />
                    )}
                  </div>
                  <Text 
                    style={{ 
                      fontSize: isMobile ? 14 : 13, 
                      display: 'block', 
                      marginBottom: isMobile ? 8 : 4,
                      color: notification.read ? '#999' : '#666',
                      lineHeight: '1.4'
                    }}
                  >
                    {notification.message}
                  </Text>
                  <Text type="secondary" style={{ fontSize: isMobile ? 12 : 11 }}>
                    {notification.time}
                  </Text>
                </div>

                {/* Delete Button */}
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined style={{ 
                    fontSize: isMobile ? '14px' : '12px', 
                    color: '#999' 
                  }} />}
                  onClick={(e) => deleteNotification(notification.id, e)}
                  style={{ 
                    marginLeft: '8px',
                    opacity: 0.6,
                    flexShrink: 0,
                    width: isMobile ? '32px' : 'auto',
                    height: isMobile ? '32px' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = '#ff4d4f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.6';
                  }}
                />
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div style={{ 
          padding: isMobile ? '16px' : '12px 16px', 
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
          background: '#fafafa',
          position: isMobile ? 'static' : 'sticky',
          bottom: 0,
          borderRadius: isMobile ? 0 : '0 0 8px 8px'
        }}>
          <Button 
            type="link" 
            size={isMobile ? "middle" : "small"}
            style={{ 
              fontSize: isMobile ? 14 : 13, 
              fontWeight: 500, 
              color: '#6164A6' 
            }}
          >
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );

  // Handle notification click based on device
  const handleNotificationClick = () => {
    if (window.innerWidth <= 768) {
      setMobileDrawerVisible(true);
    } else {
      setDesktopPopoverVisible(!desktopPopoverVisible);
    }
  };

  return (
    <ConfigProvider theme={theme}>
      <div>
        <Logout
          toggle={toggleLogout}
          closeModal={(e: any) => {
            setToggleLogout(e);
          }} />
        <style>
          {`
            @media (max-width: 768px){
              .aligncenter {
               
              }
              .left{
                text-align:left !important;
                margin-left: 16px !important;
              }
              
              .header-right-section {
                margin-right: 16px !important;
              }
              
              .notification-badge-mobile {
                margin-right: 12px !important;
              }
              
              .user-profile-section {
                width: auto !important;
                min-width: 120px !important;
              }
              
              .desktop-notification {
                display: none !important;
              }
            }
            
            @media (min-width: 769px) {
              .mobile-notification {
                display: none !important;
              }
            }
            
            /* Fix for notification popover z-index issue */
            .notification-popover {
              z-index: 9999 !important;
            }
            
            .ant-popover {
              z-index: 9999 !important;
            }
            
            .ant-popover-inner {
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              overflow: hidden;
            }
            
            /* Mobile responsive styles */
            @media (max-width: 576px) {
              .notification-drawer .ant-drawer-body {
                padding: 0;
              }
              
              .header-logo {
                margin-left: 16px !important;
              }
              
              .header-logo img {
                width: 100px !important;
              }
            }
            
            @media (max-width: 480px) {
              .header-container {
                height: 60px !important;
              }
              
              .user-greeting {
                display: none !important;
              }
            }
          `}
        </style>
        <div className={noPaths.includes(pathname) ? "" : "dashboardContainer"}>
          {pathname === "/403" || pathname !== "/" &&
            <div style={{
              display: "flex", 
              justifyContent: "space-between", 
              width: "100%", 
              height: "50px", 
              position: "fixed", 
              zIndex: "99", 
              alignItems: "center",
              backgroundColor: `white`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(.4px)",
            }} className="header-container">
              <div style={{ marginLeft: "3%" }} className="aligncenter header-logo">
                <Link to={authState?.user?.role === UserRole.SSM ? "/home" : authState?.user?.role === UserRole.RETAILER ? "/retailor/dashboard" : "/admin/dashboard"}>
                  {noPaths.includes(pathname) ? "" : <img src="https://mrapp.saleofast.com/images/saleofast_logo.png" width={120} alt="LOGO"/>}
                </Link>
              </div>
              <div style={{display: "flex", width: "100%"}} >
                {/* Optional: Add dashboard title here if needed */}
              </div>
              <div style={{ marginRight: "0%", display: "flex", alignItems: "center" }} className="header-right-section">
                  
                {/* Notification Section */}
                <div style={{ marginRight: "20px", position: "relative" }} className="notification-badge-mobile">
                  
                  {/* Mobile Notification (Drawer) */}
                  <div className="mobile-notification">
                    <Badge 
                      count={notificationCount} 
                      size="small"
                      offset={[-2, 2]}
                      style={{ 
                        boxShadow: '0 0 0 2px #fff'
                      }}
                    >
                      <div
                        style={{ 
                          padding: '6px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={handleNotificationClick}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <BellOutlined 
                          style={{ 
                            fontSize: '18px', 
                            color: notificationCount > 0 ? '#6164A6' : '#666',
                          }} 
                        />
                      </div>
                    </Badge>
                  </div>

                  {/* Desktop Notification (Popover) */}
                  <div className="desktop-notification">
                    <Popover 
                      content={<NotificationContent isMobile={false} />}
                      trigger="click"
                      placement="bottomRight"
                      open={desktopPopoverVisible}
                      onOpenChange={setDesktopPopoverVisible}
                      overlayStyle={{ 
                        width: 380,
                      }}
                      overlayInnerStyle={{
                        padding: 0,
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                      getPopupContainer={(triggerNode) => {
                        return document.body;
                      }}
                      overlayClassName="notification-popover"
                    >
                      <Badge 
                        count={notificationCount} 
                        size="small"
                        offset={[-2, 2]}
                        style={{ 
                          boxShadow: '0 0 0 2px #fff'
                        }}
                      >
                        <div
                          style={{ 
                            padding: '2px 2px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={handleNotificationClick}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <BellOutlined 
                            style={{ 
                              fontSize: '18px', 
                              color: notificationCount > 0 ? '#6164A6' : '#666',
                            }} 
                          />
                        </div>
                      </Badge>
                    </Popover>
                  </div>
                </div>
                
                {/* Mobile Notification Drawer */}
                <Drawer
                  title="Notifications"
                  placement="right"
                  onClose={() => setMobileDrawerVisible(false)}
                  open={mobileDrawerVisible}
                  width="100%"
                  style={{ maxWidth: 400 }}
                  className="notification-drawer"
                  extra={
                    <Button 
                      type="text" 
                      icon={<CloseOutlined />} 
                      onClick={() => setMobileDrawerVisible(false)}
                    />
                  }
                >
                  <NotificationContent isMobile={true} />
                </Drawer>
                
                <div className="aligncenter user-profile-section" style={{ marginRight: "10px", width:"150px"}}>
                  {authState?.user?.role &&
                    <Link to="#" className="linkto" onClick={(e) => { e.preventDefault() }} >
                      <Dropdown menu={{ items }} trigger={['click']} >
                        <Space>
                          <span style={{ color: "black" }} className="user-greeting">
                            Hi,{" "}
                            {capitalizeFirstLetter(authState?.user?.role === UserRole.ADMIN ? authState.user?.name.split(' ')[0] : authState.user?.name.split(' ')[0] + "")}
                          </span>
                          <DownOutlined style={{ color: "black" }} />
                          {authState?.user?.image ?
                            <img
                              src={authState?.user?.image}
                              alt="Profile"
                              width={30}
                              height={30}
                              style={{ borderRadius: "50%", margin: "14px", color: "white" }}
                            />
                            :
                            <UserOutlined className="userI" style={{ margin: "14px", color: "white" }} />
                          }
                        </Space>
                      </Dropdown>
                    </Link>
                  }
                </div>


                
              </div>  
            </div>}
          {noPaths.includes(pathname) ? null : <SideMenu />}
          <AppRoutes />
        </div>
        <FullPageLoader />
      </div>
    </ConfigProvider>
  );
}

export default App;