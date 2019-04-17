import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import {Response} from 'express';

@Injectable()
export class TestMiddle implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): any {
    Logger.debug(req.headers);
    // res.json({valid: false});
    next();
  }
}
