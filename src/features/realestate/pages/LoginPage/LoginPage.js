import React, { useState } from "react";
import firebase from "../../services/firebaseConfig";
import { message } from "antd";
import { useForm } from "react-hook-form";
import logo from '../../../../assets/logo.png';
import google from '../../../../assets/google.svg';
import facebook from '../../../../assets/facebook.svg';
import apple from '../../../../assets/apple.svg';
import './LoginPage.css';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";
import { FirebaseErrorMessage } from "../../../../outils/error_handling";


export const LoginPage = () => {

	const isTabletOrMobile =  useMediaQuery({ query: '(max-width: 1224px)' });
    const [authPage, setAuthPage] = useState('login');

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
			FirebaseErrorMessage(error.code, message);
		  }
	  }


    return (
    <>
    {contextHolder}
     <div className="row pb-3 bg-white" style={{
        minHeight: '100vh',
        height: isTabletOrMobile ? '100vh': '100vh'
     }}>
        <div className="col-lg-7">
        <div className="login-header" style={{
            height: !isTabletOrMobile ? '100vh': '180px'
        }}>
        <div>
        <img width={180} src={logo} alt="logo" />
           <div className="text-center mt-4">
           <button className="btn btn-outline-dark" onClick={() => navigate('/')}>
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                <span className="ms-3 fw-bold">Acceuil</span>
            </button>
           </div>
           
        </div>
     </div>
        </div>
        <div className="col-12 col-lg-5 b-5 bg-white" style={{
            position: 'relative',
            marginTop: '0'
        }}>
        <div className="login-form" style={{
            padding: !isTabletOrMobile ? '10px 20px' : '40px 20px'
        }}>
        <h4 className={!isTabletOrMobile ? "text-center fw-bold p-3 pt-0 bg-light": 'text-center fw-bold mb-2 p-3 pt-0 bg-light'} style={{fontSize: '26px'}}>
           { authPage === 'login' ? 'Connexion': "Inscription"}
            </h4>
        <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
        }}>
       { authPage === 'login' ? 
       <form  onSubmit={handleSubmit(onLogin)} className="w-75">
            <div className='form-group w-100'>
                <label className="form-label fw-bold">Email</label>
                <input type="text"  placeholder="Email" {...register("email", {required: true})} className='form-control w-100 login-input' />
                {errors.email && <span className='text-danger'>Veillez renseigner votre email</span>}
            </div>
            <div className= {!isTabletOrMobile ? 'form-group w-100 mt-5': 'w-100 mt-4'}>
            <label className="form-label fw-bold">Mot de passe</label>
            <input type="password" placeholder="Mot de passe" {...register("password", { required: true })}  className='form-control w-100 login-input' />
            {errors.password && <span className='text-danger'>Veillez renseigner le mot de passe</span>}
            </div>
            <div className='w-100 mt-5 text-center'>
                <input type="submit" value="Se connecter" className='btn btn-warning login-btn'  />
            </div>
        </form>:
        <RegisterForm />}
        </div>
      
       {authPage === 'login' && <div className="text-center mt-4">
            <button className="btn btn-outline w-100 fw-bold"> J'au oublié mon  mot de passe</button>
           
        </div>}
       
     </div>
     <div style={{
        marginTop:'-10px'
     }} >
         <div className="text-center mt-4" >
            {authPage === 'login' && <button 
                onClick={() => setAuthPage('register')}
                style={{
                width: '230px',
                height: '40px',
                borderRadius: '8px'
            }} className="btn btn-outline mb-3">
                J'ai pas de compte
               <span className="fw-bold ms-2">S'inscrire</span>
                </button>}

            { authPage === 'register' && <button 
            onClick={() => setAuthPage('login')}
            style={{
            width: '230px',
            height: '40px',
            borderRadius: '8px'
        }} className="btn btn-outline mb-3"> J'ai un compte <span className="fw-bold ms-2">Se connecter</span> </button>}
        </div>
        <div className="d-flex justify-content-center align-items-center">
           <div className="border p-3" style={{borderRadius: '8px', width: '75px', height: '75px', display: 'flex', justifyContent: 'center', alignContent: 'center'}} >
               <img width={50} src={google} alt="google" />
           </div>
           <div className="border p-3 mx-3" style={{borderRadius: '8px', width: '75px', height: '75px', display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
               <img width={60} src={facebook} alt="facebook" />
           </div>
           <div className="border p-3" style={{borderRadius: '8px', width: '75px', height: '75px', display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
               <img width={60} src={apple} alt="apple" />
           </div>
        </div>
     </div>

       </div>    
     </div>
     

    
    </>
    )
}