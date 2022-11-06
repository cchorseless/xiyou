import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCButton } from "../allCustomUIElement/CCButton/CCButton";
import { CCIconButton } from "../allCustomUIElement/CCButton/CCIconButton";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCKeyBinder, KeyCode } from "../allCustomUIElement/CCKeyBinder/CCKeyBinder";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCDebugTool, CCDebugTool_SelectContainer } from "./CCDebugTool";

/** 设置界面 */
interface ICCDebugTool_Setting {

}
export class CCDebugTool_Setting extends CCPanel<ICCDebugTool_Setting> {

    state = {
        tSettings: {},
        deleteMode: false,
        customKeyBindCount: 0,
        eventNameList: [] as string[],
        buttonTextList: [] as string[],
        buttonTypeList: [] as string[],
    }

    private addKeyBind(self: Panel) {
        let customKeyBindCount = this.GetState<number>("customKeyBindCount");
        this.UpdateState({ customKeyBindCount: customKeyBindCount + 1 });
        this.findHotKeyValidButton(self);
    };
    private findHotKeyValidButton(self: Panel) {
        const root = CCDebugTool.GetInstance()!.__root__.current!;
        let eventList: string[] = [];
        let textList: string[] = [];
        let typeList: string[] = [];
        if (root) {
            const demoButtonList = root.FindChildrenWithClassTraverse("HotKeyValid") as TextButton[];
            demoButtonList.map((element) => {
                eventList.push(element.id);
                textList.push(element.text);
                typeList.push((() => {
                    let result = "";
                    if (element.BHasClass("FireEvent")) {
                        result = "FireEvent";
                    } else if (element.BHasClass("ToggleSelection")) {
                        result = "ToggleSelection";
                    }
                    return result;
                })());
            });
            this.UpdateState({ eventNameList: eventList });
            this.UpdateState({ buttonTextList: textList });
            this.UpdateState({ buttonTypeList: typeList });
        }
    };

    private RegisterDemoButton(key: string, eventName: string, bInit: boolean) {
        if (key && key != undefined) {
            this.RegisterKeyBind(key, () => {
                const CC_DebugTool = $.GetContextPanel().FindChildTraverse("CC_DebugTool");
                if (CC_DebugTool) {
                    const demoButtonList = CC_DebugTool.FindChildrenWithClassTraverse("HotKeyValid") as TextButton[];
                    demoButtonList.map((element) => {
                        if (element.id == eventName.replace("hotkey_", "")) {
                            const index = this.state.eventNameList.indexOf(eventName.replace("hotkey_", ""));
                            if (index > -1) {
                                const buttonType = this.state.buttonTypeList[index];
                                if (buttonType == "FireEvent") {
                                    // FireEvent(eventName.replace("hotkey_", ""));
                                    $.DispatchEvent("Activated", element, "mouse");
                                } else if (buttonType == "ToggleSelection") {
                                    // ToggleSelection(eventName.replace("hotkey_", ""));
                                    $.DispatchEvent("Activated", element, "mouse");
                                }
                            }
                        }
                    });
                }
            });
            if (!bInit) {

            }
            this.UpdateState({ customKeyBindCount: 0 });
        }
    };
    private RegisterKeyBind(key: string, onkeydown?: () => void, onkeyup?: () => void) {
        if (key && key != "") {
            const sCommand = key + (Date.now() / 1000);
            Game.CreateCustomKeyBind(KeyCode[key], "+" + sCommand);
            Game.AddCommand("+" + sCommand, () => {
                if (onkeydown) {
                    onkeydown();
                }
            }, "", 67108864);
            Game.AddCommand("-" + sCommand, () => {
                if (onkeyup) {
                    onkeyup();
                }
            }, "", 67108864);
        }
    }
    private OnLoad(self: Panel) {
        this.findHotKeyValidButton(self);
    };
    render() {
        const customKeyBindCount = this.GetState<number>("customKeyBindCount");
        const defaultSettingList = ["ReloadScriptButtonPressed"];
        const eventNameList = this.GetState<string[]>("eventNameList");
        const buttonTextList = this.GetState<string[]>("buttonTextList");
        const buttonTypeList = this.GetState<string[]>("buttonTypeList");
        const deleteMode = this.GetState<boolean>("deleteMode");
        const tSettings = this.GetState<{ [k: string]: string }>("tSettings");
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__}  {...this.initRootAttrs()} hittest={false}>
                <CCDebugTool_SelectContainer
                    eventName={"CC_DebugTool_Setting"}
                    title={"调试工具设置"}
                    width="500px"
                    height="700px"
                    hasRawMode={false}
                    hasToggleSize={false}
                    hasFilter={false}
                    DomainPanel={this}

                >
                    <CCPanel id="CC_DebugTool_Setting" className="CC_DebugTool_Setting" flowChildren="down" width="100%" height="100%">
                        {/* 面板热键 */}
                        <CCPanel flowChildren="down" width="100%" marginTop="12px" onload={self => this.OnLoad(self)}>
                            <Label text="面板热键" className="SectionHeader" />
                            <Panel className="SectionHeaderLine" />
                            {/* 默认设置 */}
                            {eventNameList.length > 0 && defaultSettingList.map((eventName, index) => {
                                return <CCKeyBinder key={"defaultSettingList" + eventName + index} text={buttonTextList[eventNameList.indexOf(eventName)]} initKey={tSettings["hotkey_" + eventName]} callback={(key) => this.RegisterDemoButton(key, "hotkey_" + eventName, false)} />;
                            })}
                            {/* 已保存的自定义热键设置 */}
                            {buttonTextList.length > 0 && Object.keys(tSettings).map((eventName, index) => {
                                if (eventName.indexOf("hotkey_") != -1 && defaultSettingList.indexOf(eventName.replace("hotkey_", "")) == -1) {
                                    return (
                                        <CCPanel width="100%" height="36px" key={"saved" + eventName + index} flowChildren="right" className={CSSHelper.ClassMaker("CanRemoveKeyBind", { deleteMode: deleteMode })}>
                                            <CCIconButton verticalAlign="center" icon={<CCImage src="s2r://panorama/images/control_icons/x_close_png.vtex" />} onactivate={self => { }} />
                                            <CCKeyBinder text={buttonTextList} initDropIndex={eventNameList.indexOf(eventName.replace("hotkey_", "")) + 1} initKey={tSettings[eventName]} callback={(key, bInit, dropIndex) => {
                                                if (eventNameList[dropIndex]) {
                                                    this.RegisterDemoButton(key, "hotkey_" + eventNameList[dropIndex], bInit);
                                                }
                                            }} />
                                        </CCPanel>
                                    );
                                }
                            })}
                            {/* 添加热键 */}
                            {[...Array(customKeyBindCount)].map((_, index) => {
                                if (buttonTextList.length > 0) {
                                    return (
                                        <CCPanel width="100%" height="36px" key={index + ""} flowChildren="right" className={CSSHelper.ClassMaker("CanRemoveKeyBind", { deleteMode: deleteMode })}>
                                            <CCIconButton verticalAlign="center" icon={<CCImage src="s2r://panorama/images/control_icons/x_close_png.vtex" />} onactivate={self => this.UpdateState({ customKeyBindCount: customKeyBindCount - 1 })} />
                                            <CCKeyBinder text={buttonTextList} callback={(key, bInit, dropIndex) => {
                                                if (eventNameList[dropIndex]) {
                                                    if (key && key != "") {
                                                        this.RegisterDemoButton(key, "hotkey_" + eventNameList[dropIndex], bInit);
                                                    }
                                                }
                                            }} />
                                        </CCPanel>
                                    );
                                }
                            })}
                            <CCPanel width="100%">
                                <CCButton margin="4px 8px" className="AddNewKeyBind" type="Text" text="+ 按键绑定" onactivate={self => this.addKeyBind(self)} />
                                {!deleteMode &&
                                    <CCButton margin="4px 8px" className="AddNewKeyBind" horizontalAlign="right" type="Text" text="- 删除绑定" onactivate={self => this.UpdateState({ deleteMode: true })} />
                                }
                                {deleteMode &&
                                    <CCButton margin="4px 8px" className="AddNewKeyBind" horizontalAlign="right" type="Text" text="取消" onactivate={self => this.UpdateState({ deleteMode: false })} />
                                }
                            </CCPanel>
                        </CCPanel>
                        <CCButton verticalAlign="bottom" type="Outline" color="Blue" text="清空设置" onactivate={self => { this.UpdateState({ customKeyBindCount: 0 }); }} />
                    </CCPanel>
                </CCDebugTool_SelectContainer>
            </Panel>
        )
    }
}