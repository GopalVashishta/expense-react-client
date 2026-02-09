import { SET_USER, CLEAR_USER } from "./action";
//Gets called everytime dispatch is called 
// Irrespective of the action and payload
export const userReducer = (state = null, action) => {
    switch (action.type) {
        //This case helps in login functionality
        case SET_USER:
            return action.payload; // new value
        // This case helps in the logout functionality
        case CLEAR_USER:
            return null;
        //This case helps in handling cases where the userReducer
        // is invoked dur to change in some other state variable maintained by redux.
        // dispatch calls all reducers, now if the reducer doesn't know what todo its safe to returns the old value
        default:
            return state;
    }
};
