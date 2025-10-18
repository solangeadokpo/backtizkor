import { MessageServiceInterface } from "./message-service.interface";

export interface IWhatsappService extends MessageServiceInterface {}

export const WhatsappServiceInterface = Symbol("WhatsappServiceInterface");
