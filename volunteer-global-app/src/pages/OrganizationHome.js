import OrgHeader from "../components/OrgHeader";
import LoginForm from "../components/LoginForm";
import TitleBar from "../components/TitleBar";
import OrgRegisterForm from "../components/OrgRegisterForm";
import { useState } from "react";
import { useSelector } from "react-redux";

function OrganizationHome() {
  const isLoggedIn = useSelector((state) => state.orgAccountReducer.isLoggedIn);
  const [formState, setFormState] = useState("login");
  return (
    <>
      <OrgHeader active={"view"} />
      {isLoggedIn ? (
        <TitleBar content={"My Positions"} />
      ) : (
        <div className="h-screen flex flex-col items-center justify-center bg-purple-200">
          <p className="text-lg font-bold py-2">
            Please log in or create an account
          </p>
          {formState === "login" ? (
            <LoginForm setFormState={setFormState} />
          ) : (
            <OrgRegisterForm setFormState={setFormState} />
          )}
        </div>
      )}
    </>
  );
}

export default OrganizationHome;
