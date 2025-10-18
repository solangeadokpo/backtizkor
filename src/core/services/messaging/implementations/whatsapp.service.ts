import { Injectable } from "@nestjs/common";
import { IWhatsappService } from "../interfaces/whatsapp-service.interface";

@Injectable()
export class WhatsappService implements IWhatsappService {
  /**
   * Sends a message to a specified recipient via WhatsApp.
   * @param to - The recipient's phone number.
   * @param message - The message content to be sent.
   * @returns A promise that resolves when the message is sent successfully.
   */
  async sendMessage(to: string, message: string): Promise<void> {
    // Todo: Implement Whatsapp sending logic here
    console.log(`Sending SMS to ${to}: ${message}`);
  }
}
