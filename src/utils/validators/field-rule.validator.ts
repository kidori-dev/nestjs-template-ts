import { IncorrectPasswordException } from '../../exceptions/exception-422';

export const validatingPassword = (value: string) => {
  if (value.length < 8 || value.length > 15) {
    throw new IncorrectPasswordException();
  }

  const hasDisallowedSpecialChars = /[^a-zA-Z0-9!@#$%^&*]/.test(value);
  if (hasDisallowedSpecialChars) {
    throw new IncorrectPasswordException();
  }

  const hasSpecialCharacter = /[!@#$%^&*]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasLetter = /[a-zA-Z]/.test(value);
  if (!hasSpecialCharacter || !hasNumber || !hasLetter) {
    throw new IncorrectPasswordException();
  }
};

export const validatingUsername = (value: string) => {
  const englishCharactersAndNumbersRegex = /^[A-Za-z0-9]+$/;

  if (value.length < 4 || value.length > 30) {
    throw new IncorrectPasswordException();
  }

  if (!englishCharactersAndNumbersRegex.test(value)) {
    throw new IncorrectPasswordException();
  }
};
