import React from 'react';
import { Layout } from 'antd';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import NavBar from './components/NavBar/NavBar';
import './App.css';
import 'react-multi-carousel/lib/styles.css';
import { useMediaQuery } from 'react-responsive';
import HomePageMobile from './pages/HomePageMobile/HomePageMobile';
import { BottomNav } from './components/BottomNav/BottomNav';
import { AccountPage } from './pages/AccountPage/AccountPage';
import { MobileNavBar } from './components/MobileNavBar/MobileNavBar';
const { Content } = Layout;

const App = () => {
  const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
	const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  return (
    <div className='App'>
      <Router>
        <Layout>
          {!isTabletOrMobile &&<NavBar />}
          {isTabletOrMobile &&<MobileNavBar />}
          <Content style={{width: '100vw', height: '100vh', backgroundColor: '#FFF'}}>
            <div style={{width: '100%' }}>
                <Routes>
                  <Route path='/' Component={ isTabletOrMobile ? HomePageMobile : (isBigScreen || isDesktopOrLaptop) ? HomePage : null} />
                  <Route path='/account/:idUser' Component={ isTabletOrMobile ? AccountPage : (isBigScreen || isDesktopOrLaptop) ? AccountPage : null} />
                </Routes>
            </div>
          </Content>
          {isTabletOrMobile && <BottomNav />}
        </Layout>
      </Router>
    </div>
  );
};

export default App;
