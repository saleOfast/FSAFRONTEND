import React, { useEffect, useMemo, useState } from 'react';
import '../../style/createBeat.css';
import Footer from '../../common/footer';
import { Table } from 'antd';
import previousPage from 'utils/previousPage';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { setLoaderAction } from 'redux-store/action/appActions';
import FullPageLoaderWithState from 'component/FullPageLoaderWithState';
import { deleteNoOrderService, getNoOrderService } from 'services/orderService';
import DeleteItem from '../common/deleteItem';
import { deleteColourService, getColourService } from 'services/productService';

export default function Colour() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
    const userId: string | null = searchParams.get('userId');
    const [isLoading, setIsLoading] = useState(false);
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

    const [toggleDelete, setToggleDelete] = useState(false);
    const [colourId, setColourId] = useState('');
    const [colourName, setColourName] = useState('');
    const toggleHandler = (colourId: string, name: string) => {
        setToggleDelete(true);
        setColourId(colourId);
        setColourName(name)
    }

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
        {
            title: '',
            dataIndex: 'edit',
            key: 'edit',
            render: (text: any, record: any) => {
                return <Link to={`/config/colour/add-update?colourId=${record?.colourId}`}><EditOutlined /></Link>;
            },
        },
        {
            title: '',
            dataIndex: 'delete',
            key: 'delete',
            render: (text: any, record: any) => {
                return <Link to="#" onClick={() => toggleHandler(record?.colourId, record?.name)} style={{ color: "red" }}><DeleteOutlined /></Link>;
            },
        },
    ];

    const dataSource = data?.map((item: any) => ({
        key: item?.colourId,
        colourId: item?.colourId,
        name: item?.name,
        edit: <EditOutlined />,
        delete: <DeleteOutlined />
    }));
    return (
        <div>
            <FullPageLoaderWithState isLoading={isLoading} />
            <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Product Colour</h1>
            </header>
            <Link to="/config/colour/add-update">
                <div className="addIcon">
                    <PlusOutlined
                        className="plusIcon"
                    />
                </div>
            </Link>
            <DeleteItem
                toggle={toggleDelete}
                name={colourName}
                itemsId={colourId}
                deleteService={deleteColourService}
                closeModal={(e: any) => {
                    setToggleDelete(e);
                }} />
            <main className='content'>
                <Table

                    dataSource={
                        dataSource
                    }
                    bordered
                    columns={columns}
                    size="small"
                    pagination={false}
                />
            </main>
            <Footer />
            <style>
                {`
                .grey-background {
                    background-color: #fafafa;
                    font-weight: 600;
                    color: rgba(0, 0, 0, 0.88);
                   }
                     .ant-select-selector{
                      width: 180px!important
                     }
                `}
            </style>
        </div>
    );
}
