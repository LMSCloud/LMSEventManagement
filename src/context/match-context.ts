import { createContext } from "@lit/context";

export const matchContext = createContext<
    "contains" | "exact" | "starts_with" | "ends_with" | undefined
>("match");
