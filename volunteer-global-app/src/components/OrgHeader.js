import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import reduxActions from "../redux/actions";

function OrgHeader({ active }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.orgAccountReducer.isLoggedIn);

  return (
    <div className="h-24 bg-blue-600 flex">
      <div className="mt-5 ml-4 mr-8">
        <h3 className="text-xl font-bold leading-6">Volunteer Global</h3>
        <h2 className="text-4xl font-bold leading-6">Organizations</h2>
      </div>
      {isLoggedIn && (
        <>
          <div className="flex items-center">
            <p
              className={`text-4xl leading-8 cursor-pointer ${
                active === "view" ? "font-bold" : ""
              }`}
              onClick={() => navigate(ROUTES.ORGANIZATION_HOME)}
            >
              My Positions
            </p>
            <p className="text-4xl leading-8 px-4">|</p>
            <p
              className={`text-4xl leading-8 cursor-pointer ${
                active === "create" ? "font-bold" : ""
              }`}
              onClick={() => navigate(ROUTES.CREATE_POSTION)}
            >
              Create New Positions
            </p>
          </div>
          <div className="mr-0 ml-auto flex items-center">
            <p
              className="text-xl font-bold leading-5 pr-4 cursor-pointer"
              onClick={() => navigate(ROUTES.EDIT_ORG_ACCOUNT)}
            >
              Account
            </p>
            <p className="text-xl font-bold leading-5 pr-4">|</p>
            <p
              className="text-xl font-bold leading-5 pr-4 cursor-pointer"
              onClick={() =>
                dispatch(reduxActions.orgAccountActions.logoutOrg())
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

export default OrgHeader;
