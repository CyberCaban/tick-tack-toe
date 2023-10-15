import { configureStore } from "@reduxjs/toolkit";
import infoSlice from "./infoSlice";

export default configureStore({
	reducer: { info: infoSlice },
});
