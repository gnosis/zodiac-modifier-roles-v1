import { allow } from "../../allow"
import { auraExitStrategy2 } from "../../helpers/ExitStrategies/AuraExitStrategies"
import { balancerExitStrategy1 } from "../../helpers/ExitStrategies/BalancerExitStrategies"
import { HoldingsExitStrategy } from "../../helpers/ExitStrategies/HoldingsExitStrategies"
import { lidoExitStrategyAll } from "../../helpers/ExitStrategies/LidoExitStrategies"
import { staticEqual } from "../../helpers/utils"
import { AVATAR } from "../../placeholders"
import { USDC, aura, balancer, compound_v2, compound_v3 } from "../addresses"
import { RolePreset } from "../../types"

const preset = {
  network: 1,
  allow: [
    //---------------------------------------------------------------------------------------------------------------------------------
    // Lido
    //---------------------------------------------------------------------------------------------------------------------------------

    ...lidoExitStrategyAll(),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Holdings
    //---------------------------------------------------------------------------------------------------------------------------------

    ...HoldingsExitStrategy(1), // 1 = mainnet

    // //---------------------------------------------------------------------------------------------------------------------------------
    // // Aura wstETH/WETH  + Balancer wstETH/WETH
    // //---------------------------------------------------------------------------------------------------------------------------------

    // ...auraExitStrategy2(
    //   aura.auraB_stETH_STABLE_REWARDER,
    //   balancer.B_stETH_STABLE_pId
    // ),

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

    // //---------------------------------------------------------------------------------------------------------------------------------
    // // Aura GNO/WETH + Balancer GNO/WETH
    // //---------------------------------------------------------------------------------------------------------------------------------

    // ...auraExitStrategy2(
    //   aura.auraB_80GNO_20WETH_REWARDER,
    //   balancer.B_80GNO_20WETH_pId
    // ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Aura GNO/COW + Balancer GNO/COW
    //---------------------------------------------------------------------------------------------------------------------------------

    ...auraExitStrategy2(
      aura.aura50COW_50GNO_REWARDER,
      balancer.B_50COW_50GNO_pId
    ),

    // //---------------------------------------------------------------------------------------------------------------------------------
    // // Aura LDO/wstETH + Balancer LDO/wstETH
    // //---------------------------------------------------------------------------------------------------------------------------------

    // ...auraExitStrategy2(
    //   aura.aura50WSTETH_50LDO_REWARDER,
    //   balancer.B_50WSTETH_50LDO_pId
    // ),

    // //---------------------------------------------------------------------------------------------------------------------------------
    // // Aura WETH/AURA + Balancer WETH/AURA
    // //---------------------------------------------------------------------------------------------------------------------------------

    // ...auraExitStrategy2(
    //   aura.aura50WETH_50AURA_REWARDER,
    //   balancer.B_50WETH_50AURA_pId
    // ),

    //---------------------------------------------------------------------------------------------------------------------------------
    // Aura WETH/COW + Balancer WETH/COW
    //---------------------------------------------------------------------------------------------------------------------------------

    ...auraExitStrategy2(
      aura.aura50COW_50WETH_REWARDER,
      balancer.B_50COW_50WETH_pId
    ),

    // //---------------------------------------------------------------------------------------------------------------------------------
    // // Aura GHO/3pool + Balancer GHO/3pool + Balancer 3pool
    // //---------------------------------------------------------------------------------------------------------------------------------

    // ...auraExitStrategy2(aura.auraGHO_3POOL_REWARDER, balancer.B_GHO_3POOL_pId),

    // // Remove Liquidity from 3pool
    // {
    //   targetAddress: balancer.VAULT,
    //   signature:
    //     "exitPool(bytes32,address,address,(address[],uint256[],bytes,bool))",
    //   params: {
    //     [0]: staticEqual(balancer.B_USDC_DAI_USDT_pId, "bytes32"), // Balancer PoolId
    //     [1]: staticEqual(AVATAR),
    //     [2]: staticEqual(AVATAR),
    //   },
    // },

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

    // //---------------------------------------------------------------------------------------------------------------------------------
    // // Spark
    // //---------------------------------------------------------------------------------------------------------------------------------

    // //---------------------------------------------------------------------------------------------------------------------------------
    // // Spark - wstETH
    // //---------------------------------------------------------------------------------------------------------------------------------

    // // Withdraw
    // allow.mainnet.spark.sparkLendingPoolV3["withdraw"](
    //   wstETH,
    //   undefined,
    //   AVATAR
    // ),

    // // Repay - DAI
    // ...allowErc20Approve([DAI], [spark.LENDING_POOL_V3]),
    // allow.mainnet.spark.sparkLendingPoolV3["repay"](
    //   DAI,
    //   undefined,
    //   undefined,
    //   AVATAR
    // ),

    // //---------------------------------------------------------------------------------------------------------------------------------
    // // Aave V3
    // //---------------------------------------------------------------------------------------------------------------------------------

    // //---------------------------------------------------------------------------------------------------------------------------------
    // // Aave V3 - wstETH
    // //---------------------------------------------------------------------------------------------------------------------------------

    // // Withdraw
    // allow.mainnet.aave_v3.pool_v3["withdraw"](wstETH, undefined, AVATAR),

    // // Repay - WBTC
    // ...allowErc20Approve([WBTC], [aave_v3.POOL_V3]),
    // allow.mainnet.aave_v3.pool_v3["repay"](WBTC, undefined, undefined, AVATAR),
  ],
  placeholders: { AVATAR },
} satisfies RolePreset

export default preset
