import { ArrowLeftOutlined, CheckCircleFilled, CloseCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setLoaderAction } from 'redux-store/action/appActions';
import { AppDispatch } from 'redux-store/store';
import { getStorePastOrderService } from 'services/storeService';
import { dateFormatter } from 'utils/common';
import previousPage from 'utils/previousPage';

export default function PastOrderListing() {
    const [shops, setShops] = useState<any>([]);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
    const storeId: any = searchParams.get('store_id');
    const [pastOrdersList, setPastOrdersList] = useState<any[]>([]);

    useEffect(() => {
        if (storeId) {
            getPastOrderList();
        }
    }, [storeId]);

    const getPastOrderList = async () => {
        try {
            dispatch(setLoaderAction(true));
            const response = await getStorePastOrderService(storeId);
            dispatch(setLoaderAction(false));
            if (response && response.status === 200) {
                let { data } = response.data;
                setPastOrdersList(data);
            }
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    };
    const handleChange = (value: string) => {
        // console.log(`selected ${value}`);
    };

    const searchStore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;

        const FS = shops.filter((item: any) =>
            (item?.storeName?.toLowerCase())?.includes(value.toLowerCase())
        );
        setShops(FS);
    };
    return (
        <div className='store-v1'>
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Past Orders</h1>
            </header>
            <main>
                <div className="search">
                    <Input prefix={<SearchOutlined />} placeholder="Search Store" onChange={searchStore} />
                    <Select
                        defaultValue="all"
                        className='w-176'
                        onChange={handleChange}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'today', label: 'Today' },
                            { value: 'week', label: 'Week' },
                        ]}
                    />
                </div>
                {
                    (pastOrdersList && pastOrdersList.length > 0) && pastOrdersList.map((item: any, ind: number) => {
                        return (
                            <Link to={`/order/order-summary/${item?.orderId}`} className='linkDefault'>
                                <div key={ind} className="orderListing">
                                    <div>
                                        {" "}
                                        <span className='orderIdText'>
                                            Order ID:  {item?.orderId}
                                        </span>
                                        <div className="flexSpace orderDate">
                                            <span>Order date: {dateFormatter(item?.orderDate)}</span>
                                        </div>
                                    </div>
                                    <div className='focusedInd'>
                                        <span>
                                            {item.products.some((i: any) => i.isFocused) ?
                                                <CheckCircleFilled className='checkIcon' />
                                                :
                                                <CloseCircleFilled className='closeIcon' />
                                            }
                                        </span>
                                        <div className='focusedText'>Focused</div>
                                        <div className='focusedText'>Items</div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                }
            </main>
        </div>
    );
}
