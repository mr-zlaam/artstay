// ** Types
export type TROLE = "SUPERADMIN" | "ADMIN" | "MODERATOR" | "CUSTOMER" | "VENDOR";
// ** Interface
export interface IHTTPRESPONSE {
  success: boolean;
  status: number;
  message: string;
  data: unknown;
  requestInfo: {
    ip?: string;
    url: string | null;
    method: string | null;
  };
}
export interface IREGISTER {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface ILOGIN {
  username: string;
  password: string;
}

export interface IPAYLOAD {
  userID: string;
  username?: string;
  tokenVersion?: number;
  role?: TROLE;
  isVerified?: boolean;
}

export interface ICOOKIEOPTIONS {
  httpOnly: true;
  secure: boolean;
  sameSite: "none";
  expires: Date;
}
