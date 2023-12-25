import React, { useEffect } from 'react';
import { List, Avatar, Card, Space, Typography, Tag, Pagination } from 'antd';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import firebase from '../../services/firebaseConfig';
import PostFilter from '../PostFilter/PostFilter';

const { Text } = Typography;

const PostList = ({postToHomePage}) => {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [startAfterDoc, setStartAfterDoc] = useState(1);
  const [total, setTotal] = useState(0);
  
  const onPostClicked = (post) => {
    postToHomePage(post);
    setPost(post);
  };

  useEffect(() => {
    countPosts();
    fetchData();
  }, []);

  const fetchData = async () => {
    let query = firebase.firestore().collection('posts')
                 .orderBy('createdAt') // assuming you have a 'createdAt' field
                 .limit(pageSize);
  
    if (startAfterDoc) {
      query = query.startAfter(startAfterDoc);
    }
  
    const snapshot = await query.get();
  
    const updatedPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  
    setPosts(updatedPosts);
  
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
 
    setStartAfterDoc(lastVisible);
  };
  

 const handlePostFilter = (data) =>{
    setPosts(data);
  }

  const handlePageChange = async (page, pageSize) => {
    setCurrentPage(page);
    const pageOffset = (page - 1) * pageSize;
    console.log(posts)
    let query = firebase.firestore().collection('posts')
                 .orderBy('createdAt')
                 .limit(pageSize)
                 .startAt(startAfterDoc || 0)
                 
  
    const snapshot = await query.get();
  
    const updatedPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  
    setPosts(updatedPosts);
  
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    setStartAfterDoc(lastVisible);
  };
  
  
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    // Fetch data based on new page size
  };

  const countPosts = async () => {
    const postRef = firebase.firestore().collection('posts');
  
    try {
      const snapshot = await postRef.get();
      const postCount = snapshot.size; // Number of documents in the collection
      setTotal(postCount);
      return postCount;
    } catch (error) {
      console.error('Error getting documents:', error);
      return 0;
    }
  };
  

  


  return (
    <>
		<PostFilter onPostListFilter={handlePostFilter} />
    <div className='PostList'>
      <div className='custom-scrollbar p-3' style={{height: 'calc(100vh - 180px)', overflowY: 'auto'}}>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={posts}
            renderItem={item => (
              <List.Item  >
                <Card 
                bodyStyle={{padding: '6px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', backgroundColor: post?.id === item?.id ? '#daffca': 'inherit'}} 
                onClick={() =>  onPostClicked(item)}>
                  <Space direction="vertical">
                    <Space>
                        <Avatar shape="square" style={{width: 180, height: 130}} src={item.images[0]} />
                      <div>
                        <h3 style={{fontSize: 18, fontWeight: 500}}>{item.title}</h3>
                        <Text strong>CFA {item.price}</Text>
                        <div className='d-flex align-items-center my-2' >
                          <Avatar size={22} icon={<UserOutlined />} />
                          <span className='fw-bold ms-1 text-muted'>{item.owner.name}</span>
                        </div>
                        <div className='mt-1'>
                          <Space>
                            <Tag color='#2db7f5'><i className='fa fa-bed'></i> {item.rooms}</Tag>
                            <Tag color='#f50'> <i className='fa fa-bath'></i> {item.bathRooms}</Tag>
                            <Tag color='#87d068'><i className='fa fa-thumb-tack'></i> {item.distance} km</Tag>
                            <Text color='#108ee9'><i className='fa fa-map-marker'></i> {item.address}</Text>
                          </Space>
                        </div>
                      </div>
                    </Space>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
      </div>
      <div className='p-3 text-center'>
        <Pagination defaultCurrent={1} current={currentPage} total={total} onChange={handlePageChange} pageSize={10} />
      </div>
    </div>
    </>
  );
};

export default PostList;
