import React, { useState } from 'react';
import { connect } from 'react-redux';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Auxillary from '../Auxillary';

const Layout = (props) => {
	const [ showSidedrawer, setShowSideDrawer ] = useState(false);

	const sideDrawerClicked = () => {
		setShowSideDrawer(false);
	};

	const drawerToggleHandler = () => {
		setShowSideDrawer(!showSidedrawer);
	};

	return (
		<Auxillary>
			<Toolbar isAuthenticated={props.isAuthenticated} drawerTogglerClicked={drawerToggleHandler} />
			<SideDrawer
				isAuthenticated={props.isAuthenticated}
				open={showSidedrawer}
				sidedrawerClicked={sideDrawerClicked}
			/>
			<main className={classes.Content}>{props.children}</main>
		</Auxillary>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token != null
	};
};

export default connect(mapStateToProps)(Layout);
