import {
  ArrowLeftOutlined,
  CrownOutlined,
  FilterOutlined,
  FormOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  getStoreActions,
  loadMoreStoreActions,
} from "../../redux-store/action/storeActions";
import { useSelector } from "../../redux-store/reducer";
import { AppDispatch } from "../../redux-store/store";
import { IStoreData } from "types/Store";
import { StoreTypeEnum } from "enum/store";
import { DurationEnum, UserRole } from "enum/common";
import "../../style/stores.css";
import previousPage from "utils/previousPage";
import { DEFAULT_PAGE_SIZE, DEFAULT_STORE_PAGE_SIZE } from "app-constants";
import LoadMore from "component/LoadMore";
import DeleteItem from "component/admin/common/deleteItem";
import { deleteStoreService } from "services/storeService";
import { debounce } from "utils/common";
import { useAuth } from "context/AuthContext";

function Store() {
  const isLoading = useSelector((state) => state.app.isLoading);
  const { storeList: storeData, totalStoreRecords } = useSelector(
    (state) => state.store
  );
  const additionalFilters = useSelector((state) => state.store.storeFilters);
  const { authState } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const newStore: string | null = searchParams.get("newStore");
  const [filters, setFilters] = useState({
    ...additionalFilters,
    storeType: newStore ? StoreTypeEnum.NEW : StoreTypeEnum.ALL,
    duration: newStore ? DurationEnum.TODAY : DurationEnum.ALL,
  });
  const [pageNumber, setPageNumber] = useState(1);

  const [store_data, setStore_data] = useState<IStoreData[]>([]);

  useEffect(() => {
    dispatch(
      getStoreActions(filters, {
        pageSize: DEFAULT_STORE_PAGE_SIZE,
        pageNumber: 1,
      })
    );
  }, [filters]);

  useEffect(() => {
    setStore_data(storeData);
  }, [storeData]);

  const handleChange = (key: any, value: any) => {
    setFilters((prev: any) => {
      const newFilters = {
        ...prev,
        [key]: value,
        beatId: null,
        storeCat: null,
        isUnbilled: null,
      };
      return newFilters;
    });
  };
  const [searchValue, setSearchValue] = useState("");

  const debouncedSetFilters = useCallback(
    debounce((value: any) => {
      setFilters((prev: any) => ({
        ...prev,
        storeSearch: value,
        beatId: null,
        storeCat: null,
        isUnbilled: null,
      }));
    }, 600),
    []
  );

  const handleSearchInputChange = (event: any) => {
    const value = event?.target?.value;
    setSearchValue(value);
    debouncedSetFilters(value);
  };
  const searchStore = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    const searchTerm = value.toLowerCase();
    const FS = storeData.filter(
      (item: any) => {
        return (
          (item.storeId && (item?.storeId).toString().includes(value)) ||
          (item.storeName &&
            item?.storeName?.toLowerCase().includes(searchTerm)) ||
          (item.storeCat &&
            item?.storeCat?.categoryName.toLowerCase().includes(searchTerm))
        );
      }
      // (item?.orderId).toString().includes(value)
    );
    setStore_data(FS);
  };

  const handleLoadMore = useCallback(async () => {
    try {
      const newPageNumber = pageNumber + 1;
      await dispatch(
        loadMoreStoreActions(filters, {
          pageNumber: newPageNumber,
          pageSize: DEFAULT_STORE_PAGE_SIZE,
        })
      );
      setPageNumber(newPageNumber);
    } catch (error) {}
  }, [pageNumber, filters, dispatch, searchValue]);

  const [toggleDelete, setToggleDelete] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeIds, setStoreID] = useState("");
  const toggleHandler = (storeId: any, storeName: string) => {
    setToggleDelete(true);
    setStoreID(storeId);
    setStoreName(storeName);
  };

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);
  return (
    <div className="store-v1 storeBgC">
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }} >
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Doctor/Chemist/Stockist</h1>
      </header> 
      {/* <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Doctor/Chemist/Stockiest</h1>
      </header> */}
      {authState?.user?.role !== UserRole.CHANNEL && (
        <Link to="/stores/add-store">
          <div className="addIcon">
            <PlusOutlined className="plusIcon" />
          </div>
        </Link>
      )}
      <main>
        {isMobile && (
          <div className="storeHeader" style={{ paddingBottom: "10px" }}>
            <Link to="/stores/stores-filter" className="linkto">
              <div className="filterdiv">
                <span className="storeSelect">
                  <FilterOutlined className="mt-4" /> Filter
                </span>
              </div>
            </Link>
            <div className="filterdiv">
              <Select
                defaultValue="all"
                value={filters.storeType}
                className="pl-18 w-130"
                onChange={(val) => handleChange("storeType", val)}
                options={[
                  { value: StoreTypeEnum.ALL, label: "All" },
                  { value: StoreTypeEnum.NEW, label: "New" },
                ]}
              />
            </div>
          </div>
        )}
        <div className="search" >
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search Store by Name, Category, Id"
            value={searchValue}
            onChange={handleSearchInputChange}
          
          />
          {!isMobile && (
            <>
              <Link to="/stores/stores-filter" className="linkto">
                <div className="filterdiv">
                  <span
                    className="storeSelect"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      paddingRight: "10px",
                    }}
                  >
                    <FilterOutlined /> Filter
                  </span>
                </div>
              </Link>
              <div className="filterdiv">
                <Select
                  defaultValue="all"
                  value={filters.storeType}
                  className=" w-130"
                  onChange={(val) => handleChange("storeType", val)}
                  options={[
                    { value: StoreTypeEnum.ALL, label: "All" },
                    { value: StoreTypeEnum.NEW, label: "New" },
                  ]}
                />
              </div>
              <Select
                defaultValue="all"
                className="w-176"
                value={filters.duration}
                onChange={(val) => handleChange("duration", val)}
                options={[
                  { value: DurationEnum.ALL, label: "All" },
                  { value: DurationEnum.TODAY, label: "Today" },
                  { value: DurationEnum.WEEK, label: "Week" },
                ]}
              />
            </>
          )}
        </div>
        <DeleteItem
          toggle={toggleDelete}
          name={storeName}
          itemsId={storeIds}
          deleteService={deleteStoreService}
          closeModal={(e: any) => {
            setToggleDelete(e);
          }}
        />
        <div
          className="content"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "24px",
            marginBottom: "10px",
          }}
        >
          {store_data &&
            store_data.length > 0 &&
            store_data.map((item, index) => {
              return (
                <div className="store-list" key={index}>
                  <div className="shoptitle">
                    <Link
                      to={
                        item?.storeCat?.categoryName
                          ?.toLowerCase()
                          ?.includes("doctor")
                          ? `/stores/doctor-details?store_id=${item?.storeId}`
                          : item?.storeCat?.categoryName
                              ?.toLowerCase()
                              ?.includes("chemist")
                          ? `/stores/chemist-details?store_id=${item?.storeId}`
                          : item?.storeCat?.categoryName
                              ?.toLowerCase()
                              ?.includes("stockist") // New condition for stockiest
                          ? `/stores/stockiest-details?store_id=${item?.storeId}`
                          : `/stores/store-details?store_id=${item?.storeId}`
                      }
                      className="linktoB"
                    >
                      <div className="fontb">{item?.storeName}</div>
                    </Link>

                    <Link
                      to={
                        item?.storeCat?.categoryName
                          ?.toLowerCase()
                          ?.includes("doctor")
                          ? `/stores/doctor-details?store_id=${item?.storeId}`
                          : item?.storeCat?.categoryName
                              ?.toLowerCase()
                              ?.includes("chemist")
                          ? `/stores/chemist-details?store_id=${item?.storeId}`
                          : item?.storeCat?.categoryName
                              ?.toLowerCase()
                              ?.includes("stockist") // New condition for stockiest
                          ? `/stores/stockiest-details?store_id=${item?.storeId}`
                          : `/stores/store-details?store_id=${item?.storeId}`
                      }
                      className="linktoB"
                    >
                      {/* <div className="fontb">{item?.storeName}</div> */}
                    </Link>
                    {authState?.user?.role !== UserRole.CHANNEL && (
                      <span>
                        <Link
                          to={`/stores/add-store?storeId=${item?.storeId}`}
                          className="linkDefault"
                        >
                          <FormOutlined style={{ fontSize: "14px" }} />
                        </Link>
                      </span>
                    )}
                  </div>
                  <Link
                   to={
                    item?.storeCat?.categoryName
                      ?.toLowerCase()
                      ?.includes("doctor")
                      ? `/stores/doctor-details?store_id=${item?.storeId}`
                      : item?.storeCat?.categoryName
                          ?.toLowerCase()
                          ?.includes("chemist")
                      ? `/stores/chemist-details?store_id=${item?.storeId}`
                      : item?.storeCat?.categoryName
                          ?.toLowerCase()
                          ?.includes("stockist") // New condition for stockiest
                      ? `/stores/stockiest-details?store_id=${item?.storeId}`
                      : `/stores/store-details?store_id=${item?.storeId}`
                  }
                    className="linktoB"
                  >
                    <div className="storeConlist">
                      <div>
                        <div className="storeIdTxt">
                          {item?.storeCat?.categoryName} | store ID:{" "}
                          {item?.storeId}
                        </div>
                        <div className="flexSpace storeAddTxt">
                          <span>
                            {item?.addressLine1}, {item?.addressLine2},{" "}
                            {item?.state}
                          </span>
                        </div>
                      </div>

                      {item?.isPremiumStore && (
                        <div className="premiumtag">
                          <div className="bli">
                            <CrownOutlined className="crownIcon" />
                          </div>
                          <span className="premiumText">Premium</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
        {totalStoreRecords > 0 && store_data.length < totalStoreRecords && (
          <LoadMore isLoading={isLoading} onClick={handleLoadMore} />
        )}
      </main>
    </div>
  );
}

export default Store;
