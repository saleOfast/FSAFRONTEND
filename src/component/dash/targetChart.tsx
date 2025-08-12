import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import previousPage from 'utils/previousPage';
import { DatePicker, Space } from 'antd';
import { getYearlyTargetAchievedService } from 'services/dashboardService';
import { useDispatch } from 'react-redux';
import { setLoaderAction } from 'redux-store/action/appActions';
import FullPageLoaderWithState from 'component/FullPageLoaderWithState';
import type { DatePickerProps } from 'antd';
import YearlyChart from './yearlyChart';
import { getYear, setYear } from 'date-fns';
import { useLocation } from 'react-router-dom';

export const TargetChart = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [targetAchievedData, setTargetAchievedData] = useState<any>({})
  const currentYear = getYear(new Date());
  const defaultYear = setYear(new Date(), currentYear);
  const years = defaultYear.getFullYear().toString();
  const [targetYear, setTargetYear] = useState<any>(years)
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const empId: string | null = searchParams.get('empId');
  const empName: string | null = searchParams.get('empName');

  useEffect(() => {
    async function fetchTargetAchievedData() {
      try {
        dispatch(setLoaderAction(true));
        setIsLoading(true)
        const res = await getYearlyTargetAchievedService(targetYear, Number(empId));
        if (res?.data?.status === 200) {
          setTargetAchievedData(res?.data?.data)
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
    fetchTargetAchievedData();
  }, [targetYear]);

  const onChange: DatePickerProps['onChange'] = (_, dateString) => {
    setTargetYear(dateString.toString())
  };

  return (
    <div>
      <FullPageLoaderWithState isLoading={isLoading} />
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Target Achieved</h1>
      </header>
      {!isLoading &&
        <div>
          <div style={{ maxWidth: '100%', overflowX: 'auto', borderRadius: "6px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}><h2 >{empName}</h2></div>
            <div style={{ width: "100%", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", paddingRight: "12px" }}>Year</span>
                <Space direction="vertical" className="custom-space">
                  <DatePicker
                    onChange={onChange}
                    picker="year"
                    placement='bottomLeft'
                    className="custom-datepicker"
                    placeholder={targetYear}
                  />
                </Space>
              </div>
            </div>
            <div style={{ "boxShadow": "rgba(0, 0, 0, 0.24) 0px 3px 8px", margin: "20px 20px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", }}>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <div><h4>Amount Target Achieved: {targetYear}</h4></div>
                <div style={{ width: "130px" }}>
                  <YearlyChart achievedData={targetAchievedData?.amountData ?? ""} bg={"#ECF1D8"} color={"#98B433"} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', flexDirection: "column" }}>
                    <div>Target</div>
                    <div className='fw-bold' style={{ padding: "6px 0 16px 0" }} >{targetAchievedData?.targetAmount ?? 0}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', flexDirection: "column" }}>
                    <div>Achieved</div>
                    <div className='fw-bold' style={{ padding: "6px 0 16px 0" }}>{targetAchievedData?.achievedAmount ?? 0}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ "boxShadow": "rgba(0, 0, 0, 0.24) 0px 3px 8px", margin: "20px 20px 80px 20px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <div><h4>Store Target Achieved: {targetYear}</h4></div>
                <div style={{ width: "130px" }}><YearlyChart achievedData={targetAchievedData?.storeData ?? ""} bg={"#F4EBF7"} color={"#DEADD8"} /></div>
                <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', flexDirection: "column" }}>
                    <div>Target</div>
                    <div className='fw-bold' style={{ padding: "6px 0 16px 0" }} >{targetAchievedData?.targetStore ?? 0}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', flexDirection: "column" }}>
                    <div>Achieved</div>
                    <div className='fw-bold' style={{ padding: "6px 0 16px 0" }}>{targetAchievedData?.achievedStore ?? 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <style>
        {`
      .ant-picker-year-panel{
          width: 260px!important;
          // height: 200px!important;
      }
      `}
      </style>
    </div>
  );
};

