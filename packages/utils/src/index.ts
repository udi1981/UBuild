/**
 * Shared utility functions for UBuilder AI
 */

/** Generate a random ID */
export const generateId = (): string => {
  return crypto.randomUUID();
};
