import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import * as XLSX from 'xlsx';
import VisitsItem from 'component/visit/VisitsItem';
import useCoordinates from 'hooks/useCoordinates';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { getVisitsActions } from 'redux-store/action/visitsActions';
import { DurationEnum } from 'enum/common';

interface ExportVisitsDataProps {
  visitsData: any[]; // Adjust this type based on the actual shape of your data
  isModalOpen: boolean;
  handleExportOk: () => void;
  handleExportCancel: () => void;
}

const ExportVisitsData: React.FC<ExportVisitsDataProps> = ({ isModalOpen, handleExportOk,handleExportCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: visitsData, isLoading, completedVisitCount, totalRecords } = useSelector((state:any) => state.visits);
  const [filters, setFilter] = useState({
    duration: DurationEnum.ALL,
    beat: "",
    status:""
  });

  useEffect(() => {
    dispatch(getVisitsActions(filters));
  }, []);
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
console.log(visitsData)
const coordinates = useCoordinates();
  const exportVisitData = () => {
    // Convert visitsData to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(visitsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visits");

    // Trigger file download
    XLSX.writeFile(workbook, "visits_data.xlsx");
  };

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px", marginBottom: "24px" }}>

{
  visitsData.map((item:any) => (
    <VisitsItem
      key={item.visitId}
      data={item}
      coordinates={coordinates.coordinate} />
  ))
}
</div>
    </>
  );
};

export default ExportVisitsData;
