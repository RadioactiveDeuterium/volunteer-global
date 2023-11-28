import {
  LOGIN_ORG_START,
  LOGIN_ORG_SUCCESS,
  LOGIN_ORG_ERROR,
  LOGOUT_ORG,
} from "../constants";
import app from "../../utils/axiosConfig";

const loginOrg = (username, password) => {
  return async (dispatch, getState) => {
    dispatch({ type: LOGIN_ORG_START });
    const postUrl = "api/accounts/organization/login";
    const getUrl = "api/accounts/organization/";
    const body = {
      username: username,
      password: password,
    };
    app
      .post(postUrl, body)
      .then((data) => {
        app
          .get(getUrl)
          .then((data) => {
            const { companyName, contactEmail, contactPhone } =
              data.data.orgAccount;
            const { accountID, username } = data.data.user;
            dispatch({
              type: LOGIN_ORG_SUCCESS,
              payload: {
                companyName,
                contactEmail,
                contactPhone,
                accountID,
                username,
              },
            });
          })
          .catch((err) => {
            console.log(err);
            dispatch({ type: LOGIN_ORG_ERROR });
          });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: LOGIN_ORG_ERROR });
      });
  };
};

const logoutOrg = () => {
  return async (dispatch, getState) => {
    dispatch({ type: LOGIN_ORG_START });
    const url = "api/accounts/organization/logout";
    app
      .post(url)
      .then((data) => dispatch({ type: LOGOUT_ORG }))
      .catch((err) => console.log(err));
  };
};

const orgAccountActions = {
  loginOrg,
  logoutOrg,
};

export default orgAccountActions;
