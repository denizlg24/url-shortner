import auth0 from 'auth0-js';

const auth = new auth0.WebAuth({
  domain: 'dev-r8h4horutpz3j3g6.us.auth0.com',
  clientID: 'zc9VbPxP1FnqLJ8pK5YiGwrF0w45x9rM',
  redirectUri: 'https://url-shortner-gold.vercel.app/callback',
  responseType: 'token id_token',
  scope: 'openid profile email',
});

export default auth;