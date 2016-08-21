function appVersion(state = {
  checked: false,
  supported: null,
}, action) {
  switch (action.type) {
    case 'CHECKED_MINIMUM_SUPPORTED_APP_VERSION':
      return {
        ...state,
        checked: true,
      }
    case 'APP_VERSION_SUPPORTED':
      return {
        ...state,
        supported: true,
      }
    case 'APP_VERSION_NOT_SUPPORTED':
      return {
        ...state,
        supported: false,
      }
    default:
      return state
  }
}

export default appVersion;
