import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../style/login.css";
import { Form, message } from "antd";
import { resetPasswordSchema } from "../../utils/formValidations";
import { resetPasswordService } from "services/authService";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HookFormInputField from "component/HookFormInputField";
import { useAuth } from "context/AuthContext";
import { UserRole } from "enum/common";

export const ConfirmPassword = () => {
  const redirect = useNavigate();
  const dispatch = useDispatch()
  const {authState} = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const empId: string | null = searchParams.get('empId');
  const role: string | null = searchParams.get('role');

  const {
    control,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  const onSubmit = async (values: any) => {
    const { confirmPassword, password } = values;
    try {

      dispatch(setLoaderAction(true));

      const response = await resetPasswordService({ password, confirmPassword, empId: Number(empId) });
      dispatch(setLoaderAction(false));
      if (response?.data?.status === 200) {
        message.success("Reset Password Successfully.")
        redirect(role === UserRole.SSM ? "/" : "/admin/users")
      }
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      message.error(error?.response?.data?.message)
    }
  };

  return (
    <div className="Fcontainer">
      <div className="form-container">
        <div style={{ textAlign: "center", marginBottom: "60px", marginRight: "20px" }}>
          <img src={`${process.env.PUBLIC_URL}/logo2.png`} width={200} height={60} alt="login-logo" />
        </div>
        <div className="login-title">New Password</div>
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off"
          name="validateOnly" layout="vertical" >

          <HookFormInputField
            control={control}
            type="password"
            name="password"
            placeholder="Enter New Password"
            label={"Enter New Password"}
            required
            style={{ height: "42px", fontSize: "16px" }}
          />
          <HookFormInputField
            control={control}
            type="password"
            name="confirmPassword"
            placeholder="Enter Confirm Password"
            label={"Confirm Password"}
            required
            style={{ height: "42px", fontSize: "16px" }}
          />
          <div><Link to="/">Back to login</Link></div>
          <span style={{ marginBottom: "10px" }}></span>
          <button
            type="submit"
            style={{ marginTop: "70px", height: "42px", borderRadius: "6px" }}
            className="loginbtn"
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  )
}
