/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { CSSHelper } from "../../helper/CSSHelper";
import { DotaUIHelper } from "../../helper/DotaUIHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { ToolTipHelper } from "../../helper/ToolTipHelper";
import { BaseEasyPureComponent, BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { CCMenuNavigation } from "../allCustomUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CustomMiniMap } from "../alldota2/minimap_plus/CustomMiniMap";
import { ChallengeShopItem } from "../Challenge/ChallengeShopItem";
import { CombinationBottomPanel } from "../Combination/CombinationBottomPanel";
import { DacBoardPanelV0 } from "../Common/DacBoardPanelV0";
import { DebugPanel } from "../debugPanel/DebugPanel";
import { ShopPanel } from "../Shop/ShopPanel";
import { ShopTopRightPanel } from "../Shop/ShopTopRightPanel";
import { TopBarPanel } from "../TopBarPanel/TopBarPanel";
import { CCMainPanel_UI } from "./CCMainPanel_UI";
export class CCMainPanel extends CCMainPanel_UI<NodePropsData> {
    InitUI() {
        this.addNodeChildAt(this.NODENAME.panel_base, CCMenuNavigation, {
            list: ["setting", "mail", "store", "battlepass", "draw", "handbook"],
            onToggle: (menuName: string, state: boolean) => {
                if (menuName == "store") {
                    if (state) {
                        this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, ShopPanel, {
                            marginTop: "100px",
                        } as any)
                        this.updateSelf();
                    }
                    else {
                        ShopPanel.GetInstance()?.close()
                    }
                }
            }
        } as any);


        
    }
}
