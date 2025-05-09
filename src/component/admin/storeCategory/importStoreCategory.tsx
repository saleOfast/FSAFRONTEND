import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Modal, Table, Upload } from "antd";
import { dateFormatterNew, handleImageError } from "utils/common";
import { AppDispatch } from "redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "../../../redux-store/action/appActions";
import { uploadFileToS3 } from "utils/uploadS3";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrderSignedUrlService } from "services/orderService";
import {
  addProductService,
  CreateProductRequestService,
  getProductByIdService,
  updateProductService,
} from "services/productService";
import { DiscountType } from "enum/common";
import { saveAs } from "file-saver";
/*---------------------------------------------------------------*/

import * as XLSX from "xlsx"; // Import the xlsx library
import { capitalizeSubstring } from "utils/capitalize";
import {
  addStoreCategoryImportService,
  addStoreCategoryService,
} from "services/storeService";

const { Dragger } = Upload;

function ImportStoreCategoryData({ isModalOpen, handleOk, handleCancel }: any) {
  const [jsonData, setJsonData] = useState<any[]>([]); // State to store the JSON data
  const [fileList, setFileList] = useState<any[]>([]); //
  const dispatch = useDispatch<AppDispatch>();
  const redirect = useNavigate();
  const [unsavedStoreCategorys, setUnsavedStoreCategorys] = useState<any[]>([]);
  const columns: any = [
    // {
    //   title: 'Category Id',
    //   dataIndex: 'storeCatId',
    //   key: 'storeCatId',
    //   fixed:"left",
    //   width: 80,
    //   // render: (text) => <a>{text}</a>,
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 160,
    },
    // {
    //   title: 'Created Date',
    //   dataIndex: 'date',
    //   key: 'date',
    //   width: 80,

    // },
    // {
    //   title: '',
    //   dataIndex: 'edit',
    //   key: 'edit',
    //   width: 40,

    //   render: (text: any, record: any) => {
    //     return <Link to={`/admin/store/add-update-category?categoryId=${record?.storeCatId}`}><EditOutlined /></Link>;
    //  },
    // },
    // {
    //   title: '',
    //   dataIndex: 'delete',
    //   key: 'delete',
    //   width: 40,

    //   render: (text: any, record: any) => {
    //     return <Link to="#" onClick={() => toggleHandler(record?.storeCatId, record?.name)} style={{color:"red"}}><DeleteOutlined /></Link>;
    //  },
    // },
  ];
  interface ISkuDiscount {
    discountType: DiscountType;
    value: number;
    isActive: boolean;
  }
  const [isDiscountActiveValue, setIsDiscountActiveValue] =
    useState<boolean>(false);
  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [["Store Category Name*"]]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Store Categories");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "StoreCategoryTemplate.xlsx"); // This will download the file
  };

  // Function to convert Excel to JSON
  // const handleFile = (file: File) => {
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const convertedJson = XLSX.utils.sheet_to_json(worksheet);
  //     setJsonData(convertedJson); // Save the JSON data to state
  //   };
  //   reader.readAsArrayBuffer(file);
  // };
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const convertedJson = XLSX.utils.sheet_to_json(worksheet);

      // Validate the 'Store Category Name*' field for all rows
      const columnNames = convertedJson.map(
        (item: any) => item["Store Category Name*"]
      );

      const isValid = convertedJson.every(
        (item: any) =>
          item["Store Category Name*"] &&
          item["Store Category Name*"].trim() !== ""
      );

      if (!isValid) {
        message.error(
          "The 'Store Category Name*' column contains empty values. Please correct the Excel file."
        );
        setJsonData([]); // Clear JSON data
        return;
      }

      // Map the data to the required structure
      // const mappedData = columnNames.map((item: any) => ({
      //   name: item['Store Category Name*'],
      // }));
      const mappedData = columnNames.map((categoryName: string) => ({
        categoryName,
      }));
      setJsonData(mappedData); // Save the valid JSON data to state
    };
    reader.readAsArrayBuffer(file);
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
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
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file processed successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file processing failed.`);
      }
    },
    fileList: fileList,
  };
  /*---------------------------------After submit---------------------------------------------*/
  const handleExportUnsavedStoreCategorys = (unsavedStoreCategorys: any[]) => {
    if (unsavedStoreCategorys.length === 0) return; // Don't run if no unsaved brands

    const worksheet = XLSX.utils.json_to_sheet(unsavedStoreCategorys);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Un saved Store Categorys"
    );

    // Download the file
    XLSX.writeFile(workbook, "unsavedStoreCategorys.xlsx");
  };

  async function onSubmit() {
    try {
      dispatch(setLoaderAction(true));

      if (jsonData.length === 0) {
        message.error("No data to submit.");
        dispatch(setLoaderAction(false));
        return;
      }
      let formData: any = [];
      for (const values of jsonData) {
        const { categoryName } = values;
        const dataa = { categoryName };
        formData.push(dataa);
      }
      const response: any = await addStoreCategoryImportService(formData);
      dispatch(setLoaderAction(false));
      if (response) {
        //message.success("Added Successfully")
        const unsavedStoreCategorys =
          response.data.data5?.unsavedStoreCategorys || [];
        const successfulCategoryCount =
          response.data.data5?.successfulCategoryCount;
        message.success(
          successfulCategoryCount + "No. of Store Category added Successfully"
        );
        // Automatically export unsaved Store Category if there are one or more
        if (unsavedStoreCategorys.length > 0) {
          handleExportUnsavedStoreCategorys(unsavedStoreCategorys);
        } else {
          console.log("All brands saved successfully!");
        }
      } else {
        message.error("Something Went Wrong");
      }
      redirect("/admin/store-category");
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      message.error("Something Went Wrong");
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <span style={{ position: "absolute", left: 0 }}>
              <Button
                type="primary"
                onClick={() => {
                  handleOk();
                  onSubmit();
                }}
                style={{ marginRight: "10px" }}
              >
                OK
              </Button>
              <Button
                onClick={() => {
                  handleCancel();
                  setJsonData([]);
                  setFileList([]);
                }}
              >
                Cancel
              </Button>
            </span>
            <span>Store Category</span>
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
        <h3>Kindly follow these instructions to import data:</h3>

        <ul>
          <li>
            Download the template by clicking the "Download Template" button.
            <Button type="primary" onClick={downloadTemplate}>
              Download Template
            </Button>
          </li>
          <li>Fill out the "Name" column in the downloaded Excel file.</li>
          <li>
            Drag and drop the updated excel sheet here.
            <Dragger {...props} accept=".xlsx">
              {" "}
              {/* Accept only Excel files */}
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag Excel file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for uploading Excel files (.xlsx). The file will be
                converted to JSON data.
              </p>
            </Dragger>
            <Table
              className="content"
              columns={columns}
              dataSource={jsonData?.map((data: any) => ({
                // storeCatId: data?.storeCategoryId,
                name: `${capitalizeSubstring(data?.categoryName)}`,
                // date: dateFormatterNew(data?.createdAt),
                // edit: "",
                // delete: ""
              }))}
              bordered
              scroll={{ x: "100%" }}
              size="small"
              pagination={false}
            />
            {/* /*---------------------------------------------------*/}
          </li>
        </ul>
      </Modal>
    </>
  );
}

export default ImportStoreCategoryData;
