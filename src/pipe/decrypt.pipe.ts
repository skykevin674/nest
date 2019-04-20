import { Injectable, PipeTransform, ArgumentMetadata, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as NodeRsa from 'node-rsa';

@Injectable()
export class DecryptPipe implements PipeTransform<string> {

  private privateKey: any;

  async transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && typeof value === 'string') {
      if (!this.privateKey) {
        const privatePem = fs.readFileSync(path.join(__dirname, '../../rsa_private_key.pem'));
        const privateStr = privatePem.toString();
        this.privateKey = new NodeRsa(privateStr);
        this.privateKey.setOptions({ encryptionScheme: 'pkcs1' });
      }
      Logger.debug(value);
      return JSON.parse(this.privateKey.decrypt(value, 'utf8'));
    }
    return value;
  }
}
