import { ArrowLeftOutlined, CaretRightOutlined, CheckCircleFilled } from "@ant-design/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../common/footer";
import { Button, Checkbox, Flex, Typography, message } from "antd";
import { IOrderCheckoutParams, IVisitsData } from "types/Visits";
import "../style/checkout.css";
import previousPage from "utils/previousPage";
import { createOrderService, getOrderSummaryByOrderIdService } from "services/orderService";
import { ICreateOrderReq } from "types/Order";
import { setLoaderAction } from "redux-store/action/appActions";
import { getValidationErrors } from "utils/errorEvaluation";
import { OrderStatus } from "enum/order";
import { DiscountTypeEnum } from "enum/product";
import { ICheckoutItem } from "types/Product";
import { getVisitsByVisitIdService } from "services/visitsService";
import { useDispatch } from "react-redux";
import RequestDiscount from "./requestDiscount";
import { getStoreByIdService } from "services/storeService";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params: any = useParams<IOrderCheckoutParams>();
  const [visitDetails, setVisitDetails] = useState<IVisitsData | null>(null);
  const [orderItems, setOrderItems] = useState<ICheckoutItem[]>([]);
  const [visitDataId, setVisitDataId] = useState<any>();
  const [pieceDiscount, setPieceDiscount] = useState<number>(0);

  // console.log({orderItems})
  const [isVisibility, setIsVisibility] = useState(false);
  async function getOrderSummaryData() {
    try {
      if (params.orderId) {
        dispatch(setLoaderAction(true));
        const res = await getOrderSummaryByOrderIdService(params?.orderId);
        setVisitDataId(res?.data?.data?.visitId)
        setPieceDiscount(Number(res?.data?.data?.pieceDiscount))
        dispatch(setLoaderAction(false));
        if (res.data.data.products) {
          setOrderItems(res.data.data.products
            .map(item => {
              const d = getUpdatedAmount(item as any);
              return {
                brandId: item.brandId,
                categoryId: item.categoryId,
                isFocused: item.isFocused,
                mrp: item.mrp,
                noOfCase: item.noOfCase,
                noOfPiece: item.noOfPiece,
                productId: item.productId,
                productName: item.productName,
                rlp: item.rlp,
                caseQty: item.caseQty,
                skuDiscount: item.skuDiscount,
                totalAmount: d.totalAmount,
                netAmount: 0,
                skuDiscountAmount: d.discountedAmount,
              }
            }));
          if (res.data.data.visibilityDiscountValue !== null && +res.data.data.visibilityDiscountValue > 0) {
            setIsVisibility(true)
          }
        }
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  }
  const [selectedStoreData, setSelectedStoreData] = useState<any>();
    const handleStoreChange = async () => {
      // setSelectedStore(value);
      try {
        dispatch(setLoaderAction(true));
        const response = await getStoreByIdService(params?.storeId);
        dispatch(setLoaderAction(false));
        if (response && response.status === 200) {
          let { data } = response.data;
          setSelectedStoreData(data);
        }
      } catch (error) {
        dispatch(setLoaderAction(false));
      }
    };

    useEffect(() => {
      handleStoreChange();
    }, [params?.storeId]);

    useEffect(() => {
      if (params?.visitId == "undefined") {
        const data: any = {
          storeDetails: selectedStoreData
        };
        
        setVisitDetails(data); // This will only be called when `params` changes
      }
      // handleStoreChange();
    }, [params, selectedStoreData]);
    // console.log({params, selectedStoreData})
  const handleVisitDetails = useCallback(async () => {
    try {
      if (params?.visitId) {
        const res = await getVisitsByVisitIdService(+params?.visitId)
        setVisitDetails(res.data.data);
      }
    } catch (error) {

    }
  }, [params?.visitId]);

  useEffect(() => {
    handleVisitDetails()
    getOrderSummaryData()
  }, []);

  const getUpdatedAmount = (orderItem: ICheckoutItem) => {
    const totalNoOfPiece = orderItem.noOfPiece + (orderItem.caseQty * orderItem.noOfCase);
    const RlpAmount = orderItem?.rlp * totalNoOfPiece;
    let totalAmount = RlpAmount
    let discountedAmount = 0;
    if (!visitDetails?.storeDetails.isPremiumStore && orderItem.skuDiscount && orderItem.skuDiscount.isActive) {
      if (orderItem.skuDiscount.discountType === DiscountTypeEnum.PERCENTAGE) {
        discountedAmount = Number(((totalAmount * orderItem.skuDiscount.value) / 100).toFixed(2));
      }
      if (orderItem.skuDiscount.discountType === DiscountTypeEnum.VALUE) {
        discountedAmount = orderItem.skuDiscount.value * totalNoOfPiece;
      }
    }
    return {
      totalAmount: totalAmount,
      discountedAmount: discountedAmount
    }
  };

  const incrementQuantity = useCallback((productId: number) => {
    const updatedOrderItems = orderItems.map(item => {
      if (item.productId === productId) {
        item.noOfPiece += 1;
        const d = getUpdatedAmount(item);
        item.totalAmount = d.totalAmount;
        item.skuDiscountAmount = d.discountedAmount;
        return item
      }
      return item
    })
    setOrderItems(updatedOrderItems);
  }, [orderItems]);

  const decrementQuantity = useCallback((productId: number) => {
    const updatedOrderItems = orderItems.map(item => {
      if (item.productId === productId) {
        if (item.noOfPiece > 0) {
          item.noOfPiece -= 1;
          const d = getUpdatedAmount(item);
          item.totalAmount = d.totalAmount;
          item.skuDiscountAmount = d.discountedAmount;
        }
        return item
      }
      return item
    })
    setOrderItems(updatedOrderItems);
  }, [orderItems]);

  const handleQtyChange = useCallback((productId: number, value: string) => {
    const updatedOrderItems = orderItems.map(item => {
      if (item.productId === productId) {
        if (+value >= 0) {
          item.noOfPiece = +value;
          const d = getUpdatedAmount(item);
          item.totalAmount = d.totalAmount;
          item.skuDiscountAmount = d.discountedAmount;
        }
        return item
      }
      return item
    })
    setOrderItems(updatedOrderItems);
  }, [orderItems]);

  const incrementCaseQty = useCallback((productId: number) => {
    const updatedOrderItems = orderItems.map(item => {
      if (item.productId === productId) {
        item.noOfCase += 1;
        const d = getUpdatedAmount(item);
        item.totalAmount = d.totalAmount;
        item.skuDiscountAmount = d.discountedAmount;
        return item
      }
      return item
    })
    setOrderItems(updatedOrderItems);
  }, [orderItems]);

  const decrementCaseQty = useCallback((productId: number) => {
    const updatedOrderItems = orderItems.map(item => {
      if (item.productId === productId) {
        if (item.noOfCase > 0) {
          item.noOfCase -= 1;
          const d = getUpdatedAmount(item);
          item.totalAmount = d.totalAmount;
          item.skuDiscountAmount = d.discountedAmount;
        }
        return item
      }
      return item
    })
    setOrderItems(updatedOrderItems);
  }, [orderItems]);

  const handleCaseQtyChange = useCallback((productId: number, value: string) => {
    const updatedOrderItems = orderItems.map(item => {
      if (item.productId === productId) {
        if (+value >= 0) {
          item.noOfCase = +value;
          const d = getUpdatedAmount(item);
          item.totalAmount = d.totalAmount;
          item.skuDiscountAmount = d.discountedAmount;
        }
        return item
      }
      return item
    })
    setOrderItems(updatedOrderItems);
  }, [orderItems]);


  const calculatedData = useMemo(() => {
    let total = 0;
    let totalSkuDiscount = 0;
    orderItems.forEach((item) => {
      const itemTotal = item?.totalAmount;
      total += itemTotal;
      if (!visitDetails?.storeDetails?.isPremiumStore) {
        totalSkuDiscount += item.skuDiscountAmount;
      }
    });
    let netTotal = total;
    if (totalSkuDiscount > 0) {
      netTotal = netTotal - totalSkuDiscount;
    }
    // Order value discount
    let orderValueDiscount = 0;
    if (netTotal > 0 && visitDetails?.storeDetails?.isActiveOrderValueDiscount && !visitDetails?.storeDetails?.isPremiumStore && visitDetails?.storeDetails?.orderValueDiscount) {
      const orderValueDiscountObj = visitDetails.storeDetails.orderValueDiscount;
      let matchedRange = orderValueDiscountObj.find(i => {
        const [min = 0, max = 0] = i.amountRange.split("-");
        return (netTotal > +min && netTotal <= +max);
      })
      if (!matchedRange) {
        for (let item of orderValueDiscountObj) {
          const [_min = 0, max = 0] = item.amountRange.split("-");
          if (netTotal > +max) {
            matchedRange = { ...item };
          }
        }
      }
      if (matchedRange) {
        if (matchedRange.discountType === DiscountTypeEnum.PERCENTAGE) {
          orderValueDiscount = (netTotal * matchedRange.value) / 100;
        }
        else if (matchedRange.discountType === DiscountTypeEnum.VALUE) {
          orderValueDiscount = matchedRange.value;
        }
      }
    }
    if (orderValueDiscount > 0) {
      netTotal = netTotal - orderValueDiscount;
    }
    // Premium store Flat discount
    let flatDiscount = 0;
    if (netTotal > 0 && visitDetails?.storeDetails?.isPremiumStore && visitDetails?.storeDetails?.flatDiscount?.isActive) {
      const flatDiscountObj = visitDetails.storeDetails.flatDiscount;
      if (flatDiscountObj.discountType === DiscountTypeEnum.PERCENTAGE) {
        flatDiscount = (netTotal * flatDiscountObj.value) / 100;
      }
      else if (flatDiscountObj.discountType === DiscountTypeEnum.VALUE) {
        flatDiscount = flatDiscountObj.value;
      }
    }
    if (flatDiscount > 0) {
      netTotal = netTotal - flatDiscount;
    }
    //  Premium store visibility discount
    let visibilityDiscount = 0;
    if (isVisibility) {
      if (netTotal > 0 && visitDetails?.storeDetails?.isPremiumStore && visitDetails?.storeDetails.visibilityDiscount?.isActive) {
        const visibilityDiscountObj = visitDetails.storeDetails.visibilityDiscount;
        if (visibilityDiscountObj.discountType === DiscountTypeEnum.PERCENTAGE) {
          visibilityDiscount = (netTotal * visibilityDiscountObj.value) / 100;
        } else if (visibilityDiscountObj.discountType === DiscountTypeEnum.VALUE) {
          visibilityDiscount = visibilityDiscountObj.value;
        }
      }
    }
    // Net total amount
    
    if (visibilityDiscount > 0) {
      netTotal = netTotal - visibilityDiscount;
    }
    // let pieceDiscount: number = 0;
    if(pieceDiscount > 0){
      // const data = dataSource[dataSource.length - 1];
      // pieceDiscount = data?.discount;
      netTotal = netTotal - pieceDiscount;
      
    }
    return {
      total: total?.toFixed(2),
      totalSkuDiscount: totalSkuDiscount?.toFixed(2),
      flatDiscount: flatDiscount?.toFixed(2),
      visibilityDiscount: visibilityDiscount?.toFixed(2),
      orderValueDiscount: orderValueDiscount?.toFixed(2),
      pieceDiscount: pieceDiscount?.toFixed(2),
      netTotal: netTotal?.toFixed(2),
    };
  }, [isVisibility, orderItems, visitDetails?.storeDetails])

// console.log({e:params.visitId})
  const handleSave = useCallback(async (orderStatus: OrderStatus) => {
    if (params?.orderId && params?.storeId) {
      try {
        dispatch(setLoaderAction(true));
        const changedOrderItems = orderItems.filter(i => i.noOfCase > 0 || i.noOfPiece > 0);
        const requestBody: ICreateOrderReq = {
          orderAmount: +calculatedData.total,
          orderDate: new Date().toISOString(),
          products: changedOrderItems
            .map(i => {
              return {
                categoryId: i.categoryId,
                brandId: i.brandId,
                productId: i.productId,
                productName: i.productName,
                mrp: i.mrp,
                rlp: i.rlp,
                noOfCase: i.noOfCase,
                noOfPiece: i.noOfPiece,
                skuDiscount: i?.skuDiscount as any || undefined,
                isFocused: i.isFocused || false,
                caseQty: i.caseQty
              }
            }),
          visitId: +params.visitId ? +params.visitId : null,
          storeId: +params.storeId,
          orderStatus: orderStatus,
          netAmount: +calculatedData.netTotal,
          isVisibility,
          pieceDiscount: +calculatedData?.pieceDiscount
          // isCallType:  VisitTypeEnum.PHYSICAL,
        }
        if (params.orderId) {
          requestBody.orderId = +params.orderId
        }
        const res = await createOrderService(requestBody)
        if (res.data.status === 200) {
          if(+params?.visitId){
            navigate(`/visit-details/${params.storeId}/${params.visitId}`)
          }else{
            navigate(`/order`)
          }
          dispatch(setLoaderAction(false));
          message.success(res.data.message)
        } else {
          message.error(res.data.message)
        }
      } catch (error) {
        dispatch(setLoaderAction(false));
        message.error(getValidationErrors(error))
      }
    }
  }, [calculatedData.netTotal, calculatedData.total, dispatch, isVisibility, navigate, orderItems, params.orderId, params.storeId, params.visitId]);
  const [toggle, setToggle] = useState(false);
  const [specialDiscount, setSpecialDiscount] = useState(0);
  const [orderId, setOrderId] = useState<any>();


  const toggleHandler = (orderId: number) => {
    setToggle(true);
    setOrderId(orderId);
  }

  return (
    <>
      <div className="checkout-main">
        <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
          <ArrowLeftOutlined onClick={previousPage} className="back-button" />
          <h1 className="page-title pr-18">Checkout</h1>
        </header>
        <RequestDiscount
          toggle={toggle}
          orderId={orderId}
          title={"Discount"}
          requestText={"Request for Special Discount"}
          closeModal={(e: any) => {
            setToggle(e);
          }} />
        <main className="">
          <div className="order-checkout-section " >
            {orderItems.length > 0 && (
              <div className="take-order-list content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px", marginBottom: "10px" }}>
                {orderItems.map((data) => {
                  const { productName, caseQty, mrp, rlp, totalAmount, noOfPiece, noOfCase, productId, skuDiscountAmount, isFocused } = data;
                  const RlpAmount = mrp - (mrp * rlp) / 100;
                  return (
                    <div className="order-container" key={`order_${productId}`}>
                      {isFocused &&
                        <div className="order-focused-item">
                          <CheckCircleFilled
                            className='checkIcon'
                          />
                          <span>Focused Item</span>
                        </div>
                      }
                      <div className="order-headline">
                        <span
                          className="order-title">
                          {productName}
                        </span>
                        <span className="order-title">
                          Case Qty:{caseQty}
                        </span>
                      </div>
                      <div className="order-mrp">
                        <div>
                          MRP: <span className="font-weight-bold">₹{mrp}</span>
                        </div>
                        <div>
                          RLP: <span className="font-weight-bold">
                            ₹{rlp || RlpAmount}
                          </span>
                        </div>
                      </div>
                      <div className="order-input-content">
                        <div className="input-content-item">
                          <div>Cases</div>
                          <div>
                            <div className="quantity-selector">
                              <button
                                className="quantity-btn left"
                                onClick={() => decrementCaseQty(productId)}>
                                -
                              </button>
                              <input
                                type="number"
                                inputMode="numeric"
                                className="quantity-input"
                                value={noOfCase}
                                onChange={e => handleCaseQtyChange(productId, e.target.value)}
                              />
                              <button
                                className="quantity-btn right"
                                onClick={() => incrementCaseQty(productId)}>
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="input-content-item">
                          <div>Piece</div>
                          <div className="quantity-selector">
                            <button
                              className="quantity-btn left"
                              onClick={() => {
                                decrementQuantity(productId);
                              }}>
                              -
                            </button>
                            <input
                              type="number"
                              inputMode="numeric"
                              className="quantity-input"
                              value={noOfPiece}
                              onChange={e => handleQtyChange(productId, e.target.value)}
                            />
                            <button
                              className="quantity-btn right"
                              onClick={() => {
                                incrementQuantity(productId);
                              }}>
                              +
                            </button>
                          </div>
                        </div>
                        <div className="input-content-item order-item-price-cont">
                          <div>Price</div>
                          <div
                            className="order-item-price">
                            {totalAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      {skuDiscountAmount > 0 &&
                        <Flex gap={6} className="order-item-discount">
                          <CheckCircleFilled className="checkIcon" />
                          <Typography.Text type="success">Discount applied</Typography.Text>
                        </Flex>
                      }
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="take-orders-summary deskCheckout deskPriceOrder" >
            <div onClick={() => toggleHandler(Number(params?.orderId))}>
              <div className="special-discount">
                <div className="special-disc-offer">
                  <img src={`${process.env.PUBLIC_URL}/bxs_offers.png`} alt="offer" />
                  <span>Request for Special Discount</span>
                </div>
                <div className="special-dcount"><CaretRightOutlined /></div>
              </div>
            </div>
            <div className="full-width-container"></div>
            {
              visitDetails?.storeDetails?.visibilityDiscount?.isActive &&
              <div className="visibility-discount-cont">
                <Checkbox checked={isVisibility} onChange={e => setIsVisibility(e.target.checked)}>Apply Visibility Discount</Checkbox>
              </div>
            }
            <div className="main-item">
              <div>Total Order Amount</div>
              <div>₹{calculatedData.total}</div>
            </div>
            {
              +calculatedData.totalSkuDiscount > 0 &&
              <div className="main-item discountColor">
                <div>SKU discount</div>
                <div>-₹{calculatedData.totalSkuDiscount}</div>
              </div>
            }
            {
          +calculatedData.pieceDiscount > 0 &&
          <div className="main-item discountColor">
            <div>Total Piece Discount</div>
            <div>-₹{calculatedData?.pieceDiscount}</div>
          </div>
        }
            {
              +calculatedData.orderValueDiscount > 0 &&
              <div className="main-item discountColor">
                <div>Order value discount</div>
                <div>-₹{calculatedData.orderValueDiscount}</div>
              </div>
            }
            {
              +calculatedData.flatDiscount > 0 &&
              <div className="main-item discountColor">
                <div>Flat discount</div>
                <div>-₹{calculatedData.flatDiscount}</div>
              </div>
            }
            {
              +calculatedData.visibilityDiscount > 0 &&
              <div className="main-item discountColor">
                <div>Visibility discount</div>
                <div>-₹{calculatedData.visibilityDiscount}</div>
              </div>
            }
            <div className="main-item">
              <div>New Order Amount</div>
              <div>₹{calculatedData.netTotal}</div>
            </div>
            <div
              className="orders-btn">
              <Button onClick={() => navigate(visitDataId ? `/order/order-list/${params?.storeId}/${params?.visitId}/${params?.orderId}`: `/order/form/${params?.storeId}/${null}/${params?.orderId}`)}>Cancel</Button>
               {/* <Button onClick={() => navigate(`/order/form/${params?.storeId}/${null}/${params?.orderId}`)}>Cancel</Button> */}

              <Button
                type="primary"
                onClick={()=>handleSave(OrderStatus.ORDERPLACED)}
                disabled={+calculatedData?.total === 0}>Order Place</Button>
            </div>
          </div>
          <div className="discount-main">
          </div>
        </main>
        <Footer />
      </div>
      <style>
        {`
        .special-discount{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .special-disc-offer{
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .take-orders-checkout{
          background-color: white;
          position: fixed;
          bottom: 58px;
          right: 0;
          left: 0;
          padding-bottom: 10px;
          z-index: 1;
        }
        `}
      </style>
    </>

  );
}
