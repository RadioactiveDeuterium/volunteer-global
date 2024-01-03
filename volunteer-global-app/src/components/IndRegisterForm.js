import { useState, useEffect } from "react";
import app from "../utils/axiosConfig";
import Loader from "./Loader";

function IndRegisterForm({ setFormState }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

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
    if (password.length < 3) return false;
    if (name.length < 3) return false;
    if (!validateEmail(email)) return false;
    if (!validatePhone(phone)) return false;
    return true;
  };

  const register = async () => {
    setLoading(true);
    const url = "/api/accounts/individual/register";
    const body = {
      username: username,
      password: password,
      name: name,
      phone: phone,
      email: email,
    };
    await app.post(url, body);
    alert("Account created. Please login.");
    setFormState("login");
    setLoading(false);
  };

  useEffect(() => {
    setCanSubmit(checkSubmit);
  }, [username, password, name, phone, email]);

  return (
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          for="username"
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
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="******************"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          for="company-name"
        >
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="company-name"
          type="text"
          placeholder="Joe Smith"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          for="company-phone"
        >
          Phone
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="company-phone"
          type="text"
          placeholder="(800) 555-5555"
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          for="company-email"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="company-email"
          type="text"
          placeholder="smith@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            canSubmit ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-500"
          }`}
          type="button"
          onClick={register}
          disabled={!canSubmit}
        >
          {loading && <Loader />}
          Register
        </button>
        <p
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
          onClick={() => setFormState("login")}
        >
          Sign In
        </p>
      </div>
    </form>
  );
}

export default IndRegisterForm;
