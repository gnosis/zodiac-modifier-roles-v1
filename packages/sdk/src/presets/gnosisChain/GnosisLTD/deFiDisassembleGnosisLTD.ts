import { allow } from "../../allow"
import { auraExitStrategy2 } from "../../helpers/ExitStrategies/AuraExitStrategies"
import { balancerExitStrategy1 } from "../../helpers/ExitStrategies/BalancerExitStrategies"
import { HoldingsExitStrategy, sDaiExitStrategy, WstEthExitStrategy1 } from "../../helpers/ExitStrategies/HoldingsExitStrategies"
import { AVATAR } from "../../placeholders"
import { RolePreset } from "../../types"
import { EURe, sDAI, USDC, USDT, WETH, wstETH, WXDAI, x3CRV, aura, balancer, curve, realt } from "../addresses"
import { allowErc20Approve } from "../../helpers/erc20"
import { staticEqual, staticOneOf } from "../../helpers/utils"


const preset = {
  network: 100,
  allow: [
    //---------------------------------------------------------------------------------------------------------------------------------
    // Holdings
    //---------------------------------------------------------------------------------------------------------------------------------

    ...HoldingsExitStrategy(100), // 100 = Gnosis Chain

    ...sDaiExitStrategy(100), // Only adds sDAI as buy and sell token

    ...WstEthExitStrategy1(100), // wstETH -> WETH

    allow.gnosis.sDAI.redeem(undefined, AVATAR, AVATAR), // redeem sDAI for xDAI

    //---------------------------------------------------------------------------------------------------------------------------------
    // Aura sBAL3 + Balancer sBAL3
    //---------------------------------------------------------------------------------------------------------------------------------

    ...auraExitStrategy2(aura.aurasBAL3_REWARDER, balancer.sBAL3_pId),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Aura staBAL3 + Balancer staBAL3
    //---------------------------------------------------------------------------------------------------------------------------------

    ...auraExitStrategy2(aura.aurastaBAL3_REWARDER, balancer.staBAL3_pId),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Aura wstETH/COW + Balancer wstETH/COW
    //---------------------------------------------------------------------------------------------------------------------------------

    ...auraExitStrategy2(aura.auraB_50wstETH_50COW_REWARDER, balancer.B_50wstETH_50COW_pId),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Balancer GBPe/WXDAI
    //---------------------------------------------------------------------------------------------------------------------------------

    ...balancerExitStrategy1(balancer.B_50GBPe_50WXDAI_pId),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Balancer GBPe/EURe
    //---------------------------------------------------------------------------------------------------------------------------------

    ...balancerExitStrategy1(balancer.B_50EURe_50GBPe_pId),

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
    // Curve 3pool
    //---------------------------------------------------------------------------------------------------------------------------------

    allow.gnosis.curve.x3CRV_pool["remove_liquidity"](),
    allow.gnosis.curve.x3CRV_pool["remove_liquidity_one_coin"](),
    allow.gnosis.curve.x3CRV_pool["remove_liquidity_imbalance"](),
    allow.gnosis.curve.x3CRV_gauge["withdraw(uint256)"](),
    allow.gnosis.curve.x3CRV_gauge["withdraw(uint256,address,bool)"](
      undefined,
      AVATAR
    ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve EURe/x3CRV
    //---------------------------------------------------------------------------------------------------------------------------------

    allow.gnosis.curve.crvEUReUSD_pool[
      "remove_liquidity(uint256,uint256[2])"
    ](),
    allow.gnosis.curve.crvEUReUSD_zap["remove_liquidity(uint256,uint256[4])"](),
    allow.gnosis.curve.crvEUReUSD_pool[
      "remove_liquidity_one_coin(uint256,uint256,uint256)"
    ](),
    allow.gnosis.curve.crvEUReUSD_zap[
      "remove_liquidity_one_coin(uint256,uint256,uint256)"
    ](),
    allow.gnosis.curve.crvEUReUSD_gauge["withdraw(uint256)"](),
    allow.gnosis.curve.crvEUReUSD_gauge["withdraw(uint256,address,bool)"](
      undefined,
      AVATAR
    ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve sGNO/GNO
    //---------------------------------------------------------------------------------------------------------------------------------

    allow.gnosis.curve.sgnoCRV_lp_pool[
      "remove_liquidity(uint256,uint256[2])"
    ](),
    allow.gnosis.curve.sgnoCRV_lp_pool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    allow.gnosis.curve.sgnoCRV_lp_pool[
      "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allow.gnosis.curve.sgnoCRV_gauge["withdraw(uint256)"](),
    allow.gnosis.curve.sgnoCRV_gauge["withdraw(uint256,address,bool)"](
      undefined,
      AVATAR
    ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve tricrypto
    //---------------------------------------------------------------------------------------------------------------------------------
    allow.gnosis.curve.crv3crypto_pool["remove_liquidity"](),
    allow.gnosis.curve.crv3crypto_zap["remove_liquidity(uint256,uint256[5])"](),
    allow.gnosis.curve.crv3crypto_pool["remove_liquidity_one_coin"](),
    allow.gnosis.curve.crv3crypto_zap[
      "remove_liquidity_one_coin(uint256,uint256,uint256)"
    ](),
    allow.gnosis.curve.crv3crypto_gauge["withdraw(uint256)"](),
    allow.gnosis.curve.crv3crypto_gauge["withdraw(uint256,address,bool)"](
      undefined,
      AVATAR
    ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve rGNO/sGNO
    //---------------------------------------------------------------------------------------------------------------------------------

    allow.gnosis.curve.rgnoCRV_lp_pool[
      "remove_liquidity(uint256,uint256[2])"
    ](),
    allow.gnosis.curve.rgnoCRV_lp_pool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    allow.gnosis.curve.rgnoCRV_lp_pool[
      "remove_liquidity_imbalance(uint256[2],uint256)"
    ](),
    allow.gnosis.curve.rgnoCRV_gauge["withdraw(uint256)"](),
    allow.gnosis.curve.rgnoCRV_gauge["withdraw(uint256,address,bool)"](
      undefined,
      AVATAR
    ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve MAI/x3CRV
    //---------------------------------------------------------------------------------------------------------------------------------

    allow.gnosis.curve.MAIx3CRV_lp_pool[
      "remove_liquidity(uint256,uint256[2])"
    ](),
    allow.gnosis.curve.factory_metapools_zap[
      "remove_liquidity(address,uint256,uint256[4])"
    ](),
    allow.gnosis.curve.MAIx3CRV_lp_pool[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),
    allow.gnosis.curve.factory_metapools_zap[
      "remove_liquidity_one_coin(address,uint256,int128,uint256)"
    ](),
    allow.gnosis.curve.MAIx3CRV_gauge["withdraw(uint256)"](),
    allow.gnosis.curve.MAIx3CRV_gauge["withdraw(uint256,address,bool)"](
      undefined,
      AVATAR
    ),

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

    //---------------------------------------------------------------------------------------------------------------------------------
    // Honeyswap
    //---------------------------------------------------------------------------------------------------------------------------------

    allow.gnosis.honeyswap.router["removeLiquidity"](
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      AVATAR
    ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // RealT
    //---------------------------------------------------------------------------------------------------------------------------------

    allow.gnosis.realt.lending_pool["setUserUseReserveAsCollateral"](WXDAI),
    allow.gnosis.realt.gateway["withdrawETH"](
      realt.LENDING_POOL,
      undefined,
      AVATAR
    ),
    allow.gnosis.realt.gateway["repayETH"](
      realt.LENDING_POOL,
      undefined,
      undefined,
      AVATAR
    ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // SushiSwap
    //---------------------------------------------------------------------------------------------------------------------------------

    allow.gnosis.sushiswap.router["removeLiquidity"](
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      AVATAR
    ),
    allow.gnosis.sushiswap.router["removeLiquidityWithPermit"](
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      AVATAR
    ),
    allow.gnosis.sushiswap.minichef_v2["withdrawAndHarvest"](
      undefined,
      undefined,
      AVATAR
    )
  ],
  placeholders: { AVATAR },
} satisfies RolePreset

export default preset
