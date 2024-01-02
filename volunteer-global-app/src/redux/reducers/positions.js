import { UPDATE_POSITIONS } from "../constants";
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  positions: [],
};

const positionsReducer = createReducer(initialState, (builder) => {
  builder.addCase(UPDATE_POSITIONS, (state, action) => {
    state.positions = action.payload.positions;
  });
});

export default positionsReducer;
