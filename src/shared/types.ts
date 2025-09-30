import z from "zod";

export const ChatMessageSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  user_message: z.string(),
  ai_response: z.string(),
  risk_level: z.enum(['Low', 'Medium', 'High']),
  coping_tip_title: z.string().nullable(),
  coping_tip_content: z.string().nullable(),
  session_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const BotLibrarySchema = z.object({
  id: z.number(),
  trigger_keywords: z.string(),
  response_text: z.string(),
  coping_tip_title: z.string().nullable(),
  coping_tip_content: z.string().nullable(),
  risk_level: z.enum(['Low', 'Medium', 'High']),
});

export const UserSessionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  session_id: z.string(),
  latest_concern: z.string().nullable(),
  last_three_messages_summary: z.string().nullable(),
  overall_risk_level: z.enum(['Low', 'Medium', 'High']),
  suggested_next_step: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type BotLibraryEntry = z.infer<typeof BotLibrarySchema>;
export type UserSession = z.infer<typeof UserSessionSchema>;

export interface ChatResponse {
  response: string;
  copingTip: {
    title: string | null;
    content: string | null;
  };
  riskLevel: 'Low' | 'Medium' | 'High';
}
