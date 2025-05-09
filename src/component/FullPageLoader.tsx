import React from 'react'
import { Spin } from "antd";
import { useSelector } from "../redux-store/reducer";

function FullPageLoader() {
    const isLoading = useSelector(state => state.app.isLoading);
    return (
        <div className='full-page-loader'>
            {isLoading && (
                <div>
                    <Spin size="large" fullscreen style={{zIndex: 999999}} />
                </div>
            )}
        </div>
    )
}

export default FullPageLoader