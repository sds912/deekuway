import React, { useCallback, useState } from 'react';
import './PostCard.css';
import { Avatar, Card, Space, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
const { Text } = Typography;

export const PostCard = ({postToHomePage, post, selectedPost}) => {

	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);
   
	const onPostClicked = (item) => {
		postToHomePage(item);
	  };

	  
  const openImageViewer = useCallback((event,index) => {
	console.log(event)
	setCurrentImage(index);
	setIsViewerOpen(true);
	event.stopPropagation();
  }, []);

  const closeImageViewer = () => {
	setCurrentImage(0);
	setIsViewerOpen(false);
  };
	

   return(
		<div className="PostCard">
			{isViewerOpen && (
			  <div style={{marginTop: '4px !important'}}>	<ReactSimpleImageViewer
				src={ post.images }
				currentIndex={ currentImage }
				disableScroll={ false }
				closeOnClickOutside={ true }
				onClose={ closeImageViewer }
				 
				/> </div>
			)}
			<Card
				bodyStyle={{padding: '6px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', backgroundColor: post?.id === selectedPost?.id ? '#daffca': 'inherit'}} 
				onClick={() =>  onPostClicked(post)}>
				<Space direction="vertical">
				<Space>
					
					{post.images.map((img, index) => <Avatar shape="square"  style={{width: 120, height: 130, display: index !== 0 && 'none', cursor:'pointer'}} src={img} onClick={(event) =>openImageViewer(event,index)} key={index} />)}

					<div>
					<h3 style={{fontSize: 12, fontWeight: 500}}>{post.title}</h3>
					<Text strong className='text-muted'  style={{fontSize: '11px'}}>CFA {post.price} | Publiée le {post.createdAt}</Text>
					<div className='d-flex align-items-center my-2' >
						<Avatar size={22} icon={<UserOutlined />} />
						<span className='fw-bold ms-1 text-muted'  style={{fontSize: '11px'}}>{post.owner.name}</span>
					</div>
					<Text color='#108ee9' style={{fontSize: '11px'}}><i className='fa fa-map-marker'></i> {post.address}</Text>
					<div className='mt-1'>
						<Space>
						<Tag color='#2db7f5'><i className='fa fa-bed'></i> {post.rooms}</Tag>
						<Tag color='#f50'> <i className='fa fa-bath'></i> {post.bathRooms}</Tag>
						<Tag color='#87d068'><i className='fa fa-money'></i> {post.mode}</Tag>
						</Space>
					</div>
					</div>
				</Space>
				</Space>
            </Card>
		</div>
		)
}