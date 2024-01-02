import { useParams } from "react-router-dom";
import app from "../utils/axiosConfig";
import { ROUTES } from "../utils/constants";
import IndHeader from "../components/IndHeader";
import TitleBar from "../components/TitleBar";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function ApplyPosition() {
  const navigate = useNavigate();
  const { positionID } = useParams();
  const [position, setPosition] = useState(null);
  const isLoggedIn = useSelector((state) => state.indAccountReducer.isLoggedIn);
  const [loading, setLoading] = useState(false);
  const [screeningResponses, setScreeningResponses] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) navigate(ROUTES.INDIVIDUAL_HOME);
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const url = `/api/positions/${positionID}`;
    app.get(url).then((data) => setPosition(data.data.position));
  }, [positionID]);

  useEffect(() => {
    if (position) {
      var screeningResponsesTemp = [];
      for (var i = 0; i < position.ScreeningQuestions.length; i++) {
        screeningResponsesTemp.push("");
      }
      setScreeningResponses(screeningResponsesTemp);
    }
  }, [position]);

  const updateScreeningResponse = (i, val) => {
    var screeningResponsesTemp = [...screeningResponses];
    screeningResponsesTemp[i] = val;
    setScreeningResponses(screeningResponsesTemp);
  };

  const apply = () => {
    setLoading(true);
    const url = `api/manage/apply/${positionID}`;
    const body = {
      screeningResponses: screeningResponses,
    };
    app
      .post(url, body)
      .then((data) => {
        setLoading(false);
        navigate(ROUTES.INDIVIDUAL_HOME);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div>
      <IndHeader />
      <TitleBar content={`Apply: ${position ? position.Title : ""}`} />
      {position ? (
        <div className="w-2/3 mx-auto">
          {position.ScreeningQuestions.map((question, i) => (
            <div className="mt-4">
              <p>{question}</p>
              <input
                className="shadow appearance-none border rounded w-full my-2 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                onChange={(e) => updateScreeningResponse(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      ) : null}
      <button
        className="flex mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={apply}
      >
        {loading && <Loader />}
        Apply
      </button>
    </div>
  );
}

export default ApplyPosition;
