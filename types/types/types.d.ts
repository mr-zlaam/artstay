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
