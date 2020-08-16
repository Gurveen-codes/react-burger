import React from 'react';
import classes from './DrawerToggler.module.css';

const DrawerToggler = (props) => {
	return (
		<div onClick={props.clicked} className={classes.DrawerToggle}>
			<div />
			<div />
			<div />
		</div>
	);
};

export default DrawerToggler;
