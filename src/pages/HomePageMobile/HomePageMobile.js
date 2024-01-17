import React, { useCallback } from 'react';
import './HomePageMobile.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { Modal, Pagination, Skeleton, message } from 'antd';
import PostListCarousel from '../../components/PostListCarousel/PostListCarousel';
import PostListMobile from '../../components/PostListMobile/PostListMobile';
import firebase from '../../services/firebaseConfig';
import {  SearchOutlined } from '@ant-design/icons';
import PostFilter from '../../components/PostFilter/PostFilter';
import { useMediaQuery } from 'react-responsive';
import NavBar from '../../components/NavBar/NavBar';
import { MobileNavBar } from '../../components/MobileNavBar/MobileNavBar';
import { BottomNav } from '../../components/BottomNav/BottomNav';
import filter from '../../assets/filter.svg';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import { PostListSkeleton } from '../../components/PostListSkeleton/PostListSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { countPage, getAllPost } from '../../features/post-slice';

const appartkeywords = ["appement", "appart", "Appart", "apartment", "appartment", "appar"];
const studiokeywords = ["studio", "stuio", "Studio"];
const chambrekeywords = ["Chambre", "Chmbre", "chambres"];

const  HomePageMobile = () => {

	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
	const [post, setPost] = useState(null);
	const [posts, setPosts] = useState([]);
	const [boostedPosts, setBoostedPosts] = useState([]);
	const [pageSize, setPageSize] = useState(5);
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
	
  const handlePostFromPostList = (post) => {
   setPost(post);
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
  }
  

  const search = (event) => {
    if(containsKeyword(event.target.value, appartkeywords)){
      fetchData(mode, null, currentPage, pageSize, 'appartement', null);
    } else if(containsKeyword(event.target.value, studiokeywords)){
      fetchData(mode, null, currentPage, pageSize, 'studio', null);
    } else{
      
      fetchData(null, null, currentPage, pageSize, null, null);

    }
  }

  const  containsKeyword =  (inputString, keywords) => {
    
  
    // Convert the input string to lowercase for case-insensitive matching
    const lowerCaseInput = inputString.toLowerCase();
  
    // Check if any keyword is present in the lowercased input string
    const containsKeyword = keywords.some(keyword => lowerCaseInput.includes(keyword.toLowerCase()));
  
    return containsKeyword;
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

    
  }
 


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
    <div style={{height: '20px'}}></div>
		<div className="HomePage container p-2 mt-5 mb-5" style={{ backgroundColor: '#F4F4F4', position: 'relative', height: '100vh'}}>
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

      <div className='d-flex mb-4 type-buttons py-3' style={{overflowX:'auto'}}>
        <div className={type === 'all'?'type type-active': 'type'} onClick={() => toggleType('all')} >Tous</div>
        <div className={type === 'appartement'?'type type-active': 'type'} onClick={() => toggleType('appartement')}>Appart</div>
        <div className={type === 'studio'?'type type-active': 'type'} onClick={() => toggleType('studio')}>Studio</div>
        <div className={type === 'maison'?'type type-active': 'type'} onClick={() => toggleType('maison')}>Maison</div>
        <div className={type === 'bureau'?'type type-active': 'type'} onClick={() => toggleType('bureau')}>Bureau</div>
        <div className={type === 'magasin'?'type type-active': 'type'} onClick={() => toggleType('magasin')}>Magasin</div>
      </div>
			 <div style={{paddingBottom: '100px'}}>
				{contextHolder}
				{boostedPosts && !loading && <PostListCarousel  posts={boostedPosts}  />}
        {loading &&  <div className='d-flex justify-content-center'>
         <Skeleton.Image style={{width: '95vw', height: '160px', borderRadius: '20px'}} /> 
        </div>}
        <h2 className='text-muted fw-bold pb-1 pt-5' style={{fontSize: '22px'}}>Derniéres Annonces</h2>
				{!loading && <PostListMobile postToHomePage={handlePostFromPostList}   posts={posts} selectedPost={post} favorites={favorites} openImageViewer={openImageViewer} screen={'home'}  />}
        {loading &&  <PostListSkeleton />}
        <div className='w-100 text-center mt-3'>
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

      <Modal
        title='Filtrer par ...'
        visible={isFilterModalVisible}
        onCancel={handleFilterCancelModal}
        footer={false}
      >
        <PostFilter onPostListFilter={(posts) => {
         setPosts(posts);
         setIsFilterModalVisible(false);
         loadPageTotal();
        }} screen='Mobile' />
      </Modal>
     
		</div>
    {isTabletOrMobile && <BottomNav />}

    </>

	)
	
}

export default HomePageMobile;