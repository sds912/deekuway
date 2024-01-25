import React from 'react';
import { List, Avatar, Card, Space, Typography, Tag, Pagination } from 'antd';
import sofa from '../../assets/sofa.svg';
import bed from '../../assets/bed.svg';
import kitchen from '../../assets/kitchen.svg';
import bathroom from '../../assets/bathroom.svg';
import toilet from '../../assets/toilet.svg';
import { useNavigate } from 'react-router-dom';
import './PostList.css'

const { Text } = Typography;

const PostList = ({postToHomePage, posts, display='grid', screen}) => {

  const navigate = useNavigate();
 
  return (
    <>
    <div className='PostList'>
      <div className='custom-scrollbar p-3 pt-0' style={{minHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
          <List
            grid={{ gutter: 16, column: display === 'grid' ? screen === 'home' ? 3 : 4 : 1 }}
            dataSource={posts}
            renderItem={post => (
              <List.Item  >
                <Card 
                bodyStyle={{padding: '6px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }} 
                onClick={()=>
                 { 
                  if(display === 'grid'){
                    navigate('/posts/'+post.id);
                  }
                  postToHomePage(post);
                }
                 }>
                  
                  <Space className='w-100'  direction={display === 'grid' ? 'vertical': 'horizontal'} >
                        <Avatar 
                        shape="square" 
                        style={{width: display ==='grid' ? '100%' :'180px', height: display ==='grid'? '140px' : '140px'}} 
                        src={post.images[0]} />
				                <Tag style={{position: 'absolute',  left: '12px', top: '12px', fontSize: '7px !important'}} color="#108ee9">{post.type.toUpperCase()}</Tag>

                      <div>
                        <div >
                          <h3 style={{fontSize: 14, fontWeight: 600}}>{post.title}</h3>
                        </div>
                        <div style={{fontSize: '11px'}} className='text-muted'> Publié le {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString(): 'Inconnu'}</div>
                        <div>
                          <Text strong className='text-muted'  style={{fontSize: '12px'}}>CFA {post.price} / {post.priceBy}</Text>
                          <div style={{height: '50px'}}>
                            <Text color='#108ee9' style={{
                              fontSize: '12px'
                            }}><i className='fa fa-map-marker'></i> {post.address}</Text>
                          </div>
                        </div>
                        <div className='mt-1 w-100  d-flex'>
                          {post.bedRooms   && <div className='d-flex align-items-center facilities-state'> <img src={bed} alt='bed' style={{width: '12px'}} className='me-2'  /> {post.bedRooms}</div>}
                          {post.otherRooms && post.otherRooms.includes('sallon')   &&  <div className='ms-3 d-flex align-items-center facilities-state'> <img src={sofa} alt='sofa' style={{width: '16px'}} className='me-2' />  1</div>}
                          {post.otherRooms && post.otherRooms.includes('bathroom')  && <div className='ms-3 d-flex align-items-center facilities-state'> <img src={bathroom} alt='bathroom' style={{width: '12px'}}  className='me-2'  />  1</div>}
                          {post.otherRooms && post.otherRooms.includes('toilet')   && <div className='ms-3 d-flex align-items-center facilities-state'> <img src={toilet} alt='bathroom' style={{width: '12px'}} className='me-2'  />  1</div>}
                          {post.otherRooms && post.otherRooms.includes('kitchen')   && <div className='ms-3 d-flex align-items-center facilities-state'> <img src={kitchen} alt='kitchen' style={{width: '12px'}} className='me-2'  />  1</div>}
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
