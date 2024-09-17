export interface IEvents {
  // sys: { id:  number | null | undefined; };
  // fields: {
  //     name: string;
  //     slug: string;
  //     image: { fields:
  //         { file:
  //             { url: string; };
  //         };
  //     };
  //     author: {
  //         fields: {
  //             avatar: {
  //                 fields: {
  //                     file: { url: string; };
  //                 };
  //             };
  //             name: string;
  //             email: string;
  //         };
  //     };
  // }
  name: string;
  category: string;
  description: string;
  slug: string;
  price: number;
  dateTime: any;
  location: string;
  image: File | string | null;
  seatsAvailable: number;
  ticketTypes: string;
  isPaid?: boolean;
  organizerId: number;
}

export interface EventInput {
  name: string;
  category: string;
  description: string;
  slug: string;
  price: number;
  dateTime: any;
  location: string;
  image: File | string | null;
  seatsAvailable: number;
  ticketTypes: string;
  isPaid?: boolean;
  organizerId: number;
}

export interface EventInputProfile {
  email?: string;
  name?: string;
  avatar?: File | string | null;
}

export interface EventInputDeposit {
  saldo: number;
}

export interface EventInputBuy {
  totalTicket: number;
  eventId?: number;
  userId?: number;
}
