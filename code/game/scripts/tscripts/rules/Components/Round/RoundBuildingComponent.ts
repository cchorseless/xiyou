import { building_auto_findtreasure } from "../../../npc/abilities/common/building_auto_findtreasure";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/modifier_jiaoxie_wudi";
import { modifier_wait_portal } from "../../../npc/modifier/modifier_portal";
import { modifier_remnant } from "../../../npc/modifier/modifier_remnant";
import { ET, registerET } from "../../Entity/Entity";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { KVConfigComponment } from "../KVConfig/KVConfigComponment";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
/**回合控制 */
@registerET()
export class RoundBuildingComponent extends ET.Component {
    onAwake(...args: any[]): void {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let currentround = domain.ETRoot.As<PlayerCreateUnitEntityRoot>().GetPlayer().RoundManagerComp().getCurrentBoardRound();
        switch (currentround.roundState) {
            case RoundConfig.ERoundBoardState.start:
                this.OnBoardRound_Start();
                break;
        }
    }
    OnBoardRound_Start() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.addSpawnedHandler(
            ET.Handler.create(this, () => {
                modifier_jiaoxie_wudi.applyOnly(domain, domain);
            })
        );
    }

    OnBoardRound_Battle() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        modifier_jiaoxie_wudi.remove(domain);
        modifier_remnant.applyOnly(domain, domain);
    }

    OnBoardRound_Prize(isWin: boolean) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        if (isWin) {
            building_auto_findtreasure.findIn(domain).StartFindTreasure();
            modifier_wait_portal.applyOnly(domain, domain, null, { duration: 60 });
        } else {
            modifier_remnant.remove(domain);
        }
    }

    OnBackBoardFromBaseRoom() {
        
    }

}
