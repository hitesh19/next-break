import {USER_STATES} from "./constants";

const initialState = {
  userState: USER_STATES.INITIALIZING,
  userName : null
};

export default function(state = initialState, action) {
  if(action.type === "START_ON_LANDING_PAGE"){
    let newState = JSON.parse(JSON.stringify(state));
    newState.userName = null;
    newState.userState = USER_STATES.AWAITING_USER_CREATION;
    return newState;
  } else if(action.type === "START_AS_NEW_USER"){
    let newState = JSON.parse(JSON.stringify(state));
    newState.userName = action.userName;
    newState.userState = USER_STATES.AWAITING_USER_SETTINGS;
    return newState;
  } else if(action.type === "LOAD_USER"){
    let newState = JSON.parse(JSON.stringify(state));
    newState.userName = action.userName;
    return newState;
  } else if(action.type === "START_AS_AWAITING_USER_SETTINGS"){
    let newState = JSON.parse(JSON.stringify(state));
    newState.userState = USER_STATES.AWAITING_USER_SETTINGS;
    return newState;
  } else if(action.type === "START_AS_AWAITING_EXERCISE"){
    let newState = JSON.parse(JSON.stringify(state));
    newState.userState = USER_STATES.AWAITING_EXERCISE;
    return newState;
  } else if(action.type === "SETTINGS_SAVED"){
    let newState = JSON.parse(JSON.stringify(state));
    if(newState.userState === USER_STATES.AWAITING_USER_SETTINGS){
      newState.userState = USER_STATES.AWAITING_EXERCISE;
    }
    return newState;
  } else {
    return state;
  }
}
