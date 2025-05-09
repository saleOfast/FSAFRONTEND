import { useAuth } from "context/AuthContext";
import React, { useEffect, useState } from "react";
import { capitalizeSubstring } from "utils/capitalize";
import { dateFormatterNew } from "utils/common";
import { useOutletContext } from "react-router-dom";
export default function ProfileDetails() {
  const props: any = useOutletContext();
  console.log({props: props.userData})
  // const { zone, phone, emp_id, address, email, manager, joining_date, } = props.userData

  const { authState } = useAuth();
  const [joiningDate, setJoiningDate] = useState('');

  useEffect(() => {
    if (authState && authState.user) {
      const jDate = authState.user?.joiningDate;
      const dateParts: any = jDate.split('-');
      const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      setJoiningDate(dateFormatterNew(date.toISOString()));
    }
  }, [authState]);
  return (
    <>
      <div className="profile-detail-containe">
        <div className="">
          <div className="detail">
            <p className="profi-text" style={{ gap: "44px" }}>
              {" "}
              <span className="field">Employee ID</span>
              <span>{props?.userData?.emp_id ? props?.userData?.emp_id : (authState.user ? authState.user?.id : "")}</span>
            </p>
          </div>
          <div className="detail">
            <p className="profi-text" style={{ gap: "65px" }}>
              <span className="field">Manager</span>
              <span>{props?.userData?.manager ? props?.userData?.manager || "NA": (authState.user ? capitalizeSubstring(authState.user?.manager) : "NA")}</span>
            </p>
          </div>
          <div className="detail">
            <p className="profi-text" style={{ gap: "40px" }}>
              <span className="field">Joining Date</span>
              <span>{props?.userData?.joining_date ? (props?.userData?.joining_date ? dateFormatterNew(props?.userData?.joining_date) : "") : (authState?.user?.joiningDate ?authState?.user?.joiningDate : "")}</span>
            </p>
          </div>
          <div className="detail">
            <p className="profi-text" style={{ gap: "70px" }}>
              <span className="field">Contact</span>
              <span>{props?.userData?.phone ? props?.userData?.phone : (authState.user ? authState.user?.contactNumber : "")}</span>
            </p>
          </div>
           <div className="detail">
            <p className="profi-text" style={{ gap: "85px" }}>
              <span className="field">Email</span>
              <span>{props ? (props?.userData ? props?.userData?.emailId || props?.userData?.email: "NA"): (authState.user ? authState.user?.emailId : "")}</span>
            </p>
          </div>
         <div className="detail">
            <p className="profi-text" style={{ gap: "68px" }}>
              <span className="field">Address</span>
              <span>{props ? (props?.userData?.address ? props?.userData?.address: "NA") : (authState.user ? authState.user?.address : "")}</span>
            </p>
          </div>
          <div className="detail">
            <p className="profi-text" style={{ gap: "94px" }}>
              <span className="field">City</span>
              <span>{props ? (props?.userData?.city ? props?.userData?.city: "NA") : (authState.user ? authState.user?.city : "")}</span>
            </p>
          </div>
          <div className="detail">
            <p className="profi-text" style={{ gap: "86px" }}>
              <span className="field">State</span>
              <span>{props ? (props?.userData?.state ? props?.userData?.state: "NA") : (authState.user ? authState.user?.state : "")}</span>
            </p>
          </div>
          <div className="detail">
            <p className="profi-text" style={{ gap: "62px" }}>
              <span className="field">Pin Code</span>
              <span>{props ? (props?.userData?.pincode ? props?.userData?.pincode: "NA") : (authState.user ? authState.user?.pincode : "")}</span>
            </p>
          </div>
          {/* {props?.userData?.zone &&<div className="detail">
            <p className="profi-text" style={{ gap: "88px" }}>
              <span className="field">Zone</span>
              <span className="detail">{props?.userData?.zone ? props?.userData?.zone : (authState.user ? authState.user?.zone : "")}</span>
            </p>
          </div>} */}
        </div>
      </div>
    </>
  );
}
