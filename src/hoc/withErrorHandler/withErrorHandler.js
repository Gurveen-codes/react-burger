import React, { useState, useEffect } from 'react';
import Auxillary from '../Auxillary';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
	return (props) => {
		const [ error, setError ] = useState(null);

		const requestInterceptor = axios.interceptors.request.use((req) => {
			setError(null);
			return req;
		});
		const responseInterceptor = axios.interceptors.response.use(
			(res) => res,
			(error) => {
				setError(error);
			}
		);

		useEffect(
			() => {
				return () => {
					//Code cleanup
					axios.interceptors.request.eject(requestInterceptor);
					axios.interceptors.response.eject(responseInterceptor);
				};
			},
			[ requestInterceptor, responseInterceptor ]
		);

		const errorConfirmedHandler = () => {
			setError(null);
		};

		return (
			<Auxillary>
				<Modal backdropClicked={errorConfirmedHandler} show={error}>
					{error ? error.message : null}
				</Modal>
				<WrappedComponent {...props} />
			</Auxillary>
		);
	};
};

export default withErrorHandler;
