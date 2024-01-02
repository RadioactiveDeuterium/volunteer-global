import {
  LOGIN_IND_START,
  LOGIN_IND_SUCCESS,
  LOGIN_IND_ERROR,
  LOGOUT_IND,
  UPDATE_IND_LINKS,
} from "../constants";
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  loginError: false,
  loading: false,
  accountID: null,
  username: null,
  name: null,
  phone: null,
  email: null,
  userPositionLinks: [],
};

const indAccountReducer = createReducer(initialState, (builder) => {
  builder.addCase(LOGIN_IND_START, (state, action) => {
    state.loading = true;
    state.loginError = false;
  });
  builder.addCase(LOGIN_IND_ERROR, (state, action) => {
    state.loading = false;
    state.loginError = true;
  });
  builder.addCase(LOGIN_IND_SUCCESS, (state, action) => {
    state.isLoggedIn = true;
    state.loading = false;
    state.username = action.payload.username;
    state.name = action.payload.Name;
    state.email = action.payload.Email;
    state.phone = action.payload.Phone;
    state.accountID = action.payload.accountID;
  });
  builder.addCase(LOGOUT_IND, (state, action) => {
    state.isLoggedIn = false;
    state.loginError = false;
    state.loading = false;
    state.username = null;
    state.name = null;
    state.email = null;
    state.phone = null;
    state.accountID = null;
    state.userPositionLinks = null;
  });
  builder.addCase(UPDATE_IND_LINKS, (state, action) => {
    state.userPositionLinks = action.payload.userPositionLinks;
  });
});

export default indAccountReducer;
