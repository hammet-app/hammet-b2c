import { RegisterB2CRequest, ClaimAccountRequest, UpdatePassword } from "./types"
import { RegisterB2CRequestDto, ClaimAccountRequestDto, UpdatePasswordDto } from "./types-dto"


export function fromRegisterB2CRequest(model: RegisterB2CRequest): RegisterB2CRequestDto {
  return {
    full_name: model.fullName,
    email: model.email,
    username: model.username,
    password: model.password
  }
}

export function fromClaimAccountRequest(model: ClaimAccountRequest): ClaimAccountRequestDto {
  if ("googleIdToken" in model) {
    return {
      token: model.token,
      google_id_token: model.googleIdToken,
      device_id: model.deviceId
    }
  }
  return {
    email: model.email,
    token: model.token,
    claim_code: model.claimCode,
    password: model.password,
    device_id: model.deviceId

  }
}

export function fromUpdatePassword(model: UpdatePassword): UpdatePasswordDto {
  return {
    current_password: model.currentPassword,
    new_password: model.newPassword
  }
}