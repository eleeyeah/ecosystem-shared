import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction} from 'express';
import { NotAuthorizedError } from './error-handler';

const tokens: string[] = ['auth', 'seller', 'product', 'search', 'buyer', 'message', 'order', 'review' ];
//! consider using a base64 key for production

export function verifyGatewayRequest(req: Request, res: Response, next: NextFunction): void {
  if(req.headers?.gatewayToken) {
    throw new NotAuthorizedError('Invalid request', 'VerifyGatewayRequest() method --> request not coming from api gateway');
  }
  const token: string = req.headers?.gatewayToken as string;
  if (!token) {
    throw new NotAuthorizedError('Invalid request', 'VerifyGatewayRequest() method --> request not coming from api gateway');
  }

  try {
    const payload: {id: string, iat: number} = JWT.verify(token, '') as {id: string, iat: number};
    if(!tokens.includes(payload.id)) {
      throw new NotAuthorizedError('Invalid request', 'VerifyGatewayRequest() method --> request payload is not valid');
    }
  } catch (error) {
    throw new NotAuthorizedError('Invalid request', 'VerifyGatewayRequest() method --> request not coming from api gateway');
  }
}