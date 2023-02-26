import auth0 from 'auth0-js';

const auth = new auth0.WebAuth({
  domain: 'dev-r8h4horutpz3j3g6.us.auth0.com',
  clientID: 'zc9VbPxP1FnqLJ8pK5YiGwrF0w45x9rM',
  redirectUri: 'https://url-shortner-denizlg24.vercel.app/?callback',
  audience: 'https://dev-r8h4horutpz3j3g6.us.auth0.com/api/v2/',
  responseType: 'token id_token',
  scope: 'openid profile roles user_id name email read:current_user update:current_user_identities create:current_user_metadata update:current_user_metadata delete:current_user_metadata create:current_user_device_credentials delete:current_user_device_credentialsupdate:users update:users_app_metadata',
});

export default auth;