export interface IJwtPayload {
  sub: string;
  phone?: string;
  [key: string]: any;
}
