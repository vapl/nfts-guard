import { ethers } from "ethers";
import { provider } from "@/lib/core"; // Ielādē Ethers.js provideri

// 🔹 Get NFT collection data
export async function getNFTCollectionData(contractAddress: string) {
  const contract = new ethers.Contract(
    contractAddress,
    [
      "function name() view returns (string)",
      "function totalSupply() view returns (uint256)",
    ],
    provider
  );

  const name = await contract.name();
  const totalSupply = await contract.totalSupply();

  return {
    name,
    contractAddress,
    totalSupply: totalSupply.toString(),
  };
}

// 🔹 Get specific NFT metadata
export async function getNFTMetadata(contractAddress: string, tokenId: string) {
  const contract = new ethers.Contract(
    contractAddress,
    [
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function supportsInterface(bytes4) view returns (bool)", // Check ERC standard
    ],
    provider
  );

  try {
    // 🔹 Get NFT owner
    const owner = await contract.ownerOf(tokenId);

    // 🔹 Determine if it's ERC-721 or ERC-1155
    const isERC721 = await contract.supportsInterface("0x80ac58cd"); // ERC-721
    const isERC1155 = await contract.supportsInterface("0xd9b67a26"); // ERC-1155

    // 🛠️ Get `tokenURI`
    const tokenURI = await contract.tokenURI(tokenId);
    const metadataUrl = tokenURI.startsWith("ipfs://")
      ? `https://ipfs.io/ipfs/${tokenURI.split("ipfs://")[1]}`
      : tokenURI;

    console.log("🔹 Metadata URL:", metadataUrl);

    // 📡 Fetch metadata from API
    const response = await fetch(metadataUrl);
    const metadata = await response.json();

    return {
      contractAddress,
      tokenId,
      owner, // 🎯 NFT owner
      standard: isERC721 ? "ERC-721" : isERC1155 ? "ERC-1155" : "Unknown", // ERC standard
      metadata, // NFT metadata
    };
  } catch (error) {
    console.error("❌ Error fetching NFT metadata:", error);
    return {
      contractAddress,
      tokenId,
      error: "Failed to fetch metadata",
    };
  }
}

// 🔹 Fetch NFT price history
export async function fetchNFTPriceHistory(
  contractAddress: string,
  tokenId?: string
) {
  console.log(
    `📡 Fetching trade history for contract: ${contractAddress} and token: ${
      tokenId || "ALL"
    }`
  );

  const API_KEY = process.env.NFTSCAN_API_KEY;
  if (!API_KEY) {
    throw new Error(
      "❌ NFTScan API key is missing! Set NFTSCAN_API_KEY in .env file."
    );
  }

  let allTrades = [];
  let cursor = null; // Sākam bez kursora
  const limit = 100; // API maksimālais ierakstu skaits vienā pieprasījumā
  const maxEntries = 1000; // Mērķis ir savākt vismaz 500 darījumus

  try {
    do {
      let url = `https://restapi.nftscan.com/api/v2/transactions/${contractAddress}?event_type=Sale&sort_direction=desc&limit=${limit}`;
      if (tokenId) url += `&token_id=${tokenId}`;
      if (cursor) url += `&cursor=${cursor}`; // Ja API atgriež nākamo lapas ID

      console.log(`📡 Fetching trades: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `❌ Failed to fetch price history: ${response.statusText}`
        );
      }

      const json = await response.json();
      console.log("🔹 API Response:", JSON.stringify(json, null, 2));

      const data = json.data?.content || [];

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("⚠️ No valid transaction data received.");
        break;
      }

      allTrades.push(...data);
      cursor = json.data.next_cursor || null; // API atgriež nākamo lapas ID
    } while (cursor && allTrades.length < maxEntries); // Turpinām, kamēr ir kursors un nav sasniegts limits

    console.log(`✅ Total trades fetched: ${allTrades.length}`);
    return allTrades;
  } catch (error) {
    console.error("❌ Error fetching NFT price history:", error);
    return [];
  }
}

// Get floor price
export const fetchNFTFloorPrice = async (contractAddress: string) => {
  console.log(`📡 Fetching floor price for contract: ${contractAddress}`);

  const API_KEY = process.env.NFTSCAN_API_KEY;
  if (!API_KEY) {
    throw new Error(
      "❌ NFTScan API key is missing! Set NFTSCAN_API_KEY in .env file."
    );
  }

  try {
    const url = `https://restapi.nftscan.com/api/v2/assets/${contractAddress}/floor_price`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Failed to fetch floor price: ${response.statusText}`);
    }

    const json = await response.json();
    console.log("🔹 Floor Price Response:", json);

    return json.data?.floor_price || 0;
  } catch (error) {
    console.error("❌ Error fetching NFT floor price:", error);
    return 0;
  }
};
