import { allow } from "../../allow"
import { auraExitStrategy2 } from "../../helpers/ExitStrategies/AuraExitStrategies"
import { balancerExitStrategy1 } from "../../helpers/ExitStrategies/BalancerExitStrategies"
import { HoldingsExitStrategy } from "../../helpers/ExitStrategies/HoldingsExitStrategies"
import { lidoExitStrategyAll } from "../../helpers/ExitStrategies/LidoExitStrategies"
import { staticEqual, staticOneOf } from "../../helpers/utils"
import { AVATAR } from "../../placeholders"
import { ankrETH, DAI, ETHx, USDC, USDT, rETH, stETH, WETH, wstETH, aura, balancer, compound_v2, compound_v3, curve, uniswapv3 } from "../addresses"
import { RolePreset } from "../../types"
import { allowErc20Approve } from "../../helpers/erc20"

const preset = {
  network: 1,
  allow: [
    //---------------------------------------------------------------------------------------------------------------------------------
    // Holdings
    //---------------------------------------------------------------------------------------------------------------------------------

    ...HoldingsExitStrategy(1), // 1 = mainnet

    //---------------------------------------------------------------------------------------------------------------------------------
    // Aura B-80BAL-20WETH/auraBAL + Balancer B-80BAL-20WETH/auraBAL + Balancer B-80BAL-20WETH
    //---------------------------------------------------------------------------------------------------------------------------------

    ...auraExitStrategy2(
      aura.auraB_auraBAL_STABLE_REWARDER,
      balancer.B_auraBAL_STABLE_pId
    ),

    // Remove Liquidity from Balancer B-80BAL-20WETH
    ...balancerExitStrategy1(balancer.B_80BAL_20WETH_pId),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Aura rETH/WETH + Balancer rETH/WETH
    //---------------------------------------------------------------------------------------------------------------------------------

    ...auraExitStrategy2(
      aura.auraB_rETH_STABLE_REWARDER,
      balancer.B_rETH_STABLE_pId
    ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Aura GNO/COW + Balancer GNO/COW
    //---------------------------------------------------------------------------------------------------------------------------------

    ...auraExitStrategy2(
      aura.aura50COW_50GNO_REWARDER,
      balancer.B_50COW_50GNO_pId
    ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Aura WETH/COW + Balancer WETH/COW
    //---------------------------------------------------------------------------------------------------------------------------------

    ...auraExitStrategy2(
      aura.aura50COW_50WETH_REWARDER,
      balancer.B_50COW_50WETH_pId
    ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Classic auraBAL
    //---------------------------------------------------------------------------------------------------------------------------------

    allow.mainnet.aura.auraBAL_staking_rewarder["withdraw"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Compounding auraBAL
    //---------------------------------------------------------------------------------------------------------------------------------

    allow.mainnet.aura.stkauraBAL["withdraw"](undefined, AVATAR, AVATAR),
    allow.mainnet.aura.stkauraBAL["redeem"](undefined, AVATAR, AVATAR),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Locking AURA
    //---------------------------------------------------------------------------------------------------------------------------------

    // Process Expired AURA Locks - True -> Relock Expired Locks / False -> Withdraw Expired Locks
    allow.mainnet.aura.aura_locker["processExpiredLocks"](),

    // Withdraw funds in emergency state (isShutdown = True)
    allow.mainnet.aura.aura_locker["emergencyWithdraw"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // BALANCER
    //---------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------------------------------
    // Balancer BAL/WETH
    //---------------------------------------------------------------------------------------------------------------------------------

    // Remove Liquidity
    ...balancerExitStrategy1(balancer.B_80BAL_20WETH_pId),

    // Unlock
    allow.mainnet.balancer.veBAL["withdraw"](),

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
    // Compound V2
    //---------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------------------------------
    // Compound V2 - USDC
    //---------------------------------------------------------------------------------------------------------------------------------

    // Withdrawing: sender redeems uint256 cTokens, it is called when MAX is withdrawn
    allow.mainnet.compound_v2.cUSDC["redeem"](),

    // Withdrawing: sender redeems cTokens in exchange for a specified amount of underlying asset (uint256), it is called when MAX isn't withdrawn
    allow.mainnet.compound_v2.cUSDC["redeemUnderlying"](),

    // Stop using as Collateral
    allow.mainnet.compound_v2.comptroller["exitMarket"](compound_v2.cUSDC),

    // Repay specified borrowed amount of underlying asset (uint256)
    allow.mainnet.compound_v2.cUSDC["repayBorrow"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Compound V2 - DAI
    //---------------------------------------------------------------------------------------------------------------------------------

    // Withdrawing: sender redeems uint256 cTokens, it is called when MAX is withdrawn
    allow.mainnet.compound_v2.cDAI["redeem"](),

    // Withdrawing: sender redeems cTokens in exchange for a specified amount of underlying asset (uint256), it is called when MAX isn't withdrawn
    allow.mainnet.compound_v2.cDAI["redeemUnderlying"](),

    // Stop using as Collateral
    allow.mainnet.compound_v2.comptroller["exitMarket"](compound_v2.cDAI),

    // Repay specified borrowed amount of underlying asset (uint256)
    allow.mainnet.compound_v2.cDAI["repayBorrow"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Compound V3
    //---------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------------------------------
    // Compound V3 - USDC
    //---------------------------------------------------------------------------------------------------------------------------------

    // Withdraw/Borrow
    allow.mainnet.compound_v3.cUSDCv3["withdraw"](USDC),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Compound V3 - ETH
    //---------------------------------------------------------------------------------------------------------------------------------

    // Withdraw
    {
      targetAddress: compound_v3.MainnetBulker,
      signature: "invoke(bytes32[],bytes[])",
      params: {
        [0]: staticEqual(
          "0x0000000000000000000000000000000000000000000000000000000000000040",
          "bytes32"
        ), // Offset of bytes32[] from beginning 64=32*2
        [1]: staticEqual(
          "0x0000000000000000000000000000000000000000000000000000000000000080",
          "bytes32"
        ), // Offset of bytes[] from beginning 128=32*4
        [2]: staticEqual(
          "0x0000000000000000000000000000000000000000000000000000000000000001",
          "bytes32"
        ), // Length of bytes32[] = 1
        [3]: staticEqual(
          "0x414354494f4e5f57495448445241575f4e41544956455f544f4b454e00000000",
          "bytes32"
        ), // ACTION_WITHDRAW_NATIVE_TOKEN Encoded
        [4]: staticEqual(
          "0x0000000000000000000000000000000000000000000000000000000000000001",
          "bytes32"
        ), // Length of bytes[] = 1
        [5]: staticEqual(
          "0x0000000000000000000000000000000000000000000000000000000000000020",
          "bytes32"
        ), // Offset of the first element of the bytes[] from beginning of bytes[] 32=32*1
        [6]: staticEqual(
          "0x0000000000000000000000000000000000000000000000000000000000000060",
          "bytes32"
        ), // Length of the first element of the bytes[] 96=32*3
        [7]: staticEqual(compound_v3.cUSDCv3, "address"),
        [8]: staticEqual(AVATAR),
      },
    },

    //---------------------------------------------------------------------------------------------------------------------------------
    // CONVEX
    //---------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------------------------------
    // Convex - ETH/stETH
    //---------------------------------------------------------------------------------------------------------------------------------

    // Withdraw
    allow.mainnet.convex.booster["withdraw"](
      25 // poolId (If you don't specify a poolId you can withdraw funds in any pool)
    ),

    // Unstake
    allow.mainnet.convex.cvxsteCRV_rewarder["withdraw"](),

    // Unstake and Withdraw
    allow.mainnet.convex.cvxsteCRV_rewarder["withdrawAndUnwrap"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Convex - cDAI/cUSDC
    //---------------------------------------------------------------------------------------------------------------------------------

    // Withdraw
    allow.mainnet.convex.booster["withdraw"](
      {
        oneOf: [0],
      } // poolId (If you don't specify a poolId you can withdraw funds in any pool)
    ),

    // Unstake
    allow.mainnet.convex.cvxcDAIcUSDC_rewarder["withdraw"](),

    // Unstake and Withdraw
    allow.mainnet.convex.cvxcDAIcUSDC_rewarder["withdrawAndUnwrap"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Convex - Convert CRV to cvxCRV and Stake cvxCRV
    //---------------------------------------------------------------------------------------------------------------------------------

    // Unstake cvxCRV
    allow.mainnet.convex.stkCvxCrv["withdraw"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Convex - Stake CVX
    //---------------------------------------------------------------------------------------------------------------------------------

    // Unstake CVX
    allow.mainnet.convex.cvxRewardPool["withdraw"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Convex - Lock CVX
    //---------------------------------------------------------------------------------------------------------------------------------

    // Process Expired Locks (Withdraw = False or Relock = True)
    allow.mainnet.convex.vlCVX["processExpiredLocks"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // CURVE
    //---------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve - ETH/stETH
    //---------------------------------------------------------------------------------------------------------------------------------

    // Remove Liquidity
    allow.mainnet.curve.steth_eth_pool["remove_liquidity"](),

    // Removing Liquidity of One Coin
    allow.mainnet.curve.steth_eth_pool["remove_liquidity_one_coin"](),

    // Removing Liquidity Imbalance
    allow.mainnet.curve.steth_eth_pool["remove_liquidity_imbalance"](),

    // Unstake
    allow.mainnet.curve.steth_eth_gauge["withdraw"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve - cDAI/cUSDC
    //---------------------------------------------------------------------------------------------------------------------------------

    // Remove Liquidity
    allow.mainnet.curve.cDAIcUSDC_pool["remove_liquidity"](),

    // Remove Liquidity (Underlying, using ZAP)
    allow.mainnet.curve.cDAIcUSDC_zap["remove_liquidity"](),

    // Removing Liquidity Imbalance
    allow.mainnet.curve.cDAIcUSDC_pool["remove_liquidity_imbalance"](),

    // Removing Liquidity Imbalance (Underlying, using ZAP)
    allow.mainnet.curve.cDAIcUSDC_zap["remove_liquidity_imbalance"](),

    // Removing Liquidity of One Coin (Underlying, using ZAP)
    allow.mainnet.curve.cDAIcUSDC_zap[
      "remove_liquidity_one_coin(uint256,int128,uint256)"
    ](),

    // Unstake
    allow.mainnet.curve.cDAIcUSDC_gauge["withdraw"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve - 3pool - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([DAI, USDC, USDT], [curve.x3CRV_POOL]),

    allow.mainnet.curve.x3CRV_pool["exchange"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve - ETH/stETH (steCRV) - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([stETH], [curve.stETH_ETH_POOL]),

    allow.mainnet.curve.steth_eth_pool["exchange"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Curve - ETH/stETH (stETH-ng-f) - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([stETH], [curve.stETH_ng_f_POOL]),

    allow.mainnet.curve.steth_ng_f_pool["exchange(int128,int128,uint256,uint256)"](),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Lido
    //---------------------------------------------------------------------------------------------------------------------------------

    ...lidoExitStrategyAll(),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Uniswap V3 - Swaps
    //---------------------------------------------------------------------------------------------------------------------------------
    ...allowErc20Approve([ankrETH, DAI, ETHx, USDC, USDT, WETH, wstETH], [uniswapv3.ROUTER_2]),

    {
      targetAddress: uniswapv3.ROUTER_2,
      signature:
        "exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))",
      params: {
        [0]: staticOneOf(
          [ankrETH, DAI, ETHx, USDC, USDT, WETH, wstETH], "address"),
        [1]: staticOneOf([DAI, USDC, USDT, WETH, wstETH], "address"),
        [3]: staticEqual(AVATAR),
      },
      send: true,
    },
  ],
  placeholders: { AVATAR },
} satisfies RolePreset

export default preset
