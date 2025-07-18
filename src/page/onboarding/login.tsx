import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/login.css";
import { Form, message } from "antd";
import { loginSchema } from "../../utils/formValidations";
import { getProfileService, loginService } from "services/authService";
import { useAuth } from "context/AuthContext";
import { setItemIntoLS } from "utils/common";
import { LS_KEYS } from "../../app-constants";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HookFormInputField from "component/HookFormInputField";
import { UserRole } from "enum/common";
export const Login = () => {
  const { setAuthState } = useAuth();
  const redirect = useNavigate();
  const dispatch = useDispatch()
  const {
    control,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    }
  })
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

  const onSubmit = async (values: any) => {
     
    const { phone, password } = values;
    try {
      setAuthState(p => ({
        ...p,
        isLoading: true
      }))
      dispatch(setLoaderAction(true));

      const response = await loginService({ phone: Number(phone), password });
      dispatch(setLoaderAction(false));
      if (response?.data?.status === 200) {
        message.success("Sign-in Successfully")
        const token = response?.data?.data.accessToken;
        setItemIntoLS(LS_KEYS.accessToken, token);
        const profileRes = await getProfileService();
        const userData = profileRes?.data?.data;
        setItemIntoLS(LS_KEYS.userData, JSON.stringify(userData));
        setAuthState(p => ({
          ...p,
          isLoading: false,
          authenticated: true,
          user: userData
        }))
         await redirect(rolePaths[userData?.role], { state: token });
      }
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      message.error(error?.response?.data?.message || "Something Went Wrong")
    }
  };

  return (
    <>

      <div
        className="Fcontainer"
        style={{
          backgroundImage: `url("https://mrapp.saleofast.com/images/loginbg.avif")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Blur Layer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: "blur(1px)", // Apply blur to the entire background
            zIndex: 1, // Keeps it behind the form container
          }}
        ></div>

        {/* Form Container */}
        <div
          className="form-container"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255, 255, 255, 0.8)", // Optional: Add transparency to the form container
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 2, // Ensure it appears above the blur layer
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "60px",
              marginRight: "20px",
            }}
          >
            <img
              src="https://mrapp.saleofast.com/images/saleofast_logo2x.png"
              width={200}
              height={60}
              alt="login-logo"
            />
          </div>
          <div className="login-title">Sign In</div>

          <Form
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off"
            name="validateOnly"
            layout="vertical"
          >
            <HookFormInputField
              control={control}
              type=""
              name="phone"
              placeholder="User Id"
              label={"User Id"}
              required
              style={{ height: "42px", fontSize: "16px" }}
            />
            <span style={{ marginBottom: "10px" }}></span>
            <HookFormInputField
              control={control}
              type="password"
              name="password"
              placeholder="Password"
              label={"Password"}
              required
              style={{ height: "42px" }}
            />
            <div>
              <Link to="./auth/forgot-password">Forgot Password</Link>
            </div>
            <button
              type="submit"
              style={{
                marginTop: "70px",
                height: "42px",
                borderRadius: "6px",
              }}
              className="loginbtn"
            >
              Submit
            </button>
          </Form>
        </div>
      </div>

    </>
  );
};
