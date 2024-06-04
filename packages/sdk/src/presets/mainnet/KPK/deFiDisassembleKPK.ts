import {
  DAI,
  USDC,
  USDT,
  rETH,
  stETH,
  WETH,
  wstETH,
  aura,
  balancer,
  curve,
  uniswapv3
} from "../addresses"
import { staticEqual, staticOneOf } from "../../helpers/utils"
import { allowErc20Approve } from "../../helpers/erc20"
import { HoldingsExitStrategy } from "../../helpers/ExitStrategies/HoldingsExitStrategies"
import { lidoExitStrategyAll } from "../../helpers/ExitStrategies/LidoExitStrategies"
import { auraExitStrategy2 } from "../../helpers/ExitStrategies/AuraExitStrategies"
import { AVATAR } from "../../placeholders"
import { RolePreset } from "../../types"
import { allow } from "../../allow"

const preset = {
  network: 1,
  allow: [
    //---------------------------------------------------------------------------------------------------------------------------------
    // Holdings
    //---------------------------------------------------------------------------------------------------------------------------------

    ...HoldingsExitStrategy(1), // 1 = mainnet

    //---------------------------------------------------------------------------------------------------------------------------------
    // Lido
    //---------------------------------------------------------------------------------------------------------------------------------
    ...lidoExitStrategyAll(),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Aura wstETH/WETH  + Balancer wstETH/WETH
    //---------------------------------------------------------------------------------------------------------------------------------

    ...auraExitStrategy2(
      aura.auraB_stETH_STABLE_REWARDER,
      balancer.B_stETH_STABLE_pId
    ),

    // allow.mainnet.lido.stETH["submit"](ZERO_ADDRESS, {
    //   send: true,
    // }),

    //---------------------------------------------------------------------------------------------------------------------------------
    // BALANCER
    //---------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------------------------------
    // Balancer rETH/WETH - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    // Swap rETH for WETH
    ...allowErc20Approve([rETH], [balancer.VAULT]),
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
          "0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112",
          "bytes32"
        ), // rETH-WETH pool ID
        [9]: staticEqual(rETH, "address"), // Asset in
        [10]: staticEqual(WETH, "address"), // Asset out
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

    // Swap WETH for rETH
    ...allowErc20Approve([WETH], [balancer.VAULT]),
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
          "0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112",
          "bytes32"
        ), // rETH-WETH pool ID
        [9]: staticEqual(WETH, "address"), // Asset in
        [10]: staticEqual(rETH, "address"), // Asset out
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
    // Balancer wstETH/WETH - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    // Swap wstETH for WETH
    ...allowErc20Approve([wstETH], [balancer.VAULT]),
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
          "0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2",
          "bytes32"
        ), // wstETH-WETH pool ID
        [9]: staticEqual(wstETH, "address"), // Asset in
        [10]: staticEqual(WETH, "address"), // Asset out
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

    // Swap WETH for wstETH
    ...allowErc20Approve([WETH], [balancer.VAULT]),
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
          "0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2",
          "bytes32"
        ), // wstETH-WETH pool ID
        [9]: staticEqual(WETH, "address"), // Asset in
        [10]: staticEqual(wstETH, "address"), // Asset out
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
    // Curve - 3pool - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([DAI, USDC, USDT], [curve.x3CRV_POOL]),

    allow.mainnet.curve.x3CRV_pool["exchange"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve - ETH/stETH - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([stETH], [curve.stETH_ETH_POOL]),

    allow.mainnet.curve.steth_eth_pool["exchange"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve - ETH/stETH (stETH-ng-f) - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([stETH], [curve.stETH_ng_f_POOL]),

    allow.mainnet.curve.steth_ng_f_pool["exchange(int128,int128,uint256,uint256)"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Maker - DSR (DAI Savings Rate)
    //---------------------------------------------------------------------------------------------------------------------------------

    // Withdraw an specific amount
    allow.mainnet.maker.dsr_manager["exit"](AVATAR),

    // Withdraw all
    allow.mainnet.maker.dsr_manager["exitAll"](AVATAR),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Spark - sDAI
    //---------------------------------------------------------------------------------------------------------------------------------

    // Withdraw
    allow.mainnet.spark.sDAI["redeem"](undefined, AVATAR, AVATAR),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Uniswap V3 - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([DAI, USDC, USDT, WETH, wstETH], [uniswapv3.ROUTER_2]),

    {
      targetAddress: uniswapv3.ROUTER_2,
      signature:
        "exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))",
      params: {
        [0]: staticOneOf(
          [DAI, USDC, USDT, WETH, wstETH], "address"),
        [1]: staticOneOf([DAI, USDC, USDT, WETH, wstETH], "address"),
        [3]: staticEqual(AVATAR),
      },
      send: true,
    },
  ],
  placeholders: { AVATAR },
} satisfies RolePreset

export default preset
