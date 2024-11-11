import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService, // Inject PrismaService
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    avatarPath: string, // Path to the uploaded avatar image
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        name,
        avatar: avatarPath, // Save the file path in the database
        email,
        password: hashedPassword,
      },
    });
    return this.generateAccessToken(user.id, user.email, user.name);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const access_token = await this.generateAccessToken(
      user.id,
      user.email,
      user.name,
    );
    const refresh_token = await this.generateRefreshToken(user.id);
    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async updateUser(id: number, name?: string, avatarPath?: string) {
    try {
      // Check if the user exists before updating
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      // Prepare the data object with fields that are provided
      const data: any = {};
      if (name) data.name = name;
      if (avatarPath) data.avatar = avatarPath;

      // Attempt to update the user
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });

      return user;
    } catch (error) {
      // Log the entire error object to get detailed information
      console.error('Error updating user:', error);

      // Return a more specific error message
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async getAllUser() {
    return this.prisma.user.findMany();
  }
  async getUser(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: Number(id) } });
  }

  // private async generateToken(userId: number, email: string, name: string) {
  //   const expiresIn = '2h';
  //   const payload = { id: userId, email, name };
  //   return this.jwtService.sign(payload, { expiresIn });
  // }
  private async generateAccessToken(
    userId: number,
    email: string,
    name: string,
  ) {
    const payload = { id: userId, email, name };
    const expiresIn = '15m'; // Access token valid for 15 minutes
    return this.jwtService.sign(payload, { expiresIn });
  }

  private async generateRefreshToken(userId: number) {
    const payload = { id: userId };
    const expiresIn = '7d'; // Refresh token valid for 7 days
    return this.jwtService.sign(payload, { expiresIn });
  }
}
