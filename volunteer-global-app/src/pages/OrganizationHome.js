import OrgHeader from "../components/OrgHeader";
import LoginForm from "../components/LoginForm";
import TitleBar from "../components/TitleBar";
import OrgRegisterForm from "../components/OrgRegisterForm";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import reduxActions from "../redux/actions";
import PositionCard from "../components/PositionCard";

function OrganizationHome() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.orgAccountReducer.isLoggedIn);
  const positions = useSelector((state) => state.orgAccountReducer.positions);
  const orgName = useSelector((state) => state.orgAccountReducer.companyName);
  const [formState, setFormState] = useState("login");

  useEffect(() => {
    if (isLoggedIn)
      dispatch(reduxActions.orgAccountActions.updateOrgPositions());
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <OrgHeader active={"view"} />
      {isLoggedIn ? (
        <>
          <TitleBar content={"My Positions"} />
          <div className="w-2/3 mx-auto">
            {positions.map((position) => (
              <PositionCard
                key={position._id}
                orgName={orgName}
                positionTitle={position.Title}
                description={position.Description}
                id={position._id}
                hasApplications={position.hasApplications}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="h-screen flex flex-col items-center justify-center bg-purple-200">
          <p className="text-lg font-bold py-2">
            Please log in or create an account
          </p>
          {formState === "login" ? (
            <LoginForm setFormState={setFormState} accType={"org"} />
          ) : (
            <OrgRegisterForm setFormState={setFormState} />
          )}
        </div>
      )}
    </>
  );
}

export default OrganizationHome;
