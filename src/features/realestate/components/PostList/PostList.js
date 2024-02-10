import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import './PostList.css'
import 'moment/locale/fr';

import { PostCardW } from '../PostCardW/PostCardW';
import { Zoom } from 'react-awesome-reveal';
import { getLastSelectedPost } from '../../services/localStorageService';

const PostList = ({
  postToHomePage, 
  posts, 
  display='grid', 
  screen, 
  reloadData,
  allReadyViewed,
  openImageViewer,
  selectedPost }) => {

    const [lastViewedPost, setLastViewedPost] = useState(null);


    useEffect(() => {
       setLastViewedPost(getLastSelectedPost());
    }, [])

    
  return (
    <>
    <div className='PostList'>
      <div className='custom-scrollbar p-3 pt-3' style={{}}>
          <List
            grid={{ gutter: 16, column: display === 'grid' ? screen === 'home' ? 3 : 4 : 1 }}
            dataSource={posts}
            renderItem={(post, index)=> (
            <Zoom>  
				<List.Item  key={index} >
                 <PostCardW
				   post={post}
				   screen={screen}
				   postToHomePage={postToHomePage}
				   reloadData={reloadData}
				   allReadyViewed={allReadyViewed}
				   openImageViewer={openImageViewer}
				   display={display}
           selectedPost={selectedPost}
           lastViewedPost={lastViewedPost}
           updateLastViewedPost={(uid) => setLastViewedPost(uid)}
				  />
              </List.Item>
			  </Zoom>
            )}
          />
      </div>
     
    </div>
    </>
  );
};

export default PostList;
