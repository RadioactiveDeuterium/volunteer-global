import IndHeader from "../components/IndHeader";
import LoginForm from "../components/LoginForm";
import TitleBar from "../components/TitleBar";
import OrgRegisterForm from "../components/OrgRegisterForm";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import reduxActions from "../redux/actions";
import BrowsePositionCard from "../components/BrowsePositionCard";

function IndividualHome() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.indAccountReducer.isLoggedIn);
  const positions = useSelector((state) => state.positionsReducer.positions);
  const name = useSelector((state) => state.indAccountReducer.name);
  const [formState, setFormState] = useState("login");

  useEffect(() => {
    if (isLoggedIn) dispatch(reduxActions.positionsActions.updatePositions());
  }, [dispatch, isLoggedIn]);
  return (
    <>
      <IndHeader active={"view"} />
      {isLoggedIn ? (
        <>
          <TitleBar content={"Browse Oppertunities"} />
          <div className="w-2/3 mx-auto">
            {positions.map((position) => (
              <BrowsePositionCard
                key={position._id}
                orgName={position.org.companyName}
                positionTitle={position.Title}
                description={position.Description}
                id={position._id}
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
            <LoginForm setFormState={setFormState} accType={"ind"} />
          ) : (
            <OrgRegisterForm setFormState={setFormState} />
          )}
        </div>
      )}
    </>
  );
}

export default IndividualHome;
