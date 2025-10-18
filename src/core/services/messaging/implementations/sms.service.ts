import { Injectable } from "@nestjs/common";
import { ISmsService } from "../interfaces/sms-service.interface";

@Injectable()
export class SmsService implements ISmsService {
  /**
   * Sends a message to a specified recipient.
   * @param to - The recipient's phone number.
   * @param message - The message content to be sent.
   * @returns A promise that resolves when the message is sent successfully.
   */
  async sendMessage(to: string, message: string): Promise<void> {
    // Todo: Implement Sms sending logic here
    console.log(`Sending SMS to ${to}: ${message}`);
  }
}
