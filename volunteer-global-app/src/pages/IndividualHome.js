import IndHeader from "../components/IndHeader";
import LoginForm from "../components/LoginForm";
import TitleBar from "../components/TitleBar";
import IndRegisterForm from "../components/IndRegisterForm";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import reduxActions from "../redux/actions";
import BrowsePositionCard from "../components/BrowsePositionCard";

function IndividualHome() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.indAccountReducer.isLoggedIn);
  const positions = useSelector((state) => state.positionsReducer.positions);
  const userPositionLinks = useSelector(
    (state) => state.indAccountReducer.userPositionLinks
  );
  // const name = useSelector((state) => state.indAccountReducer.name);
  const [formState, setFormState] = useState("login");

  const checkApplied = (pos) => {
    if (userPositionLinks) {
      const found = userPositionLinks.find((el) => el.PositionID === pos._id);
      if (found) return true;
    }
    return false;
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(reduxActions.positionsActions.updatePositions());
      dispatch(reduxActions.indAccountActions.updateUserPositionLinks());
    }
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
                alreadyApplied={checkApplied(position)}
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
            <IndRegisterForm setFormState={setFormState} />
          )}
        </div>
      )}
    </>
  );
}

export default IndividualHome;
