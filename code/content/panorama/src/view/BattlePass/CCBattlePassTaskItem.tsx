import React from "react";

import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TBattlePassTaskItem } from "../../../../scripts/tscripts/shared/service/battlepass/TBattlePassTaskItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { CCButtonBox } from "../AllUIElement/CCButton/CCButtonBox";
import { CCIcon_Check } from "../AllUIElement/CCIcons/CCIcon_Check";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCUnitBustIcon } from "../AllUIElement/CCUnit/CCUnitBustIcon";
import { CCBPTimerAndLevelItem } from "./CCBattlePassPrizeItem";
import "./CCBattlePassTaskItem.less";
interface ICCBattlePassTaskItem extends NodePropsData {

}

export class CCBattlePassTaskItem extends CCPanel<ICCBattlePassTaskItem> {

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.BattlePassComp)
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
        const BattlePassComp = (GGameScene.Local.TCharacter.BattlePassComp!)!;
        const IsBattlePass = BattlePassComp.IsBattlePass;
        const DailyTasks = BattlePassComp.GetDailyTasks();
        const WeekTasks = BattlePassComp.GetWeekTasks();
        return (<Panel className="CCBattlePassTaskItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <CCPanel flowChildren="right" horizontalAlign="center" height="120px" >
                <CCPanel width="200px" flowChildren="down" verticalAlign="center" >
                    <CCLabel text={"第10赛季"} type="Title" fontSize="20px" horizontalAlign="center" />
                    <CCLabel text={"战令通行证"} type="UnitName" fontSize="30px" horizontalAlign="center" />
                </CCPanel>
                <CCBPTimerAndLevelItem marginLeft="20px" verticalAlign="center" />
            </CCPanel>
            <CCPanel flowChildren="right" width="100%" height="800px" >
                <CCPanel id="WeekTaskMain">
                    <Panel id="WeekTaskTitle" className="TaskTypeTitle" hittest={false}>
                        <Label className="TaskType" localizedText="#lang_hud_bp_task_type_1" />
                        <Countdown endTime={GToNumber(BattlePassComp.WeekEndTimeSpan)}>
                            <Label className="TaskRefreshTime" localizedText="#lang_hud_bp_task_refresh_time" />
                        </Countdown>
                    </Panel>
                    <CCPanel id="WeekTaskList" scroll={"y"}>
                        {WeekTasks.map((entity, index) => {
                            return <CCButtonBox key={index + ""} marginLeft={"20px"} onactivate={() => this.OnBtnTaskGet(entity)}>
                                <CCBpTaskItem entity={entity} IsBattlePass={IsBattlePass} />
                            </CCButtonBox>
                        })}
                    </CCPanel>
                </CCPanel>
                <CCPanel id="DailyTaskMain">
                    <Panel id="DailyTaskTitle" className="TaskTypeTitle" hittest={false}>
                        <Label className="TaskType" localizedText="#lang_hud_bp_task_type_2" />
                        <Countdown endTime={GToNumber(BattlePassComp.DailyEndTimeSpan)}>
                            <Label className="TaskRefreshTime" localizedText="#lang_hud_bp_task_refresh_time" />
                        </Countdown>
                    </Panel>
                    <CCPanel id="DailyTaskList" scroll={"y"}>
                        {DailyTasks.map((entity, index) => {
                            return <CCButtonBox key={index + ""} horizontalAlign="center" onactivate={() => this.OnBtnTaskGet(entity)}>
                                <CCBpTaskItem entity={entity} IsBattlePass={IsBattlePass} />
                            </CCButtonBox>
                        })}
                    </CCPanel>
                </CCPanel>
            </CCPanel>


        </Panel>)
    }
}


export class CCBpTaskItem extends CCPanel<{ entity: TBattlePassTaskItem, IsBattlePass: boolean }> {

    onInitUI() {
        this.ListenUpdate(this.props.entity)
    }

    render() {
        const entity = this.props.entity;
        const IsBattlePass = this.props.IsBattlePass;
        const config = GJSONConfig.BattlePassTaskConfig.get(entity.ConfigId)!;
        let hero: string | null = null;
        if (config.BindHero && config.BindHero.length > 0) {
            hero = config.BindHero;
        }
        const current = entity.Progress;
        const total = config.TaskFinishCondition.ValueInt;
        return <Panel className={CSSHelper.ClassMaker("CCBpTaskItem", { IsFinishTask: entity.IsAchieve })} ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <Label id="TaskTitle" key={config.TaskType} localizedText={"#bp_task_title_" + config.TaskType} />
            <Label id="TaskDesc" key={"desc" + config.TaskType} localizedText={"#bp_task_desc_" + config.TaskType} dialogVariables={{ hero_name: ($.Localize("#" + (hero ?? ""))) as string }} />
            {entity.IsPrizeGet && <CCIcon_Check id="Check" />}
            {hero != null && <CCUnitBustIcon id="TaskHero" itemname={hero} />}
            <Panel id="TaskProgress" >
                <ProgressBar id="TaskProgressBar" value={current / total} >
                    <Label text={`${current}/${total}`} />
                </ProgressBar>
                <Image id="TaskRewardIcon" className={CSSHelper.ClassMaker({ IsPlus: IsBattlePass })} />
                <Label id="TaskReward" text={config.TaskPrize.ItemCount} />
            </Panel>
        </Panel>
    }
}