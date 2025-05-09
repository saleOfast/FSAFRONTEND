import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/login.css";
import { Form, message } from "antd";
import { forgotPasswordSchema } from "../../utils/formValidations";
import { forgotPasswordService } from "services/authService";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../redux-store/action/appActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HookFormInputField from "component/HookFormInputField";
export const ForgotPassword = () => {
  const redirect = useNavigate();
  const dispatch = useDispatch()
  const {
    control,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      // email: "",
      dob: "",
      phone: ""
    }
  })

  const onSubmit = async (values: any) => {
    const { email, phone, dob } = values;
    try {
      dispatch(setLoaderAction(true));
      const response:any = await forgotPasswordService({ phone, dob });
      if (response?.data?.status === 200) {
        // message.success("Reset Password link sent via mail");
        // redirect(`/auth/verify-mail?email=${email}`)
        redirect(`/auth/confirm-password?empId=${response?.data?.data?.emp_id}&role=${response?.data?.data?.role}`)
      }
      dispatch(setLoaderAction(false));
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      message.error(error?.response?.data?.message || "Something Went Wrong")
    }
  };

  return (
    <>

      <div className="Fcontainer">
        <div className="form-container">
          <div style={{ textAlign: "center", marginBottom: "60px", marginRight: "20px" }}>
            <img src={`${process.env.PUBLIC_URL}/logo2.png`} width={200} height={60} alt="login-logo" />
          </div>
          <div className="login-title">Forgot Password</div>

          <Form
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off"
            name="validateOnly" layout="vertical" >

            {/* <HookFormInputField
              control={control}
              type="email"
              name="email"
              placeholder="Email"
              label={"Email"}
              required
              style={{ height: "42px", fontSize: "16px" }}
            /> */}
            <HookFormInputField
              control={control}
              type="phone"
              name="phone"
              placeholder="Enter Phone Number"
              label={"Phone"}
              required
              style={{ height: "42px", fontSize: "16px" }}
            />
            <HookFormInputField
              control={control}
              type="date"
              name="dob"
              placeholder="Enter Date of Birth"
              label={"Date of Birth"}
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
    </>
  );
};
