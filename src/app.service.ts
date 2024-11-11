import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<h1>🏃‍➡️API is  running on port: ${process.env.PORT || 3300} 🏃</h1>`;
  }
}
