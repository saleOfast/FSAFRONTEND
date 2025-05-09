import { EditOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { setLoaderAction } from 'redux-store/action/appActions';
import { AppDispatch } from 'redux-store/store';
import { getNoOrderService } from 'services/orderService';
import { getVisitPictureService } from 'services/visitsService';
import { dateFormatterNew, handleImageError } from 'utils/common';

export default function VisitPictures(props: any) {
  // const { state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { storeId } = useParams();
  console.log({storeId})
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([])
  useEffect(() => {
      async function fetchData() {
          try {
              dispatch(setLoaderAction(true));
              setIsLoading(true)
              const res = await getVisitPictureService({storeId});
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
  }, [storeId]);

  const [toggleDelete, setToggleDelete] = useState(false);
const [reasonId, setReasonId] = useState('');
  const toggleHandler = (reasonId: string, name: string) =>{
      setToggleDelete(true);
      setReasonId(reasonId);
    }

  const columns: any = [
      {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
       
      },
      {
          title: 'Picture',
          dataIndex: 'picture',
          key: 'picture',
        //   render: (text: any, record: any) => {
        //     return <img src={record?.picture} alt='pic'className='visPicImg'  onError={handleImageError}/>;
        //  },
      },
  ];

  const dataSource = data?.map((item: any) => ({
      date: dateFormatterNew(item?.date),
      picture: (item?.image ? <img src={item?.image} onError={(e)=>handleImageError(e)} alt='pic'className='visPicImg'  style={{height:"100px"}}/>:<img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png"} alt='pic'className='visPicImg' style={{height:"100px"}}  /> ),
      // edit: <EditOutlined />,
      // delete: <DeleteOutlined />
  }));
  return (
    <div >
 <main >
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
    </div>

  )
}
