import { MessageOutlined, PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons"
import { Avatar } from "antd"

export const ContactButtons = ({post}) => {

    const onContact = (type) =>{
        if(type === 'whatsapp'){
            window.open(`https://wa.me/${post.owner.phone}`, '_blank');
        }
        if(type === 'phone'){
            window.open(`tel:${post.owner.phone}`);
        }
        if(type === 'email'){
            window.open(`mailto:${post.owner.email}`, '_blank');
    
        }
      }


    return <div className='contact-owner  p-3'>
    <div className='d-flex justify-content-between align-items-center'>
      { false && <div className='d-flex justify-content-start align-items-center' >
         <Avatar src={post.owner.avatar} alt='N' />
         <h5 className='ms-2'>{post.owner.name}</h5>
       </div>}
         <div className='d-flex align-items-center justify-content-center w-50'>
              <button className='btn btn-outline-none' onClick={() => onContact('whatsapp')}>
                  <WhatsAppOutlined style={{fontSize: '22px'}}  />
              </button>
              <button className='btn btn-outline-none' onClick={() => onContact('phone')}>
                  <PhoneOutlined style={{fontSize: '22px'}} />
              </button>
              <button className='btn btn-outline-none' onClick={() => onContact('email')}>
                  <MessageOutlined style={{fontSize: '22px'}}  />
              </button>
          </div>
    </div>
 </div>
}