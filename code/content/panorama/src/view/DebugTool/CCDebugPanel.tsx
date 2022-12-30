import React from "react";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { GameEnum } from "../../../../scripts/tscripts/shared/GameEnum";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool, CCDebugTool_Category, CCDebugTool_DemoButton, CCDebugTool_DemoSelectionButton, CCDebugTool_DemoSlider, CCDebugTool_DemoTextEntry, CCDebugTool_DemoToggle } from "./CCDebugTool";
import { CCDebugTool_AbilityPicker } from "./CCDebugTool_AbilityPicker";
import { CCDebugTool_HeroPicker } from "./CCDebugTool_HeroPicker";
import { CCDebugTool_ItemPicker } from "./CCDebugTool_ItemPicker";
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
        this.addOnlyOneNodeChild(this.NODENAME.__root__, nodeType, nodeData);
        this.updateSelf();
    }


    render() {
        const abilityList: string[] = [];
        const itemsNames: string[] = [];
        const unitList: string[] = ["111", "222"];
        const commonHeroList: string[] = [];
        const stateList: string[] = [];
        const sectList: string[] = [];
        const sectToggleList: { [k: string]: any } = {};
        const sectFilterFunc = (...args: any[]) => { return true };
        const positionList: string[] = [];
        const lock_camera: boolean = true;
        const is_pause: boolean = true;
        const free_spells: boolean = true;
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
                        <CCDebugTool_DemoTextEntry eventName="ChangeHostTimescale" localtext="主机速度" />
                        <CCDebugTool_DemoButton eventName="NextStateButtonPressed" btncolor="GreenButton" localtext="下一阶段" />
                        <CCDebugTool_DemoToggle eventName="LockCameraPauseButtonPressed" localtext="锁定镜头" selected={lock_camera} />
                        <CCDebugTool_DemoToggle eventName="ToggleStatePauseButtonPressed" localtext="暂停阶段" selected={is_pause} />
                        <CCDebugTool_DemoSelectionButton eventName="SelectStateButtonPressed" localtext="选择阶段" />
                        <CCDebugTool_DemoButton eventName="ReturnMenuButtonPressed" btncolor="RedButton" localtext="回到菜单" />
                        <CCDebugTool_DemoSelectionButton eventName="TeleportButtonPressed" localtext="跳转到特定区域" />
                        <CCDebugTool_DemoButton eventName="StandbyButtonPressed" localtext="备用按钮" />
                        <CCDebugTool_DemoSlider eventName="CameraDistance" titletext="镜头高度" min={600} max={1600} defaultValue={1100} onChange={value => GameUI.SetCameraDistance(value)} />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="技能和物品" >
                        <CCDebugTool_DemoSelectionButton eventName="AddItemButtonPressed" localtext="添加物品" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_ItemPicker, { title: "添加物品", itemNames: itemsNames }) }} />
                        <CCDebugTool_DemoButton eventName="RemoveInventoryItemsButtonPressed" localtext="移除物品栏的物品" />
                        <CCDebugTool_DemoSelectionButton eventName="AddAbilityButtonPressed" localtext="添加技能" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_AbilityPicker, { title: "添加技能", abilityNames: abilityList }) }} />
                        <CCDebugTool_DemoSelectionButton eventName="AddSectButtonPressed" localtext="添加流派" />
                        <CCDebugTool_DemoButton eventName="AddSelectionSectAbility" localtext="添加技能选择" />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="英雄" >
                        <CCDebugTool_DemoButton eventName="RefreshButtonPressed" localtext="刷新状态" />
                        <CCDebugTool_DemoToggle eventName="FreeSpellsButtonPressed" localtext="无限技能" selected={free_spells} />
                        <CCDebugTool_DemoTextEntry eventName="LevelUpButtonPressed" localtext="升级" />
                        <CCDebugTool_DemoSelectionButton eventName="ChangeHeroButtonPressed" localtext="更换英雄" />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="单位" >
                        <CCDebugTool_DemoSelectionButton eventName="SwitchHero" localtext="切换英雄" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_HeroPicker, { title: "切换英雄", unitNames: unitList }) }} />
                        <CCDebugTool_DemoButton eventName="DummyTargetButtonPressed" localtext="傀儡目标" />
                        <CCDebugTool_DemoButton eventName="RemoveSpawnedUnitsButtonPressed" localtext="移除目标" />
                        <CCDebugTool_DemoButton eventName="RespawnHeroButtonPressed" localtext="复活英雄" />
                        <CCDebugTool_DemoSelectionButton eventName="CreateAllyButtonPressed" localtext="创建友方单位" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_TextPicker, { title: "创建友方单位", itemNames: unitList }) }} />
                        <CCDebugTool_DemoSelectionButton eventName="CreateEnemyButtonPressed" localtext="创建敌方单位" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_TextPicker, { title: "创建敌方单位", itemNames: unitList }) }} />
                        <CCDebugTool_DemoButton eventName="ControlUnitButtonPressed" localtext="切换控制权" />
                        <CCDebugTool_DemoSelectionButton eventName="CC_DebugTool_UnitInfo" localtext="单位信息面板" onactivate={() => { this.addOnlyDebugDialog(CCDebugTool_UnitInfo) }} />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="其他" >
                        <CCDebugTool_DemoButton eventName="SetWinnerButtonPressed" btncolor="RedButton" localtext="游戏结束" />
                        <CCDebugTool_DemoButton eventName={GameEnum.CustomProtocol.req_DebugRestart} btncolor="RedButton" localtext="重开游戏" />
                        <CCDebugTool_DemoButton eventName={GameEnum.CustomProtocol.req_DebugClearAll} localtext="清理日志" />
                        <CCDebugTool_DemoButton eventName={GameEnum.CustomProtocol.req_DebugReload} btncolor="GreenButton" localtext="重载脚本" />
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