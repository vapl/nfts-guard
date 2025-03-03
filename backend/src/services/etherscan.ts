import fetch from "node-fetch";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export const checkContractVerification = async (contractAddress: string) => {
  const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.result[0].ABI !== "[]" ? true : false;
  } catch (error) {
    console.error("Error verifying contract:", error);
    throw new Error("Failed to check contract verification");
  }
};
