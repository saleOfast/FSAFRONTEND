import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'antd';
import * as XLSX from 'xlsx';
import { dispatch } from 'd3';
import { setLoaderAction } from 'redux-store/action/appActions';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { getColourService } from 'services/productService';

interface ExportColourDataProps {
    data: any[];
    isModalOpen: boolean;
    handleExportOk: () => void;
    handleExportCancel: () => void;
}

const ExportProductColourData: React.FC<ExportColourDataProps> = ({isModalOpen, handleExportOk,handleExportCancel }) => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
    const userId: string | null = searchParams.get('userId');
    const [isLoading, setIsLoading] = useState(false);
    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'colourId',
            key: 'colourId',

        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        
        
    ];
  const [data, setData] = useState<any>([])

    useEffect(() => {
        async function fetchData() {
            try {
                dispatch(setLoaderAction(true));
                setIsLoading(true)
                const res = await getColourService();
                if (res?.data?.status === 200) {
                    setData(res?.data?.data)
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
        fetchData();
    }, [userId]);
    const exportProductColor = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Colours");
        XLSX.writeFile(workbook, "colours_data.xlsx");
    };

    return (
        <>
           <Table

dataSource={
    data?.map((item: any) => ({
        colourId: item?.colourId,
        name: item?.name,
      
    }))
}
bordered
columns={columns}
size="small"
pagination={false}
/>
        </>
    );
};

export default ExportProductColourData;
