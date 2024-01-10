import React, { useEffect, useState } from 'react'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import { useMediaQuery } from 'react-responsive'
import { ServiceCard } from '../../components/ServiceCard/ServiceCard'
import Carousel from 'react-multi-carousel'

export const  ServicesPage = ()  => {

  const [services, setServices] = useState([]);
	const isTabletOrMobile =  useMediaQuery({ query: '(max-width: 1224px)' });

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

    setServices(data)
  }, [])

  return (
    <>
    <div className='p-3'>
    <h4>Agences immobiliers</h4>

    <Carousel 
    responsive={responsive} 
    shouldResetAutoplay={true} 
    autoPlay={true} 
    infinite={true}
    arrows={false} >
        {services.map(service =>
        <ServiceCard service={service} />)}
      </Carousel>
    </div>
    <div className='p-3 mt-3'>
      <h4>Services déménagement</h4>
    <Carousel 
    responsive={responsive} 
    shouldResetAutoplay={true} 
    autoPlay={true} 
    infinite={true}
    arrows={false} >
        {services.map(service =>
        <ServiceCard service={service} />)}
      </Carousel>
    </div>
    <div className='p-3 mt-3'>
      <h4>Services netoyage</h4>
    <Carousel 
    responsive={responsive} 
    shouldResetAutoplay={true} 
    autoPlay={true} 
    infinite={true}
    arrows={false} >
        {services.map(service =>
        <ServiceCard service={service} />)}
      </Carousel>
    </div>
    {isTabletOrMobile && <BottomNav />}

    </>
  )
}
