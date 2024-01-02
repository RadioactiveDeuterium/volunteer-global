import { UPDATE_POSITIONS } from "../constants";
import app from "../../utils/axiosConfig";

const updatePositions = () => {
  return async (dispatch, getState) => {
    const url = "api/positions/";
    app
      .get(url)
      .then((data) =>
        dispatch({
          type: UPDATE_POSITIONS,
          payload: { positions: data.data },
        })
      )
      .catch((err) => console.log(err));
  };
};

const positionsActions = {
  updatePositions,
};

export default positionsActions;
