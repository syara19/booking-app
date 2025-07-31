export interface LoginInput {
  email: string;
  password: string;
}

export interface Customer{
  fullname: string;
  phoneNumber: string;
  address?: string;
}

export interface Admin{
  fullName?: string;
  phoneNumber?: string;
}

export interface RegisterInput extends LoginInput {
  fullname: string;
  phoneNumber: string;
  role: "CUSTOMER" | "ADMIN";
  address?: string;
}

export interface UserData extends LoginInput {
  username: string;
  role: "CUSTOMER" | "ADMIN";
  customer?: {
    create: {
      fullName: string;
      phoneNumber: string;
      address: string;
    };
  };
  admin?: {
    create: {
      fullName: string;
      phoneNumber: string;
    };
  };
}