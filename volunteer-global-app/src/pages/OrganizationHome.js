import OrgHeader from "../components/OrgHeader";
import LoginForm from "../components/LoginForm";
import TitleBar from "../components/TitleBar";
import OrgRegisterForm from "../components/OrgRegisterForm";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import reduxActions from "../redux/actions";

function OrganizationHome() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.orgAccountReducer.isLoggedIn);
  const [formState, setFormState] = useState("login");

  useEffect(() => {
    if (isLoggedIn)
      dispatch(reduxActions.orgAccountActions.updateOrgPositions());
  }, [dispatch, isLoggedIn]);
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
