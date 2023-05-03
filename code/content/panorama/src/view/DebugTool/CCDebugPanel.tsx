import React from "react";
import { CombinationConfig } from "../../../../scripts/tscripts/shared/CombinationConfig";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { KVHelper } from "../../helper/KVHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool, CCDebugTool_Category, CCDebugTool_DemoButton, CCDebugTool_DemoSelectionButton, CCDebugTool_DemoSlider, CCDebugTool_DemoTextEntry, CCDebugTool_DemoToggle } from "./CCDebugTool";
import { CCDebugTool_AbilityPicker } from "./CCDebugTool_AbilityPicker";
import { CCDebugTool_EnemyPicker } from "./CCDebugTool_EnemyPicker";
import { CCDebugTool_HeroPicker } from "./CCDebugTool_HeroPicker";
import { CCDebugTool_ItemPicker } from "./CCDebugTool_ItemPicker";
import { CCDebugTool_NetTableInfo } from "./CCDebugTool_NetTableInfo";
import { CCDebugTool_SectPicker } from "./CCDebugTool_SectPicker";
import { CCDebugTool_Setting } from "./CCDebugTool_Setting";
import { CCDebugTool_TextPicker } from "./CCDebugTool_TextPicker";
import { CCDebugTool_UnitInfo } from "./CCDebugTool_UnitInfo";

interface ICCDebugPanel {
    /** 面板的方向 */
    direction?: "top" | "right" | "left";
}

export class CCDebugPanel extends CCPanel<ICCDebugPanel> {


    addOnlyDebugDialog<M extends NodePropsData, T extends typeof CCPanel<M>>(nodeType: T, nodeData: M | any = {}) {
        Object.assign(nodeData, { align: "center center" });
        this.addOnlyOneNodeChild(this.NODENAME.__root__, nodeType, nodeData, true);
        this.UpdateSelf();
    }


    render() {
        const itemsNames: string[] = Object.keys(KVHelper.KVItems()).filter((s) => { return KVHelper.KVData().dota_items[s] == null });;
        itemsNames.sort();
        const abilitiesNames: string[] = Object.keys(KVHelper.KVAbilitys()).filter((s) => { return KVHelper.KVData().dota_abilities[s] == null && !s.includes("special_bonus") });;
        const dotaitemsNames: string[] = Object.keys(KVHelper.KVData().dota_items);
        const dotaabilitiesNames: string[] = Object.keys(KVHelper.KVData().dota_abilities);
        const heroList: string[] = Object.keys(KVHelper.KVData().building_unit_tower);
        const enemylist: string[] = Object.keys(KVHelper.KVData().building_unit_enemy);;
        const stateList: string[] = [];
        const sectList: string[] = [...CombinationConfig.ESectNameList];
        const sectToggleList: { [k: string]: any } = {};
        const sectFilterFunc = (...args: any[]) => { return true };
        const positionList: string[] = [];
        const lock_camera: boolean = true;
        const is_pause: boolean = false;
        const stop_ping: boolean = false;
        const free_spells: boolean = false;
        const is_frozen: boolean = true;
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DebugPanel" className="CC_root"  {...this.initRootAttrs()} hittest={false}>
                <CCDebugTool
                    direction={this.props.direction || "top"}
                    onSetting={() => { this.addOnlyDebugDialog(CCDebugTool_Setting) }}
                    onRefresh={() => { }}
                >
                    <CCDebugTool_Category title="游戏" >
                        <CCDebugTool_DemoTextEntry width="50%" eventName={GameProtocol.Protocol.req_DebugChangeHostTimescale} localtext="主机速度" />
                        <CCDebugTool_DemoTextEntry width="50%" eventName={GameProtocol.Protocol.req_DebugJumpToRound} localtext="跳转至回合" />
                        <CCDebugTool_DemoToggle eventName={GameProtocol.Protocol.req_DebugChangeServerPing} localtext="暂停Ping" selected={stop_ping} />
                        {/* <CCDebugTool_DemoToggle eventName="LockCameraPauseButtonPressed" localtext="锁定镜头" selected={lock_camera} /> */}
                        <CCDebugTool_DemoToggle eventName={GameProtocol.Protocol.req_DebugPauseRoundStage} localtext="暂停阶段" selected={is_pause} />
                        <CCDebugTool_DemoButton eventName={GameProtocol.Protocol.req_DebugNextRoundStage} localtext="下一阶段" />
                        <CCDebugTool_DemoButton eventName="ReturnMenuButtonPressed" btncolor="RedButton" localtext="回到菜单" />
                        <CCDebugTool_DemoSelectionButton eventName="TeleportButtonPressed" localtext="跳转到特定区域" />
                        <CCDebugTool_DemoButton eventName="StandbyButtonPressed" localtext="备用按钮" />
                        <CCDebugTool_DemoSlider eventName="CameraDistance" titletext="镜头高度" min={1000} max={2000} defaultValue={1600} onChange={value => GameUI.SetCameraDistance(value)} />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="网表和实体" >
                        <CCDebugTool_DemoSelectionButton eventName="CreateAllyButtonPressed" localtext="todo" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_TextPicker, { title: "创建友方单位", itemNames: heroList }) }} />
                        <CCDebugTool_DemoSelectionButton eventName="CC_DebugTool_UnitInfo" localtext="网表信息面板" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_NetTableInfo) }} />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="技能和物品" >
                        <CCDebugTool_DemoSelectionButton eventName="AddItemButtonPressed" localtext="添加Dota物品" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_ItemPicker, { title: "添加Dota物品", itemNames: dotaitemsNames }) }} />
                        <CCDebugTool_DemoSelectionButton eventName="AddItemButtonPressed" localtext="添加Dota技能" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_AbilityPicker, { title: "添加Dota技能", abilityNames: dotaabilitiesNames }) }} />
                        <CCDebugTool_DemoSelectionButton eventName="AddItemButtonPressed" localtext="添加物品" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_ItemPicker, { title: "添加物品", itemNames: itemsNames }) }} />
                        <CCDebugTool_DemoButton eventName="RemoveInventoryItemsButtonPressed" localtext="移除物品栏的物品" />
                        <CCDebugTool_DemoSelectionButton eventName="AddAbilityButtonPressed" localtext="添加技能" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_AbilityPicker, { title: "添加技能", abilityNames: abilitiesNames }) }} />
                        <CCDebugTool_DemoSelectionButton eventName="AddSectButtonPressed" localtext="添加流派" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_SectPicker, { title: "添加流派", abilityNames: sectList }) }} />
                        <CCDebugTool_DemoButton eventName="AddSelectionSectAbility" localtext="添加神器选择" />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="英雄" >
                        <CCDebugTool_DemoButton eventName={GameProtocol.Protocol.req_DebugAddGold} localtext="添加金币" />
                        <CCDebugTool_DemoToggle eventName={GameProtocol.Protocol.req_DebugWTF} localtext="无限技能" selected={free_spells} />
                        <CCDebugTool_DemoTextEntry width="50%" eventName="LevelUpButtonPressed" localtext="升级" />
                        <CCDebugTool_DemoSelectionButton eventName="ChangeHeroButtonPressed" localtext="更换英雄" />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="单位" >
                        <CCDebugTool_DemoSelectionButton eventName="SwitchHero" localtext="创建友方单位" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_HeroPicker, { title: "创建友方单位", unitNames: heroList }) }} />
                        <CCDebugTool_DemoButton eventName={GameProtocol.Protocol.req_DebugMakeChessAttack} data={() => Players.GetLocalPlayerPortraitUnit()} localtext="切换攻击状态" />
                        <CCDebugTool_DemoSelectionButton eventName="CreateEnemyButtonPressed" localtext="创建敌方单位" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_EnemyPicker, { title: "创建敌方单位", unitNames: enemylist }) }} />
                        <CCDebugTool_DemoButton eventName={GameProtocol.Protocol.req_DebugRemoveEnemy} localtext="移除敌方单位" />
                        <CCDebugTool_DemoButton eventName={GameProtocol.Protocol.req_DebugAddDummyTarget} localtext="添加傀儡" />
                        <CCDebugTool_DemoButton eventName={GameProtocol.Protocol.req_DebugRemoveDummyTarget} localtext="移除傀儡" />
                        <CCDebugTool_DemoSelectionButton eventName="CC_DebugTool_UnitInfo" localtext="单位信息面板" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_UnitInfo) }} />
                    </CCDebugTool_Category>

                    <CCDebugTool_Category title="其他" >
                        <CCDebugTool_DemoButton eventName="SetWinnerButtonPressed" btncolor="RedButton" localtext="游戏结束" />
                        <CCDebugTool_DemoButton eventName={GameProtocol.Protocol.req_DebugRestart} btncolor="RedButton" localtext="重开游戏" />
                        <CCDebugTool_DemoButton eventName={GameProtocol.Protocol.req_DebugClearAll} localtext="清理日志" />
                        <CCDebugTool_DemoButton eventName={GameProtocol.Protocol.req_DebugReload} btncolor="GreenButton" localtext="重载脚本" />
                        <CCDebugTool_DemoButton eventName="RefreshServicePressed" localtext="更新后端数据" />
                        <CCDebugTool_DemoToggle eventName="GameTimeFrozenButtonPressed" localtext="冻结游戏" selected={is_frozen} />
                    </CCDebugTool_Category>
                </CCDebugTool>
                {this.props.children}
                {this.__root___childs}
            </Panel >
        );
    }
}