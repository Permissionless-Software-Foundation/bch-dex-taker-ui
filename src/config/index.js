/*
  Global configuration settings for this app.
*/

const config = {
  // server: 'https://dex-api.fullstack.cash',
  server: 'http://localhost:5700',

  // Default IPFS CID for the app. This will be overwritten by dynamic lookup.
  ipfsCid: 'bafybeifyeg6y425zsatd6r2l4iwevr2gklzn5hhv7l5f4xxfit7it6nqri',

  // BCH address used to point to the latest version of the IPFS CID.
  appBchAddr: 'bitcoincash:qqq66ftjgncsxlrdwxvlykkhp3qusjq3zynx3q835y',

  // Backup Info that goes into the Footer.
  ghPagesUrl: 'https://permissionless-software-foundation.github.io/bch-wallet-web3-android/',
  fullstackUrl: 'https://bchn-wallet.fullstack.cash',
  apkUrl: 'https://github.com/Permissionless-Software-Foundation/bch-wallet-web3-android/blob/master/android/apk/bch-web3-wallet.apk',
  ghRepo: 'https://github.com/Permissionless-Software-Foundation/bch-wallet-web3-android',
  radicleUrl: 'https://app.radicle.network/seeds/maple.radicle.garden/rad:git:hnrkd5cjwwb5tzx37hq9uqm5ubon7ee468xcy/remotes/hyyycncbn9qzqmobnhjq9rry6t4mbjiadzjoyhaknzxjcz3cxkpfpc',
  filecoinRepo: 'https://bafybeihjei6hnl5dxau2ivnilnruqjql5ge6y5ncirljci5tcwnkx4dsju.ipfs.w3s.link/'
}

export default config
