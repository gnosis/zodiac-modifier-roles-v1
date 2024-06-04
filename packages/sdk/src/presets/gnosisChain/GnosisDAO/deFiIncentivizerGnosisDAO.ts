import { allow } from "../../allow"
import { AVATAR } from "../../placeholders"
import { RolePreset } from "../../types"
import { wstETH } from "../addresses"

const preset = {
  network: 100,
  allow: [
    allow.gnosis.curve.crvEUReUSD_gauge.deposit_reward_token(
      wstETH,
      1200000000000000000n
    )
  ],
  placeholders: { AVATAR },
} satisfies RolePreset

export default preset