import React, { useEffect, useRef, useState } from "react";
import "../style/profile.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import Footer from "../component/common/footer";
import { useAuth } from "context/AuthContext";
import { GetUserRole, UserRole } from "enum/common";
import { Avatar, Button, message } from "antd";
import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { AppDispatch } from "redux-store/store";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { getOrderSignedUrlService } from "services/orderService";
import { uploadFileToS3 } from "utils/uploadS3";
import { deleteProfilePicService, getProfileService, uploadProfilePictureService } from "services/authService";
import previousPage from "utils/previousPage";
import { capitalizeSubstring } from "utils/capitalize";
import DeleteItem from "component/admin/common/deleteItem";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";
import { getUserDetailsByEmpIdService } from "services/usersSerivce";
export default function Profile() {
  const [toggleDelete, setToggleDelete] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { state, pathname, search } = useLocation();
  const { authState, setAuthState } = useAuth();
  const fileInputRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = new URLSearchParams(search);
  const userId: any = searchParams.get('userId');

  const empId:any = Number(userId) ?? authState?.user?.id;
  const [userData, setUserData] = useState<any>([])
  const [updateImage, setUpdateImage] = useState<boolean>(false)
  useEffect(() => {
    async function getUserData() {
      try {
        // if () {
          setIsLoading(true);
          let res: any = {}
          if(empId){
            res = await getUserDetailsByEmpIdService(empId);
          }else{
            res = await getProfileService();
          }
          setUserData(res?.data?.data)
          setIsLoading(false);
        // }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getUserData();
  }, [updateImage, empId])

  
  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];

    try {
      dispatch(setLoaderAction(true))
      const res = await getOrderSignedUrlService(selectedFile?.name);
      await uploadFileToS3(res.data.data, selectedFile);
      const response = await uploadProfilePictureService({ "image": res.data.data.fileUrl, "empId": String(empId) ?? String(authState?.user?.id) });
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        message.success("Uploaded successfully");
        setUpdateImage(true)
        setIsLoading(true)
        const profileRes = await getProfileService();
        const userData = profileRes?.data?.data;
        setUserData(userData)
        setIsLoading(false)
        setAuthState(p => ({
          ...p,
          user: userData
        }))
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
  const toggleHandler = () => {

    setToggleDelete(true);
  }
  const [deleteUpdate, setDeleteUpdate] = useState<boolean>(false)
  const pageLoader = async (e: any) => {
    if (e) {
      const profileRes = await getProfileService();
      console.log({profileRes})
      const userData = profileRes?.data?.data;
      setUserData(userData)
    }
    setDeleteUpdate(e)
  }
  console.log({userData})

  return (
    <div>
      <FullPageLoaderWithState isLoading={isLoading} />
      <header
        className="heading heading-container"
      >
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{empId ? "User Details" : "My Profile"}</h1>
      </header>
      <div className="profile-container">
        <div className="profile-header">
          <div>
            {empId  ?
              (userData?.image  ? 
              <img
                src={empId ? userData?.image : authState?.user?.image }
                alt="Profile 1"
                className="profile-image"
                style={{ textAlign: "center" }}
              /> :
                <Avatar size={130} icon={<UserOutlined />} />) :

              (authState?.user?.image || userData?.image   ? <img
                src={authState?.user?.image || userData?.image }
                alt="Profile 2"
                className="profile-image"
                style={{ textAlign: "center" }}
              /> :
                <Avatar size={130} icon={<UserOutlined />} />)
            }
            <Button
              onClick={handleIconClick}
              icon={<PlusOutlined className='proaddIcon' />} className="uploadImg"></Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="profileRef"
            onChange={handleFileChange}
          />
          <DeleteOutlined onClick={() => toggleHandler()} className="deleteIcon prodeletebg" />
          <DeleteItem
            toggle={toggleDelete}
            name={"Your Profile Image"}
            itemsId={empId ?? authState.user?.id}
            deleteService={deleteProfilePicService}
            closeModal={(e: any) => {
              setToggleDelete(e);
            }}
            pageLoader={pageLoader} />
          <div className="profile-info">
            <p className="profileNameTxt">
              {userData ? `${userData?.name  ?? capitalizeSubstring(`${userData.firstname || ""} ${userData.lastname || ""}`)}` : (authState?.user ? capitalizeSubstring(authState?.user?.name) : "")}
            </p>
            <span className="fs-14">
              {userData ? userData?.role ?? "" : (authState?.user ? GetUserRole[authState?.user?.role] : "")}
            </span>
          </div>
        </div>
        <div className="tabs-details">
          <span
            className="tabs"
            style={{
              textDecoration: pathname === "/profile" ? "underline" : "none",
            }}
          >
           {empId ? <Link
              to={`/profile?userId=${empId}`}
              state={state}
              className="linkto clr-brown">
              {" "}
              Details
            </Link>
            : 
            <div style={{cursor:"default"}}>Details</div>}
          </span>
          <span
            className="tabs"
            style={{
              textDecoration: pathname !== "/profile" ? "underline" : "none",
            }}
          >
            {(authState?.user?.role === UserRole.SSM || userData.role === UserRole.SSM) && <Link
              to={`/profile/attendance-details?userId=${empId}`}
              state={"state"}
              className="linkto clr-brown">
              Attendance
            </Link>}
          </span>
        </div>
        <div
          className={
            pathname === "/profile" ? `profile-details` : `attendance-details`
          }
        >
          <Outlet context={{ userData }} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
