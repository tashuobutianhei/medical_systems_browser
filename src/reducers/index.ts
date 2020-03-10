import { combineReducers } from 'redux'
import user from './user'
import patientCase from './patientCase'

const appStore = combineReducers({
  user,
  patientCase
})

export default appStore