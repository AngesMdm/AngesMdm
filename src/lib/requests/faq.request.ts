import { Folder, File, FAQ } from "@/types/type";
import Query from "../db";

/**
 * Récupère la liste des questions FAQ
 * @returns Une promesse contenant la liste des questions FAQ
 */
export async function getFaqList(): Promise<FAQ[]> {
  const bddResponse = await Query(`
    SELECT 
      q.id, 
      q.question, 
      q.created_by, 
      q.created_at, 
      a.answer, 
      a.answered_by, 
      a.answered_at,
      a.id AS answerid
    FROM faq_questions q
    LEFT JOIN faq_answers a ON a.question_id = q.id
    ORDER BY q.created_at DESC
  `);
  return bddResponse.rows as FAQ[];
}

/**
 * Récupère une question FAQ par son ID
 * @param id L'ID de la question FAQ
 * @returns Une promesse contenant la question FAQ
 */
export async function addFaqQuestion(question: string, userId: number): Promise<void> {
  await Query(
    "INSERT INTO faq_questions (question, created_by) VALUES ($1, $2)",
    [question, userId]
  );
}

/**
 * Insère ou met à jour la réponse d'une question FAQ
 * @param questionId L'ID de la question FAQ
 * @param answer La réponse à la question FAQ
 * @param adminId L'ID de l'admin qui répond
 */
export async function upsertFaqAnswer(questionId: number, answer: string, adminId: number): Promise<void> {
  await Query(`
    INSERT INTO faq_answers (question_id, answer, answered_by)
    VALUES ($1, $2, $3)
    ON CONFLICT (question_id)
    DO UPDATE SET answer = $2, answered_by = $3, answered_at = NOW()
  `, [questionId, answer, adminId]);
}

/**
 * Supprime une question FAQ par son ID
 * @param id L'ID de la question FAQ
 * @returns 
 */
export async function deleteFaqQuestion(questionId: number): Promise<void> {
  // Supprime d'abord les réponses liées à la question
  await Query("DELETE FROM faq_answers WHERE question_id = $1", [questionId]);
  // Puis supprime la question elle-même
  await Query("DELETE FROM faq_questions WHERE id = $1", [questionId]);
}

/**
 * Supprime une réponse FAQ par son ID
 * @param id L'ID de la réponse FAQ
 * @returns 
 */
export async function deleteFaqAnswer(answerId: number): Promise<void> {
  await Query("DELETE FROM faq_answers WHERE id = $1", [answerId]);
}