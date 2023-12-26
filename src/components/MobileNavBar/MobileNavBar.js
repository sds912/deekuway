import React from 'react';
import './MobileNavBar.css';
import { BellOutlined} from '@ant-design/icons';
import { Avatar } from 'antd';
import firebase from '../../services/firebaseConfig';

export const MobileNavBar = () => {
	const user = firebase.auth().currentUser;
	return(
		<div className="MobileNavBar w-100 border-bottom">
			<div className='d-flex nav justify-content-between align-items-center w-100 px-4 py-3 mt-0'>
				<div>
					Deekuway
				</div>
				<div>
					<BellOutlined />
				</div>
			</div>
		</div>
	)
	
}