import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('debería crear un nuevo usuario exitosamente', async () => {
      // Arrange
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const hashedPassword = 'hashedPassword';
      const mockedUser = {
        id: 'user-id',
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: null,
        phone: null,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockedUser);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...registerDto,
          password: hashedPassword,
        },
      });
      expect(result).toEqual({
        id: mockedUser.id,
        email: mockedUser.email,
        name: mockedUser.name,
        role: mockedUser.role,
        createdAt: mockedUser.createdAt,
        updatedAt: mockedUser.updatedAt,
        avatar: mockedUser.avatar,
        phone: mockedUser.phone,
      });
      // No verificamos que password sea undefined porque ya debería estar excluido del resultado
    });

    it('debería lanzar ConflictException si el email ya está registrado', async () => {
      // Arrange
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      const existingUser = {
        id: 'existing-id',
        email: registerDto.email,
        password: 'hashedPassword',
        name: 'Existing User',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: null,
        phone: null,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(existingUser);

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toThrow(ConflictException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });
  });

  describe('validateUser', () => {
    it('debería retornar el usuario sin la contraseña si las credenciales son válidas', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      const user = {
        id: 'user-id',
        email,
        password: hashedPassword,
        name: 'Test User',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: null,
        phone: null,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      // Act
      const result = await authService.validateUser(email, password);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        avatar: user.avatar,
        phone: user.phone,
      });
    });

    it('debería retornar null si el usuario no existe', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'password123';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Act
      const result = await authService.validateUser(email, password);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });

    it('debería retornar null si la contraseña es incorrecta', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const hashedPassword = 'hashedPassword';

      const user = {
        id: 'user-id',
        email,
        password: hashedPassword,
        name: 'Test User',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: null,
        phone: null,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      // Act
      const result = await authService.validateUser(email, password);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('debería retornar un token JWT', async () => {
      // Arrange
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.USER,
      };

      const token = 'jwt-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      // Act
      const result = await authService.login(user);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
        role: user.role,
      });
      expect(result).toEqual({
        access_token: token,
      });
    });
  });
});
