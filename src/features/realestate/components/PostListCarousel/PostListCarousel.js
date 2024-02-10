import React from 'react';
import Carousel from 'react-multi-carousel';
import './PostListCarousel.css';
import { LikeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Tag, Typography } from 'antd';

const { Text } = Typography;



const PostListCarousel = ({posts}) => {

  const navigate = useNavigate();
  const responsive = {
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  
  const onPostClicked = (post) => {
    navigate('/posts/'+post.id);
  };

  return (
    <>
    <div className='PostList'>
      <Carousel 
      responsive={responsive} 
      shouldResetAutoplay={true} 
      autoPlay={true} 
      infinite={true}
      arrows={false} >
        {posts.map(post =>
        <div className='carousel-image mx-3' style={{backgroundImage: `url(${post.images[0]})`}} onClick={() => onPostClicked(post)} >
          <div className="overlay p-4">
            <div  style={{position: 'absolute', bottom: '12px', width: '60%'}}>
                <div>
                  <Tag color='#FA8E44'>{post.mode.toUpperCase()}</Tag> <Tag color='#96577F'>{post.type.toUpperCase()}</Tag>
                </div>
                <div className='mt-3'>
					        <Text strong className='text-warning'  style={{fontSize: '15px', textTransform:'uppercase', fontWeight: 'bold'}}>CFA {post.price} / {post.priceBy}</Text>
                </div>
                <Text 
                style={{fontSize: '12px', color: '#FFFFFF'}}>
                  <i 
                  style={{fontSize: '22px'}} 
                  className='fa fa-map-marker text-warning me-2'></i> 
                  {post.address}
                </Text>
            </div>
            
          </div>
          <div className='text-white text-center' style={{position: "absolute", right: '8px', bottom: '8px'}}>
                <LikeOutlined  style={{fontSize: '22px'}} />
                <div style={{fontSize: '11px'}}>{post.like}</div>
          </div>
        </div>
       )}
      </Carousel>
    
    </div>
    </>
  );
};

export default PostListCarousel;
