function LocalStorageManager() {
  function getLocalStorageAsArray() {
    return localStorage.getItem("functions")
      ? localStorage.getItem("functions")?.split(",")
      : [];
  }
  function isInLocalStorage(newFunction: string) {
    let temp = localStorage.getItem("functions")
      ? localStorage.getItem("functions")?.split(",")
      : [];

    return temp ? temp.includes(newFunction) : false;
  }
  function addToLocaStorage(newFunction: string) {
    let temp = localStorage.getItem("functions")
      ? localStorage.getItem("functions")?.split(",")
      : [];

    if (temp && !temp.includes(newFunction)) temp.push(newFunction);
    let arrayToString: string = temp ? temp.join(",") : "";
    localStorage.setItem("functions", arrayToString);
  }
  function deleteFromLocaStorage(newFunction: string) {
    let temp = localStorage.getItem("functions")
      ? localStorage.getItem("functions")?.split(",")
      : [];

    if (temp && temp.includes(newFunction))
      temp.splice(temp.indexOf(newFunction), 1);

    let arrayToString: string = temp ? temp.join(",") : "";
    if (temp && temp.length > 0) {
      localStorage.setItem("functions", arrayToString);
    } else {
      localStorage.clear();
    }
  }
  return {
    addToLocaStorage,
    deleteFromLocaStorage,
    isInLocalStorage,
    getLocalStorageAsArray,
  };
}

export default LocalStorageManager;
