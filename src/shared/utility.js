import React, { Suspense } from 'react';
import Spinner from '../components/UI/Spinner/Spinner';

export const checkValidity = (value, rules) => {
	let isValid = true;

	if (rules.required) {
		isValid = value.trim() !== '' && isValid;
	}
	if (rules.minLength) {
		isValid = value.length >= rules.minLength && isValid;
	}
	if (rules.maxLength) {
		isValid = value.length <= rules.maxLength && isValid;
	}
	if (rules.isEmail) {
		const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		isValid = pattern.test(value) && isValid;
	}
	if (rules.isNumeric) {
		const pattern = /^\d*$/;
		isValid = pattern.test(value) && isValid;
	}

	return isValid;
};

export const lazyLoad = (props, Component) => {
	return (
		<Suspense fallback={<Spinner />}>
			<Component {...props} />
		</Suspense>
	);
};
