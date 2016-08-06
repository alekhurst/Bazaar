export const closeChatScreen = () => {
  return {
    type: "CHANGE_CHAT_SCREEN_VISIBILITY",
    visible: false,
  }
}

export const openChatScreen = (chatId, chatTitle) => {
  return {
    type: "CHANGE_CHAT_SCREEN_VISIBILITY",
    visible: true,
    chatId,
    chatTitle,
  }
}
