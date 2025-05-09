import React, { useEffect, useState } from "react";
import { Button, message, Modal } from "antd";
import "../../style/attendanceModal.css";
import { useAuth } from "context/AuthContext";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../redux-store/action/appActions";
import { getCheckInOutTime, getProfileService, markAttendance } from "services/authService";
import { dateFormatter } from "utils/common";

export default function AttendanceModal(props: any) {

  const { authState, setAuthState } = useAuth();
  const dispatch = useDispatch()

  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [attendanceType, setAttendanceType] = useState<any>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isButtonDisabledBoth, setIsButtonDisabledBoth] = useState(true);

  const [clockinTime, setClockinTime] = useState<any>("");
  const [clockoutTime, setClockoutTime] = useState<any>("");
  useEffect(() => {
    if (authState && authState.user) {
      const user = authState.user;
    }
  }, [authState]);

  useEffect(() => {
    if (props.toggle) {
      setShowModal(true);
    }
  }, [props.toggle]);

  const handleCancel = () => {
    props.closeModal(false);
    setShowModal(false);
  };

  const showConfirm = (type: string) => {
    setAttendanceType(type);
    setConfirmModal(true);
    setIsButtonDisabled(false)
    if (type === "out") {
      setIsButtonDisabledBoth(true)
    }
  };

  const closeConfirm = () => {
    setConfirmModal(false);
  };

  const handleYes = async () => {
    const date = new Date();
    const markedTime = date.toISOString();
    if (attendanceType.toUpperCase() === 'IN') {
      try {
        dispatch(setLoaderAction(true));
        const response = await markAttendance({ inTime: markedTime });
        dispatch(setLoaderAction(false));
        setConfirmModal(false);
        if (response && response.status === 200) {
          const { data } = response;
          message.success(data.message)
          getInOutTime();
          getProfileDetails();
        }
      } catch (error: any) {
        setConfirmModal(false);
        dispatch(setLoaderAction(false));
        const { data } = error.response;
        message.error(data.message)
      }
    } else {
      try {
        dispatch(setLoaderAction(true));
        const response = await markAttendance({ outTime: markedTime });
        dispatch(setLoaderAction(false));
        setConfirmModal(false);
        if (response && response.status === 200) {
          const { data } = response;
          message.success(data.message)
          getInOutTime();
          getProfileDetails();
        }
      } catch (error: any) {
        setConfirmModal(false);
        dispatch(setLoaderAction(false));
        const { data } = error.response;
        message.error(data.message)
      }
    }
  }

  const getProfileDetails = async () => {
    try {
      const profileRes = await getProfileService();
      if (profileRes && profileRes.status === 200) {
        const userData = profileRes?.data?.data;
        setAuthState(p => ({
          ...p,
          user: userData
        }))
      }
    } catch (err: any) {

    }
  }

  useEffect(() => {
    getInOutTime();
  }, [clockinTime, clockoutTime]);

  const getInOutTime = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getCheckInOutTime();
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        const { data } = response.data;
        const inT = data.inTime ? data.inTime : null;
        const outT = data.outTime ? data.outTime : null;
        // console.log({data})
        // if (inT) { setIsButtonDisabled(false) }
        setClockinTime(inT);
        setClockoutTime(outT);
      }
    } catch (error: any) {
      dispatch(setLoaderAction(false));
    }
  }
  // clockinTime ? setIsButtonDisabled(true) : setIsButtonDisabled(false)
  return (
    <div>
      {/* <Modal className="attendance" open={showModal} footer={null} onCancel={handleCancel} >
      <div className="markAttContainer">Mark Attendance</div>
      <div className="modalContain">
        <>
          <button
            disabled={!isButtonDisabledBoth}
            className="in"
            style={{
              cursor: !isButtonDisabledBoth ? "not-allowed" : "",
              backgroundColor: !isButtonDisabledBoth
                ? "rgb(154, 197, 154)"
                : "green",
              color: !isButtonDisabledBoth ? " #D1E9BC " : "white",
            }}
            onClick={() => {
              showConfirm("In")
            }}
            type="button"
          >
            In
          </button>
          <button
            disabled={isButtonDisabled}
            className="out"
            style={{
              cursor: isButtonDisabled ? "not-allowed" : "",
              backgroundColor: isButtonDisabled
                ? "rgb(187, 128, 101)"
                : "rgb(216, 71, 4)",
              color: isButtonDisabled ? "#E1B7AE " : "white",
            }}
            onClick={() => {
              showConfirm("Out")
            }}
          >
            Out
          </button>

        </>
      </div> */}
      {/* <div className='dflex-center' style={{ margin: "0 20px 0 20px" }}>
        <div style={{ background: "green", width: "100%", height: "60px", flexDirection: "column", gap: "7px" }} className='dflex-center'>
          <span style={{ color: "white", fontSize: "15px", fontWeight: 500 }}>CHECK-IN</span>
          {clockinTime ?
            <span className="intime" style={{ color: "white", fontSize: "15px", fontWeight: 400 }}
            >{clockinTime ? dateFormatter(clockinTime, "hh:mm:ss a") : ""}</span>
            :
            <button style={{ background: "white", color: "black", borderRadius: "0px", fontSize: "11px", padding: "6px 16px", fontWeight:"bold" }}
              onClick={() => {
                showConfirm("In")
              }}
              type="button"
            >Check-in</button>
          }
        </div>
        <div style={{ background: "#C65911", width: "100%", height: "70px", flexDirection: "column", gap: "7px" }} className='dflex-center'>
          <span style={{ color: "white", fontSize: "15px", fontWeight: 500 }}>CHECK-OUT</span>
          {clockoutTime ?
            <span className="outtime" style={{ color: "white", fontSize: "15px", fontWeight: 400 }}
            >{clockoutTime ? dateFormatter(clockoutTime, "hh:mm:ss a") : ""}</span>
            : <button style={{ background: "white", color: "black", borderRadius: "0px", fontSize: "11px", padding: "6px 16px", fontWeight:"bold"  }}
              onClick={() => {
                showConfirm("Out")
              }}
              type="button"
            >Check-out</button>
          }
        </div>
      </div> */}
      {/* {
         1 || clockinTime && (
            <div className="checktime">
              <div>Check-in time: <span className="intime">{clockinTime ? dateFormatter(clockinTime, "hh:mm:ss a") : ""}</span></div>
              <div>Check-out time: <span className="outtime">{clockoutTime ? dateFormatter(clockoutTime, "hh:mm:ss a") : ""}</span></div>
            </div>
          )
        } */}
      {/* </Modal> */}
      <div className='dflex-center' style={{ margin: "0 20px 0 20px" }}>
                <div style={{ background: "green", width: "100%", height: "60px", flexDirection: "column", gap: "7px" }} className='dflex-center'>
                    <span style={{ color: "white", fontSize: "15px", fontWeight: 500 }}>CHECK-IN</span>
                    <button style={{ background: "white", color: "black", borderRadius: "0px", fontSize: "11px", padding: "3px 10px" }}
                     onClick={() => {
                      showConfirm("In")
                    }}
                    type="button"
                    >Check-in</button>
                </div>
                <div style={{ background: "#C65911", width: "100%", height: "60px", flexDirection: "column", gap: "7px" }} className='dflex-center'>
                    <span style={{ color: "white", fontSize: "15px", fontWeight: 500 }}>CHECK-OUT</span>
                    <button style={{ background: "white", color: "black", borderRadius: "0px", fontSize: "11px", padding: "3px 10px" }}
                    onClick={() => {
                      showConfirm("Out")
                    }}>Check-out</button>

                </div>
            </div>
            <div className="checktime">
              <div><span style={{fontWeight:"bold"}}>Check-in time:</span> <span className="intime">{clockinTime ? dateFormatter(clockinTime, "hh:mm:ss a") : ""}</span></div>
              <div><span style={{fontWeight:"bold"}}>Check-out time:</span> <span className="outtime">{clockoutTime ? dateFormatter(clockoutTime, "hh:mm:ss a") : ""}</span></div>
            </div>
      <Modal className="confirm" open={confirmModal} footer={null} closeIcon={false}>
        <div className="title">Are you sure you want to Check {attendanceType} ?</div>
        <div className="btn">
          <Button className="no" onClick={closeConfirm}>No</Button>
          <Button className="yes" onClick={handleYes}>Yes</Button>
        </div>
      </Modal>
    </div>
  );
}
