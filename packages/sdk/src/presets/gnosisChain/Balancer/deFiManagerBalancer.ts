import { AVATAR } from "../../placeholders"
import { RolePreset } from "../../types"
import { allow } from "../../allow"
import { allowErc20Approve } from "../../helpers/erc20"
import {
  GNO,
  rGNO,
  sGNO,
  curve,
} from "../addresses"


const preset = {
  network: 100,
  allow: [
    //---------------------------------------------------------------------------------------------------------------------------------
    // StakeWise v2 / Curve
    //---------------------------------------------------------------------------------------------------------------------------------

    // Swap GNO <> sGNO
    ...allowErc20Approve([GNO, sGNO], [curve.sgnoCRV_LP_POOL]),
    allow.gnosis.curve.sgnoCRV_lp_pool["exchange(int128,int128,uint256,uint256)"](),
    allow.gnosis.curve.sgnoCRV_lp_pool["exchange(int128,int128,uint256,uint256,address)"](
      undefined,
      undefined,
      undefined,
      undefined,
      AVATAR
    ),

    // Swap rGNO <> sGNO
    ...allowErc20Approve([rGNO, sGNO], [curve.rgnoCRV_LP_POOL]),
    allow.gnosis.curve.rgnoCRV_lp_pool["exchange(int128,int128,uint256,uint256)"](),
    allow.gnosis.curve.rgnoCRV_lp_pool["exchange(int128,int128,uint256,uint256,address)"](
      undefined,
      undefined,
      undefined,
      undefined,
      AVATAR
    ),

  ],
  placeholders: { AVATAR },
} satisfies RolePreset

export default preset