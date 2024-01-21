import React, { useEffect } from 'react';
import { List, Avatar, Card, Space, Typography, Tag, Pagination } from 'antd';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import firebase from '../../services/firebaseConfig';
import PostFilter from '../PostFilter/PostFilter';
import { PostCard } from '../PostCard/PostCard';
import sofa from '../../assets/sofa.svg';
import bed from '../../assets/bed.svg';
import kitchen from '../../assets/kitchen.svg';
import bathroom from '../../assets/bathroom.svg';
import toilet from '../../assets/toilet.svg';

const { Text } = Typography;

const PostList = ({postToHomePage, posts, display='grid'}) => {
 
  return (
    <>
    <div className='PostList'>
      <div className='custom-scrollbar p-3' style={{minHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
          <List
            grid={{ gutter: 16, column: display === 'grid' ? 3 : 1 }}
            dataSource={posts}
            renderItem={post => (
              <List.Item  >
                <Card 
                bodyStyle={{padding: '6px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }} 
                onClick={() =>  {}}>
                  <Space className='w-100'  direction={display === 'grid' ? 'vertical': 'horizontal'} >
                        <Avatar className='w-100' shape="square" style={{width: display ==='grid' ? '100%' :180, height: display ==='grid'? 140 : 130}} src={post.images[0]} />
                      <div>
                        <h3 style={{fontSize: 18, fontWeight: 500}}>{post.title}</h3>
                        <div style={{fontSize: '11px'}} className='text-muted'> Publié le {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString(): 'Inconnu'}</div>
                        <div>
                          <Text strong className='text-muted'  style={{fontSize: '12px'}}>CFA {post.price} / {post.priceBy}</Text>
                          <div style={{height: '50px'}}>
                            <Text color='#108ee9'><i className='fa fa-map-marker'></i> {post.address}</Text>
                          </div>
                        </div>
                        <div className='mt-1 w-100  d-flex'>
                          {post.rooms     > 0  && <div className='d-flex align-items-center'> <img src={bed} alt='bed' style={{width: '12px'}} className='me-2'  /> {post.rooms}</div>}
                          {post.salon     > 0  && <div className='ms-3 d-flex align-items-center'> <img src={sofa} alt='sofa' style={{width: '16px'}} className='me-2' />  {post.salon}</div>}
                          {post.bathRooms > 0  && <div className='ms-3 d-flex align-items-center'> <img src={bathroom} alt='bathroom' style={{width: '12px'}}  className='me-2'  />  {post.bathRooms}</div>}
                          {post.toilet    > 0  && <div className='ms-3 d-flex align-items-center'> <img src={toilet} alt='bathroom' style={{width: '12px'}} className='me-2'  />  {post.toilet}</div>}
                          {post.kitchen   > 0  && <div className='ms-3 d-flex align-items-center'> <img src={kitchen} alt='kitchen' style={{width: '12px'}} className='me-2'  />  {post.kitchen}</div>}
                        </div>
                      </div>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
      </div>
     
    </div>
    </>
  );
};

export default PostList;
