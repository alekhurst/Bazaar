function chat(state = {
  unreadCount: 0
}, action) {
  var unreadCount;
  switch (action.type) {
    case 'INCREMENT_UNREAD_COUNT':
      unreadCount = state.unreadCount + 1;
      return {unreadCount}
    case 'DECREMENT_UNREAD_COUNT':
      unreadCount = state.unreadCount - 1;
      return {unreadCount}
    default:
      return state
  }
}

export default chat;
