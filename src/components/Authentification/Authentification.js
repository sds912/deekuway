import React, { useState } from 'react';
import './Authentification.css';
import { useForm } from 'react-hook-form';
import firebase from '../../services/firebaseConfig'; 
import { message } from 'antd';


export const  Authentification = () => {
    const auth = firebase.auth();
	const [mode, setMode] = useState(1);
	const [messageApi, contextHolder] = message.useMessage();
 
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	  } = useForm()
	  const onLogin = async (data) => {
		try {
			await auth.signInWithEmailAndPassword(data.email, data.password);
		  } catch (error) {
			message.open({
				type: "error",
				content: "Erreur de connection:" + error
			})
		  }
	  }

	  const onRegister = async (data) => {
		try {
			auth.createUserWithEmailAndPassword(data.email, data.password)
			.then(auth => {
				console.warn(data)
			auth.user.updatePhoneNumber(data.phone);
			auth.user.updateEmail(data.email);
			auth.user.updateProfile({displayName: data.nom});
			
			const userRef=  firebase.firestore().collection('user');
			userRef.add({...data, userId: auth.user.uid}).then(res => window.location.reload())
			})
		} catch (error) {
			message.open({
				type: "error",
				content: "Erreur d'inscription:" + error
			})
			}
		}
	  

    const confirmation = watch('confirmation');
	const password = watch('password');
	
	return(
		<div className="container">
			{contextHolder}
			{mode === 1 ? 
			<div>
				<div className='my-3'>
					<h4 className='fw-bold'>Se connecter</h4>
				</div>
				<form onSubmit={handleSubmit(onLogin)}>
					<div className='form-group w-100'>
						<input type="text"  {...register("email", {required: true})} className='form-control w-100' />
						{errors.email && <span className='text-danger'>Veillez renseigner votre email</span>}
					</div>
					<div className='form-group w-100 mt-4'>
					<input type="password" {...register("password", { required: true })}  className='form-control w-100' />
					{errors.password && <span className='text-danger'>Veillez renseigner le mot de passe</span>}
					</div>
					<div className='w-100 mt-5'>
						<input type="submit" value="Se connecter" className='btn btn-warning btn-block'  />
					</div>
				</form>
				<div>
					<p>Pas encore de compte ? <button className='btn' onClick={() =>setMode(2)}>S'inscrire</button></p>
				</div>
			</div> : 
			<div>
				<div className='my-3'>
					<h4 className='fw-bold'>S'inscrire</h4>
				</div>
				<form onSubmit={handleSubmit(onRegister)}>
					<div className='form-group w-100'>
					   <label className='form-label'>Nom complet</label>
						<input type="text"  {...register("nom", {required: true})} className='form-control w-100' />
						{errors.nom && <span className='text-danger'>Veillez renseigner votre nom complet</span>}
					</div>
					<div className='form-group w-100 mt-3'>
						<label className='form-label'>Email</label>
						<input type="text"  {...register("email", {required: true})} className='form-control w-100' />
						{errors.password && <span className='text-danger'>Veillez renseigner votre email</span>}
					</div>
					<div className='form-group w-100 mt-3'>
						<label className='form-label'>Téléphone</label>
						<input type="text"  {...register("phone", {required: true})} className='form-control w-100' />
						{errors.password && <span className='text-danger'>Veillez renseigner votre numéro</span>}
					</div>
					<div className='form-group w-100 mt-3'>
					   <label className='form-label'>Mot de passe</label>
						<input type="text"  {...register("password", {required: true})} className='form-control w-100' />
						{errors.password && <span className='text-danger'>Veillez renseigner le mot de passe</span>}
					</div>
					<div className='form-group w-100 mt-3'>
						<input type="password" {...register("confirmation", { required: true })}  className='form-control w-100' />
						{(errors.confirmation || (confirmation !== password)) && <span className='text-danger'>Veillez confirmer le mot de passe</span>}
					</div>
					<div className='mt-5'>
						<input type="submit" value="S'inscrire" className='btn btn-warning' />
					</div>
				</form>
				<div>
					<p>J'ai un compte ? <button className='btn' onClick={() =>setMode(1)}>Se connecter</button></p>
				</div>
			</div>}
		</div>
	)
	
}