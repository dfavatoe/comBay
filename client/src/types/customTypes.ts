import { Dispatch } from "react";

// export interface Root {
//   message: string;
//   amount: number;
//   records: Record[];
// }

export interface ProductsRoot {
  message: string;
  amount: number;
  records: ProductT[];
}
export interface ProductSpecs {
  productById: ProductT;
}
export interface ProductT {
  dimensions: Dimensions;
  reviews: Reviews;
  meta: Meta;
  _id: string;
  title: string;
  description: string;
  category: string;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  thumbnail: string;
  images: string[];
  price: number;
  seller: Seller;
}

// export interface Record {
//   dimensions: Dimensions;
//   reviews: Reviews;
//   meta: Meta;
//   _id: string;
//   title: string;
//   description: string;
//   category: string;
//   discountPercentage: number;
//   rating: number;
//   stock: number;
//   tags: string[];
//   brand: string;
//   sku: string;
//   weight: number;
//   thumbnail: string;
//   images: string[];
//   price: number;
//   seller: Seller;
// }

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Reviews {
  rating: number;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Meta {
  barcode: string;
  qrcode: string;
  timestamp: Timestamp;
}

export interface Timestamp {
  timestamps: Timestamps;
}

export interface Timestamps {
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}

export interface CreatedAt {
  $timestamp: string;
}

export interface UpdatedAt {
  $timestamp: string;
}

//!maybe has to be changed after users roles are established
export interface Seller {
  id: string;
  address: string;
  name: string;
}

export type UserFull = {
  id: string;
  userName: string;
  email: string;
  password: string;
  image: string;
  role: string;
};

//!maybe has to be changed after users roles are established
export type User = {
  id: string;
  userName: string;
  email: string;
  image: string;
  role: string;
};

// using Pick and Omit
export type LoginCredentials = Pick<
  UserFull,
  "userName" | "password" | "email"
>; // Attention '|' means 'and' here

export type RegisterCredentials = Omit<UserFull, "id">;

export type ModalLoginProps = {
  showLogin: boolean;
  handleLoginClose: () => void;
};

export type ModalSignUpProps = {
  showSignUp: boolean;
  handleSignUpClose: () => void;
};

export type ModalAlertProps = {
  showAlert: boolean;
  setShowAlert: Dispatch<React.SetStateAction<boolean>>;
  alertText: string;
};

// This is the necessary type accordinglly to the positive response of the uploaded image in Cloudinary (Check imageUpload function in usersController)
export type ImageUploadOkResponse = {
  message: string;
  imageURL: string;
};

export interface RegisterOkResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginOkResponse {
  message: string;
  user: User;
  token: string;
}
