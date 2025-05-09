import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setLoaderAction } from 'redux-store/action/appActions';
import { AppDispatch } from 'redux-store/store';
import { updateCollectionAmountService } from 'services/orderService';
import { paymentCaptureByRazorpayService } from 'services/paymentService';
import { IUpdateCollectionReq } from 'types/Order';

// Function to load script and append in DOM tree.
// Declare Razorpay on the window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      // console.log('Razorpay loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      // console.log('Error in loading Razorpay');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};


type RazorpayRenderProps = {
  orderId: any;
  keyId: string;
  keySecret: string;
  currency: string;
  amount: number;
  name:string;
  toggle: boolean;
  callbackToggle: any
  visitOrderId: number
};

const RazorpayRender: React.FC<RazorpayRenderProps>  = ({
  orderId,
  keyId,
  keySecret,
  currency,
  amount,
  name,
  toggle,
  callbackToggle,
  visitOrderId
}) => {
  const paymentId = useRef(null);
  const paymentMethod = useRef(null);
  const dispatch = useDispatch<AppDispatch>();

  // To load razorpay checkout modal script.
  const displayRazorpay = async (options:any) => {
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js',
    );

    if (!res) {
      // console.log('Razorpay SDK failed to load. Are you online?');
      return;
    }
    // All information is loaded in options which we will discuss later.
    const rzp1 = new window.Razorpay(options);

    // If you want to retreive the chosen payment method.
    rzp1.on('payment.submit', (response:any) => {
      paymentMethod.current = response.method;
    });

    // To get payment id in case of failed transaction.
    rzp1.on('payment.failed', (response:any) => {
      paymentId.current = response.error.metadata.payment_id;
    });

    // to open razorpay checkout modal.
    rzp1.open();
  };


  // informing server about payment
  const handlePayment = async (status:any, orderDetails = {}) => {
    try{
       const reqBody: any = {
      "status":  status,
      "orderDetails": orderDetails,
     }
     
      // await paymentCaptureByRazorpayService(reqBody);
      
    }
      catch(error){
      throw error
      }
  };

  // we will be filling this object in next step.
  const options = {
    key: keyId, // key id from props
    amount, // Amount in lowest denomination from props
    currency, // Currency from props.
    name: name, // Title for your organization to display in checkout modal
    image: "https://resource.digitaldealer.com.au/image/1027481236616752b23efde453431830_0_0.png", // custom logo  url
    order_id: orderId, // order id from props
    // This handler menthod is always executed in case of succeeded payment
    handler: async (response:any) => {
      const paymentDate = new Date()
      const data:any = {
        orderId: Number(visitOrderId),
        transactionId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        amount,
        paymentDate,
        status: "SUCCESS",
        paymentMode: "UPI"
    };
    dispatch(setLoaderAction(true));
    const res =  await paymentCaptureByRazorpayService(data);
    dispatch(setLoaderAction(false));
    if(res?.data?.status === 200){
      try{
        const reqBody: IUpdateCollectionReq = {
          "collectedAmount": res?.data?.data?.amount,
          "orderId": res?.data?.data?.orderId
        }
      dispatch(setLoaderAction(true));
      await updateCollectionAmountService(reqBody)
      await callbackToggle(false)
      dispatch(setLoaderAction(false));
      
      }catch(error){
        // console.log("error", error)
      }
    }
    },
    modal: {
      confirm_close: true, // this is set to true, if we want confirmation when clicked on cross button.
      // This function is executed when checkout modal is closed
      // There can be 3 reasons when this modal is closed.
      ondismiss: async (reason:any) => {
        const {
          // reasons: reason
          // reason: paymentReason, field, step, code,
        } = reason && reason.error ? reason.error : {};
        
        // Reason 1 - when payment is cancelled. It can happend when we click cross icon or cancel any payment explicitly. 
        if (reason === undefined) {
          callbackToggle(false)
          handlePayment('Cancelled');
        } 
        // Reason 2 - When modal is auto closed because of time out
        else if (reason === 'timeout') {
          handlePayment('timedout');
        } 
        // Reason 3 - When payment gets failed.
        else {
          handlePayment('failed', {
            // paymentReason, field, step, code,
          });
        }
      },
    },
    // This property allows to enble/disable retries.
    // This is enabled true by default. 
    retry: {
      enabled: false,
    },
    timeout: 900, // Time limit in Seconds
    theme: {
      color: '', // Custom color for your checkout modal.
    },
  };

  useEffect(() => {
    displayRazorpay(options);
  }, [toggle]);

  return null;
};

export default RazorpayRender;