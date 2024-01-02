import {
  LOGIN_IND_START,
  LOGIN_IND_SUCCESS,
  LOGIN_IND_ERROR,
  LOGOUT_IND,
  UPDATE_IND_LINKS,
} from "../constants";
import app from "../../utils/axiosConfig";

const loginInd = (username, password) => {
  return async (dispatch, getState) => {
    dispatch({ type: LOGIN_IND_START });
    const postUrl = "api/accounts/individual/login";
    const getUrl = "api/accounts/individual/";
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
            const { Name, Email, Phone } = data.data.indAccount;
            const { accountID, username } = data.data.user;
            dispatch({
              type: LOGIN_IND_SUCCESS,
              payload: {
                Name,
                Email,
                Phone,
                accountID,
                username,
              },
            });
          })
          .catch((err) => {
            console.log(err);
            dispatch({ type: LOGIN_IND_ERROR });
          });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: LOGIN_IND_ERROR });
      });
  };
};

const logoutInd = () => {
  return async (dispatch, getState) => {
    dispatch({ type: LOGIN_IND_START });
    const url = "api/accounts/individual/logout";
    app
      .post(url)
      .then((data) => dispatch({ type: LOGOUT_IND }))
      .catch((err) => console.log(err));
  };
};

const updateUserPositionLinks = () => {
  return async (dispatch, getState) => {
    const url = "api/positions/userApplications";
    app
      .get(url)
      .then((data) =>
        dispatch({
          type: UPDATE_IND_LINKS,
          payload: { userPositionLinks: data.data.applications },
        })
      )
      .catch((err) => console.log(err));
  };
};

const indAccountActions = {
  loginInd,
  logoutInd,
  updateUserPositionLinks,
};

export default indAccountActions;
