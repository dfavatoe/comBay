import { User, PutUpdateResponse } from "../types/customTypes";

interface AddProductToListParams {
  productId: string;
  token: String | null;
  baseUrl: string;
  setUser: (user: User) => void;
  setShowAlert: (show: boolean) => void;
  setAlertText: (text: string) => void;
}

export const addProductToList = async ({
  productId,
  token,
  baseUrl,
  setUser,
  setShowAlert,
  setAlertText,
}: AddProductToListParams): Promise<void> => {
  if (!token) {
    console.log("User has to log in first");
    setAlertText("Please, log in first to add a product to your list!");
    setShowAlert(true);
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
      setAlertText("Product successfully added to the shopping list!");
      setShowAlert(true);
    } else {
      console.log(result.error || "Failed to add product in list");
      setAlertText(result.error || "Failed to add product in list");
      setShowAlert(true);
    }
  } catch (error) {
    console.error("Error adding product to list:", error);
    setAlertText("An error occurred while adding the product.");
    setShowAlert(true);
  }
};
