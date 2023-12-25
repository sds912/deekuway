import React from 'react';
import './HomePageMobile.css';
import GeolocationMap from '../../components/GeolocationMap/GeolocationMap';
import { useState } from 'react';
import { useEffect } from 'react';
import { Modal, message } from 'antd';
import PostListCarousel from '../../components/PostListCarousel/PostListCarousel';
import PostListMobile from '../../components/PostListMobile/PostListMobile';
import firebase from '../../services/firebaseConfig';
import data from '../../assets/data.json';
import { SearchOutlined, SettingOutlined } from '@ant-design/icons';
import Loader from '../../components/Loader/Loader';

const  HomePageMobile = () => {

	const [post, setPost] = useState(null);
	const [posts, setPosts] = useState([]);
	const [pageSize, setPageSize] = useState(5);
	const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
	const [messageApi, contextHolder] = message.useMessage();
	const [isModalVisible, setIsModalVisible] = useState(false);
  const [mode, setMode] = useState('location');
  const [loading, setLoading] = useState(false);

  const handleCancelModal = () => {
    setIsModalVisible(false);

  };
	

  const handlePostFromPostList = (post) => {
    setPost(post);
    setIsModalVisible(true)
  };

  useEffect(() => {
   fetchData();
  // setPosts(data.posts)
  }, []);

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
  const snapshot = await query.get();
  const updatedPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setPosts(updatedPosts);
    setLoading(false)
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
  },[]);

 const filterByMode = (mode) => {
  fetchData(mode);
 // setPosts(data.posts);
  setMode(mode)
 }

	return(
		<div className="HomePage container p-2 mt-5 pb-5" style={{ backgroundColor: '#F4F4F4', position: 'relative', height: '100vh'}}>
      {loading && <Loader />}
      <div>
        <div className='search-filter mt-4'>
          <SearchOutlined className='search-icon mx-2' />
          <input type='search' placeholder='Rechercher un appart ...' onKeyUp={search} />
          <button className='btn btn-dark filter-icon'>
            <SettingOutlined />
          </button>
        </div>
        <div className='d-flex justify-content-start align-items-center my-3'>
          <div className={mode === 'all' ? 'mode active': 'mode'} onClick={() => filterByMode('all')}>Tous</div>
          <div className={mode === 'location' ? 'mode active': 'mode'} onClick={() => filterByMode('location')}>Location</div>
          <div className={mode === 'vente' ? 'mode active' : 'mode'} onClick={() => filterByMode('vente')}>Vente</div>
        </div>
      </div>
			<div className='pb-3'>
				{contextHolder}
        <h2 className='text-muted fw-bold py-3'>Meilleurs Annonces</h2>
				<PostListCarousel postToHomePage={handlePostFromPostList}  posts={posts} selectedPost={post} />
        <h2 className='text-muted fw-bold pb-2 pt-3'>Derniéres Annonces</h2>
				<PostListMobile postToHomePage={handlePostFromPostList}   posts={posts} selectedPost={post} />
			</div>
			{post !== null &&
        <Modal
        title='Détails'
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={false}
        style={{top: 0, left: 0, right: 0, padding: 0}}
      >
        <div style={{ backgroundColor: '#F4F4F4', position: 'relative', height: '90vh', width:'100%'}}>
        {post && userLocation &&<GeolocationMap post={post} userLocation={userLocation} screen={'Mobile'} /> } 
        <div className=' w-100' style={{position: 'absolute', zIndex:'1800', width:'95vw', height: '220px', bottom: '0', left:'8px'}}>
          <PostListCarousel postToHomePage={handlePostFromPostList}   posts={posts} selectedPost={post} />
        </div>
        </div>
      </Modal>
      }
			
		</div>
	)
	
}

export default HomePageMobile;