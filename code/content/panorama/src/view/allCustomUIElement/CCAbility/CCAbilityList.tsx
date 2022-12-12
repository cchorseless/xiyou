import React, { createRef, PureComponent } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CSSHelper } from "../../../helper/CSSHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { CCMainPanel } from "../../MainPanel/CCMainPanel";
import { CCAbilityInfoDialog } from "./CCAbilityInfoDialog";
import "./CCAbilityList.less";
import { CCAbilityPanel } from "./CCAbilityPanel";
import { GameEnum } from "../../../../../../game/scripts/tscripts/shared/GameEnum";
import { AbilityHelper } from "../../../helper/DotaEntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
interface ICCAbilityList extends NodePropsData {
}

export class CCAbilityList2 extends CCPanel<ICCAbilityList> {
    abilityList: React.RefObject<Panel>;
    onInitUI() {
        this.abilityList = createRef<Panel>();
    }
    onStartUI() {
        this.hideAbility()
    }
    dealList: number[] = [];
    private hideAbility() {
        let mainpanel = CCPanel.GetInstanceByName<CCMainPanel>("CCMainPanel");
        for (let i = 0; i < 15; i++) {
            let panel = this.abilityList.current!.FindChild("Ability" + i);
            if (panel == null || this.dealList.includes(i)) {
                continue;
            }
            this.dealList.push(i)
            let abilityButton = panel.FindChildTraverse("AbilityButton")!;
            mainpanel.RegCustomToolTip(abilityButton, CCAbilityInfoDialog, () => {
                let selectedEntityid = Players.GetLocalPlayerPortraitUnit();;
                let abilityindex = Entities.GetAbility(selectedEntityid, i);
                return {
                    abilityname: Abilities.GetAbilityName(abilityindex),
                    castentityindex: selectedEntityid,
                    level: Abilities.GetLevel(abilityindex),
                }
            }, true)
            if (this.props.noshowability && this.props.noshowability.includes(i)) {
                panel.visible = false;
            }
        }
        // if (this.props.noshowability) {
        //     let isFinish = true;
        //     this.props.noshowability.forEach(i => {
        //         if (!this.dealList.includes(i)) {
        //             isFinish = false;
        //         }
        //     })
        //     if (!isFinish) {
        //         // TimerHelper.AddTimer(0.1, FuncHelper.Handler.create(this, () => {
        //         //     this.hideAbility();
        //         // }))
        //     }
        // }
    }

    render() {
        return (
            this.__root___isValid && (
                <Panel id="CC_AbilityList" ref={this.__root__}  {...this.initRootAttrs()}>
                    <GenericPanel type="DOTAAbilityList" id="abilities" ref={this.abilityList}>
                    </GenericPanel>
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }

}


export class CCAbilityList extends CCPanel<ICCAbilityList> {
    abilityList: React.RefObject<Panel> = createRef<Panel>();

    private updateAbilityList() {
        let aAbilities = [];
        let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
        // $.GetContextPanel().SetHasClass("HasAbilityToSpend", Entities.GetAbilityPoints(iLocalPortraitUnit) > 0);
        for (let i = 0; i < Entities.GetAbilityCount(iLocalPortraitUnit); i++) {
            let iAbilityEntIndex = Entities.GetAbility(iLocalPortraitUnit, i);
            if (iAbilityEntIndex == -1) continue;
            let sAbilityName = Abilities.GetAbilityName(iAbilityEntIndex);
            if (KVHelper.KVAbilitys()[sAbilityName] && KVHelper.KVAbilitys()[sAbilityName].CustomHidden == "1") continue;
            if (!Abilities.IsDisplayedAbility(iAbilityEntIndex)) continue;
            aAbilities.push(iAbilityEntIndex);
        }
        this.UpdateState({ abilities: aAbilities })
    }

    addEvent() {
        const eventlist = [
            GameEnum.GameEvent.dota_portrait_ability_layout_changed,
            GameEnum.GameEvent.dota_player_update_selected_unit,
            GameEnum.GameEvent.dota_player_update_query_unit,
            GameEnum.GameEvent.dota_hero_ability_points_changed,
        ];
        eventlist.forEach(eventname => {
            this.addGameEvent(eventname, () => {
                this.updateAbilityList()
            })
        })
    }
    onInitUI() {
        this.updateAbilityList()
        this.addEvent()
    }

    render() {
        const abilities = this.GetState<number[]>("abilities") || [];
        const iAbilityCount = abilities.length;
        const classDes = {
            "FiveAbilities": iAbilityCount == 5,
            "SixAbilities": iAbilityCount == 6,
            "SevenAbilities": iAbilityCount == 7,
            "EightAbilities": iAbilityCount == 8,
            "NineAbilities": iAbilityCount == 9,
        };
        return (
            this.__root___isValid && (
                <Panel id="CC_AbilityList" ref={this.__root__}  {...this.initRootAttrs()}>
                    <Panel id="abilities" className={CSSHelper.ClassMaker(classDes)} hittest={false} ref={this.abilityList}>
                        {abilities.map((overrideentityindex, key) => {
                            return <CCAbilityPanel key={key.toString()} overrideentityindex={overrideentityindex as any} hittest={false} />;
                        })}
                    </Panel>
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }

}