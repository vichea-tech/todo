import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from './auth.guard';
import { Response } from 'express';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // async register(
  //   @Body()
  //   body: {
  //     email: string;
  //     password: string;
  //     name: string;
  //     avatar: string;
  //   },
  // ) {
  //   return this.authService.register(
  //     body.email,
  //     body.password,
  //     body.name,
  //     body.avatar,
  //   );
  // }
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars', // Directory to store uploaded images
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async register(
    @Body() body: { email: string; password: string; name: string },
    @UploadedFile() avatar: Express.Multer.File, // Access the uploaded file here
  ) {
    const avatarPath = avatar ? avatar.path : null; // Get the file path or set to null if no file
    return this.authService.register(
      body.email,
      body.password,
      body.name,
      avatarPath, // Pass the file path to the service
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllUser')
  async getAllUser(@Res() response: Response): Promise<any> {
    const result = await this.authService.getAllUser();
    return response.status(200).json({
      status: 'Ok!',
      message: 'Successfully fetch data!',
      result: result,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() body: { name?: string; avatarPath?: string },
  ) {
    return this.authService.updateUser(Number(id), body.name, body.avatarPath);
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User | null> {
    return this.authService.getUser(id);
  }
}
