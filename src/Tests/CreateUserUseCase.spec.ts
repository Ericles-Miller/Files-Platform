import 'reflect-metadata';
import 'express-async-errors';

import {
  mock, instance, when, verify, reset, capture,
} from 'ts-mockito';
import {
  test, expect, describe, vi, afterEach, it, beforeEach,
} from 'vitest';

import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { CreateUserUseCase } from '@Applications/UseCases/users/CreateUserUseCase';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { User } from '@Domain/Entities/User';
import { AppError } from '@Domain/Exceptions/AppError';

vi.mock('@Applications/Services/awsS3');


describe('Users UseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: IUsersRepository;

  beforeEach(() => {
    usersRepository = mock<IUsersRepository>();
    createUserUseCase = new CreateUserUseCase(instance(usersRepository));
  });

  afterEach(() => {
    reset(usersRepository);
  });

  it('should create a new user successfully', async () => {
    let file: Express.Multer.File | undefined;

    const user = new User('Test User', 'test@example.com', 'password123', null);

    user.setAvatar('avatar.png');
    user.setEnable(false);
    user.setFileName('avatar.png');
    user.setPassword(user.password);

    when(usersRepository.checkEmailAlreadyExist(user.email)).thenResolve(null);
    when(usersRepository.create(expect.anything())).thenResolve();

    await createUserUseCase.execute(user);

    verify(usersRepository.checkEmailAlreadyExist(user.email)).once(); // chamado exatamente uma vez com o argumento
    // verify(usersRepository.create(expect.anything())).once(); // Verifica se o método create do mock
    // usersRepository foi chamado exatamente uma vez com qualquer argumento.

    if (file?.buffer) {
      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: process.env.BUCKET_NAME,
        Key: `/root/${expect.anything()}/avatars/avatar.png`,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
    }
  });

  it('should throw an error if user already exists', async () => {
    const user = new User('Test User', 'test@example.com', 'password123', null);

    user.setAvatar('avatar.png');
    user.setEnable(false);
    user.setFileName('avatar.png');
    user.setPassword(user.password);

    when(usersRepository.checkEmailAlreadyExist(user.email)).thenResolve(user);

    await expect(createUserUseCase.execute(user)).rejects.toThrow(AppError);

    verify(usersRepository.checkEmailAlreadyExist(user.email)).once();
    verify(usersRepository.create(expect.anything())).never();
  });

  it('should hash the password before saving', async () => {
    const user = new User('Test User', 'test@example.com', 'password123', null);

    user.setAvatar('avatar.png');
    user.setEnable(false);
    user.setFileName('avatar.png');
    user.setPassword(user.password);

    when(usersRepository.checkEmailAlreadyExist(user.email)).thenResolve(null);
    when(usersRepository.create(expect.anything())).thenResolve();

    await createUserUseCase.execute(user);

    const [userArg] = capture(usersRepository.create).last();
    expect(userArg.password).not.toBe(user.password);
    expect(userArg.password).not.toBe(user.password.length >= 9);
    expect(userArg.password).toMatch(/^\$2[ayb]\$.{56}$/);
  });
});
