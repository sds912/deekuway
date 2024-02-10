import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './features/realestate/pages/HomePage/HomePage';
import './App.css';
import 'react-multi-carousel/lib/styles.css';
import { useMediaQuery } from 'react-responsive';
import HomePageMobile from './features/realestate/pages/HomePageMobile/HomePageMobile';
import { AccountPage } from './features/realestate/pages/AccountPage/AccountPage';
import { MyFavoritesPage } from './features/realestate/pages/MyFavoritesPage/MyFavoritesPage';
import { ServicesPage } from './features/realestate/pages/ServicesPage/ServicesPage';
import { Authentification } from './features/realestate/components/Authentification/Authentification';
import { ServiceDetailPage } from './features/realestate/pages/ServiceDetailPage/ServiceDetailPage';
import { RegisterPage } from './features/realestate/pages/RegisterPage/RegisterPage';
import { LoginPage } from './features/realestate/pages/LoginPage/LoginPage';
import { PostDetailPage } from './features/realestate/pages/PostDetailPage/PostDetailPage';
import MyFavoritesWPage from './features/realestate/pages/MyFavoritesWPage/MyFavoritesWPage';
import { PostDetailWPage } from './features/realestate/pages/PostDetailWPage/PostDetailWPage';
import "react-range-slider-input/dist/style.css";
import moment from 'moment';
const { Content } = Layout;



const App = () => {
  const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
	const isBigScreen =       useMediaQuery({ query: '(min-width: 1824px)' })
	const isTabletOrMobile =  useMediaQuery({ query: '(max-width: 1224px)' })
  useEffect(() =>{
    moment.locale('fr');
   },[])
  return (
    <div className='App'>
      <Router>
        <Layout>
          <Content style={{width: '100vw', height: '100vh', backgroundColor: '#FFF'}}>
            <div style={{width: '100%' }}>
                <Routes>
                  <Route path='/' Component={ isTabletOrMobile ? HomePageMobile : (isBigScreen || isDesktopOrLaptop) ? HomePage : null} />
                  <Route path='/posts/:id' Component={ isTabletOrMobile ? PostDetailPage : PostDetailWPage } />
                  <Route path='/services' Component={ ServicesPage } />
                  <Route path='/services/:id' Component={ ServiceDetailPage } />
                  <Route path='/favorites' Component={ isTabletOrMobile ? MyFavoritesPage: MyFavoritesWPage } />
                  <Route path='/auth' Component={ Authentification } />
                  <Route path='/register'  Component={ RegisterPage}/>
                  <Route path='/login'  Component={ LoginPage }/>
                  <Route path='/account/:idUser' Component={ isTabletOrMobile ? AccountPage : (isBigScreen || isDesktopOrLaptop) ? AccountPage : null} />
                </Routes>
            </div>
          </Content>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
