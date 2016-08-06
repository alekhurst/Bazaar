function chatScreen(state = {
  visible: false,
  chatId: null
}, action) {
  switch (action.type) {
    case 'CHANGE_CHAT_SCREEN_VISIBILITY':
      if (action.visible === true) {
        return {
          visible: true,
          chatId: action.chatId,
          chatTitle: action.chatTitle,
        }
      } else {
        return {
          visible: false,
          chatId: null,
          chatTitle: null
        }
      }
    default:
      return state
  }
}

export default chatScreen;
