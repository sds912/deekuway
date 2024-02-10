import React from 'react';
import { List } from 'antd';
import { PostCard } from '../PostCard/PostCard';

const PostListMobile = ({
  postToHomePage, 
  posts, 
  selectedPost, 
  openImageViewer, 
  screen,
  reloadData,
  allReadyViewPost,
  updatedPost

 }) => {
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={posts}
      renderItem={item => (
        <List.Item  key={item.id}>
          <PostCard 
          postToHomePage={postToHomePage} 
          post={item} 
          selectedPost={selectedPost} 
          inFavorite={false}
          openImageViewer={openImageViewer}
          reloadData={reloadData}
          screen={screen}
          updatedPost={updatedPost}
          allReadyViewPost={allReadyViewPost} />
        </List.Item>)}/>
  );
};

export default PostListMobile;
