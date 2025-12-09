export enum AuthMode {
  Login = 'Login',
  Signup = 'Signup',
  Forgot = 'Forgot',
}

export type AuthCommonProps = {
  onSwitch: (mode: AuthMode) => void;
  disabled?: boolean;
};

export type AuthCopy = {
  titleKey: string;
  descriptionKey: string;
};

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  imageUrl: string;
  language: string;
  companyId: number;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  email: string;
};
