import { apiPost } from "./api";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/types/change-password";

export const changePasswordService = {
  async changePassword(
    data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    return apiPost<ChangePasswordResponse>("/auth/change-password", data);
  },
};
