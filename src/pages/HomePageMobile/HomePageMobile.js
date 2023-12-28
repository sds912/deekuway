import React from 'react';
import './HomePageMobile.css';
import GeolocationMap from '../../components/GeolocationMap/GeolocationMap';
import { useState } from 'react';
import { useEffect } from 'react';
import { Modal, Pagination, message } from 'antd';
import PostListCarousel from '../../components/PostListCarousel/PostListCarousel';
import PostListMobile from '../../components/PostListMobile/PostListMobile';
import firebase from '../../services/firebaseConfig';
import data from '../../assets/data.json';
import { BackwardOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import Loader from '../../components/Loader/Loader';
import PostFilter from '../../components/PostFilter/PostFilter';
import { PostCard } from '../../components/PostCard/PostCard';
import Carousel from 'react-multi-carousel';


const  HomePageMobile = () => {
  const responsive = {
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  }

	const [post, setPost] = useState(null);
	const [posts, setPosts] = useState([]);
	const [reorderedPosts, setReorderedPosts] = useState([]);
	const [pageSize, setPageSize] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(100);
	const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
	const [messageApi, contextHolder] = message.useMessage();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [mode, setMode] = useState('location');
  const [loading, setLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

	const [favorites, setFavorites] = useState([]);

  const handleCancelModal = () => {
    setIsModalVisible(false);

  };

  const handleFilterCancelModal = () => {
    setIsFilterModalVisible(false);

  };
	

  const handlePostFromPostList = (post) => {
   setPost(post);
   setIsModalVisible(true)
   setSelectedPostId(post);
   setReorderedPosts(reorderPosts(post.id));

  };

  const reorderPosts = (selectedPostId) => {
    const selectedPostIndex = posts.findIndex((item) => item.id === selectedPostId);
    if (selectedPostIndex !== -1) {
      const selectedPost = posts[selectedPostIndex];
      const reorderedPosts = [
        selectedPost,
        ...posts.slice(0, selectedPostIndex),
        ...posts.slice(selectedPostIndex + 1),
      ];
      return reorderedPosts;
    }
    return posts;
  };

  const fetchData = async (mode = 'all', search = null) => {
    setLoading(true);
    let query = firebase.firestore().collection('posts');
  
    if (mode === 'location') {
      query = query.where('mode', '==', 'location');
    } else if (mode === 'vente') {
      query = query.where('mode', '==', 'vente');
    }
  
    if (search !== null) {
      query = query.where('title', '>=', search); // Changed '<=' to '>=' for search
    }
  
    query.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        const postData = {
          id: doc.id,
          ...doc.data()
        };
  
        if (change.type === 'added') {
          // Handle added document
          setPosts((prevPosts) => [...prevPosts, postData]);
        } else if (change.type === 'modified') {
          // Handle modified document
          setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postData.id ? postData : post))
          );
        } else if (change.type === 'removed') {
          // Handle removed document
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== postData.id)
          );
        }
      });
  
      setLoading(false);
      setMode(mode);
    });
  };
  

  const search = (event) => {
    fetchData(mode, event.target.value);
  }
 
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
			
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
		  messageApi.open({
			type: 'success',
			content: `Bravo ! votre position a été relevé au lat: ${position.coords.latitude} lng: ${position.coords.longitude}`,
		  });
        },
        (error) => {
			messageApi.open({
				type: 'error',
				content: "Désolé ! nous ne pouvons pas relever votre position pour l'instant",
			  });
        }
      );
    } else {
		messageApi.open({
			type: 'error',
			content: 'Geolocation is not supported by this browser',
		  });
    }
  };

  useEffect(() => {
   fetchData();
   getLocation();
   getUserFavorites();
 // Clean up the listener when unmounting
    
    
  },[]);


  const getUserFavorites = () => {
    const favoritesRef = firebase.firestore().collection('favorites');
  
    favoritesRef.onSnapshot((snapshot) => {
      let updatedFavorites = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          updatedFavorites.push(change.doc.data().id);
        } else if (change.type === 'removed') {
          const removedId = change.doc.data().id;
          updatedFavorites = updatedFavorites.filter(id => id !== removedId);
        }
      });
      setFavorites(updatedFavorites);
    }, (error) => {
      console.error('Error retrieving favorites: ', error);
      setFavorites([]);
    });
  };
  
    

 const filterByMode = (mode) => {
  fetchData(mode);
 }

 const onPageChange = (page,size)=>{
    setCurrentPage(page);
  }

 const openFilter = () => {
    setIsFilterModalVisible(true);
 }

 const handleCarouselChange = (nextSlide) => {
  const selectedPost = posts[nextSlide];
  if (selectedPost) { setPost(selectedPost); 
  }
};

	return(
		<div className="HomePage container p-2 mt-5" style={{ backgroundColor: '#F4F4F4', position: 'relative', height: '100vh'}}>
      {loading && <Loader />}
      <div>
        <div className='search-filter mt-4'>
          <SearchOutlined className='search-icon mx-2' />
          <input type='search' placeholder='Rechercher un appart ...' onKeyUp={search} />
          <button className='btn btn-dark filter-icon' onClick={openFilter}>
            <SettingOutlined />
          </button>
        </div>
        <div className='d-flex justify-content-start align-items-center my-3'>
          <div className={mode === 'all' ? 'mode active': 'mode'} onClick={() => filterByMode('all')}>Tous</div>
          <div className={mode === 'location' ? 'mode active': 'mode'} onClick={() => filterByMode('location')}>Location</div>
          <div className={mode === 'vente' ? 'mode active' : 'mode'} onClick={() => filterByMode('vente')}>Vente</div>
        </div>
      </div>
			<div style={{paddingBottom: '100px'}}>
				{contextHolder}
        <h2 className='text-muted fw-bold pb-1 pt-0' style={{fontSize: '12.6px'}}>Meilleurs Annonces</h2>
				<PostListCarousel postToHomePage={handlePostFromPostList}  posts={posts} selectedPost={post}  />
        <h2 className='text-muted fw-bold pb-1 pt-3' style={{fontSize: '12.6px'}}>Derniéres Annonces</h2>
				<PostListMobile postToHomePage={handlePostFromPostList}   posts={posts} selectedPost={post} favorites={favorites}  />
        <div className='w-100 text-center mt-3'>
          <Pagination 
          pageSize={pageSize}  
          total={totalPage} 
          current={currentPage} 
          onChange={onPageChange}
          style={{borderColor: 'orange'}}
          hideOnSinglePage={true}
            />
        </div>
			</div>
			{post !== null &&
        <Modal
        title=''
        maskClosable={true}
        closable={false}
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={false}
        style={{padding: 0, margin:0, top: 0, left: 0, right: 0, width: '100%',height:'100vh'}}
      >
        {post && userLocation &&<GeolocationMap post={post} userLocation={userLocation} screen={'Mobile'} closeModal={handleCancelModal} /> } 
        
        {reorderedPosts.length > 0 &&
        <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto', marginBottom:'35px', height:'120px', width: '95%', marginLeft: 'auto', marginRight:'auto'}}>
        <Carousel 
        responsive={responsive} 
        arrows={false}
        beforeChange={(nextSlide) => handleCarouselChange(nextSlide)} >
          {reorderedPosts.map((item, index) =>
          <PostCard key={index}  post={item} selectedPost={post} postToHomePage={null} inFavorite={favorites.includes(post.id)}  />   )}
        </Carousel>
        </div>}
      </Modal>
      }

      <Modal
        title='Filtrer par ...'
        visible={isFilterModalVisible}
        onCancel={handleFilterCancelModal}
        footer={false}
      >
        <PostFilter onPostListFilter={(posts) => { setPost(posts); setIsFilterModalVisible(false)}} screen='Mobile' />
      </Modal>
     
		</div>
	)
	
}

export default HomePageMobile;