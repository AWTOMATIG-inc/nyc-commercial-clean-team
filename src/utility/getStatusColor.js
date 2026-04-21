export const getColorStatus = (status) => {
  if (status === "new") {
    return ["text-blue-500 bg-blue-500/10","bg-blue-500"];
  } else if (status === "pending") {
    return ["text-orange-500 bg-orange-500/10","bg-orange-500"];
  } else if (status === "confirmed") {
    return ["text-green-500 bg-green-500/10","bg-green-500"];
  } else {
    return ["text-red-500 bg-red-500/10","bg-red-500"];
  }
};
