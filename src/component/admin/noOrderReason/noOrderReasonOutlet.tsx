import React, { useCallback, useEffect, useState } from 'react';
import '../../style/createBeat.css';
import {  Table } from 'antd';

import { useLocation } from 'react-router-dom';

import { dateFormatterNew } from 'utils/common';
import { setLoaderAction } from 'redux-store/action/appActions';
import { useDispatch } from 'react-redux';
import { getPastNoOrderService } from 'services/visitsService';

interface Item {
    date: string;
    reason: string;
   
}


export default function NoOrderReasonOutlet() {
    const { state } = useLocation();
    const [reasonData, setReasonData] = useState<any>()
  const dispatch = useDispatch();

  const getNoOrderReason = useCallback(async () => {
    try {
      if (state.visitDetail?.empId) {
        const data= {
          storeId: state.visitDetail.storeDetails.storeId,
          empId: state.visitDetail?.empId
        }
        dispatch(setLoaderAction(true))
        const res = await getPastNoOrderService(data);
        dispatch(setLoaderAction(false))
        setReasonData(res.data.data)
      }
    } catch (error) {
      dispatch(setLoaderAction(false))
    }
  }, [dispatch, state.visitDetail?.empId]);
  useEffect(() => {
   getNoOrderReason();
  }, []);
    console.log({state})
  const columns: any = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
         
        },

        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        
    ];

    const dataSource:any = reasonData?.map((item: Item, index:any) => ({
        key: index,
        date: dateFormatterNew(item?.date ?? ""),
        reason: item?.reason ?? "",
    }));
    return (
        <div>
          
      
            <main className=''>
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
            {/* <Footer /> */}
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
