import type { Moment } from "moment";
export type FormData = {
  userName: string;
  profileName: string;
  bio?: string;
  age?: Moment;
  countryName: string;
  gender: string;
};

export enum ProfileSectionEnums {
  PROFILE = "profile",
  FAVORITES = "favorites",
  MYBLOGS = "myblogs",
}