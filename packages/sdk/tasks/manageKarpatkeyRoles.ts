import "@nomiclabs/hardhat-ethers"

import { writeFileSync, existsSync, mkdirSync } from "fs"
import path from "path"

import { task as baseTask, types } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { Roles } from "../../evm/typechain-types"
import addMembers from "../src/addMembers"
import { encodeApplyPresetTxBuilder } from "../src/applyPreset"
// import gnosisChainDeFiHarvestPreset from "../src/presets/gnosisChain/deFiHarvest"
// import gnosisChainDeFiManagePreset from "../src/presets/gnosisChain/deFiManage"
import mainnetDeFiDisassembleKPKPreset from "../src/presets/mainnet/KPK/deFiDisassembleKPK"
import gnosisChainDeFiDisassembleKPKPreset from "../src/presets/gnosisChain/KPK/deFiDisassembleKPK"
import gnosisChainDeFiManagePreset from "../src/presets/gnosisChain/deFiManageTest"
import mainnetDeFiManageTestPreset from "../src/presets/mainnet/deFiManageTest"
import { NetworkId } from "../src/types"

interface Config {
  AVATAR: string
  MODULE: string
  MANAGER: string
  REVOKER: string
  HARVESTER: string
  DISASSEMBLER: string
  SWAPPER: string
  NETWORK: NetworkId
  BRIDGED_SAFE: string
  ROLE_IDS: {
    MANAGER: number
    REVOKER: number
    HARVESTER: number
    DISASSEMBLER: number
    SWAPPER: number
  }
}

export const KPK_ADDRESSES = {
  KPK_ETH: {
    AVATAR: "0x58e6c7ab55Aa9012eAccA16d1ED4c15795669E1C",
    MODULE: "0x8C33ee6E439C874713a9912f3D3debfF1Efb90Da",
    MANAGER: "0x8072470f155c69c0706dd6016d6720d7eb0438fb", // Used as DISASSEMBLER
    REVOKER: "",
    HARVESTER: "",
    DISASSEMBLER: "",
    SWAPPER: "",
    NETWORK: 1,
    BRIDGED_SAFE: "0x0000000000000000000000000000000000000000",
    ROLE_IDS: {
      MANAGER: 1,
      REVOKER: 2,
      HARVESTER: 3,
      DISASSEMBLER: 4,
      SWAPPER: 5,
    },
  },

  KPK_GNO: {
    AVATAR: "0x54e191B01aA9C1F61AA5C3BCe8d00956F32D3E71",
    MODULE: "0x31624fBEdE7e9F9F93a123F8BC9C030C98F32Ef4",
    MANAGER: "0xA3801af0D95Ad8e751b378C50ac86a47986b0110", // Used as DISASSEMBLER
    REVOKER: "",
    HARVESTER: "",
    DISASSEMBLER: "",
    SWAPPER: "",
    NETWORK: 100,
    BRIDGED_SAFE: "0x0000000000000000000000000000000000000000",
    ROLE_IDS: {
      MANAGER: 1,
      REVOKER: 2,
      HARVESTER: 3,
      DISASSEMBLER: 4,
      SWAPPER: 5,
    },
  },

  SANTI_TEST_GNO: {
    // AVATAR: "0x3AD295402978659427C179Fb30f319bF6a2c8678",
    AVATAR: "0x9a18b276e86844A05587e1C822D2311D51d1c7F9",
    // MODULE: "0x8422d860d48Bc2aFeA8037d3954db31d5d3b4924",
    MODULE: "0xB6CeDb9603e7992A5d42ea2246B3ba0a21342503",
    MANAGER: "0xa928b0F1582126db08f902066403a3C69D2E7814",
    REVOKER: "0x7e19DE37A31E40eec58977CEA36ef7fB70e2c5CD",
    HARVESTER: "",
    DISASSEMBLER: "",
    SWAPPER: "",
    NETWORK: 100,
    BRIDGED_SAFE: "0x0000000000000000000000000000000000000000",
    ROLE_IDS: {
      MANAGER: 1,
      REVOKER: 2,
      HARVESTER: 3,
      DISASSEMBLER: 4,
      SWAPPER: 5,
    },
  },
  TEST_ETH: {
    AVATAR: "0xA2372f3C9a26F45b5D69BD513BE0d553Ff9CC617",
    MODULE: "0xeF14e0f66a2e22Bbe85bFA53b3F956354Ce51e62",
    MANAGER: "0xc5beBC8c253183F35cc7DB7C4216c124d4BA3F76",
    REVOKER: "",
    HARVESTER: "",
    DISASSEMBLER: "",
    SWAPPER: "",
    NETWORK: 1,
    BRIDGED_SAFE: "0x0000000000000000000000000000000000000000",
    ROLE_IDS: {
      MANAGER: 1,
      REVOKER: 2,
      HARVESTER: 3,
      DISASSEMBLER: 4,
      SWAPPER: 5,
    },
  },
} satisfies { [key: string]: Config }

const task = (name: string) =>
  baseTask(name)
    .addParam(
      "safe",
      "one of: 'DAO_GNO' (DAO Safe on Gnosis Chain), 'LTD_GNO' (Limited Safe on Gnosis Chain)",
      undefined,
      types.string
    )
    .addOptionalParam(
      "dryRun",
      "When enabled it only prints the transaction data but does not send it",
      false,
      types.boolean
    )

const processArgs = async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
  const { dryRun, safe } = taskArgs
  if (!(safe in KPK_ADDRESSES)) {
    throw new Error(`safe param value '${safe}' not supported`)
  }
  const safeKey = safe as keyof typeof KPK_ADDRESSES
  if (hre.network.config.chainId !== KPK_ADDRESSES[safeKey].NETWORK) {
    throw new Error(`using wrong network!`)
  }
  const roles = await getContract(safe, hre)

  return { dryRun, safe, roles, config: KPK_ADDRESSES[safeKey] }
}

const getContract = async (safe: string, hre: HardhatRuntimeEnvironment) => {
  const signers = await hre.ethers.getSigners()
  const Roles = await hre.ethers.getContractFactory("Roles", {
    libraries: { Permissions: "0xc9826D544DBE637F386eA23EEef65ae7a1F5dF33" },
  })
  return new hre.ethers.Contract(
    "0x0Df1f08f765238dc0b8beAAdDd6681F62e54beC6",
    Roles.interface,
    signers[0]
  ) as unknown as Roles
}

task("setMultisend").setAction(async (taskArgs, hre) => {
  const { dryRun, roles } = await processArgs(taskArgs, hre)

  const MULTISEND_ADDRESS = "0x8D29bE29923b68abfDD21e541b9374737B49cdAD"
  const tx = await roles.setMultisend(MULTISEND_ADDRESS)
  console.log(JSON.stringify({ to: tx.to, data: tx.data }, null, 2))
  if (dryRun) return

  console.log(`TX hash: ${tx.hash}`)
  console.log("Waiting for confirmation...")
  await tx.wait()
  console.log("Done.")
})

task("assignManagementRole").setAction(async (taskArgs, hre) => {
  const { dryRun, roles, config } = await processArgs(taskArgs, hre)

  const tx = await roles.assignRoles(config.MANAGER, [1], [true])
  console.log(JSON.stringify({ to: tx.to, data: tx.data }, null, 2))
  if (dryRun) return

  console.log(`TX hash: ${tx.hash}`)
  console.log("Waiting for confirmation...")
  await tx.wait()
  console.log("Done.")
})

task("assignHarvestRole").setAction(async (taskArgs, hre) => {
  const { dryRun, roles, config } = await processArgs(taskArgs, hre)

  const txData = await addMembers(config.MODULE, 2, [config.HARVESTER])
  console.log(JSON.stringify({ to: txData.to, data: txData.data }, null, 2))
  if (dryRun) return

  const tx = await roles.signer.sendTransaction(txData)
  console.log(`TX hash: ${tx.hash}`)
  console.log("Waiting for confirmation...")
  await tx.wait()
  console.log("Done.")
})

task("assignSwapRole").setAction(async (taskArgs, hre) => {
  const { dryRun, roles, config } = await processArgs(taskArgs, hre)

  const txData = await addMembers(config.MODULE, 3, [config.SWAPPER])
  console.log(JSON.stringify({ to: txData.to, data: txData.data }, null, 2))
  if (dryRun) return

  const tx = await roles.signer.sendTransaction(txData)
  console.log(`TX hash: ${tx.hash}`)
  console.log("Waiting for confirmation...")
  await tx.wait()
  console.log("Done.")
})

task("encodeApplyPresetManageTest").setAction(async (taskArgs, hre) => {
  const { config } = await processArgs(taskArgs, hre)
  const txBatches = await encodeApplyPresetTxBuilder(
    config.MODULE,
    1,
    mainnetDeFiManageTestPreset,
    {
      AVATAR: config.AVATAR,
    },
    {
      network: config.NETWORK as NetworkId,
    }
  )

  writeFileSync(
    path.join(__dirname, "..", "txDataManageTest.json"),
    JSON.stringify(txBatches, undefined, 2)
  )
  console.log(
    `Transaction builder JSON written to packages/sdk/txDataManageTest.json`
  )
})

task("encodeApplyPresetManageTestGNO").setAction(async (taskArgs, hre) => {
  const { config } = await processArgs(taskArgs, hre)
  const txBatches = await encodeApplyPresetTxBuilder(
    config.MODULE,
    2,
    gnosisChainDeFiManagePreset,
    {
      AVATAR: config.AVATAR,
    },
    {
      network: config.NETWORK as NetworkId,
    }
  )

  writeFileSync(
    path.join(__dirname, "..", "txDataManageTest.json"),
    JSON.stringify(txBatches, undefined, 2)
  )
  console.log(
    `Transaction builder JSON written to packages/sdk/txDataManageTest.json`
  )
})

task("encodeApplyPresetsDisassembleKPKmainnet").setAction(async (taskArgs, hre) => {
  const { config } = await processArgs(taskArgs, hre)
  const txBatches = await encodeApplyPresetTxBuilder(
    config.MODULE,
    config.ROLE_IDS.MANAGER,
    mainnetDeFiDisassembleKPKPreset,
    { AVATAR: config.AVATAR },
    {
      network: config.NETWORK as NetworkId,
    }
  )

  const filePath = path.join(
    __dirname,
    "..",
    "/presets-output/mainnet/KPK/txDataDisassembleKPKmainnet.json"
  )
  if (!existsSync(filePath)) {
    // Create the directory structure if it doesn't exist
    mkdirSync(path.dirname(filePath), { recursive: true })
  }
  // Write the JSON data to the file
  writeFileSync(filePath, JSON.stringify(txBatches, undefined, 2))
  console.log(`Transaction builder JSON written to  ${filePath}`)
})

task("encodeApplyPresetsDisassembleKPKgnosis").setAction(async (taskArgs, hre) => {
  const { config } = await processArgs(taskArgs, hre)
  const txBatches = await encodeApplyPresetTxBuilder(
    config.MODULE,
    config.ROLE_IDS.MANAGER,
    gnosisChainDeFiDisassembleKPKPreset,
    { AVATAR: config.AVATAR },
    {
      network: config.NETWORK as NetworkId,
    }
  )

  const filePath = path.join(
    __dirname,
    "..",
    "/presets-output/gnosis/KPK/txDataDisassembleKPKgnosis.json"
  )
  if (!existsSync(filePath)) {
    // Create the directory structure if it doesn't exist
    mkdirSync(path.dirname(filePath), { recursive: true })
  }
  // Write the JSON data to the file
  writeFileSync(filePath, JSON.stringify(txBatches, undefined, 2))
  console.log(`Transaction builder JSON written to  ${filePath}`)
})