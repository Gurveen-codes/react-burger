import React from 'react';
import classes from './NavItem.module.css';
import { NavLink } from 'react-router-dom';

const NavItem = (props) => {
	return (
		<li className={classes.NavItem}>
			<NavLink to={props.link} activeClassName={classes.active} exact={props.exact}>
				{props.children}
			</NavLink>
		</li>
	);
};

export default NavItem;
