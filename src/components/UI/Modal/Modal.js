import React from 'react';
import classes from './Modal.module.css';
import Auxillary from '../../../hoc/Auxillary';
import Backdrop from '../Backdrop/Backdrop';

const Modal = (props) => {
	// shouldComponentUpdate(nextProps, nextState) {
	// 	return nextProps.show !== prevProps.show || nextProps.children !== prevProps.children;
	// }

	return (
		<Auxillary>
			<Backdrop show={props.show} backdropClicked={props.backdropClicked} />
			<div
				className={classes.Modal}
				style={{
					transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
					opacity: props.show ? '1' : '0'
				}}
			>
				{props.children}
			</div>
		</Auxillary>
	);
};

export default React.memo(
	Modal,
	(prevProps, nextProps) => nextProps.show === prevProps.show && nextProps.children === prevProps.children
);
