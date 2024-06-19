import { AppError } from '@Domain/Exceptions/AppError';
import { IValidateDTO } from '@Infra/DTOs/users/IValidateDTO';

export function validationsFields({ name, password, email }: IValidateDTO): void {
  const regexName = /[^A-Za-zÀ-üÜ\s.']/g;
  const extraSpaceName = name.trim();
  const nameLen = extraSpaceName.split(' ');

  if ((name.match(regexName) || []).length > 0 || name.length > 255 || nameLen.length <= 1) {
    throw new AppError(
      'The field name contains characters incorrect, number of characters is greater than 255, or number of names is equal to one!',
      400,
    );
  }

  if (password.length <= 8) {
    throw new AppError('The field password contains incorrect characters, or the number of characters is greater than 8!', 400);
  }

  if (email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
      throw new AppError('The field email contains incorrect characters!', 400);
    }
  }
}
