import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  CrownOutlined,
  FilterOutlined,
  FormOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  ControlOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Input, Select, Table, Modal, Checkbox, message } from "antd";
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
  
  // Load gridView preference from localStorage or default to false (List view)
  const getDefaultGridView = () => {
    const saved = localStorage.getItem('storePageGridView');
    if (saved !== null) {
      return saved === 'true';
    }
    return false; // Default to list view
  };
  
  const [gridView, setGridView] = useState(getDefaultGridView());
  
  // Available fields configuration - All fields from Add Customer form
  const availableFields = [
    { 
      key: 'storeId', 
      label: 'StoreId', 
      render: (item: IStoreData) => (
        <Link to={`/stores/store-details?store_id=${item?.storeId}`} style={{ textDecoration: 'none', color: '#1890ff', cursor: 'pointer' }}>
          {item?.storeId}
        </Link>
      ),
      gridRender: (item: IStoreData) => `Store ID: ${item?.storeId}`
    },
    { 
      key: 'storeName', 
      label: 'Customer Name', 
      render: (item: IStoreData) => (
        <Link to={`/stores/store-details?store_id=${item?.storeId}`} style={{ textDecoration: 'none', color: 'black' }}>
          {item?.storeName}
        </Link>
      ),
      gridRender: (item: IStoreData) => item?.storeName
    },
    { 
      key: 'storeType', 
      label: 'Customer Type', 
      render: (item: IStoreData) => item?.storeCat?.categoryName || '-',
      gridRender: (item: IStoreData) => item?.storeCat?.categoryName || '-'
    },
    { 
      key: 'uid', 
      label: 'GST/UID', 
      render: (item: IStoreData) => (item as any)?.uid || '-',
      gridRender: (item: IStoreData) => (item as any)?.uid || '-'
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (item: IStoreData) => item?.isActive ? 'Active' : 'Inactive',
      gridRender: (item: IStoreData) => item?.isActive ? 'Active' : 'Inactive'
    },
    { 
      key: 'customerCategory', 
      label: 'Customer Category', 
      render: (item: IStoreData) => (item as any)?.customerCategory || '-',
      gridRender: (item: IStoreData) => (item as any)?.customerCategory || '-'
    },
    { 
      key: 'preferredProducts', 
      label: 'Preferred Products', 
      render: (item: IStoreData) => (item as any)?.preferredProducts || '-',
      gridRender: (item: IStoreData) => (item as any)?.preferredProducts || '-'
    },
    { 
      key: 'panNumber', 
      label: 'PAN Number', 
      render: (item: IStoreData) => (item as any)?.panNumber || '-',
      gridRender: (item: IStoreData) => (item as any)?.panNumber || '-'
    },
    { 
      key: 'paymentTerms', 
      label: 'Payment Terms', 
      render: (item: IStoreData) => (item as any)?.paymentTerms || '-',
      gridRender: (item: IStoreData) => (item as any)?.paymentTerms || '-'
    },
    { 
      key: 'paymentMode', 
      label: 'Payment Mode', 
      render: (item: IStoreData) => (item as any)?.paymentMode || '-',
      gridRender: (item: IStoreData) => (item as any)?.paymentMode || '-'
    },
    { 
      key: 'ownerName', 
      label: 'Owner Name', 
      render: (item: IStoreData) => item?.ownerName,
      gridRender: (item: IStoreData) => `Owner: ${item?.ownerName}`
    },
    { 
      key: 'qualification', 
      label: 'Qualification', 
      render: (item: IStoreData) => (item as any)?.qualification || '-',
      gridRender: (item: IStoreData) => (item as any)?.qualification || '-'
    },
    { 
      key: 'speciality', 
      label: 'Speciality', 
      render: (item: IStoreData) => (item as any)?.speciality || '-',
      gridRender: (item: IStoreData) => (item as any)?.speciality || '-'
    },
    { 
      key: 'mobileNumber', 
      label: 'Phone Number', 
      render: (item: IStoreData) => item?.mobileNumber,
      gridRender: (item: IStoreData) => `Mobile: ${item?.mobileNumber}`
    },
    { 
      key: 'alterMobile', 
      label: 'Alternate Phone No', 
      render: (item: IStoreData) => item?.alterMobile || '-',
      gridRender: (item: IStoreData) => item?.alterMobile || '-'
    },
    { 
      key: 'email', 
      label: 'Email', 
      render: (item: IStoreData) => item?.email,
      gridRender: (item: IStoreData) => `Email: ${item?.email}`
    },
    { 
      key: 'dob', 
      label: 'Date of birth', 
      render: (item: IStoreData) => (item as any)?.dob || '-',
      gridRender: (item: IStoreData) => (item as any)?.dob || '-'
    },
    { 
      key: 'registrationNo', 
      label: 'Registration number', 
      render: (item: IStoreData) => (item as any)?.registrationNo || '-',
      gridRender: (item: IStoreData) => (item as any)?.registrationNo || '-'
    },
    { 
      key: 'clinicname', 
      label: 'Clinic Name', 
      render: (item: IStoreData) => (item as any)?.clinicname || '-',
      gridRender: (item: IStoreData) => (item as any)?.clinicname || '-'
    },
    { 
      key: 'patientVolume', 
      label: 'Patient Volume', 
      render: (item: IStoreData) => (item as any)?.patientVolume || '-',
      gridRender: (item: IStoreData) => (item as any)?.patientVolume || '-'
    },
    { 
      key: 'addressLine1', 
      label: 'Address Line 1', 
      render: (item: IStoreData) => item?.addressLine1,
      gridRender: (item: IStoreData) => item?.addressLine1
    },
    { 
      key: 'addressLine2', 
      label: 'Address Line 2', 
      render: (item: IStoreData) => item?.addressLine2 || '-',
      gridRender: (item: IStoreData) => item?.addressLine2 || '-'
    },
    { 
      key: 'townCity', 
      label: 'Town/City', 
      render: (item: IStoreData) => item?.townCity,
      gridRender: (item: IStoreData) => item?.townCity
    },
    { 
      key: 'state', 
      label: 'State', 
      render: (item: IStoreData) => item?.state,
      gridRender: (item: IStoreData) => item?.state
    },
    { 
      key: 'district', 
      label: 'District', 
      render: (item: IStoreData) => item?.district || '-',
      gridRender: (item: IStoreData) => item?.district || '-'
    },
    { 
      key: 'pinCode', 
      label: 'Pincode', 
      render: (item: IStoreData) => item?.pinCode,
      gridRender: (item: IStoreData) => `Pin: ${item?.pinCode}`
    },
    { 
      key: 'openingTime', 
      label: 'Opening Time', 
      render: (item: IStoreData) => item?.openingTime || '-',
      gridRender: (item: IStoreData) => item?.openingTime || '-'
    },
    { 
      key: 'closingTime', 
      label: 'Closing Time', 
      render: (item: IStoreData) => item?.closingTime || '-',
      gridRender: (item: IStoreData) => item?.closingTime || '-'
    },
    { 
      key: 'isPremiumStore', 
      label: 'Premium Store', 
      render: (item: IStoreData) => item?.isPremiumStore ? <CrownOutlined /> : "-",
      gridRender: (item: IStoreData) => item?.isPremiumStore
    },
  ];

  // Load visible fields from localStorage or use default
  const getDefaultVisibleFields = () => {
    const saved = localStorage.getItem('storePageVisibleFields');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['storeId', 'storeName', 'ownerName', 'address', 'city', 'isPremiumStore'];
      }
    }
    return ['storeId', 'storeName', 'ownerName', 'address', 'city', 'isPremiumStore'];
  };

  const [visibleFields, setVisibleFields] = useState<string[]>(getDefaultVisibleFields());
  const [tempVisibleFields, setTempVisibleFields] = useState<string[]>([]); // Temporary state for modal
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [fieldSearchValue, setFieldSearchValue] = useState("");

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

  // Save visible fields to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('storePageVisibleFields', JSON.stringify(visibleFields));
  }, [visibleFields]);

  // Initialize tempVisibleFields when modal opens
  useEffect(() => {
    if (isFieldModalOpen) {
      setTempVisibleFields(visibleFields);
    }
  }, [isFieldModalOpen, visibleFields]);

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
    } catch (error) { }
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

  const handleGridView = () => {
    setGridView(true);
    localStorage.setItem('storePageGridView', 'true');
  }
  const handleListView = () => {
    setGridView(false);
    localStorage.setItem('storePageGridView', 'false');
  };

  const handleFieldToggle = (fieldKey: string) => {
    if (tempVisibleFields.includes(fieldKey)) {
      // Remove field
      if (tempVisibleFields.length <= 1) {
        message.warning('At least one field must be visible');
        return;
      }
      setTempVisibleFields(tempVisibleFields.filter(key => key !== fieldKey));
    } else {
      // Add field
      if (tempVisibleFields.length >= 10) {
        message.warning('Maximum 10 fields allowed');
        return;
      }
      setTempVisibleFields([...tempVisibleFields, fieldKey]);
    }
  };

  const handleSaveFields = () => {
    setVisibleFields(tempVisibleFields);
    localStorage.setItem('storePageVisibleFields', JSON.stringify(tempVisibleFields));
    setIsFieldModalOpen(false);
    setFieldSearchValue("");
    message.success('Fields updated successfully');
  };

  const getFieldByKey = (key: string) => {
    return availableFields.find(f => f.key === key) || null;
  };

  // Filter fields based on search
  const filteredFields = availableFields.filter(field => 
    field.label.toLowerCase().includes(fieldSearchValue.toLowerCase())
  );
  return (
    <div >
    <header
            className="heading heading-container"
            style={{ backgroundColor: '#8488BF' }}
          >
            <ArrowLeftOutlined onClick={previousPage} className="back-button" />
            <h1 className="page-title pr-18">Customer</h1>
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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <AppstoreOutlined style={{ fontSize: '15px' }} onClick={handleGridView} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginRight: '10px' }}>
              <UnorderedListOutlined style={{ fontSize: '15px' }} onClick={handleListView} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginRight: '10px' }}>
              <ControlOutlined style={{ fontSize: '15px' }} onClick={() => setIsFieldModalOpen(true)} title="Manage Fields" />
            </div>
          </div>
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
        {
          gridView ? (
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
                  // Get visible fields for grid view
                  const showStoreId = visibleFields.includes('storeId');
                  const showCategory = item?.storeCat?.categoryName;
                  const showAddress = visibleFields.includes('address') || visibleFields.includes('city') || visibleFields.includes('state');
                  const showPremium = item?.isPremiumStore; // Always show premium badge if store is premium

                  return (
                    <div key={index}>
                      <Link to={`/stores/store-details?store_id=${item?.storeId}`} className="no-underline">
                        <div className="store-list">
                          <div className="shoptitle">
                            <div className="fontb">{item?.storeName}</div>
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

                          <div className="storeConlist">
                            <div>
                              {(showCategory || showStoreId) && (
                                <div className="storeIdTxt">
                                  {showCategory && item?.storeCat?.categoryName}
                                  {showCategory && showStoreId && " | "}
                                  {showStoreId && `store ID: ${item?.storeId}`}
                                </div>
                              )}
                              {showAddress && (
                                <div className="flexSpace storeAddTxt">
                                  <span>
                                    {visibleFields.includes('address') && item?.addressLine1}
                                    {visibleFields.includes('address') && (visibleFields.includes('city') || visibleFields.includes('state')) && ", "}
                                    {visibleFields.includes('city') && item?.townCity}
                                    {visibleFields.includes('city') && visibleFields.includes('state') && ", "}
                                    {visibleFields.includes('state') && item?.state}
                                  </span>
                                </div>
                              )}
                              {visibleFields.includes('ownerName') && (
                                <div className="storeIdTxt" style={{ marginTop: '4px' }}>
                                  Owner: {item?.ownerName}
                                </div>
                              )}
                              {visibleFields.includes('email') && item?.email && (
                                <div className="storeIdTxt" style={{ marginTop: '4px' }}>
                                  Email: {item?.email}
                                </div>
                              )}
                              {visibleFields.includes('mobileNumber') && item?.mobileNumber && (
                                <div className="storeIdTxt" style={{ marginTop: '4px' }}>
                                  Mobile: {item?.mobileNumber}
                                </div>
                              )}
                              {visibleFields.includes('pinCode') && item?.pinCode && (
                                <div className="storeIdTxt" style={{ marginTop: '4px' }}>
                                  Pin: {item?.pinCode}
                                </div>
                              )}
                            </div>

                            {showPremium && (
                              <div className="premiumtag">
                                <div className="bli">
                                  <CrownOutlined className="crownIcon" />
                                </div>
                                <span className="premiumText">Premium</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
            </div>) : (
            <table className="store-table" style={{ textDecoration: 'none', fontSize: '13px' }}>
              <thead>
                <tr>
                  {visibleFields.map(fieldKey => {
                    const field = getFieldByKey(fieldKey);
                    return field ? <th key={fieldKey}>{field.label}</th> : null;
                  })}
                  {authState?.user?.role !== UserRole.CHANNEL && <th>Edit</th>}
                </tr>
              </thead>
              <tbody >
                {store_data?.map((item, index) => (
                  <tr key={index}>
                    {visibleFields.map(fieldKey => {
                      const field = getFieldByKey(fieldKey);
                      return field ? <td key={fieldKey}>{field.render(item)}</td> : null;
                    })}
                    {authState?.user?.role !== UserRole.CHANNEL && (
                      <td>
                        <Link to={`/stores/add-store?storeId=${item?.storeId}`}>
                          <FormOutlined />
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

          )
        }

        {totalStoreRecords > 0 && store_data.length < totalStoreRecords && (
          <LoadMore isLoading={isLoading} onClick={handleLoadMore} />
        )}
      </main>

      {/* Field Management Modal */}
      <Modal
        title="Manage Table Fields"
        open={isFieldModalOpen}
        onOk={handleSaveFields}
        onCancel={() => {
          setIsFieldModalOpen(false);
          setFieldSearchValue("");
          setTempVisibleFields(visibleFields); // Reset to original values
        }}
        okText="Save"
        cancelText="Cancel"
        width={500}
      >
        <div style={{ marginBottom: '16px' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search fields by name..."
            value={fieldSearchValue}
            onChange={(e) => setFieldSearchValue(e.target.value)}
            allowClear
            style={{ marginBottom: '12px' }}
          />
          <span style={{ color: '#666', fontSize: '13px' }}>
            Select fields to display in the table (Maximum 10 fields)
          </span>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filteredFields.length > 0 ? (
            filteredFields.map(field => (
              <div
                key={field.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                }}
                onClick={() => handleFieldToggle(field.key)}
              >
                <Checkbox
                  checked={tempVisibleFields.includes(field.key)}
                  onChange={() => handleFieldToggle(field.key)}
                  disabled={tempVisibleFields.length >= 10 && !tempVisibleFields.includes(field.key)}
                >
                  {field.label}
                </Checkbox>
                {tempVisibleFields.includes(field.key) && tempVisibleFields.length > 1 && (
                  <CloseOutlined
                    style={{ color: '#ff4d4f', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFieldToggle(field.key);
                    }}
                  />
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              No fields found matching "{fieldSearchValue}"
            </div>
          )}
        </div>
        <div style={{ marginTop: '16px', color: '#999', fontSize: '12px' }}>
          Currently showing {tempVisibleFields.length} of {availableFields.length} fields
        </div>
      </Modal>
    </div>
  );
}

export default Store;
