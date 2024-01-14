import React, { useEffect, useState } from 'react'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import { useMediaQuery } from 'react-responsive'
import { ServiceCard } from '../../components/ServiceCard/ServiceCard'
import Carousel from 'react-multi-carousel';
import realestate from '../../assets/realestate.svg';
import cleaning from '../../assets/cleaning.svg';
import moving from '../../assets/moving.svg';
import './ServicePage.css';
import { Card, Col, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import { StarOutlined } from '@ant-design/icons';
import { MobileNavBar } from '../../components/MobileNavBar/MobileNavBar';

export const  ServicesPage = ()  => {

  const [services, setServices] = useState([]);
	const isTabletOrMobile =  useMediaQuery({ query: '(max-width: 1224px)' });
  const [selectedService, setSelectedService] = useState('realestate');
  const [movings, setMovings] = useState([]);
  const [cleanings, setCleanings] = useState([]);
  const [realestates, setRealestates] = useState([]);

  const responsive = {
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const selectService =  (serviceName) => {
     setSelectedService(serviceName);
  }


  useEffect(() => {
    const data = [
      {
      id: 1,
      name: "Déménagement",
      image: "https://firebasestorage.googleapis.com/v0/b/deekuway.appspot.com/o/images%2Fpexels-jovydas-pinkevicius-2462015.jpg?alt=media&token=c260f648-79b9-4f95-a7f9-a754b5f0032e",
      phone: '777443663',
      email:'contact@gmail.com',
      address: 'pikine dakar',
      category: 'Démenagement'
    },
    {
      id: 2,
      name: "Déménagement",
      image: "https://firebasestorage.googleapis.com/v0/b/deekuway.appspot.com/o/images%2Fpexels-jovydas-pinkevicius-2462015.jpg?alt=media&token=c260f648-79b9-4f95-a7f9-a754b5f0032e",
      phone: '777443663',
      email:'contact@gmail.com',
      address: 'pikine dakar',
      category: 'Démenagement'
    },
    {
      id: 3,
      name: "Déménagement",
      image: "https://firebasestorage.googleapis.com/v0/b/deekuway.appspot.com/o/images%2Fpexels-jovydas-pinkevicius-2462015.jpg?alt=media&token=c260f648-79b9-4f95-a7f9-a754b5f0032e",
      phone: '777443663',
      email:'contact@gmail.com',
      address: 'pikine dakar',
      category: 'Démenagement'
    },
   ];

   const realestateData = [
    {
      id: 1, 
      name: 'Cool Immo',
      type: 'Immobilier',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    },
    {
      id: 2, 
      name: 'Cool Immo',
      type: 'Immobilier',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    },
    {
      id: 3, 
      name: 'Cool Immo',
      type: 'Immobilier',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    },
    {
      id: 4, 
      name: 'Cool Immo',
      type: 'Immobilier',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    }
   ];
   const movingData = [
    {
      id: 1, 
      name: 'Cool Immo',
      type: 'Déménagement',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    },
    {
      id: 2, 
      name: 'Cool Immo',
      type: 'Déménagement',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    },
    {
      id: 3, 
      name: 'Cool Immo',
      type: 'Déménagement',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    },
    {
      id: 4, 
      name: 'Cool Immo',
      type: 'Déménagement',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    }
   ];
   const cleaningData = [
    {
      id: 1, 
      name: 'Cool Immo',
      type: 'Nétoyage',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    },
    {
      id: 2, 
      name: 'Cool Immo',
      type: 'Nétoyage',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    },
    {
      id: 3, 
      name: 'Cool Immo',
      type: 'Nétoyage',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    },
    {
      id: 4, 
      name: 'Cool Immo',
      type: 'Nétoyage',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
    }
   ];
   setMovings(movingData);
   setCleanings(cleaningData);
   setRealestates(realestateData);
    setServices(data)
  }, [])




  return (
    <>
    <MobileNavBar />
    <div style={{ padding: '0px 0 70px 0', marginBottom: '120px !important'}}>

    <div className='p-3 bg-white' style={{position:'fixed', top: '70px', zIndex: "5", }}>
    
    <div className='d-flex justify-content-between mb-4 mt-3'>
       <div className={selectedService === 'realestate' ?'text-center active-service service': 'text-center service'} style={{ width: '120px'}}  onClick={() => selectService('realestate')}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          backgroundColor: '#457b9d',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <img width={42} src={realestate} alt='Real estate' />
        </div>
        <div className='mt-2'>Immobilier</div>
       </div>
       <div className={selectedService === 'moving' ?'text-center active-service service': 'text-center service'} style={{ width: '120px'}}  onClick={() => selectService('moving')}>
        <div style={{
          display: 'flex', 
          width: '80px', 
          height: '80px', 
          borderRadius: '20px', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: '#457b9d',
          marginLeft: 'auto',
          marginRight: 'auto'
          }}>
          <img width={42} src={moving} alt='Moving' />
        </div>
        <div className='mt-2'>Déménagement</div>
       </div>
       <div className={selectedService === 'cleaning' ?'text-center active-service service': 'text-center service'} style={{ width: '120px'}}  onClick={() => selectService('cleaning')}>
        <div style={{
          display: 'flex', 
          width: '80px', 
          height: '80px', 
          borderRadius: '20px', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: '#457b9d',
          marginLeft: 'auto',
          marginRight: 'auto'
          }}>
          <img width={42} src={cleaning} alt='Real estate'  filter ="#FFFFFF"/>
        </div>
        <div className='mt-2 pb-2'>Nétoyage</div>
       </div>
    </div>
    </div>
    {selectedService === 'moving' && movings.length > 0 && 
     <div className='p-3' style={{minHeight: '80vh', marginTop: '230px'}}>
     <Row>
       
      {realestates.map( r => 
      <ServiceCard service={r} />)}
     </Row>
   </div>}

    {selectedService === 'realestate' && movings.length > 0 && 
    <div className='p-3' style={{minHeight: '80vh', marginTop: '230px'}}>
      <Row>
        
       {movings.map( m => <ServiceCard service={m} />)}
      </Row>
    </div>}

    {selectedService === 'cleaning' && cleanings.length > 0 && 
     <div className='p-3' style={{minHeight: '80vh', marginTop: '230px'}}>
     <Row>
       
      {cleanings.map( c => <ServiceCard service={c} />)}
     </Row>
   </div>}

    </div>

    {isTabletOrMobile && <BottomNav />}

    </>
  )
}
