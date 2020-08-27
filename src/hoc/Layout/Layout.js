import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Auxillary from '../Auxillary';

export class Layout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showSidedrawer: false
		};
	}

	sideDrawerClicked = () => {
		this.setState({ showSidedrawer: false });
	};

	drawerToggleHandler = () => {
		this.setState((prevState) => {
			return { showSidedrawer: !prevState.showSidedrawer };
		});
	};

	render() {
		return (
			<Auxillary>
				<Toolbar isAuthenticated={this.props.isAuthenticated} drawerTogglerClicked={this.drawerToggleHandler} />
				<SideDrawer
					isAuthenticated={this.props.isAuthenticated}
					open={this.state.showSidedrawer}
					sidedrawerClicked={this.sideDrawerClicked}
				/>
				<main className={classes.Content}>{this.props.children}</main>
			</Auxillary>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token != null
	};
};

export default connect(mapStateToProps)(Layout);
