import { UnsupportedChainIdError } from "@web3-react/core"
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector"
import { ErrorInfo } from "components/common/Error"

const processConnectionError = (error: Error): ErrorInfo => {
  switch (error.constructor) {
    case NoEthereumProviderError:
      return {
        title: "Wallet not found",
        description:
          "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.",
      }
    case UnsupportedChainIdError:
      return {
        title: "Wrong network",
        description:
          "Please switch to a supported network, or connect to another wallet.",
      }
    case UserRejectedRequestError:
      return {
        title: "Error connecting. Try again!",
        description:
          "Please authorize this website to access your Ethereum account.",
      }
    default:
      console.error(error)
      return {
        title: "An unknown error occurred",
        description: "Check the console for more details.",
      }
  }
}

export default processConnectionError
