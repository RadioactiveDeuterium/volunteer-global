import { useParams } from "react-router-dom";
import app from "../utils/axiosConfig";
import { useEffect, useState } from "react";
import OrgHeader from "../components/OrgHeader";
import TitleBar from "../components/TitleBar";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

function ManagePosition() {
  const { positionID } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [volunteerDetails, setVolunteerDetails] = useState([]);
  const isLoggedIn = useSelector((state) => state.orgAccountReducer.isLoggedIn);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate(ROUTES.ORGANIZATION_HOME);
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const url = `/api/positions/${positionID}`;

    app.get(url).then((data) => {
      setPosition(data.data.position);
      setVolunteerDetails(data.data.volunteerDetails);
      console.log(data.data.volunteerDetails);
    });
  }, [positionID]);

  const updateTitle = (title) => {
    var newPosition = { ...position };
    newPosition.Title = title;
    setPosition(newPosition);
  };

  const updateDescription = (desc) => {
    var newPosition = { ...position };
    newPosition.Description = desc;
    setPosition(newPosition);
  };

  const updatePosition = () => {
    setLoading(true);
    const url = `/api/positions/${position._id}`;
    const body = {
      title: position.Title,
      description: position.Description,
    };
    app
      .patch(url, body)
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert(`Error saving: ${err}`);
      });
  };

  return (
    <div>
      <OrgHeader />
      <TitleBar content={`Manage: ${position ? position.Title : ""}`} />
      {position && (
        <>
          <div className="flex w-2/3 mx-auto pt-4">
            <div className="w-1/2 px-2">
              {/* Title */}
              <label
                className="block text-lg font-bold mb-2"
                htmlFor="positionTitle"
              >
                Position Title:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                id="positionTitle"
                type="text"
                placeholder="Title"
                onChange={(e) => updateTitle(e.target.value)}
                value={position.Title}
              />
              {/* Description */}
              <label
                className="block text-lg font-bold my-2"
                htmlFor="description"
              >
                Description:
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="text"
                placeholder="Description"
                cols="40"
                rows="5"
                onChange={(e) => updateDescription(e.target.value)}
                value={position.Description}
              />
              <div className="flex">
                <button
                  className="flex mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={updatePosition}
                >
                  {loading && <Loader />}
                  Save
                </button>
                <button
                  className="flex mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() =>
                    navigate(
                      `${ROUTES.MANAGE_POSITION_SCHEDULE_STUB}${positionID}`
                    )
                  }
                >
                  Manage Schedule
                </button>
              </div>
            </div>
            <div className="w-1/2 px-2">
              <p className="font-bold text-lg">Accepted Volunteers:</p>
              {volunteerDetails.map((item) => (
                <div className="mt-4">
                  <p>{item.user.Name}</p>
                  <p>{item.user.Phone}</p>
                  <p>{item.user.Email}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ManagePosition;
