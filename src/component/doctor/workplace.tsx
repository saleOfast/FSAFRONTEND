import { Button, Col, Divider, Input, Modal, Row, Select } from "antd";
import { Typography } from "antd";
import { LS_KEYS } from "app-constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderAction } from "redux-store/action/appActions";
import { AppDispatch } from "redux-store/store";
import {
  deleteWorkPlaceService,
  getOtherWorkPlaceDataService,
  postActivityDataServices,
  postWorkPlaceDataService,
  updateWorkPlaceData,
} from "services/storeService";
import { getItemFromLS } from "utils/common";
const { Title } = Typography;

export const Workplace = ({ storeDetails, setStoreDetails }: any) => {
  const localStorageData = getItemFromLS(LS_KEYS.userData);
  const userObject = localStorageData ? JSON.parse(localStorageData) : "";
  // console.log("user Id",userObject.id)

  const dispatch = useDispatch<AppDispatch>();
  const [workPlaceDataResponse, setWorkPlaceDataResponse] = useState([]);
  const [isAddWorkPlaceModal, setIsAddWorkPlaceModal] = useState(false);
  const [updateworkPlaceModal, setUpdateWorkPlaceModal] = useState(false);
  const [workPlaceData, setWorkPlaceData] = useState({
    workplaceType: "",
    practiceType: "",
    orgName: "",
    townCity: "",
    territory: "",
    patientVolume: "",
    availability: "",
    store_Id: storeDetails?.storeId,
    addedBy: userObject?.id,
  });
  const [selectedWorkPlace, setSelectedWorkPlace] = useState<any>(null);
  const confirmDeleteWorkPlace = (workPlaceId: number) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => handleDeleteWorkPlace(workPlaceId), // Calls delete function
    });
  };

  useEffect(() => {
    handleWorkPlaceData();
  }, []);
  const handleWorkPlaceData = async () => {
    try {
      dispatch(setLoaderAction(true));

      const response = await getOtherWorkPlaceDataService();
      console.log("+++,", response);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        console.log("getWorkplace data", data);
        setWorkPlaceDataResponse(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
  const showModal = () => {
    setIsAddWorkPlaceModal(true);
  };

  const handleWorkPlaceCancel = () => {
    setIsAddWorkPlaceModal(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setWorkPlaceData((prev) => ({ ...prev, [name]: value }));
  };
  const handleOkWorkPlaceData = async () => {
    console.log("formData", workPlaceData);
    try {
      dispatch(setLoaderAction(true));
      const response = await postWorkPlaceDataService(workPlaceData); // API Call
      dispatch(setLoaderAction(false));

      if (response.status === 200) {
        console.log("Activity added:", response.data);
        setIsAddWorkPlaceModal(false);
        handleWorkPlaceData();
        setWorkPlaceData({
          workplaceType: "",
          practiceType: "",
          orgName: "",
          townCity: "",
          territory: "",
          patientVolume: "",
          availability: "",
          store_Id: storeDetails?.storeId,
          addedBy: userObject?.id,
        });
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
      console.error("Error adding activity:", error);
    }
  };

  // onchange for update
  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setSelectedWorkPlace((prev: any) => ({ ...prev, [name]: value }));
  };

  // update modal
  const showUpdateModal = (workPlace: any) => {
    setSelectedWorkPlace(workPlace);
    setUpdateWorkPlaceModal(true);
  };

  // call the api
  // const handleOkUpdateWorkPlace = () => {
  //   console.log("selectedWorkPlace",selectedWorkPlace)

  // };
  const handleOkUpdateWorkPlace = async () => {
    console.log("formData", selectedWorkPlace);
    try {
      dispatch(setLoaderAction(true));
      const response = await updateWorkPlaceData(selectedWorkPlace); // API Call
      dispatch(setLoaderAction(false));

      if (response.status === 200) {
        console.log("workplace updeted:", response.data);
        setUpdateWorkPlaceModal(false); // Close Modal
        handleWorkPlaceData(); // Refresh Data
        setWorkPlaceData({
          // Clear Form
          workplaceType: "",
          practiceType: "",
          orgName: "",
          townCity: "",
          territory: "",
          patientVolume: "",
          availability: "",
          store_Id: storeDetails?.storeId,
          addedBy: userObject?.id,
        });
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
      console.error("Error adding activity:", error);
    }
  };

  // close the modal
  const handleWorkPlaceModal = () => {
    setUpdateWorkPlaceModal(false);
  };

  // delete work place data
  const handleDeleteWorkPlace = async (workPlaceId: number) => {
    try {
      dispatch(setLoaderAction(true));
      const response = await deleteWorkPlaceService(workPlaceId);
      dispatch(setLoaderAction(false));
      if (response.status === 200)
        console.log("Work place deleted successfully");
      handleWorkPlaceData(); //refresh the workplace list
    } catch (error) {
      dispatch(setLoaderAction(false));
      console.error("Error deleting workplace:", error);
    }
  };

  return (
    <>
      {/* headers */}
      <Row gutter={[12, 12]} style={{ margin: 0 }}>
        <Col span={12} style={{ textAlign: "start" }}>
          <Title level={5} style={{ margin: 0 }}>
            Work Places
          </Title>
        </Col>
        <Col span={12} style={{ textAlign: "end" }}>
          <Button
            onClick={showModal}
            type="primary"
            style={{
              height: "40px",
              color: "white",
              margin: 0,
            }}
          >
            Add Work Place
          </Button>
        </Col>
      </Row>

      {/* location data */}
      {workPlaceDataResponse
  ?.sort((a: any, b: any) => (a.workplaceType === "PRIMARY" ? -1 : 1)) // Sort PRIMARY to top
  .map((workPlace: any, index: number) => (
    <Row key={index} gutter={[8, 0]} justify="center" style={{ marginTop: "10px" }}>
      <Col
        xs={22}
        sm={18}
        md={12}
        lg={20}
        style={{
          border: "1px solid #d9d9d9",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#3CA5F4",
          color: "white",
        }}
      >
        {/* Header */}
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={5} style={{ margin: 0, color: "white" }}>
              {workPlace?.workplaceType} (WorkPlace)
            </Title>
          </Col>
        </Row>

        {/* Divider */}
        <Divider style={{ margin: "4px 0", borderColor: "white" }} />

        {/* Info Grid */}
        <Row gutter={[4, 4]} justify="center">
          {[
            { label: "Practice Type", value: workPlace?.practiceType },
            { label: "Organization Name", value: workPlace?.orgName },
            { label: "City", value: workPlace?.townCity },
            { label: "Territory", value: workPlace?.territory },
            { label: "Patient Volume", value: workPlace?.patientVolume },
            { label: "Availability", value: workPlace?.availability },
          ].map((item, i) => (
            <Col key={i} span={8} style={{ textAlign: "start", padding: "4px" }}>
              <Title level={5} style={{ fontSize: "13px", fontWeight: "normal", margin: "5px 0", color: "white" }}>
                {item.label}
              </Title>
              <Title level={5} style={{ margin: "2px 0", color: "white" }}>
                {item.value}
              </Title>
            </Col>
          ))}
        </Row>

        {/* Action Buttons */}
        <Col span={24} style={{ textAlign: "end", marginTop: "5px" }}>
          <Button type="primary" onClick={() => showUpdateModal(workPlace)} style={{ height: "30px" }}>
            Update
          </Button>
          <Button
            type="primary"
            danger
            style={{ height: "30px", marginLeft: "8px" }}
            onClick={() => confirmDeleteWorkPlace(workPlace?.workplaceId)}
          >
            Delete
          </Button>
        </Col>
      </Col>
    </Row>
  ))}


      {/* add work place modal */}
      <Modal
        title="Add Work Place"
        centered
        open={isAddWorkPlaceModal}
        onOk={handleOkWorkPlaceData}
        onCancel={handleWorkPlaceCancel}
        footer={[
          <Button key="cancel" onClick={handleWorkPlaceCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkWorkPlaceData}>
            Submit
          </Button>,
        ]}
      >
        <Row gutter={[24, 24]} style={{ padding: "5px" }}>
          <Col span={24}>
            Workplace Type
            <Select
              placeholder="Workplace Type"
              value={workPlaceData.workplaceType}
              style={{ width: "100%", height: "45px", color: "red" }}
              options={[
                { label: "PRIMARY", value: "PRIMARY" },
                { label: "OTHERS", value: "OTHERS" },
              ]}
              onChange={(value) =>
                handleChange({ name: "workplaceType", value })
              }
            />
          </Col>
          <Col span={12}>
            Practice Type
            <Select
              placeholder="Practice Type"
              style={{ width: "100%", height: "45px", color: "red" }}
              value={workPlaceData.practiceType}
              options={[
                { label: "Private", value: "PRIVATE" },
                { label: "Hospital", value: "HOSPITAL" },
                { label: "Government", value: "GOVERNMENT" },
              ]}
              onChange={(value) =>
                handleChange({ name: "practiceType", value })
              }
            />
          </Col>
          <Col span={12}>
            Organization Name
            <Input
              name="orgName"
              placeholder="Organization Name"
              style={{ padding: "12px" }}
              value={workPlaceData.orgName}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            City
            <Input
              name="townCity"
              placeholder="City"
              style={{ padding: "12px" }}
              value={workPlaceData.townCity}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            Territory
            <Input
              name="territory"
              placeholder="Territory"
              style={{ padding: "12px" }}
              value={workPlaceData.territory}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            Patient Volume
            <Input
              name="patientVolume"
              placeholder="Patient Volume"
              style={{ padding: "12px" }}
              value={workPlaceData.patientVolume}
              onChange={handleChange}
            />
          </Col>
          <Col span={12}>
            Availability
            <Input
              name="availability"
              placeholder="Availability"
              style={{ padding: "12px" }}
              value={workPlaceData.availability}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </Modal>
      {/* Update WorkPlace Modal */}
      <Modal
        title="Update WorkPlace"
        open={updateworkPlaceModal}
        onOk={handleOkUpdateWorkPlace}
        onCancel={handleWorkPlaceModal}
      >
        <Row gutter={[24, 24]} style={{ padding: "5px" }}>
          <Col span={24}>
            Workplace Type
            <Select
              placeholder="Workplace Type"
              value={selectedWorkPlace?.workplaceType}
              style={{ width: "100%", height: "45px", color: "red" }}
              options={[
                { label: "PRIMARY", value: "PRIMARY" },
                { label: "OTHERS", value: "OTHERS" },
              ]}
              onChange={(value) =>
                handleUpdateChange({ name: "workplaceType", value })
              }
            />
          </Col>
          <Col span={12}>
            Practice Type
            <Select
              placeholder="Practice Type"
              style={{ width: "100%", height: "45px", color: "red" }}
              value={selectedWorkPlace?.practiceType}
              options={[
                { label: "Private", value: "PRIVATE" },
                { label: "Hospital", value: "HOSPITAL" },
                { label: "Government", value: "GOVERNMENT" },
              ]}
              onChange={(value) =>
                handleUpdateChange({ name: "practiceType", value })
              }
            />
          </Col>
          <Col span={12}>
            Organization Name
            <Input
              name="orgName"
              placeholder="Organization Name"
              style={{ padding: "12px" }}
              value={selectedWorkPlace?.orgName}
              onChange={handleUpdateChange}
            />
          </Col>
          <Col span={12}>
            City
            <Input
              name="townCity"
              placeholder="City"
              style={{ padding: "12px" }}
              value={selectedWorkPlace?.townCity}
              onChange={handleUpdateChange}
            />
          </Col>
          <Col span={12}>
            Territory
            <Input
              name="territory"
              placeholder="Territory"
              style={{ padding: "12px" }}
              value={selectedWorkPlace?.territory}
              onChange={handleUpdateChange}
            />
          </Col>
          <Col span={12}>
            Patient Volume
            <Input
              name="patientVolume"
              placeholder="Patient Volume"
              style={{ padding: "12px" }}
              value={selectedWorkPlace?.patientVolume}
              onChange={handleUpdateChange}
            />
          </Col>
          <Col span={12}>
            Availability
            <Input
              name="availability"
              placeholder="Availability"
              style={{ padding: "12px" }}
              value={selectedWorkPlace?.availability}
              onChange={handleUpdateChange}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
