export const closeConversationScreen = () => {
  return {
    type: "CHANGE_CONVERSATION_SCREEN_VISIBILITY",
    visible: false,
  }
}

export const openConversationScreen = () => {
  return {
    type: "CHANGE_CONVERSATION_SCREEN_VISIBILITY",
    visible: true,
  }
}
