import React, { useEffect, useState } from 'react';
import './AccountPage.css';
import PostListMobile from '../../components/PostListMobile/PostListMobile';
import data from '../../assets/data.json';
import { Avatar, Modal, Pagination } from 'antd';
import firebase from '../../services/firebaseConfig';
import { EditOutlined } from '@ant-design/icons';
import { EditProfilForm } from '../../components/EditProfilForm/EditProfilForm';

export const AccountPage = () =>{

	const [posts, setPosts] = useState([]);
	const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
	const [isModalVisible, setIsModalVisible] = useState(false);


	const onPageChange = (page,size)=>{
		setCurrentPage(page);
	 }

	 const handleCancelModal = () =>{
		setIsModalVisible(false);
	 }

	 const openEditProfil = () =>{
		setIsModalVisible(true);
	 }
	useEffect(() => {
       setPosts(data.posts);
	},[])
	return(
		<div className="AccountPage container py-5" >
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
           <PostListMobile posts={posts} />
		   <div className='w-100 text-center mt-3'>
          <Pagination 
          pageSize={pageSize}  
          total={totalPage} 
          current={currentPage} 
          onChange={onPageChange}
          style={{borderColor: 'orange'}}
		  className='mb-5'
          hideOnSinglePage={true}
            />
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
	)
}