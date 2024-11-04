import * as zod from "zod";

export const threadValidaton = zod.object({
  thread: zod.string().min(3),
  thumbnail:zod.string().optional()
});

export const commentValidation = zod.object({
  thread: zod.string().min(3),
  image: zod.string().optional()
});
