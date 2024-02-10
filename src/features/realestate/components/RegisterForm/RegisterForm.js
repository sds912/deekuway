import React, { useState } from "react";
import firebase from '../../services/firebaseConfig';
import { message } from "antd";
import { useForm } from "react-hook-form";
import './RegisterForm.css';
import { FirebaseErrorMessage } from "../../../../outils/error_handling";

export const RegisterForm = () => {
    const auth = firebase.auth();
	const [messageApi, contextHolder] = message.useMessage();
	const [step, setStep] = useState(1);
	const [profile, setProfile] = useState(null);
 
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
			auth.user.updatePhoneNumber(data.phone);
			auth.user.updateEmail(data.email);
			auth.user.updateProfile({displayName: data.nom});
			
			const userRef=  firebase.firestore().collection('user');
			await userRef.doc(auth.user.uid).set({...data, userId: auth.user.uid});
			message.success('Bravo ! Inscription réussie !');

			})
			.catch(error => FirebaseErrorMessage(error.code, message))
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
            name: 'Je suis Locataire',
			icon: '',
            description: "J'utilise cette plateforme pour rechercher des appartements, studios, chambres... à louer ou à acheter",
			profile: 'client'
        },
        {
            id: 2,
            name: 'Je suis Bayeur',
            icon: '',
			description: "J'utilise cette plateforme pour mettre en location ou ventre des appartements, studios, chambres... ",
			profile: 'owner'
        }
       ] 

    const confirmation = watch('confirmation');
	const password = watch('password');
	
	return(
		<div className="container">
			{contextHolder}
			 
			<div>
             
				<form onSubmit={handleSubmit(onRegister)}>
				{step === 1 && <div className="row">
					<p className="mt-3 fw-bold text-muted">
						Choisir le profile qui vous décri le plus 
					</p>
                    {profiles.map( p => 
                    <div className="col-12 mt-3">
                        <div className="border  text-center  fw-bold p-4 active" onClick={() => {
							setProfile(p.profile);
							setStep(2);
						}}>
                           <h3 className="fw-bold border-bottom pb-4 text-uppercase">{p.name}</h3>
						   <p className="text-center mt-4">{p.description}</p>
                        </div>
                    </div>)}
                </div>}
				{step === 2 && <div>
				<div className='form-group w-100'>
					   <label className='form-label fw-bold'>Nom complet</label>
						<input type="text"  {...register("nom", {required: true})} className='form-control  w-100' />
						{errors.nom && <span className='text-danger'>Veillez renseigner votre nom complet</span>}
					</div>
					<div className='form-group w-100 mt-3'>
						<label className='form-label fw-bold'>Email</label>
						<input type="text"  {...register("email", {required: true})} className='form-control w-100' />
						{errors.password && <span className='text-danger'>Veillez renseigner votre email</span>}
					</div>
					<div className='form-group w-100 mt-3'>
						<label className='form-label fw-bold'>Téléphone</label>
						<input type="text"  {...register("phone", {required: true})} className='form-control w-100' />
						{errors.password && <span className='text-danger'>Veillez renseigner votre numéro</span>}
					</div>
					<div className='form-group w-100 mt-3'>
					   <label className='form-label fw-bold'>Mot de passe</label>
						<input type="password"  {...register("password", {required: true})} className='form-control w-100' />
						{errors.password && <span className='text-danger'>Veillez renseigner le mot de passe</span>}
					</div>
					<div className='form-group w-100 mt-3'>
					   <label className='form-label fw-bold'>Confirmer votre mot de passe</label>
						<input type="password" {...register("confirmation", { required: true })}  className='form-control w-100' />
						{(errors.confirmation || (confirmation !== password)) && <span className='text-danger'>Veillez confirmer le mot de passe</span>}
					</div>
					<div className='mt-5 pt-4 w-100 text-center'>
						<input type="submit" value="S'inscrire" style={{width: '230px'}} className='btn btn-primary fw-bold' />
					</div>
				</div>}
					
				</form>
			</div>
		</div>
	)
}