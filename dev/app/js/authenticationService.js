import axios from 'axios';

//const BASE_URL = 'http://localhost:8080';
const BASE_URL = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
//console.log(`BASE_URL : ${BASE_URL}`);

const listeners = [];

export function login(credentials) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/api/login`;
		axios.post(url, credentials)
			.then(response => {
				if (response.status === 401) {
					resolve(false);
				} else {
					sessionStorage.setItem('logged', true);
					console.log(response.data);
					console.log(response.data._id);
					sessionStorage.setItem('username', response.data.username);
					sessionStorage.setItem('jwt',response.data.jwt);

					listeners.forEach((f) => f(true));

					resolve(true);
				}
			})
			.catch(() => {
				reject(false);
			});
	});
}

export function logout() {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/api/logout`;
		axios.get(url)
			.then(response => {
				sessionStorage.removeItem('logged');
				sessionStorage.removeItem('username');
				sessionStorage.removeItem('jwt');

				listeners.forEach((f) => f(false));

				resolve(response);
			})
			.catch(err => {
				reject(err);
			});
	});
}

export function isLoggedIn() {
	return sessionStorage.getItem('logged') ? sessionStorage.getItem('logged') : false;
}

export function signin(credentials) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/api/signin`;
		axios.post(url, credentials)
			.then(response => {
				switch (response.status) {
				case 200:
					resolve('Account created');
					break;
				case 409: 
					resolve('Username already created');
					break;
				default: 
					resolve('Error : account cannot be created');
				}
			})
			.catch(err => {
				reject(err);
			});
	});
}

export function addListenerOnLogin(callback) {
	listeners.push(callback);
}