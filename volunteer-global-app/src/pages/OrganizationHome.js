import OrgHeader from "../components/OrgHeader";
import LoginForm from "../components/LoginForm";
import OrgRegisterForm from "../components/OrgRegisterForm";
import { useState } from "react";

function OrganizationHome() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formState, setFormState] = useState("login");
  return (
    <>
      <OrgHeader />
      {isLoggedIn ? (
        <> </>
      ) : (
        <div class="h-screen flex flex-col items-center justify-center bg-purple-200">
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
