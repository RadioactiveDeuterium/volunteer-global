import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import reduxActions from "../redux/actions";

function IndHeader({ active }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.indAccountReducer.isLoggedIn);

  return (
    <div className="h-24 bg-rose-600 flex">
      <div className="mt-5 ml-4 mr-8">
        <h3 className="text-xl font-bold leading-6">Volunteer Global</h3>
        <h2 className="text-4xl font-bold leading-6">Individuals</h2>
      </div>
      {isLoggedIn && (
        <>
          <div className="flex items-center">
            <p
              className={`text-4xl leading-8 cursor-pointer ${
                active === "view" ? "font-bold" : ""
              }`}
              onClick={() => navigate(ROUTES.INDIVIDUAL_HOME)}
            >
              Browse Oppertunities
            </p>
            <p className="text-4xl leading-8 px-4">|</p>
            <p
              className={`text-4xl leading-8 cursor-pointer ${
                active === "create" ? "font-bold" : ""
              }`}
              onClick={() => navigate(ROUTES.INDIVIDUAL_OPPERTUNITIES)}
            >
              My Oppertunities
            </p>
          </div>
          <div className="mr-0 ml-auto flex items-center">
            <p className="text-xl font-bold leading-5 pr-4 cursor-pointer">
              Account
            </p>
            <p className="text-xl font-bold leading-5 pr-4">|</p>
            <p
              className="text-xl font-bold leading-5 pr-4 cursor-pointer"
              onClick={() =>
                dispatch(reduxActions.indAccountActions.logoutInd())
              }
            >
              Log Out
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default IndHeader;
