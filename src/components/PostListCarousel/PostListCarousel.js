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
      <Carousel responsive={responsive} shouldResetAutoplay={true} autoPlay={true} arrows={false} >
        {posts.map(post =>
        <Card
        key={post.id}
        bodyStyle={{padding: '5px', paddingTop: '0', position: 'relative', height:'85px', fontSize: '11.6px !important', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', backgroundColor: post?.id === selectedPost?.id ? '#daffca': 'inherit'}}
          className='mx-2'
          cover={
            <div style={{position: 'relative', height: '90px', backgroundColor: '#FFFFFF'}}>
              <img
                alt={post.title}
                src={post.images[0]}
                style={{width: "100%"}}
                onClick={() => onPostClicked(post)}
              />
              <div style={{position: 'absolute', backgroundColor:"#3a3a3a78", bottom: '4px', fontSize: '12px', left: '0', right: '0', color: '#FFFFFF'}} className='fw-bold p-1 '>
               CFA {post.price} | P. le {post.createdAt}
              </div>
            </div>
            
          }
        >
          <Text className='mb-3 fw-bold' style={{fontSize: '11px',lineHeight: '12px'}}>{post.title}</Text>
          <Meta
          className='mt-3'
          style={{position: 'absolute', bottom: "12px"}}
            avatar={<Avatar src={post.owner.avatar} />}
            title={<pan style={{fontSize: '11px'}}>{ post.owner.name}</pan>}
          />
        </Card>)}
      </Carousel>
    
    </div>
    </>
  );
};

export default PostListCarousel;
