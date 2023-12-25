import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from '../../services/firebaseConfig'; 
import { message } from 'antd';
import './PostForm.css';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
  } from 'react-places-autocomplete';
import { CloseCircleOutlined, EnvironmentOutlined, FileAddOutlined, FileImageOutlined} from '@ant-design/icons';
import Loader from '../Loader/Loader';
  

export const  PostForm = ({closeModel}) => {
    const auth = firebase.auth();
	const firestore = firebase.firestore();
	const storage  = firebase.storage();
	const [messageApi, contextHolder] = message.useMessage();
	const [address, setAddress] = useState('');
	const [step, setStep] = useState(1);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);


	const {register, handleSubmit, setValue, watch, getValues, formState: { errors },} = useForm();
	


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
	
	  const onAddPost = async (data) => {
		setLoading(true);
		 const imageUrls = await Promise.all(images.map(async (imageFile) => {
			const storageRef = storage.ref(`images/${imageFile.name}`);
			await storageRef.put(imageFile);
			return await storageRef.getDownloadURL();
		  }));
		  const ownerInfo = {
			email: auth.currentUser.email,
			name: auth.currentUser.displayName,
			phone: auth.currentUser.phoneNumber,
			avatar: auth.currentUser.photoURL,
			uid: auth.currentUser.uid
		}

        const postRef = firestore.collection('posts');
		const postData = { ...data, images: imageUrls, owner: ownerInfo  };
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
		})

	  }

	 const next = () => {
        step < 4 && setStep(step+1)
	  }

	const prev = () => {
        step > 1 && setStep(step-1)
	  }

	const removeImage = (index) => {
	   const toRemove =	images.find((v,i) => i === index);
	   if(toRemove){
		  setImages(images.filter(v => v !== toRemove))
	   }
	}
	
	return(
		<div className="container">
			{contextHolder}
			{!loading ? <div>
				<form onSubmit={handleSubmit(onAddPost)}>

			    {step === 1 &&
				<>
					<div className='form-group w-100 my-3'>
						<label>Choisir le type d'annonce (Vente, Location)</label>
						<div className='row mt-2'>
							<div className='col'>
								<label for='location' className='p-3 fw-bold location-option text-center' style={{display: 'block', width: '100%', backgroundColor: mode === 'location' ? 'orange': 'inherit'}}>
									Location
									<input style={{visibility: 'hidden', position: 'absolute'}} id="location" value={'location'} type='radio' name='mode' {...register('mode', {required: true})} />
								</label>
							</div> 
							<div className='col'>
								<label for='vente'  className='p-3 fw-bold vente-option text-center' style={{display: 'block', width: '100%', backgroundColor: mode === 'vente' ? 'orange': 'inherit'}}>
								Vente	
								<input style={{visibility: 'hidden', position: 'absolute'}} id="vente" value={'vente'} type='radio' name='mode' {...register('mode', {required: true})} />
								</label>
							</div> 
						</div>

					</div>
					<div className='form-group mt-3'>
                       <label className='form-label'>Choisir le type d'appartement</label>
					   <select className='form-select w-100' {...register("type",  {required: true})}>
						  <option selected value={null} disabled>Choisir le type</option>
                          <option value={'appartement'}>Appartement</option>
                          <option value={'maison'}>Maision</option>
                          <option value={'studio'}>Studio</option>
                          <option value={'chambre'}>Chambre</option>
                          <option value={'salon'}>Salon</option>
                          <option value={'bureau'}>Bureau</option>
                          <option value={'magasin'}>Magasin</option>
						</select>

					</div>
				</>}
				{step === 2 && <div className='form-group w-100 mt-3'>
					<label className='form-label'>Ajouter des images (max 10)</label>
					
					{errors.images && <div className='text-danger'>Veuillez sélectionner des images</div>}
					<div className='row'>
						<div className='col'>
						<label for="images" style={{height: '120px', maxWidth: '130px', display: 'flex', backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc'}}>
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
							<div className="col p-0 mx-1" style={{position: 'relative'}}>
								<img style={{height: '120px'}} className='img-fluid w-100' key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} /> 
                                <CloseCircleOutlined onClick={() =>removeImage(index)}  style={{position: 'absolute', top: '2px', left: '2px'}} />
						    </div>
						))}
					
					</div>
					
				</div>}		
				{step === 3 &&<div>
					<div className='form-group w-100'>
						<label className='form-label'>Titre</label>
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
						<label className='form-label'>Prix</label>
						<input type="number"  {...register("price", {required: true, min: 20000, pattern: {value: /^[0-9]*$/,message: 'Please enter only numbers',}})} className='form-control w-100' />
						{errors.price && <span className='text-danger'>Veillez renseigner le prix</span>}
					</div>
				</div>}
				{step === 4 && mode !== null && type !== 'magasin'  &&<div>
				<div className='row'>
                   <div className='col'>
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
				   <div className='col'>
						<div className='form-group mt-3'>
						   <label className='form-label'>Sallon(s)</label>
						   <select className='form-select' {...register("sallon", {required: true})}>
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
                   <div  className='col'>
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
                   <div className='col'>
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
						<textarea  {...register("description", { required: true })}  className='form-control w-100' />
						{errors.description && <span className='text-danger'>Veillez Ajouter une description</span>}
				</div>
				</div>}
					
					<div className='mt-5 px-2 d-flex justify-content-between align-items-end'>
						{step > 1 &&   <button  onClick={() => prev()} className='btn btn-outline-dark'>Précédent</button>}
						{step < 4 &&   <button  onClick={() => next()} className='btn btn-outline-warning'>Suivant</button>}
						{step === 4 && <input type="submit" value="Publier" className='btn btn-warning' />}
					</div>
				</form>
				
			</div>: <Loader />}
		</div>
	)
	
}