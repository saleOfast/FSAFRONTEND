import React, { useEffect, useMemo, useState } from 'react';
import '../../style/createBeat.css';
import Footer from '../../common/footer';
import { Space, Switch, Table } from 'antd';
import previousPage from 'utils/previousPage';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { setLoaderAction } from 'redux-store/action/appActions';
import FullPageLoaderWithState from 'component/FullPageLoaderWithState';
import { deleteNoOrderService, getNoOrderService } from 'services/orderService';
import DeleteItem from '../common/deleteItem';
import { deleteRoleService, getRoleService } from 'services/usersSerivce';

export default function Role() {
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
                const res = await getRoleService({});
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
    }, [ userId]);

    const [toggleDelete, setToggleDelete] = useState(false);
  const [roleId, setRoleId] = useState('');
  const [roleName, setRoleName] = useState('');

    const toggleHandler = (roleId: string, name: string) =>{
        setToggleDelete(true);
        setRoleId(roleId);
        setRoleName(name)
      }

    const columns: any = [
        // {
        //     title: 'S.No.',
        //     dataIndex: 'roleId',
        //     key: 'roleId',
         
        // },
        {
            title: 'Role Id',
            dataIndex: 'key',
            key: 'key',
         
        },
        {
            title: 'Role Name',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text: any, record: any) => {
                 return record?.status ? <Space style={{color:"green", fontWeight:"bold"}} >Enabled</Space> : <span style={{color:"red", fontWeight:"bold"}}>Disabled</span>
                //  <Link to={`/config/role/add-update?roleId=${record?.roleId}`}><EditOutlined /></Link>;
              },
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            render: (text: any, record: any) => {
                 return [1, 2, 6, 7].includes(record?.roleId) ? "" : 
                 <Link to={`/config/role/add-update?roleId=${record?.roleId}`}><EditOutlined /></Link>;
              },
        },
        // {
        //     title: '',
        //     dataIndex: 'delete',
        //     key: 'delete',
        //     render: (text: any, record: any) => {
        //         return <Link to="#" onClick={() => toggleHandler(record?.roleId, record?.roleName)} style={{color:"red"}}><DeleteOutlined /></Link>;
        //      },
        // }, 
    ];

    const dataSource = data?.map((item: any, idx:any) => ({
        roleId: item?.roleId,
        key: item?.key,
        roleName: item?.name,
        status: item?.isActive,
        // edit: item?.key,
        // delete: <DeleteOutlined />
    }));
    return (
        <div>
            <FullPageLoaderWithState isLoading={isLoading} />
            <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Role</h1>
            </header>
            <Link to="/config/role/add-update">
        <div className="addIcon">
          <PlusOutlined
          className="plusIcon"
          />
        </div>
      </Link>
      <DeleteItem 
          toggle={toggleDelete} 
          name={roleName} 
          itemsId={roleId} 
          deleteService={deleteRoleService}
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
