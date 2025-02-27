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
