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

// export interface ProductsList {
//   listItem: ProductT;
// }

export interface ProductT {
  // dimensions: Dimensions;
  width: number;
  height: number;
  depth: number;
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
  seller: User;
  reservation: boolean;
  reservationTime: number;
  minReservationQty: number;
  warranty: string;
  returnPolicy: string;
}

export type addProductT = Pick<
  ProductT,
  | "title"
  | "brand"
  | "description"
  | "category"
  | "price"
  | "stock"
  | "images"
  | "warranty"
  | "returnPolicy"
  | "reservation"
  | "minReservationQty"
  | "reservationTime"
  | "discountPercentage"
  | "rating"
  | "width"
  | "height"
  | "depth"
> & { seller: string };

// export interface Dimensions {
//   width: number;
//   height: number;
//   depth: number;
// }

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

export type UserFull = {
  _id: string;
  userName: string;
  email: string;
  password: string;
  image: string;
  role: string;
};

export type User = {
  _id: string;
  userName: string;
  email: string;
  image: string;
  role: string;
  address: string;
  productsList: ProductT[];
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

export interface GetProfileOfResponse {
  message: string;
  user: User;
}

export interface PutUpdateResponse {
  message: string;
  user: User;
  error: string;
}

export interface GetProfileOfResponse {
  message: string;
  user: User;
}

export interface GetShopInfo {
  message: string;
  amount: number;
  sellerInfo: User;
  productsBySeller: ProductT[];
  error: string;
}

//For getShoppingList

export interface GetProductsListResponse {
  message: string;
  amount: number;
  records: ProductsList[];
}

export interface ProductsList {
  _id: string;
  title: string;
  price: number;
  rating?: number;
  seller: Seller;
  images: string[];
  reservation: boolean;
  reservationTime: number;
}

export interface Seller {
  _id: string;
  userName: string;
  address: string;
}
