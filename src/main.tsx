import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

import "./index.css";

// biome-ignore lint/style/noNonNullAssertion: root sempre vai ser retornado
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
