import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";

import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TBattlePassTaskItem } from "../../../../scripts/tscripts/shared/service/battlepass/TBattlePassTaskItem";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { CCButtonBox } from "../AllUIElement/CCButton/CCButtonBox";
import { CCIcon_Point } from "../AllUIElement/CCIcons/CCIcon_Point";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";
import "./CCBattlePassTaskHudDialog.less";

interface ICCBattlePassTaskHudDialog {
}

export class CCBattlePassTaskHudDialog extends CCPanel<ICCBattlePassTaskHudDialog> {

    onReady() {
        return GGameScene.Local.TCharacter != null && GGameScene.Local.TCharacter.BattlePassComp != null
    }
    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.BattlePassComp);
        NetHelper.ListenOnLua(GameProtocol.Protocol.push_GameEndResult, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            this.UpdateState({ ExpandBattlePassTask: true })
        }))
        NetHelper.ListenOnLua(GameProtocol.Protocol.push_PlayerGameEnd, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            this.UpdateState({ ExpandBattlePassTask: true })
        }))

    }

    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_BattlePassTaskHudDialog") };
        const BattlePassComp = (GGameScene.Local.TCharacter.BattlePassComp!)!;
        const DailyTasks = BattlePassComp.GetDailyTasks().filter((v) => !v.IsAchieve);
        const WeekTasks = BattlePassComp.GetWeekTasks().filter((v) => !v.IsAchieve);;
        const ExpandBattlePassTask = this.GetState<boolean>("ExpandBattlePassTask", false);
        return (
            <Panel id="CC_BattlePassTaskHudDialog" ref={this.__root__}  {...this.initRootAttrs()}>
                <Button id="ToggleBattlePassTask" className={CSSHelper.ClassMaker({ ExpandBattlePassTask: ExpandBattlePassTask })}
                    onactivate={
                        () => {
                            this.UpdateState({ ExpandBattlePassTask: !ExpandBattlePassTask })
                        }}>
                    <CCLabel id="ToggleDes" text={"任务"} verticalAlign="center" width="20px" fontSize="16px" type="Title" />
                    <Image id="ToggleImg" />
                </Button>
                <Panel id="BattlePassTaskPanelAndTitle" className={CSSHelper.ClassMaker({ ExpandBattlePassTask: ExpandBattlePassTask })} hittest={false}>
                    <Label id="BattlePassTaskTitle" localizedText="#sBattlePassTaskTitle" />
                    <CCPanel id="BattlePassTaskPanel" hittest={false} scroll={"y"}>
                        {
                            [...DailyTasks, ...WeekTasks].map((v, index) => {
                                return <CCBpTaskHudItem key={index + ""} entity={v} marginTop={"5px"} />
                            })
                        }
                    </CCPanel>
                </Panel>
            </Panel>
        );
    }
}

export class CCBpTaskHudItem extends CCPanel<{ entity: TBattlePassTaskItem }> {

    onInitUI() {
        this.ListenUpdate(this.props.entity)
    }
    OnBtnTaskGet(entity: TBattlePassTaskItem) {
        if (!entity.IsAchieve) {
            TipsHelper.showErrorMessage("任务尚未完成");
            return;
        }
        if (entity.IsPrizeGet) {
            TipsHelper.showErrorMessage("奖励已领取");
            return;
        }

        NetHelper.SendToCSharp(GameProtocol.Protocol.GetPrize_TaskPrize, {
            TaskId: entity.Id
        })
    }
    render() {
        const entity = this.props.entity;
        const config = GJSONConfig.BattlePassTaskConfig.get(entity.ConfigId)!;
        let hero: string | null = null;
        if (config.BindHero && config.BindHero.length > 0) {
            hero = config.BindHero;
        }
        const current = entity.Progress;
        const total = config.TaskFinishCondition.ValueInt;
        return <Panel className={"CCBpTaskHudItem"} ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <CCButtonBox width="100%" height="100%" flowChildren="right" onactivate={() => {
                this.OnBtnTaskGet(entity);
            }}>
                {hero != null ? <CCUnitSmallIcon itemname={hero} width="25px" height="25px" marginLeft={"10px"} verticalAlign="center" />
                    : <CCIcon_Point type="Full" width="25px" height="25px" marginLeft={"10px"} verticalAlign="center" />
                }
                <CCPanel flowChildren="down" marginLeft={"3px"}>
                    <Label id="TaskDesc" key={"desc" + config.TaskType} localizedText={"#bp_task_desc_" + config.TaskType} dialogVariables={{ hero_name: ($.Localize("#" + (hero ?? ""))) as string }} />
                    <ProgressBar id="TaskProgressBar" value={current / total} >
                        <Label text={`${current}/${total}`} />
                    </ProgressBar>
                </CCPanel>
            </CCButtonBox>

        </Panel>
    }
}