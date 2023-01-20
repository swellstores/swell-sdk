import { useContext } from "react";
import { SwellContext } from "provider";

export default function useSwell() {
	const { client } = useContext(SwellContext);

	if (!client) {
		throw new Error(
			"Swell context is not available. Add a SwellProvider to your app.",
		);
	}

	return client;
}
