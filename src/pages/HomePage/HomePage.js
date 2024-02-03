import React, { useCallback } from 'react';
import './HomePage.css';
import PostList from '../../components/PostList/PostList';
import { useState } from 'react';
import { useEffect } from 'react';
import { Pagination, Select, message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { PostFilterSide } from '../../components/PostFilterSide/PostFilterSide';
import { SearchOutlined } from '@ant-design/icons';
import firebase from '../../services/firebaseConfig';
import { useMediaQuery } from '@uidotdev/usehooks';
import { Link, useLocation } from 'react-router-dom';
import GeolocationMap from '../../components/GeolocationMap/GeolocationMap';
import data from '../../assets/data.json';
import { getAllReadyViewPost } from '../../services/localStorageService';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import Loader from '../../components/Loader/Loader';

const  HomePage = () => {
	const [post, setPost] = useState(null);
	const [display, setDispaly] = useState('grid');
	const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
	const [posts, setPosts] = useState([]);
	const [boostedPosts, setBoostedPosts] = useState([]);
	const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
	const [ messageApi ,contextHolder] = message.useMessage();
	const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [mode, setMode] = useState('all');
  const [type, setType] = useState('all');
  const [loading, setLoading] = useState(false);
	const [favorites, setFavorites] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);
  const location = useLocation();
  const [allReadyViewed, setAllReadyViewed] = useState([]);

  const handleFilterCancelModal = () => {
    setIsFilterModalVisible(false);
  };

  const fetchData = async (mode = 'all', search = null, page = 1, size = 10, type = null, budget = null) => {
    setLoading(true);
    let query = firebase.firestore().collection('posts');
  
    if (mode === 'location') {
      query = query.where('mode', '==', 'location');
    } else if (mode === 'vente') {
      query = query.where('mode', '==', 'vente');
    } else if(mode === 'co-loc'){
      query = query.where('mode', '==', 'co-loc');
    }
  
    if (search !== null && search !== '') {
      // Move orderBy to the beginning
      query = query.orderBy('title', 'desc').where('title', '>=', search);
    }
  
    if (type !== null && type !== 'all') {
      query = query.where('type', '==', type);
    }
  
    const budgetFloat = parseFloat(budget);
    if (budget !== null && !isNaN(budgetFloat)) {
      query = query.where('price', '<=', budgetFloat);
    }

    if(search === null){
      // Move orderBy to the end
      query = query.orderBy('createdAt', 'desc');
    }
  
    const startAtIndex = (page - 1) * size;
    if (startAtIndex > 1 && posts.length > 0 && startAtIndex >= 0 && posts.length >= startAtIndex) {
      query = query.startAfter(posts[startAtIndex - 1].createdAt);
    }
  
    query = query.limit(size);
  
    const postData = [];
    (await query.get()).docs.forEach((doc) => {
      postData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setPosts(postData);
    setLoading(false);
  };
  

  const loadBoostedPosts = async (mode = null, size = 10) => {
    const boostedPostsRef = firebase.firestore().collection('posts');
    let query = boostedPostsRef
    .where('boosted', '==', true);
    if(mode !== null && mode !== 'all'){
    query = query.where('mode', '==', mode);
    }
    query.limit(size);
    const postData = [];
    (await query.get()).docs.forEach(doc => {
      postData.push({
        id: doc.id,
        ...doc.data()
      })
    })
    setBoostedPosts(postData);
  };
  

  const search = (event) => {
    
      fetchData(null, null, currentPage, pageSize, null, null);

    }
  



  const loadPageTotal = (mode = null, type = null) => {
    let postRef = firebase.firestore().collection('posts');
    if(mode !== null && mode !== 'all'){
    postRef = postRef.where('mode', '==', mode);
    }
    if(type !== null && type !== 'all'){
      postRef = postRef.where('type', '==', type);
      }
    postRef.get().then(res => {
     
     setTotalPage(res.docs.length);
    })

    
  };


  const searchByFilter = async (searchParams, page = 1, size = 10) => {
    setLoading(true);
    let query = firebase.firestore().collection('posts');
  
    const { mode, minPrice, maxPrice, property, bedRooms, otherRooms } = searchParams;

  
  
    if (mode && mode.length > 0) {
      query = query.where('mode', 'in', mode);
    }

    if(bedRooms && bedRooms.length > 0){
        query = query.where('bedRooms', 'in', bedRooms);
    }
  
    if (minPrice && maxPrice) {
      const minPriceFloat = parseFloat(minPrice);
      const maxPriceFloat = parseFloat(maxPrice);
      
      if (!isNaN(minPriceFloat) && !isNaN(maxPriceFloat)) {
        query = query.where('price', '>=', minPriceFloat).where('price', '<=', maxPriceFloat);
      }
    }
  
    if (property && property.length > 0) {
      query = query.where('type', 'in', property);
    }
  

    if (otherRooms && otherRooms.length > 0) {
       console.log(otherRooms)
        query = query.where('otherRooms', 'array-contains-any', otherRooms);

    }
 
  
    const postData = [];
    (await query.get()).docs.forEach((doc) => {
      postData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    console.log(postData);
    setPosts(postData);
    setLoading(false);
  };
  

  

  
 


  useEffect(() => {
    fetchData(mode,null, currentPage, pageSize);
    loadBoostedPosts(mode);
    loadPageTotal();
    setAllReadyViewed(getAllReadyViewPost());
  },[]);
  
    

 const filterByMode = (mode) => {
  setMode(mode);
  loadPageTotal(mode);
  fetchData(mode);
 }

 const onPageChange = (page)=>{
    setCurrentPage(page);
    fetchData(mode, null, page, pageSize, null);
  }



 const openImageViewer = useCallback((event,index, post) => {
	setCurrentImage(index);
	setIsViewerOpen(true);
  setPost(post);
	event.stopPropagation();
  }, []);

  const closeImageViewer = () => {
	setCurrentImage(0);
	setIsViewerOpen(false);
  };




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
 

	return (
       <div>
        {loading && <Loader />}
         {isViewerOpen && post && (
			  <div style={{marginTop: '4px !important'}}>	
        <ReactSimpleImageViewer
				src={ post.images }
				currentIndex={ currentImage }
				disableScroll={ false }
				closeOnClickOutside={ true }
				onClose={ () => closeImageViewer() }
				 
				/> </div>
			)}
       <div className='bg-white'>
	   <div 
	   className='bg-muted'
	   style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				zIndex: '4'
			}}>
	   <NavBar />
	   		<div  className='d-flex justify-content-between align-items-center  px-5'>
				<div className='d-flex justify-content-start align-items-center p-4'>
				 <Link style={{
          textDecoration: 'none',
          color: '#000000'
         }} to={'/'}> <div className={location.pathname === '/' ?'navbar-item navbar-item-active': 'navbar-item'}>Annonces</div> </Link>
				 <Link style={{
          textDecoration: 'none',
          color: '#000000'
         }} to={'/favorites'} ><div className={location.pathname === '/favorites' ?'navbar-item navbar-item-active mx-4': 'navbar-item mx-4'}>Mes favories</div> </Link> 
         	 <Link style={{
          textDecoration: 'none',
          color: '#000000'
         }} to={'/services'} ><div className={location.pathname === '/services' ?'navbar-item navbar-item-active mx-4': 'navbar-item mx-4'}>Services</div> </Link> 
				</div>
				<div className='d-flex justify-content-end align-items-center'>
            <button title='vue en liste' className={display === 'list' ?'mx-3 btn-filter btn-filter-active': 'mx-3 btn-filter'} onClick={() => setDispaly('list')}>
					<i className='fa fa-list'></i>
				   </button>
				   <button title='vue en grille' className={display === 'grid' ? 'btn-filter btn-filter-active': 'btn-filter'} onClick={() => setDispaly('grid')}>
					<i className='fa fa-th-large'></i>
				   </button>
				   <button className='mx-3 btn-filter' title='Actualiser ma position' onClick={() =>{ getLocation()}}>
					<i className='fa fa-map-marker'></i>
				   </button>
				   <Select  className="fw-bold" onChange={(value) =>{
            filterByMode(value);
           }} defaultValue={'all'} style={{width: '110px'}}> 
            <Select.Option value={'all'}   >Tous</Select.Option>
            <Select.Option value={'location'}>Location</Select.Option>
            <Select.Option value={'vente'}>Vente</Select.Option>
            <Select.Option value={'co-loc'}>Co-location</Select.Option>
				   </Select>
				</div>

			</div>
	   </div>
	 
		<div className="HomePage container-fluid"> 
			{contextHolder}
			
			<div className='row px-3'>
				<div className='col-md-3' >
          <div style={{
            position: 'fixed'
          }}>
					 <PostFilterSide onSubmitFilter={searchByFilter}   /> 
          </div>
				</div>
				<div className='col-12 col-md-9 p-2 ' style={{marginTop: '140px', zIndex: '1'}} >
          { display === 'list' && <div className='row'>
            <div className='col-6'>
					    <PostList 
              display={display} 
              posts={posts} 
              postToHomePage={(post) => setPost(post)} 
              allReadyViewed={allReadyViewed}
              screen={'home'}  /> 
            </div>
            <div className='col-6' style={{
              position: 'relative',
              height: 'calc(100vh - 180px)',

            }}>
              <div className='card card-body' style={{
                width: '36%',
                height: 'calc(100vh - 180px)',
                position: 'fixed',
                top: '150px',
                right:'20px'
              }}>
              {post && <GeolocationMap post={post} />}
              </div>
            </div>

          </div>}
					{ display === 'grid' && posts && 
          <PostList 
          display={display} 
          posts={posts} 
          postToHomePage={(post) => setPost(post)} 
          allReadyViewed={allReadyViewed}
          openImageViewer={openImageViewer}
          screen={'home'}  />}
         
					 <div className='p-3 text-center'>
					 {totalPage > 5 && 
					<Pagination
					pageSize={pageSize}
					total={totalPage} // Set total count based on pageSize and totalPages
					current={currentPage}
					onChange={onPageChange}
					style={{ borderColor: 'orange' }}
					hideOnSinglePage={true}
					/>}
					</div>
				</div>
			</div>
		</div>
		</div>
    </div>
	);
	
}

export default HomePage;