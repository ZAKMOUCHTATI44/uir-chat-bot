import { z } from 'zod';

export const messageSchema = z.object({
  From: z.string(),
  Body: z.string().optional(),
  MediaContentType0: z.string().optional(),
  MediaUrl0: z.string().optional(),
});