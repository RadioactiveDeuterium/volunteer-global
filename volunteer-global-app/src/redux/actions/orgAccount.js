import { LOGIN_ORG } from "../constants";
import axios from "axios";

const loginOrg = (username, password) => {
  return async (dispatch, getState) => {
    const postUrl = "http://localhost:5000/api/accounts/organization/login";
    const getUrl = "http://localhost:5000/api/accounts/organization/";
    const body = {
      username: username,
      password: password,
    };
    axios
      .post(postUrl, body, { withCredentials: true })
      .then((data) => {
        axios
          .get(getUrl, { withCredentials: true })
          .then((data) => {
            const { companyName, contactEmail, contactPhone } =
              data.data.orgAccount;
            const { accountID, username } = data.data.user;
            dispatch({
              type: LOGIN_ORG,
              payload: {
                companyName,
                contactEmail,
                contactPhone,
                accountID,
                username,
              },
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
};

const orgAccountActions = {
  loginOrg,
};

export default orgAccountActions;
