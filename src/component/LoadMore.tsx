import { Button } from 'antd'
import React from 'react'

interface ILoadMore {
    onClick: () => void;
    isLoading: boolean;
}
function LoadMore({ isLoading, onClick }: ILoadMore) {
    return (
        <div className='load-more'>
            <Button
                type='primary'
                onClick={onClick}
                disabled={isLoading}>Load More</Button>
        </div>
    )
}

export default LoadMore