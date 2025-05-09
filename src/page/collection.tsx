import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider, Input, Progress, Select, Skeleton } from "antd";
import { CollectionStatus } from "enum/collection";
import { DurationEnum, UserRole } from "enum/common";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { setLoaderAction } from "redux-store/action/appActions";
import { AppDispatch } from "redux-store/store";
import { getAllCollectionsListService, getCollectionByStoreIdService } from "services/orderService";
import previousPage from "utils/previousPage";
import Footer from "../component/common/footer";
import { DEFAULT_PAGE_SIZE } from "app-constants";
import { IPagination } from "types/Common";
import LoadMore from "component/LoadMore";
import { useAuth } from "context/AuthContext";

export default function Collection() {
  const params = useParams<{ storeId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [collectionList, setCollectionList] = useState<any[]>([]);
  const [cloneCollectionList, setCloneCollectionList] = useState<any[]>([]);
  const [percentageTrueValues, setPercentageTrueValues] = useState<number>(0);
  const [filter, setFilter] = useState({
    status: DurationEnum.ALL
  });
 console.log({collectionList})
  useEffect(() => {
    getCollectionList();
  }, []);

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  function calculatePercentageOfTrue(list: any[]) {
    if (list && list?.length > 0) {
      const trueCount = list?.filter(obj => (obj?.status)?.toUpperCase() === 'PAID')?.length;
      const totalCount = list?.length;
      const percentageTrue: number = (trueCount / totalCount) * 100;
      return isNaN(percentageTrue) ? 0 : percentageTrue.toFixed(2);
    }
  }

  const getCollectionList = async (filter?: any) => {
    try {
      dispatch(setLoaderAction(true));
      let response: any | null = [];
      const pagination: IPagination = {
        pageNumber: pageNumber,
        pageSize: DEFAULT_PAGE_SIZE
      }
      if (params && params?.storeId) {
        response = await getCollectionByStoreIdService(filter, params?.storeId);
        dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let collection = response?.data?.data;
        const percentage: any = calculatePercentageOfTrue(collection);
        setPercentageTrueValues(percentage);
        setCollectionList(collection);
        setCloneCollectionList(collection);
        // setTotalRecords(pagination.totalRecords);
      }
      } else {
        response = await getAllCollectionsListService(filter, pagination);
        dispatch(setLoaderAction(false));
        if (response && response.status === 200) {
          let { collection, pagination } = response.data.data;
          const percentage: any = calculatePercentageOfTrue(collection);
          setPercentageTrueValues(percentage);
          setCollectionList(collection);
          setCloneCollectionList(collection);
          setTotalRecords(pagination.totalRecords);
        }
      }
      
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  const handleChange = (value: any) => {
    setFilter(prev => {
      const newFilters = {
        ...prev,
        status: value
      }
      getCollectionList(newFilters)
      return newFilters
    })
  };

  const search = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = cloneCollectionList?.filter((item: any) =>
      (item?.storeName?.toLowerCase())?.includes(value.toLowerCase())
    );
    setCollectionList(FS);
  };

  const getCollectionInsightInfo = useMemo(() => {
    const completedCollectionCount = collectionList?.filter(i => i.status === CollectionStatus.PAID).length;
    const totalCollection = collectionList?.length;
    const completedCollectionPercentage = Number(((completedCollectionCount / totalCollection) * 100).toFixed(2)) || 0
    return {
      completedCollectionCount,
      totalCollection,
      completedCollectionPercentage
    }
  }, [collectionList]);
  // const { authState } = useAuth();
  
  // const [orderList, setOrderList] = useState<any[]>([]);
  // const [cloneCollectionList, setCloneCollectionList] = useState<any[]>([]);
  const isLoading = useSelector((state:any) => state.app.isLoading);
  const handleLoadMore = useCallback(async () => {
    try {
      dispatch(setLoaderAction(true));
      const newPageNumber = pageNumber + 1;
      const pagination: IPagination = {
        pageNumber: newPageNumber,
        pageSize: DEFAULT_PAGE_SIZE
      }
      const response = await getAllCollectionsListService(filter, pagination);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        const { collection, pagination } = response?.data?.data;
        const newOrder = [
          ...collectionList,
          ...collection
        ]
        setCollectionList(newOrder);
        setCloneCollectionList(newOrder);
        setTotalRecords(pagination.totalRecords);
        setPageNumber(newPageNumber);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  }, [dispatch, filter, collectionList, pageNumber]);
  let skeleton: any=[{},{},{},{},{},{},{},{},{},{},{},{}]
  const {authState} = useAuth();

  const handleCheckboxChange = (orderId: string, isChecked: boolean) => {
    if (isChecked ) {
      setSelectedOrderIds([...selectedOrderIds, orderId]);
    } else {
      setSelectedOrderIds(selectedOrderIds.filter(id => id !== orderId));
    }
  };
  return (
    <div className="store-v1">
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{authState?.user?.role === UserRole.RETAILER ? "Payment": "Collection"}</h1>
      </header>
      <div className="search">
        <Input prefix={<SearchOutlined />} placeholder={authState?.user?.role === UserRole.RETAILER ? "Search Payment":"Search Collection"} onChange={search} />
        <Select
          defaultValue={'ALL'}
          className="w-176"
          value={filter?.status}
          onChange={handleChange}
          options={[
            { value: DurationEnum.ALL, label: 'All' },
            { value: 'PAID', label: 'Paid' },
            { value: 'PENDING', label: 'Pending' }
          ]}
        />
      </div>

      <div className="collecProg">
        <ConfigProvider
          theme={{
            components: {
              Progress: {
                remainingColor: "#e61b23",
              },
            },
          }}
        >
          <Progress
            percent={getCollectionInsightInfo.completedCollectionPercentage}
            size={["100%", 18]}
            strokeColor="green"
            showInfo={false}
            className="fontb" />
        </ConfigProvider>
        {
          getCollectionInsightInfo.totalCollection > 0 &&
          <div className="progress-count-cont">
            <span className="progress-count-count">
              {getCollectionInsightInfo.completedCollectionCount}/{getCollectionInsightInfo.totalCollection}
            </span>
            <span className="progress-count-perc">({getCollectionInsightInfo.completedCollectionPercentage}%)</span>
          </div>
        }
      </div>
   
      <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "2px", marginBottom: "0px" }}>
        {
          
          collectionList && collectionList?.length > 0 && 
          collectionList?.map((item, index) => {
            const pendingAmount = item?.netAmount - item?.totalCollectedAmount;
            return (
              <div key={`collect_${index}`}>
                <div className="shoptitle" style={{marginTop:'0px'}}>
                  
               
                  <div>
                    </div>
                    <div>
                    {/* <Checkbox 
                     className="rounded-checkbox"
                     checked={selectedOrderIds.includes(item.orderId)}
                     onChange={(e) => handleCheckboxChange(item.orderId, e.target.checked)}
                     disabled={item?.status.toUpperCase()==='PAID'}
                     /> */}
                  </div>
                  </div>
                <Link
                 to={authState?.user?.role === UserRole.CHANNEL ? "#" : `/visit/collect-payment?order_id=${item?.orderId}`}
                 className="linktoB" style={{cursor: authState?.user?.role === UserRole.CHANNEL ? "normal": "pointer"}}>
                     
                  <div className="store-list">
              
                    <div className="shoptitle">
                      <div className="mb-10 linktoB fw-bold">
                        {item?.storeName}
                      </div>
                      <div
                        className={(item?.status).toUpperCase() === 'PAID' ? "activetagC" : "inActivetag"}
                        style={{ background: (item?.status).toUpperCase() === 'PAID' ? "#2DB83D" : "#e61b23" }}
                      >
                        <span className="color-wht">{item?.status}</span>
                      </div>
                    </div>
                    <div className="fs-13">{item?.storeType} | Store ID: <span className="fw-bold">{item?.storeId}</span></div>
                    <div className="fs-13">Order ID: <span className="fw-bold">{item?.orderId}</span></div>
                    <div className="collecAmountTxt">
                      <div className="flexSpace fs-13">
                        <span>Amount: <span className="fw-bold">{item?.netAmount}</span></span>
                      </div>
                      {
                        item?.status.toUpperCase() === 'PENDING' && (
                          <div>Pending Amount: <span className="fw-bold">{pendingAmount.toFixed(2)}</span></div>
                        )
                      }
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
         
         }
      </div>
      {
          totalRecords > 0 && collectionList?.length < totalRecords && 
            <LoadMore isLoading={isLoading} onClick={handleLoadMore} />
          }
            <div style={{display:'flex',justifyContent:'end',alignItems:'center',marginRight:'10px',marginBottom:'-10px',marginTop:'0px'}}>
            <Link to={selectedOrderIds.length > 0 ? `/visit/collect-payment?order_id=${selectedOrderIds.join(',')}` : '#'}>
             <Button 
            type="primary" 
            disabled={selectedOrderIds.length === 0} 
            className="proceed-button"
             >
      {selectedOrderIds.length > 0 ? `Proceed to Payment (${selectedOrderIds.length} selected)` : 'Proceed to Payment'}
    </Button> 
  </Link>
   
     </div>
      <Footer />
        <style>
          {
          `
          .content {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60;
          }
          `
          }
        </style>
    </div>
  );
}
