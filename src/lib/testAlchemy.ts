import { fetchNFTSales } from "./alchemy";

async function testFetchNFTSales() {
    const contractAddress = "0xe6313d1776E4043D906D5B7221BE70CF470F5e87"; // ⬅️ Ievadi NFT kolekcijas kontrakta adresi
    const fromBlock = 21994636; // ⬅️ Ievadi sākuma bloka numuru
    const toBlock = 22030520; // ⬅️ Ievadi beigu bloka numuru

    console.log("Fetching NFT sales transactions...");
    const transactions = await fetchNFTSales(contractAddress, fromBlock, toBlock);

    console.log("Fetched transactions:", transactions);
}

testFetchNFTSales();
