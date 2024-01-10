import { MessageOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import React from 'react';

export const ServiceCard = ({service}) => {

      const onContact = (type) =>{
        if(type === 'whatsapp'){
        window.open(`https://wa.me/${service.phone}`, '_blank');
      }
      if(type === 'phone'){
        window.open(`tel:${service.phone}`);
      }
      if(type === 'email'){
        window.open(`mailto:${service.email}`, '_blank');

      }
      }

    return (
        <>
          <div className='d-flex p-3' style={{borderRadius: '30px', width: '95%', height: '160px', backgroundColor: '#B1D4E0'}} >
            <div className='' style={{borderRadius: '30px', 
            backgroundImage: `url(${service.image})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '55%', 
            height: '137px',
            position: 'relative'

            }} >
              <div className='' 
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '20px',
                color:'#FFFFFF',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: '#274472'}}>{service.category}</div>
            </div>
            <div className='p-3 text-muted' style={{width: '45%', position: 'relative'}}>
               <h3 className='fw-bold'>{service.name}</h3>
               <div>
                <i className='fa fa-map-marker me-2'></i>
                {service.address}
               </div>
               <div className='d-flex align-items-center justify-content-center' style={{position: 'absolute', bottom: '10px', width: '120px'}}>
								<button className='btn btn-outline-none' onClick={() => onContact('whatsapp')}>
									<WhatsAppOutlined />
								</button>
								<button className='btn btn-outline-none' onClick={() => onContact('phone')}>
									<PhoneOutlined />
								</button>
								<button className='btn btn-outline-none' onClick={() => onContact('email')}>
									<MessageOutlined />
								</button>
								</div>
            </div>
          </div>
        </>
        );
}