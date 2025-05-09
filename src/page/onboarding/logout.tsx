import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeItemFromLS } from "utils/common";
import { LS_KEYS } from "../../app-constants";
import { Modal } from "antd";

function Logout(props: any) {
  const [showModal, setshowModal] = useState(false);
  useEffect(() => {
    if (props?.toggle) {
      setshowModal(true);

    }
  }, [props?.toggle]);

  const redirect = useNavigate();
  const logoutHandler = async () => {
    await removeItemFromLS(LS_KEYS.accessToken);
    redirect("/");
  };
  const [reset, setReset] = useState(false);

  const attendanceToggle = (capturing: any) => {
    setReset(capturing);
  };
  const handleCancel = () => {
    props.closeModal(false);
    setshowModal(false);
  };
  return (
    <>
      <Modal
        className="attendance"
        open={showModal}
        footer={null}
        onCancel={handleCancel}>

        <>
          <span className="sureDel">
            Are you sure you want to Logout?
          </span>
          <div className="dflex-sa">
            <button className="delbtnNo"
              onClick={() => {
                setshowModal(false);
              }}
            >
              No
            </button>
            <button
              onClick={() => {
                setshowModal(false);
                logoutHandler();
              }}
              className="delbtnYes">
              Yes
            </button>
          </div>
        </>
      </Modal>
    </>
  );
}

export default Logout
