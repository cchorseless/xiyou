/** Create By Editor*/
import React, { createRef, useState } from "react";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { CustomAbilityButton } from "../alldota2/ui_element/CustomAbilityButton";
import { Effect_ShineItem } from "../Effect/Effect_ShineItem";
import { SkillCastItem_UI } from "./SkillCastItem_UI";
interface IProps {
    abilityname: string;
    castEntityIndex: EntityIndex;
}
export class SkillCastItem extends SkillCastItem_UI {
    constructor(props: any) {
        super(props);
        this.img_skillicon_attrs.showtooltip = true;
    }
    // 初始化数据
    onStartUI() {
        this.img_skillicon.current!.style.borderRadius = "15px";
        this.__root__.current!.hittest = true;
        this.img_skillicon.current!.hittest = true;
        this.panel_cd.current!.style.backgroundColor = "#000000DD";
        // this.addNodeChildAt(this.NODENAME.img_skillicon,CustomAbilityButton)
    }
    abilityname: string;
    castEntityIndex: EntityIndex;
    abilityindex: AbilityEntityIndex;
    onRefreshUI(p: IProps) {
        this.abilityname = p.abilityname;
        this.castEntityIndex = p.castEntityIndex;
        // let config = KV_DATA.building_ability_tower.building_ability_tower[p.itemname];
        this.img_skillicon.current!.abilityname = p.abilityname;
        if (this.castEntityIndex == null || !this.abilityname) {
            return;
        }
        this.abilityindex = Entities.GetAbilityByName(this.castEntityIndex, this.abilityname);
        this.showCdEffect();
        this.updateSelf();
    }
    onbtn_castability = () => {
        if (this.abilityindex == null || this.abilityindex < 0) {
            return;
        }
        if (Abilities.CanBeExecuted(this.abilityindex)) {
            Abilities.ExecuteAbility(this.abilityindex, this.castEntityIndex, false);
            TimerHelper.AddTimer(
                0.1,
                FuncHelper.Handler.create(this, () => {
                    this.showCdEffect();
                })
            );
        }
    };
    lefttimewprk: TimerHelper.TimerTask | null;
    showCdEffect() {
        if (this.abilityindex == null || this.abilityindex < 0) {
            return;
        }
        if (this.lefttimewprk) {
            this.lefttimewprk!.Clear();
            this.lefttimewprk = null;
        }
        let leftime = Math.floor(Abilities.GetCooldownTimeRemaining(this.abilityindex) * 10) - 10;
        if (leftime <= 0 || Abilities.IsCooldownReady(this.abilityindex)) {
            this.panel_cd.current!.visible = false;
            this.lbl_lefttime.current!.visible = false;
            return;
        }
        let count = leftime;
        this.lefttimewprk = TimerHelper.AddIntervalTimer(
            0,
            0.1,
            FuncHelper.Handler.create(this, () => {
                if (count <= 0) {
                    this.panel_cd.current!.visible = false;
                    this.lbl_lefttime.current!.visible = false;
                    this.lefttimewprk!.Clear();
                    this.lefttimewprk = null;
                    this.addOrShowOnlyNodeChild(this.NODENAME.img_skillicon, Effect_ShineItem);
                } else {
                    this.panel_cd.current!.visible = true;
                    this.lbl_lefttime.current!.visible = true;
                    this.lbl_lefttime.current!.text = "" + (count / 10).toFixed(1);
                    this.panel_cd.current!.style.clip = "radial(50.0% 50.0%, 0.0deg, " + -(count / leftime) * 360 + "deg)";
                    count--;
                }
                this.updateSelf();
            }),
            -1
        );
    }
}
