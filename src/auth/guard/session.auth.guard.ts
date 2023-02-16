import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifySessionToken } from 'src/helper/jwt';

export class SessionAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // private readonly clientService: ClientDataService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request['headers'];
    const headerObj: { [key: string]: any } = new Object(header);
    const authorization =
      headerObj?.['Authorization'] || headerObj?.['authorization'];
    if (!authorization) return false;
    const authorizationData: Array<string> = authorization.split(' ');
    const token = authorizationData?.[1];
    if (!token) return false;
    try {
      const payload = verifySessionToken(token);
      if (typeof payload !== 'string' && payload?.issuer !== 'SYS_VAULT')
        return false;
      request['payload'] = payload;
    } catch (e) {
      // console.log(e);
      throw new UnauthorizedException();
    }
    return true;
  }
}
