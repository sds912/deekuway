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
 


  useEffect(() => {
   fetchData(mode,null, currentPage, pageSize);
   loadBoostedPosts(mode);
   loadPageTotal();
 // Clean up the listener when unmounti
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

 const openFilter = () => {
    setIsFilterModalVisible(true);
 }

 const toggleType = (type) =>{
  setType(type);
  fetchData(mode, null, currentPage, pageSize, type);
  loadPageTotal(type)
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
				<div className='search-filter mt-5 mb-3' style={{width: '330px'}}>
					<SearchOutlined className='search-icon mx-2' />
					<input type='search' placeholder='Entrer une addresse ....'  />
				</div>
				<div className='d-flex justify-content-end align-items-center'>
                   <button className={display === 'list' ?'mx-3 btn-filter btn-filter-active': 'mx-3 btn-filter'} onClick={() => setDispaly('list')}>
					<i className='fa fa-list'></i>
				   </button>
				   <button className={display === 'grid' ? 'btn-filter btn-filter-active': 'btn-filter'} onClick={() => setDispaly('grid')}>
					<i className='fa fa-th-large'></i>
				   </button>
				   <button className='mx-3 btn-filter' onClick={() =>{}}>
					<i className='fa fa-map-marker'></i>
				   </button>
				   <Select  className="fw-bold" onChange={() =>{}} defaultValue={'all'} style={{width: '110px'}}>
					<Select.Option value={'all'}   >Tous</Select.Option>
					<Select.Option value={'location'}>Location</Select.Option>
					<Select.Option value={'vente'}>Vente</Select.Option>
				   </Select>
				</div>

			</div>
	   </div>
	 
		<div className="HomePage container-fluid  pt-2 mt-3">
			{contextHolder}
			
			<div className='row px-3'>
				<div className='col-md-3'>
					<PostFilterSide />
				</div>
				<div className='col-12 col-md-9 p-2 ' style={{marginTop: '140px', zIndex: '1'}} >
					{
					<PostList display={display} posts={posts} postToHomePage={() => {}}  /> 
					}
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
	);
	
}

export default HomePage;