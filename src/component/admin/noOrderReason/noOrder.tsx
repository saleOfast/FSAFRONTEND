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

export default function NoOrderReason() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
    const userId: string | null = searchParams.get('userId');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>([])
  
    useEffect(() => {
        async function fetchTargetAchievedData() {
            try {
                dispatch(setLoaderAction(true));
                setIsLoading(true)
                const res = await getNoOrderService();
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
        fetchTargetAchievedData();
    }, [ userId]);

    const [toggleDelete, setToggleDelete] = useState(false);
  const [reasonId, setReasonId] = useState('');
    const toggleHandler = (reasonId: string, name: string) =>{
        setToggleDelete(true);
        setReasonId(reasonId);
      }

    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'reasonId',
            key: 'reasonId',
         
        },
        {
            title: 'Reason Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '',
            dataIndex: 'edit',
            key: 'edit',
            render: (text: any, record: any) => {
                 return <Link to={`/add-update/noOrder-reason?reasonId=${record?.reasonId}`}><EditOutlined /></Link>;
              },
        },
        {
            title: '',
            dataIndex: 'delete',
            key: 'delete',
            render: (text: any, record: any) => {
                return <Link to="#" onClick={() => toggleHandler(record?.reasonId, "")} style={{color:"red"}}><DeleteOutlined /></Link>;
             },
        }, 
    ];

    const dataSource = data?.map((item: any) => ({
        key: item?.reasonId,
        reasonId: item?.reasonId,
        description: item?.description,
        edit: <EditOutlined />,
        delete: <DeleteOutlined />
    }));
    return (
        <div>
            <FullPageLoaderWithState isLoading={isLoading} />
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">No Order Reason</h1>
            </header>
            <Link to="/add-update/noOrder-reason">
        <div className="addIcon">
          <PlusOutlined
          className="plusIcon"
          />
        </div>
      </Link>
      <DeleteItem 
          toggle={toggleDelete} 
          name={""} 
          itemsId={reasonId} 
          deleteService={deleteNoOrderService}
          closeModal={(e: any) => {
            setToggleDelete(e);
          }}/>
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
