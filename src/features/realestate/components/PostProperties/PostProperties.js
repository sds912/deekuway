import sofa from '../../../../assets/sofa.svg';
import bed from '../../../../assets/bed.svg';
import kitchen from '../../../../assets/kitchen.svg';
import bathroom from '../../../../assets/bathroom.svg';
import toilet from '../../../../assets/toilet.svg';
import balcon from '../../../../assets/balcon.png';
import { CheckOutlined } from '@ant-design/icons';


export const PostProperties = ({post}) => {

    return <div>
    <h4 className='mt-5 mb-2 text-muted fw-bold'>Composition</h4>
    <div className='row'>
      {post.bedRooms > 0 && 
      <div className='col-4 mt-3'>
         <div className='facilitie-item'>
             <img width={22} src={bed} alt='bedroom' />
             <h6 className='text-dark fw-bold mt-3'>Chambre(s)</h6>
             <span className='text-muted'>{post.bedRooms}</span>
         </div>
      </div>}
      {post.sallon > 0 &&
      <div className='col-4 mt-3'>
         <div className='facilitie-item'>
             <img width={22} src={sofa} alt='salon' />
             <h6 className='text-dark fw-bold mt-3'>Salon(s)</h6>
             <span className='text-muted'>{post.sallon}</span>
         </div>
      </div>}
      {post.bathRooms > 0 && 
      <div className='col-4 mt-3'>
         <div className='facilitie-item'>
             <img width={22} src={bathroom} alt='bathroom' />
             <h6 className='text-dark fw-bold mt-3'>Salle(s) de bain</h6>
             <span className='text-muted'>{post.bathRooms}</span>
         </div>
      </div>}
      {post.toilet > 0 && 
      <div className='col-4 mt-3'>
         <div className='facilitie-item'>
             <img width={22} src={toilet} alt='toilet' />
             <h6 className='text-dark fw-bold mt-3'>Toilette(s)</h6>
             <span className='text-muted'>{post.toilet}</span>
         </div>
      </div>}
      {post.otherRooms && post.otherRooms.includes('kitchen') > 0 &&
        <div className='col-4 mt-3'>
         <div className='facilitie-item'>
             <img width={22} src={kitchen} alt='kitchen' />
             <h6 className='text-dark fw-bold mt-3'>Cuisine </h6>
             <span className='text-muted'><CheckOutlined className='text-success' /></span>
         </div>
      </div>}

      {post.otherRooms && post.otherRooms.includes('balcon') > 0 &&
        <div className='col-4 mt-3'>
         <div className='facilitie-item'>
             <img width={22} src={balcon} alt='balcon' />
             <h6 className='text-dark fw-bold mt-3'>Balcon</h6>
             <span className='text-muted'><CheckOutlined className='text-success' /></span>
         </div>
      </div>}

    </div>
</div>
}