import React, { useEffect, useState } from "react";
import { Input, Modal, Select } from "antd";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "../../redux-store/action/appActions";
import { message } from "antd";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";
import { getNoOrderService, updateOrderSpecailDiscountService } from "services/orderService";
import { SpecialDiscountStatus } from "enum/order";
import { updateVisitNoOrderReasonService } from "services/visitsService";

function RequestDiscount(props: any) {
  const { orderId, toggle, closeModal, specialDiscountStatus, previousDiscount, visitId, requestText, title } = props;
  const [showModal, setshowModal] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (toggle) {
      setshowModal(true);
    }
  }, [toggle]);
  const [data, setData] = useState<any>([])
  const [isRender, setIsRender] = useState<boolean>(false)

  useEffect(() => {
    async function fetchData() {
        try {
            dispatch(setLoaderAction(true));
            setIsLoading(true)
            const res = await getNoOrderService();
            if (res?.data?.status === 200) {
                setData(res?.data?.data)
                dispatch(setLoaderAction(false));
                setIsLoading(false)
            }
            setIsLoading(false)
            dispatch(setLoaderAction(false));
        } catch (error) {
            dispatch(setLoaderAction(false));
            setIsLoading(false)
        }
    }
    fetchData();
}, [isRender]);
  const [discountValue, setDiscountValue] = useState<any>()
  const onChangeHandler = (e: any) => {
    setDiscountValue(e.target.value)
  }

  const onSelectHandler = (e: any) => {
    setDiscountValue(e)
  }

  const specialDiscountHandler = async () => {
    if (orderId) {
      try {
        dispatch(setLoaderAction(true));
        const response = await updateOrderSpecailDiscountService({ specialDiscountValue: Number(discountValue), orderId: Number(orderId), specialDiscountStatus: SpecialDiscountStatus.PENDING });
        dispatch(setLoaderAction(false));
        if (response.data.status === 200) {
          message.success("Special Discount Request Sent")
          closeModal(false);
          setshowModal(false);
        } else {
          message.success(response.data.message)
        }
      } catch (error: any) {
        dispatch(setLoaderAction(false));
        message.error("Something Went Wrong");
      }
    }else if(visitId){
      try {
        dispatch(setLoaderAction(true));
        const response = await updateVisitNoOrderReasonService({ noOrderReason: discountValue ?? "", visitId: Number(visitId)});
        dispatch(setLoaderAction(false));
        if (response.data.status === 200) {
          message.success("Submitted Successfully")
          closeModal(false);
          setshowModal(false);
          setIsRender(true);
        } else {
          message.success(response.data.message)
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
            className="sureDel" style={{ flexDirection: "column", paddingTop: 0 }}>
          {orderId ?  <span style={{ marginBottom: "10px", fontSize: "18px" }}>
              {specialDiscountStatus === SpecialDiscountStatus.REJECTED ? "Raise New Request For Special Discount" : "Request for Special Discount"}
              </span>
              :
              <span style={{ marginBottom: "10px", fontSize: "18px" }}>
              {visitId && requestText}
              </span>
              
            }
            <span >

              {orderId ? 
              <Input
                size="middle"
                style={{ width: visitId ? '90%':'170px' }}
                onChange={(e: any) => onChangeHandler(e)}
              />
              : 
              <Select
              style={{width:"100%", cursor:"pointer"}}
              showSearch
              placeholder="Select a reason"
              filterOption={(input:any, option:any) =>
                (option?.label ?? '')?.toLowerCase()?.includes(input.toLowerCase())
              }
              onChange={(e: any) => onSelectHandler(e)}
              options={data?.map((item:any) => ({
                label: item.description,
                value: item.description
              }))}
            />
            }

            </span>
            {orderId &&
            <span>{specialDiscountStatus === SpecialDiscountStatus.REJECTED ? "Previous Discount" + " " + previousDiscount + "(%)" : "Discount (%)"}</span>
        
               }
                  </span>
          <div className="dflex-sa">
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
              }}
              className="delbtnYes"
              style={{ padding: "7px 10px", fontSize: "14px" }}
            >
              Submit
            </button>
          </div>
        </>
      </Modal>
    </>
  );
}

export default RequestDiscount;
