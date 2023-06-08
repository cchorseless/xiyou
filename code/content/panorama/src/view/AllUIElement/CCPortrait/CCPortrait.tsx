import React from "react";
import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCDOTAUIEconSetPreview } from "../CCDOTAScenePanel/CCDOTAUIEconSetPreview";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCPortrait.less";
interface ICCPortrait {
}



export class CCPortrait extends CCPanel<ICCPortrait> {

    onInitUI() {
        this.addEvent();
    }
    addEvent() {
        const eventList = [
            GameEnum.GameEvent.dota_player_update_selected_unit,
            GameEnum.GameEvent.dota_player_update_query_unit,
        ]
        eventList.forEach(event => {
            this.addGameEvent(event, (e) => {
                this.UpdateSelf();
            });
        })
    }

    onStartUI() {
        // $.CreatePanelWithProperties("Button", this.__root__.current!, "InspectButton", {
        //     class: "PortraitButton",
        //     onactivate: "DOTAHUDInspect();",
        //     "always-cache-composition-layer": "true",
        // });
        // $.CreatePanelWithProperties("Button", this.__root__.current!, "HeroViewButton", {
        //     class: "PortraitButton",
        //     onactivate: "DOTAHUDHeroViewClicked();",
        //     "always-cache-composition-layer": "true",
        // });
    }

    render() {
        const entityindex = Players.GetLocalPlayerPortraitUnit();
        const unitname = Entities.GetUnitName(entityindex).replace("_enemy_", "_hero_").replace("building_", "npc_dota_")
        const curwearid = Entities.GetWearableBundle(entityindex);

        return (<Panel className={CSSHelper.ClassMaker("CCPortrait", { "CCEconScalePortrait": curwearid > 0 })} ref={this.__root__}  {...this.initRootAttrs()}>
            {
                curwearid > 0 ? <CCDOTAUIEconSetPreview className="CCEconPortrait" key={Math.random() * 100 + ""} unit={unitname} itemdef={curwearid} allowrotation={true} drawbackground={true} />
                    :
                    <GenericPanel type="DOTAPortrait" style={{ width: "100%", height: "100%" }} className="PortraitLocation" id="portraitHUDOverlay" >
                    </GenericPanel>
            }

        </Panel>)
    }
}

