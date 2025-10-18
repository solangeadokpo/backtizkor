import { MessageServiceInterface } from "./message-service.interface";

export interface ISmsService extends MessageServiceInterface {}

export const SmsServiceInterface = Symbol("SmsServiceInterface");
