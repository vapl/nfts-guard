export const generateSubscribeEmailContent = (unsubscribeToken: string) => {
  const unsubscribeLink = `https://nftsguard.com/api/unsubscribe?token=${unsubscribeToken}`;
  return `
   <div
      style="
        background-color: #f4f4f4;
        font-family: Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 40px 0;
      "
    >
      <div
        style="
          max-width: 760px;
          margin: auto;
          background-color: #ffffff;
          padding: 36px 16px;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
        "
      >
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 20px">
          <img
            src="https://nftsguard.com/image/logo/nftsguard-logo-gray.png"
            alt="NFTs Guard Logo"
            style="width: 64px"
          />
        </div>

        <!-- Intro -->
        <h1 style="font-size: 24px; text-align: center; color: #000">
          Welcome to <span style="color: #6d28d9">NFTs Guard</span>!
        </h1>
        <p
          style="
            text-align: center;
            color: #444;
            font-size: 15px;
            margin-top: 8px;
            margin-bottom: 24px;
          "
        >
          Thanks for signing up! You're now part of the movement to keep NFTs
          safe.
        </p>

        <!-- Info box -->
        <div
          style="
            background-color: #eee;
            padding: 12px 18px;
            border-radius: 10px;
            margin-bottom: 28px;
            color: #444;
            font-size: 14px;
            line-height: 1.5;
          "
        >
          <p>
            You’re receiving this email because you joined our early access
            waiting list. NFTs Guard is launching soon — and you’ll be the first
            to explore the platform.<br /><br />
            As a subscriber, you’ll be notified the moment we go live, and
            you’ll receive exclusive access to security insights, scam alerts,
            and powerful NFT verification tools.
          </p>
        </div>

        <h2
          style="
            font-size: 16px;
            color: #000;
            margin-bottom: 16px;
            margin-left: 16px;
          "
        >
          What you’ll unlock when we go live:
        </h2>

        <!-- Feature list -->
        <table
          role="presentation"
          cellpadding="10px"
          cellspacing="0"
          width="95%"
          style="border-collapse: collapse; margin: 16px"
        >
          <tbody>
            <tr>
              <td
                style="
                  padding-bottom: 12px;
                  box-sizing: border-box;
                  border-bottom: 1px solid #b0b0b0;
                  width: 100%;
                  display: -webkit-inline-box;
                "
              >
                <img
                  src="https://nftsguard.com/image/icons/shield-alert.png"
                  width="20"
                  alt=""
                  style="vertical-align: middle; margin-right: 12px"
                />
                <div>
                  <strong style="color: #6d28d9">NFT Risk Score</strong><br />
                  <span style="font-size: 14px; color: #333"
                    >AI-based 1–100 risk level, price anomalies &amp; owner
                    behavior</span
                  >
                </div>
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 12px;
                  box-sizing: border-box;
                  border-bottom: 1px solid #b0b0b0;
                  width: 100%;
                  display: -webkit-inline-box;
                "
              >
                <img
                  src="https://nftsguard.com/image/icons/repeat.png"
                  width="20"
                  alt=""
                  style="vertical-align: middle; margin-right: 12px"
                />
                <div>
                  <strong style="color: #6d28d9">Flip Risk Analysis</strong
                  ><br />
                  <span style="font-size: 14px; color: #333"
                    >Detect repeated NFT flips and market manipulation</span
                  >
                </div>
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 12px;
                  box-sizing: border-box;
                  border-bottom: 1px solid #b0b0b0;
                  width: 100%;
                  display: -webkit-inline-box;
                "
              >
                <img
                  src="https://nftsguard.com/image/icons/trending-down.png"
                  width="20"
                  alt=""
                  style="vertical-align: middle; margin-right: 12px"
                />
                <div>
                  <strong style="color: #6d28d9">Exit Scam Tracker</strong
                  ><br />
                  <span style="font-size: 14px; color: #333"
                    >Check for suspicious fund outflows, wallet drainage, price
                    dumps</span
                  >
                </div>
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 12px;
                  box-sizing: border-box;
                  border-bottom: 1px solid #b0b0b0;
                  width: 100%;
                  display: -webkit-inline-box;
                "
              >
                <img
                  src="https://nftsguard.com/image/icons/receipt-text.png"
                  width="20"
                  alt=""
                  style="vertical-align: middle; margin-right: 12px"
                />
                <div>
                  <strong style="color: #6d28d9">Contract Authenticity</strong
                  ><br />
                  <span style="font-size: 14px; color: #333"
                    >Compare mint dates, tx counts, and original contracts</span
                  >
                </div>
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 12px;
                  box-sizing: border-box;
                  border-bottom: 1px solid #b0b0b0;
                  width: 100%;
                  display: -webkit-inline-box;
                "
              >
                <img
                  src="https://nftsguard.com/image/icons/history.png"
                  width="20"
                  alt=""
                  style="vertical-align: middle; margin-right: 12px"
                />
                <div>
                  <strong style="color: #6d28d9">Owner History</strong><br />
                  <span style="font-size: 14px; color: #333"
                    >Track past ownership, blacklisted wallets, frequency
                    risks</span
                  >
                </div>
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 12px;
                  box-sizing: border-box;
                  border-bottom: 1px solid #b0b0b0;
                  width: 100%;
                  display: -webkit-inline-box;
                "
              >
                <img
                  src="https://nftsguard.com/image/icons/chart-column.png"
                  width="20"
                  alt=""
                  style="vertical-align: middle; margin-right: 12px"
                />
                <div>
                  <strong style="color: #6d28d9">Price &amp; Liquidity</strong
                  ><br />
                  <span style="font-size: 14px; color: #333"
                    >Analyze market volume, average vs current price, flipping
                    loops</span
                  >
                </div>
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 12px;
                  box-sizing: border-box;
                  border-bottom: 1px solid #b0b0b0;
                  width: 100%;
                  display: -webkit-inline-box;
                "
              >
                <img
                  src="https://nftsguard.com/image/icons/message-circle-heart.png"
                  width="20"
                  alt=""
                  style="vertical-align: middle; margin-right: 12px"
                />
                <div>
                  <strong style="color: #6d28d9">Social Signals</strong><br />
                  <span style="font-size: 14px; color: #333"
                    >Track Twitter mentions, Discord activity &amp;
                    engagement</span
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Social icons -->
        <div style="text-align: center; margin-top: 30px">
          <a
            href="https://x.com/NFTsGuard"
            target="_blank"
            style="display: inline-block; margin-right: 30px"
          >
            <img
              src="https://nftsguard.com/image/icons/xTwitter-social-icon.png"
              width="28"
              alt="Twitter"
            />
          </a>

          <a
            href="https://discord.gg/zqhEbgEsur"
            target="_blank"
            style="display: inline-block"
          >
            <img
              src="https://nftsguard.com/image/icons/discord-social-icon.png"
              width="28"
              alt="Discord"
            />
          </a>
        </div>

        <!-- Footer -->
        <p
          style="
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 40px;
          "
        >
          If you didn’t sign up, feel free to ignore this email.<br />— NFTs
          Guard Team
        </p>
        <p
          style="
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 10px;
          "
        >If you wish to stop receiving emails, you can <a href="${unsubscribeLink}" style="color:#aaa;text-decoration:underline;">unsubscribe here</a>.</p>

      </div>
    </div>
  `;
};
