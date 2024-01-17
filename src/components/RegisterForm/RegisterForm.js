import React, { useState } from "react";
import firebase from '../../services/firebaseConfig';
import { message } from "antd";
import { useForm } from "react-hook-form";
import './RegisterForm.css';

export const RegisterForm = () => {
    const auth = firebase.auth();
	const [mode, setMode] = useState(1);
	const [messageApi, contextHolder] = message.useMessage();
 
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	  } = useForm()
	

	  const onRegister = async (data) => {
		try {
			auth.createUserWithEmailAndPassword(data.email, data.password)
			.then( async auth => {
				console.warn(data)
			auth.user.updatePhoneNumber(data.phone);
			auth.user.updateEmail(data.email);
			auth.user.updateProfile({displayName: data.nom});
			
			const userRef=  firebase.firestore().collection('user');
			await userRef.doc(auth.user.uid).set({...data, userId: auth.user.uid});
			message.success('Bravo ! Inscription réussie !');

			})
		} catch (error) {
			message.open({
				type: "error",
				content: "Erreur d'inscription:" + error
			})
			}
		}
	  
       const profiles = [
        {
            id: 1,
            name: 'Je Recherche un appart',
            icon: ''
        },
        {
            id: 2,
            name: 'Je loue des appart',
            icon: ''
        }
       ] 

    const confirmation = watch('confirmation');
	const password = watch('password');
	
	return(
		<div className="container">
			{contextHolder}
			 
			<div>
				<div className='my-3'>
					<h4 className='fw-bold'>S'inscrire</h4>
				</div>
				
                <label className='form-label'>Je m'inscrie en tant que : </label>
                <div className="row">
                    {profiles.map( p => 
                    <div className="col-6">
                        <div className="border p-3 text-center mt-3 fw-bold" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px'}}>
                            {p.name}
                        </div>
                    </div>)}
                </div>
				<form onSubmit={handleSubmit(onRegister)}>
					<div className='form-group w-100'>
					   <label className='form-label'>Nom complet</label>
						<input type="text"  {...register("nom", {required: true})} className='form-control  w-100' />
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
					   <label className='form-label'>Confirmer votre mot de passe</label>
						<input type="password" {...register("confirmation", { required: true })}  className='form-control w-100' />
						{(errors.confirmation || (confirmation !== password)) && <span className='text-danger'>Veillez confirmer le mot de passe</span>}
					</div>
					<div className='mt-5 pt-4'>
						<input type="submit" value="S'inscrire" className='btn btn-warning fw-bold' />
					</div>
				</form>
				<div className="mt-3">
					<p>J'ai un compte ? <button className='btn' onClick={() =>setMode(1)}>Se connecter</button></p>
				</div>
			</div>
		</div>
	)
}