import React from "react";
import { RoundConfig } from "../../../../scripts/tscripts/shared/RoundConfig";
import { NetHelper } from "../../helper/NetHelper";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCProgressBar } from "../AllUIElement/CCProgressBar/CCProgressBar";
import "./CCBossHpBarItem.less";

interface ICCBossHpBarItem {
}
export class CCBossHpBarItem extends CCPanel<ICCBossHpBarItem> {

    onStartUI() {
        $.Schedule(0, () => {
            const entityid = this.GetState<EntityIndex>("entityid") || 0;
            if (entityid != null && entityid != 0 && !Entities.IsAlive(entityid)) {
                this.UpdateState({ entityid: 0 });
            }
            else {
                this.UpdateSelf();
            }
            this.onStartUI();
        });
    }
    onInitUI() {
        NetHelper.ListenOnLua(RoundConfig.EProtocol.roundboard_showbosshp, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            GLogHelper.print(e, 111)
            this.UpdateState({ entityid: e.data })
        }))
    }

    render() {
        const entityid = this.GetState<EntityIndex>("entityid") || 0;
        if (entityid == null || entityid == 0) {
            return this.defaultRender("CC_BossHpBarItem")
        }
        let unitname = Entities.GetUnitName(entityid);
        unitname = Entities.GetLocalizeUnitName(unitname);
        const hpMax = Entities.GetMaxHealth(entityid);
        const hpCur = Entities.GetHealth(entityid);
        return (<Panel id="CC_BossHpBarItem" className="CCBossHpBarItem" ref={this.__root__}   {...this.initRootAttrs()}>
            <Panel id="HealthBar" >
                <CCProgressBar id="HealthProgressBar" anieffect={true} value={hpCur} max={hpMax} />
                <CCLabel type="UnitName" fontSize="18px" marginBottom={"10px"} align="center bottom" html={true} text={`${hpCur}/${hpMax}`} />
            </Panel>
            <Panel id="Name_panel" >
                <Label id="Name" html={true} text={unitname} />
            </Panel>
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}
