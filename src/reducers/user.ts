const user = (state = {}, action: { type: any; userInfo: any; }) => {

  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...action.userInfo
      }
    case 'USER_LOGOUT':
      console.log(state);
      return {
        // userId: '',
        // userName: '',
        // userIdentity: '',
        // userAvaterAvatar: ''
      }
    default:
      return state
  }
}

export default user

