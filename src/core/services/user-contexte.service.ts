import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

interface UserContextData {
  userId: string;
  user: any;
}

@Injectable()
export class UserContextService {
  private static asyncLocalStorage = new AsyncLocalStorage<UserContextData>();

  static run<T>(userId: string, user: any, callback: () => T): T {
    return this.asyncLocalStorage.run({ userId, user }, callback);
  }

  static getCurrentUserId(): string | undefined {
    return this.asyncLocalStorage.getStore()?.userId;
  }

  static getCurrentUser(): any | undefined {
    return this.asyncLocalStorage.getStore()?.user;
  }

  static hasUserContext(): boolean {
    return this.asyncLocalStorage.getStore() !== undefined;
  }
}
