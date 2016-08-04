function conversationScreen(state = {
  visible: false,
}, action) {
  switch (action.type) {
    case 'CHANGE_CONVERSATION_SCREEN_VISIBILITY':
      return {
        visible: action.visible,
      }
    default:
      return state
  }
}

export default conversationScreen;
