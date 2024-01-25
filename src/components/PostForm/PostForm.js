import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from '../../services/firebaseConfig'; 
import { message } from 'antd';
import './PostForm.css';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
  } from 'react-places-autocomplete';
import Loader from '../Loader/Loader';
import { ArrowLeftOutlined, ArrowRightOutlined, CloseCircleOutlined, EnvironmentOutlined, FileAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
  

export const  PostForm = ({closeModel}) => {
    const auth = firebase.auth();
	const firestore = firebase.firestore();
	const storage  = firebase.storage();
	const [messageApi, contextHolder] = message.useMessage();
	const [address, setAddress] = useState('');
	const [step, setStep] = useState(1);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);
	const {register, handleSubmit, setValue, watch, reset,  getValues, formState: { errors },} = useForm();
	const [selectedType, setSelectedType] = useState(null);
	const [selectedMode, setSelectedMode] = useState(null);
	const types = [
		{
		name: "Appart",
		value: "appartement",
		icon: <i class="fa fa-home" aria-hidden="true"></i>
	   },
	   {
		name: "Studio",
		value: "studio",
		icon: <i class="fa fa-home" aria-hidden="true"></i>
	   },
	   {
		name: "Chambre",
		value: "chambre",
		icon: <i class="fa fa-home" aria-hidden="true"></i>
	   },
	   {
		name: "Maison",
		value: "maison",
		icon: <i class="fa fa-home" aria-hidden="true"></i>
	   },
	   {
		name: "Bureau",
		value: "bureau",
		icon: <i class="fa fa-home" aria-hidden="true"></i>
	   },
	   {
		name: "Magasin",
		value: "magasin",
		icon: <i class="fa fa-home" aria-hidden="true"></i>
	   }
       ];
	const otherRooms = [
		{
			id: '1',
			name: 'Sallon',
			value: 'sallon'
		},
		{
			id: '2',
			name: 'Salle bain',
			value: 'bathroom'
		},
		{
			id: '3',
			name: 'Toilette',
			value: 'toilet'
		},
		{
			id: '4',
			name: 'Balcon',
			value: 'balcon'
		},
		{
			id: '5',
			name: 'Espace familiale',
			value: 'espacefamiliale'
		},
		{
			id: '6',
			name: 'Cuisine',
			value: 'kitchen'
		},
	]   

    const navigate = useNavigate();
	
	const handleChange = (address) => {
	  setAddress(address);
	};

	const handleImageChange = (e) => {
		const selectedImages = Array.from(e.target.files);
		const newImages = Array.from(new Set([...images, ...selectedImages]));
		setImages(newImages);
	  };
  
	const handleSelect = async (address) => {
	  try {
		const results = await geocodeByAddress(address);
		const latLng  = await getLatLng(results[0]);
		setValue('latitude', latLng.lat);
		setValue('longitude',latLng.lng);
        setValue('address', address);
		setAddress(address);
	  } catch (error) {
		message.error(error);
	  }
	};

	const onCloseModel = () => {
		closeModel()
	}

	  const onAddPost = async (data) => {
		setLoading(true);
		firebase.auth().onAuthStateChanged( async user => {
			if(user){
			const userRef = firebase.firestore().collection('user').doc(user.uid);
			const userData =  (await userRef.get()).data();
		    const imageUrls = await Promise.all(images.map(async (imageFile) => {
			const storageRef = storage.ref(`images/${imageFile.name}`);
			  await storageRef.put(imageFile);
			  return await storageRef.getDownloadURL();
			}));
			const ownerInfo = {
			  email: userData.email,
			  name: auth.currentUser.displayName,
			  phone: userData.phone,
			  avatar: auth.currentUser.photoURL,
			  uid: auth.currentUser.uid
		  }
		 
		  const postRef = firestore.collection('posts');
		  const postData = { 
			  ...data, 
			  images: imageUrls, 
			  owner: ownerInfo,
			  mode: selectedMode,
			  type: selectedType,
			  price: parseFloat(getValues('price')),
			  createdAt: firebase.firestore.FieldValue.serverTimestamp() };
		  postRef.add(postData)
		  .then(response  => {
		   message.success("Votre annonce a été envoyé avec succès");
		   resetForm();
		   onCloseModel();
		   setLoading(false);
		  })
		  .catch(error => {
		   message.error("Erreur d'envoi");
		   onCloseModel();
		   setLoading(false);
		  });
			} else{
				setLoading(false);
				navigate('/auth');
			}
		});
	
	

	  }

	 const next = () => {
        step < 4 && setStep(step+1)
	  }

	const prev = (event) => {
		event.stopPropagation();
        step > 1 && setStep(step-1);
	  }

	const removeImage = (index) => {
	   const toRemove =	images.find((v,i) => i === index);
	   if(toRemove){
		  setImages(images.filter(v => v !== toRemove))
	   }
	}

	const price = watch('price',null);
	const priceBy = watch('priceBy', null);
	const title = watch('title', null);

	const resetForm = () => {
		reset();
		setStep(1);
		setSelectedMode(null);
		setSelectedType(null);
	}

	
	return(
		<div className="container px-0">
			{loading && <Loader />}
			{contextHolder}
			{!loading ? <div>
				<form onSubmit={handleSubmit(onAddPost)} id='add-post-form' key={'add-post-form'}>

			    {step === 1 &&
				<>
					<div className='form-group w-100 my-3'>
						<label className='fw-bold text-muted'>Choisir le type d'annonce (Vente, Location)</label>
						<div className='row mt-2'>
							<div className='col'>
								<label for='post-location' className={(selectedMode === 'location') ? 'p-2 fw-bold location-option location-option-active text-center': 'p-3 fw-bold  location-option text-center'}>
									<i className="fa fa-key" aria-hidden="true"></i>
									<span className='ms-2'>Location</span>
									<input 
									defaultValue={'location'} 
									style={{visibility: 'hidden', position: 'absolute', width:'0px'}} id="post-location" 
									value={'location'} 
									type='radio' 
									name='mode' {...register('mode', {required: true})}
									onChange={(event) => {
										setSelectedMode(event.target.value);
										setValue('mode', event.target.value);
										}}  />
								</label>
							</div> 
							<div className='col'>
								<label for='post-vente'  className={(selectedMode === 'vente') ? 'p-2 fw-bold vente-option vente-option-active text-center': 'p-3 fw-bold vente-option text-center'}>
								<i class="fa fa-money" aria-hidden="true"></i>	
								<span className='ms-2'>Vente</span>	
								<input 
								defaultValue={'vente'} 
								style={{visibility: 'hidden', position: 'absolute', width:'0px'}} 
								id="post-vente" 
								value={'vente'} 
								type='radio' 
								name='mode' {...register('mode', {required: true})}
								onChange={(event) => {
									setSelectedMode(event.target.value);
									setValue('mode', event.target.value);
									}} />
								</label>
							</div> 
							<div className='col'>
								<label for='post-co-loc'  className={(selectedMode === 'co-loc') ? 'p-2 fw-bold vente-option vente-option-active text-center': 'p-3 fw-bold vente-option text-center'}>
								<i class="fa fa-money" aria-hidden="true"></i>	
								<span className='ms-2'>Co-location</span>	
								<input 
								defaultValue={'co-loc'} 
								style={{visibility: 'hidden', position: 'absolute', width:'0px'}} 
								id="post-co-loc" 
								value={'co-loc'} 
								type='radio' 
								name='mode' {...register('mode', {required: true})}
								onChange={(event) => {
									setSelectedMode(event.target.value);
									setValue('co-loc', event.target.value);
									}} />
								</label>
							</div> 
						</div>

					</div>
					<div className='form-group mt-5'>
                       <label className='form-label fw-bold text-muted'>Choisir le type d'appartement</label>
						<div className='row'>
                           {types.map( t => <div className='col-4'>
                              <label for="type" className='mt-3 type-item' 
							   onClick={() => {
								setSelectedType(t.value);
								setValue('type', t.value);
								}}
							  style={{width: '100%', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '7px', border: '1px solid #e5e5e5', fontWeight: 'bold', backgroundColor: selectedType === t.value ? '#ffb703':  ''}}>
								{t.icon}
								<span className='ms-2'>{t.name}</span>
							  </label>
						   </div>)}
						</div>

					</div>
				</>}
				{step === 2 && 
					<div className='form-group w-100 mt-5'>
					<label className='form-label fw-bold text-muted'>Ajouter des images (max 10)</label>
					{errors.images && <div className='text-danger'>Veuillez sélectionner des images</div>}
					<div className='row w-100 px-0'>
						<div className='col-6 px-1'>
						<label for="images" style={{height: '120px',width: '100%', display: 'flex', backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc'}}>
							<input
							   id='images'
							   style={{visibility: 'hidden', position: 'absolute'}}
								type="file"
								{...register('images', { required: true })}
								className='form-control w-100'
								onChange={handleImageChange}
								multiple
							/>
							
							<div><FileAddOutlined size={16} /></div>
							<div>{images.length} / 10</div>
						</label>	
						
						</div>
						{images.map((image, index) => (
							<div key={index} className="col-6 px-1 mt-2" style={{position: 'relative'}}>
								<img style={{height: '120px'}} className='img-fluid w-100' key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} /> 
                                <CloseCircleOutlined onClick={() =>removeImage(index)}  style={{position: 'absolute', top: '2px', left: '2px'}} />
						    </div>
						))}
					
					</div>
					
				</div>}		
				{step === 3 &&<div>
					<div className='form-group w-100'>
						<label className='form-label fw-bold text-muted'>Titre votre annonce</label>
						<input type="text"  defaultValue={selectedMode.capitalize() + ' '+ selectedType} {...register("title", {required: true})} className='form-control w-100' />
						{errors.nom && <span className='text-danger'>Veillez renseigner le titre</span>}
					</div>
					<div className='form-group w-100 mt-3'>
						<label className='form-label fw-bold text-muted'>Adresse de localisation</label>
						{
						<PlacesAutocomplete
							value={address}
							onChange={handleChange}
							onSelect={handleSelect}
							searchOptions={{
							componentRestrictions: { country: ['SN']},
							}}
						>
							{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
							<div>
								<input
								{...getInputProps({
									placeholder: 'Adresse de localisation...',
									className: 'form-control w-100',
								})}
								/>
								<div>
								{loading ? <div>Loading...</div> : null}

								{suggestions.map((suggestion) => {
									const style = {
									backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
									display: 'flex',
									alignItems: 'center',
									padding: '5px',
									};

									return (
									<div
										{...getSuggestionItemProps(suggestion, {
										style,
										})}
									>
										<EnvironmentOutlined style={{ marginRight: '5px' }} />
										{suggestion.description}
									</div>
									);
								})}
								</div>
							</div>
							)}
						</PlacesAutocomplete>}
					</div>
					<div className='form-group w-100 mt-3'>
						<label className='form-label fw-bold text-muted'>Prix par (Mois, Jour)</label>
						<div className='d-flex justify-content-between align-items-center'>
						    <input 
							type="number"  
							{...register("price", {required: true, min: 20000, pattern: {value: /^[0-9]*$/,message: 'Entrer un nombre',}})} 
							className='form-control w-100'
							style={{
								borderRight: 'none !important'
							}} />
							<select 
							defaultValue={null}
							className='form-select ms-3' 
							{...register("priceBy",  {required: true})}>
								<option value={null} selected disabled>Par ...</option>
								<option value={'mois'}>Mois</option>
								<option value={'jour'}>Jour</option>
							</select>
						</div>
						{errors.price && <span className='text-danger'>Veillez renseigner le prix</span>}
					</div>
				</div>}
				{step === 4 && <div>
				<div className='row'>
                   <div className='col-12 bg-light border pb-4 mt-4' style={{
					borderRadius: '4px'
				   }}>
					<div className='form-group  mt-3'>
						<label className='form-label fw-bold text-muted'>Nombre de chambre</label>
						<div className='d-flex justify-content-between'>
							{[1,2,3,4,5,6].map (m => <div>
								<input disabled={(selectedType ==='chambre' || selectedType === 'studio' ) && m > 1} type='radio' {...register('bedRooms', {required: true})} value={m} />
								<span className='ms-2 fw-bold'>{m === 6 ? '6+': m}</span>
							</div>)}
						</div>
						{errors.chambre && <span className='text-danger'>Veillez renseigner le nombre de chambre</span>}
						</div>
				   </div>
				   <label className='form-label fw-bold text-muted mt-3'>Autres piéces</label>

				   {otherRooms.map(d => 
				   <div className='col-6'>
						<div className='form-group mt-3'>
						   <input type="checkbox" value={d.value} {...register('otherRooms')} />
						   <span className='ms-2 fw-bold'>{d.name}</span>
						</div>
				   </div>)}
				</div>
				<div className='form-group w-100 mt-3'>
					<label className='form-label fw-bold text-muted'>Description </label>
					<textarea 
					cols={6}
					{...register("description", { required: true })}  
					className='form-control w-100' style={{
						height: '120px !important'
					}} />
					{errors.description && <span className='text-danger'>Veillez Ajouter une description</span>}
				</div>
				</div>}
				
					<div className={step > 1 ?'mt-5 px-2 d-flex justify-content-between align-items-end': 'mt-5 px-2 d-flex justify-content-end align-items-end'}>
						{step > 1 &&    
						<button type='button'  onClick={(event) => prev(event)} className='btn btn-outline-dark'>
							<ArrowLeftOutlined />
							<span className='ms-3 fw-bold'>Précédent</span>
						</button>}
						{step < 4 &&<button type='button' disabled={!(
							(step === 1 && (selectedMode && selectedType)) 
							|| (step === 2 && images.length > 0)
							|| (step === 3 && (price && title && priceBy))
							|| (step === 4)
							)}  onClick={() => next()} className='btn btn-outline-warning'>
							<span className='me-3 fw-bold'>Suivant </span>
							<ArrowRightOutlined />
						</button>}
						{step === 4 && <button type="submit"  className='btn btn-primary fw-bold' > Publier</button>}
					</div>
				</form>
				
			</div>: <Loader />}
		</div>
	)
	
}