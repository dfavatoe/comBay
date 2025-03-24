import { useState } from "react";

//REVIEW one of the first and few rules of a custom hook is to be named starting with "use". Not the file (that only helps with organisation) but the function itself.
//REVIEW why returning the function, and not the data you get from the function, which is what you actually are interested in?
// example:
// const fetchData = async <T,>(endpoint: string) => {
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const getData = async () => {
//     try {
//       const response = await fetch(`http://localhost:5100/api/${endpoint}`);
//       if (!response.ok) {
//         throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
//       }
//       const result: T = await response.json();
//       setData(result);
//       setIsLoading(false);
//       setError(null);
//       // return data;
//     } catch (error) {
//       console.log(error);
//       setError(error.message);
//       setIsLoading(false);
//       setData(null);
//     }
//   };
//   useEffect(() => {
//   getData()
//   }, [endpoint])

//   return { data, isLoading, error };
// };

const fetchData = async <T,>(endpoint: string, setter: (data: T) => void) => {
  try {
    const response = await fetch(`http://localhost:5100/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }
    const data: T = await response.json();
    // console.log("data :>> ", data);
    setter(data);
    // return data;
  } catch (error) {
    console.log(error);
  }
};

export { fetchData };
