import { router } from "../trpc";
import { authRouter } from "./auth";
import { chatRouter } from "./chat";
import { expenseRouter } from "./expense";
import { movieRouter } from "./movies";

export const appRouter = router({
  expense: expenseRouter,
  chat: chatRouter,
  auth: authRouter,
  movie: movieRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
