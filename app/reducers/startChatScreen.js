function startChatScreen(state = {
  visible: false,
}, action) {
  switch (action.type) {
    case 'CHANGE_START_CHAT_SCREEN_VISIBILITY':
      return {
        visible: action.visible,
      }
    default:
      return state
  }
}

export default startChatScreen;
