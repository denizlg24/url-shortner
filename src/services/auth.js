import auth0 from 'auth0-js';

const auth = new auth0.WebAuth({
  domain: 'dev-r8h4horutpz3j3g6.us.auth0.com',
  clientID: 'zc9VbPxP1FnqLJ8pK5YiGwrF0w45x9rM',
  redirectUri: 'http://localhost:5173/?callback',
  audience: 'https://dev-r8h4horutpz3j3g6.us.auth0.com/userinfo',
  responseType: 'token id_token',
  scope: 'openid profile roles user_id name email read:current_user create:current_user_metadata update:current_user_metadata delete:current_user_metadata',
});

export default auth;