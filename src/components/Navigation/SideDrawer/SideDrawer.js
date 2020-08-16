import React from 'react';
import Logo from '../../Logo/Logo';
import NavItems from '../NavItems/NavItems';
import classes from './SideDrawer.module.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Auxillary from '../../../hoc/Auxillary';

const SideDrawer = (props) => {
	let attachClasses = [ classes.SideDrawer, classes.Close ];

	if (props.open) {
		attachClasses = [ classes.SideDrawer, classes.Open ];
	}
	return (
		<Auxillary>
			<Backdrop show={props.open} backdropClicked={props.sidedrawerClicked} />
			<div className={attachClasses.join(' ')}>
				<div className={classes.SideDrawerLogo}>
					<Logo />
				</div>

				<nav>
					<NavItems />
				</nav>
			</div>
		</Auxillary>
	);
};

export default SideDrawer;
