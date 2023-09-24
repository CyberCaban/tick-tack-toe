import { useState } from "react";

function Comp() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<h1>{count}</h1>
			<button onClick={() => setCount(count + 1)}>Click Me!</button>
		</div>
	);
}

export default Comp;
