import React from 'react';
import { Layout } from 'antd';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import './App.css';
import 'react-multi-carousel/lib/styles.css';
import { useMediaQuery } from 'react-responsive';
import HomePageMobile from './pages/HomePageMobile/HomePageMobile';
import { AccountPage } from './pages/AccountPage/AccountPage';
import { MyFavoritesPage } from './pages/MyFavoritesPage/MyFavoritesPage';
import { ServicesPage } from './pages/ServicesPage/ServicesPage';
import { PostDetailPage2 } from './pages/PostDetailPage2/PostDetailPage2';
import { Authentification } from './components/Authentification/Authentification';
import { ServiceDetailPage } from './pages/ServiceDetailPage/ServiceDetailPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
const { Content } = Layout;

const App = () => {
  const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
	const isBigScreen =       useMediaQuery({ query: '(min-width: 1824px)' })
	const isTabletOrMobile =  useMediaQuery({ query: '(max-width: 1224px)' })
  return (
    <div className='App'>
      <Router>
        <Layout>
         
          <Content style={{width: '100vw', height: '100vh', backgroundColor: '#FFF'}}>
            <div style={{width: '100%' }}>
                <Routes>
                  <Route path='/' Component={ isTabletOrMobile ? HomePageMobile : (isBigScreen || isDesktopOrLaptop) ? HomePage : null} />
                  <Route path='/posts/:id' Component={ PostDetailPage2 } />
                  <Route path='/services' Component={ ServicesPage } />
                  <Route path='/services/:id' Component={ ServiceDetailPage } />
                  <Route path='/favorites' Component={ MyFavoritesPage } />
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
