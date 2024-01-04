import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import OrgHeader from "../components/OrgHeader";
import TitleBar from "../components/TitleBar";
import { useSelector } from "react-redux";
import { ROUTES } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import app from "../utils/axiosConfig";

function OrgEditAccount() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.orgAccountReducer.isLoggedIn);
  const initUsername = useSelector((state) => state.orgAccountReducer.username);
  const initName = useSelector((state) => state.orgAccountReducer.companyName);
  const initPhone = useSelector(
    (state) => state.orgAccountReducer.contactPhone
  );
  const initEmail = useSelector(
    (state) => state.orgAccountReducer.contactEmail
  );

  const [username, setUsername] = useState(initUsername);
  const [name, setName] = useState(initName);
  const [phone, setPhone] = useState(initPhone);
  const [email, setEmail] = useState(initEmail);
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);

  const updateAccount = async () => {
    setLoading(true);
    const url = "api/accounts/organization/";
    const body = {
      ...(username !== initUsername && { username: username }),
      ...(name !== initName && { companyName: name }),
      ...(email !== initEmail && { contactEmail: email }),
      ...(phone !== initPhone && { contactPhone: phone }),
    };
    await app.patch(url, body);
    setLoading(false);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePhone = (phone) => {
    return (
      String(phone)
        .toLowerCase()
        // eslint-disable-next-line
        .match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    );
  };

  const checkSubmit = () => {
    if (username.length < 3) return false;
    if (name.length < 3) return false;
    if (!validateEmail(email)) return false;
    if (!validatePhone(phone)) return false;
    return true;
  };

  useEffect(() => {
    setCanSubmit(checkSubmit);
  }, [username, name, phone, email]);

  useEffect(() => {
    if (!isLoggedIn) navigate(ROUTES.ORGANIZATION_HOME);
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <OrgHeader />
      <TitleBar content={"Edit Account Details"} />
      <div className="w-2/3 mx-auto pt-4">
        {/* Username */}
        <label className="block text-lg font-bold mt-4" htmlFor="username">
          Username:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        {/* Company Name */}
        <label className="block text-lg font-bold mt-4" htmlFor="name">
          Company Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        {/* Company Phone */}
        <label className="block text-lg font-bold mt-4" htmlFor="phone">
          Company Phone:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="phone"
          type="text"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
        />
        {/* Company Email */}
        <label className="block text-lg font-bold mt-4" htmlFor="email">
          Company Email:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="flex">
          <button
            className={`text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline ${
              canSubmit ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-500"
            }`}
            type="button"
            disabled={!canSubmit}
            onClick={updateAccount}
          >
            {loading && <Loader />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrgEditAccount;
