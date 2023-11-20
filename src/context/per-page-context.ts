import { createContext } from "@lit/context";

export const perPageContext = createContext<number | undefined>("perPage");
