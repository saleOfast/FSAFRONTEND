import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Flex, Input, Select, Space, Typography, message } from "antd";
import { getProductsService } from "services/productService";
import { ICheckoutItem, IOrderItem } from "types/Product";
import { ICreateOrderReq } from "types/Order";
import { useDispatch } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { useSelector } from "redux-store/reducer";
import { createOrderService, getOrderSummaryByOrderIdService } from "services/orderService";
import { getValidationErrors } from "utils/errorEvaluation";
import { DiscountTypeEnum } from "enum/product";
import { IVisitsData } from "types/Visits";
import { getVisitsByVisitIdService } from "services/visitsService";
import { OrderStatus } from "enum/order";
import { ArrowLeftOutlined, CheckCircleFilled } from "@ant-design/icons";
import "../style/orderList.css";
import previousPage from "utils/previousPage";
import { handleImageError } from "utils/common";
import { useAuth } from "context/AuthContext";
import FullPageLoaderWithState from "component/FullPageLoaderWithState";
import { getStoresByEmpIdService } from "services/usersSerivce";
import { UserRole, VisitTypeEnum } from "enum/common";
import { capitalizeSubstring } from "utils/capitalize";
import { getStoreByIdService } from "services/storeService";
export default function OrderList() {
  const {authState} = useAuth();

  const productBrandList = useSelector((state: any) => [{ label: "All Brand", value: "" }, ...state.product.brand.map((i: any) => ({ label: i.name, value: i.brandId }))])
  const productCategoryList = useSelector((state: any) => [{ label: "All Category", value: "" }, ...state.product.category.map((i: any) => ({ label: i.name, value: i.productCategoryId }))])
  const selectTypeData:any = [
...( authState?.user?.role === UserRole.RETAILER ?   [{ label: "Retailor Order", value: VisitTypeEnum.RETAILER_ORDER }]: [{ label: "Visit Order", value: VisitTypeEnum.PHYSICAL }, { label: "Phone Order", value: VisitTypeEnum.TELEVISIT }])
  ] 
  const [storeData, setStoreData] = useState<any[]>([]);
  const orderStoreList = [
    ...(Array.isArray(storeData) 
      ? storeData.map((i: any) => ({
          label: capitalizeSubstring(i.storename), 
          value: i.storeid
        }))
      : []
    ),
  ];
  
  const callTypeList = [  ...selectTypeData?.map((i: any) => ({ label: i.label, value: i.value })) ]
  const [isLoading, setIsLoading] = useState(false);

  
// console.log({storeData, orderStoreList})
  useEffect(() => {
    async function getStoresData() {
      try {
        if (authState?.user?.id) {
          setIsLoading(true);
          const res = await getStoresByEmpIdService(authState?.user?.id);
          setStoreData(res?.data?.data)
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getStoresData();
  }, [authState?.user?.id])
 
  const [orderItems, setOrderItems] = useState<any[]>([]);
  let [visitDetails, setVisitDetails] = useState<IVisitsData | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [isVisibility, setIsVisibility] = useState(false);
  let [selectedStore, setSelectedStore] = useState<any>();
  let [selectedVisitType, setSelectedVisitType] = useState<any>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params: any = useParams<{ visitId: string, storeId: string }>();

  const sortByActive = (a: any, b: any, key: string) => {
    if (!a[key] && b[key]) {
      return 1;
    } else if (a[key] && !b[key]) {
      return -1;
    }
    return 0;
  };
  const filteredProductList = useMemo(() => {
    let filteredResult:any = orderItems;
    if (searchText.length > 0) {
      filteredResult = orderItems.filter(i => i.productName?.toLowerCase()?.includes(searchText.toLowerCase()));
    }
    if (selectedBrand) {
      filteredResult = filteredResult.filter((i:any) => i.brandId === +selectedBrand);
    }
    if (selectedCategory) {
      filteredResult = filteredResult.filter((i:any) => i.categoryId === +selectedCategory);
    }
    return filteredResult

  }, [orderItems, searchText, selectedBrand, selectedCategory])

  async function getOrderSummaryData() {
    try {
      if (params.orderId) {
        dispatch(setLoaderAction(true));
        const res = await getOrderSummaryByOrderIdService(params?.orderId);
        dispatch(setLoaderAction(false));
        if (res.data.data.products) {
          setOrderItems(res.data.data.products
            .map((item:any) => {
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

  // const handleProductList = async () => {
  //   dispatch(setLoaderAction(true));
  //   try {
  //     const response = await getProductsService({ isActive: true });
  //     dispatch(setLoaderAction(false));
  //     setOrderItems((pre: any) => [
  //       ...pre, // Spread the already set items from the summary API
  //       ...response.data.data // Add new product list data
  //         .sort((a, b) => sortByActive(a, b, "isFocused"))
  //         .map(item => ({
  //           ...item,
  //           noOfCase: 0, // Initialize fields for new items
  //           noOfPiece: 0,
  //           skuDiscountAmount: 0,
  //           netAmount: 0,
  //           totalAmount: 0
  //         }))
  //     ]);
  //     // setOrderItems((pre:any)=> ...pre, ...response.data.data
  //     //   .sort((a, b) => sortByActive(a, b, "isFocused"))
  //     //   .map(item => ({
  //     //     ...item,
  //     //     noOfCase: 0,
  //     //     noOfPiece: 0,
  //     //     skuDiscountAmount: 0,
  //     //     netAmount: 0,
  //     //     totalAmount: 0
  //     //   })));
  //   } catch (error: any) {
  //     dispatch(setLoaderAction(false));
  //   }
  // };
  const handleProductList = async () => {
    dispatch(setLoaderAction(true));
  
    try {
      const response = await getProductsService({ isActive: true });
      dispatch(setLoaderAction(false));
  
      setOrderItems((prev: any) => {
        // Create a map of the previous items by productId for easy lookup
        const prevItemsMap = new Map(prev.map((item: any) => [item.productId, item]));
  
        // Merge the new products with the existing summary items
        const mergedItems = response.data.data
          .sort((a, b) => sortByActive(a, b, "isFocused"))
          .map(item => {
            const existingItem:any = prevItemsMap.get(item.productId); // Check if the product exists in summary
  
            return existingItem
              ? { // If the product exists in the summary data, override with the summary values
                  ...item,
                  noOfCase: existingItem?.noOfCase, // Use updated noOfCase from summary
                  noOfPiece: existingItem?.noOfPiece, // Use updated noOfPiece from summary
                  skuDiscountAmount: existingItem?.skuDiscountAmount, // Updated fields
                  netAmount: existingItem?.netAmount,
                  totalAmount: existingItem?.totalAmount,
                }
              : { // Otherwise, initialize new product fields
                  ...item,
                  noOfCase: 0,
                  noOfPiece: 0,
                  skuDiscountAmount: 0,
                  netAmount: 0,
                  totalAmount: 0,
                };
          });
        return mergedItems;
      });
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      console.error("Error fetching product list:", error);
    }
  };
  
  const handleVisitDetails = useCallback(async () => {
    try {
      if (params.visitId) {
        const res = await getVisitsByVisitIdService(+params.visitId)
        setVisitDetails(res.data.data);
      }
    } catch (error) {

    }
  }, [params.visitId]);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        await handleVisitDetails();  // Assuming it's async
        await getOrderSummaryData(); // Ensures summary data is fetched first
        await handleProductList();   // Fetch product list after summary data
      } catch (error) {
        console.error("Error loading order details:", error);
      }
    };
  
    // if (params.orderId) { // Ensure the orderId is present before making API calls
      loadOrderDetails();
    // }
  
  }, []);
  


  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
  };
 const [selectedStoreData, setSelectedStoreData] = useState<any>();
  const handleStoreChange = async (value: string) => {
    setSelectedStore(value);
    try {
      dispatch(setLoaderAction(true));
      const response = await getStoreByIdService(value);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        setSelectedStoreData(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
  
 
  const handleVisitTypeChange = (value: VisitTypeEnum) => {
    setSelectedVisitType(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };
  useEffect(() => {
    if (!params?.visitId) {
      const data: any = {
        storeDetails: selectedStoreData
      };
      
      setVisitDetails(data); // This will only be called when `params` changes
    }
  }, [params, selectedStoreData]);
  // console.log(">>>>",{visitDetails, selectedStoreData} )
  const getUpdatedAmount = (orderItem: IOrderItem) => {
    const totalNoOfPiece = orderItem?.noOfPiece + (orderItem?.caseQty * orderItem?.noOfCase);
    const RlpAmount = orderItem?.rlp * totalNoOfPiece;
    let totalAmount = RlpAmount
    let discountedAmount = 0;
    if (!visitDetails?.storeDetails?.isPremiumStore && orderItem?.skuDiscount && orderItem?.skuDiscount?.isActive) {
      if (orderItem?.skuDiscount?.discountType === DiscountTypeEnum.PERCENTAGE) {
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

  // let [netTotalAmount, setNetTotalAmount] = useState<any>()
  // useEffect(() => {
  //   setNetTotalAmount(netTotalAmount)
  // }, [netTotalAmount]);
//  console.log({netTotalAmount})
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
    // setNetTotalAmount(total)
     // Order value discount
     let netTotal = total;
     if (totalSkuDiscount > 0) {
       netTotal = netTotal - totalSkuDiscount;
     }
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
  //  console.log({netTotalAmount})
    // Premium store Flat discount
    if (orderValueDiscount > 0) {
      netTotal = netTotal - orderValueDiscount;
    }
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
    return {
      total: total.toFixed(2),
      totalSkuDiscount: totalSkuDiscount.toFixed(2),
      flatDiscount: flatDiscount.toFixed(2),
      visibilityDiscount: visibilityDiscount.toFixed(2),
      orderValueDiscount: orderValueDiscount.toFixed(2),
      netTotal: netTotal.toFixed(2),
    };
  }, [orderItems, visitDetails?.storeDetails, isVisibility]);

function errorHandle(){
  if (!params?.visitId) {
    if (!selectedStore || !selectedVisitType) {
      message.warning("Please Select Store and Visit Type");
    } 
  }
}
  const handleSave = useCallback(async (orderStatus: OrderStatus) => {
   
    errorHandle();
    if ((params?.visitId && params?.storeId ) || ( selectedStore && selectedVisitType) ) {
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
                // rlp: getUpdatedAmount(i).totalAmount,
                rlp: i.rlp,
                noOfCase: i.noOfCase,
                noOfPiece: i.noOfPiece,
                skuDiscount: i?.skuDiscount as any || undefined,
                isFocused: i.isFocused || false,
                caseQty: i.caseQty,
              }
            }),
          visitId: +params.visitId ? +params.visitId : null,
          storeId: selectedStore ? +selectedStore : +params.storeId,
          isCallType: selectedVisitType ?? VisitTypeEnum.PHYSICAL,
          orderStatus: orderStatus,
          netAmount: +calculatedData.netTotal,
          isVisibility,
          // pieceDiscount
        }
        if (params?.orderId) {
          requestBody.orderId = +params?.orderId
        }
        const res = await createOrderService(requestBody)
        if (res.data.status === 200) {
          message.success(res.data.message)
          dispatch(setLoaderAction(false));
          navigate({ pathname: `/order/checkout/${selectedStore  ?? params.storeId}/${params.visitId}/${params.orderId ?? res.data.data.orderId}` })
        } else {
          dispatch(setLoaderAction(false));
          message.error(res.data.message)
        }
      } catch (error) {
        dispatch(setLoaderAction(false));
        message.error(getValidationErrors(error))
      }
    }
  }, [calculatedData.netTotal, calculatedData.total, dispatch, isVisibility, navigate, orderItems, params.storeId, params.visitId, selectedStore, selectedVisitType]);
  return (
    <div className="">
      <FullPageLoaderWithState isLoading={isLoading} />
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
          <ArrowLeftOutlined onClick={previousPage} className="back-button" />
          <h1 className="page-title pr-18">Take Order</h1>
        </header>
      <main>
        <div className="orderSearch">
          <Input
            type="search"
            placeholder="Search items"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="searchContainer"
          />
          {/* <Button
            type="primary"
            onClick={() => navigate({ pathname: "/schemes" })}>
            Schemes
          </Button> */}
        </div>

       <div className="selection-line">
          <div className="brand">
            <Space>
              <Select
                value={selectedBrand}
                className="selectFiltBtn"
                onChange={handleBrandChange}
                options={productBrandList}

              />
            </Space>
          </div>

          <div className="category">
            <Space>
              <Select
                value={selectedCategory}
                className="selectFiltBtn"
                onChange={handleCategoryChange}
                options={productCategoryList}
              />
            </Space>
          </div>
        </div>
        
        {!params.visitId && <div className="selection-line">
          <div className="brand">
        
              <Select
                value={selectedStore}
                className="selectFiltBtn"
                onChange={handleStoreChange}
                options={orderStoreList}
                placeholder="Select Store"
                
              />
          </div>

          <div className="category">
              <Select
                value={selectedVisitType}
                className="selectFiltBtn"
                onChange={handleVisitTypeChange}
                options={callTypeList}
                placeholder="Select Visit Type"
                aria-required 
              />
          </div>
        </div>}
        {filteredProductList?.length > 0 && (
          <Fragment>
            <div className="take-order-list content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px", marginBottom: "10px",  }}>
              {filteredProductList?.map((data:any) => {
                const { productName, caseQty, mrp, rlp, totalAmount, noOfPiece, noOfCase, productId, skuDiscountAmount, isFocused, image } = data;
                const RlpAmount = mrp - (mrp * rlp) / 100;

                return (
                  <div className="order-container" key={productId} style={{width:"300px", margin: 0}}>
                    {isFocused &&
                      <div className="order-focused-item">
                        <CheckCircleFilled
                          className='checkIcon'
                        />
                        <span>Focused Item</span>
                      </div>
                    }
                    <div className="order-headline">
                      <div style={{ flexDirection: "column", display: "flex" }}>
                        <span
                          className="order-title" style={{ fontSize: "18px", fontWeight: "bold" }}>
                          {productName}
                        </span>
                        <div>
                          MRP: <span className="font-weight-bold">₹{mrp}</span>
                        </div>
                      </div>
                      <div style={{ flexDirection: "column", display: "flex" }}>
                        <span className="order-title">
                          Case Qty:{caseQty}
                        </span>
                        <div>
                          RLP: <span className="font-weight-bold">
                            ₹{rlp || RlpAmount}
                          </span>
                        </div>
                      </div>

                      {image ?
                        <img src={image} alt="product img" width={60} height={60}
                          onError={handleImageError} />

                        // <img src={"/noImg2.png"} alt="product img" width={60} height={60}/>
                        :
                        <img src={"https://school.cistercian.org/wp-content/uploads/connections-images/barnabas-robertson/no-image-available.jpg"} alt="product img" width={60} height={60} />
                      }
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
                              className="quantity-input quantity-input-icon"
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
                            className="quantity-input quantity-input-icon"
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
                        <CheckCircleFilled className="orderCheckCol" />
                        <Typography.Text type="success">Discount applied</Typography.Text>
                      </Flex>
                    }
                  </div>
                )
              })}
            </div>
          </Fragment>
        )}
        <div className="take-orders-summary deskPriceOrder" style={{background:"#fbfbfb"}} >
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
          <div className="main-item" style={{borderTop:"1px solid #ddd",paddingTop:"10px"}}>
            <div>New Order Amount</div>
            <div>₹{calculatedData.netTotal}</div>
          </div>
          <div
            className="orders-btn">
            <Button onClick={() => navigate(-1)}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => handleSave(OrderStatus.ORDERSAVED)}
              disabled={+calculatedData?.total === 0}>Save</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
