import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from '../../services/firebaseConfig'; 
import { message } from 'antd';
import './PostForm.css';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
  } from 'react-places-autocomplete';
import { ArrowLeftOutlined, ArrowRightOutlined, CloseCircleOutlined, EnvironmentOutlined, FileAddOutlined, FileImageOutlined} from '@ant-design/icons';
import Loader from '../Loader/Loader';
import { getValue } from '@testing-library/user-event/dist/utils';
  

export const  PostForm = ({closeModel}) => {
    const auth = firebase.auth();
	const firestore = firebase.firestore();
	const storage  = firebase.storage();
	const [messageApi, contextHolder] = message.useMessage();
	const [address, setAddress] = useState('');
	const [step, setStep] = useState(1);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);
	const {register, handleSubmit, setValue, getFieldState, watch, getValues, formState: { errors },} = useForm();
	const [selectedType, setSelectedType] = useState(null);
	const [selectedMode, setSelectedMode] = useState(null);
	const [currentUser, setCurrentUser] =  useState();
	const types = [
		{
		name: "Appart",
		value: "appartement"
	   },
	   {
		name: "Studio",
		value: "studio"
	   },
	   {
		name: "Chambre",
		value: "chambre"
	   },
	   {
		name: "Maison",
		value: "maison"
	   },
	   {
		name: "Bureau",
		value: "bureau"
	   },
	   {
		name: "Magasin",
		value: "magasin"
	   }
  ];
	


    const mode = watch('mode')
	const type = watch('type');

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
		console.error('Error:', error);
	  }
	};

	const onCloseModel = () => {
		closeModel()
	}

	useEffect(() =>{
      setCurrentUser(auth.currentUser);
	},[])
	  const onAddPost = async (data) => {
		if(auth.currentUser){
			const userRef = firebase.firestore().collection('user').doc(auth.currentUser.uid);
			 const userData =  (await userRef.get()).data();
			setLoading(true);
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
			   price: parseInt(getValue('price')),
			   createdAt: firebase.firestore.FieldValue.serverTimestamp() };
		   postRef.add(postData)
		   .then(response  => {
			message.success("Votre annonce a été envoyé avec succès");
			onCloseModel();
			setLoading(false);
		   })
		   .catch(error => {
			message.error("Erreur d'envoi");
			onCloseModel();
			setLoading(false);
		   });

		}
	

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
	
	return(
		<div className="container px-0">
			{contextHolder}
			{!loading ? <div>
				<form onSubmit={handleSubmit(onAddPost)}>

			    {step === 1 &&
				<>
					<div className='form-group w-100 my-3'>
						<label>Choisir le type d'annonce (Vente, Location)</label>
						<div className='row mt-2'>
							<div className='col'>
								<label for='location' className='p-3 fw-bold location-option text-center' style={{display: 'block', width: '100%', backgroundColor: selectedMode === 'location' ? '#ffb703': 'transparent'}}>
									Location
									<input defaultValue={null} style={{visibility: 'hidden', position: 'absolute'}} id="location" value={'location'} type='radio' name='mode' {...register('mode', {required: true})} onChange={() => setSelectedMode('location')} />
								</label>
							</div> 
							<div className='col'>
								<label for='vente'  className='p-3 fw-bold vente-option text-center' style={{display: 'block', width: '100%', backgroundColor: selectedMode === 'vente' ? '#ffb703': 'transparent'}}>
								Vente	
								<input defaultValue={null} style={{visibility: 'hidden', position: 'absolute'}} id="vente" value={'vente'} type='radio' name='mode' {...register('mode', {required: true})} onChange={() => setSelectedMode('vente')} />
								</label>
							</div> 
						</div>

					</div>
					<div className='form-group mt-5'>
                       <label className='form-label'>Choisir le type d'appartement</label>
						<div className='row'>
                           {types.map( t => <div className='col-4'>
                              <label for="type" className='mt-3' 
							   onClick={() => {
								setSelectedType(t.value);
								setValue('type', t.value);
								}}
							  style={{width: '100%', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '7px', border: '1px solid #e5e5e5', fontWeight: 'bold', backgroundColor: selectedType === t.value ? '#ffb703':  'transparent' }}>
								{t.name}
							  </label>
						   </div>)}
						</div>

					</div>
				</>}
				{step === 2 && 
					<div className='form-group w-100 mt-5'>
					<label className='form-label'>Ajouter des images (max 10)</label>
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
						<label className='form-label'>Titre de l'annonce</label>
						<input type="text"  {...register("title", {required: true})} className='form-control w-100' />
						{errors.nom && <span className='text-danger'>Veillez renseigner le titre</span>}
					</div>
					<div className='form-group w-100 mt-3'>
						<label className='form-label'>Adresse de localisation</label>
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
							</PlacesAutocomplete>
					</div>
					<div className='form-group w-100 mt-3'>
						<label className='form-label'>Prix par (Mois, Jour)</label>
						<div className='d-flex justify-content-between align-items-center'>
						    <input type="number"  {...register("price", {required: true, min: 20000, pattern: {value: /^[0-9]*$/,message: 'Please enter only numbers',}})} className='form-control w-100' />
							<select className='form-select' {...register("priceBy",  {required: true})}>
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
                   <div className='col-6'>
					<div className='form-group  mt-3'>
						<label className='form-label'>Chambre(s)</label>
						<select className='form-select' {...register("rooms",  {required: true})}>
						  <option value={0} selected>0</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
						</select>
						{errors.chambre && <span className='text-danger'>Veillez renseigner le nombre de chambre</span>}
						</div>
				   </div>
				   <div className='col-6'>
						<div className='form-group mt-3'>
						   <label className='form-label'>Sallon(s)</label>
						   <select className='form-select' {...register("salon", {required: true})}>
						        <option value={0} selected>0</option>
								<option value={1}>1</option>
								<option value={2}>2</option>
								<option value={3}>3</option>
								<option value={4}>4</option>
								<option value={5}>5</option>
							</select>
							{errors.toilette && <span className='text-danger'>Veillez renseigner nombre de salle de bain</span>}
						</div>
				   </div>
                   <div  className='col-6'>
						<div className='form-group mt-3'>
						   <label className='form-label'>Salle(s) de bain</label>
						   <select className='form-select' {...register("bathRooms", {required: true})}>
						        <option value={0} selected>0</option>
								<option value={1}>1</option>
								<option value={2}>2</option>
								<option value={3}>3</option>
								<option value={4}>4</option>
								<option value={5}>5</option>
							</select>
							{errors.toilette && <span className='text-danger'>Veillez renseigner nombre de salle de bain</span>}
						</div>
				   </div>
                   <div className='col-6'>
				   		<div className='form-group  mt-3'>
						   <label className='form-label'>Toilette(s)</label>
						   <select className='form-select' {...register("toilet",{required: true})}>
						       <option value={0} selected>0</option>
								<option value={1}>1</option>
								<option value={2}>2</option>
								<option value={3}>3</option>
								<option value={4}>4</option>
								<option value={5}>5</option>
							</select>
							{errors.toilette && <span className='text-danger'>Veillez renseigner nombre de salle de bain</span>}
						</div>
				   </div>
				   
				</div>
				<div className='form-group w-100 mt-3'>
					<label className='form-label'>Description </label>
					<textarea rows={5} {...register("description", { required: true })}  className='form-control w-100' />
					{errors.description && <span className='text-danger'>Veillez Ajouter une description</span>}
				</div>
				</div>}
				
					<div className={step > 1 ?'mt-5 px-2 d-flex justify-content-between align-items-end': 'mt-5 px-2 d-flex justify-content-end align-items-end'}>
						{step > 1 &&    
						<button type='button'  onClick={(event) => prev(event)} className='btn btn-outline-dark'>
							<ArrowLeftOutlined />
							<span className='ms-3'>Précédent</span>
						</button>}
						{step < 4 &&<button type='button' disabled={!(
							(step === 1 && (selectedMode && selectedType)) 
							|| (step === 2 && images.length > 0)
							|| (step === 3 )
							|| (step === 4)
							)}  onClick={() => next()} className='btn btn-outline-warning'>
							<span className='me-3'>Suivant</span>
							<ArrowRightOutlined />
						</button>}
						{step === 4 && <button type="submit"  className='btn btn-warning' > Publier</button>}
					</div>
				</form>
				
			</div>: <Loader />}
		</div>
	)
	
}