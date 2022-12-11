import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const expenseRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.expense.findMany({
      select: {
        id: true,
        amount: true,
        category: true,
      },
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),
});
