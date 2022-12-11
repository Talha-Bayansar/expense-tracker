import type { Message } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

const ee = new EventEmitter();

export const chatRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.chat.findMany({
      include: {
        members: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      where: {
        members: { some: ctx.session.user },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.chat.findFirst({
        select: {
          members: true,
          messages: true,
        },
        where: {
          id: input.id,
          members: {
            some: ctx.session.user,
          },
        },
      });
    }),
  onAdd: protectedProcedure.subscription(async () => {
    // `resolve()` is triggered for each client when they start subscribing `onAdd`
    // return an `observable` with a callback which is triggered immediately

    return observable<Message>((emit) => {
      const onAdd = (message: Message) => {
        // emit data to client
        emit.next(message);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on("add", (data) => {
        console.log(data);
      });
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off("add", onAdd);
      };
    });
  }),
  add: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        chatId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.prisma.chat.findFirst({
        select: {
          members: true,
        },
        where: {
          id: input.chatId,
        },
      });

      const message = await ctx.prisma.message.create({
        data: {
          senderId: ctx.session.user.id,
          receiverId: chat.members.find(
            (member) => member.id !== ctx.session.user.id
          ).id,
          chatId: input.chatId,
          message: input.message,
        },
      });
      ee.emit("add", message);
      return message;
    }),
});
