import { Listing, Reservation, User } from "@prisma/client";
//thay doi kieu du lieu 1 so field
//Omit giup loai bo cac field trong truong hop nay la createdAt,...
//thay doi kieu du lieu sang string

export type safeListing =Omit<
  Listing,
  "createAt"
> & {
  createAt: string
}

export type SafeReservation = Omit<
  Reservation,
  "createAt" | "startDate" | "endAt" | "listing"
>&{
  createAt: string,
  endAt: string,
  startDate: string,
  listing: safeListing
}

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt?: string;
  updatedAt?: string;
  emailVerified?: string | null;
};
