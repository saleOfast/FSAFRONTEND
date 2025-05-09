import {
  ArrowLeftOutlined,
  CodepenOutlined,
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Table,
  Tag,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useSelector } from "../../../redux-store/reducer";
import { AppDispatch } from "../../../redux-store/store";

import "../../../style/stores.css";
import previousPage from "utils/previousPage";

import { getCourseActions } from "redux-store/action/learningModule/learningActions";
import { deleteCourseService } from "services/learningModule/courseService";
import DeleteItem from "../common/deleteItem";
import dayjs from "dayjs";
import { setLoaderAction } from "redux-store/action/appActions";
import {
  addEDetailingService,
  deleteEDetailingService,
  getEDetailingByIdService,
  getEDetailingService,
  updateEDetailingService,
} from "services/usersSerivce";
import { dateFormatterDar, dateFormatterNew } from "utils/common";

function AdminLmsDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  // const [filters, setFilters] = useState({
  //   ...additionalFilters,
  //   storeType: StoreTypeEnum.ALL,
  //   duration: DurationEnum.ALL
  // });

  const [courseDetails, setCourseDetails] = useState<any[]>([]);
  // const [form] = Form.useForm();

useEffect(() => {
  form.setFieldsValue({
    course_material: [], // Ensure it's an empty array initially
  });
}, []);

  

  async function fetchEDetailingData() {
    try {
      dispatch(setLoaderAction(true));
      const res = await getEDetailingService({});
      if (res?.data?.status === 200) {
        setCourseDetails(res?.data?.data);
      } else {
        message.error("Failed to fetch data");
      }
    } catch (error) {
      message.error("Error fetching data");
    } finally {
      dispatch(setLoaderAction(false));
    }
  }
  const [reload, setReload] = useState<any>(false);
  useEffect(() => {
    fetchEDetailingData();
  }, [reload]);

  const [filteredData, setFilteredData] = useState<any[]>([]);
  useEffect(() => {
    setFilteredData(courseDetails);
  }, [courseDetails]);

  const searchCourse = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    const FS = courseDetails.filter((item: any) =>
      item?.course_name?.toLowerCase()?.includes(value.toLowerCase())
    );
    setFilteredData(FS);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [configName, setConfigName] = useState("");
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<
    "add" | "update" | "enableDisable"
  >("add");
  const [statusVal, setStatusVal] = useState<boolean>(false);

  // Function to open modal and set state
  const showConfirm = (
    id: any,
    initialName: string,
    action: "add" | "update" | "enableDisable",
    status: any
  ) => {
    setConfigName(initialName);
    setCurrentId(id);
    setActionType(action);
    if (action == "enableDisable") {
      setIsModalVisible(true);
    } else {
      setOpen(true);
    }
    setStatusVal(status);
  };
  const [toggleDelete, setToggleDelete] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseID] = useState("");

  const toggleHandler = (courseId: string, name: string) => {
    setToggleDelete(true);
    setCourseID(courseId);
    setCourseName(name);
  };

  const [open, setOpen] = useState(false);

  const showModal = () => {
    form.setFieldsValue({
      course_name: "",
      course_material: "",
      product_category: "",
      doctor_specialisation: "",
      expire_date: "",
    });
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const [expDate, setExpDate] = useState<any>("");
  const [updateVal, setUpdateVal] = useState<any>({
    course_name: "",
    course_material: "",
    product_category: "",
    doctor_specialisation: "",
    expire_date: "",
  });

  const onDateChange: any = (date: any, dateString: any) => {
    // console.log(dateString);
    setExpDate(dateString);
  };
  const [form] = Form.useForm();
  const getDataById = async (id: any) => {
    try {
      if (id) {
        const res = await getEDetailingByIdService(id);
        if (res?.data?.status == 200) {
          const data = res?.data?.data;

          // Convert expire_date to dayjs
          if (data.expire_date) {
            data.expire_date = dayjs(data.expire_date);
          }

          setUpdateVal(data);
          form.setFieldsValue(data);
        } else {
          message.error("Somthing Went Wrong");
        }
      }
    } catch (error) {
      message.error("Somthing Went Wrong");
    }
  };
  // useEffect(() => {

  //   getDataById(currentId);
  // }, [currentId])
  const handleOk = async (action: any) => {
    try {
      const values = await form.validateFields(); // Properly await validation
      console.log("Course Data:", values);
      const { expire_date, ...data } = values;
      dispatch(setLoaderAction(true));
      let response;

      if (actionType == "add") {
        response = await addEDetailingService({
          expire_date: expDate,
          ...data,
        }); // No need to wrap `values` in an object
      } else if (actionType == "update") {
        response = await updateEDetailingService({
          expire_date: expDate == "" ? expire_date : expDate,
          ...data,
          e_detailing_id: currentId,
        });
      }

      dispatch(setLoaderAction(false));

      if (response?.data?.status === 200) {
        message.success(
          actionType == "update"
            ? "DAR Updated Successfully"
            : "DAR Added Successfully"
        );
        // redirect("/hr/dar");
        setReload(!reload);
      } else {
        message.error("Something Went Wrong");
      }

      hideModal();
    } catch (error: any) {
      dispatch(setLoaderAction(false));

      if (error?.response?.data?.status === 409) {
        message.error(error?.response?.data?.message);
      } else if (error instanceof Error) {
        message.error(error.message || "Something Went Wrong");
      } else {
        message.error("Something Went Wrong");
      }

      console.error("Validation or API Error:", error);
    }
  };

  const handleStatusOk = async () => {
    try {
      dispatch(setLoaderAction(true));
      let response;

      response = await updateEDetailingService({
        status: !statusVal,
        e_detailing_id: currentId,
      });

      dispatch(setLoaderAction(false));

      if (response?.data?.status === 200) {
        message.success("Updated Successfully");
        // redirect("/hr/dar");
        setReload(!reload);
      } else {
        message.error("Something Went Wrong");
      }
      setIsModalVisible(false);
      // hideModal();
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      setIsModalVisible(false);
      if (error?.response?.data?.status === 409) {
        message.error(error?.response?.data?.message);
      } else if (error instanceof Error) {
        message.error(error.message || "Something Went Wrong");
      } else {
        message.error("Something Went Wrong");
      }

      console.error("Validation or API Error:", error);
    }
  };
  const [courseStr, setCourseStr] = useState<any>();
  const columns: any = [
    {
      title: "Learning Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 120,
    },
    {
      title: "Product Category",
      dataIndex: "category",
      key: "category",
      width: 80,
    },
    {
      title: "Doctor Speciality",
      dataIndex: "speciality",
      key: "speciality",
      width: 80,
    },
    {
      title: "Expiry Date",
      dataIndex: "expire",
      key: "expire",
      width: 80,
    },
    {
      title: "Learning material",
      dataIndex: "material",
      key: "material",
      width: 80,
      render: (text: any, record: any) => {
        setCourseStr(text);
        return (
          <>
            <Button onClick={() => setOpenResponsive(true)}>View</Button>
          </>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (text: any, record: any) => {
        return record?.status ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        );
      },
    },
    {
      title: "Active/Inactive",
      dataIndex: "action",
      key: "action",
      width: 60,
      render: (text: any, record: any) => {
        return (
          <CodepenOutlined
            onClick={() =>
              showConfirm(
                record?.id,
                record?.name,
                "enableDisable",
                record?.status
              )
            }
            style={{ color: "purple", fontSize: "18px" }}
          />
        );
      },
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      width: 40,

      render: (text: any, record: any) => {
        return (
          <Link
            to="#"
            onClick={() => {
              getDataById(record?.id);
              showConfirm(record?.id, record?.name, "update", record?.status);
            }}
          >
            <EditOutlined />
          </Link>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      width: 40,

      render: (text: any, record: any) => {
        return (
          <Link
            to="#"
            onClick={() => toggleHandler(record?.id, record?.name)}
            style={{ color: "red" }}
          >
            <DeleteOutlined />
          </Link>
        );
      },
    },
  ];
  const [learningType, setLearningType] = useState<any>("url");
  const [openVid, setOpenVid] = useState(false);
  const [openResponsive, setOpenResponsive] = useState(false);
  return (
    <div className="store-v1 storeBgC">
      <header
        className="heading heading-container"
        style={{ backgroundColor: "#070D79" }}
      >
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Learning Material</h1>
      </header>
      <Modal
        title="Learning Material"
        centered
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        width={900}
      >
        <div>
          <iframe
            style={{ borderRadius: "20px" }}
            width="100%"
            height="400px"
            // src={courseStr}
            src="https://www.youtube.com/embed/f78ABEVoACA"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
      </Modal>
      <DeleteItem
        toggle={toggleDelete}
        name={courseName}
        itemsId={courseId}
        deleteService={deleteEDetailingService}
        closeModal={(e: any) => {
          setToggleDelete(e);
        }}
      />
      <Modal
        title={
          actionType === "add"
            ? "Add Status"
            : actionType === "update"
            ? "Update Status"
            : actionType === "enableDisable"
            ? `Are you Sure Want to ${statusVal ? "Disable" : "Enable"}?`
            : ""
        }
        open={isModalVisible} // Controlled visibility
        onOk={() => handleStatusOk()}
        onCancel={() => setIsModalVisible(false)}
      >
        <div style={{ marginBottom: "40px" }}>
          Learning Name :{" "}
          <span style={{ fontWeight: "500" }}>{configName}</span>
        </div>
      </Modal>
      <Modal
        title={`${
          actionType == "add" ? "Publish" : "Update"
        } Learning Material`}
        open={open}
        onOk={() => {
          setActionType("add");
          handleOk("add");
        }}
        onCancel={hideModal}
        okText={`${actionType == "add" ? "Publish" : "Update"}`}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Course_name"
            name="course_name"
            rules={[{ required: true, message: "Please enter  name" }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>

          <Form.Item label="Learning Category" name="learning_type">
            <Radio.Group
              value={learningType}
              onChange={(e) => {
                const value = e.target.value;
                form.setFieldsValue({
                  course_material: value === "url" ? "" : [],
                }); // Reset properly
                setLearningType(value);
              }}
            >
              <Radio value="url">Video URL</Radio>
              <Radio value="video">Upload Video</Radio>
              <Radio value="brochure">Upload Brochure</Radio>
            </Radio.Group>
          </Form.Item>
          {learningType === "url" && (
            <Form.Item
              label="Course URL"
              name="course_material"
              rules={[
                { required: true, message: "Please enter course URL" },
                {
                  min: 8,
                  max: 70,
                  message: "URL should be between 8 and 70 characters",
                },
                // { pattern: /^[a-zA-Z0-9-]+$/, message: "URL should not contain special characters" },
              ]}
            >
              <Input
                addonBefore="Video URL"
                placeholder="some-url-for-your-course"
              />
            </Form.Item>
          )}

          {learningType === "video" && (
            <Form.Item
              label="Upload Video (size is less than 15MB)"
              name="course_material"
              rules={[{ required: true, message: "Please upload a Video!" }]}
              valuePropName="fileList"
              getValueFromEvent={(e) =>
                Array.isArray(e?.fileList) ? e.fileList : []
              }
            >
              <Upload accept="video/*" beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload Video</Button>
              </Upload>
            </Form.Item>
          )}

          {learningType === "brochure" && (
            <Form.Item
              label="Upload Brochure/PDF Material"
              name="course_material"
              rules={[{ required: true, message: "Please upload a PDF!" }]}
              valuePropName="fileList"
              getValueFromEvent={(e) =>
                Array.isArray(e?.fileList) ? e.fileList : []
              }
            >
              <Upload accept=".pdf" beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload PDF/Brochure</Button>
              </Upload>
            </Form.Item>
          )}

          <Form.Item label="Assigning Content" style={{}}>
            {/* Product Category Tagging */}
            <Form.Item
              name="product_category"
              label="Product Category"
              rules={[
                {
                  required: true,
                  message: "Please select at least one category!",
                },
              ]}
            >
              <Select placeholder="Select product categories">
                <Select.Option value="medicines">Medicines</Select.Option>
                <Select.Option value="surgical">
                  Surgical Equipment
                </Select.Option>
                <Select.Option value="diagnostic">
                  Diagnostic Tools
                </Select.Option>
              </Select>
            </Form.Item>

            {/* Doctor Specialization Tagging */}
            <Form.Item
              name="doctor_specialisation"
              label="Doctor Specialization"
              rules={[
                {
                  required: true,
                  message: "Please select at least one specialization!",
                },
              ]}
            >
              <Select placeholder="Select doctor specializations">
                <Select.Option value="cardiologist">Cardiologist</Select.Option>
                <Select.Option value="orthopedic">Orthopedic</Select.Option>
                <Select.Option value="neurologist">Neurologist</Select.Option>
              </Select>
            </Form.Item>

            {/* Expiration Date */}
            <Form.Item
              name="expire_date"
              label="Expiration Date (if applicable)"
            >
              {/* <DatePicker style={{ width: "100%", zIndex:"99999", position:"absolute" }} /> */}
              <DatePicker
                onChange={onDateChange}
                style={{ width: "100%" }}
                getPopupContainer={(trigger: any) => trigger.parentElement}
                value={updateVal?.expire_date}
              />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>

      {/* <Link to="/admin/lms/add-course"> */}
      <div
        className="addIcon"
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
        <PlusOutlined className="plusIcon" />
      </div>
      {/* </Link> */}
      <main>
        <div className="search">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search Learning Material"
            onChange={searchCourse}
          />
        </div>
        <Table
          className="content"
          columns={columns}
          dataSource={filteredData?.map((d: any) => ({
            id: d?.e_detailing_id,
            name: d?.course_name,
            category: d?.product_category,
            speciality: d?.doctor_specialisation,
            expire: dateFormatterNew(d?.expire_date),
            material: d?.course_material,
            status: d?.status,
          }))}
          bordered
          scroll={{ x: "100%" }}
          size="small"
          pagination={false}
        />
      </main>
    </div>
  );
}

export default AdminLmsDashboard;
