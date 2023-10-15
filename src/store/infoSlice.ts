import { createSlice } from "@reduxjs/toolkit";

const infoSlice = createSlice({
	name: "infoSlice",
	initialState: { info: { username: "", roomID: "" } },
	reducers: {
		setUsername(state, action) {
			state.info.username = action.payload.username;
		},

		setRoomID(state, action) {
			state.info.roomID = action.payload.roomID;
		},
	},
});

export const { setUsername, setRoomID } = infoSlice.actions;

export default infoSlice.reducer;
