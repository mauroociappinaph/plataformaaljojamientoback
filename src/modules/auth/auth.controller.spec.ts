import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const expectedResult = {
        id: 'user-id',
        email: registerDto.email,
        name: registerDto.name,
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: null,
        phone: null,
      };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

      // Act
      const result = await authController.register(registerDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('debería retornar un token JWT si las credenciales son válidas', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 'user-id',
        email: loginDto.email,
        name: 'Test User',
        role: Role.USER,
      };

      const expectedToken = {
        access_token: 'jwt-token',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(authService, 'login').mockResolvedValue(expectedToken);

      // Act
      const result = await authController.login(loginDto);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(expectedToken);
    });

    it('debería lanzar UnauthorizedException si las credenciales son inválidas', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      // Act & Assert
      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });
  });
});
