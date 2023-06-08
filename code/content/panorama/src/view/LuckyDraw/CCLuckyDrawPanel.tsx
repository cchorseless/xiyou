
import React, { createRef } from "react";
import { PathHelper } from "../../helper/PathHelper";

import { TShopSellItem } from "../../../../scripts/tscripts/shared/service/shop/TShopSellItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import { CCCoinAddPanel } from "../Shop/CCCoinAddPanel";
import { CCShopSellDetailDialog } from "../Shop/CCShopSellDetailDialog";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import "./CCLuckyDrawPanel.less";
interface ICCLuckyDrawPanel extends NodePropsData {

}
type BoxIndexs = "10013" | "10014" | "10015" | "10016";
const Boxs: BoxIndexs[] = ["10013", "10014", "10015", "10016",];

const MinBoxTime = 1.5;// 最小开箱时间
export class CCLuckyDrawPanel extends CCPanel<ICCLuckyDrawPanel> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.BagComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.BagComp)
    }

    closeThis() {
        this.close();
        CCMenuNavigation.GetInstance()?.NoSelectAny();
    }

    addMetaStone() {

    }
    bRequesting: boolean = false;
    OpenChest(bid: BoxIndexs, p?: Panel, amount = 1) {
        if (p == null) {
            if (bid == "10013") {
                p = this.Treasure10013.current!;
            }
            else if (bid == "10014") {
                p = this.Treasure10014.current!;
            }
            else if (bid == "10015") {
                p = this.Treasure10015.current!;
            }
            else if (bid == "10016") {
                p = this.Treasure10016.current!;
            }
        }
        if (p == null) {
            return;
        }
        if (this.bRequesting) {
            return;
        }
        const pSelf = this.TreasureMain.current!;

        // // 数量检查
        // if (amount <= 0 || amount > 10 || (amount > (Number(tPlayerBox[sBoxIndex]?.amounts) || 0))) {
        // 	return;
        // }
        let leastTime = Game.Time();
        let ChestSequence = new RunSequentialActions();
        ChestSequence.actions.push(new RunFunctionAction(() => {
            this.bRequesting = true;
        }));
        ChestSequence.actions.push(new RemoveClassAction(p, "TreasureHover"));
        // 正在请求结果
        ChestSequence.actions.push(new AddClassAction(pSelf, "Opening"));
        ChestSequence.actions.push(new RunFunctionAction(() => {
            leastTime = Game.Time() + MinBoxTime;
        }));
        ChestSequence.actions.push(new RemoveClassAction(pSelf, "Opening"));
        ChestSequence.actions.push(new AddClassAction(pSelf, "OpenSuccess"));
        ChestSequence.actions.push(new WaitAction(1.5));
        ChestSequence.actions.push(new RemoveClassAction(pSelf, "OpenSuccess"));
        CCMainPanel.GetInstance()!.addOnlyPanel(CCStorageItemGetDialog, {
            Items: [
                { ItemConfigId: 10013, ItemCount: 20 },
                { ItemConfigId: 10013, ItemCount: 20 },
                { ItemConfigId: 10013, ItemCount: 20 },
                { ItemConfigId: 10013, ItemCount: 20 },
                { ItemConfigId: 10013, ItemCount: 20 },
                { ItemConfigId: 10013, ItemCount: 20 },
                { ItemConfigId: 10013, ItemCount: 20 },
                { ItemConfigId: 10013, ItemCount: 20 },
                { ItemConfigId: 10013, ItemCount: 20 },
            ]
        })

        // ChestSequence.actions.push(new CallBackAction("OpenBox", { bid: bid, amounts: amount }, (data, bTimeOut) => {
        // 	let bSuccess = !bTimeOut && (data.status == 1);
        // 	let ResultSequence = new RunSequentialActions();
        // 	let waitTime = leastTime - Game.Time();
        // 	(waitTime > 0 && !skipAnimation) && ResultSequence.actions.push(new WaitAction(waitTime));
        // 	ResultSequence.actions.push(new RemoveClassAction(pSelf, "Opening"));
        // 	if (bSuccess) {// 成功
        // 		// 获取到结果，过渡动画
        // 		if (!skipAnimation) {
        // 			ResultSequence.actions.push(new AddClassAction(pSelf, "OpenSuccess"));
        // 			ResultSequence.actions.push(new WaitAction(1.5));
        // 			ResultSequence.actions.push(new RemoveClassAction(pSelf, "OpenSuccess"));
        // 		}
        // 		// 展示开箱结果
        // 		ResultSequence.actions.push(new RunFunctionAction(() => {
        // 			// Popups.Show("common_items_add", { title: "TreasureResult", items: data.items });
        // 			// SetbRequesting(false);
        // 		}));
        // 	} else {
        // 		// TODO:展示失败弹窗
        // 	}
        // 	ResultSequence.actions.push(new RunFunctionAction(() => {
        // 		// SetbRequesting(false);
        // 	}));
        // 	RunSingleAction(ResultSequence);
        // }));

        RunSingleAction(ChestSequence);
    }

    Buy(bid: BoxIndexs) {
        const shopunits = TShopSellItem.GetOneByItemConfigId(GGameScene.Local.BelongPlayerid, bid)
        if (shopunits) {
            CCMainPanel.GetInstance()!.addOnlyPanel(CCShopSellDetailDialog, {
                entity: shopunits
            })
        }
    }

    Hover(p: Panel) {
        p.SetHasClass("TreasureHover", true);
    }

    UnHover(p: Panel) {
        p.RemoveClass("TreasureHover");
    }

    TreasureMain = createRef<Panel>();
    Treasure10013 = createRef<Panel>();
    Treasure10014 = createRef<Panel>();
    Treasure10015 = createRef<Panel>();
    Treasure10016 = createRef<Panel>();
    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_LuckyDrawPanel")
        }
        const sName = "draw";
        const DataComp = GGameScene.Local.TCharacter.DataComp!;
        const BagComp = GGameScene.Local.TCharacter.BagComp!;
        const MetaStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.StarStone)
        const sBoxIndex = this.GetState<BoxIndexs>("sBoxIndex") || Boxs[0];
        const countItem = BagComp.getItemCount(sBoxIndex);

        return (
            <Panel id="CC_LuckyDrawPanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PanelBg" fullcontent={true} verticalAlign="top" marginTop="120px" onClose={() => this.closeThis()} >
                    <CCPanel id="PanelHeader" flowChildren="right">
                        <CCImage id="PanelIcon" backgroundImage={PathHelper.getCustomImageUrl("icon/" + sName + ".png")} />
                        <CCLabel id="PanelName" localizedText={"#lang_MenuButton_" + sName} />
                        <CCPanel flowChildren="right" horizontalAlign="right" verticalAlign="center" marginRight={"20px"}>
                            <CCCoinAddPanel cointype={GEEnum.EMoneyType.MetaStone} value={MetaStone} onaddcoin={() => this.addMetaStone()} />
                            <CCCoinAddPanel marginLeft={"20px"} cointype={GEEnum.EMoneyType.StarStone} value={StarStone} />
                        </CCPanel>
                    </CCPanel>
                    <CCPanel id="PanelContent" flowChildren="right">
                        <Panel id="TreasureMain" ref={this.TreasureMain} onactivate={() => { }}>
                            <Panel id="TreasureTitle" hittest={false}>
                                <Label key={sBoxIndex} localizedText={"#StoreItem_" + sBoxIndex} html={true} />
                            </Panel>
                            <Panel id="TreasureDesc" hittest={false}>
                                <Label id="TreasureGuarantees" visible={true} localizedText="#TreasureGuarantees" html={true} dialogVariables={{
                                    current: 5,
                                    max: 10,
                                }} />
                                <Label id="TreasureDescText" key={sBoxIndex} localizedText={"#StoreItemDesc_" + sBoxIndex} html={true} />
                            </Panel>
                            <Panel id={`Treasure${Boxs[0]}`} ref={this.Treasure10013} className={CSSHelper.ClassMaker("Treasure", { VisibleTreasure: sBoxIndex == Boxs[0] })}
                                onactivate={p => this.OpenChest(Boxs[0], p)}
                                onmouseover={p => this.Hover(p)}
                                onmouseout={p => this.UnHover(p)}
                            >
                                <Image id="chain_1_back" className="chain" hittest={false} />
                                <Image id="chest_bottom" className="chest" hittest={false} />
                                <DOTAParticleScenePanel id='chest_light' hittest={false} particleName="particles/ui/treasure/treasure_box_will_open.vpcf" cameraOrigin={[0, 400, 450]} lookAt={[0, 0, 0]} fov={20} particleonly={true} />
                                <Image id="chest_top" className="chest" hittest={false} />
                                <Image id="chain_1_front" className="chain" hittest={false} />
                                <DOTAParticleScenePanel id='FullScreenLight' hittest={false} particleName="particles/ui/treasure/treasure_box_will_open.vpcf" cameraOrigin={[0, 400, 450]} lookAt={[0, 0, 0]} fov={20} particleonly={true} />
                            </Panel>
                            <Panel id={`Treasure${Boxs[1]}`} ref={this.Treasure10014} className={CSSHelper.ClassMaker("Treasure", { VisibleTreasure: sBoxIndex == Boxs[1] })}
                                onactivate={p => this.OpenChest(Boxs[1], p)}
                                onmouseover={p => this.Hover(p)}
                                onmouseout={p => this.UnHover(p)}
                            >
                                <Image id="chain_1_back" className="chain" hittest={false} />
                                <Image id="chain_2_back" className="chain" hittest={false} />
                                <Image id="chest_bottom" className="chest" hittest={false} />
                                <DOTAParticleScenePanel id='chest_light' hittest={false} particleName="particles/ui/treasure/treasure_box_will_open.vpcf" cameraOrigin={[0, 400, 450]} lookAt={[0, 0, 0]} fov={20} particleonly={true} />
                                <DOTAParticleScenePanel id='chest_light2' hittest={false} particleName="particles/ui/treasure/treasure_1_light.vpcf" cameraOrigin={[0, 0, 1000]} lookAt={[0, 0, 0]} fov={20} particleonly={true} />
                                <Image id="chest_top" className="chest" hittest={false} />
                                <Image id="chain_1_front" className="chain" hittest={false} />
                                <Image id="chain_2_front" className="chain" hittest={false} />
                                <DOTAParticleScenePanel id='FullScreenLight' hittest={false} particleName="particles/ui/treasure/treasure_box_will_open.vpcf" cameraOrigin={[0, 400, 450]} lookAt={[0, 0, 0]} fov={20} particleonly={true} />
                            </Panel>
                            <Panel id={`Treasure${Boxs[2]}`} ref={this.Treasure10015} className={CSSHelper.ClassMaker("Treasure", { VisibleTreasure: sBoxIndex == Boxs[2] })}
                                onactivate={p => this.OpenChest(Boxs[2], p)}
                                onmouseover={p => this.Hover(p)}
                                onmouseout={p => this.UnHover(p)}
                            >
                                <Image id="chest_bottom" className="chest" hittest={false} />
                                <Image id="chain_1_back" className="chain" hittest={false} />
                                <Image id="chain_2_back" className="chain" hittest={false} />
                                <Image id="chain_3_back" className="chain" hittest={false} />
                                <GenericPanel id='chest_light' type="DOTAParticleScenePanel" hittest={false}
                                    particleName={"particles/ui/treasure/treasure_box_will_open.vpcf"}
                                    cameraOrigin='0 400 450' lookAt='0 0 0' fov='20'
                                    particleonly="true"
                                />
                                <GenericPanel id='chest_light2' type="DOTAParticleScenePanel" hittest={false}
                                    particleName={"particles/ui/treasure/treasure_3_light.vpcf"}
                                    cameraOrigin='0 700 700' lookAt='0 0 0' fov='20'
                                    particleonly="true"
                                />
                                <Image id="chain_2_front" className="chain" hittest={false} />
                                <Image id="chain_3_front" className="chain" hittest={false} />
                                <Image id="chest_top" className="chest" hittest={false} />
                                <Image id="chain_1_front" className="chain" hittest={false} />
                                <GenericPanel id='FullScreenLight' type="DOTAParticleScenePanel" hittest={false}
                                    particleName={"particles/ui/treasure/treasure_box_will_open.vpcf"}
                                    cameraOrigin='0 400 450' lookAt='0 0 0' fov='20'
                                    particleonly="true"
                                />
                            </Panel>
                            <Panel id={`Treasure${Boxs[3]}`} ref={this.Treasure10016} className={CSSHelper.ClassMaker("Treasure", { VisibleTreasure: sBoxIndex == Boxs[3] })}
                                onactivate={p => this.OpenChest(Boxs[3], p)}
                                onmouseover={p => this.Hover(p)}
                                onmouseout={p => this.UnHover(p)}
                            >
                                <Image id="chest_bottom" className="chest" hittest={false} />
                                <GenericPanel id='chest_light' type="DOTAParticleScenePanel" hittest={false}
                                    particleName={"particles/ui/treasure/treasure_box_will_open.vpcf"}
                                    cameraOrigin='0 400 450' lookAt='0 0 0' fov='20'
                                    particleonly="true"
                                />
                                <Image id="chest_top" className="chest" hittest={false} />
                                <GenericPanel id='FullScreenLight' type="DOTAParticleScenePanel" hittest={false}
                                    particleName={"particles/ui/treasure/treasure_box_will_open.vpcf"}
                                    cameraOrigin='0 400 450' lookAt='0 0 0' fov='20'
                                    particleonly="true"
                                />
                            </Panel>
                            {/* <Panel id={`Treasure${Boxs[4]}`} className={CSSHelper.ClassMaker("Treasure", { VisibleTreasure: sBoxIndex == Boxs[4] })}
                                onactivate={p => this.OpenChest(Boxs[4], p)}
                                onmouseover={p => this.Hover(p)}
                                onmouseout={p => this.UnHover(p)}
                            >
                                <Image id="chest_bottom" className="chest" hittest={false} />
                                <GenericPanel id='chest_light' type="DOTAParticleScenePanel" hittest={false}
                                    particleName={"particles/ui/treasure/treasure_box_will_open.vpcf"}
                                    cameraOrigin='0 400 450' lookAt='0 0 0' fov='20'
                                    particleonly="true"
                                />
                                <Image id="chest_top" className="chest" hittest={false} />
                                <GenericPanel id='FullScreenLight' type="DOTAParticleScenePanel" hittest={false}
                                    particleName={"particles/ui/treasure/treasure_box_will_open.vpcf"}
                                    cameraOrigin='0 400 450' lookAt='0 0 0' fov='20'
                                    particleonly="true"
                                />
                            </Panel> */}

                            <Panel id="WhiteScreen" hittest={false} />

                            <Panel id="TreasureBottomContainer" hittest={false}>
                                <Panel id="TreasureListBG" hittest={false} />
                                <Panel id="TreasureList" hittest={false}>
                                    {Boxs.map((sBoxID, index) => {
                                        const iNum = BagComp.getItemCount(sBoxID);
                                        return (
                                            <RadioButton key={sBoxID} id={`TreasureSelector${index}`} className="TreasureSelector"
                                                selected={sBoxID == sBoxIndex}
                                                onactivate={() => { this.UpdateState({ sBoxIndex: sBoxID }) }}
                                            >
                                                <Image hittest={false} />
                                                <Label text={iNum} visible={iNum > 0} />
                                            </RadioButton>
                                        );
                                    })}
                                </Panel>
                                <CCPanel id="TreasureButton" flowChildren="right" horizontalAlign="center" verticalAlign="bottom" marginBottom={"30px"}>
                                    <CCButton color="Green" type="Tui3" visible={countItem > 0} onactivate={() => { this.OpenChest(sBoxIndex) }}>
                                        <CCLabel type="UnitName" align="center center" text={"打开1个"} />
                                    </CCButton>
                                    <CCButton color="Gold" type="Tui3" visible={countItem > 0} marginLeft={"10px"} onactivate={() => { this.OpenChest(sBoxIndex, undefined, Math.min(10, countItem)) }}>
                                        <CCLabel type="UnitName" align="center center" text={`打开${Math.min(10, countItem)}个`} />
                                    </CCButton>
                                    <CCButton color="Purple" type="Tui3" marginLeft={"10px"} onactivate={() => { this.Buy(sBoxIndex) }}>
                                        <CCLabel type="UnitName" align="center center" text={"商店购买"} />
                                    </CCButton>
                                </CCPanel>

                            </Panel>
                        </Panel>
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    };
}