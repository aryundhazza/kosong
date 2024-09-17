export interface IUserSignUp {
  name: string;
  email: string;
  password: string;
  role: string;
  referredBy: string;
}

export interface IUserDeposit {
  saldo: number;
}

export interface IUserBuy {
  totalTicket?: number;
}

export interface IUserReview {
  rating?: number;
  comment?: string;
}

export interface IUserGetPeserta {
  organizerId?: number;
}

export interface IUserGetReview {
  eventId?: number;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserState {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}
