
import firebase from '../../services/firebaseConfig';
import moment from 'moment';
import 'moment/locale/fr';
import sofa from '../../assets/sofa.svg';
import bed from '../../assets/bed.svg';
import kitchen from '../../assets/kitchen.svg';
import bathroom from '../../assets/bathroom.svg';
import { useNavigate } from 'react-router-dom';
import { saveAlreadyViewPost } from '../../services/localStorageService';
import { CloseCircleOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, EyeFilled, EyeOutlined, LikeOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Card, Dropdown, Modal, Space, Tag, Typography, message } from 'antd';


export const PostCardW = ({
    post, 
    display, 
    allReadyViewed,
     reloadData,
    openImageViewer,
    postToHomePage,
    screen}) =>{

   const { Text } = Typography;

    const navigate = useNavigate();
    const [messageApi] = message.useMessage();
    const [modal, contextHolder] = Modal.useModal();
    const items = [
		{
		  label: <div>
			<EditOutlined />
			<span  className='ms-2'>Modifier</span> 
		  </div>,
		  key: 'edit',
		},
		{
			type: 'divider',
		},
		{
		  label: <div className='text-danger'>
			<DeleteOutlined />
			<span className='ms-2'>Supprimer</span>
			
		  </div>,
		  key: 'delete',
		}
		
	  ];

    const addToFavorites = async (event, post) => {
		event.stopPropagation();
		reloadData();
		message.success('Ajouté à vos favories !')
	
		try {
		  const favoritesRef = firebase.firestore().collection('favorites');
		  const postRef = firebase.firestore().collection('posts');
	
		  // Check if the post is already in favorites for the current user
		  const querySnapshot = await favoritesRef
		  .where('postUid', '==', post.id)
		  .where('owner.uid', '==', firebase.auth().currentUser.uid).get();
	
		  if (!querySnapshot.empty) {
			// Post already favorited by the user, remove it from favorites
             querySnapshot
			 .docs
			 .forEach( async (doc) => {
				if(doc.data().id === post.id){
					await favoritesRef.doc(doc.id).delete();
			        await postRef.doc(post.id).update({ like: firebase.firestore.FieldValue.increment(-1)});
				}
			 })
			
		  } else {
			// Post not favorited by the user, add it to favorites
			post.like = 1;
			await favoritesRef.add({
				postUid: post.id,
				...post
			});
	
			await postRef.doc(post.id).update({ like: firebase.firestore.FieldValue.increment(1) });
		  }
		} catch (error) {
		  console.error('Error adding/removing from favorites: ', error);
		}
	  };

	  const openEdit = (post) => {

	  }

	  const deletePost = async (post) => {
			firebase.auth().onAuthStateChanged( async user => {
				try {
					const postRef = firebase.firestore().collection('posts').doc(post.id);
					const favoritesRef = firebase.firestore().collection('favorites');
			  
					// Delete the post from Firestore
					await postRef.delete();
			
					// Delete the post from favorites if it exists there
					const favoriteQuerySnapshot = await favoritesRef
					  .where('postUid', '==', post.id)
					  .where('owner.uid', '==', user.uid)
					  .get();
					if (!favoriteQuerySnapshot.empty) {
					  favoriteQuerySnapshot.forEach(async (doc) => {
						await favoritesRef.doc(doc.id).delete();
						reloadData();
						message.success('Supprimé avec succès !');
					  });
					}else{
						reloadData();
						message.success('Supprimé avec succès !');
					}
				  } catch (error) {
					message.error('Erreur de suppression !')
				  }
			})
			
		
      
		
	  }

	  const confirm = (post) => {
	const confirmRef =  modal.confirm({
		  title: 'Confirmation',
		  icon: <ExclamationCircleOutlined />,
		  content: 'Voulez-vous supprimer cette annonce ?',
		  okText:     'Supprimer',
		  cancelText: 'Annuler',
	      okButtonProps: {
			className: 'btn btn-danger'
		  },
		  onOk: () => {
			deletePost(post);
		  },
		  onCancel: () =>{
             confirmRef.destroy()
		  }
		});
	  };

	  const deletePostFromFavorite = async (post) => {
		firebase.auth().onAuthStateChanged( async user => {
			try {
				const favoritesRef = firebase.firestore().collection('favorites');
				const favoriteQuerySnapshot = await favoritesRef
				  .where('postUid', '==', post.id)
				  .where('owner.uid', '==', user.uid)
				  .get();
		  
				if (!favoriteQuerySnapshot.empty) {
				  favoriteQuerySnapshot.forEach(async (doc) => {
					await favoritesRef.doc(doc.id).delete();
					reloadData();
				    message.success('Retiré de vos favoriés !');
					
				  });
				}
			  } catch (error) {
				message.error('Erreur de suppression !');
			  }
		})
		
		
	  }


  
    return  <Card
    className={'post-card'}
    bodyStyle={{
      padding: '6px', 
      position: 'relative',
      boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
      cursor: 'pointer'
      }} 
    onClick={()=>
     { 
      if(display === 'grid'){
        navigate('/posts/'+post.id);
      }
      postToHomePage(post);
      saveAlreadyViewPost(post.id);
    }
     }>

    {screen === 'home' &&
    <button
        onClick={(event) => addToFavorites(event, post)}
        style={{
			position: 'absolute', 
			top: '8px', 
			right: '8px', 
			fontSize:'22px', 
			backgroundColor:'inherit', 
			border: 'none'}}>
        <div className='d-flex justify-content-start align-items-center'>
            <div><span className='text-muted' style={{fontSize: '11px'}}>{post.like}</span></div>
            <div className='ms-1'><LikeOutlined  /></div>
        </div>
    </button>}

    {screen === 'account' &&
    <div style={{
		position: 'absolute', 
		top: '8px', 
		right: '8px', 
		fontSize:'22px', 
		backgroundColor:'inherit', 
		border: 'none'}}>
        <Dropdown
            menu={{
            items,
            onClick: (e) => {
              if(e.key === 'edit'){
                openEdit(post);
              } if(e.key === 'delete'){
                confirm(post);
              }
            }
            }}
            trigger={['click']}>
            <button className='btn btn-outline pr-3' style={{width: '20px'}} onClick={(e) => e.preventDefault()}>
            <Space>
                <MoreOutlined style={{fontSize: '22px', fontWeight: '700'}} />
            </Space>
            </button>
        </Dropdown>
    </div>}

    {screen === 'favorite' &&
    <button
       onClick={(event) => {
        event.stopPropagation();
        deletePostFromFavorite(post);
       }}
      style={{
		position: 'absolute', 
		top: '8px', 
		right: '8px', 
		fontSize:'22px', 
		backgroundColor:'inherit', 
		border: 'none'}}>
        <div className='d-flex justify-content-start align-items-center'>
            <CloseCircleOutlined  />
        </div>
    </button>}
      <Space className='w-100'  direction={display === 'grid' ? 'vertical': 'horizontal'} >
            {post.images.map( (img, index) => 
                <Avatar 
                shape="square"  
                style={{
					width: display ==='grid' ? '100%' :'180px', 
					height: display ==='grid'? '140px' : '140px', 
					display: index !== 0 && 'none', cursor:'pointer'}} 
                src={img} 
                className='post-image'
                onClick={(event) =>openImageViewer(event,index, post)} key={index} /> 
                )}

            <Tag style={
				{position: 'absolute', 
				 left: '12px', 
				 top: '118px', 
				 fontSize: '7px !important',
				 fontWeight: 'bold'
				 }} color="#00000089">{ post.createdAt ? moment(post.createdAt.toDate()).fromNow().toUpperCase(): 'Inconnu'}</Tag>

          {display === 'grid' &&
		  <div style={{
			position: 'absolute', 
			right: '12px', 
			top: '8px',
			padding: "4px",
			borderRadius: "50%",
			backgroundColor: '#FFFFFF'
		  }}>
            <EyeFilled  style={{
				fontSize: '18px', 
				display: 'flex', 
				top: '0', 
				bottom: '0', 
				marginTop: 'auto', 
				marginBottom: 'auto'}} className={(allReadyViewed && allReadyViewed.includes(post.id)) ? 'text-warning': 'text-muted'}  />
		  </div>}
		  {display === 'list' &&
		  <div style={{
			position: 'absolute', 
			left: '12px', 
			top: '15px',
			padding: "4px",
			borderRadius: "50%",
			backgroundColor: '#FFFFFF'
		  }}>
            <EyeFilled  style={{fontSize: '18px', display: 'flex', top: '0', bottom: '0', marginTop: 'auto', marginBottom: 'auto'}} className={(allReadyViewed && allReadyViewed.includes(post.id)) ? 'text-warning': 'text-muted'}  />
		  </div>}
          <div style={{
            height: '150px'
          }}>
              <Text strong className='text-secondary'  style={{fontSize: '15px', textTransform:'uppercase'}}>CFA {post.price} / {post.priceBy}</Text>
            <div className='mt-3 mb-4' >
              <Tag color='#FA8E44'>{post.mode.toUpperCase()}</Tag> <Tag color='#96577F'>{post.type.toUpperCase()}</Tag>
            </div>
            <div>
              <div style={{height: '50px'}}>
                <Text color='#108ee9' style={{
                  fontSize: '12px'
                }}><i className='fa fa-map-marker text-secondary' style={{fontSize: '22px'}}></i> {post.address}</Text>
              </div>
            </div>
            <div className={display === 'list'? 'mt-1 w-100  d-flex justify-content-end px-3': 'mt-1 w-100  d-flex justify-content-start px-3'} style={{
              position: 'absolute',
              bottom: '8px',
              left: '0',
              right: '0'
            }}>
              {post.bedRooms   && <div className='d-flex align-items-center facilities-state'> <img src={bed} alt='bed' style={{width: '12px'}} className='me-2'  /> {post.bedRooms}</div>}
              {post.sallon   &&  <div className='ms-3 d-flex align-items-center facilities-state'> <img src={sofa} alt='sofa' style={{width: '16px'}} className='me-2' /> {post.sallon}</div>}
              {post.bathRooms   &&  <div className='ms-3 d-flex align-items-center facilities-state'> <img src={bathroom} alt='bathroom' style={{width: '16px'}} className='me-2' /> {post.bathRooms}</div>}
              {post.toilet && <div className='ms-3 d-flex align-items-center facilities-state'> <img src={bathroom} alt='bathroom' style={{width: '12px'}}  className='me-2'  /> {post.toilet}</div>}
              {post.otherRooms && post.otherRooms.includes('kitchen')   && <div className='ms-3 d-flex align-items-center facilities-state'> <img src={kitchen} alt='kitchen' style={{width: '12px'}} className='me-2'  />  1</div>}
            </div>
          </div>
      </Space>
    </Card>
}