import React, { useEffect, useRef, useState } from "react";
// import "../../style/orderList.css";
import { ArrowLeftOutlined, EyeOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "redux-store/reducer";
import { AppDispatch } from "redux-store/store";
import { getProductSchemeActions } from "redux-store/action/productAction";
// import { deleteProductSchemeService } from "services/productService";
import previousPage from "utils/previousPage";
import { useAuth } from "context/AuthContext";
import { UserRole } from "enum/common";
import { Button, Col, Input, message, Row, Select, Switch, Table, Form, Tag } from "antd";
import { setLoaderAction } from "redux-store/action/appActions";
import { getActiveSchemeService, updateSchemeService } from "services/productService";
import HookFormSelectField from "component/HookFormSelectField";
import { yupResolver } from "@hookform/resolvers/yup";
import { applyExpenseSchema, applyExpTravelSchema, beatSchema } from "utils/formValidations";
import { useForm } from "react-hook-form";
import HookFormInputField from "component/HookFormInputField";
import { addExpenseService, getExpenseService, getPolicyHeadService, getPolicyTypeService } from "services/usersSerivce";
import { dateFormatterNew } from "utils/common";
import { uploadFileToS3 } from "utils/uploadS3";
import { getOrderSignedUrlService } from "services/orderService";
// import DeleteItem from "../common/deleteItem";

export default function ExpenseApply() {
  const redirect = useNavigate();


  const dispatch = useDispatch<AppDispatch>();
  // console.log({productSchemeList})
  const { authState } = useAuth();
  const [isTravelVal, setIsTravelVal] = useState<boolean>(false);
  const [policyIdVal, setPolicyIdVal] = useState<any>();
  const [costVal, setCostVal] = useState<any>();
  const [docUrl, setDocUrl] = useState<any>("");
  //   const fileInputRef = useRef<any>(null);

  // const handleIconClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];

    try {
      dispatch(setLoaderAction(true))
      const res = await getOrderSignedUrlService(selectedFile?.name);
      await uploadFileToS3(res.data.data, selectedFile);
      // const response = await uploadProfilePictureService({ "image": res.data.data.fileUrl, "empId": String(empId) ?? String(authState?.user?.id) });
      dispatch(setLoaderAction(false));
      setDocUrl(res?.data?.data?.fileUrl ?? "")
      // if (response && response.status === 200) {
      //   message.success("Uploaded successfully");
      //   setUpdateImage(true)
      //   setIsLoading(true)
      //   const profileRes = await getProfileService();
      //   const userData = profileRes?.data?.data;
      //   setUserData(userData)
      //   setIsLoading(false)
      //   setAuthState(p => ({
      //     ...p,
      //     user: userData
      //   }))
      // }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };


  const policyTypeHandler = (e: any) => {
    const [policyId, isTravel] = JSON.parse(e);
    setIsTravelVal(isTravel);
    setPolicyIdVal(policyId);
    console.log('Policy ID:', policyId, 'Is Travel:', isTravel);
  };




  const [isLoading, setIsLoading] = useState(false);

  const [expenseData, setExpenseData] = useState<any>([]);

  const [policyHeadData, setPolicyHeadData] = useState<any>([]);
  async function fetchExpenseData() {
    try {
      dispatch(setLoaderAction(true));
      setIsLoading(true);
      const res = await getExpenseService({});
      if (res?.data?.status === 200) {
        setExpenseData(res?.data?.data);
      } else {
        message.error("Failed to fetch data");
      }
    } catch (error) {
      message.error("Error fetching data");
    } finally {
      setIsLoading(false);
      dispatch(setLoaderAction(false));
    }
  }

  async function fetchPolicyHeadData() {
    try {
      dispatch(setLoaderAction(true));
      setIsLoading(true);
      const res = await getPolicyHeadService();
      if (res?.data?.status === 200) {
        setPolicyHeadData(res?.data?.data);
      } else {
        message.error("Failed to fetch data");
      }
    } catch (error) {
      message.error("Error fetching data");
    } finally {
      setIsLoading(false);
      dispatch(setLoaderAction(false));
    }
  }

  useEffect(() => {
    fetchExpenseData();
    fetchPolicyHeadData();
  }, []);

  const [policyTypeData, setPolicyTypeData] = useState<any>([]);

  async function fetchPolicyTypeData() {
    if (policyIdVal) {
      try {
        dispatch(setLoaderAction(true));
        setIsLoading(true);
        const res = await getPolicyTypeService(policyIdVal);
        if (res?.data?.status === 200) {
          setPolicyTypeData(res?.data?.data);
        } else {
          message.error("Failed to fetch data");
        }
      } catch (error) {
        message.error("Error fetching data");
      } finally {
        setIsLoading(false);
        dispatch(setLoaderAction(false));
      }
    }
  }
  useEffect(() => {
    fetchPolicyTypeData();
  }, [policyIdVal]);





  const dataSource = Array.isArray(expenseData)
    ? expenseData?.map((item: any, idx: number) => ({
      submit_by: `${item?.user?.firstname} ${item?.user?.lastname}`,
      submit_to: `${item?.manager?.firstname} ${item?.manager?.lastname}`,
      from_date: item?.from_date ? dateFormatterNew(item?.from_date) : "",
      to_date: item?.to_date ? dateFormatterNew(item?.to_date) : "",
      police_type: item?.policy?.policy_name,
      distance: item?.kms == 0 ? "" : item?.kms,
      status: item?.report_status,
      remark: item?.remark,
      total_expence: item?.total_expence
    }))
    : [];

  const columns: any = [
    {
      title: 'Submit By',
      dataIndex: 'submit_by',
      key: 'submit_by',
      fixed: "left",
      width: 120
    },
    {
      title: 'Application Submit To',
      dataIndex: 'submit_to',
      key: 'submit_to',
      width: 120

    },
    {
      title: 'From Date',
      dataIndex: 'from_date',
      key: 'from_date',
      width: 100
    },
    {
      title: 'To Date',
      dataIndex: 'to_date',
      key: 'to_date',
      width: 100

    },
    {
      title: 'Policy Type',
      dataIndex: 'police_type',
      key: 'police_type',
      width: 100

    },
    {
      title: 'Total Expense',
      dataIndex: 'total_expence',
      key: 'total_expence',
      width: 80

    },
    {
      title: 'Distance in KM.',
      dataIndex: 'distance',
      key: 'distance',
      width: 80

    },


    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: any, record: any) => {
        return (
          <Tag color={text === "PENDING" ? "yellow" : text === "APPROVED" ? "green" : text === "REJECTED" ? "red" : ""} style={{ fontWeight: 500 }}>{text}</Tag>
        )
      },

    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
      width: 120


    },
  ];
  const {
    control,
    setValue,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(isTravelVal ? applyExpTravelSchema : applyExpenseSchema),
    defaultValues: {
      total_expence: "",
      policy_name: "",
      // policy_type_id: "",
      kms: "",
      from_location: "",
      to_location: "",
      detail: "",
      from_date: "",
      to_date: "",
      document: ""
    }
  })
  const [infoVal, setInfoVal] = useState<any>({
    policy_type_id: null,
    cost_per_km: null,

  });
  const policyExpenseHandler = (val: any) => {
    setCostVal(val)
    console.log('rs', val, 'Is Travel:',);
  };
  const expenseCostHandler = (e: any) => {
    let val = Number(e.target.value) * Number(costVal)
    console.log({ val, costVal, e })
    setValue("total_expence", String(val))

  };
  const onSubmit = async (values: any) => {
    // const { total_expence, policy_name, policy_type_name, kms, from_location, detail, from_date, end_location, to_date  } = values;
    const [policyId, isTravel] = JSON.parse(values?.policy_name);
    // const [policy_type_id, d] = JSON.parse(values?.policy_type_id); 
    const file = values.document?.[0];
    console.log({ values, file })
    const { policy_name, total_expence, kms, from_date, to_date, ...filteredValues } = values;
    const isValidDate = (date: any) => date && !isNaN(new Date(date).getTime()); // Check if valid

    const from = isValidDate(from_date) ? new Date(from_date).toISOString().split('T')[0] : null;
    const to = isValidDate(to_date) ? new Date(to_date).toISOString().split('T')[0] : null;

    try {
      dispatch(setLoaderAction(true));
      const response = await addExpenseService({ ...filteredValues, from_date: from, to_date: to, policy_id: policyId, total_expence: Number(total_expence), kms: Number(kms), policy_type_id: infoVal?.policy_type_id });
      dispatch(setLoaderAction(false));
      if (response?.data?.status == 200) {
        message.success("Added Successfully")

        // redirect("/admin/brand")
        setValue("total_expence", "");
        setValue("policy_name", "")
        setValue("policy_type_id", "")
        setValue("kms", "")
        setValue("from_location", "")
        setValue("to_location", "")
        setValue("detail", "")
        setValue("from_date", "")
        setValue("to_date", "");
        await fetchExpenseData();
      } else {
        message.error("Something Went Wrong");
      }
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      message.error("Something Went Wrong");
    }
  };
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Apply Expense</h1>
      </header>
      <main className=''>
        <Form
          className="add-store-form createbeat"
          onFinish={handleSubmit((data, e) => {
            console.log("Form Submitted Data:", e, data);
            onSubmit(data);
          })}

          autoComplete="off"
          style={{ height: "auto" }}

        // layout="horizontal"
        // labelCol={{ span: 3 }}
        >
          <Row className="mt-4">
            <Col span={12} className="pr-12">
              <HookFormSelectField
                control={control}
                type="text"
                name="policy_name"
                placeholder="Select Policy"
                label={"Select Policy"}
                showSearch
                allowClear
                // defaultValue={userRoleFilter[0]?.role ?? ""}
                callback={policyTypeHandler}
                optionData={
                  policyHeadData?.map((data: any) => ({
                    label: data?.policy_name,
                    value: JSON.stringify([data?.policy_id || null, data?.is_travel ?? false])
                  })) || []
                }
                filterOption={(inputValue: any, option: any) => {
                  return option.label.toLowerCase().includes(inputValue.toLowerCase())
                }}
                required
              />
            </Col>
            {!isTravelVal ?
              <Col span={12} className="pr-12">
                <HookFormInputField
                  control={control}
                  type="date"
                  name="from_date"
                  placeholder="Date"
                  label={"Date"}
                // required
                />
              </Col> :
              <Col span={12} className="pl-12">

                <HookFormSelectField
                  control={control}
                  type="text"
                  name="policy_type_id"
                  placeholder="Select Expense Type"
                  label={"Expense Type"}
                  showSearch
                  allowClear
                  // defaultValue={userRoleFilter[0]?.role ?? ""}
                  callback={(value: string) => {
                    const parsedValue = JSON.parse(value);
                    policyExpenseHandler(parsedValue.cost_per_km);
                    setInfoVal({ policy_type_id: parsedValue?.policy_type_id })
                    // setValue("policy_type_id", parsedValue?.policy_type_id)
                  }}
                  optionData={
                    policyTypeData?.map((data: any) => ({
                      label: data?.policy_type_name,
                      value: JSON.stringify({
                        policy_type_id: data?.policy_type_id,
                        cost_per_km: data?.cost_per_km,
                        // headLeaveCntId: data?.headLeaveCntId
                      }),
                    })) || []
                  }
                  filterOption={(inputValue: any, option: any) => {
                    return option.label.toLowerCase().includes(inputValue.toLowerCase())
                  }}
                  required={isTravelVal}
                />
              </Col>

            }
          </Row>
          {isTravelVal &&
            <>
              <Row className="mt-4">


                <Col span={12} >
                  <HookFormInputField
                    control={control}
                    type="number"
                    name="kms"
                    placeholder="Distance in KM."
                    label={"Distance in KM."}
                    callback={expenseCostHandler}

                  // required
                  />
                </Col>
                <Col span={12} className="pl-12">
                  <HookFormInputField
                    control={control}
                    type="number"
                    name="total_expence"
                    placeholder="Total Expense"
                    label={"Total Expense"}
                    required
                    disabled
                  /></Col>
              </Row>
              <Row className="mt-4">
                <Col span={12} className="pr-12">
                  <HookFormInputField
                    control={control}
                    type="date"
                    name="from_date"
                    placeholder="Date"
                    label={"From Date"}
                  // required
                  />
                </Col>
                <Col span={12} className="pl-12">
                  <HookFormInputField
                    control={control}
                    type="date"
                    name="to_date"
                    placeholder="To Date"
                    label={"To Date"}
                  // required
                  />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col span={12} className="pr-12">
                  <HookFormInputField
                    control={control}
                    type="text"
                    name="from_location"
                    placeholder="Start Location"
                    label={"Start Location"}
                  // required
                  />
                </Col>
                <Col span={12} className="pl-12">
                  <HookFormInputField
                    control={control}
                    type="text"
                    name="to_location"
                    placeholder="End Location"
                    label={"End Location"}
                  // required
                  />
                </Col>
              </Row>
            </>
          }

          {!isTravelVal &&
            <Row className="mt-4">
              <Col span={12} className="pr-12">
                <HookFormInputField
                  control={control}
                  type="text"
                  name="from_location"
                  placeholder="Enter Location"
                  label={"Location"}
                // required
                />
              </Col>
              <Col span={12} className="pr-12">
                <HookFormInputField
                  control={control}
                  type="number"
                  name="total_expence"
                  placeholder="Total Expense"
                  label={"Total Expense"}
                  required
                // disabled={isTravelVal}
                />

              </Col>
            </Row>}
          <Row className="mt-4">

            <Col span={12} className="pr-12">
              <HookFormInputField
                control={control}
                type="file"
                name="document"
                placeholder="Upload Document"
                label={"Upload Document"}
              // required
              />
              {/* <input
                type="file"
                ref={fileInputRef}
                className="profileRef"
                onChange={handleFileChange}
              /> */}
            </Col>
            <Col span={12} className="pl-12">
              <HookFormInputField
                control={control}
                type="textarea"
                name="detail"
                placeholder="Enter Expense Details"
                label={"Details"}
              />
            </Col>
          </Row>
          <Row className="mt-4">

          </Row>

          <div className="beat-btn" style={{ marginBottom: '0!important' }}>
            <div
              className=" orders-btn">
              <Button
                onClick={() => redirect(-1)}
              >Cancel</Button>
              <button type="submit" className="btn-save">
                Save
              </button>
            </div>
          </div>
        </Form>
      </main>
      <main style={{ marginTop: "10px" }}>
        <div className="searchproduct">
          <div>
            <main className='content'>
              <Table

                dataSource={dataSource}
                bordered
                columns={columns}
                size="small"
                scroll={{ x: "100%" }}
                pagination={false}
              />
            </main>
          </div>
        </div>
      </main>
    </div>
  );
}
