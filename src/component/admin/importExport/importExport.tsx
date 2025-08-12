// import-export

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal , message} from 'antd';
import './yourStyle.css'; // Import your custom styles here
//import ImportStoreData from 'component/store/importStore';
import ImportProductData from '../product/importProductData';
import ImportUserData from '../users/importUserData';
import ImportVisitData from '../visit/importVisitsData';
import ImportBrandData from '../brand/importBrand';
import ImportProductCategoryData from '../productCategory/importProductCategory';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { exportToExcel } from 'utils/common';

import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';

import { IStoreData } from 'types/Store';
import ExportStoreData from 'page/store/exportStoreData';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { getStoreActions, setStoreCategoryAction } from 'redux-store/action/storeActions';
import { DEFAULT_PAGE_SIZE } from 'app-constants';
import { DurationEnum } from 'enum/common';
import { StoreTypeEnum } from 'enum/store';
import ExportProductData from '../product/exportProductData';
import { getProductBrandActions, getProductCategoryActions, getProductsActions } from 'redux-store/action/productAction';
import { useAuth } from 'context/AuthContext';
import ExportUsersData from '../users/exportUserData';
import { getUsersActions } from 'redux-store/action/usersAction';
import ExportVisitsData from '../visit/exportVisitData';
import useCoordinates from 'hooks/useCoordinates';
import ExportBrandData from '../brand/exportBrandData';
import ExportCategoryData from '../productCategory/exportProductCategory';
import ExportStoreCategoryData from '../storeCategory/exportStoreCategory';
import ExportNoOrder from '../noOrderReason/exportNoOrder';
import { setLoaderAction } from 'redux-store/action/appActions';
import { getAllCollectionsListService, getAllOrdersListService, getCollectionByStoreIdService, getNoOrderService } from 'services/orderService';
import { useLocation, useParams } from 'react-router-dom';
import ExportOrderData from 'component/order/exportOrder';
import { IPagination } from 'types/Common';
import ExportCollectionData from 'page/exportCollection';
import ExportSizeData from '../productSize/exportProductSize';
import { getColourService, getSizeService } from 'services/productService';
import ExportProductColourData from '../productColour/exportProductColour';
import { getVisitsActions } from 'redux-store/action/visitsActions';
import ImportStoreData from '../../../page/store/importExportData';
import ImportStoreCategoryData from '../storeCategory/importStoreCategory';
import ImportNoOrderData from '../noOrderReason/importNoOrder';
import ImportSizeData from '../productSize/importProductSize';
import ImportProductColorData from '../productColour/importProductColour';
import ImportBrand from '../brand/importBrand';
import previousPage from 'utils/previousPage';

const tableData = [
  { key: '1', label: 'Visit' },
  { key: '2', label: 'Stores' },
  { key: '3', label: 'User' },
  { key: '4', label: 'Product' },
  { key: '5', label: 'Product Category' },
  { key: '6', label: 'Store Category' },
  { key: '7', label: 'Product Color' },
  { key: '8', label: 'Product Size' },
];


const ImportAndExport: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <Button onClick={onClick} style={{ margin: 4 }}>
    {label}
  </Button>
);
interface Props {
  onExport?: () => void; // Added this prop to pass the export function
}


const ImportExport: React.FC<Props> = ({ onExport }) => {
  const handleButtonClick = (label: string) => {
    alert(`${label} Button clicked`);
  };
  /*----------------------------------Import Item------------------------------------------*/
  const [isModalOpen, setIsModalOpen] = useState(false);
 // const [isModalOpen, setIsModalOpenCancel] = useState();
  const handleOk = () => {
    console.log("import okey")
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    console.log("import closed")
    setIsModalOpen(false);
    
  };
  // const handleExport = () => {
  //   if (onExport) {
  //     onExport();
  //   } else {
  //     console.warn('Export function not provided');
  //   }
  // };
  // const isLoading = useSelector(state => state.app.isLoading);
  // const { storeList: storeData, totalStoreRecords } = useSelector(state => state.store);
  // const additionalFilters = useSelector(state => state.store.storeFilters);
  const dispatch = useDispatch<AppDispatch>();
  const [startButton, setButtonState] =  useState<string | null>(null);
  function showButton(stateValue: string) {
    setButtonState(stateValue); // Set the state with the passed string value
  }
  /******************************export*************** */
  const [exportButton, setExportButtonState] = useState("");
  function showExportButton(exportValue: string) {
    setExportButtonState(exportValue); // Set the state with the passed string value
  }
  const { storeList: storeData, totalStoreRecords } = useSelector((state:any) => state.store);
  const additionalFilters = useSelector((state:any) => state.store.storeFilters);
  // const dispatch = useDispatch<AppDispatch>();

  const [filters, setFilters] = useState({
    ...additionalFilters,
    storeType: StoreTypeEnum.ALL,
    duration: DurationEnum.ALL
  });
  const [pageNumber, setPageNumber] = useState(1);
  //const [store_data, setStore_data] = useState<IStoreData[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(getStoreActions(filters, { pageSize: DEFAULT_PAGE_SIZE, pageNumber: 1 }));
  }, [filters]);

  useEffect(() => {
    setStore_data(storeData);
  }, [storeData]);
  const [store_data, setStore_data] = useState<IStoreData[]>([]);
  // const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState<IStoreData[]>([]);
  const [currentLabel, setCurrentLabel] = useState('');
  function showModal(){
    setIsExportModalOpen(true);
  };
  

  
  const handleExportOpen = (label: string) => {
    setCurrentLabel(label);
    // Fetch data based on the label (for demonstration, using an empty array)
    // Replace this with actual data fetching logic
    setCurrentData([]); // Set the data you want to export
    setIsExportModalOpen(true);
  };
  const handleExportOk = () => {
    setIsExportModalOpen(false);
    if (exportButton === "Store") {
      handleExport(); // Store export logic
    } else if (exportButton === "Product") {
      exportToExcel(); // Product export logic
    }
   else if (exportButton === "User") {
    exportToUser(); // Product export logic
  }
    else if(exportButton === "Visit"){
      exportVisitData();
    }
    else if(exportButton === "Brand"){
      exportToBrand();
    }
    else if(exportButton ==="Product Category"){
      exportProductCategory();
    }
    else if(exportButton ==="Store Category"){
      exportToStoreCategory();
    }
    else if(exportButton ==="No Order Reason"){
      exportNoOrder();
    }
    else if(exportButton ==="No Order Reason"){
      exportNoOrder();
    }
    else if(exportButton ==="Order"){
      exportOrder();
    }
    else if(exportButton ==="Collection"){
      exportCollection();
    }
    else if(exportButton ==="Product Size"){
      exportProductSize();
    }
    else if(exportButton ==="Product Color"){
      exportProductColor();
    }
    
  };
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(store_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stores');
    XLSX.writeFile(wb, 'stores.xlsx');
    message.success('Stores exported successfully!');
    setIsExportModalOpen(false);
  };
  
  const handleExportCancel = () => {
    setIsExportModalOpen(false);
  };

  /*----------------export product--------*/

  const productData = useSelector((state: any) => state?.product?.productList);
  const productCategoryData = useSelector((state: any) => state?.product?.category);
 
  //const dispatch = useDispatch<AppDispatch>();
  const [productList, setProductList] = useState<any[]>([]);
  const [multiCatList, setMultiCatList] = useState<any[]>([]);

  const { authState } = useAuth();
  useEffect(() => {
    dispatch(getProductsActions({}));
    dispatch(getProductCategoryActions());

  }, []);

  useEffect(() => {
    setProductList(productData);
  }, [productData])
  const exportToExcel = () => {
  const exportData = productList.map((product) => ({
    Product_Name: product.productName,
    Brand: product.brand?.name,
    MRP: product.mrp,
    RLP: product.rlp,
    Category: product.category?.name,
    Case_Qty: product.caseQty,
    Active_Status: product.isActive ? "Active" : "Inactive",
  }));

  const worksheet = XLSX.utils.json_to_sheet(productData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, 'products.xlsx');
  message.success('Product exported successfully!');
  setIsExportModalOpen(false);
};
/*-------------User------------------------------*/
const handleModalOpen = () => {
  setIsExportModalOpen(true);
};

const handleModalClose = () => {
  setIsExportModalOpen(false);
}
const usersData = useSelector((state: any) => state?.users?.usersSSM);
//const dispatch = useDispatch<AppDispatch>();
const [usersList, setUsersList] = useState<any[]>([]);

useEffect(() => {
  dispatch(getUsersActions());
}, [])

useEffect(() => {
  setUsersList(usersData);
}, [usersData])

const exportToUser = () => {
  const worksheet = XLSX.utils.json_to_sheet(usersData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  XLSX.writeFile(workbook, 'UsersData.xlsx');
  message.success('User exported successfully!');
  setIsExportModalOpen(false);
};

/*----------------------------------Export Visit-------------------------------*/
const coordinates = useCoordinates();
//const dispatch = useDispatch<AppDispatch>();
const { data: visitsData, isLoading, completedVisitCount, } = useSelector((state:any) => state.visits);
const [filters1, setFilter] = useState({
  duration: DurationEnum.ALL,
  beat: "",
});

useEffect(() => {
  dispatch(getVisitsActions(filters));
}, []);
const handleDateChange = useCallback((value: any) => {
  setFilter(prev => {
    const newFilters = {
      ...prev,
      duration: value,
      status:""
    }
    dispatch(getVisitsActions(newFilters));
    return newFilters;
  })
}, []);

function exportVisitData(){
  // Convert visitsData to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(visitsData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Visits");

  // Trigger file download
  XLSX.writeFile(workbook, "visits_data.xlsx");
  message.success('Visit exported successfully!');
  setIsExportModalOpen(false);
};
/*--------------------------Export Brand----------------------------------------*/

 const productBrandData = useSelector((state:any) => state?.product?.brand);

  const [productBrand, setProductBrand] = useState<any[]>([]);
  
  
  useEffect(() => {
    dispatch(getProductBrandActions());
  }, []);
  
  useEffect(() => {
    setProductBrand(productBrandData);
  }, [productBrandData])

// Function to export data to Excel
const exportToBrand = () => {
  const worksheet = XLSX.utils.json_to_sheet(productBrandData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Brands');
  XLSX.writeFile(workbook, 'brands_data.xlsx');
  message.success('Brand exported successfully!');
  setIsExportModalOpen(false);
};
/********************Product Category************** */
const [productCategoryName, setProductCategoryName] = useState('');
  const [productCategoryId, setProductCategoryID] = useState('');
  const productCategoryData1 = useSelector((state:any) => state?.product?.category);
  const [productCategoryList, setProductCategoryList] = useState<any[]>([]);
  //const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getProductCategoryActions());
  }, []);

  useEffect(() => {
    setProductCategoryList(productCategoryData1);
  }, [productCategoryData1])

const exportProductCategory = () => {
  const worksheet = XLSX.utils.json_to_sheet(productCategoryList);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
  XLSX.writeFile(workbook, "CategoryData.xlsx");
  message.success('Product Category exported successfully!');
  setIsExportModalOpen(false);
};
/************Export Store Category************* */
const [storeCategoryList, setStoreCategoryList] = useState<any[]>([]);
const storeCategoryData = useSelector((state:any) => state?.store?.storeCategory);
//const dispatch = useDispatch<AppDispatch>();

useEffect(() => {
  dispatch(setStoreCategoryAction());
}, []);

useEffect(() => {
  setStoreCategoryList(storeCategoryData);
}, [storeCategoryData])

const exportToStoreCategory = () => {
  const worksheet = XLSX.utils.json_to_sheet(storeCategoryList);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Store Categories");
  XLSX.writeFile(workbook, "StoreCategories.xlsx");
  message.success('Store Category exported successfully!');
  setIsExportModalOpen(false);
};

/**********************No order********* */

//const [isLoading, setIsLoading] = useState(false);
const location = useLocation();
const searchParams = new URLSearchParams(location?.search);
const [data, setData] = useState<any>([])
const [data1, setData1] = useState<any>([])
const userId: string | null = searchParams.get('userId');
useEffect(() => {
  async function fetchTargetAchievedData() {
      try {
          dispatch(setLoaderAction(true));
         
          const res = await getNoOrderService();
          if (res?.data?.status === 200) {
              setData(res?.data?.data)
              dispatch(setLoaderAction(false));
              //setIsLoading(false)
          }
          //setIsLoading(false)
          dispatch(setLoaderAction(false));
      } catch (error) {
          dispatch(setLoaderAction(false));
         // setIsLoading(false)
      }
  }
  fetchTargetAchievedData();
}, [ userId]);
const exportNoOrder = () => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'No Order Reasons');
  XLSX.writeFile(workbook, 'NoOrderReasons.xlsx');
  message.success('No Order exported successfully!');
  setIsExportModalOpen(false);
};
/**************Order******************** */
const [orderList, setOrderList] = useState<any[]>([]);
  const [cloneOrderList, setCloneOrderList] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  useEffect(() => {
  getOrderList();
}, []);
const getOrderList = async (filter?: any) => {
  try {
    dispatch(setLoaderAction(true));
    const pagination: IPagination = {
      pageNumber: pageNumber,
      pageSize: DEFAULT_PAGE_SIZE
    }
    
    const response = await getAllOrdersListService(filter, pagination);
    dispatch(setLoaderAction(false));
    if (response && response.status === 200) {
      const { orders, pagination } = response.data.data;
      setOrderList(orders);
      setCloneOrderList(orders);
      setTotalRecords(pagination.totalRecords);
    }
  } catch (error) {
    dispatch(setLoaderAction(false));
  }
};
const exportOrder = () => {
    if (!orderList || orderList.length === 0) {
      return;
    }

    const ws = XLSX.utils.json_to_sheet(orderList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders.xlsx');
    message.success('Order exported successfully!');
    setIsExportModalOpen(false);
  };
  /**************************Collection******************* */
  const [collectionList, setCollectionList] = useState<any[]>([]);
  const params = useParams<{ storeId: string }>();
  // const [collectionList, setCollectionList] = useState<any[]>([]);
  const [cloneCollectionList, setCloneCollectionList] = useState<any[]>([]);
  const [percentageTrueValues, setPercentageTrueValues] = useState<number>(0);
 
  useEffect(() => {
    getCollectionList();
  }, []);
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
     //   const percentage: any = calculatePercentageOfTrue(collection);
       // setPercentageTrueValues(percentage);
        setCollectionList(collection);
        setCloneCollectionList(collection);
        // setTotalRecords(pagination.totalRecords);
      }
      } else {
        response = await getAllCollectionsListService(filter, pagination);
        dispatch(setLoaderAction(false));
        if (response && response.status === 200) {
          let { collection, pagination } = response.data.data;
        //  const percentage: any = calculatePercentageOfTrue(collection);
         // setPercentageTrueValues(percentage);
          setCollectionList(collection);
          setCloneCollectionList(collection);
          setTotalRecords(pagination.totalRecords);
        }
      }
      
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
  const exportCollection = () => {
    const ws = XLSX.utils.json_to_sheet(collectionList);  // Use the data received via props
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Collections');
    XLSX.writeFile(wb, 'collections.xlsx');
    message.success('Collections exported successfully!');
  //  handleOk();  // Close modal after export
  setIsExportModalOpen(false);
  };
  /*****************************PRODUCT SIZE*************** */
  const [size, setSize] = useState<any>([])
 const [isLoading1, setIsLoading] = useState(false);
    
  useEffect(() => {
      async function fetchData() {
          try {
              dispatch(setLoaderAction(true));
              setIsLoading(true)
              const res = await getSizeService();
              if (res?.data?.status === 200) {
                  setSize(res?.data?.data)
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
  }, [userId]);
  const exportProductSize = () => {
    const worksheet = XLSX.utils.json_to_sheet(size);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sizes');
    XLSX.writeFile(workbook, 'sizes_data.xlsx');
    message.success('Product Size exported successfully!');
    setIsExportModalOpen(false);
  };
  /**************************Product Color*************** */
  const [color, setColor] = useState<any>([])

  useEffect(() => {
      async function fetchData() {
          try {
              dispatch(setLoaderAction(true));
              setIsLoading(true)
              const res = await getColourService();
              if (res?.data?.status === 200) {
                setColor(res?.data?.data)
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
  }, [userId]);

  const exportProductColor = () => {
    const worksheet = XLSX.utils.json_to_sheet(color);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Colours");
    XLSX.writeFile(workbook, "colours_data.xlsx");
    message.success('Product Color exported successfully!');
    setIsExportModalOpen(false);
  };
  /*----------------------------------Import Item------------------------------------------*/
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Import/Export</h1>
            </header>
            <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Import</th>
            <th>Export</th>
          </tr>
        </thead>
        <tbody>
          <tr>
           
            <td>Store</td>
         
      <td><Button type="primary" onClick={() => {setIsModalOpen(true);showButton("Store")}}>
        Import
      </Button>
      {startButton === "Store" &&  
      <ImportStoreData isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />}
      </td>
     
      <td><Button type="primary" onClick={()=>{showModal();showExportButton("Store")}}>
        Export
      </Button>
      {exportButton==="Store" &&
      // <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
      <Modal
     title={
       
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
       <span style={{ position: 'absolute', left: 0 }}>
         <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
           Export
         </Button>
         <Button onClick={handleExportCancel}>Cancel</Button>
         </span>
            <span>Store</span>
          </div>
     }
     open={isExportModalOpen}
     onCancel={handleExportCancel}
     footer={null} // Remove default footer
   >
      <ExportStoreData
        storeData={store_data}
        isModalOpen={isExportModalOpen}
        handleExportOk={handleExport}
        handleExportCancel={() => setIsExportModalOpen(false)}
      />
      </Modal>
      }
      
             
     </td>
          </tr>
          <tr>
            <td>Product</td>
            <td><Button type="primary" onClick={() => {setIsModalOpen(true);showButton("Product")}}>
        Import
      </Button>
      {startButton==="Product" && <ImportProductData isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />}
      </td>
            
            <td><Button type="primary" onClick={()=>{showModal();showExportButton("Product")}}>
        Export
      </Button>
      {exportButton==="Product" &&
     // <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
     <Modal
     title={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
       <span style={{ position: 'absolute', left: 0 }}>
         <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
           Export
         </Button>
         <Button onClick={handleExportCancel}>Cancel</Button>
         </span>
            <span>Product</span>
          </div>
     }
     open={isExportModalOpen}
     onCancel={handleExportCancel}
     footer={null} // Remove default footer
   >
      <ExportProductData 
        isModalOpen={isExportModalOpen} 
        handleExportOk={exportToExcel}
        handleExportCancel={() => setIsExportModalOpen(false)}
          productList={productList} 
      />
      </Modal>}
      
             
     </td>
          </tr>
         <tr>
           <td>User</td>
            <td><Button type="primary" onClick={() => {setIsModalOpen(true);showButton("User")}}>
        Import
      </Button>
      {startButton==="User" &&  <ImportUserData isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />}
      </td>
      <td><Button type="primary" onClick={()=>{showModal();showExportButton("User")}}>
        Export
      </Button>
      {exportButton==="User" &&
     // <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
     <Modal
     title={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <span style={{ position: 'absolute', left: 0 }}>
        <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
         Export
        </Button>
        <Button onClick={handleExportCancel}>Cancel</Button>
        </span>
           <span>User</span>
         </div>
     }
     open={isExportModalOpen}
     onCancel={handleExportCancel}
     footer={null} // Remove default footer
   >
     <ExportUsersData
      isModalOpen={isExportModalOpen}
      handleExportOk={exportToUser}
      handleExportCancel={handleModalClose}
      usersData={usersList} />
      </Modal>}
      
             
     </td>
          </tr>

          <tr>
           <td>Visit</td>
            <td>
              {/* <Button type="primary" onClick={() => {setIsModalOpen(true);showButton("Visit")}}>
        Import
      </Button> */}
      {startButton==="Visit" &&  <ImportVisitData isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />}
      </td>
      <td> <Button type="primary" onClick={()=>{showModal();showExportButton("Visit")}}>
        Export
      </Button>
      {exportButton === "Visit" &&
      // <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
      <Modal
      title={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 0 }}>
          <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
           Export
          </Button>
          <Button onClick={handleExportCancel}>Cancel</Button>
          </span>
             <span>Visit</span>
           </div>
      }
      open={isExportModalOpen}
      onCancel={handleExportCancel}
      footer={null} // Remove default footer
    >
        <ExportVisitsData 
        isModalOpen={isExportModalOpen} 
        handleExportOk={exportVisitData} 
         handleExportCancel={handleModalClose} 
       
      visitsData={visitsData} />
      </Modal>}
      
     </td>
          </tr>
          <tr>
          <td>Brand</td>
            <td>
            <Button
              type="primary"
              onClick={() => {
                setIsModalOpen(true);showButton("Brand");
              }}
            >
              Import
            </Button>

            {startButton === "Brand" && (
              <ImportBrandData  
              isModalOpen={isModalOpen}
              handleOk={handleOk}
              handleCancel={handleCancel}
              />)}</td>
      <td><Button type="primary" onClick={()=>{showModal();showExportButton("Brand")}}>
        Export
      </Button>
      {exportButton === "Brand" &&
   //   <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
   <Modal
   title={
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
    <span style={{ position: 'absolute', left: 0 }}>
      <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
        Export
      </Button>
      <Button onClick={handleExportCancel}>Cancel</Button>
      </span>
         <span>Brand</span>
       </div>
   }
   open={isExportModalOpen}
   onCancel={handleExportCancel}
   footer={null} // Remove default footer
 >    
   <ExportBrandData 
        isModalOpen={isExportModalOpen} 
        handleExportOk={exportToBrand} 
         handleExportCancel={handleModalClose} 
       
         data={productBrand} />
      </Modal>}
      </td>
          </tr>
          <tr>
          <td>Product Category</td>
            <td><Button type="primary" onClick={() => {setIsModalOpen(true);showButton("Product Category")}}>
        Import
      </Button>
      {startButton==="Product Category" &&    <ImportProductCategoryData isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} /> }
      </td>
       <td><Button type="primary" onClick={()=>{showModal();showExportButton("Product Category")}}>
        Export
      </Button>
      {exportButton === "Product Category" &&
    //  <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
    <Modal
    title={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <span style={{ position: 'absolute', left: 0 }}>
        <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
          Export
        </Button>
        <Button onClick={handleExportCancel}>Cancel</Button>
        </span>
           <span>Product Category</span>
         </div>
    }
    open={isExportModalOpen}
    onCancel={handleExportCancel}
    footer={null} // Remove default footer
  >   
    <ExportCategoryData 
       isModalOpen={isExportModalOpen} 
       handleExportOk={exportProductCategory} 
        handleExportCancel={handleModalClose} 
      
      data={productCategoryList} />
      </Modal>}
      </td>
      
          </tr>
          <tr>
          <td>Store Category</td>
            <td><Button type="primary" onClick={() => {setIsModalOpen(true);showButton("Store Category")}}>
        Import
      </Button>
      {startButton==="Store Category" &&    <ImportStoreCategoryData isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} /> }
      </td>
      <td>
      <Button type="primary" onClick={()=>{showModal();showExportButton("Store Category")}}>
        Export
      </Button>
      {exportButton === "Store Category" &&
     // <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
     <Modal
     title={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <span style={{ position: 'absolute', left: 0 }}>
        <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
          Export
        </Button>
        <Button onClick={handleExportCancel}>Cancel</Button>
        </span>
           <span>Store Category</span>
         </div>
     }
     open={isExportModalOpen}
     onCancel={handleExportCancel}
     footer={null} // Remove default footer
   > 
     <ExportStoreCategoryData
      isModalOpen={isExportModalOpen}
      handleExportOk={exportToStoreCategory}
      handleExportCancel={handleModalClose}
      data={storeCategoryList}/>
      </Modal>}
      </td>
          </tr>
          <tr>
          <td>No Order Reason</td>
            <td><Button type="primary" onClick={() => {setIsModalOpen(true);showButton("No Order Reason")}}>
        Import
      </Button>
      {startButton==="No Order Reason" && <ImportNoOrderData isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} /> }
      </td>
      <td>
      <Button type="primary" onClick={()=>{showModal();showExportButton("No Order Reason")}}>
        Export
      </Button>
      {exportButton === "No Order Reason" &&
    //  <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
    <Modal
    title={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <span style={{ position: 'absolute', left: 0 }}>
        <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
          Export
        </Button>
        <Button onClick={handleExportCancel}>Cancel</Button>
        </span>
           <span>No Order Reason</span>
         </div>
    }
    open={isExportModalOpen}
    onCancel={handleExportCancel}
    footer={null} // Remove default footer
  >    
    <ExportNoOrder 
            isModalOpen={isExportModalOpen} 
            handleExportOk={exportNoOrder} 
             handleExportCancel={handleModalClose} 
           
            data={data} />
      </Modal>}
      </td>
          </tr>
          <tr>
           <td>Order</td>
            <td></td>
      <td><Button type="primary" onClick={()=>{showModal();showExportButton("Order")}}>
        Export
      </Button>
      {exportButton==="Order" &&
    //  <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
    <Modal
    title={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <span style={{ position: 'absolute', left: 0 }}>
        <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
          Export
        </Button>
        <Button onClick={handleExportCancel}>Cancel</Button>
        </span>
           <span>Order</span>
         </div>
    }
    open={isExportModalOpen}
    onCancel={handleExportCancel}
    footer={null} // Remove default footer
  >
<ExportOrderData
       isModalOpen={isExportModalOpen} 
       handleExportOk={exportOrder} 
        handleExportCancel={handleModalClose} 
      
       orderList={orderList} />
      </Modal>}
      
             
     </td>
          </tr>
          <tr>
          <td>Collection</td>
            <td> </td>
      <td>
      <Button type="primary" onClick={()=>{showModal();showExportButton("Collection")}}>
        Export
      </Button>
      {exportButton === "Collection" &&
    //  <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
    <Modal
    title={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <span style={{ position: 'absolute', left: 0 }}>
        <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
          Export
        </Button>
        <Button onClick={handleExportCancel}>Cancel</Button>
        </span>
           <span>Collection</span>
         </div>
    }
    open={isExportModalOpen}
    onCancel={handleExportCancel}
    footer={null} // Remove default footer
  >
          <ExportCollectionData 
        isModalOpen={isExportModalOpen}
        handleExportOk={exportCollection}
        handleExportCancel={() => setIsExportModalOpen(false)}
        collectionList={collectionList}  // Pass the collection list as props
      />
      </Modal>}
      </td>
          </tr>
         
          <tr>
          <td>Product Size</td>
            <td><Button type="primary" onClick={() => {setIsModalOpen(true);showButton("Product Size")}}>
        Import
      </Button>
      {startButton==="Product Size" && <ImportSizeData isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} /> }
      </td>
      <td>
      <Button type="primary" onClick={()=>{showModal();showExportButton("Product Size")}}>
        Export
      </Button>
      {exportButton === "Product Size" &&
     // <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
     <Modal
     title={
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
         <span style={{ position: 'absolute', left: 0 }}>
           <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
             Export
           </Button>
           <Button onClick={handleExportCancel}>Cancel</Button>
         </span>
         <span>Product Size</span>
       </div>
     }
     open={isExportModalOpen}
     onCancel={handleExportCancel}
     footer={null} // Remove default footer
   >
     <ExportSizeData data={size}
             isModalOpen={isExportModalOpen}
             handleExportOk={exportProductSize}
             handleExportCancel={handleModalClose} />
      </Modal>}
      </td>
          </tr>
          {/* <tr>
          <td>Product Size</td>
            <td><Button type="primary" onClick={() => {setIsModalOpen(true);showButton("Product Size")}}>
        Import
      </Button>
      {startButton==="Product Size" && <ImportProductCategoryData isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} /> }
      </td>
      <td>
      <Button type="primary" onClick={()=>{showModal();showExportButton("Product Size")}}>
        Export
      </Button>
      {exportButton === "Product Size" &&
      <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
         <ExportNoOrder 
            isModalOpen={isExportModalOpen} 
            handleExportOk={exportNoOrder} 
             handleExportCancel={handleModalClose} 
           
            data={data} />
      </Modal>}
      </td>
          </tr> */}
          {/* <tr>
          <td>Product Color</td>
            <td><Button type="primary" onClick={() => {setIsModalOpen(true);showButton("Product Color")}}>
        Import
      </Button>
      {startButton==="Product Color" && <ImportProductColorData isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} /> }
      </td>
      <td>
      <Button type="primary" onClick={()=>{showModal();showExportButton("Product Color")}}>
        Export
      </Button> */}
      {/* {exportButton === "Product Color" &&
    //  <Modal title="Basic Modal" open={isExportModalOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
    <Modal
    title={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
         <span style={{ position: 'absolute', left: 0 }}>
           <Button type="primary" onClick={handleExportOk} style={{ marginRight: '10px' }}>
             Export
           </Button>
           <Button onClick={handleExportCancel}>Cancel</Button>
         </span>
         <span>Product Color</span>
       </div>
    }
    open={isExportModalOpen}
    onCancel={handleExportCancel}
    footer={null} // Remove default footer
  >   
    <ExportProductColourData
             isModalOpen={isExportModalOpen}
             handleExportOk={exportProductColor}
             handleExportCancel={handleModalClose}
            
            data={color} />
      </Modal>}
      </td>
          </tr> */}
          
        </tbody>
      </table>
      
    </div>
    </div>
    
  );
};

export default ImportExport;
// css
/* yourStyles.css */
