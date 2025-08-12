import React, { useEffect, useState } from 'react';
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
import DeleteItem from '../common/deleteItem';
import { deleteSizeService, getSizeService } from 'services/productService';

export default function Size() {
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
                const res = await getSizeService();
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
    const [sizeId, setSizeId] = useState('');
    const [sizeName, setSizeName] = useState('');
    const toggleHandler = (sizeId: string, name: string) => {
        setToggleDelete(true);
        setSizeId(sizeId);
        setSizeName(name)
    }

    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'sizeId',
            key: 'sizeId',

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
                return <Link to={`/config/size/add-update?sizeId=${record?.sizeId}`}><EditOutlined /></Link>;
            },
        },
        {
            title: '',
            dataIndex: 'delete',
            key: 'delete',
            render: (text: any, record: any) => {
                return <Link to="#" onClick={() => toggleHandler(record?.sizeId, record?.name)} style={{ color: "red" }}><DeleteOutlined /></Link>;
            },
        },
    ];

    const dataSource = data?.map((item: any) => ({
        key: item?.sizeId,
        sizeId: item?.sizeId,
        name: item?.name,
        edit: <EditOutlined />,
        delete: <DeleteOutlined />
    }));
    return (
        <div>
            <FullPageLoaderWithState isLoading={isLoading} />
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Product Size</h1>
            </header>
            <Link to="/config/size/add-update">
                <div className="addIcon">
                    <PlusOutlined
                        className="plusIcon"
                    />
                </div>
            </Link>
            <DeleteItem
                toggle={toggleDelete}
                name={sizeName}
                itemsId={sizeId}
                deleteService={deleteSizeService}
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
