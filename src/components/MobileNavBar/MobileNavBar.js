import React from 'react';
import './MobileNavBar.css';
import { BellOutlined} from '@ant-design/icons';

export const MobileNavBar = () => {
	return(
		<div className="MobileNavBar w-100">
			<div className='d-flex nav justify-content-between w-100 px-4 py-3 mt-0'>
				<div>Deekuway</div>
				<div>
					<BellOutlined />
				</div>
			</div>
		</div>
	)
	
}