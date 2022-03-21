const initialState = {
  textToSearch: '',
  theme: 'light',
  isAuthenticated: false,
  email: '',
  user_id: '',
  role: 'user',
}

function rootReducer(state=initialState, action){
  switch(action.type){
    case "CHANGE_SEARCH":
      return {...state, textToSearch : action.payload}
    case 'CHANGE_THEME' :
      return {...state, theme : action.payload}
    case 'CHANGE_ISAUTHENTICATED' :
      return {
        isAuthenticated : action.payload.isAuthenticated,
        user_id : action.payload.user_id,
        role : action.payload.role,
        email : action.payload.email,
      }
    default: return state
  }
}

export default rootReducer
