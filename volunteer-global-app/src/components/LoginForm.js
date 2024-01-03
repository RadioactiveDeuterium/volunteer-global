import { useDispatch, useSelector } from "react-redux";
import reduxActions from "../redux/actions";
import { useState } from "react";
import Loader from "./Loader";

function LoginForm({ setFormState, accType }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.orgAccountReducer.loading);
  const loginError = useSelector((state) => state.orgAccountReducer.loginError);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (accType === "org") {
      dispatch(reduxActions.orgAccountActions.loginOrg(username, password));
    }
    if (accType === "ind") {
      dispatch(reduxActions.indAccountActions.loginInd(username, password));
    }
  };

  return (
    <form className="bg-white shadow-md rounded px-8 pt-4 pb-4">
      <div className="mb-4">
        {/* Username */}
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {/* Password */}
      <div className="mb-2">
        <label
          className="block text-gray-700 text-sm font-bold mb-4"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="******************"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={login}
        >
          {loading && <Loader />}
          Sign In
        </button>
        <p
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer pl-2"
          onClick={() => setFormState("register")}
        >
          Create Account
        </p>
      </div>
      {loginError && (
        <div>
          <p className="text-red-500 text-xs italic text-center pt-3">
            Invalid Email or Password
          </p>
        </div>
      )}
    </form>
  );
}

export default LoginForm;
