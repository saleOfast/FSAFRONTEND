import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useAuth } from "context/AuthContext";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { message } from "antd";
import { capitalizeSubstring } from "utils/capitalize";
import { getProfileService } from "services/authService";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";

function DeleteItem(props: any) {
  const { deleteService, toggle, itemsId, name, closeModal, pageLoader = false, isBrand, isCompetitor } = props;
  const [showModal, setshowModal] = useState(false);
  const dispatch = useDispatch();
  const { setAuthState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (toggle) {
      setshowModal(true);
    }
  }, [toggle]);

  const DeleteHandler = async (itemsId: any, isBrand: boolean = false, isCompetitor: number = 0) => {
    if (deleteService?.name === "deleteProfilePicService") {
      try {
        setAuthState(p => ({
          ...p,
          isLoading: true
        }))
        setIsLoading(true)
        dispatch(setLoaderAction(true));
        const response = await deleteService(itemsId);
        if (response) {
          setAuthState((p: any) => ({
            ...p,
            user: {
              ...p.user,
              image: "",
            },
            authenticated: true,
          }))
          setAuthState((p: any) => ({
            ...p,
            isLoading: false,
          }))
          dispatch(setLoaderAction(false));
          message.success("Deleted Successfully")
          pageLoader(true)
          setIsLoading(false)
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    } else {
      try {
        setAuthState(p => ({
          ...p,
          isLoading: true
        }))
        dispatch(setLoaderAction(true));
        let response
        if (!isBrand) {
          response = await deleteService(itemsId);
        } else {
          response = await deleteService(itemsId, isCompetitor);
        }
        dispatch(setLoaderAction(false));
        setAuthState((p: any) => ({
          ...p,
          isLoading: false,
          authenticated: true,
        }))
        if (response?.data?.status === 200) {
          message.success("Deleted Successfully")
        } else {
          message.error("Something Went Wrong")
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }
  };

  const handleCancel = () => {
    closeModal(false);
    setshowModal(false);
  };

  return (
    <>
      <FullPageLoaderWithState isLoading={isLoading} />

      <Modal
        className="attendance"
        open={showModal}
        footer={null}
        onCancel={handleCancel}>

        <>
          <span
            className="sureDel">
            Are you sure you want to Delete: {capitalizeSubstring(name)} ?
          </span>
          <div
            className="dflex-sa">
            <button
              className="delbtnNo"
              onClick={() => {
                setshowModal(false);
                handleCancel();
              }}
            >
              No
            </button>
            <button
              onClick={() => {
                DeleteHandler(itemsId, isBrand, isCompetitor);
              }}
              className="delbtnYes"
            >
              Yes
            </button>
          </div>
        </>
      </Modal>
    </>
  );
}

export default DeleteItem;
