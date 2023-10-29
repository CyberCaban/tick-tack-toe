import ReactDOM from "react-dom/client";
import { Provider } from "jotai";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;
const root = ReactDOM.createRoot(container);
root.render(
  <Provider>
    <App />
  </Provider>,
);
