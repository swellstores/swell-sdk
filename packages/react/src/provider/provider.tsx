import { createContext, useMemo } from "react";
import { init } from "@swell/js";
import type { SwellClient, SwellClientInitOptions } from "@swell/js";

type SwellContextValue = {
	client?: SwellClient;
};

export const SwellContext = createContext({} as SwellContextValue);

export const SwellContextProvider: React.FC<
	Omit<SwellClientInitOptions, "key" | "useCamelCase"> & {
		children?: React.ReactNode;
		storeKey: string;
	}
> = ({ children, storeKey, ...props }) => {
	const client = useMemo(
		() => init({ ...props, key: storeKey, useCamelCase: true }),
		[props, storeKey],
	);

	return (
		<SwellContext.Provider value={{ client }}>{children}</SwellContext.Provider>
	);
};
