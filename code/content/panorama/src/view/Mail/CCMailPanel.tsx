
import React from "react";
import { PathHelper } from "../../helper/PathHelper";

import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TMail } from "../../../../scripts/tscripts/shared/service/mail/TMail";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../AllUIElement/CCTable/CCVerticalTable";
import { CCCoinAddPanel } from "../Shop/CCCoinAddPanel";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import "./CCMailPanel.less";
import { CCMailSingleDataDialog } from "./CCMailSingleDataDialog";
import { CCMailSingleDataItem } from "./CCMailSingleDataItem";
interface ICCMailPanel extends NodePropsData {

}

export class CCMailPanel extends CCPanel<ICCMailPanel> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.MailComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.MailComp)
    }

    closeThis() {
        this.close();
        CCMenuNavigation.GetInstance()?.NoSelectAny();
    }

    addMetaStone() {

    }
    onbtnAlldelete_click() {
        const Mail = this.props.mail;
        if (Mail == null) { return }
        NetHelper.SendToCSharp(GameProtocol.Protocol.Handle_CharacterMail, {
            HandleType: GameProtocol.EMailHandleType.MailDelete,
            IsOneKey: false,
            MailId: Mail.Id,
        })
    }

    onbtnAllgetprize_click() {
        const MailComp = (GGameScene.Local.TCharacter.MailComp!);
        if (MailComp == null) { return }
        NetHelper.SendToCSharp(GameProtocol.Protocol.Handle_CharacterMail, {
            HandleType: GameProtocol.EMailHandleType.MailGetItem,
            IsOneKey: true,
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state) {
                const items = JSON.parse(e.message!) as IFItemInfo[];
                CCStorageItemGetDialog.showItemGetDialog({
                    Items: items
                })
            }
            this.UpdateSelf();
        }))
    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_MailPanel")
        }
        const sName = "mail";
        const DataComp = (GGameScene.Local.TCharacter.DataComp!);
        const MailComp = (GGameScene.Local.TCharacter.MailComp!);
        const MetaStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.StarStone)
        const selectindex = this.GetState<number>("selectindex") || 0;
        const allMail = MailComp.GetAllMail();
        const allsystem = allMail.filter(v => { return v.From + "" == "1" })
        const allperson = allMail.filter(v => { return v.From + "" == "2" })
        const curentity0 = this.GetState<TMail>("curentity0") || allsystem[0];
        const curentity1 = this.GetState<TMail>("curentity1") || allperson[0];
        let canGetitem = false;
        for (let k of allMail) {
            if (k.CanGetItem()) {
                canGetitem = true;
                break;
            }
        }
        return (
            <Panel id="CC_MailPanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
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
                        <CCPanel flowChildren="down" height="100%">
                            <CCVerticalTable marginTop={"20px"} list={[
                                "系统",
                                "个人",
                            ]}
                                defaultSelected={0}
                                onChange={(index: number, text: string) => {
                                    this.UpdateState({ selectindex: index })
                                }} />
                            <CCPanel flowChildren="down" verticalAlign="bottom" marginBottom={"30px"}>
                                <CCLabel type="UnitName" text={`邮件上限：${allMail.length}/${MailComp.MaxSize}`} horizontalAlign="center" />
                                {/* <CCButton color="Purple" type="Tui3" marginTop={"10px"} onactivate={() => { this.onbtnAlldelete_click() }}>
                                    <CCLabel type="UnitName" align="center center" text={"全部删除"} />
                                </CCButton> */}

                                <CCButton enabled={canGetitem} color="Gold" type="Tui3" marginTop={"10px"} onactivate={() => { this.onbtnAllgetprize_click() }}>
                                    <CCLabel type="UnitName" align="center center" text={"全部领取"} />
                                </CCButton>

                            </CCPanel>
                        </CCPanel>

                        {
                            <CCPanel id="PanelContentBg"  >
                                <CCPanel opacity={selectindex == 0 ? "1" : "0"} flowChildren="right" hittest={false} width="100%" height="100%">
                                    {

                                        allsystem.length == 0 ? <CCLabel text={"暂无邮件"} type="UnitName" align="center center" />
                                            : <>
                                                <CCPanel flowChildren="down" width="680px" height="100%" scroll={"y"}>
                                                    {
                                                        allsystem.map((v, index) => {
                                                            return <CCMailSingleDataItem key={index + ""} mail={v} ItemSelected={v == curentity0} marginTop={"3px"} onactivate={() => {
                                                                this.UpdateState({ curentity0: v })
                                                            }} />
                                                        })
                                                    }

                                                </CCPanel>
                                                <CCPanel flowChildren="down" width="400px" height="100%">
                                                    {
                                                        curentity0 && <CCPanel flowChildren="down" width="400px" height="100%">
                                                            <CCMailSingleDataDialog mail={curentity0} />
                                                        </CCPanel>
                                                    }
                                                </CCPanel>
                                            </>

                                    }

                                </CCPanel>
                                <CCPanel opacity={selectindex == 1 ? "1" : "0"} flowChildren="right" hittest={false} width="100%" height="100%">
                                    {
                                        allperson.length == 0 ? <CCLabel text={"暂无邮件"} type="UnitName" align="center center" />
                                            : <>
                                                <CCPanel flowChildren="down" width="680px" height="100%" scroll={"y"}>
                                                    {

                                                        allperson.map((v, index) => {
                                                            return <CCMailSingleDataItem key={index + ""} mail={v} ItemSelected={v == curentity1} marginTop={"3px"} onactivate={() => {
                                                                this.UpdateState({ curentity1: v })
                                                            }} />
                                                        })
                                                    }
                                                </CCPanel>
                                                <CCPanel flowChildren="down" width="400px" height="100%">
                                                    {
                                                        curentity1 && <CCPanel flowChildren="down" width="400px" height="100%">
                                                            <CCMailSingleDataDialog mail={curentity1} />
                                                        </CCPanel>
                                                    }
                                                </CCPanel>
                                            </>
                                    }


                                </CCPanel>
                            </CCPanel>

                        }
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    };
}