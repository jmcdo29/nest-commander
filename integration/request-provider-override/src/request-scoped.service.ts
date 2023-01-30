import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class RequestScopedService {
  constructor(@Inject(REQUEST) private readonly req: Record<string, string>) {
    console.log(this.req);
  }

  getRequest() {
    return this.req;
  }
}
