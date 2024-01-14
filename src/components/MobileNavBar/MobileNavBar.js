import React, { useEffect, useState } from 'react';
import './MobileNavBar.css';
import { BellOutlined} from '@ant-design/icons';
import firebase from '../../services/firebaseConfig';
import logo from '../../assets/logo.png';
import filter from '../../assets/filter.svg';
import { useWindowScroll } from "@uidotdev/usehooks";


export const MobileNavBar = () => {

	const [{ x, y },  scrollTo] = useWindowScroll();


	const user = firebase.auth().currentUser;


	return(
		<div className="MobileNavBar w-100 border-bottom">
			<div className='d-flex nav justify-content-between align-items-center w-100 px-4 py-3 mt-0'>
				<div >
					<img width={80} src={logo} alt='Deekuway' />
				</div>
				<div className='d-flex'>
					<BellOutlined />
					{y > 120 && <button className='btn btn-dark filter-icon ms-3'  onClick={() =>{}}>
					<img style={{width:'32px'}} src={filter} alt='filter' />
					</button>}
				</div>
			</div>
		</div>
	)
	
}