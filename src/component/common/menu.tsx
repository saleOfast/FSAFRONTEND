import {
  BuildOutlined,
  CreditCardOutlined,
  DeploymentUnitOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  InsertRowAboveOutlined,
  MoneyCollectOutlined,
  ShoppingCartOutlined,
  PlusOutlined,
  AimOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  GroupOutlined,
  MedicineBoxOutlined,
  SolutionOutlined,
  FileAddOutlined,
} from "@ant-design/icons";

import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "context/AuthContext";
import { UserRole } from "enum/common";
import { Menu, MenuProps } from "antd";
import { getStoresByEmpIdService } from "services/usersSerivce";
// import { Menu } from 'antd';

const SidebarWrapperAdmin = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ isOpen }: any) => (isOpen ? "0" : "-280px")};
  height: 100%;
  width: 250px;
  background-color: white;
  padding-top: 16px;
  transition: left 0.3s ease-in-out;
  box-shadow: ${({ isOpen }) =>
    isOpen ? "0 0 10px rgba(0, 0, 0, 0.3)" : "none"};
  z-index: 2;

  @media only screen and (min-width: 30em) {
    display: block;
    box-shadow: none;
    transition: none;
    margin-top: 40px;
    left: ${({ isOpen }: any) => (!isOpen ? "0" : "-270px")};
  }
`;
const Sidebar = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 0 20px;
  color: white;
  text-decoration: none;
  font-size: 1.5em;
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; 
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  display: ${({ isOpen }: any) => (isOpen ? "block" : "none")};
  
    
`;

const SidebarLink = styled.a`
  padding: 3px 12px;
  display: block;
  color: white;
  text-decoration: none;
  font-size: 0.9em;
  &:hover {
    background-color: #E7EBEF;
    border-radius: 12px;
  }
`;

interface IMenu {
  isOpen?: boolean;
  toggleSidebar?: any;
}
const SideMenu = ({ isOpen = false, toggleSidebar }: IMenu) => {
  const { authState } = useAuth();
  const { pathname } = useLocation();
  type MenuItem = Required<MenuProps>["items"][number];
  const orderItems: MenuItem[] = [
    {
      key: "sub0",
      icon: <ShoppingCartOutlined />,
      label: <span style={{ color: "black" }}>Order</span>,
      style: { background: "none", color: "black" },
      children: [
        {
          key: "1",
          label: (
            <Link to="/order" onClick={toggleSidebar}>
              All Order
            </Link>
          ),
        },
        {
          key: "2",
          label: (
            <Link to="/order/form?isOrderForm=true" onClick={toggleSidebar}>
              Order Form
            </Link>
          ),
        },
      ],
    },
  ];
  const categoryItems: MenuItem[] = [
    {
      key: "sub1",
      icon: <GroupOutlined />,
      label: <span style={{ color: "black" }}>Configuration</span>,
      style: { background: "none", color: "black" },
      children: [
        {
          key: "0",
          label: (

            <Link to="/admin/competitorbrand" onClick={toggleSidebar}>
              Competitor Brands
            </Link>
          ),
        },
        {
          key: "1",
          label: (
            <Link to="/admin/brand" onClick={toggleSidebar}>
              Brand
            </Link>
          ),
        },
        {
          key: "2_3",
          label: <span className="white-text">Category</span>,
          style: { background: "none" },
          children: [
            {
              key: "2a",
              label: (
                <Link to="/admin/category" onClick={toggleSidebar}>
                  Medicine Category
                </Link>
              ),
            },
            {
              key: "3b",
              label: (
                <Link to="/admin/store-category" onClick={toggleSidebar}>
                  Customer Category
                </Link>
              ),
            },
          ],
        },
        // { key: '2', label: <Link to="/admin/category" onClick={toggleSidebar}>Medicine Category</Link> },
        // { key: '3', label: <Link to="/admin/store-category" onClick={toggleSidebar}>Customer Category</Link> },
        {
          key: "4",
          label: (
            <Link to="/noOrder-reason" onClick={toggleSidebar}>
              No Order Reason
            </Link>
          ),
        },
        // { key: '5', label: <Link to="/config/colour" onClick={toggleSidebar}>Product  Colour</Link> },
        {
          key: "6",
          label: (
            <Link to="/config/size" onClick={toggleSidebar}>
              Product Size
            </Link>
          ),
        },
        {
          key: "5",
          label: <span className="white-text">HR</span>,
          style: { background: "none" },
          children: [
            {
              key: "5a",
              label: (
                <Link to="/config/leave" onClick={toggleSidebar}>
                  Leave Policy
                </Link>
              ),
            },
            {
              key: "5b",
              label: (
                <Link to="/config/policy" onClick={toggleSidebar}>
                  Expense Policy
                </Link>
              ),
            },
          ],
        },
        {
          key: "110",
          label: <span className="white-text">E-Detailing</span>,
          style: { background: "none" },
          children: [
            {
              key: "110a",
              label: (
                <Link to="/admin/dashboard/course" onClick={toggleSidebar}>
                  Learning Material
                </Link>
              ),
            },
          ],
        },
        {
          key: "10",
          label: <span className="white-text">DAR</span>,
          style: { background: "none" },
          children: [
            {
              key: "10a",
              label: (
                <Link to="/config/dar/activity-type" onClick={toggleSidebar}>
                  Activity Type
                </Link>
              ),
            },
            {
              key: "10b",
              label: (
                <Link to="/config/dar/activity-related-to" onClick={toggleSidebar}>
                  Activity Related To
                </Link>
              ),
            },
            {
              key: "10c",
              label: (
                <Link to="/config/dar/next-action-on" onClick={toggleSidebar}>
                  Next Action On
                </Link>
              ),
            },
            {
              key: "10d",
              label: (
                <Link to="/config/dar/status" onClick={toggleSidebar}>
                  DAR Status
                </Link>
              ),
            },
          ],
        },

        {
          key: "8",
          label: (
            <Link to="/config/payment-mode" onClick={toggleSidebar}>
              Payment Terms
            </Link>
          ),
        },
        {
          key: "9",
          label: (
            <Link to="/admin/import-export" onClick={toggleSidebar}>
              Import/Export
            </Link>
          ),
        },

        ...(authState?.user?.role === UserRole.SUPER_ADMIN
          ? [
            {
              key: "7",
              label: <span className="white-text">Super Admin</span>,
              style: { background: "none" },
              children: [
                {
                  key: "7a",
                  label: (
                    <Link to="/config/feature" onClick={toggleSidebar}>
                      Feature
                    </Link>
                  ),
                },
                {
                  key: "7b",
                  label: (
                    <Link to="/config/role" onClick={toggleSidebar}>
                      Role
                    </Link>
                  ),
                },
              ],
            },
          ]
          : []),
      ],
    },
  ];
  const reportItems: MenuItem[] = [
    {
      key: "sub2",
      icon: <AppstoreOutlined />,
      label: <span style={{ color: "black" }}>Reports</span>,
      style: { background: "none", color: "black" },
      children: [
        ...(authState?.user?.role === UserRole.RETAILER
          ? [
            {
              key: "1r",
              label: (
                <Link to="/report/sku-revenue" onClick={toggleSidebar}>
                  SKU Revenue
                </Link>
              ),
            },
            {
              key: "2r",
              label: (
                <Link to="/report/pending-collection" onClick={toggleSidebar}>
                  Pending Payment
                </Link>
              ),
            },
            {
              key: "3r",
              label: (
                <Link to="/report/monthly-progress" onClick={toggleSidebar}>
                  Monthly Order
                </Link>
              ),
            },
            {
              key: "4r",
              label: (
                <Link to="/report/inventories" onClick={toggleSidebar}>
                  Inventory
                </Link>
              ),
            },
          ]
          : [
            {
              key: "1",
              label: (
                <Link to="/report/attendance" onClick={toggleSidebar}>
                  Attendance
                </Link>
              ),
            },
            {
              key: "2",
              label: (
                <Link to="/report/day-tracking" onClick={toggleSidebar}>
                  Day Tracking
                </Link>
              ),
            },
            {
              key: "2",
              label: (
                <Link to="/report/mr-analysis" onClick={toggleSidebar}>
                  MR Analysis
                </Link>
              ),
            },
            {
              key: "4",
              label: "Progress",
              children: [
                {
                  key: "4a",
                  label: (
                    <Link
                      to="/report/monthly-progress"
                      onClick={toggleSidebar}
                    >
                      Monthly
                    </Link>
                  ),
                },
              ],
            },
            ...(authState?.user?.role !== UserRole.SSM
              ? [
                {
                  key: "5",
                  label: "Revenue",
                  children: [
                    {
                      key: "5a",
                      label: (
                        <Link
                          to="/report/store-revenue"
                          onClick={toggleSidebar}
                        >
                          Pharma Store
                        </Link>
                      ),
                    },
                    {
                      key: "5b",
                      label: (
                        <Link
                          to="/report/sku-revenue"
                          onClick={toggleSidebar}
                        >
                          SKU
                        </Link>
                      ),
                    },
                  ],
                },
              ]
              : []),
            {
              key: "6",
              label: "Pending",
              children: [
                {
                  key: "6a",
                  label: (
                    <Link
                      to="/report/pending-collection"
                      onClick={toggleSidebar}
                    >
                      Collection
                    </Link>
                  ),
                },
                {
                  key: "6b",
                  label: (
                    <Link
                      to="/report/pending-approval"
                      onClick={toggleSidebar}
                    >
                      Approval
                    </Link>
                  ),
                },
              ],
            },
            {
              key: "7",
              label: (
                <Link
                  to="/report/employee-performance"
                  onClick={toggleSidebar}
                >
                  Performance
                </Link>
              ),
            },
            {
              key: "8",
              label: (
                <Link to="/report/unbilled-store" onClick={toggleSidebar}>
                  Unbilled Store
                </Link>
              ),
            },
            {
              key: "9",
              label: (
                <Link to="/report/monthly-no-order" onClick={toggleSidebar}>
                  No Order Report
                </Link>
              ),
            },
          ]),
      ],
    },
  ];

  const HRProcessItems: MenuItem[] = [
    {
      key: "sub4",
      icon: <SolutionOutlined />,
      label: <span style={{ color: "black" }}>HR Process</span>,
      style: { background: "none", color: "black" },
      children: [
        {
          key: "00",
          label: (
            <Link to="/hr/attendance?hr=true" onClick={toggleSidebar}>
              Attendance
            </Link>
          ),
        },
        {
          key: "0",
          label: (
            <Link to="/hr/dar" onClick={toggleSidebar}>
              DAR
            </Link>
          ),
        },
        {
          key: "1",
          label: (
            <Link to="/hr/expense-apply" onClick={toggleSidebar}>
              Expense Request
            </Link>
          ),
        },
        ...(authState?.user?.role !== UserRole.SSM ? [{
          key: "2",
          label: (
            <Link to="/hr/expense" onClick={toggleSidebar}>
              Expense Approval
            </Link>
          ),
        }] : []),
        {
          key: "3",
          label: (
            <Link to="/hr/leave-apply" onClick={toggleSidebar}>
              Leave Request
            </Link>
          ),
        },
        ...(authState?.user?.role !== UserRole.SSM ? [{
          key: "4",
          label: (
            <Link to="/hr/leave-approval" onClick={toggleSidebar}>
              Leave Approval
            </Link>
          ),
        }] : []),

        // { key: '4', label: <Link to="/expense-apply" onClick={toggleSidebar}>Mark Attendance</Link> },
        {
          key: "5",
          label: (
            <Link to="/hr/holidays" onClick={toggleSidebar}>Holidays</Link>
          ),
        },
      ],
    },
  ];
  const onClicks: MenuProps["onClick"] | any = (e: any) => {
    // console.log('click', e);
  };
  const rolePaths: any = {
    [UserRole.SSM]: "/home",
    [UserRole.RETAILER]: "/retailor/dashboard",
    [UserRole.ADMIN]: "/admin/dashboard",
    [UserRole.DIRECTOR]: "/admin/dashboard",
    [UserRole.MANAGER]: "/admin/dashboard",
    [UserRole.RSM]: "/admin/dashboard",
    [UserRole.SUPER_ADMIN]: "/admin/dashboard",
  };

  return (
    <div className="side-menu sidebarColor">
      <SidebarWrapperAdmin isOpen={isOpen}>
        <Fragment>
          <Sidebar>
            {/* <span style={{ marginLeft: "20px", fontSize: "20px", color:"black" }}>Menu</span> */}
            <span>
              <button onClick={toggleSidebar} className="adminclosebtn">
                {" "}
                ✕
              </button>
            </span>
          </Sidebar>
          <div
            className="adminmenuContent"
            style={{
              padding: "4px 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              height: "86%",
              borderRight: "1px solid #dddddd"
            }}
          >
            {authState?.user?.role === UserRole.SSM && (
              <Link to={"/home"} className="linkto" onClick={toggleSidebar}>
                <SidebarLink
                  className={
                    pathname.includes("/home")
                      ? "active adminSideLink"
                      : "adminSideLink"
                  }
                >
                  <HomeOutlined className="adminMenuTxt" />
                  Home
                </SidebarLink>
              </Link>
            )}
            <Link
              to={
                authState?.user?.role === UserRole.SSM ||
                  authState?.user?.role === UserRole.CHANNEL
                  ? "/dashboard"
                  : authState?.user?.role === UserRole.RETAILER
                    ? "/retailor/dashboard"
                    : "/admin/dashboard"
              }
              className="linkto"
              onClick={toggleSidebar}
            >
              <SidebarLink
                style={{ color: "black" }}
                className={pathname.includes("/dashboard") ? "active" : ""}
              >
                <DashboardOutlined className="adminMenuTxt" />
                Dashboard
              </SidebarLink>
            </Link>
            {authState?.user?.role !== UserRole.SSM &&
              authState?.user?.role !== UserRole.RETAILER &&
              authState?.user?.role !== UserRole.CHANNEL && (
                <Link
                  to="/admin/beat"
                  className="linkto"
                  onClick={toggleSidebar}
                >
                  <SidebarLink
                    style={{ color: "black" }}
                    className={
                      pathname.includes("/beat") ||
                        pathname.includes("/create-beat")
                        ? "active"
                        : ""
                    }
                  >
                    <DeploymentUnitOutlined className="adminMenuTxt" />
                    Beat
                  </SidebarLink>
                </Link>
              )}
            {authState?.user?.role !== UserRole.RETAILER &&
              authState?.user?.role !== UserRole.CHANNEL && (
                <Link
                  to={
                    authState?.user?.role === UserRole.SSM
                      ? "/visit"
                      : "/admin/visit"
                  }
                  className="linkto"
                  onClick={toggleSidebar}
                >
                  <SidebarLink
                    style={{ color: "black" }}
                    className={
                      pathname.includes("/visit") ||
                        pathname.includes("/create-visit")
                        ? "active"
                        : ""
                    }
                  >
                    <EnvironmentOutlined className="adminMenuTxt" />
                    Visit
                  </SidebarLink>
                </Link>
              )}
            {authState?.user?.role !== UserRole.RETAILER && (
              <Link to="/stores" className="linkto" onClick={toggleSidebar}>
                <SidebarLink
                  style={{ color: "black" }}
                  className={pathname.includes("/stores") ? "active" : ""}
                >
                  <InsertRowAboveOutlined className="adminMenuTxt" />
                  Customer
                </SidebarLink>
              </Link>
            )}
            {authState?.user?.role === UserRole.CHANNEL ? (
              <Link to="/order" className="linkto" onClick={toggleSidebar}>
                <SidebarLink
                  style={{ color: "black" }}
                  className={pathname.includes("/order") ? "active" : ""}
                >
                  <ShoppingCartOutlined className="adminMenuTxt" />
                  Order
                </SidebarLink>
              </Link>
            ) : (
              <SidebarLink
                className={pathname.includes("/order") ? "active" : ""}
                style={{ zIndex: 9999999 }}
              >
                <Menu
                  onClick={onClicks}
                  style={{
                    width: "200px",
                    background: "none",
                    color: "white",
                    padding: 0,
                  }}
                  mode="vertical"
                  items={orderItems}
                />
              </SidebarLink>
            )}

            <Link
              to={
                authState?.user?.role === UserRole.RETAILER
                  ? "/payment"
                  : "/collection"
              }
              className="linkto"
              onClick={toggleSidebar}
            >
              <SidebarLink
                style={{ color: "black" }}
                className={
                  pathname.includes("/collection") ||
                    pathname.includes("/payment")
                    ? "active"
                    : ""
                }
              >
                <MoneyCollectOutlined className="adminMenuTxt" />
                {authState?.user?.role === UserRole.RETAILER
                  ? "Payment"
                  : "Collection"}
              </SidebarLink>
            </Link>
            {authState?.user?.role !== UserRole.CHANNEL && (
              <Link
                to="/target-data-table"
                className="linkto"
                onClick={toggleSidebar}
              >
                <SidebarLink
                  style={{ color: "black" }}
                  className={
                    pathname.includes("/target-data-table") ||
                      pathname.includes("/target-achievement")
                      ? "active"
                      : ""
                  }
                >
                  <AimOutlined className="adminMenuTxt" />
                  Target Vs Achievement
                </SidebarLink>
              </Link>
            )}

            {authState?.user?.role !== UserRole.CHANNEL && (
              <Link
                to="/e-detailing"
                className="linkto"
                onClick={toggleSidebar}
              >

                <SidebarLink
                  style={{ color: "black" }}
                  className={
                    pathname.includes("/e-detailing") ||
                      pathname.includes("/e-detailing")
                      ? "active" : ""
                  }
                >

                  <FileAddOutlined className="adminMenuTxt" />
                  E-Detailing
                </SidebarLink>
              </Link>
            )}

            {(authState?.user?.role === UserRole.ADMIN ||
              authState?.user?.role === UserRole.SUPER_ADMIN) && (
                <Link
                  to="/admin/users"
                  className="linkto"
                  onClick={toggleSidebar}
                >
                  <SidebarLink
                    style={{ color: "black" }}
                    className={
                      pathname.includes("/users") ||
                        pathname.includes("/add-new-users")
                        ? "active"
                        : ""
                    }
                  >
                    <BuildOutlined className="adminMenuTxt" />
                    Users
                  </SidebarLink>
                </Link>
              )}

            {/* {authState?.user?.role === UserRole.ADMIN &&
              <> <Link to="/admin/brand" className="linkto" onClick={toggleSidebar}>
                <SidebarLink className={pathname.includes('/brand') || pathname.includes('/new-brand') ? "active" : ""}>
                  <ShopOutlined className="adminMenuTxt" />
                  Brand
                </SidebarLink>
              </Link>
                <Link to="/admin/category" className="linkto" onClick={toggleSidebar}>
                  <SidebarLink className={pathname.includes('/category') || pathname.includes('/add-new-category') ? "active" : ""}>
                    <ProjectOutlined className="adminMenuTxt" />
                    Product Category
                  </SidebarLink>
                </Link>
              </>} */}
            <Link
              to="/admin/product"
              className="linkto"
              onClick={toggleSidebar}
            >
              <SidebarLink
                style={{ color: "black" }}
                className={pathname.includes("/product") ? "active" : ""}
              >
                <MedicineBoxOutlined className="adminMenuTxt" />
                Product
              </SidebarLink>
            </Link>
            {/* {authState?.user?.role === UserRole.ADMIN &&
              <Link to="/admin/store-category" className="linkto" onClick={toggleSidebar}>
                <SidebarLink className={pathname.includes('/store-category') || pathname.includes('/add-update-category') ? "active" : ""}>
                  <LayoutOutlined className="adminMenuTxt" />
                  Store Category
                </SidebarLink>
              </Link>} */}

            <SidebarLink
              className={pathname.includes("/hr") ? "active" : ""}
              style={{ zIndex: 9999999 }}
            >
              <Menu
                onClick={onClicks}
                style={{
                  width: "200px",
                  background: "none",
                  color: "white",
                  padding: 0,
                }}
                mode="vertical"
                items={HRProcessItems}
              />
            </SidebarLink>
            <Link
              to={"/admin/scheme"}
              className="linkto"
              onClick={toggleSidebar}
            >
              <SidebarLink
                style={{ color: "black" }}
                className={
                  pathname.includes("/scheme") ||
                    pathname.includes("/add-new-scheme")
                    ? "active"
                    : ""
                }
              >
                <CreditCardOutlined className="adminMenuTxt" />
                Marketing Material
              </SidebarLink>
            </Link>
            {authState?.user?.role !== UserRole.CHANNEL && (
              <SidebarLink
                className={pathname.includes("/report") ? "active" : ""}
                style={{ zIndex: 9999999 }}
              >
                <Menu
                  onClick={onClicks}
                  style={{
                    width: "200px",
                    background: "none",
                    color: "white",
                    padding: 0,
                    zIndex: 9999999,
                  }}
                  mode="vertical"
                  items={reportItems}
                />
              </SidebarLink>
            )}
            {(authState?.user?.role === UserRole.ADMIN ||
              authState?.user?.role === UserRole.SUPER_ADMIN) && (
                <SidebarLink
                  className={
                    pathname.includes("/brand") ||
                      pathname.includes("/category") ||
                      pathname.includes("/add-new-category") ||
                      pathname.includes("/store-category") ||
                      pathname.includes("/add-update-category")
                      ? "active"
                      : pathname.includes("/config")
                        ? "active"
                        : ""
                  }
                  style={{ zIndex: 9999999 }}
                >
                  <Menu
                    onClick={onClicks}
                    style={{
                      width: "200px",
                      background: "none",
                      color: "white",
                      padding: 0,
                    }}
                    mode="vertical"
                    items={categoryItems}
                  />
                </SidebarLink>
              )}
            <div className="border-line" style={{ paddingTop: "8px" }}></div>
            <div className="detail-content">
              <span className="quickLink" style={{ color: "black" }}>Quick Links</span>
              <div className="setting-content">
                <Link
                  to={
                    authState?.user?.role === UserRole.SSM
                      ? "/visit"
                      : "/admin/visit"
                  }
                  className="linkto"
                  onClick={toggleSidebar}
                >
                  <span>
                    <EnvironmentOutlined />
                  </span>
                </Link>
                {authState?.user?.role !== UserRole.SSM && (
                  <Link
                    to="/target-data-table"
                    className="linkto"
                    onClick={toggleSidebar}
                  >
                    <span>
                      <InsertRowAboveOutlined />
                    </span>
                  </Link>
                )}
                <Link to="/order" className="linkto" onClick={toggleSidebar}>
                  <span>
                    <ShoppingCartOutlined />
                  </span>
                </Link>
                <Link
                  to="/collection"
                  className="linkto"
                  onClick={toggleSidebar}
                >
                  <span className="wrap-icon">
                    <MoneyCollectOutlined />
                  </span>
                </Link>
                <Link to="/stores" className="linkto" onClick={toggleSidebar}>
                  <span className="wrap-icon">
                    <InsertRowAboveOutlined />
                  </span>
                </Link>
                {authState?.user?.role !== UserRole.SSM && (
                  <Link
                    to="/admin/beat"
                    className="linkto"
                    onClick={toggleSidebar}
                  >
                    <span className="wrap-icon">
                      <DeploymentUnitOutlined />
                    </span>
                  </Link>
                )}
              </div>
            </div>
            <div style={{ padding: "4px 0px" }}>
              <div className="detail-content">
                <Link
                  to="/admin/create-visit"
                  className="linkto"
                  onClick={toggleSidebar}
                >
                  {" "}
                  <div className="create-lead" style={{ bottom: 0 }}>
                    <span className="lead-icon">
                      <PlusOutlined />
                    </span>
                    <span className="lead-txt title" >Create new visit</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Fragment>
      </SidebarWrapperAdmin>
      <Overlay isOpen={isOpen} onClick={toggleSidebar} style={{ marginTop: '60px' }} />
      <style>
        {`
        @media only screen and (max-width: 30em) {
           :where(.css-af4yj3).ant-menu-submenu-popup .ant-menu-vertical.ant-menu-sub{
           width: 136px!important;
            min-width: 0px!important
           }
            :where(.css-af4yj3).ant-menu-submenu-popup .ant-menu-vertical.ant-menu-sub([class*='-active']){
            display: none!important;
            }
        }
        :where(.css-af4yj3).ant-menu-submenu-popup{
        z-index: 99999!important;
        }
        :where(.css-af4yj3).ant-menu .ant-menu-submenu{
        width: 100%!important;
        text-align: left!important;
        }
        :where(.css-af4yj3).ant-menu-submenu >.ant-menu .ant-menu-submenu-arrow {
          color: black!important;
        }
        :where(.css-af4yj3).ant-menu .ant-menu-title-content{
        color: black!important;
        }
        :where(.css-af4yj3).ant-menu-light .ant-menu-submenu-selected >.ant-menu-submenu-title{
        color: white!important;
        }
        :where(.css-af4yj3).ant-menu-vertical >.ant-menu-submenu>.ant-menu-submenu-title {
     height: 15px!important; 
    line-height: 15px!important; 
}
    :where(.css-af4yj3).ant-menu-vertical .ant-menu-submenu-title {
    height: 0px!important;
    line-height: 0px!important;
    padding-inline: 0px!important;
    margin-inline: 0px!important;
    margin-block: 2px!important;
}
     :where(.css-af4yj3).ant-menu-light .ant-menu-submenu-selected >.ant-menu-submenu-title{
        color: white!important;
        }
        :where(.css-af4yj3).ant-menu-vertical >.ant-menu-submenu>.ant-menu-submenu-title {
     height: 15px!important; 
    line-height: 15px!important; 
}
    :where(.css-af4yj3).ant-menu-vertical .ant-menu-submenu-title {
    height: 0px!important;
    line-height: 0px!important;
     padding-inline: 0px!important;
     margin-inline: 0px!important;
    margin-block: 2px!important;
}

 @media only screen and (max-width: 30em) {
           :where(.css-dev-only-do-not-override-af4yj3).ant-menu-submenu-popup .ant-menu-vertical.ant-menu-sub{
           width: 136px!important;
            min-width: 0px!important
           }
            :where(.css-dev-only-do-not-override-af4yj3).ant-menu-submenu-popup .ant-menu-vertical.ant-menu-sub([class*='-active']){
            display: none!important;
            }
        }
        :where(.css-dev-only-do-not-override-af4yj3).ant-menu-submenu-popup{
        z-index: 99999!important;
        }
        :where(.css-dev-only-do-not-override-af4yj3).ant-menu .ant-menu-submenu{
        width: 100%!important;
        text-align: left!important;
        }
        :where(.css-dev-only-do-not-override-af4yj3).ant-menu-submenu >.ant-menu .ant-menu-submenu-arrow {
          color: black!important;
        }
        :where(.css-dev-only-do-not-override-af4yj3).ant-menu .ant-menu-title-content{
        color: black!important;
        }
        :where(.css-dev-only-do-not-override-af4yj3).ant-menu-light .ant-menu-submenu-selected >.ant-menu-submenu-title{
        color: white!important;
        }
        :where(.css-dev-only-do-not-override-af4yj3).ant-menu-vertical >.ant-menu-submenu>.ant-menu-submenu-title {
     height: 15px!important; 
    line-height: 15px!important; 
}
    :where(.css-dev-only-do-not-override-af4yj3).ant-menu-vertical .ant-menu-submenu-title {
    height: 0px!important;
    line-height: 0px!important;
    padding-inline: 0px!important;
    margin-inline: 0px!important;
    margin-block: 2px!important;
}
     :where(.css-dev-only-do-not-override-af4yj3).ant-menu-light .ant-menu-submenu-selected >.ant-menu-submenu-title{
        color: white!important;
        }
        :where(.css-dev-only-do-not-override-af4yj3).ant-menu-vertical >.ant-menu-submenu>.ant-menu-submenu-title {
     height: 15px!important; 
    line-height: 15px!important; 
}
    :where(.css-dev-only-do-not-override-af4yj3).ant-menu-vertical .ant-menu-submenu-title {
    height: 0px!important;
    line-height: 0px!important;
     padding-inline: 0px!important;
     margin-inline: 0px!important;
    margin-block: 2px!important;
}
        .setting-content {
    margin-top: .4rem;
    padding: .6rem;
    display: flex;
    justify-content: space-around;
    border-radius: .7rem;
    background-color: #8488BF;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 7px;

}
        .quickLink {
    font-size: small;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    color: white;
    margin-top: 10px;
    margin-bottom: 10px;

}
        .border-line {
          border-bottom: #ddd .07rem solid;
          padding-top: 1rem;
}
        .active{
        background: #E7EBEF;
        border-radius: 12px;
        
        }
  .detail-content {
    color: white;
    cursor: pointer;
}
    .create-lead {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-color: #8488BF;
    border-radius: .7rem;
    padding: .5rem;
    flex-wrap: nowrap;
}
    .lead-icon {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: x-large;
    width: 2.5rem;
    height: 2.5rem;
    background: white;
    border-radius: 50%;
    color: #8488BF;
}
    .lead-txt {
    font-size: small;
    padding-top: .2rem;
    font-weight: 500;
    color: white;
}
    .lead-link {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: x-small;
}
    .invite-link {
    color: red;
}
  `}
      </style>
    </div>
  );
};

export default SideMenu;
