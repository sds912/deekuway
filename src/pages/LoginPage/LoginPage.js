import React from "react";
import firebase from "../../services/firebaseConfig";
import { message } from "antd";
import { useForm } from "react-hook-form";
import logo from '../../assets/logo.png';
import google from '../../assets/google.svg';
import facebook from '../../assets/facebook.svg';
import apple from '../../assets/apple.svg';
import './LoginPage.css';
import { useNavigate } from "react-router-dom";


export const LoginPage = () => {

    const auth = firebase.auth();
	const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
 
	const {
		register,
		handleSubmit,
		formState: { errors },
	  } = useForm()
	  const onLogin = async (data) => {
		try {
			await auth.signInWithEmailAndPassword(data.email, data.password);
			message.success('Bravo ! Connection réussie !');
            navigate('/');
		  } catch (error) {
			message.open({
				type: "error",
				content: "Erreur de connection:" + error
			})
		  }
	  }


    return (
    <>
    {contextHolder}
     <div className="login-header">
        <div>
        <img width={180} src={logo} alt="logo" />
           <div className="text-center mt-4">
           <button className="btn btn-outline-dark">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                <span className="ms-3 fw-bold">Acceuil</span>
            </button>
           </div>
           
        </div>
     </div>

     <div className="login-form">
        <h4 className="text-center fw-bold mb-4" style={{fontSize: '26px'}}>Inscription</h4>
        <form onSubmit={handleSubmit(onLogin)}>
            <div className='form-group w-100'>
                <input type="text"  placeholder="Email" {...register("email", {required: true})} className='form-control w-100 login-input' />
                {errors.email && <span className='text-danger'>Veillez renseigner votre email</span>}
            </div>
            <div className='form-group w-100 mt-4'>
            <input type="password" placeholder="Mot de passe" {...register("password", { required: true })}  className='form-control w-100 login-input' />
            {errors.password && <span className='text-danger'>Veillez renseigner le mot de passe</span>}
            </div>
            <div className='w-100 mt-5 text-center'>
                <input type="submit" value="Se connecter" className='btn btn-warning login-btn'  />
            </div>
        </form>
        <div className="text-center mt-4">
            <button className="btn btn-outline w-100"> J'au oublié mon  mot de passe</button>
           
        </div>
     </div>
     <div className="login-link">
        <div className="d-flex justify-content-center align-items-center">
           <div className="border p-3" style={{borderRadius: '7px'}} >
               <img width={50} src={google} alt="google" />
           </div>
           <div className="border p-3 mx-3" style={{borderRadius: '7px'}}>
               <img width={60} src={facebook} alt="facebook" />
           </div>
           <div className="border p-3" style={{borderRadius: '7px'}}>
               <img width={60} src={apple} alt="apple" />
           </div>
        </div>
     </div>
    </>
    )
}