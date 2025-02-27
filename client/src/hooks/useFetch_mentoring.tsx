import { useEffect, useState } from "react";

const fetchData = async <T,>(endpoint: string) => {
  const [data, setData] = useState<T>();
  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:5100/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
      }
      const data: T = await response.json();
      // console.log("data :>> ", data);
      // setter(data);
      setData(data);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    getData();
  }, [endpoint]);
};

export { fetchData };
