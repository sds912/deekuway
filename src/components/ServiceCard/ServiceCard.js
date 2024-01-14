import { MessageOutlined, PhoneOutlined, StarOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import React from 'react';
import { Link } from 'react-router-dom';

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
       {service && <Col style={{padding: '4px'}} span={12} key={service.id} >
        <Link  to={'/service/'+service.id} style={{textDecoration: 'none'}}>
       <Card
          hoverable
          style={{ width: '100%' }}
          cover={<img height={130} alt="example" src={service.image} />}
        >
          <Meta title={service.name}
           description=<div>
           <h6>{service.type}</h6>
           <div>
           <StarOutlined style={{color: '#fb8500'}} /> <span className='fw-bold'>6</span> 
           </div>
          </div> />
        </Card>
        </Link>
       </Col>}
      
    </>
        );
}