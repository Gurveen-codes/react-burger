import React from 'react';
import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavItems from '../NavItems/NavItems';
import DrawerToggler from '../Toolbar/DrawerToggler/DrawerToggler';

const Toolbar = (props) => {
	return (
		<header className={classes.Toolbar}>
			<DrawerToggler clicked={props.drawerTogglerClicked} />
			<div className={classes.ToolbarLogo}>
				<Logo />
			</div>
			<nav className={classes.DesktopOnly}>
				<NavItems isAuthenticated={props.isAuthenticated} />
			</nav>
		</header>
	);
};

export default Toolbar;
