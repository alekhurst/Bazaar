export const closeStartChatScreen = () => {
  return {
    type: "CHANGE_START_CHAT_SCREEN_VISIBILITY",
    visible: false,
  }
}

export const openStartChatScreen = () => {
  return {
    type: "CHANGE_START_CHAT_SCREEN_VISIBILITY",
    visible: true,
  }
}
