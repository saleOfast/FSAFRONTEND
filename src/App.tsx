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
import { ConfigProvider, Dropdown, MenuProps, Space } from "antd";
import { getProductBrandActions, getProductCategoryActions } from "redux-store/action/productAction";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { capitalizeFirstLetter } from "utils/capitalize";
import { UserRole } from "enum/common";
import Logout from "page/onboarding/logout";
import SideMenu from "component/common/menu";

function App() {
  const { pathname } = useLocation();
  const redirect = useNavigate();
  const { setAuthState, authState } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const rolePaths: any = {
    [UserRole.SSM]: "/home",
    [UserRole.CHANNEL]: "/dashboard",
    [UserRole.RETAILER]: "/retailor/dashboard",
    [UserRole.ADMIN]: "/admin/dashboard",
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
    display: none !important;
  }
   .left{
      text-align:left !important;
      margin-left: 16px !important;
   }
}

    `}
  </style>
        <div className={noPaths.includes(pathname) ? "" : "dashboardContainer"}>
          {pathname === "/403" || pathname !== "/" &&
            <div style={{
              display: "flex", justifyContent: "space-between", width: "100%", height: "50px", position: "fixed", zIndex: "99", alignItems: "center",
              backgroundColor: `#8488BF`,
              // backgroundImage: noPaths.includes(pathname) ? "" : `url("https://mrapp.saleofast.com/images/headerblur.png")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(.4px)",
              // backgroundColor:"blue",
              // height: "100vh",
              // position: "relative"
            }}

            >
              <div style={{ marginLeft: "3%" }} className="aligncenter"
              >
                <Link to={authState?.user?.role === UserRole.SSM ? "/home" : authState?.user?.role === UserRole.RETAILER ? "/retailor/dashboard" : "/admin/dashboard"}>
                  {noPaths.includes(pathname) ? "" : <img src="https://mrapp.saleofast.com/images/saleofast_logo.png" width={120} alt="LOGO"/>}
                </Link>
                
              </div>
              {/* <div style={{display:"flex"}}>
                  <h1 style={{marginLeft:"30px", textAlign:"left"}}>ADMIN</h1>
              </div> */}
              <div style={{display: "flex", width: "100%"}} >
                  <label style={{marginLeft: "90px", textAlign: "left", color:"#FFFFFF", fontSize:"20px", fontWeight:"700", fontStyle:"bold", width:"288px"}}className="left">Admin Dashboard</label>
              </div>
              <div style={{ marginRight: "0%" }}>
                  
                
                <div className="aligncenter" style={{ marginRight: "10px", width:"150px"}}>
                  
                  {authState?.user?.role &&
                    <Link to="#" className="linkto" onClick={(e) => { e.preventDefault() }} >
                      <Dropdown menu={{ items }} trigger={['click']} >
                        <Space>
                          <span style={{ color: "white" }}>
                            Hi,{" "}
                            {capitalizeFirstLetter(authState?.user?.role === UserRole.ADMIN ? authState.user?.name.split(' ')[0] : authState.user?.name.split(' ')[0] + "")}
                          </span>
                          <DownOutlined style={{ color: "white" }} />
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
