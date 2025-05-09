import React from 'react'
import { Spin } from "antd";

interface IFullPageLoader {
    isLoading: boolean
}
function FullPageLoaderWithState({ isLoading }: IFullPageLoader) {
    return (
        <div className='full-page-loader'>
            {isLoading && (
                <div>
                    <Spin size="large" fullscreen />
                </div>
            )}
        </div>
    )
}

export default FullPageLoaderWithState