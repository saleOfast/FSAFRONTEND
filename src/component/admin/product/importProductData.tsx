//Product import

import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Modal, Upload } from 'antd';
import { handleImageError } from 'utils/common';
import { AppDispatch } from 'redux-store/store';
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { uploadFileToS3 } from 'utils/uploadS3';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrderSignedUrlService } from 'services/orderService';
import { addProductService, CreateProductRequestService, getProductByIdService, updateProductService } from 'services/productService';
import { DiscountType } from 'enum/common';
/*---------------------------------------------------------------*/
import * as XLSX from 'xlsx'; // Import the xlsx library
import { getProductBrandActions, getProductCategoryActions } from 'redux-store/action/productAction';
import { string } from 'yup';

const { Dragger } = Upload;

function ImportProductData({ isModalOpen, handleOk, handleCancel }: any) {
  const [jsonData, setJsonData] = useState<any[]>([]); // State to store the JSON data
  const [fileList, setFileList] = useState<any[]>([]); // 
  const dispatch = useDispatch<AppDispatch>();
  const redirect = useNavigate();
  const [unsavedProducts, setUnsavedProducts] = useState<any[]>([]);
  interface ISkuDiscount {
    discountType: DiscountType,
    value: number,
    isActive: boolean
  }
  const productBrandList = useSelector((state: any) => state.product.brand)
  const productCategoryList = useSelector((state: any) => state.product.category)
  console.log("productCategoryList", productCategoryList)
  const mapCategoriesToCascaderOptions = (categories: any[]): any[] => {
    const map: { [key: number]: any } = {};

    categories.forEach(category => {
      map[category.productCategoryId] = {
        value: category.productCategoryId,
        label: category.name,
        children: [],
      };
    });

    categories.forEach(category => {
      if (category.parentId !== null) {
        const parent = map[category.parentId];
        if (parent) {
          parent.children?.push(map[category.productCategoryId]);
        }
      }
    });

    return Object.values(map).filter(option => !categories.some(cat => cat.productCategoryId === option.value && cat.parentId !== null));
  };
  const options: any[] = mapCategoriesToCascaderOptions(productCategoryList ?? []);

  useEffect(() => {
    dispatch(getProductBrandActions());
    dispatch(getProductCategoryActions())
  }, [])
  const [isDiscountActiveValue, setIsDiscountActiveValue] = useState<boolean>(false)
  /**********************download templete***************/


  const downloadTemplate = () => {
    // Define the headers for the template
    const headers = [
      'Product Name *', 'Brand *', 'Category *', 'MRP *', 'RLP *',
      'Case Quantity *', 'Product status *', 'Discount Type',
      'Discount Value', 'Discount Active', 'Image', 'IsFocused'
    ];

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    // Generate Excel file and download it
    XLSX.writeFile(workbook, 'ProductImportTemplate.xlsx');
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0]; // Read the first sheet
      const worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet to JSON with default values
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
      console.log(jsonData, "Parsed JSON Data");

      const brandMap = productBrandList.reduce((acc: any, curr: any) => {
        acc[curr.name] = curr.brandId;
        return acc;
      }, {});
      
      const categoryMap = productCategoryList.reduce((acc: any, curr: any) => {
        acc[curr.name] = curr.productCategoryId;
        return acc;
      }, {});

      const mappedData = jsonData.map((row: any) => {
        return {
          productName: row['Product Name *'],
          brandId: brandMap[row['Brand *']] || null,
          brandName: row['Brand *'] || null,
          categoryId: categoryMap[row['Category *']],
          categoryName: row['Category *'] || null,
          mrp: parseFloat(row['MRP *']) || 0,
          rlp: parseFloat(row['RLP *']) || 0,
          caseQty: parseInt(row['Case Quantity *'], 10) || 0,
          isActive: row['Product status *']?.toLowerCase() === 'active',
          discountType: row['Discount Type'] || 'PERCENTAGE',
          discountValue: parseFloat(row['Discount Value']) || 0,
          isDiscountActive: row['Discount Active']?.toLowerCase() === 'yes',
          image: row['Image'] ? row['Image'].replace(/\\/g, '/') : '',
          isFocused: row['IsFocused']?.toString().toLowerCase() === 'true'
        };
      });

      console.log(mappedData, "Formatted Data");
      setJsonData(mappedData); // Store the mapped data in the state
    };
    reader.readAsArrayBuffer(file);
  };

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isExcel) {
        message.error(`${file.name} is not an Excel file.`);
      }
      setFileList([]);
      return isExcel || Upload.LIST_IGNORE;
    },
    customRequest: ({ file }) => {
      handleFile(file as File); // Call the handleFile function when the file is uploaded
    },
    onChange(info) {
      const { status } = info.file;
      setFileList(info.fileList);
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file processed successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file processing failed.`);
      }
    },
    fileList: fileList,
  };

  /*---------------------------------After submit---------------------------------------------*/

  const [productImg, setProductImg] = useState<any>("")
  async function handleFileChange(event: any) {
    setProductImg(event.target.files[0])
  }
  const handleExportUnsavedProducts = (unsavedProducts: any[]) => {
    if (unsavedProducts.length === 0) return; // Don't run if no unsaved brands

    const worksheet = XLSX.utils.json_to_sheet(unsavedProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unsaved Product");

    // Download the file
    XLSX.writeFile(workbook, "unsaved_product.xlsx");
  };

  async function onSubmit() {
    try {
      dispatch(setLoaderAction(true));
      let formData: any = []
      for (const values of jsonData) {  // Iterate over jsonData array containing multiple products
        const { productName, mrp, rlp, brandId, categoryId, caseQty, isFocused, isActive, discountType, discountValue, isDiscountActive, image } = values;

        // Create SKU Discount object
        const skuDiscount: ISkuDiscount = {
          discountType: discountType || DiscountType.PERCENTAGE, // Handle missing values with a default
          isActive: isDiscountActive || false,
          value: Number(discountValue || 0)
        };

        // Handle image upload if necessary
        // let productImgRes = null;
        // if (productImg?.name) {
        //     productImgRes = await getOrderSignedUrlService(productImg.name);
        //    console.log(productImg.name,"----------------------")
        //     await uploadFileToS3(productImgRes.data.data, productImg);
        // }

        // let productImgRes = await getOrderSignedUrlService(productImg?.name);
        // handleFileChange(productImgRes)  
        
        const daata = {
          productName,
          mrp: Number(mrp),
          rlp: Number(rlp),
          brandId: Number(brandId),
          categoryId: Number(categoryId),
          caseQty: Number(caseQty),
          skuDiscount: skuDiscount,
          isFocused: isFocused,
          isActive: Boolean(isActive),
          // image: productImgRes ? productImgRes.data.data.fileUrl : image // Use image from Excel if no new image is uploaded
          image: image,
        }
        // Create the product request with the processed data
        formData.push(daata)
      }
      const response = await CreateProductRequestService(
        formData
      );

      // Handle success response for each product
      if (response) {
        message.success(response?.data?.message || `Product added successfully`, 4);

        const unsavedProducts = response.data.data?.unsavedProducts || [];
        const successfulProductCount = response.data.data2?.successfulProductCount;
        // message.success(successfulProductCount+` Products added successfully`);
        // Automatically export unsaved brands if there are one or more
        if (unsavedProducts.length > 0) {
          handleExportUnsavedProducts(unsavedProducts);
        }
      }
      else {
        message.error("Something Went Wrong");
      }
      // Final cleanup after all products are processed
      dispatch(setLoaderAction(false));
      redirect("/admin/product");
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      message.error(error?.response?.data?.message || "Error occurred while processing products");
    }
  }




  /*------------------------------------------------------------------------------*/
  return (
    <>
      {/* <Modal title="Import Data" open={isModalOpen} onOk={()=>{handleOk();onSubmit()}}  onCancel={() => {
        handleCancel();
        setJsonData([]); // Clear JSON data on Cancel
        setFileList([]);
      }}> */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0 }}>
              <Button type="primary" onClick={() => { handleOk(); onSubmit() }} style={{ marginRight: '10px' }}>
                OK
              </Button>
              <Button onClick={() => {
                handleCancel();
                setJsonData([]);
                setFileList([]);
              }}>Cancel</Button>
            </span>
            <span>Product</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
          setJsonData([]);
          setFileList([]);
        }}
        footer={null} // Remove default footer
      >
        <h4>Kindly follow these instructions to import data:</h4>

        <ul>
          <li>Download the template by clicking the "Download Template" button.
            <Button type="primary" onClick={downloadTemplate}>
              Download Template
            </Button>
          </li>
          <li>Fill out the "Name" column in the downloaded Excel file.</li>
          <li>Drag and drop the updated excel sheet here.

            <Dragger {...props} accept=".xlsx"> {/* Accept only Excel files */}
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag Excel file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for uploading Excel files (.xlsx). The file will be converted to JSON data.
              </p>
            </Dragger>


            {/* /*---------------------------------------------------*/}
            <div className="content" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
              {jsonData && setJsonData?.length > 0 &&
                jsonData?.map((data, index) => {
                  const { productName, productId, brandName, mrp, rlp, categoryName, caseQty, isActive, image, brandId } = data;
                  return (
                    <div className='orderContainer' key={index}>
                      <div className='ordHeadline'>
                        <span className='ordertitle'>{productName}</span>
                        <div className={isActive ? "activetag" : "inActivetag"} style={{ margin: "0 0px 10px 0px" }}>
                          <span
                            className={isActive ? "blinker" : "blinker-inActive"}>
                          </span>
                          <span>{isActive ? "Active" : "Inactive"}</span>
                        </div>
                        {/* {authState?.user?.role === UserRole.ADMIN && <span className='ordertitle'>
                      <Link to={`/admin/product/add-new-product?productId=${productId}`} className='linkDefault'>
                        <FormOutlined style={{ fontSize: "14px" }} />
                      </Link>
                      <DeleteOutlined onClick={() => toggleHandler(productId, productName)} className="deleteIcon" style={{ fontSize: "14px", paddingLeft: "10px" }} />
                    </span>} */}
                      </div>
                      <div className='orderList'>
                        <div className='title'>
                          <div className='mrpPrice'>
                            <div>
                              <div>
                                <span>Brand: <span className='fbold'>{brandName}</span></span>
                              </div>
                              <span>MRP: <span className='fbold'>₹ {mrp}</span></span>
                            </div>
                            <div>
                              <span>RLP: <span className='fbold'>₹ {rlp}</span></span>
                            </div>
                          </div>
                        </div>
                        <div className='title'>
                          <div className='mrpPrice'>
                            <div>
                              <div>
                                <span>Category: <span className='fbold'>{categoryName}</span></span>
                              </div>
                              <span>SKU ID: <span className='fbold'>{productId}</span></span>
                            </div>
                            <div>
                              <span>Case Qty: <span className='fbold'>{caseQty}</span></span>
                            </div>
                          </div>
                        </div>
                        <div className='title fxbtm'>
                          <img src={image} alt="productImg" width={60} height={60}
                            onError={handleImageError} />
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </li>
        </ul>
        {/* /*---------------------------------------------------*/}
      </Modal>
    </>
  );
}

export default ImportProductData;


