import React, { useEffect } from 'react';
import './EditProfilForm.css';
import { useForm } from 'react-hook-form';

export const  EditProfilForm  = ({user}) => {

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	  } = useForm()


	  useEffect(() => {
		console.warn(user)
        setValue('nom', user.displayName);
        setValue('email', user.email);
        setValue('phone', user.phoneNumber);
	  },[])
	  const onEdit = data =>{

	  }

	return(
		<div className="EditProfilForm">
			<form onSubmit={handleSubmit(onEdit)}>
					<div className='form-group w-100'>
					   <label className='form-label'>Nom complet</label>
						<input type="text"  {...register("nom", {required: true})} className='form-control w-100' />
						{errors.nom && <span className='text-danger'>Veillez renseigner votre nom complet</span>}
					</div>
					<div className='form-group w-100 mt-3'>
						<label className='form-label'>Email</label>
						<input type="text"  {...register("email", {required: true})} className='form-control w-100' />
						{errors.email && <span className='text-danger'>Veillez renseigner votre email</span>}
					</div>
					<div className='form-group w-100 mt-3'>
						<label className='form-label'>Téléphone</label>
						<input type="text"  {...register("phone", {required: true})} className='form-control w-100' />
						{errors.phone && <span className='text-danger'>Veillez renseigner votre numéro</span>}
					</div>
					<div className='mt-5 text-center'>
						<input type="submit" value="Enregistrer" className='btn btn-warning' />
					</div>
				</form>
		</div>
	)

}