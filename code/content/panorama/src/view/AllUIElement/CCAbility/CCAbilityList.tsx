import React, { createRef } from "react";
import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { CSSHelper } from "../../../helper/CSSHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCAbilityList.less";
import { CCAbilityPanel } from "./CCAbilityPanel";

interface ICCAbilityList extends NodePropsData {
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
                            return <CCAbilityPanel key={key.toString()} overrideentityindex={overrideentityindex as any} hittest={false} />
                        })}
                    </Panel>
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }

}

export class CCAbilityList2 extends CCPanel<ICCAbilityList> {
    abilities = createRef<Panel>();

    onReady() {
        return CSSHelper.IsReadyUI()
    }
    onStartUI() {
        if (this.abilities.current) {
            const abilitypanel = this.abilities.current;
            GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
                let len = abilitypanel.GetChildCount()
                if (len == 0) { return 1 }
                for (let i = 0; i < len; i++) {
                    const p = abilitypanel.GetChild(i)!;
                    const AbilityButton = p.FindChildTraverse("AbilityButton");
                    if (AbilityButton) {
                        AbilityButton.style.tooltipPosition = "top"
                    }
                }

            }))
            // GTimerHelper.AddFrameTimer(5, GHandler.create(this, () => {
            //     let len = abilitypanel.GetChildCount()
            //     if (len == 0) { return 1 }
            //     this.updateAbilityList();
            //     return 5;
            // }))

        }
    }

    private updateAbilityList() {
        const abilitypanel = this.abilities.current!;
        let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
        for (let i = 0; i < Entities.GetAbilityCount(iLocalPortraitUnit); i++) {
            let iAbilityEntIndex = Entities.GetAbility(iLocalPortraitUnit, i);
            if (iAbilityEntIndex == -1) continue;
            let sAbilityName = Abilities.GetAbilityName(iAbilityEntIndex);
            const ishidden = KVHelper.KVAbilitys()[sAbilityName] && KVHelper.KVAbilitys()[sAbilityName].CustomHidden == "1";
            const p = abilitypanel.GetChild(i)!;
            if (p) {
                p.SetHasClass("Hidden", Boolean(ishidden));
            }
        }
    }
    render() {
        return <Panel id="CC_AbilityList" ref={this.__root__}  {...this.initRootAttrs()}>
            <GenericPanel ref={this.abilities} type="DOTAAbilityList" id="abilities" hittest={false} tooltiPosition="top" />
        </Panel>
    }
}