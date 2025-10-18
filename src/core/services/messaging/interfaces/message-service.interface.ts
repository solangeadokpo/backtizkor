export interface MessageServiceInterface {
  /**
   * Sends a message to a specified recipient.
   * @param to - The recipient's identifier (e.g., user ID, phone number).
   * @param message - The message content to be sent.
   * @returns A promise that resolves when the message is sent successfully.
   */
  sendMessage(to: string, message: string): Promise<void>;
}
