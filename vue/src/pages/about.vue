<template>
  <div class="info info--pt">
    <div class="container">
      <div class="title2 heading2">About Bribe</div>
      <div class="info__block">
        <div class="info__about">
          <div class="info__about-text">
            Bribe is a cross-chain liquidity protocol for algorithmic stablecoins. The mission of Bribe is to give stablecoin holders an opportunity to maximize yield in the cross-chain ecosystem. At present, Bribe deploys the first single-token farming pool of Fei stablecoin.
          </div>
          <div class="title2 title--small">$BRIBE Tokenomics</div>
          <div class="info__about-text">Bribe Protocol is a firm supporter of fair launch. There is no private sale or VC allocation. BRIBE tokens will be distributed to the community during 12 months starting from the launch date.<br>
            Total supply: 10,000,000 BRIBE<br>
            Airdrop to Fei Genesis participants: 600,000 BRIBE<br>
            Community Airdrop (early supporters, social media campaigns): 50,000 BRIBE<br>
            Initial LP airdrop: 100,000 BRIBE<br>
            Reserve for future airdrops: 250,000<br>
            <br>
            1,000,000 BRIBE farming rewards will be distributed during the first month.<br>
            Daily Fei Pool Rewards: 5,000 BRIBE<br>
            Daily Fei-Bribe Pool Rewards: 8,333 BRIBE<br>
            Daily ETH-Bribe Pool Rewards: 20,000 BRIBE<br>
          </div>
          
          <div class="title2 title--small">Initial LP Airdrop Rules</div>
          <div class="info__about-text">100,000 $BRIBE rewards will be shared among early liquidity providers who provide at least 200 BRIBE liquidity to Uniswap FEI-BRIBE or ETH-BRIBE within 72 hours since the launch. Three random snapshots will take place during the first 24 hours, 24~48 hours and 48~72 hours to determine the eligibility. During each time window, 33,333 $BRIBE rewards will be shared. Rewards will be distributed after all snapshots are done. For more details, read our <a href="https://bribeprotocol.medium.com/bribe-protocol-airdrop-details-c2998ccefc23">Medium announcement</a></div>
          <div class="title2 title--small">Protocol Fees</div>
          <div class="info__about-text">Fei pool charges 1% withdrawal fee paid in Fei. LP pools do not charge fees. Collected fees will be used to buyback BRIBE in the open market on a weekly basis. The protocol fees can be adjusted or removed by the governance vote of BRIBE holders.</div>
          <div class="title2 title--small">Contract Addresses</div>
          <div class="info__about-text">BRIBE token address <u>0x679fa6dc913acab6def33ec469fc6e421bc794f5</u><br>
            FEI farming pool <u>0x49783C67d6c681A1FF5Ff250dc5338051B1D42A1</u><br>
            BRIBE-FEI farming pool <u>0x81b0Aad91F4cc7060d7d20d40d255691C926fFad</u><br>
            BRIBE-ETH farming pool <u>0x29ACc7D4AbB3c13Dc25Aaf38e61859eEfC9D4D43</u><br>
            <a href="https://info.uniswap.org/token/0x679fa6dc913acab6def33ec469fc6e421bc794f5"><b>Trade $BRIBE on Uniswap</b></a><br>
            <a href="https://info.uniswap.org/pair/0x25a390d8c76935426dda2668cb9cefd4ec0205b2"><b>Provide Liquidity to Uniswap BRIBE-FEI Pair</b></a><br>
            <a href="https://info.uniswap.org/pair/0x8098c4266a5aa0355d2d37461323db3f949cb156"><b>Provide Liquidity to Uniswap BRIBE-ETH Pair</b></a>
          </div>
          
          <div class="info__about-text">
            Protocol is built on top of  audited code. Bribe Protocol uses the industry standard staking contract forked from Float Protocol which is another fork from Synthetix. Token contract is standard OpenZepplin contract.  However, it is still an experimental software. Use at your own risk! 
          </div>
          <!--
          <div class="info__about-text">You can purchase BRIBE on Uniswap. The token address is <a></a></div>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "about"
}
</script>

<style scoped>
.title2 {
  font-weight:700;
  line-height: 120%;
  text-align: center;
  padding-top:15px;
  padding-bottom: 1.5em;
}
.heading2 {
  font-size: 34px;
  letter-spacing: 2px;
}
.title--small {
  font-size: 20px;
  padding-bottom: 1.0em;

}
</style>