import OrgHeader from "../components/OrgHeader";
import TitleBar from "../components/TitleBar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import Loader from "../components/Loader";
import app from "../utils/axiosConfig";

function CreatePosition() {
  const isLoggedIn = useSelector((state) => state.orgAccountReducer.isLoggedIn);
  const navigate = useNavigate();
  const [screeningQuestions, setScreeningQuestions] = useState([]);
  const [screeningQuestionKeys, setScreeningQuestionKeys] = useState([]);
  const [lastKey, setLastKey] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate(ROUTES.ORGANIZATION_HOME);
  }, [isLoggedIn, navigate]);

  const createPosting = () => {
    setLoading(true);
    const url = "api/positions/";
    const body = {
      title: title,
      description: description,
      screeningQuestions: screeningQuestions,
    };
    app
      .post(url, body)
      .then((data) => {
        setLoading(false);
        navigate(ROUTES.ORGANIZATION_HOME);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const addQuestion = () => {
    var newQuestionArray = [...screeningQuestions];
    newQuestionArray.push("Question");

    var newKeyArray = [...screeningQuestionKeys];
    newKeyArray.push(lastKey + 1);

    setScreeningQuestions(newQuestionArray);
    setScreeningQuestionKeys(newKeyArray);
    setLastKey(lastKey + 1);
  };

  const removeQuestion = (i) => {
    var newQuestionArray = [...screeningQuestions];
    newQuestionArray.splice(i, 1);

    var newKeyArray = [...screeningQuestionKeys];
    newKeyArray.splice(i, 1);

    setScreeningQuestions(newQuestionArray);
    setScreeningQuestionKeys(newKeyArray);
  };

  const setQuestion = (content, i) => {
    var newQuestionArray = [...screeningQuestions];
    newQuestionArray[i] = content;
    setScreeningQuestions(newQuestionArray);
  };

  return (
    <>
      <OrgHeader active={"create"} />
      <TitleBar content={"Create New Position"} />
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
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* Description */}
          <label className="block text-lg font-bold my-2" htmlFor="description">
            Description:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            type="text"
            placeholder="Description"
            cols="40"
            rows="5"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="w-1/2 px-2">
          {/* Screening Questions */}
          <label
            className="block text-lg font-bold mb-2"
            htmlFor="screeningQuestions"
          >
            Screening Questions:
          </label>
          {screeningQuestions.map((question, i) => (
            <div key={screeningQuestionKeys[i]}>
              <input
                className="shadow appearance-none border rounded w-full my-2 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder={question}
                onChange={(e) => setQuestion(e.target.value, i)}
              />
              <p
                className="block text-lg font-bold mb-2 cursor-pointer w-max"
                onClick={() => removeQuestion(i)}
              >
                Remove -
              </p>
            </div>
          ))}
          <p
            className="block text-lg font-bold mb-2 cursor-pointer"
            onClick={addQuestion}
          >
            Add Question +
          </p>
        </div>
      </div>
      <button
        className="flex mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={createPosting}
      >
        {loading && <Loader />}
        Create
      </button>
    </>
  );
}

export default CreatePosition;
