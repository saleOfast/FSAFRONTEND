import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Row, Select, Table, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { dateFormatterNew } from 'utils/common';
import previousPage from 'utils/previousPage';
import { Link } from 'react-router-dom'
import { AppDispatch } from 'redux-store/store';
import { useDispatch } from 'react-redux';
import { setLoaderAction } from 'redux-store/action/appActions';
import { getDarService, getStatusService } from 'services/usersSerivce';
import { differenceInDays } from 'date-fns';

export const Dar = () => {
  const [statusData, setStatusData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  async function fetchStatusData() {
    try {
      dispatch(setLoaderAction(true));
      setIsLoading(true);
  
      // Fetch both APIs concurrently
      const [statusRes] = await Promise.all([
        getStatusService({})
      ]);
  
      // Check response status and update state
      if (statusRes?.data?.status === 200) {
        setStatusData(statusRes?.data?.data);
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
    fetchStatusData();
  }, []);
  const isEditable = (date:any) => {
    const currentDate = new Date();
    const recordDate = new Date(date);
    return differenceInDays(currentDate, recordDate) <= 7;
  };
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

  const defaultColumns = [
    {
      title: 'Activity Type',
      dataIndex: 'activity_type',
      key: 'activity_type',
      width: 120,
      // fixed: "left",
      // editable: true,
    },
    {
      title: 'Activity Related To',
      dataIndex: 'activity_related',
      key: 'activity_related',
      width: 140,
    },
    {
      title: 'Related To',
      dataIndex: 'related_to',
      key: 'related_to',
      width: 140,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      // render: (v: any, rec: any) => (
      //   <div>{v ? dateFormatterNew(v) : ""}</div>
      // )
    },
    {
      title: 'subject',
      dataIndex: 'subject',
      key: 'subject',
      width: 140,
    },
    {
      title: 'Next Action On',
      dataIndex: 'next_action_on',
      key: 'next_action_on',
      width: 140,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 120,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 90,
      render: (val:any, record:any) => { 
        const isEditableRow = isEditable(record?.date);
        if (!isEditableRow) {
          return null;
        }
        return (
          <Typography.Link  
          href={`/hr/addUpdateDar?id=${record?.dar_id}`} 
          >
            Edit
          </Typography.Link>
        )
      },
    },
  ];

  const [darData, setDarData] = useState<any[]>([]);
  const [statusFil, setStatusFil] = useState<any>("");
  const [fromDateFil, setFromFil] = useState<any>("");
  const [toDateFil, setToFil] = useState<any>("");

  
  async function fetchData() {
    try {
      dispatch(setLoaderAction(true));
      // setIsLoading(true);
      const { status, to_date } = filters;
            const { from_date } = dateFilters
      const res = await getDarService({from_date, to_date, status});
      if (res?.data?.status === 200) {
        setDarData(res?.data?.data);
      } else {
        message.error("Failed to fetch data");
      }
    } catch (error) {
      message.error("Error fetching data");
    } finally {
      // setIsLoading(false);
      dispatch(setLoaderAction(false));
    }
  }
  useEffect(() => {
    fetchData();
  }, [filters]);
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Daily Activity Report</h1>
      </header>
      <main className='content' style={{ marginBottom: "0px" }}>
        <Row gutter={[16, 16]}>

          <Col xs={12} sm={12} md={4} lg={4}>
            <div className="field-group">
              <label style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>From</label>
              <Input type="date" value={filters.from_date || undefined} onChange={(e: any) => handleFilterChange("from_date", e?.target?.value)} style={{ width: "100%" }} />
            </div>
          </Col>
          <Col xs={12} sm={12} md={4} lg={4}>
            <div className="field-group">
              <label style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>To</label>
              <Input type="date" value={filters.to_date || undefined} onChange={(e: any) => handleFilterChange("to_date", e?.target?.value)} style={{ width: "100%" }} />
            </div>
          </Col>
          <Col xs={12} sm={12} md={4} lg={4}>
            <div className="field-group">
              <label style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>Select Status</label>
              <Select value={filters.status || undefined} onChange={(e: any) => handleFilterChange("status", e)} placeholder="Select" 
              options={[{ label: "All", value: "" }, ...statusData?.map((d:any)=>({label: d?.status_name, value:d?.status_name}))]} className="selectTargetFil" style={{ width: "100%" }} />
            </div>
          </Col>

          <Col xs={12} sm={12} md={4} lg={4} style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center", marginTop: "12px" }} >
            <div  >
              {/* <Button style={{ background: "#6164A6", color: "white", marginRight: "10px" }}>
                                Search
                            </Button> */}
              <Link to="/hr/addUpdateDar"><Button style={{ background: "#6164A6", color: "white", marginRight: "10px" }}>
                <PlusOutlined />
                Add DAR
              </Button>
              </Link>
            </div>

          </Col>
        </Row>



      </main>
      <div style={{ marginBottom: "0px" }}>
        <div className="" style={{ margin: "10px", paddingBottom: "10px" }}>
          <Table
            style={{ border: "1px solid red !important" }}
            columns={defaultColumns}
            dataSource={
              darData.map((d: any) => (
                {
                  dar_id: d?.dar_id,
                  activity_type: d?.activity_type,
                  // assigned_to: 1,
                  activity_related: d?.activity_related,
                  related_to: d?.related_to,
                  date: d?.date ? dateFormatterNew(d?.date) : "",
                  subject: d?.subject,
                  next_action_on: d?.next_action_on,
                  remarks: d?.remarks,
                  status: d?.status,
                }
              ))
            }
            // rowClassName={rowClassName}
            scroll={{ y: "360px", x: "100%" }}
            size="small"
          // pagination={true ? false : "pagination"}

          />

        </div>

      </div>
    </div>
  )
}
