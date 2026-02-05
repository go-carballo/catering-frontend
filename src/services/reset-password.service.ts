import { apiPost } from "./api";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/reset-password";

export const resetPasswordService = {
  async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    return apiPost<ForgotPasswordResponse>("/auth/forgot-password", data);
  },

  async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    return apiPost<ResetPasswordResponse>("/auth/reset-password", data);
  },
};
