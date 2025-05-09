import React, { useCallback, useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Modal, message } from "antd";
import { IVisitCheckOutReq, IVisitsData } from "types/Visits";
import useCoordinates from "hooks/useCoordinates";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { visitsCheckOutService } from "services/visitsService";

interface IVisitCheckout {
  showCheckout: boolean;
  setShowCheckout: any;
  fileUrl?: string;
  visitId?: number;
  visitDetails: IVisitsData | null;
  isVisitAndStoreId: number

}
function VisitCheckout({ showCheckout, fileUrl, setShowCheckout, visitId, visitDetails, isVisitAndStoreId }: IVisitCheckout) {
  const { coordinate } = useCoordinates();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reset, setReset] = useState(false);
// console.log({fileUrl})
  const handleCancel = () => {
    setShowCheckout(false);
  };
// console.log({e:state?.visitDetail?.image})
  const handleSubmit = useCallback(async () => {
    try {
      const checkPic :any = fileUrl || state?.visitDetail?.image
      if (!checkPic || !isVisitAndStoreId) {
        message.warning("Please capture the image", )
        return;
      }
      if (!visitId) {
        return;
      }
      dispatch(setLoaderAction(true));
      const requestBody: IVisitCheckOutReq = {
        checkOut: new Date().toISOString(),
        checkOutLat: coordinate.latitude ? coordinate.latitude.toString() : undefined,
        checkOutLong: coordinate.longitude ? coordinate.longitude.toString() : undefined,
        image: visitDetails?.image  as any,
        visitId
      }
      const res = await visitsCheckOutService(requestBody);
      dispatch(setLoaderAction(false));
      message.success(res.data.message)
      navigate("/visit")
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  }, [coordinate.latitude, coordinate.longitude, dispatch, navigate, visitDetails?.image, visitId]);

  return (
    <>
      {showCheckout && (
        <Modal
          className="attendance"
          open={showCheckout}
          footer={null}
          onCancel={handleCancel}>

          <div className="sureDel">
            Are you sure you want to check Out ?
          </div>
          <div className="dflex-sa">
            <Button
              type="default"
              onClick={handleCancel}>
              No
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}>
              Yes
            </Button>
          </div>

          {reset && (
            <div className="modalTarget">
              <span className="target">
                <CheckCircleOutlined className="orderCheckIcon"/>
              </span>
              <div>Attendance Marked Successfully</div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

export default VisitCheckout;