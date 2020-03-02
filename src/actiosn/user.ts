export const userLogin = (userInfo: any) => {
  return {
      type: 'USER_LOGIN',
      userInfo
  }
}

export const userLogout = () => {
  return {
      type: 'USER_LOGOUT'
  }
}
