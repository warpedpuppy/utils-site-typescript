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

    // Only ever touch Utilspalooza's own key — never localStorage.clear(),
    // which would wipe everything else stored on the same origin.
    localStorage.setItem("functions", temp ? temp.join(",") : "");
  }
  return {
    addToLocaStorage,
    deleteFromLocaStorage,
    isInLocalStorage,
    getLocalStorageAsArray,
  };
}

export default LocalStorageManager;
