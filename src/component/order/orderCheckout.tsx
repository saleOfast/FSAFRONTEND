import React, { useEffect, useState } from "react";
import PopOver from "../common/popOver";
import { CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OrderCheckout(props: any) {
  const [showModal, setshowModal] = useState(false);
  const [reset, setReset] = useState(false);


  const attendanceToggle = (capturing: boolean) => {
    setReset(capturing);
  };
  useEffect(() => {
    if(props.toggle){
      setshowModal(true);
    }
  }, [props.toggle]);

 
  return (
    <>
      {showModal && (
        <PopOver
          showModal={showModal}
          setshowModal={setshowModal}
          attendanceToggle={attendanceToggle}
        >
          <span className="sureDel">
            Are you sure you want to checkout without Focused items?
          </span>
          <div className="dflex-sa">
          <button className="delbtnNo">
              No
            </button>
            <Link to="/order/checkout">
              <button className="delbtnYes">
                Yes
              </button>
            </Link>
           
          </div>

          {reset && (
            <div className="modalTarget">
              <span className="target">
                <CheckCircleOutlined className="orderCheckIcon"
                />
              </span>
              <div>Attendance Marked Successfully</div>
            </div>
          )}
        </PopOver>
      )}
    </>
  );
}
