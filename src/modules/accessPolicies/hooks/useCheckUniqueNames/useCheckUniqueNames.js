const useCheckUniqueNames = () => {
  function binarySearch(uniqueNames, low, high, nodeName) {
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      let midValue = uniqueNames[mid];

      if (midValue === nodeName) {
        return true;
      } else if (midValue < nodeName) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return false;
  }
  const checkUniqueNames = (uniqueNames, nodeName) => {
    return binarySearch(uniqueNames, 0, uniqueNames.length - 1, nodeName);
  };

  return checkUniqueNames;
};

export default useCheckUniqueNames;
