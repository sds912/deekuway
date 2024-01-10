import React from 'react';
import Carousel from 'react-multi-carousel';
import './PostListCarousel.css';
import { LikeOutlined } from '@ant-design/icons';




const PostListCarousel = ({postToHomePage, posts, selectedPost}) => {
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
    postToHomePage(post);
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
        <div className='carousel-image mx-3' style={{backgroundImage: `url(${post.images[0]})`}}>
          <div class="overlay p-4">
            <div  style={{position: 'absolute', bottom: '12px', width: '60%'}}>
                <h4 className='text-white'  style={{fontSize: "16px", fontWeight: 'bold'}}>{post.title.capitalize()}</h4>
                <div className='text-white'  style={{fontSize: "12px"}}>{post.price} F cfa / {post.priceBy}</div>
                <div className='text-white'  style={{fontSize: "10px"}}> <i className='fa fa-map-marker'></i> {post.address}</div>
                <div className='text-white' style={{fontSize: "10px"}}>{new Date(post.createdAt.toDate()).toLocaleString()}</div>
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
