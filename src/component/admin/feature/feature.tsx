import React, { useEffect, useState } from 'react';
import '../../style/createBeat.css';
import Footer from '../../common/footer';
import { message, Switch, Table } from 'antd';
import previousPage from 'utils/previousPage';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux-store/store';
import { setLoaderAction } from 'redux-store/action/appActions';
import FullPageLoaderWithState from 'component/FullPageLoaderWithState';
import { getFeatureService, updateFeatureService } from 'services/usersSerivce';

export default function Feature() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
    // const userId: string | null = searchParams.get('userId');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>([])
    async function fetchData() {
        try {
          dispatch(setLoaderAction(true));
          setIsLoading(true);
          const res = await getFeatureService();
          if (res?.data?.status === 200) {
            setData(res?.data?.data);
          } else {
            message.error("Failed to fetch data");
          }
        } catch (error) {
          message.error("Error fetching data");
        } finally {
          setIsLoading(false);
          dispatch(setLoaderAction(false));
        }
      }

    const [renderData, setRenderData] = useState(false);
    const [isLoadingChange, setIsLoadingChange] = useState(false);
   
    const onChangeStatus = async (value: boolean, key: string) => {
        // Optimistically update the UI
        const previousData = [...data];
        const newData = data.map((item:any) =>
          item.key === key ? { ...item, isActive: value } : item
        );
        setData(newData);
        setIsLoadingChange(true);
    
        try {
          dispatch(setLoaderAction(true));
          const response = await updateFeatureService({ key, isActive: value });
          if (response?.data?.status === 200) {
            message.success("Updated Successfully");
          } else {
            message.error("Something went wrong");
            setData(previousData); // Revert to previous state on failure
          }
        } catch (error: any) {
          message.error("Error updating status");
          setData(previousData); // Revert to previous state on error
        } finally {
          setIsLoadingChange(false);
          dispatch(setLoaderAction(false));
        }
      };
    
    useEffect(() => {
        fetchData();
    }, [renderData]);
   
    const dataSource = data?.map((item: any) => ({
        featureId: item?.featureId,
        key: item?.key,
        featureName: item?.name,
        status: <Switch onChange={(e) => onChangeStatus(e, item?.key)} checkedChildren="Enabled" unCheckedChildren="Disabled"  checked={item?.isActive}/>,
        edit: <EditOutlined />,
        delete: <DeleteOutlined />
    }));
    const columns: any = [
        // {
        //     title: 'S.No.',
        //     dataIndex: 'featureId',
        //     key: 'featureId',

        // },
        {
            title: 'Feature Id',
            dataIndex: 'key',
            key: 'key',

        },
        {
            title: 'Feature Name',
            dataIndex: 'featureName',
            key: 'featureName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            // render: (text: any, record: any) => {
            //     return <Switch onChange={(e) => onChangeStatus(e, record?.key)} checkedChildren="Enabled" unCheckedChildren="Disabled" defaultChecked={record?.status}  />
            //     //  <Link to={`/config/role/add-update?roleId=${record?.roleId}`}><EditOutlined /></Link>;
            // },
        },
        // {
        //     title: '',
        //     dataIndex: 'edit',
        //     key: 'edit',
        //     render: (text: any, record: any) => {
        //          return <Link to={`/config/feature/add-update?featureId=${record?.featureId}`}><EditOutlined /></Link>;
        //       },
        // },
        // {
        //     title: '',
        //     dataIndex: 'delete',
        //     key: 'delete',
        //     render: (text: any, record: any) => {
        //         return <Link to="#" onClick={() => toggleHandler(record?.featureId, record?.featureName)} style={{color:"red"}}><DeleteOutlined /></Link>;
        //      },
        // }, 
    ];


    return (
        <div>
            <FullPageLoaderWithState isLoading={isLoading} />
            <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Feature</h1>
            </header>
            <Link to="/config/feature/add-update">
                <div className="addIcon">
                    <PlusOutlined
                        className="plusIcon"
                    />
                </div>
            </Link>

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
