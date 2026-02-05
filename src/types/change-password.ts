export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

export interface ChangePasswordResponse {
  message: string;
}
