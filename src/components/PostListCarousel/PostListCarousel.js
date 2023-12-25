import React from 'react';
import Carousel from 'react-multi-carousel';
import { Avatar, Card, Typography } from 'antd';
import Meta from 'antd/es/card/Meta';
const { Text } = Typography;


const PostListCarousel = ({postToHomePage, posts, selectedPost}) => {
  const responsive = {
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
    }
  };

  
  const onPostClicked = (post) => {
    postToHomePage(post);
  };

  return (
    <>
    <div className='PostList'>
      <Carousel responsive={responsive}>
        {posts.map(post =>
        <Card
        key={post.id}
        bodyStyle={{padding: '8px', position: 'relative', height:'100px', fontSize: '11.6px !important', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', backgroundColor: post?.id === selectedPost?.id ? '#daffca': 'inherit'}}
          className='mx-2'
          cover={
            <div style={{position: 'relative'}}>
              <img
                alt={post.title}
                src={post.images[0]}
                height={112}
                style={{width: "100%"}}
                onClick={() => onPostClicked(post)}
              />
              <div style={{position: 'absolute', backgroundColor:"#2e2f2e3c", bottom: '4px', fontSize: '12px', left: '0', right: '0', color: '#FFFFFF'}} className='fw-bold p-1 '>
               CFA {post.price} | P. le {post.createdAt}
              </div>
            </div>
            
          }
        >
          <Text className='mb-3 fw-bold'>{post.title}</Text>
          <Meta
          className='mt-3'
          style={{position: 'absolute', bottom: "12px"}}
            avatar={<Avatar src={post.owner.avatar} />}
            title={post.owner.name}
          />
        </Card>)}
      </Carousel>
    
    </div>
    </>
  );
};

export default PostListCarousel;
