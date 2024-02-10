import React from "react";
import { Card, Skeleton, Space } from "antd"

export const PostListSkeleton = () => {

    return (
    <>
          {[1,2,3,4,5].map(index => 
          <Card
            key={index}
            bodyStyle={{
                padding: '6px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                backgroundColor: 'inherit',
                position: 'relative',
            }}
            >
            <button
                style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                fontSize: '22px',
                backgroundColor: 'inherit',
                border: 'none',
                }}
            >
                <div className='d-flex justify-content-start align-items-center'>
                <div>
                <Skeleton paragraph={{ rows: 1 , width: 234}}  />
                </div>
                <div className='ms-1'>
                    <Skeleton.Avatar active shape="square" size="small" />
                </div>
                </div>
            </button>
            <Space direction="vertical">
                <Space>
                <Skeleton.Avatar
                    active
                    shape="square"
                    size={120}
                    style={{ cursor: 'pointer' }}
                />
                <div>
                    <Skeleton
                    title={{ width: '80%' }}
                    paragraph={{ rows: 2, width: '100%' }}
                    />
                </div>
                </Space>
            </Space>
    </Card>)}
    </>)

}