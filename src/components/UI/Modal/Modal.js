import React, { Component } from 'react';
import classes from './Modal.module.css';
import Auxillary from '../../../hoc/Auxillary';
import Backdrop from '../Backdrop/Backdrop';

export class Modal extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
	}

	render() {
		return (
			<Auxillary>
				<Backdrop show={this.props.show} backdropClicked={this.props.backdropClicked} />
				<div
					className={classes.Modal}
					style={{
						transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
						opacity: this.props.show ? '1' : '0'
					}}
				>
					{this.props.children}
				</div>
			</Auxillary>
		);
	}
}

export default Modal;
