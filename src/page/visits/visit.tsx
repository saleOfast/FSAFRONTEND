import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ConfigProvider, Progress, Select, Space } from "antd";
import { useDispatch } from "react-redux";
import { getVisitsActions, loadMoreVisitsActions } from "../../redux-store/action/visitsActions";
import { AppDispatch } from "../../redux-store/store";
import { useSelector } from "../../redux-store/reducer";
import VisitsItem from "component/visit/VisitsItem";
import "../../style/visit.css";
import useCoordinates from "hooks/useCoordinates";
import { DurationEnum } from "enum/common";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LoadMore from "component/LoadMore";
import { Link, useLocation } from "react-router-dom";
import { VisitStatus } from "enum/visits";

const visitDateFilterData = [
  {
    value: DurationEnum.ALL,
    label: "All",
  },
  {
    value: DurationEnum.TODAY,
    label: "Today",
  },
  {
    value: DurationEnum.WEEK,
    label: "Week",
  },
]
function Visit() {
  const coordinates = useCoordinates();
  const dispatch = useDispatch<AppDispatch>();
  const { data: visitsData, isLoading, completedVisitCount, totalRecords } = useSelector(state => state.visits);
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const visited: string | null = searchParams.get('visited');
  const beatData = useSelector(state => [
    {
      value: "",
      label: "All",
    },
    ...state.store.storeBeat.map(i => ({
      label: i.beatName,
      value: i.beatId
    }))
  ]) || [];

  const [filters, setFilter] = useState({
    duration: DurationEnum.TODAY,
    beat: "",
    status: visited ? VisitStatus.COMPLETE : null
  });

  useEffect(() => {
    dispatch(getVisitsActions(filters));
  }, []);

  const getVisitInsightInfo = useMemo(() => {
    const completedVisitPercentage = Number(((completedVisitCount / totalRecords) * 100).toFixed(2)) || 0
    return {
      completedVisitCount,
      totalRecords,
      completedVisitPercentage
    }
  }, [completedVisitCount, totalRecords]);

  const handleDateChange = useCallback((value: any) => {
    setFilter(prev => {
      const newFilters = {
        ...prev,
        duration: value
      }
      dispatch(getVisitsActions(newFilters));
      return newFilters;
    })
  }, []);

  const handleBeatChange = useCallback((value: any) => {
    setFilter(prev => {
      const newFilters = {
        ...prev,
        beat: value
      }
      dispatch(getVisitsActions(newFilters));
      return newFilters;
    })
  }, []);

  const handleLoadMore = useCallback(() => {
    dispatch(loadMoreVisitsActions(filters))
  }, [dispatch, filters]);

  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Visits</h1>
      </header>
      <div className="content">
        <main>
          <div className="visitHeader">
            <div>
              <span className="visitSelect">Select Visit</span>
              <span className="visitDropdown dropdown">
                <Space>
                  <Select
                    className="adminVistSel"
                    size="small"
                    options={visitDateFilterData}
                    value={filters.duration}
                    onChange={handleDateChange}
                  />
                </Space>
              </span>
            </div>

            <div>
              <span className="visitSelect">Select Beat</span>
              <span className="visitDropdown dropdown">
                <Space>
                  <Select
                    className="adminBeatSel"
                    size="small"
                    options={beatData}
                    value={filters.beat}
                    onChange={handleBeatChange}
                  />
                </Space>
              </span>
            </div>
          </div>
          <div className="p-8">
            <ConfigProvider
              theme={{
                components: {
                  Progress: {
                    remainingColor: "#e61b23",
                  },
                },
              }}>
              <Progress
                percent={getVisitInsightInfo.completedVisitPercentage}
                size={["100%", 18]}
                showInfo={false}
                strokeColor="green"
                className="fontb"
              />
            </ConfigProvider>
            {
              getVisitInsightInfo.totalRecords > 0 &&
              <div className="progress-count-cont">
                <span className="progress-count-count">
                  {getVisitInsightInfo.completedVisitCount}/{getVisitInsightInfo.totalRecords}
                </span>
                <span className="progress-count-perc">({getVisitInsightInfo.completedVisitPercentage}%)</span>
              </div>
            }
          </div>
          <div className="createVistBeat">
            <Link to="/admin/create-visit" className="linkto"><div className="createVBTxt">Create New Visit</div></Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px", marginBottom: "24px" }}>

            {
              visitsData.map(item => (
                <VisitsItem
                  key={item.visitId}
                  data={item}
                  coordinates={coordinates.coordinate} />
              ))
            }
          </div>
          {
            totalRecords > 0 && visitsData.length < totalRecords &&
            <LoadMore isLoading={isLoading} onClick={handleLoadMore} />
          }
        </main>
      </div>
    </div>
  );
}

export default Visit