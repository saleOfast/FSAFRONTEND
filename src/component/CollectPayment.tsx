import React, { Fragment, useEffect, useRef, useState } from "react";
import "../style/collectPayment.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useLocation, useParams } from "react-router-dom";
import { setLoaderAction } from "redux-store/action/appActions";
import { AppDispatch } from "redux-store/store";
import { useDispatch } from "react-redux";
import { getCollectionByOrderIdService, getOrderSignedUrlService, updateCollectionAmountService } from "services/orderService";
import { dateFormatterNew, smallestUnitINRCurrency } from "utils/common";
import { Button, Form, message, Modal } from "antd";
import HookFormInputField from "./HookFormInputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IUpdateCollectionReq } from "types/Order";
import previousPage from "utils/previousPage";
import HookFormSelectField from "./HookFormSelectField";
import RazorpayRender from "./paymentGateway/razorpayRender";
import { IAddOnlinePaymentReq, ICreatePaymentReq } from "types/Payment";
import { addPaymentByCashService, addPaymentByOnlineService, getPaymentRecordByOrderIdService } from "services/paymentService";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '../app-constants';
import { IVisitParams } from "types/Visits";
import { dataURLtoFile, uploadFileToS3 } from "utils/uploadS3";
import { updateVisitPictureService } from "services/visitsService";
import VisitsTakPicture from "./visit/VisitsTakPicture";
import { getFeatureService } from "services/usersSerivce";
import { GetFeatureService, UserRole } from "enum/common";
import { useAuth } from "context/AuthContext";

const schemaPartiallyPay = Yup.object({
  "amount": Yup.string().required('Fields required'),
  "mode": Yup.string().required('Fields required')
})

const schemaFullyPay = Yup.object({
  "mode": Yup.string().required('Fields required'),
  "amount": Yup.string().optional(),
})
interface IVisitsTakPicture {
  show: boolean;
  setShow: any;
  setFileUrl: any;
  getVisitDetails: any;
}
export default function CollectPayment() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const order_id: any = searchParams.get('order_id');
  const [collectionData, setCollectionData] = useState<any>(null);
  const [paymentRecord, setPaymentRecord] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isNoRecord, setIsNoRecord] = useState<boolean>(false);
  const [payPartiallyNFull, setPayPartially] = useState<any>(null)
  const [isPartiallyPayment, setIsPartiallyPayment] = useState<boolean>(true)
  const { orderId, store, orderDate, netAmount, collectedAmount } = Object(collectionData)
  const initialFormData = {
    amount: isPartiallyPayment ? "" : `${netAmount - collectedAmount}`,
    mode: ""
  };
  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    mode: "all",
    resolver: yupResolver(isPartiallyPayment ? schemaPartiallyPay : schemaFullyPay),
    defaultValues: initialFormData
  })
  const [upiPaymentRender, setUpiPaymentRender] = useState<any>()
  useEffect(() => {
    if (order_id) {
      getCollectionData();
      getPaymentRecordByOrderId();
    }
  }, [order_id, upiPaymentRender]);

  const getCollectionData = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getCollectionByOrderIdService(order_id);
      dispatch(setLoaderAction(false));
      setIsNoRecord(true)
      if (response && response.status === 200) {
        setCollectionData(response?.data?.data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  const getPaymentRecordByOrderId = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getPaymentRecordByOrderIdService(order_id);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        setPaymentRecord(data);
        await getCollectionData();
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const openCollectPaymentModal = (e: any, item: any, partialPayment: boolean) => {
    e.preventDefault();
    if (orderId) {
      setOrderDetails(item);
      setIsModalOpen(true);
      setIsPartiallyPayment(partialPayment)
    }
  }

  const [displayRazorpay, setDisplayRazorpay] = useState<boolean>(false);
  const callbackToggle = (isToggle: boolean) => {
    setDisplayRazorpay(!!isToggle)
    setUpiPaymentRender(isToggle)
  }

  const handleCreateOrder = async (amount: any, currency: "INR") => {
    try {
      const reqBody: any | IAddOnlinePaymentReq = {
        "amount": smallestUnitINRCurrency(amount), //convert amount into lowest unit. here, Dollar->Cents
        "currency": currency,
        "keyId": RAZORPAY_KEY_ID,
        "keySecret": RAZORPAY_KEY_SECRET,
      }
      dispatch(setLoaderAction(true));
      const response: any = await addPaymentByOnlineService(reqBody);
      dispatch(setLoaderAction(false));
      const { data } = response?.data
      setDisplayRazorpay(true);
      setPayPartially(Number(amount))
      if (response && response.status === 200) {
        setOrderDetails({
          orderId: data?.order_id,
          currency: data?.currency,
          amount: data?.amount,
        });
        message.success("UPI Payment Initiated")
        setDisplayRazorpay(!displayRazorpay)
      }
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      message.error(`${error?.response?.message}`);
    }
  };

  const [showPicture, setShowPicture] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>();
  
  const paymentMode: any = async (amount: number, mode: string, orderId: number, refImg: string) => {
    const paymentDate = new Date()
    try {
      const reqBody: ICreatePaymentReq = {
        "paymentDate": `${paymentDate}`,
        "orderId": orderId,
        "paymentMode": mode,
        "status": "SUCCESS",
        "transactionId": "NA",
        "amount": amount,
        "paymentRefImg": refImg ?? ""
      }

      dispatch(setLoaderAction(true));
      const response = await addPaymentByCashService(reqBody);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        message.success("Cash Payment Successfully")
        await getPaymentRecordByOrderId();
        await getCollectionData();
        reset();
      }
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      const { data } = error.response;
      message.error(`${data.message}`);
    }
  }
 
  useEffect( ()=>{
    const handleAsyncOperation = async () => {
       if(showPicture && fileUrl){
        try {
          const reqBody: any = {
            "collectedAmount": Number(payPartiallyNFull),
            "orderId": collectionData.orderId,
            
          }
          dispatch(setLoaderAction(true));
          await paymentMode(Number(payPartiallyNFull), "UPI", collectionData.orderId, fileUrl)
          const response = await updateCollectionAmountService(reqBody);
          dispatch(setLoaderAction(false));
          if (response && response.status === 200) {
            getCollectionData();
            setIsModalOpen(false);
            setShowPicture(false)
            reset();
          }
        } catch (error: any) {
          dispatch(setLoaderAction(false));
          const { data } = error.response;
          message.error(`${data.message}`);
        }
       }
      }
      handleAsyncOperation();
  }, [fileUrl])
   const { authState } = useAuth();
  const onSubmit = async (value: any) => {
    if (!isPartiallyPayment) {
      value.amount = netAmount - collectedAmount
    }
    let { amount, mode } = value;
    if (collectionData && (Number(amount) <= (netAmount - collectedAmount))) {
      if (mode === "UPI") {
        setPayPartially(amount);
        authState?.user?.role === UserRole.RETAILER ? handleCreateOrder(amount, "INR") : setShowPicture(true);
        // handleCreateOrder(amount, "INR")
      } else {
        try {
          const reqBody: IUpdateCollectionReq = {
            "collectedAmount": Number(amount),
            "orderId": collectionData.orderId
          }
          dispatch(setLoaderAction(true));
          await paymentMode(Number(amount), mode, collectionData.orderId)
          const response = await updateCollectionAmountService(reqBody);
          dispatch(setLoaderAction(false));
          if (response && response.status === 200) {
            getCollectionData();
            setIsModalOpen(false);
            reset();
          }
        } catch (error: any) {
          dispatch(setLoaderAction(false));
          const { data } = error.response;
          message.error(`${data.message}`);
        }
      }
    }
    else {
      message.error("Collected amount should be equal or less than to the pending amount.");
    }
  }

  const handleShare = (paymentLink: any) => {
    const message = encodeURIComponent(`Check out this payment link: ${paymentLink}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;

    window.open(whatsappUrl, '_blank');
  };
//  const  { setShow, show, setFileUrl, getVisitDetails }: IVisitsTakPicture
  // const dispatch = useDispatch();

 


  return (
    <div>
     
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Collect Payment</h1>
      </header>
      {collectionData && <Fragment>
        <div className="content paymentInfo">
          <div className="collectPayContainer">
            <div className="paymentContent">
              <span>Order no.: <span className="fw-bold">{orderId}</span></span>
              <span>Outlet Name: <span className="fw-bold">{Object(store).storeName}</span></span>
              <span>Due Date: <span className="fw-bold">{dateFormatterNew(orderDate)}</span></span>
            </div>
            <div className="paymentContent end">
              <span>Total Amount: <span className="fw-bold">{netAmount}</span></span>
              <span>Paid Amount: <span className="fw-bold">{collectedAmount}</span></span>
              <span>Pending Amt: <span className="fw-bold">{(netAmount - collectedAmount).toFixed(2)}</span></span>
            </div>
          </div>
          <div className="paymentBtn" >
          <Link to={`/order/order-summary/${orderId}`}>
          <Button >Order Details</Button>
          </Link>
          { (Number(netAmount) - Number(collectedAmount)).toFixed(2) != "0.00" && 
          <><Button
              onClick={(e: any) => openCollectPaymentModal(e, (netAmount - collectedAmount).toFixed(2), false)}>
              Pay Fully
            </Button>
            <Button onClick={(e: any) => openCollectPaymentModal(e, payPartiallyNFull, true)}>Pay Partially</Button>
            {/* <Button 
             onClick={() => setShowPicture(true)}>Add Ref Screenshot</Button> */}
           
            </>
            }
              {
                  showPicture &&
                  <VisitsTakPicture
                    show={showPicture}
                    setShow={setShowPicture}
                    setFileUrl={setFileUrl}
                    getVisitDetails={""} 
                    />
                }
          </div>
          <Modal className="collect-payment" open={isModalOpen} footer={null} onCancel={handleCancel}>
            {isPartiallyPayment ?
              <Fragment> <div className="title">Partially Payment</div>
                <Form
                  onFinish={handleSubmit(onSubmit)}
                  autoComplete="off">
                  <HookFormSelectField
                    control={control}
                    type="text"
                    name="mode"
                    placeholder="Select Payment Mode"
                    label={"Payment Mode"}
                    showSearch
                    allowClear
                    optionData={[
                      { label: "Cash", value: "CASH" },
                      { label: "UPI", value: "UPI" },
                    ]}
                    filterOption={(inputValue: any, option: any) => {
                      return option.label.toLowerCase().includes(inputValue.toLowerCase())
                    }}
                    required
                  />
                  <HookFormInputField
                    control={control}
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    label={"Enter Amount"}
                    required
                  />
                  <div className="btn">
                    <Button className="yes" onClick={handleCancel} danger>
                      Cancel
                    </Button>
                    <Button className="yes" htmlType="submit" type="primary" style={{ marginLeft: "20px" }} onClick={handleCancel}>
                      Proceed
                    </Button>
                  </div>
                </Form>
              </Fragment>
              :
              <Fragment>
                <div className="title" style={{ justifyContent: "center", gap: "6px" }}>Fully Payment: <span style={{ fontWeight: 500 }}>{" "} {(netAmount - collectedAmount).toFixed(2)}</span></div>
                <Form
                  onFinish={handleSubmit(onSubmit)}
                  autoComplete="off">
                  <HookFormSelectField
                    control={control}
                    type="text"
                    name="mode"
                    placeholder="Select Payment Mode"
                    label={"Payment Mode"}
                    showSearch
                    allowClear
                    optionData={[
                      { label: "Cash", value: "CASH" },
                      { label: "UPI", value: "UPI" },
                    ]}
                    filterOption={(inputValue: any, option: any) => {
                      return option.label.toLowerCase().includes(inputValue.toLowerCase())
                    }}
                    required
                  />
                  <div className="btn">
                    <Button className="yes" onClick={handleCancel} danger>
                      Cancel
                    </Button>
                    <Button className="yes" htmlType="submit" type="primary" style={{ marginLeft: "20px" }} onClick={handleCancel}>
                      Proceed
                    </Button>
                  </div>
                </Form>
              </Fragment>}
          </Modal>
        </div>
        <div className="table-container">
          <table className="fixed-header" style={{ marginBottom: "80px" }}>
            <thead>
              <tr className="attendanceTh">
                <th className="fwtNor txtC">Payment Id</th>
                <th className="fwtNor txtC">Status</th>
                <th className="fwtNor txtC">Mode</th>
                <th className="fwtNor txtC">Amount</th>
               {authState?.user?.role !== UserRole.RETAILER && <th className="fwtNor txtC">UPI Payment Ref</th>}
              </tr>
            </thead>
            <tbody className="table-body attDetailContent">
              {(paymentRecord && paymentRecord.length > 0) ? paymentRecord.map((item: any, ind: number) => {
                return (
                  <tr className="storeData txtC" key={ind}>
                   {/* { (authState?.user?.role === UserRole.RETAILER || authState?.user?.role === UserRole.SSM) ?<td className="txtC">{item?.paymentMode === "CASH" ? item?.paymentId : item?.transactionId} </td>
                    : */}
                    <td className="txtC">{item?.transactionId === "NA" ? item?.paymentId : item?.transactionId} </td>

                    <td className="txtC">{item?.status}</td>
                    <td className="txtC">{item?.paymentMode}</td>
                    <td className="txtC fw-bold">{item?.amount}</td>
                  {authState?.user?.role !== UserRole.RETAILER &&  <td className="txtC fw-bold">
                    {item?.paymentMode === "UPI" && <img src={item?.paymentRefImg} alt="No Img" width="300px" height="300px"/>}
                      </td>}

                  </tr>
                )
              }) : isNoRecord && (
                <tr className="storeData txtC">
                  <td colSpan={4}>No record found</td>
                </tr>
              )
              }
            </tbody>
          </table>
        </div>
        <div>
          {displayRazorpay && (
            <RazorpayRender
              amount={orderDetails?.amount}
              currency={orderDetails?.currency}
              orderId={orderDetails?.orderId}
              keyId={RAZORPAY_KEY_ID}
              keySecret={RAZORPAY_KEY_SECRET}
              name={Object(store).storeName}
              toggle={displayRazorpay}
              callbackToggle={callbackToggle}
              visitOrderId={order_id}
            />
          )}
        </div>
      </Fragment>}
    </div>
  );
}
