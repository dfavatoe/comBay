import { User, PutUpdateResponse } from "../types/customTypes";

interface AddProductToListParams {
  productId: string;
  token: String | null;
  baseUrl: string;
  setUser: (user: User) => void;
}

export const addProductToList = async ({
  productId,
  token,
  baseUrl,
  setUser,
}: AddProductToListParams): Promise<void> => {
  if (!token) {
    console.log("User has to log in first");
    alert("Please, log in first to add a product to your list!");
    return;
  }

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productsList: productId }),
  };

  try {
    const response = await fetch(
      `${baseUrl}/api/users/add-productToList`,
      requestOptions
    );
    const result = (await response.json()) as PutUpdateResponse;

    console.log("Add product in list result :>> ", result);

    if (response.ok) {
      setUser(result.user);
      console.log("Product added to the shopping list");
      alert("Product successfully added to the shopping list!");
    } else {
      console.log(result.error || "Failed to add product in list");
    }
  } catch (error) {
    console.error("Error adding product to list:", error);
  }
};
