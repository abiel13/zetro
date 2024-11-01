import * as zod from "zod";

export const threadValidaton = zod.object({
  thread: zod.string().min(3),
});

export const commentValidation = zod.object({
  thread: zod.string().min(3),
});
