function userCredentials(state = {
  loggedIn: false,
  loggingIn: true, // assume we're going to attempt to log in
  loginError: false,
  bazaarAccessToken: null,
  userId: null,
  userEmail: null,
}, action) {
  switch (action.type) {
    case 'LOGGING_IN':
      return {
        loggedIn: false,
        loggingIn: true,
        loginError: false,
        userId: null,
        userEmail: null,
        bazaarAccessToken: null,
      }
    case 'LOGIN_ERROR':
      return {
        loggedIn: false,
        loggingIn: false,
        loginError: true,
        userId: null,
        userEmail: null,
        bazaarAccessToken: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        loggedIn: true,
        loggingIn: false,
        loginError: false,
        userId: action.userId,
        userEmail: action.userEmail,
        bazaarAccessToken: action.bazaarAccessToken,
      }
    case 'NOT_LOGGED_IN':
      return {
        loggedIn: false,
        loggingIn: false,
        loginError: false,
        bazaarAccessToken: null,
        userId: null,
        userEmail: null,
      }
    default:
      return state
  }
}

export default userCredentials;
