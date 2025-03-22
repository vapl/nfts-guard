export const generateSubscribeEmailContent = () => {
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
          padding: 36px;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
        "
      >
        <div style="text-align: center; margin-bottom: 20px">
          <img
            src="https://nftsguard.com/image/logo/nftsguard-logo-gray.png"
            alt="NFTs Guard Logo"
            style="width: 64px"
          />
        </div>

        <h1 style="font-size: 24px; text-align: center; color: #545454">
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

        <div
          style="
            background-color: #eee;
            padding: 18px;
            border-radius: 10px;
            margin-bottom: 28px;
            color: #444;
            font-size: 14px;
            line-height: 1.5;
          "
        >
          You’re receiving this email because you joined our early access
          waiting list. NFTs Guard is launching soon — and you’ll be the first
          to explore the platform.<br /><br />
          As a subscriber, you’ll be notified the moment we go live, and you’ll
          receive exclusive access to security insights, scam alerts, and
          powerful NFT verification tools.
        </div>

        <!-- Functionality Cards -->
        <div
          style="
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
          "
        >
          <div
            style="
              background: #f9f9f9;
              border-radius: 10px;
              padding: 20px;
              flex: 1 1 250px;
              max-width: 270px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
            "
          >
            <div
              style="
                color: #6d28d9;
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-shield-alert"
              >
                <path
                  d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
              <h3 style="font-size: 16px; color: #6d28d9; margin-bottom: 10px">
                NFT Risk Score
              </h3>
            </div>
            <ul
              style="
                padding-left: 18px;
                font-size: 14px;
                color: #333;
                margin: 0;
              "
            >
              <li>Score 1–100 based on wallet behavior</li>
              <li>Price deviation from average</li>
              <li>Owner activity tracking</li>
            </ul>
          </div>

          <div
            style="
              background: #f9f9f9;
              border-radius: 10px;
              padding: 20px;
              flex: 1 1 250px;
              max-width: 270px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
            "
          >
            <div
              style="
                color: #6d28d9;
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-repeat"
              >
                <path d="m17 2 4 4-4 4" />
                <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                <path d="m7 22-4-4 4-4" />
                <path d="M21 13v1a4 4 0 0 1-4 4H3" />
              </svg>
              <h3 style="font-size: 16px; color: #6d28d9; margin-bottom: 10px">
                Flip Risk Analysis
              </h3>
            </div>
            <ul
              style="
                padding-left: 18px;
                font-size: 14px;
                color: #333;
                margin: 0;
              "
            >
              <li>Repeat sales by same wallet</li>
              <li>Similar NFT flipping pattern</li>
              <li>Unusual demand spikes</li>
            </ul>
          </div>

          <div
            style="
              background: #f9f9f9;
              border-radius: 10px;
              padding: 20px;
              flex: 1 1 250px;
              max-width: 270px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
            "
          >
            <div
              style="
                color: #6d28d9;
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-trending-down"
              >
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
              <h3 style="font-size: 16px; color: #6d28d9; margin-bottom: 10px">
                Exit Scam Tracker
              </h3>
            </div>
            <ul
              style="
                padding-left: 18px;
                font-size: 14px;
                color: #333;
                margin: 0;
              "
            >
              <li>Funds to CEX detection</li>
              <li>Wallet draining signals</li>
              <li>Floor price drops</li>
            </ul>
          </div>

          <div
            style="
              background: #f9f9f9;
              border-radius: 10px;
              padding: 20px;
              flex: 1 1 250px;
              max-width: 270px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
            "
          >
            <div
              style="
                color: #6d28d9;
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-file-code"
              >
                <path d="M10 12.5 8 15l2 2.5" />
                <path d="m14 12.5 2 2.5-2 2.5" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path
                  d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"
                />
              </svg>
              <h3 style="font-size: 16px; color: #6d28d9; margin-bottom: 10px">
                Contract Authenticity
              </h3>
            </div>
            <ul
              style="
                padding-left: 18px;
                font-size: 14px;
                color: #333;
                margin: 0;
              "
            >
              <li>Compare with original contracts</li>
              <li>Mint date &amp; transaction count</li>
              <li>Verified via Alchemy/Moralis</li>
            </ul>
          </div>

          <div
            style="
              background: #f9f9f9;
              border-radius: 10px;
              padding: 20px;
              flex: 1 1 250px;
              max-width: 270px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
            "
          >
            <div
              style="
                color: #6d28d9;
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-history"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M12 7v5l4 2" />
              </svg>
              <h3 style="font-size: 16px; color: #6d28d9; margin-bottom: 10px">
                Owner History
              </h3>
            </div>
            <ul
              style="
                padding-left: 18px;
                font-size: 14px;
                color: #333;
                margin: 0;
              "
            >
              <li>Past transfers + self-trades</li>
              <li>Blacklist matching</li>
              <li>Tx frequency risk score</li>
            </ul>
          </div>

          <div
            style="
              background: #f9f9f9;
              border-radius: 10px;
              padding: 20px;
              flex: 1 1 250px;
              max-width: 270px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
            "
          >
            <div
              style="
                color: #6d28d9;
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-chart-column"
              >
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
              <h3 style="font-size: 16px; color: #6d28d9; margin-bottom: 10px">
                Price &amp; Liquidity
              </h3>
            </div>
            <ul
              style="
                padding-left: 18px;
                font-size: 14px;
                color: #333;
                margin: 0;
              "
            >
              <li>Compare current vs average price</li>
              <li>Volume over 24h / 7d</li>
              <li>Flipping loop detection</li>
            </ul>
          </div>

          <div
            style="
              background: #f9f9f9;
              border-radius: 10px;
              padding: 20px;
              flex: 1 1 250px;
              max-width: 270px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
            "
          >
            <div
              style="
                color: #6d28d9;
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-message-circle-heart"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                <path
                  d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7"
                />
              </svg>
              <h3 style="font-size: 16px; color: #6d28d9; margin-bottom: 10px">
                Social Signals
              </h3>
            </div>
            <ul
              style="
                padding-left: 18px;
                font-size: 14px;
                color: #333;
                margin: 0;
              "
            >
              <li>Twitter mentions &amp; engagement</li>
              <li>Discord activity vs member size</li>
              <li>Organic reach vs fake hype</li>
            </ul>
          </div>
        </div>

        <div
          style="
            background-color: #eee;
            padding: 18px;
            border-radius: 10px;
            margin-bottom: 28px;
            color: #444;
            font-size: 14px;
            line-height: 1.5;
            margin-top: 32px;
          "
        >
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 16px;
              margin-top: 16px;
              margin-bottom: 16px;
            "
          >
            <a
              href="https://twitter.com/NFTsGuard"
              target="_blank"
              style="display: inline-block"
            >
              <img 
                src="https://nftsguard.com/image/icons/x-social-icon.svg"
                alt="Twitter"
                style="width: 28px; height: 28px"
              />
            </a>
            <a
              href="https://discord.gg/zqhEbgEsur"
              target="_blank"
              style="display: inline-block"
            >
              <img
                src="https://nftsguard.com/image/icons/Discord-social-icon.svg"
                alt="Discord"
                style="width: 28px; height: 28px"
              />
            </a>
          </div>
        </div>

        <div style="text-align: center">
          <a
            href="https://nftsguard.com"
            style="
              display: inline-block;
              background-color: #6d28d9;
              color: white;
              padding: 14px 28px;
              border-radius: 8px;
              font-weight: bold;
              text-decoration: none;
              margin-top: 30px;
            "
          >
            Go to NFTs Guard
          </a>
        </div>

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
      </div>
    </div>
  `;
};
