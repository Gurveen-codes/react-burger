import React, { Component } from 'react';
import Auxillary from '../Auxillary';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
	return class extends Component {
		constructor(props) {
			super(props);

			this.state = {
				error: null
			};
		}

		UNSAFE_componentWillMount() {
			this.requestInterceptor = axios.interceptors.request.use((req) => {
				this.setState({ error: null });
				return req;
			});
			this.responseInterceptor = axios.interceptors.response.use(
				(res) => res,
				(error) => {
					this.setState({ error: error });
				}
			);
		}

		errorConfirmedHandler = () => {
			this.setState({ error: null });
		};

		render() {
			return (
				<Auxillary>
					<Modal backdropClicked={this.errorConfirmedHandler} show={this.state.error}>
						{this.state.error ? this.state.error.message : null}
					</Modal>
					<WrappedComponent {...this.props} />
				</Auxillary>
			);
		}

		componentWillUnmount() {
			axios.interceptors.request.eject(this.requestInterceptor);
			axios.interceptors.response.eject(this.responseInterceptor);
		}
	};
};

export default withErrorHandler;
