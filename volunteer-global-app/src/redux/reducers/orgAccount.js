import {
  LOGIN_ORG_START,
  LOGIN_ORG_SUCCESS,
  LOGIN_ORG_ERROR,
  LOGOUT_ORG,
} from "../constants";
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  loginError: false,
  loading: false,
  accountID: null,
  username: null,
  companyName: null,
  contactPhone: null,
  contactEmail: null,
};

const orgAccountReducer = createReducer(initialState, (builder) => {
  builder.addCase(LOGIN_ORG_START, (state, action) => {
    state.loading = true;
    state.loginError = false;
  });
  builder.addCase(LOGIN_ORG_ERROR, (state, action) => {
    state.loading = false;
    state.loginError = true;
  });
  builder.addCase(LOGIN_ORG_SUCCESS, (state, action) => {
    state.isLoggedIn = true;
    state.loading = false;
    state.username = action.payload.username;
    state.companyName = action.payload.companyName;
    state.contactEmail = action.payload.contactEmail;
    state.contactPhone = action.payload.contactPhone;
    state.accountID = action.payload.accountID;
  });
  builder.addCase(LOGOUT_ORG, (state, action) => {
    state.isLoggedIn = false;
    state.loginError = false;
    state.loading = false;
    state.username = null;
    state.companyName = null;
    state.contactEmail = null;
    state.contactPhone = null;
    state.accountID = null;
  });
});

export default orgAccountReducer;
