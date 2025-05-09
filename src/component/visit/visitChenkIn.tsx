import React, { useCallback, useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button, Modal, message } from "antd";
import { IVisitCheckInReq, IVisitsData } from "types/Visits";
import { visitsCheckInService } from "services/visitsService";
import { IGeoCoordinate } from "types/Common";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../redux-store/action/appActions";
import { getValidationErrors } from "utils/errorEvaluation";
import useCoordinates from "hooks/useCoordinates";

interface IVisitCheckIn {
  toggle: boolean;
  setToggle: any;
  data: IVisitsData;
  coordinates: IGeoCoordinate | null;
}
export default function VisitCheckIn({ setToggle, toggle, data, coordinates }: IVisitCheckIn) {
  const [reset, setReset] = useState(false);
  const coordinatess = useCoordinates();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCancel = () => {
    setToggle(false);
  };

  const handleCheckIn = useCallback(async () => {
    try {
      const reqBody: IVisitCheckInReq = {
        checkIn: new Date().toISOString(),
        visitId: data.visitId,
        action: ""
      }
      if (coordinates?.latitude) {
        reqBody.checkInLat = coordinates.latitude.toString();
      }

      if (coordinates?.longitude) {
        reqBody.checkInLong = coordinates.longitude.toString();
      }
      dispatch(setLoaderAction(true));
      await visitsCheckInService(reqBody);
      dispatch(setLoaderAction(false));
      navigate({ pathname: `/visit-details/${data.storeDetails.storeId}/${data.visitId}` })
    } catch (error) {
      dispatch(setLoaderAction(false));
      message.warning(getValidationErrors(error))
    }
  }, [coordinates?.latitude, coordinates?.longitude, data.storeDetails.storeId, data.visitId, dispatch, navigate]);

  return (
    <>
      {/* <Modal
        className="attendance"
        open={toggle}
        footer={null}
        onCancel={handleCancel}>
        <div className="visitCheckMod">
          Are you sure you want to check IN ?
        </div>
        <div className="dflex-sa">
          <Button
            type="default"
            onClick={handleCancel}>
            No
          </Button>
          <Button
            type="primary"
            onClick={handleCheckIn}>
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
      </Modal> */}

    </>
  );
}
