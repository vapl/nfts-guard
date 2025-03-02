interface NFTData {
  name: string;
  description: string;
  owner: string;
  image?: string;
}

export const generateEmailContent = (
  nftData: NFTData,
  contractAddress: string
) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
        <h2 style="color: #333;">🔍 NFT Autentifikācijas Rezultāts</h2>
        <p><strong>Nosaukums:</strong> ${nftData.name}</p>
        <p><strong>Apraksts:</strong> ${nftData.description}</p>
        <p><strong>Īpašnieks:</strong> ${nftData.owner}</p>
  
        ${
          nftData.image
            ? `<img src="${nftData.image}" alt="NFT Image" style="max-width: 100%; height: auto; border-radius: 10px; margin-top: 10px;" />`
            : ""
        }
  
        <p style="margin-top: 20px;">Pārbaudiet NFT autentiskumu, lai izvairītos no krāpniecības un viltotiem tokeniem.</p>
        <p style="color: #888;">🔗 <a href="https://etherscan.io/token/${contractAddress}" target="_blank">Apskatīt blokķēdē</a></p>
      </div>
    `;
};
