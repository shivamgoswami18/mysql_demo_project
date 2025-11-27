export enum Messages {
  SERVER_LISTEN = 'Server is listening on port:',

  // Common Messages
  ALREADY_EXIST = 'already exists.',
  CREATED_SUCCESSFULLY = 'created successfully.',
  NOT_FOUND = 'not found.',
  FETCHED_SUCCESSFULLY = 'fetched successfully.',
  UPDATED_SUCCESSFULLY = 'updated successfully.',
  DELETED_SUCCESSFULLY = 'deleted successfully.',
  FILE_UPLOADED_SUCCESSFULLY = 'File uploaded successfully.',
  ALREADY_DELETED = 'already deleted.',
  INVALID = 'invalid.',
  EXPIRED = 'expired.',
  VERIFIED_SUCCESSFULLY = 'verified successfully.',

  // Auth Messages
  INVALID_CREDENTIALS = 'Invalid credentials.',
  LOGIN_SUCCESSFULLY = 'Logged in successfully.',
  INCORRECT = 'is incorrect.',
  CHANGED_SUCCESSFULLY = 'changed successfully.',
  SEND_SUCCESSFULLY = 'send successfully.',
  PASSWORD_RESET_SUCCESSFULLY = 'Password reset successfully.',
  PLEASE_VERIFY_OTP = 'Please verify OTP before resetting password.',
  NEW_PASSWORD_AND_CONFIRM_NEW_PASSWORD_IS_NOT_SAME = 'New password and confirm new password is not same.',

  // Role Messages
  USER_ROLE_NOT_FOUND = 'User role not found.',
  INSUFFICIENT_PERMISSIONS = 'Insufficient permissions. Admin access required.',
  ACCESS_DENIED_ADMIN_REQUIRED = 'Access denied. Admin role required.',
}
