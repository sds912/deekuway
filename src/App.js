import React from 'react';
import { Layout } from 'antd';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import './App.css';
import 'react-multi-carousel/lib/styles.css';
import { useMediaQuery } from 'react-responsive';
import HomePageMobile from './pages/HomePageMobile/HomePageMobile';
import { BottomNav } from './components/BottomNav/BottomNav';
import { AccountPage } from './pages/AccountPage/AccountPage';
import { PostDetailPage } from './pages/PostDetailPage/PostDetailPage';
import AgenciesPage from './pages/AgenciesPage/AgenciesPage';
import { MyFavoritesPage } from './pages/MyFavoritesPage/MyFavoritesPage';
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
                  <Route path='/posts/:id' Component={ PostDetailPage } />
                  <Route path='/agencies' Component={ AgenciesPage } />
                  <Route path='/favorites' Component={ MyFavoritesPage } />
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
