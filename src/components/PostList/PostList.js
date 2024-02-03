import React from 'react';
import { List } from 'antd';
import './PostList.css'
import 'moment/locale/fr';

import { PostCardW } from '../PostCardW/PostCardW';
import { Zoom } from 'react-awesome-reveal';

const PostList = ({
  postToHomePage, 
  posts, 
  display='grid', 
  screen, 
  reloadData,
  allReadyViewed,
  openImageViewer}) => {
    
  return (
    <>
    <div className='PostList'>
      <div className='custom-scrollbar p-3 pt-3' style={{minHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
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
