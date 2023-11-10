import { createContext } from "@lit/context";

export const pageContext = createContext<number | undefined>("page");
