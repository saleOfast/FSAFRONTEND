import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAttendanceList } from "services/authService";
import { dateFormatter, dateFormatterNew } from "utils/common";
import { setLoaderAction } from "../../redux-store/action/appActions";
import { useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { ArrowLeftOutlined } from "@ant-design/icons";
import previousPage from "utils/previousPage";

export default function AttendanceDetails() {
  const {  search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const empId: string | any = searchParams.get('userId');
  const hr: string | any = searchParams.get('hr');

  const dispatch = useDispatch()
  const [attendanceData, setAttendanceData] = useState<any>([]);
  const { authState } = useAuth();
  useEffect(() => {
    handleAttendanceData();
  }, []);
  const handleAttendanceData = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getAttendanceList(String(authState?.user?.id)??empId);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        setAttendanceData(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  }

  return (
    <div>
      {hr &&
       <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
       <ArrowLeftOutlined onClick={previousPage} className="back-button"/>
         <h1 className="page-title pr-18">Attendance</h1>
       </header>
       }
      
      <div className="last30">
        <span className="last30text">Last 30 Days</span>{" "}
      </div>
      <div className="table-container">
        <table className="fixed-header">
          <thead>
            <tr className="attendanceTh">
              <th>S.No.</th>
              <th>Date</th>
              <th>Check IN</th>
              <th>Check OUT</th>
            </tr>
          </thead>
          <tbody className="table-body attDetailContent">
            {
              attendanceData && attendanceData.length > 0 ? (
                attendanceData?.slice().reverse()?.map((item:any, index:any) => {
                  const { checkIn, checkOut } = item;
                  const formattedCheckinTime = checkIn ? dateFormatter(checkIn, "hh:mm:ss a") : null;
                  const formattedCheckoutTime = checkOut ? dateFormatter(checkOut, "hh:mm:ss a") : null;
                  const formattedDate = checkIn ? dateFormatterNew(checkIn) : null;

                  return (
                    <>
                      <tr className="attendanceTd table-body" key={index}>
                        <td>{index + 1}</td>
                        <td>{formattedDate}</td>
                        <td>{formattedCheckinTime}</td>
                        <td>{formattedCheckoutTime}</td>
                      </tr>
                    </>
                  );
                })
              ) : (
                <tr className="attendanceTd">
                  <td colSpan={4}>No record</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
