import React, { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../redux-store/action/appActions";
import { message } from "antd";
import { updateApprovalSpecialDiscountService } from "services/dashboardService";
import { SpecialDiscountStatus } from "enum/order";

function RejectedComment(props: any) {
  const { toggle, closeModal, isApprovedRejected, callbackRejectedRequest } = props;
  const [showModal, setshowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toggle) {
      setshowModal(true);
    }
  }, [toggle]);

  const [commentValue, setCommentValue] = useState<any>()
  const onChangeHandler = (e: any) => {
    setCommentValue(e.target.value)
  }

  const specialDiscountHandler = async () => {
    if (SpecialDiscountStatus.REJECTED === isApprovedRejected?.specialDiscountStatus) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateApprovalSpecialDiscountService({ specialDiscountStatus: isApprovedRejected?.specialDiscountStatus, orderId: Number(isApprovedRejected?.orderId), specialDiscountComment: commentValue });
        dispatch(setLoaderAction(false));
        if (response.data.status === 200) {
          message.success("Request Rejected");
          callbackRejectedRequest(true);
          closeModal(false);
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
        closeModal(false);
      }
    }
  };


  const handleCancel = () => {
    closeModal(false);
    setshowModal(false);
  };

  return (
    <div>
      <Modal
        className="attendance"
        open={showModal}
        footer={null}
        onCancel={handleCancel}>

        <>

          <span
            className="sureDel" style={{ flexDirection: "column", paddingTop: 0 }}>
            <span style={{ marginBottom: "10px", fontSize: "18px" }}>Add Comment For Rejection</span>
            <span >

              <Input
                size="middle"
                // style={{ width: '170px' }}
                onChange={(e: any) => onChangeHandler(e)}
              />
            </span>
            <span>Request Discount {isApprovedRejected?.specialdiscountvalue}%</span>
          </span>
          <div
            className="dflex-sa">
            <button
              className="delbtnNo"
              style={{ padding: "6px 10px", fontSize: "14px" }}
              onClick={() => {
                setshowModal(false);
                handleCancel();
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                specialDiscountHandler();
                handleCancel();
              }}
              className="delbtnYes"
              style={{ padding: "7px 10px", fontSize: "14px" }}
            >
              Submit
            </button>
          </div>
        </>
      </Modal>
    </div>
  );
}

export default RejectedComment;
