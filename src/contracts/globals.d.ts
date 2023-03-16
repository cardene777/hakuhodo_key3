declare namespace NodeJS {
  interface ProcessEnv {
    readonly ALCHEMY_API_KEY: string;
    readonly ALCHEMY_API_KEY_GOERLI: string;
    readonly ETHERSCAN_API_KEY: string;
    readonly PRIVATE_KEY: string;
    readonly REPORT_GAS: boolean;
  }
}
