import React from 'react';
import { List } from 'antd';
import { PostCard } from '../PostCard/PostCard';

const PostListMobile = ({postToHomePage, posts, selectedPost, favorites}) => {
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={posts}
      renderItem={item => (
        <List.Item  key={item.id}>
          <PostCard postToHomePage={postToHomePage} post={item} selectedPost={selectedPost} inFavorite={favorites.includes(item.id)} />
        </List.Item>)}/>
  );
};

export default PostListMobile;
