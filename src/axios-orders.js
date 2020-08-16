import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://burger-builder-8c60b.firebaseio.com'
});

export default instance;
