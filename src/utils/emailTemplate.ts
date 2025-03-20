export const generateSubscribeEmailContent = () => {
  return `
    <div style="background-color: #f4f4f4; padding: 40px 0;">
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;">
        
        <!-- 🟣 Logo -->
        <div style="margin-bottom: 20px;">
          <img src="https://nftsguard.com/image/logo/nftsguard-logo.png" alt="NFTs Guard Logo" style="max-width: 150px;">
        </div>

        <h2 style="color: #333;">🎉 Welcome to <span style="color: #6D28D9;">NFTs Guard</span>!</h2>
        
        <p>Hi,</p>
        <p>Thank you for subscribing to NFTs Guard! 🚀</p>
        <p>You will be the first to receive updates about our latest security features, scam alerts, and NFT protection tips.</p>
        
        <!-- 🔗 Sociālo tīklu saites ar ikonām -->
        <p style="margin-top: 20px;"><strong>Follow us on:</strong></p>
        <div style="display: flex; justify-content: center; gap: 10px;">
          <a href="https://twitter.com/NFTsGuard" target="_blank">
            <img src="https://nftsguard.com/image/icons/x-social-icon.svg" alt="Twitter" style="width: 24px; height: 24px;">
          </a>
          <a href="https://discord.gg/zqhEbgEsur" target="_blank">
            <img src="https://nftsguard.com/image/icons/Discord-social-icon.svg" alt="Discord" style="width: 24px; height: 24px;">
          </a>
        </div>

        <!-- 📩 CTA poga -->
        <div style="margin-top: 30px;">
          <a href="https://nftsguard.com" target="_blank" style="display: inline-block; background-color: #6D28D9; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Visit NFTs Guard
          </a>
        </div>

        <p style="margin-top: 20px; font-size: 12px; color: #777;">If you did not subscribe, please ignore this email.</p>

        <p style="color: #888; margin-top: 20px;">Best Regards,<br/>NFTs Guard Team</p>
      </div>
    </div>
  `;
};
