import { Module } from "@nestjs/common";
import { SmsService } from "./implementations/sms.service";
import { WhatsappService } from "./implementations/whatsapp.service";
import { WhatsappServiceInterface } from "./interfaces/whatsapp-service.interface";
import { SmsServiceInterface } from "./interfaces/sms-service.interface";

@Module({
  providers: [
    {
      provide: SmsServiceInterface,
      useClass: SmsService,
    },
    {
      provide: WhatsappServiceInterface,
      useClass: WhatsappService,
    },
  ],
  exports: [SmsServiceInterface, WhatsappServiceInterface],
})
export class MessagingModule {}
