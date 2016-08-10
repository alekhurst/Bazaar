export const incrementUnreadCount = () => {
  return {
    type: "INCREMENT_UNREAD_COUNT",
  }
}

export const decrementUnreadCount = () => {
  return {
    type: "DECREMENT_UNREAD_COUNT",
  }
}
