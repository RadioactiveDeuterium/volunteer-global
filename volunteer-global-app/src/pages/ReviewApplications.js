import OrgHeader from "../components/OrgHeader";
import TitleBar from "../components/TitleBar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import app from "../utils/axiosConfig";
import { ROUTES } from "../utils/constants";
import { useSelector } from "react-redux";

function ReviewApplications() {
  const { positionID } = useParams();
  const navigate = useNavigate();
  const [pendingApplications, setPendingApplications] = useState(null);
  const isLoggedIn = useSelector((state) => state.orgAccountReducer.isLoggedIn);

  useEffect(() => {
    const url = `/api/positions/pendingApplications/${positionID}`;
    app.get(url).then((data) => setPendingApplications(data.data));
  });

  const approveApplicant = async () => {
    const url = `/api/manage/acceptApplication/${pendingApplications[0]._id}`;
    await app.post(url);
    if (pendingApplications.length === 1) navigate(ROUTES.ORGANIZATION_HOME);
  };

  const rejectApplicant = async () => {
    const url = `/api/manage/rejectApplication/${pendingApplications[0]._id}`;
    await app.post(url);
    if (pendingApplications.length === 1) navigate(ROUTES.ORGANIZATION_HOME);
  };

  useEffect(() => {
    if (!isLoggedIn) navigate(ROUTES.ORGANIZATION_HOME);
  }, [isLoggedIn, navigate]);

  return (
    <>
      <OrgHeader />
      <TitleBar content={"Reviewing Applications"} />
      {pendingApplications && (
        <div className="w-2/3 mx-auto">
          {pendingApplications[0] && (
            <>
              <p className="text-lg w-max mx-auto mt-2">
                Name: {pendingApplications[0].Name}
              </p>
              <p className="text-lg w-max mx-auto mt-2">
                Email: {pendingApplications[0].Email}
              </p>
              <p className="text-lg w-max mx-auto mt-2">
                Phone: {pendingApplications[0].Phone}
              </p>
              {pendingApplications[0].ScreeningResponses.length > 0 && (
                <>
                  <p className="text-lg w-max mx-auto mt-2">
                    Screening Responses:
                  </p>
                  {pendingApplications[0].ScreeningResponses.map((item) => (
                    <p className="text-lg w-max mx-auto mt-2">{item}</p>
                  ))}
                </>
              )}
            </>
          )}
          <div className="flex mx-auto w-max mt-4">
            <button
              className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-max mx-4 whitespace-nowrap"
              type="button"
              onClick={rejectApplicant}
            >
              Reject
            </button>
            <button
              className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-max mx-4 whitespace-nowrap"
              type="button"
              onClick={approveApplicant}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewApplications;
