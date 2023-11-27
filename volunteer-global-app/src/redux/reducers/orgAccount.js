import { LOGIN_ORG } from "../constants";
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  accountID: null,
  username: null,
  companyName: null,
  contactPhone: null,
  contactEmail: null,
};

const orgAccountReducer = createReducer(initialState, (builder) => {
  builder.addCase(LOGIN_ORG, (state, action) => {
    state.isLoggedIn = true;
    state.username = action.payload.username;
    state.companyName = action.payload.companyName;
    state.contactEmail = action.payload.contactEmail;
    state.contactPhone = action.payload.contactPhone;
    state.accountID = action.payload.accountID;
  });
});

export default orgAccountReducer;
