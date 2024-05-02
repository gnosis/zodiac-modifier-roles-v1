import { allow } from "../../allow"
import { AVATAR } from "../../placeholders"
import { RolePreset } from "../../types"
import { EURe, sDAI, USDC, USDT, WETH, wstETH, WXDAI, x3CRV, balancer, curve } from "../addresses"
import { allowErc20Approve } from "../../helpers/erc20"
import { staticEqual, staticOneOf } from "../../helpers/utils"


const preset = {
  network: 100,
  allow: [
    //---------------------------------------------------------------------------------------------------------------------------------
    // Balancer
    //---------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------------------------------
    // Balancer WETH/wstETH
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([WETH, wstETH], [balancer.VAULT]),
    {
      targetAddress: balancer.VAULT,
      signature:
        "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)",
      params: {
        [0]: staticEqual(
          "0x00000000000000000000000000000000000000000000000000000000000000e0",
          "bytes32"
        ), // Offset of the tuple from beginning 224=32*7
        [1]: staticEqual(AVATAR), // recipient
        [3]: staticEqual(AVATAR), // sender
        [7]: staticEqual(
          "0xbad20c15a773bf03ab973302f61fabcea5101f0a000000000000000000000034",
          "bytes32"
        ),
        [9]: staticOneOf([WETH, wstETH], "address"), // Asset in
        [10]: staticOneOf([WETH, wstETH], "address"), // Asset out
        [12]: staticEqual(
          "0x00000000000000000000000000000000000000000000000000000000000000c0",
          "bytes32"
        ), // Offset of bytes from beginning of tuple 192=32*6
        [13]: staticEqual(
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "bytes32"
        ), // bytes (userData) = for all current Balancer pools this can be left empty
      },
    },

    //---------------------------------------------------------------------------------------------------------------------------------
    // Balancer sBAL3 - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([sDAI, USDC, USDT], [balancer.VAULT]),
    {
      targetAddress: balancer.VAULT,
      signature:
        "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)",
      params: {
        [0]: staticEqual(
          "0x00000000000000000000000000000000000000000000000000000000000000e0",
          "bytes32"
        ), // Offset of the tuple from beginning 224=32*7
        [1]: staticEqual(AVATAR), // recipient
        [3]: staticEqual(AVATAR), // sender
        [7]: staticEqual(
          "0x7644fa5d0ea14fcf3e813fdf93ca9544f8567655000000000000000000000066",
          "bytes32"
        ),
        [9]: staticOneOf([sDAI, USDC, USDT], "address"), // Asset in
        [10]: staticOneOf([sDAI, USDC, USDT], "address"), // Asset out
        [12]: staticEqual(
          "0x00000000000000000000000000000000000000000000000000000000000000c0",
          "bytes32"
        ), // Offset of bytes from beginning of tuple 192=32*6
        [13]: staticEqual(
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "bytes32"
        ), // bytes (userData) = for all current Balancer pools this can be left empty
      },
    },

    //---------------------------------------------------------------------------------------------------------------------------------
    // Balancer staBAL3 - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([USDC, USDT, WXDAI], [balancer.VAULT]),
    {
      targetAddress: balancer.VAULT,
      signature:
        "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)",
      params: {
        [0]: staticEqual(
          "0x00000000000000000000000000000000000000000000000000000000000000e0",
          "bytes32"
        ), // Offset of the tuple from beginning 224=32*7
        [1]: staticEqual(AVATAR), // recipient
        [3]: staticEqual(AVATAR), // sender
        [7]: staticEqual(
          "0x2086f52651837600180de173b09470f54ef7491000000000000000000000004f",
          "bytes32"
        ),
        [9]: staticOneOf([USDC, USDT, WXDAI], "address"), // Asset in
        [10]: staticOneOf([USDC, USDT, WXDAI], "address"), // Asset out
        [12]: staticEqual(
          "0x00000000000000000000000000000000000000000000000000000000000000c0",
          "bytes32"
        ), // Offset of bytes from beginning of tuple 192=32*6
        [13]: staticEqual(
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "bytes32"
        ), // bytes (userData) = for all current Balancer pools this can be left empty
      },
    },

    //---------------------------------------------------------------------------------------------------------------------------------
    // Balancer staBAL3/wstETH - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([balancer.staBAL3, wstETH], [balancer.VAULT]),
    {
      targetAddress: balancer.VAULT,
      signature:
        "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)",
      params: {
        [0]: staticEqual(
          "0x00000000000000000000000000000000000000000000000000000000000000e0",
          "bytes32"
        ), // Offset of the tuple from beginning 224=32*7
        [1]: staticEqual(AVATAR), // recipient
        [3]: staticEqual(AVATAR), // sender
        [7]: staticEqual(
          "0xeb30c85cc528537f5350cf5684ce6a4538e13394000200000000000000000059",
          "bytes32"
        ),
        [9]: staticOneOf([balancer.sBAL3, wstETH], "address"), // Asset in
        [10]: staticOneOf([balancer.sBAL3, wstETH], "address"), // Asset out
        [12]: staticEqual(
          "0x00000000000000000000000000000000000000000000000000000000000000c0",
          "bytes32"
        ), // Offset of bytes from beginning of tuple 192=32*6
        [13]: staticEqual(
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "bytes32"
        ), // bytes (userData) = for all current Balancer pools this can be left empty
      },
    },

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve
    //---------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve - 3pool - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([USDC, USDT, WXDAI], [curve.x3CRV_POOL]),

    allow.gnosis.curve.x3CRV_pool["exchange"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve - EURe/x3CRV - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([EURe, x3CRV], [curve.crvEUReUSD_POOL]),
    ...allowErc20Approve([EURe, USDC, USDT, WXDAI], [curve.crvEUReUSD_ZAP]),

    allow.gnosis.curve.crvEUReUSD_pool["exchange(uint256,uint256,uint256,uint256)"](),
    allow.gnosis.curve.crvEUReUSD_zap["exchange_underlying(uint256,uint256,uint256,uint256)"](),
  ],
  placeholders: { AVATAR },
} satisfies RolePreset

export default preset