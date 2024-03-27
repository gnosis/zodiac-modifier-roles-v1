import { allow } from "../../allow"
import { allowErc20Approve } from "../../helpers/erc20"
import { staticEqual, staticOneOf } from "../../helpers/utils"
import { AVATAR } from "../../placeholders"
import { RolePreset } from "../../types"
import { DAI, USDC, WETH, ZERO_ADDRESS, uniswapv3 } from "../addresses"

const preset = {
  network: 1,
  allow: [
    // ...allowErc20Approve([USDC, WETH], [uniswapv3.POSITIONS_NFT]),

    // {
    //   targetAddress: uniswapv3.POSITIONS_NFT,
    //   signature:
    //     "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
    //   params: {
    //     [0]: staticEqual(USDC, "address"),
    //     [1]: staticEqual(WETH, "address"),
    //     [2]: staticEqual(3000, "uint24"),
    //     [9]: staticEqual(AVATAR),
    //   },
    //   send: true
    // },

    // allow.mainnet.uniswapv3.positions_nft["refundETH"](),

    // {
    //   targetAddress: uniswapv3.POSITIONS_NFT,
    //   signature: "increaseLiquidity((uint256,uint256,uint256,uint256,uint256,uint256))",
    //   send: true
    // },

    // {
    //   targetAddress: uniswapv3.POSITIONS_NFT,
    //   signature: "decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))",
    // },

    // {
    //   targetAddress: uniswapv3.POSITIONS_NFT,
    //   signature: "collect((uint256,address,uint128,uint128))",
    //   params: {
    //     // If the collected token is ETH then the address must be the ZERO_ADDRESS
    //     [1]: staticOneOf([AVATAR, ZERO_ADDRESS], "address"),
    //   },
    // },

    // allow.mainnet.uniswapv3.positions_nft["unwrapWETH9"](
    //   undefined,
    //   AVATAR
    // ),

    // allow.mainnet.uniswapv3.positions_nft["sweepToken"](
    //   USDC,
    //   undefined,
    //   AVATAR
    // ),

    // ...allowErc20Approve(
    //   [DAI],
    //   [uniswapv3.ROUTER_2]
    // ),

    // {
    //   targetAddress: uniswapv3.ROUTER_2,
    //   signature:
    //     "exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))",
    // },

    ...allowErc20Approve(
      [DAI],
      [uniswapv3.ROUTER_1]
    ),

    {
      targetAddress: uniswapv3.ROUTER_1,
      signature:
        "exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))",
    },
  ],
  placeholders: { AVATAR },
} satisfies RolePreset
export default preset