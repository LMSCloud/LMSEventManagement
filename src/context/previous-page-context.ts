import { createContext } from "@lit/context";

export const previousPageContext = createContext<any[] | undefined>(
    "previousPage"
);
