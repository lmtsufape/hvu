import Router from 'next/router';

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');

  Router.push('/');
}