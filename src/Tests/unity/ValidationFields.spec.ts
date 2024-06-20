/* eslint-disable import/no-extraneous-dependencies */
import {
  describe, expect, test,
} from 'vitest';

import { validationsFields } from '@Applications/Services/users/validateFields';
import { AppError } from '@Domain/Exceptions/AppError';


describe('Validation Fields to created a new User', () => {
  test('should pass with valid inputs', () => {
    expect(() => validationsFields({
      name: 'John Doe',
      password: 'password123',
      email: 'john.doe@example.com',
    })).not.toThrow();
  });

  test('should throw error for name with special characters', () => {
    expect(() => validationsFields({
      name: 'John@Doe',
      password: 'password123',
      email: 'john.doe@example.com',
    })).toThrow(AppError);
  });

  test('should throw error for name longer than 255 characters', () => {
    expect(() => validationsFields({
      name: 'a'.repeat(256),
      password: 'password123',
      email: 'john.doe@example.com',
    })).toThrow(AppError);
  });

  test('should throw error for name with less than two words', () => {
    expect(() => validationsFields({
      name: 'John',
      password: 'password123',
      email: 'john.doe@example.com',
    })).toThrow(AppError);
  });

  test('should throw error for password with less than 8 characters', () => {
    expect(() => validationsFields({
      name: 'John Doe',
      password: 'pass',
      email: 'john.doe@example.com',
    })).toThrow(AppError);
  });

  test('should throw error for invalid email', () => {
    expect(() => validationsFields({
      name: 'John Doe',
      password: 'password123',
      email: 'john.doe.com',
    })).toThrow(AppError);
  });

  test('should pass without email', () => {
    expect(() => validationsFields({
      name: 'John Doe',
      password: 'password123',
      email: undefined,
    })).not.toThrow();
  });

  test('should throw error for email with incorrect characters', () => {
    expect(() => validationsFields({
      name: 'John Doe',
      password: 'password123',
      email: 'john.doe@ex@mple.com',
    })).toThrow(AppError);
  });
});
