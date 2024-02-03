import React, { useEffect, useState } from 'react';
import './AccountPage.css';
import PostListMobile from '../../components/PostListMobile/PostListMobile';
import { Avatar, Modal, Pagination } from 'antd';
import firebase from '../../services/firebaseConfig';
import { EditOutlined } from '@ant-design/icons';
import { EditProfilForm } from '../../components/EditProfilForm/EditProfilForm';
import { BottomNav } from '../../components/BottomNav/BottomNav';
import { useMediaQuery } from 'react-responsive';
import Loader from '../../components/Loader/Loader';

export const AccountPage = () =>{

	const [posts, setPosts] = useState([]);
	const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })


	const onPageChange = (page,size)=>{
		setCurrentPage(page);
	 }

	 const handleCancelModal = () =>{
		setIsModalVisible(false);
	 }

	 const openEditProfil = () =>{
		setIsModalVisible(true);
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
	 
	useEffect(() =>  {
	 loadData();
      
	},[]);

	const loadData = () => {
		setLoading(true);
		loadPageTotal();	
		firebase.auth().onAuthStateChanged(user => {
		  const postRef =  firebase.firestore().collection('posts');
		  let query = postRef.where('owner.uid','==', user.uid);
		  query = query.limit(5);
	
		   query.get().then(res =>{
			const dataList = [];
			res.docs.forEach( (d) => {
				dataList.push({
					id: d.id,
					...d.data()
				})
			})
			setPosts(dataList);
			setLoading(false);
		   })
		})
	}


	return(
		<>
		{loading && <Loader />}
		<div className="AccountPage container py-2 pb-5" >
			<div className='d-flex justify-content-between align-items-center p-4 border-bottom'>
				<div className='d-flex justify-content-start align-items-center px-2 py-3'>
				<div>
					<Avatar />
				</div>
				<div className='ms-2'>
					<span>{firebase.auth()?.currentUser?.displayName}</span> <br />
					<span className='text-muted' style={{fontSize: '11px'}}>{firebase.auth()?.currentUser?.email}</span>
					</div>
				</div>
				<EditOutlined onClick={openEditProfil} />
			</div>
			
           <h2 className='text-muted fw-bold pb-1 pt-3' style={{fontSize: '12.6px'}}>Mes Annonces</h2>
          { posts && <PostListMobile
		   posts={posts} 
		   postToHomePage={() =>{}} 
		   favorites={[]} selectedPost={null} 
		   reloadData={loadData}
		   allReadyViewPost={[]}
		   openImageViewer={() => {}}
		   screen = {'account'}
		    />}
		   <div className='w-100 text-center mt-3'>
          {posts.length > 0 &&<Pagination 
          pageSize={pageSize}  
          total={totalPage} 
          current={currentPage} 
          onChange={onPageChange}
          style={{borderColor: 'orange'}}
		  className='mb-5'
          hideOnSinglePage={true}
            />}
        </div>
			<Modal
				title='Editer mon profile'
				visible={isModalVisible}
				onCancel={handleCancelModal}
				footer={false}
			>
				<EditProfilForm user={firebase.auth()?.currentUser} />
			</Modal>

		</div>
		{isTabletOrMobile && <BottomNav />}

		</>
	)
}