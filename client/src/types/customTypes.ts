import { Dispatch } from "react";

// export interface Root {
//   message: string;
//   amount: number;
//   records: Record[];
// }

export interface Root {
  message: string;
  amount: number;
  records: ProductT[];
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
  _id: string;
  address: string;
  name: string;
}

//!maybe has to be changed after users roles are established
export type User = {
  userName: string;
  email: string;
  password: string;
  image: string;
  role: string;
};

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

export interface UserUploadOkResponse {
  message: string;
  user: UserR;
}

export interface UserR {
  id: string; //double check, because it is an ObjectId from MongoDB
  userName: string;
  email: string;
  image: string;
  role: string;
}
