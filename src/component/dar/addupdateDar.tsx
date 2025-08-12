import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Input, message, Popconfirm, Row, Select, Table } from 'antd'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setLoaderAction } from 'redux-store/action/appActions';
import { AppDispatch } from 'redux-store/store';
import { getStoreByTypeService, getStoreService } from 'services/storeService';
import { addDarService, getActivityRelToService, getActivityTypeService, getDarByIdService, getNextActionOnService, getStatusService, updateDarService } from 'services/usersSerivce';
import previousPage from 'utils/previousPage';

export const AddUpdateDar = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const id: string | null = searchParams.get('id');
  // let dataList: any = [];
  const redirect = useNavigate();

  const [activityTypeData, setActivityTypeData] = useState<any[]>([]);
  const [activityRelToData, setActivityRelToData] = useState<any[]>([]);
  const [nextActionOnData, setNextActionOnData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [userList, setuserList] = useState<any>([]);
  const [dataList, setDarData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filterDetails: any = {
    storeType: "all",
    // isUnbilled: false,
  }

  const dispatch = useDispatch<AppDispatch>();

  async function fetchData() {
    try {
      dispatch(setLoaderAction(true));
      setIsLoading(true);

      // Fetch both APIs concurrently
      const [activityTypeRes, activityRelToRes, nextActionOnRes, statusRes, userList] = await Promise.all([
        getActivityTypeService({}),
        getActivityRelToService({}),
        getNextActionOnService({}),
        getStatusService({}),
        getStoreService(filterDetails, { pageNumber: 1, pageSize: 100 }),
      ]);

      // Check response status and update state
      if (activityTypeRes?.data?.status === 200) {
        setActivityTypeData(activityTypeRes?.data?.data);
      } else {
        message.error("Failed to fetch Activity Type data");
      }

      if (activityRelToRes?.data?.status === 200) {
        setActivityRelToData(activityRelToRes?.data?.data);
      } else {
        message.error("Failed to fetch Activity Related To data");
      }

      if (nextActionOnRes?.data?.status === 200) {
        setNextActionOnData(nextActionOnRes?.data?.data);
      } else {
        message.error("Failed to fetch Next Action On data");
      }

      if (statusRes?.data?.status === 200) {
        setStatusData(statusRes?.data?.data);
      } else {
        message.error("Failed to fetch Status data");
      }

      if (userList?.data?.status === 200) {
        setuserList(userList?.data?.data?.stores);
      } else {
        message.error("Failed to fetch Status data");
      }

    } catch (error) {
      message.error("Error fetching data");
    } finally {
      setIsLoading(false);
      dispatch(setLoaderAction(false));
    }
  }

  function filterUserListByType(type: any) {
    const filteredList = userList.filter((ele: any) => {
      return ele?.storeCat?.categoryName.toLowerCase().includes(type.toLowerCase());
    });
    return filteredList;
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchDarData(id: any) {
    try {
      dispatch(setLoaderAction(true));
      setIsLoading(true);

      // Fetch both APIs concurrently
      const res = await getDarByIdService(id);

      // Check response status and update state
      if (res?.data?.status === 200) {
        setDarData(res?.data?.data);
      } else {
        message.error("Failed to fetch Status data");
      }
    } catch (error) {
      message.error("Error fetching data");
    } finally {
      setIsLoading(false);
      dispatch(setLoaderAction(false));
    }
  }

  useEffect(() => {
    if (id) { fetchDarData(id); }
  }, [id]);

  const [expenseApplData, setExpenseApplData] = useState<any>([]);
  const uniqueExpenseApplData = expenseApplData.filter(
    (item: any, index: any, self: any) =>
      index === self.findIndex((t: any) => t.user?.emp_id === item.user?.emp_id)
  );

  const [dateFilters, setDateFilters] = useState({
    from_date: ""
  });
  const [filters, setFilters] = useState<any>({
    status: "",
    user: "",
    to_date: "",
  });
  //   console.log({filters})
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    if (key == "from_date") {
      setDateFilters((prev: any) => ({ ...prev, [key]: value }));
    } else {
      setFilters((prev: any) => ({ ...prev, [key]: value }));

    }
  };
  const clearAllFilters = () => {
    setFilters({
      status: "",
      user: "",
      from_date: "",
      to_date: ""
    });
  };
  const [dataSource, setDataSource] = useState<any>([]);
  const [count, setCount] = useState(2);
  const initializeData = async () => {
    const data: any = [
      {
        activity_type: '',
        activity_related: '',
        related_to: '',
        date: '',
        subject: '',
        next_action_on: '',
        status: '',
        remarks: '',
      }
    ];
    if ([dataList]?.length > 0) {
      setDataSource([dataList]);
    } else {
      setDataSource([...data]);
    }
  };

  useEffect(() => {
    initializeData();
  }, [id, JSON.stringify(dataList)]); // Empty dependency array ensures this runs only once on mount
  useEffect(() => {
    if (id) {
      initializeData();
    }
  }, [id])

  const handleAdd: any = () => {
    const newData = {
      key: count,
      activity_type: '',
      activity_related: '',
      related_to: '',
      date: id ? dataList?.date : '',
      subject: '',
      next_action_on: '',
      status: '',
      remarks: '',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleDelete = (key: any) => {
    const newData = dataSource.filter((item: any) => item.key !== key);
    setDataSource(newData);
  };

  const [selectList, setSelectList] = useState([]);
  const [selectRelatedTo, setSelectRelatedTo] = useState<any>(dataList?.activity_related ?? "");

  const [selectedStoreData, setSelectedStoreData] = useState<any>();
  const fetchRelToStoreData = async (id: any) => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getStoreByTypeService(id);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        setSelectedStoreData(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
  useEffect(() => {
    if (dataList?.activity_related) {
      setSelectRelatedTo(dataList.activity_related);
    }
  }, [dataList]);

  useEffect(() => {
    const fetchDataByType = async () => {
      let fetchedData: any = [];

      if (selectRelatedTo?.toLowerCase()?.includes("stockiest")) {
        fetchedData = filterUserListByType("stockist");
      } else if (selectRelatedTo?.toLowerCase()?.includes("doctor")) {
        fetchedData = await filterUserListByType("doctor");
      } else if (selectRelatedTo === "Chemist") {
        fetchedData = await filterUserListByType("chemist");
      } else if (selectRelatedTo?.toLowerCase()?.includes("generic")) {
        fetchedData = filterUserListByType("generic");;
      }

      setSelectedStoreData(fetchedData || []);
    };

    fetchDataByType();
  }, [selectRelatedTo]);

  const relatedToOptions = selectedStoreData?.map((data: any) => ({
    label: data.storeName || "",
    value: data.storeName || ""
  }));
  const activityTypeOptions = activityTypeData?.map((data: any) => ({
    label: data?.activity_type_name,
    value: data?.activity_type_name
  }));
  const activityRelatedToOptions = activityRelToData.map((data: any) => ({
    label: data?.activity_rel_to_name,
    value: data?.activity_rel_to_name
  }))

  const nextActionOptions = nextActionOnData.map((data: any) => ({
    label: data?.next_action_on_name,
    value: data?.next_action_on_name
  }))


  const statusOptions = statusData.map((data: any) => ({
    label: data?.status_name,
    value: data?.status_name
  }))

  const handleActivityChange = (value: any, key: any) => {
    setDataSource((prevDataSource: any) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, activity_type: value } : item
      )
    );
  };

  const handleRelatedChange = (value: any, key: any) => {
    setSelectRelatedTo(value)
    setDataSource((prevDataSource: any) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, activity_related: value } : item
      )
    );
  };
  const handleRelatedToChange = (value: any, key: any) => {
    setDataSource((prevDataSource: any) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, related_to: value } : item
      )
    );
  };
  const handleSubjectChange = (value: any, key: any) => {
    setDataSource((prevDataSource: any) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, subject: value } : item
      )
    );
  };
  const handleNextActionOn = (value: any, key: any) => {
    setDataSource((prevDataSource: any) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, next_action_on: value } : item
      )
    );
  };
  const handleStatusChange = (value: any, key: any) => {
    setDataSource((prevDataSource: any) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, status: value } : item
      )
    );
  };
  const handleDateChange = (newDate: any, key: any) => {
    setDataSource((prevDataSource: any) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, date: newDate } : item
      )
    );
  };

  const handleRemarksChange = (value: any, key: any) => {
    setDataSource((prevDataSource: any) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, remarks: value } : item
      )
    );
  };
  const defaultColumns = [
    {
      title: 'Activity Type',
      dataIndex: 'activity_type',
      key: 'activity_type',
      width: 120,
      editable: true,
      render: (value: any, record: any) => (
        <Select
          value={record.activity_type}
          options={activityTypeOptions}
          onChange={(val) => handleActivityChange(val, record.key)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Activity Related To',
      dataIndex: 'activity_related',
      key: 'activity_related',
      width: 140,
      editable: true,
      render: (value: any, record: any) => (
        <Select
          value={record.activity_related}
          options={activityRelatedToOptions}
          onChange={(val) => handleRelatedChange(val, record.key)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Related To',
      dataIndex: 'related_to',
      key: 'related_to',
      width: 140,
      editable: true,
      render: (value: any, record: any) => (
        <Select
          value={record.related_to}
          options={relatedToOptions}
          onChange={(val) => handleRelatedToChange(val, record.key)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      editable: true,
      render: (value: any, record: any) => (
        <Input
          value={!id ? record?.date : record?.date ? new Date(record?.date)?.toISOString()?.slice(0, 10) : ""}
          // value={record.date ?? value}
          disabled={Boolean(id)}

          type="date"
          onChange={(e) => handleDateChange(e.target.value, record.key)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      width: 140,
      editable: true,
      render: (value: any, record: any) => (
        <Input
          value={record.subject}
          onChange={(e) => handleSubjectChange(e.target.value, record.key)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Next Action On',
      dataIndex: 'next_action_on',
      key: 'next_action_on',
      width: 140,
      editable: true,
      render: (value: any, record: any) => (
        <Select
          value={record.next_action_on}
          options={nextActionOptions}
          onChange={(val) => handleNextActionOn(val, record.key)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      editable: true,
      render: (value: any, record: any) => (
        <Select
          value={record.status}
          options={statusOptions}
          onChange={(val) => handleStatusChange(val, record.key)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 120,
      editable: true,
      render: (value: any, record: any) => (
        <Input.TextArea
          value={record.remarks}
          rows={1}
          onChange={(e) => handleRemarksChange(e.target.value, record.key)}
        />
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 90,
      render: (_: any, record: any) =>
      (
        <Popconfirm title="Sure to remove?" onConfirm={() => handleDelete(record.key)}>
          <a style={{ color: "blueviolet" }}>Remove</a>
        </Popconfirm>
      )
    },
  ];

  const submit = async () => {
    const data = dataSource?.map((data: any) => ({
      activity_type: data?.activity_type,
      // assigned_to: loginDetails?.user_id,
      activity_related: data?.activity_related,
      related_to: data?.related_to,
      date: data?.date,
      subject: data?.subject,
      next_action_on: data?.next_action_on,
      remarks: data?.remarks,
      status: data?.status,
      ...(id && { dar_id: data?.dar_id }),
    }));
    // console.log({payload})

    try {
      dispatch(setLoaderAction(true));
      let response;

      if (!id) {
        response = await addDarService({ data });
      } else if (id !== null) {
        response = await updateDarService({ data });
      }

      dispatch(setLoaderAction(false));
      if (response?.data?.status === 200) {
        // message.success(`Added Successfully`);
        message.success(id ? "DAR Updated Successfully" : "DAR Added Successfully");
        redirect("/hr/dar")

      } else {
        message.error("Something Went Wrong");
      }
    } catch (error: any) {
      dispatch(setLoaderAction(false));
      if (error?.response?.data?.status == 409) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Something Went Wrong");
      }
    }
  };
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">{id ? "Update Daily Activity Report" : "Daily Activity Report"}</h1>
      </header>
      <main className='content' style={{ marginBottom: "0px" }}>



      </main>
      <div style={{ marginBottom: "0px" }}>
        <div className="" style={{ margin: "10px", paddingBottom: "10px" }}>
          <Table
            style={{ border: "1px solid red !important" }}
            columns={defaultColumns}
            dataSource={
              dataSource
            }
            // rowClassName={rowClassName}
            scroll={{ y: "260px", x: "100%" }}
            size="small"
          // pagination={true ? false : "pagination"}

          />
          <Button
            onClick={handleAdd} type="primary" style={{ marginTop: 16, right: 20, position: "absolute" }}>
            {"Add a row"}
          </Button>
        </div>
        <div style={{ marginTop: 40, right: 20, position: "absolute" }}>
          <Link to='/crm/DAR'><Button style={{ marginRight: "10px", fontWeight: "600" }}>Cancel</Button></Link>
          {!id ? <Button style={{ background: "green", fontWeight: "600", color: 'white' }}
            onClick={() => submit()}
          >Save</Button>
            : <Button style={{ background: "green", fontWeight: "600", color: 'white' }}
              onClick={() => submit()}
            >Update</Button>}
        </div>
      </div>
    </div>
  )
}
