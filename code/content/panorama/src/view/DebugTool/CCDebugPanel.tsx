import React from "react";
import { GameEnum } from "../../libs/GameEnum";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCDebugTool, CCDebugTool_AbilityPicker, CCDebugTool_Category, CCDebugTool_DemoButton, CCDebugTool_DemoSelectionButton, CCDebugTool_DemoSlider, CCDebugTool_DemoTextEntry, CCDebugTool_DemoToggle, CCDebugTool_HeroPicker, CCDebugTool_ItemPicker, CCDebugTool_SectPicker, CCDebugTool_TextPicker, CCDebugTool_UnitInfo } from "./CCDebugTool";

interface ICCDebugPanel {
    /** 面板的方向 */
    direction: "top" | "right" | "left";
    /** 展开按钮的位置 */
    expandButtonAlign?: "top" | "bottom" | "left" | "right";
}

export class CCDebugPanel extends CCPanel<ICCDebugPanel> {

    render() {
        const abilityList: string[] = [];
        const itemsNames: string[] = [];
        const unitList: string[] = [];
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
            <Panel ref={this.__root__} id="CC_DebugPanel"  {...this.initRootAttrs()} hittest={false}>
                <CCDebugTool
                    direction={this.props.direction}
                    expandButtonAlign={this.props.expandButtonAlign || "left"}
                    containerElement={
                        <>
                            <CCDebugTool_AbilityPicker title="添加技能" eventName="AddAbilityButtonPressed" abilityNames={abilityList} />
                            <CCDebugTool_ItemPicker title="添加物品" eventName="AddItemButtonPressed" itemNames={itemsNames} />
                            <CCDebugTool_HeroPicker title="切换英雄" eventName="SwitchHero" unitNames={unitList} />
                            <CCDebugTool_TextPicker title="创建友方单位" eventName="CreateAllyButtonPressed" itemNames={unitList} />
                            <CCDebugTool_TextPicker title="创建敌方单位" eventName="CreateEnemyButtonPressed" itemNames={unitList} />
                            <CCDebugTool_SectPicker title="添加流派" eventName="AddSectButtonPressed" sheetConfig={{}} abilityNames={sectList} toggleList={sectToggleList} filterFunc={sectFilterFunc} />
                            <CCDebugTool_UnitInfo />
                            <CCDebugTool_TextPicker title="更换英雄" eventName="ChangeHeroButtonPressed" itemNames={commonHeroList} />
                            <CCDebugTool_TextPicker title="选择阶段" eventName="SelectStateButtonPressed" itemNames={stateList} />
                            <CCDebugTool_TextPicker title="跳转到特定区域" eventName="TeleportButtonPressed" itemNames={positionList} />
                        </>
                    }>
                    <CCDebugTool_Category title="游戏" >
                        <CCDebugTool_DemoTextEntry eventName="ChangeHostTimescale" text="主机速度" />
                        <CCDebugTool_DemoButton eventName="NextStateButtonPressed" color="GreenButton" text="下一阶段" />
                        <CCDebugTool_DemoToggle eventName="LockCameraPauseButtonPressed" text="锁定镜头" selected={lock_camera} />
                        <CCDebugTool_DemoToggle eventName="ToggleStatePauseButtonPressed" text="暂停阶段" selected={is_pause} />
                        <CCDebugTool_DemoSelectionButton eventName="SelectStateButtonPressed" text="选择阶段" />
                        <CCDebugTool_DemoButton eventName="ReturnMenuButtonPressed" color="RedButton" text="回到菜单" />
                        <CCDebugTool_DemoSelectionButton eventName="TeleportButtonPressed" text="跳转到特定区域" />
                        <CCDebugTool_DemoButton eventName="StandbyButtonPressed" text="备用按钮" />
                        <CCDebugTool_DemoSlider eventName="CameraDistance" text="镜头高度" min={600} max={1600} defaultValue={1100} onChange={value => GameUI.SetCameraDistance(value)} />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="技能和物品" >
                        <CCDebugTool_DemoSelectionButton eventName="AddItemButtonPressed" text="添加物品" />
                        <CCDebugTool_DemoButton eventName="RemoveInventoryItemsButtonPressed" text="移除物品栏的物品" />
                        <CCDebugTool_DemoSelectionButton eventName="AddAbilityButtonPressed" text="添加技能" />
                        <CCDebugTool_DemoSelectionButton eventName="AddSectButtonPressed" text="添加流派" />
                        <CCDebugTool_DemoButton eventName="AddSelectionSectAbility" text="添加技能选择" />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="英雄" >
                        <CCDebugTool_DemoButton eventName="RefreshButtonPressed" text="刷新状态" />
                        <CCDebugTool_DemoToggle eventName="FreeSpellsButtonPressed" text="无限技能" selected={free_spells} />
                        <CCDebugTool_DemoTextEntry eventName="LevelUpButtonPressed" text="升级" />
                        <CCDebugTool_DemoSelectionButton eventName="ChangeHeroButtonPressed" text="更换英雄" />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="单位" >
                        <CCDebugTool_DemoSelectionButton eventName="SwitchHero" text="切换英雄" />
                        <CCDebugTool_DemoButton eventName="DummyTargetButtonPressed" text="傀儡目标" />
                        <CCDebugTool_DemoButton eventName="RemoveSpawnedUnitsButtonPressed" text="移除目标" />
                        <CCDebugTool_DemoButton eventName="RespawnHeroButtonPressed" text="复活英雄" />
                        <CCDebugTool_DemoSelectionButton eventName="CreateAllyButtonPressed" text="创建友方单位" />
                        <CCDebugTool_DemoSelectionButton eventName="CreateEnemyButtonPressed" text="创建敌方单位" />
                        <CCDebugTool_DemoButton eventName="ControlUnitButtonPressed" text="切换控制权" />
                        <CCDebugTool_DemoSelectionButton eventName="EOM_UnitInfo" text="单位信息面板" />
                    </CCDebugTool_Category>
                    <CCDebugTool_Category title="其他" >
                        <CCDebugTool_DemoButton eventName="SetWinnerButtonPressed" color="RedButton" text="游戏结束" />
                        <CCDebugTool_DemoButton eventName={GameEnum.CustomProtocol.req_DebugRestart} color="RedButton" text="重开游戏" />
                        <CCDebugTool_DemoButton eventName={GameEnum.CustomProtocol.req_DebugClearAll} text="清理日志" />
                        <CCDebugTool_DemoButton eventName={GameEnum.CustomProtocol.req_DebugReload} color="GreenButton" text="重载脚本" />
                        <CCDebugTool_DemoButton eventName="RefreshServicePressed" text="更新后端数据" />
                        <CCDebugTool_DemoToggle eventName="GameTimeFrozenButtonPressed" text="冻结游戏" selected={is_frozen} />
                    </CCDebugTool_Category>
                </CCDebugTool>
            </Panel >
        );
    }
}