import React, { useCallback } from 'react';
import './HomePageMobile.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { Modal, Pagination, message } from 'antd';
import PostListCarousel from '../../components/PostListCarousel/PostListCarousel';
import PostListMobile from '../../components/PostListMobile/PostListMobile';
import firebase from '../../services/firebaseConfig';
import {  SearchOutlined } from '@ant-design/icons';
import Loader from '../../components/Loader/Loader';
import PostFilter from '../../components/PostFilter/PostFilter';
import { useMediaQuery } from 'react-responsive';
import NavBar from '../../components/NavBar/NavBar';
import { MobileNavBar } from '../../components/MobileNavBar/MobileNavBar';
import { BottomNav } from '../../components/BottomNav/BottomNav';
import filter from '../../assets/filter.svg';
import ReactSimpleImageViewer from 'react-simple-image-viewer';


const  HomePageMobile = () => {

	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
	const [post, setPost] = useState(null);
	const [posts, setPosts] = useState([]);
	const [pageSize, setPageSize] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(100);
	const [messageApi, contextHolder] = message.useMessage();
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
	
  const handlePostFromPostList = (post) => {
   setPost(post);
  };

  const fetchData = async (mode = 'all', search = null, page = 1, size = 10, type = null) => {
  setLoading(true);
  let query = firebase.firestore().collection('posts');

  if (mode === 'location') {
    query = query.where('mode', '==', 'location');
  } else if (mode === 'vente') {
    query = query.where('mode', '==', 'vente');
  }
  if (search !== null) {
    query = query.where('title', '>=', search);
  }

  if (type !== null && type !== 'all') {
    query = query.where('type', '==', type);
  }
  
  query = query.orderBy('createdAt');

  const startAt = (page - 1) * size;
  query = query.startAt(startAt).limit(size);
  query.onSnapshot((snapshot) => {
      const modifiedPosts = [];
      snapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        const postData = {
          id: doc.id,
          ...doc.data()
        };
        if (change.type === 'added') {
          modifiedPosts.push(postData);
        } else if (change.type === 'modified') {
          const index = modifiedPosts.findIndex((post) => post.id === postData.id);
          if (index !== -1) {
            modifiedPosts[index] = postData;
          }
        } else if (change.type === 'removed') {
          const filteredPosts = modifiedPosts.filter((post) => post.id !== postData.id);
          modifiedPosts = filteredPosts;
        }
      });
  
      setPosts(modifiedPosts);
      setMode(mode);
    });
    setLoading(false);

  };
  

  const search = (event) => {
    fetchData(mode, event.target.value, currentPage, pageSize, null);
  }
 


  useEffect(() => {
   fetchData(mode);
   getUserFavorites();
 // Clean up the listener when unmounti
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
    fetchData(mode, search, currentPage, pageSize);
  }

 const openFilter = () => {
    setIsFilterModalVisible(true);
 }

 const toggleType = (type) =>{
  setType(type);
  fetchData(mode, null, currentPage, pageSize, type);
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

 

	return(
    <>
    {isViewerOpen && post && (
			  <div style={{marginTop: '4px !important'}}>	
        <ReactSimpleImageViewer
				src={ post.images }
				currentIndex={ currentImage }
				disableScroll={ false }
				closeOnClickOutside={ true }
				onClose={ closeImageViewer }
				 
				/> </div>
			)}
     {!isTabletOrMobile &&<NavBar />}
          {isTabletOrMobile &&<MobileNavBar />}
		<div className="HomePage container p-2 mt-5 mb-5" style={{ backgroundColor: '#F4F4F4', position: 'relative', height: '100vh'}}>

      {loading && <Loader />}
      <div className='d-flex justify-content-start align-items-center my-3 mt-4'>
          <div className={mode === 'all' ? 'mode active-mode': 'mode'} onClick={() => filterByMode('all')}>Tous</div>
          <div className={mode === 'location' ? 'mode active-mode': 'mode'} onClick={() => filterByMode('location')}>Location</div>
          <div className={mode === 'vente' ? 'mode active-mode' : 'mode'} onClick={() => filterByMode('vente')}>Vente</div>
      </div>
      <div>
        <div className='search-filter mt-1 mb-3'>
          <SearchOutlined className='search-icon mx-2' />
          <input type='search' placeholder='Rechercher un appart ...' onKeyUp={search} />
          <button className='btn btn-dark filter-icon'  onClick={openFilter}>
          <img style={{width:'32px'}} src={filter} alt='filter' />
          </button>
        </div>
        
      </div>

      <div className='d-flex mb-4 type-buttons' style={{overflowX:'auto'}}>
        <div className={type === 'all'?'type type-active': 'type'} onClick={() => toggleType('all')} >Tous</div>
        <div className={type === 'appartement'?'type type-active': 'type'} onClick={() => toggleType('appartement')}>Appart</div>
        <div className={type === 'studio'?'type type-active': 'type'} onClick={() => toggleType('studio')}>Studio</div>
        <div className={type === 'maison'?'type type-active': 'type'} onClick={() => toggleType('maison')}>Maison</div>
        <div className={type === 'bureau'?'type type-active': 'type'} onClick={() => toggleType('bureau')}>Bureau</div>
        <div className={type === 'magasin'?'type type-active': 'type'} onClick={() => toggleType('magasin')}>Magasin</div>
      </div>
			<div style={{paddingBottom: '100px'}}>
				{contextHolder}
				{posts && <PostListCarousel postToHomePage={handlePostFromPostList}  posts={posts} selectedPost={post}  />}
        <h2 className='text-muted fw-bold pb-1 pt-5' style={{fontSize: '22px'}}>Derniéres Annonces</h2>
				<PostListMobile postToHomePage={handlePostFromPostList}   posts={posts} selectedPost={post} favorites={favorites} openImageViewer={openImageViewer}  />
        <div className='w-100 text-center mt-3'>
        <Pagination
          pageSize={pageSize}
          total={totalPage * pageSize} // Set total count based on pageSize and totalPages
          current={currentPage}
          onChange={onPageChange}
          style={{ borderColor: 'orange' }}
          hideOnSinglePage={true}
        />
        </div>
			</div>

      <Modal
        title='Filtrer par ...'
        visible={isFilterModalVisible}
        onCancel={handleFilterCancelModal}
        footer={false}
      >
        <PostFilter onPostListFilter={(posts) => { setPost(posts); setIsFilterModalVisible(false)}} screen='Mobile' />
      </Modal>
     
		</div>
    {isTabletOrMobile && <BottomNav />}

    </>

	)
	
}

export default HomePageMobile;