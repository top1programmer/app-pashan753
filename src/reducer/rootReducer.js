const initialState = {
  textToSearch: '',
  theme: 'light',
  isAuthenticated: false,
  language: 'rus',
  email: '',
  filter: '',
  user_id: '',
  role: 'user',
  languageSettings:{},
}

function rootReducer(state=initialState, action){
  switch(action.type){
    case "CHANGE_SEARCH":
      return {...state, textToSearch : action.payload}
    case 'CHANGE_THEME' :
      return {...state, theme : action.payload}
    case 'CHANGE_FILTER' :
      return {...state, filter : action.payload}
    case 'CHANGE_LANGUAGE' :
      return {...state,  language : action.payload}
    case 'SET_LANGUAGE_SETTINGS' :
      return {...state,  languageSettings : action.payload}
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
