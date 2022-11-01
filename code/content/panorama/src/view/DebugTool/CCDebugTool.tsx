import { useNetTableKey } from "@demon673/react-panorama";
import React, { Children, ReactElement, ReactNode, useCallback, useState } from "react";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCIconButton } from "../allCustomUIElement/CCButton/CCIconButton";
import { CCDropDownButton } from "../allCustomUIElement/CCButton/CCDropDownButton";
import { CCIcon_Arrow } from "../allCustomUIElement/CCIcons/CCIcon_Arrow";
import { CCIcon_Refresh } from "../allCustomUIElement/CCIcons/CCIcon_Refresh";
import { CCIcon_Gear } from "../allCustomUIElement/CCIcons/CCIcon_Gear";
import { CCSwitch } from "../allCustomUIElement/CCSwitch/CCSwitch";
import { CCIcon_XClose } from "../allCustomUIElement/CCIcons/CCIcon_XClose";
import { CCIcon_Lock } from "../allCustomUIElement/CCIcons/CCIcon_Lock";
import { CCBaseButton, CCButton } from "../allCustomUIElement/CCButton/CCButton";
import "./CCDebugTool.less";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { TimerHelper } from "../../helper/TimerHelper";
import { FuncHelper } from "../../helper/FuncHelper";

interface IDebugToolPanel {
	/** 面板的方向 */
	direction: "top" | "right" | "left";
	/** 展开按钮的位置 */
	expandButtonAlign?: "top" | "bottom" | "left" | "right";
	/** 子元素 */
	containerElement?: ReactNode;
}

export class CCDebugToolPanel extends CCPanel<IDebugToolPanel> {
	defaultClass = () => { return "CC_DebugTool"; };
	state = {
		Minimized: true,
		bManualShowPanel: false,
		direction: this.props.direction,
		config: {}
	};
	expandButtonStyle = {
		verticalAlign: (this.props.expandButtonAlign == "top" || this.props.expandButtonAlign == "bottom") ? this.props.expandButtonAlign : undefined,
		horizontalAlign: (this.props.expandButtonAlign == "left" || this.props.expandButtonAlign == "right") ? this.props.expandButtonAlign : undefined,
	};

	checkAltDown = (panel: Panel) => {
		if (!this.state.bManualShowPanel) {
			if (this.state.Minimized == GameUI.IsAltDown()) {
				this.setState({ Minimized: !GameUI.IsAltDown() });
			}
		} else {
			if (GameUI.IsAltDown()) {
				this.setState({ bManualShowPanel: false });
			}
		}
		$.Schedule(Game.GetGameFrameTime(), () => {
			if (panel.IsValid()) {
				this.checkAltDown(panel);
			}
		});
	};
	static defaultProps = {
		direction: "left"
	};
	render() {
		return (
			<Panel id="CC_DebugTool" hittest={false} {...this.initRootAttrs()}>
				{this.props.containerElement}
				<CCDebugTool_Setting />
				<Panel id="CC_DebugToolControlPanel" onload={self => this.checkAltDown(self)} className={CSSHelper.ClassMaker("ControlPanel", { Minimized: this.state.Minimized, DirectionLeft: this.state.direction == "left", DirectionRight: this.state.direction == "right", DirectionTop: this.state.direction == "top", })}>
					<Panel className="ControlPanelContainer">
						<Panel className="ControlPanelTitle">
							<Panel className="CategoryHeaderFilledFront" />
							<Label className="CategoryHeader" localizedText={"工具"} />
							<Panel className="CategoryHeaderFilledNext" />
							<CCIconButton className="CategoryHeaderIcon" tooltip={"切换布局"} verticalAlign="center" width="20px" icon={<CCIcon_Arrow type="Popout" />} >
								<CCDropDownButton id="ToggleSize" onChange={(index, item) => { this.setState({ direction: item.id }); SaveConfig({ direction: item.id }); }}>
									<Label text={"左侧"} id="left" />
									<Label text={"上方"} id="top" />
									<Label text={"右侧"} id="right" />
								</CCDropDownButton>
							</CCIconButton>
							<CCIconButton className="CategoryHeaderIcon" tooltip={"重载数据"} verticalAlign="center" width="20px" icon={<CCIcon_Refresh />} onactivate={self => GameEvents.SendEventClientSide("custom_refresh_order", { name: "RefreshContainer" })} />
							<CCIconButton className="CategoryHeaderIcon" tooltip={"设置"} verticalAlign="center" width="20px" icon={<CCIcon_Gear />} onactivate={self => ToggleSelection("CC_DebugTool_Setting")} />
						</Panel>
						{this.props.children}
					</Panel>
					<Panel id="ExpandButtonContainer" style={this.expandButtonStyle} >
						<Button id="ExpandButton" onactivate={self => {
							this.setState({ bManualShowPanel: this.state.Minimized, Minimized: !this.state.Minimized });
						}} >
							<CCIcon_Arrow type="Right" width="8px" height="14px" align="center center" rotate={this.state.Minimized ? (this.state.direction == "top" ? 90 : 0) : (this.state.direction == "top" ? 270 : 180)} />
						</Button>
					</Panel>
				</Panel>
			</Panel>
		);
	}
}

interface IDebugTool_Category {
	/** 标题 */
	title: string,
	/** 自动排版根据col数进行分列排版，默认为2 */
	col: number,
	/** 是否使用手动排版，默认为false */
	layout: boolean,
}
// 分类
export class CCDebugTool_Category extends CCPanel<IDebugTool_Category> {
	defaultClass = () => { return CSSHelper.ClassMaker("Category", { SingleCol: this.state.col <= 1 }); };
	state = { col: this.props.col };
	// listener: NetTableListenerID | undefined;
	// componentDidMount() {
	// 	const config = CustomNetTables.GetTableValue("common", "demo_settings")?.tool_setting[Players.GetLocalPlayer()] ?? {};
	// 	if (config["ctg_col_" + this.props.title] != undefined && config["ctg_col_" + this.props.title] != this.state.col) {
	// 		this.setState({ col: config["ctg_col_" + this.props.title] });
	// 	}
	// 	this.listener = CustomNetTables.SubscribeNetTableListener("common", (_, eventKey, eventValue) => {
	// 		if ("demo_settings" === eventKey) {
	// 			// @ts-ignore
	// 			let config = eventValue.tool_setting[Players.GetLocalPlayer()];
	// 			if (config["ctg_col_" + this.props.title] != undefined && config["ctg_col_" + this.props.title] != this.state.col) {
	// 				this.setState({ col: config["ctg_col_" + this.props.title] });
	// 			}
	// 		}
	// 	});
	// }

	// componentWillUnmount(): void {
	// 	if (this.listener) {
	// 		CustomNetTables.UnsubscribeNetTableListener(this.listener);
	// 	}
	// }
	static defaultProps = {
		col: 2,
		layout: false
	};
	render() {
		const { title, layout, children } = this.props;
		const { col } = this.state;
		return (
			<Panel  {...this.initRootAttrs()}>
				<Panel className="CategoryHeader">
					<Label className="CategoryHeaderLabel" localizedText={title} />
					<Panel style={{ width: "fill-parent-flow(1)" }} />
					<CCSwitch horizontalAlign="right" checkedChildren="1列" unCheckedChildren="2列" checked={col == 1 ? true : false} onChange={(checked) => { SaveConfig({ ["ctg_col_" + this.props.title]: checked ? 1 : 2 }); this.setState({ col: checked ? 1 : 2 }); }} />
				</Panel>
				<Panel className="CategoryButtonContainer">
					{!layout && [...Array(Math.ceil(Children.count(children) / col))].map((_, rowIndex) => {
						return (
							<Panel key={rowIndex} className="Row">
								{Children.map(children, (child, childIndex) => {
									if (childIndex >= rowIndex * col && childIndex < rowIndex * col + col) {
										return child;
									}
								})}
							</Panel>
						);
					})}
					{layout &&
						children
					}
				</Panel>
			</Panel>
		);
	}
}

function FireEvent(sEventName: string, str: string = "") {
	if (!(Players.GetLocalPlayer() == -1 || Players.IsSpectator(Players.GetLocalPlayer()) || Players.IsLocalPlayerLiveSpectating())) {
		GameEvents.SendCustomGameEventToServer("DemoEvent", {
			event_name: sEventName,
			player_id: Players.GetLocalPlayer(),
			unit: Players.GetLocalPlayerPortraitUnit(),
			position: GameUI.GetCameraLookAtPosition(),
			str: str,
		});
	}
}

function SaveConfig(config: Table) {
	GameEvents.SendCustomGameEventToServer("DemoEvent", {
		event_name: "SaveConfig",
		player_id: Players.GetLocalPlayer(),
		unit: Players.GetLocalPlayerPortraitUnit(),
		position: GameUI.GetCameraLookAtPosition(),
		str: JSON.stringify(config),
	});
};

/** 切换面板 */
function ToggleSelection(sPickerName: string) {
	let aPickerList = $.GetContextPanel().FindChildrenWithClassTraverse("SelectionContainer");
	if (aPickerList !== null) {
		for (const iterator of aPickerList) {
			if (iterator.id == sPickerName) {
				iterator.ToggleClass("Show");
			}
			else if (iterator.BHasClass("LockWindow") == false) {
				iterator.SetHasClass("Show", false);
			}
		}
	}
}

// 普通按钮
export function DemoButton({ eventName, str = "", text, onactivate = () => FireEvent(eventName, str), color }: { eventName: string, str?: string, text: string, onactivate?: () => void, color?: "RedButton" | "GreenButton" | "QuitButton"; }) {
	return (
		<TextButton id={eventName} className={CSSHelper.ClassMaker("DemoButton", "HotKeyValid", "FireEvent", color)} localizedText={text} onactivate={onactivate} />
	);
}
// 切换按钮
export function DemoToggle({ eventName, str = "", selected = false, text }: { eventName: string, str?: string, selected?: boolean, text: string; }) {
	return (
		<ToggleButton id={eventName} className="HotKeyValid FireEvent" selected={selected} onactivate={self => { FireEvent(eventName, self.IsSelected() ? "1" : "0"); }} localizedText={text} />
	);
}
// 切换按钮
export function DemoSwitch({ eventName, str = "", checkedChildren, unCheckedChildren, selected = false }: { eventName: string, checkedChildren?: ReactNode | string, unCheckedChildren?: ReactNode | string, str?: string, selected?: boolean; }) {
	return (
		<Panel className="CC_SwitchContainer">
			<CCSwitch defaultChecked={selected} checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren} onChange={(checked) => {
				FireEvent(eventName, checked ? "1" : "0");
			}} />
		</Panel>
	);
}
// 下拉按钮
export function DemoDropDown({ eventName, list, index }: { eventName: string, list: string[], index?: number; }) {
	return (
		<CCDropDownButton index={index} onChange={(index, item) => { FireEvent(eventName, item.text); }}>
			{list.map((tData: any, key: any) => {
				return <Label key={String(tData)} id={String(tData)} text={String(tData)} />;
			})}
		</CCDropDownButton >
	);
}
// 文本输入按钮
export function DemoTextEntry({ eventName, text, defaultValue = "" }: { eventName: string, text: string, defaultValue?: string; }) {
	return (
		<TextButton className="DemoTextEntry" style={{ flowChildren: "right" }} onactivate={(self) => {
			let TextEntry = self.FindChildTraverse("DemoTextEntry") as TextEntry;
			FireEvent(eventName, TextEntry.text);
		}} localizedText={text}>
			<TextEntry id="DemoTextEntry" text={defaultValue} oninputsubmit={(self) => {
				FireEvent(eventName, self.text);
			}}>
			</TextEntry>
		</TextButton>
	);
}
export function DemoSlider({ eventName, text, min, max, defaultValue, onChange }: { eventName: string, text: string, min: number, max: number, defaultValue: number, onChange: (value: number) => void; }) {
	const [value, setValue] = useState(defaultValue);
	return (
		<Panel className="DemoSlider">
			<CCPanel flowChildren="right">
				<Label className="Title" text={text} />
				<Label className="Value" text={Round(value)} />
			</CCPanel>
			<Slider className="HorizontalSlider" value={(defaultValue - min) / (max - min)} direction="horizontal" onvaluechanged={self => {
				onChange(self.value * (max - min) + min);
				setValue(self.value * (max - min) + min);
			}} onload={self => {
				onChange(self.value * (max - min) + min);
			}} />
		</Panel>
	);
}

/** 打开一个面板 */
export function DemoSelectionButton({ eventName, text }: { eventName: string, text: string; }) {
	return (
		<TextButton id={eventName} className="DemoButton HotKeyValid ToggleSelection" localizedText={text} onactivate={() => {
			ToggleSelection(eventName);
		}}>
			<CCIcon_Arrow type="SolidRight" width="10px" align="right center" style={{ marginRight: "4px" }} />
		</TextButton>
	);
}

/** 选择容器 */
interface ICCDebugTool_SelectContainer {
	/** 事件名 */
	eventName: string,
	/** 标题 */
	title: string,
	/** 子元素 */
	itemNames?: string[],

	/** 筛选选项 */
	toggleList?: { [k: string]: any },

	// 初始状态
	defaultLock?: boolean,
	defaultRawMode?: boolean,

	//是否显示控件
	hasRawMode?: boolean,
	hasToggleSize?: boolean,
	hasLock?: boolean,
	hasFilter?: boolean,
	hasDragable?: boolean,
	/** 搜索回调 */
	onSearch?: (text: string) => void;
	/** 分类回调 */
	onToggleType?: (text: string) => void;
	/** 更改显示模式回调 */
	onChangeRawMode?: (rawMode: boolean) => void;
}
export class CCDebugTool_SelectContainer extends CCPanel<ICCDebugTool_SelectContainer> {
	state = {
		/** 是否锁定窗口 */
		lock: this.props.defaultLock ?? false,
		/** 显示模式 */
		rawMode: this.props.defaultRawMode ?? false,
		/** 是否有分类过滤 */
		hasToggleList: Object.keys(this.props.toggleList).length > 0,
		/** 窗口大小 */
		size: {
			width: this.props.width,
			height: this.props.height
		}
	};

	static defaultProps = {
		toggleList: {},
		width: "864px",
		height: "620px",
	};

	listener: NetTableListenerID | undefined;
	componentDidMount() {
		const config = CustomNetTables.GetTableValue("common", "demo_settings")?.tool_setting[Players.GetLocalPlayer()] ?? {};
		if (config["size_" + this.props.eventName] != undefined) {
			const [width, height] = config["size_" + this.props.eventName].split(",");
			const size = { width, height };
			if (size.width != this.state.size.width || size.height != this.state.size.height) {
				this.setState({ size });
			}
		}
		this.listener = CustomNetTables.SubscribeNetTableListener("common", (_, eventKey, eventValue) => {
			if ("demo_settings" === eventKey) {
				// @ts-ignore
				let config = eventValue.tool_setting[Players.GetLocalPlayer()];
				if (config["size_" + this.props.eventName] != undefined) {
					const [width, height] = config["size_" + this.props.eventName].split(",");
					const size = { width, height };
					if (size.width != this.state.size.width || size.height != this.state.size.height) {
						this.setState({ size });
					}
				}
			}
		});
	}

	componentWillUnmount(): void {
		if (this.listener) {
			CustomNetTables.UnsubscribeNetTableListener(this.listener);
		}
	}


	// 切换显示模式
	toggleRawMode = () => {
		this.setState({
			rawMode: !this.state.rawMode
		});
		if (this.props.onChangeRawMode) {
			this.props.onChangeRawMode(this.state.rawMode);
		}
	};

	// 切换窗口大小
	toggleSize = (sizeText: string[]) => {
		this.setState({
			size: {
				width: sizeText[0] + "px",
				height: sizeText[1] + "px",
			}
		});
		SaveConfig({
			["size_" + this.props.eventName]: sizeText[0] + "px" + "," + sizeText[1] + "px"
		});
	};
	// 切换锁定
	toggleLock = () => {
		this.setState({ lock: !this.state.lock });
	};
	// 拖拽相关
	dragable = false;
	dragPanel: Panel & { offsetX?: number, offsetY?: number; } | undefined = undefined;
	dragStart = (panel: Panel & { dragable?: boolean; }) => {
		if (this.props.hasDragable != false) {
			this.dragable = true;
			let parent = panel.FindAncestor(this.props.eventName);
			if (parent) {
				this.dragPanel = parent;
				this.dragTimer();
			}
		}
	};
	dragTimer = () => {
		if (this.dragable) {
			if (this.dragPanel != undefined && this.dragPanel.IsValid()) {
				if (GameUI.IsMouseDown(0)) {
					let position = GameUI.GetCursorPosition();
					if (this.dragPanel.offsetX == undefined || this.dragPanel.offsetY == undefined) {
						this.dragPanel.offsetX = this.dragPanel.GetPositionWithinWindow().x - position[0];
						this.dragPanel.offsetY = this.dragPanel.GetPositionWithinWindow().y - position[1];
						this.dragPanel.style.align = "left top";
						this.dragPanel.style.margin = "0px 0px 0px 0px";
					}
					if (this.dragPanel.offsetX != undefined && this.dragPanel.offsetY != undefined) {
						this.dragPanel.SetPositionInPixels((position[0] + this.dragPanel.offsetX) / this.dragPanel.actualuiscale_x, (position[1] + this.dragPanel.offsetY) / this.dragPanel.actualuiscale_y, 0);
					}
				} else {
					this.dragPanel.offsetX = undefined;
					this.dragPanel.offsetY = undefined;
				}
				$.Schedule(Game.GetGameFrameTime(), this.dragTimer);
			}
		} else {
			this.dragPanel = undefined;
		}
	};
	render() {
		const { eventName, title: text, toggleList } = this.props;
		const { lock, size } = this.state;
		return (
			<CCPanel id={eventName} className={CSSHelper.ClassMaker("SelectionContainer", { LockWindow: lock })} hittest={true} width={size.width} height={size.height}>
				<Panel id="SelectionPicker" >
					<Panel id="SelectionPickerHeader" onactivate={() => { }} onmouseover={self => this.dragStart(self)} onmouseout={self => this.dragable = false}>
						<Label id="SelectionTitle" localizedText={text} />
						<Panel className="FillWidth" />
						{this.props.hasFilter != false &&
							<Panel id="SelectionSearch" className="SearchBox" >
								{this.state.hasToggleList &&
									<CCDropDownButton placeholder="筛选" onChange={(index, item) => {
										if (this.props.onToggleType) {
											this.props.onToggleType(Object.keys(toggleList)[index - 1]);
										}
									}} onClear={() => {
										if (this.props.onToggleType) {
											this.props.onToggleType("");
										}
									}}>
										<Label id="CC_DropDown_Clear" text="X 清除筛选" />
										{Object.keys(toggleList).map((key, _index) => {
											return <Label key={_index} text={toggleList[key]} />;
										})}
									</CCDropDownButton>
								}
								<TextEntry id="SelectionSearchTextEntry" style={{ borderLeftWidth: this.state.hasToggleList ? "0px" : "1px" }} placeholder="#DOTA_Search" oninputsubmit={(self) => {
									if (this.props.onSearch) {
										this.props.onSearch(self.text);
									}
								}} ontextentrychange={(self) => {
									if (self.text == "") {
										if (this.props.onSearch) {
											this.props.onSearch("");
										}
									}
								}} />
							</Panel>
						}
						{/* 功能按钮 */}
						{this.props.hasRawMode != false &&
							<CCPanel className="CodeModeLabel" tooltip={"查看内部编码"} tooltipPosition="top" height="28px" verticalAlign="center">
								<TextButton style={{ fontSize: "20px", width: "27px", height: "27px", marginTop: "2px" }} text={this.state.rawMode ? "汉" : "Aa"} onactivate={() => this.toggleRawMode()} />
							</CCPanel>
						}
						{this.props.hasToggleSize != false &&
							<CCIconButton width="30px" tooltip={"切换窗口大小"} tooltipPosition="top" icon={<CCIcon_Arrow type="Expand" />} >
								<CCDropDownButton id="ToggleSize" onChange={(index, item) => { this.toggleSize(item.text.split("x")); }}>
									<Label text={"1280x720"} />
									<Label text={"864x620"} />
									<Label text={"620x360"} />
									<Label text={"620x620"} />
								</CCDropDownButton>
							</CCIconButton>
						}
						{this.props.hasLock != false &&
							<CCIconButton width="26px" tooltip={"锁定窗口"} tooltipPosition="top" className={CSSHelper.ClassMaker("LockIconButton", { Unlock: !this.state.lock })} icon={<CCIcon_Lock type="Small" />} onactivate={() => this.toggleLock()} />
						}
						<CCIconButton width="28px" tooltip={"关闭窗口"} tooltipPosition="top" icon={<CCIcon_XClose type="Default" />} onactivate={() => ToggleSelection(eventName)} />
					</Panel>
					{/* 物品列表 */}
					<Panel id="SelectionList" >
						{this.props.children}
					</Panel>
				</Panel>
			</CCPanel>
		);
	}
}
/** 设置界面 */
export function CCDebugTool_Setting() {
	const [deleteMode, setDeleteMode] = useState(false);
	const [customKeyBindCount, setCustomKeyBindCount] = useState(0);
	const [eventNameList, setEventNameList] = useState<string[]>([]);
	const [buttonTextList, setButtonTextList] = useState<string[]>([]);
	const [buttonTypeList, setButtonTypeList] = useState<string[]>([]);
	const tSettings = useNetTableKey("common", "demo_settings")?.tool_setting[Players.GetLocalPlayer()] ?? {};
	const defaultSettingList = ["ReloadScriptButtonPressed"];
	const RegisterDemoButton = useCallback((key: string, eventName: string, bInit: boolean) => {
		if (key && key != undefined) {
			RegisterKeyBind(key, () => {
				const CC_DebugTool = $.GetContextPanel().FindChildTraverse("CC_DebugTool");
				if (CC_DebugTool) {
					const demoButtonList = CC_DebugTool.FindChildrenWithClassTraverse("HotKeyValid") as TextButton[];
					demoButtonList.map((element) => {
						if (element.id == eventName.replace("hotkey_", "")) {
							const index = eventNameList.indexOf(eventName.replace("hotkey_", ""));
							if (index > -1) {
								const buttonType = buttonTypeList[index];
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
				FireEvent("ChangeToolSettingKeyBind", eventName + "," + key);
			}
			setCustomKeyBindCount(0);
		}
	}, [eventNameList, buttonTypeList]);
	const RegisterKeyBind = useCallback((key: string, onkeydown?: () => void, onkeyup?: () => void) => {
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
	}, []);
	/** 添加一个键位绑定 */
	const addKeyBind = (self: Panel) => {
		setCustomKeyBindCount(customKeyBindCount + 1);
		findHotKeyValidButton(self);
	};
	/** 寻找可以绑定的按钮 */
	const findHotKeyValidButton = (self: Panel) => {
		const root = self.FindAncestor("CC_DebugTool");
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
			setEventNameList(eventList);
			setButtonTextList(textList);
			setButtonTypeList(typeList);
		}
	};
	const OnLoad = (self: Panel) => {
		findHotKeyValidButton(self);
	};
	return (
		<CCDebugTool_SelectContainer
			eventName={"CC_DebugTool_Setting"}
			title={"调试工具设置"}
			width="500px"
			height="700px"
			hasRawMode={false}
			hasToggleSize={false}
			hasFilter={false}
		>
			<CCPanel id="CC_DebugTool_Setting" className="CC_DebugTool_Setting" flowChildren="down" width="100%" height="100%">
				{/* 面板热键 */}
				<CCPanel flowChildren="down" width="100%" marginTop="12px" onload={self => OnLoad(self)}>
					<Label text="面板热键" className="SectionHeader" />
					<Panel className="SectionHeaderLine" />
					{/* 默认设置 */}
					{eventNameList.length > 0 && defaultSettingList.map((eventName, index) => {
						return <CC_KeyBinder key={"defaultSettingList" + eventName + index} text={buttonTextList[eventNameList.indexOf(eventName)]} initKey={tSettings["hotkey_" + eventName]} callback={(key) => RegisterDemoButton(key, "hotkey_" + eventName, false)} />;
					})}
					{/* 已保存的自定义热键设置 */}
					{buttonTextList.length > 0 && Object.keys(tSettings).map((eventName, index) => {
						if (eventName.indexOf("hotkey_") != -1 && defaultSettingList.indexOf(eventName.replace("hotkey_", "")) == -1) {
							return (
								<CCPanel width="100%" height="36px" key={"saved" + eventName + index} flowChildren="right" className={CSSHelper.ClassMaker("CanRemoveKeyBind", { deleteMode: deleteMode })}>
									<CCIconButton verticalAlign="center" icon={<CCImage src="s2r://panorama/images/control_icons/x_close_png.vtex" />} onactivate={self => FireEvent("ChangeToolSettingKeyBind", "_delete_" + eventName)} />
									<CC_KeyBinder text={buttonTextList} initDropIndex={eventNameList.indexOf(eventName.replace("hotkey_", "")) + 1} initKey={tSettings[eventName]} callback={(key, bInit, dropIndex) => {
										if (eventNameList[dropIndex]) {
											RegisterDemoButton(key, "hotkey_" + eventNameList[dropIndex], bInit);
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
									<CCIconButton verticalAlign="center" icon={<CCImage src="s2r://panorama/images/control_icons/x_close_png.vtex" />} onactivate={self => setCustomKeyBindCount(customKeyBindCount - 1)} />
									<CC_KeyBinder text={buttonTextList} callback={(key, bInit, dropIndex) => {
										if (eventNameList[dropIndex]) {
											if (key && key != "") {
												RegisterDemoButton(key, "hotkey_" + eventNameList[dropIndex], bInit);
											}
										}
									}} />
								</CCPanel>
							);
						}
					})}
					<CCPanel width="100%">
						<CCButton margin="4px 8px" className="AddNewKeyBind" type="Text" text="+ 按键绑定" onactivate={self => addKeyBind(self)} />
						{!deleteMode &&
							<CCButton margin="4px 8px" className="AddNewKeyBind" horizontalAlign="right" type="Text" text="- 删除绑定" onactivate={self => setDeleteMode(true)} />
						}
						{deleteMode &&
							<CCButton margin="4px 8px" className="AddNewKeyBind" horizontalAlign="right" type="Text" text="取消" onactivate={self => setDeleteMode(false)} />
						}
					</CCPanel>
				</CCPanel>
				<CCButton verticalAlign="bottom" type="Outline" color="Blue" text="清空设置" onactivate={self => { FireEvent("ChangeToolSettingKeyBind", "_clear_all_config"); setCustomKeyBindCount(0); }} />
			</CCPanel>
		</CCDebugTool_SelectContainer>
	);
}

/** 封装好的图标选择 */
export function CCDebugTool_IconPicker() {
	const [filterWord, setFilterWord] = useState("");
	const [type, setType] = useState("");
	return (
		<SelectContainer eventName="CC_DebugTool_IconPicker" title="图标选择" hasRawMode={false} toggleList={{
			All: "全部",
			Eom: "EOM",
			Tui7: "Tui7",
			Tui3: "Tui3",
			NoType: "无类型",
		}} onSearch={text => setFilterWord(text)} onToggleType={text => setType(text)}>
			<CC_IconPicker type={type == "" ? undefined : type} filterWord={filterWord} />
		</SelectContainer>
	);
}

/** 技能选择 */
export class CCDebugTool_AbilityPicker extends CCPanel<{
	/** 事件名 */
	eventName: string;
	/** 技能名列表 */
	abilityNames?: string[];
	/** 窗口标题 */
	title: string;
	/** 分类 */
	toggleList?: {
		/** type是分类，后面实际显示的描述 */
		[toggleType: string]: string;
	};
	/** 过滤器 */
	filterFunc?: (toggleType: string, itemName: string) => boolean;
}> {
	state = {
		filterWord: "",
		toggleType: "",
		rawMode: false,
	};
	render() {
		return (
			<CCDebugTool_SelectContainer
				eventName={this.props.eventName}
				title={this.props.title}
				toggleList={this.props.toggleList}
				onSearch={text => this.setState({ filterWord: text })}
				onToggleType={text => this.setState({ toggleType: text })}
				onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
			>
				<CCPanel className="CC_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
					{this.props.abilityNames?.map((abilityname, index) => {
						if (this.props.filterFunc) {
							if (!this.props.filterFunc(this.state.toggleType, abilityname)) {
								return;
							}
						}
						if (this.state.filterWord != "") {
							if (abilityname.search(new RegExp(this.state.filterWord, "gim")) == -1 && $.Localize("#DOTA_Tooltip_ability_" + abilityname).search(new RegExp(this.state.filterWord, "gim")) == -1) {
								return;
							}
						}
						return (
							<CCBaseButton className="CC_DebugTool_AbilityPickerItem" key={index + ""} width="64px" flowChildren="down" onactivate={self => FireEvent(this.props.eventName, abilityname)}>
								<DOTAAbilityImage abilityname={abilityname} showtooltip />
								<Label className="CC_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? abilityname : $.Localize("#DOTA_Tooltip_ability_" + abilityname)} />
							</CCBaseButton>
						);
					})}
				</CCPanel>
			</CCDebugTool_SelectContainer>
		);
	}
}
/** 选择物品 */
export class CCDebugTool_ItemPicker extends CCPanel<{
	/** 事件名 */
	eventName: string;
	/** 技能名列表 */
	itemNames?: string[];
	/** 窗口标题 */
	title: string;
	/** 分类 */
	toggleList?: {
		/** type是分类，后面实际显示的描述 */
		[toggleType: string]: string;
	};
	/** 过滤器 */
	filterFunc?: (toggleType: string, itemName: string) => boolean;
}> {
	state = {
		filterWord: "",
		toggleType: "",
		rawMode: false,
	};
	render() {
		return (
			<CCDebugTool_SelectContainer
				eventName={this.props.eventName}
				title={this.props.title}
				toggleList={this.props.toggleList}
				onSearch={text => this.setState({ filterWord: text })}
				onToggleType={text => this.setState({ toggleType: text })}
				onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
			>
				<CCPanel className="CC_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
					{this.props.itemNames?.map((abilityname, index) => {
						if (this.props.filterFunc) {
							if (!this.props.filterFunc(this.state.toggleType, abilityname)) {
								return;
							}
						}
						if (this.state.filterWord != "") {
							if (abilityname.search(new RegExp(this.state.filterWord, "gim")) == -1 && $.Localize("#DOTA_Tooltip_ability_" + abilityname).search(new RegExp(this.state.filterWord, "gim")) == -1) {
								return;
							}
						}
						return (
							<CCBaseButton className="CC_DebugTool_AbilityPickerItem" key={index + ""} flowChildren="down" onactivate={self => FireEvent(this.props.eventName, abilityname)}>
								<DOTAItemImage itemname={abilityname} showtooltip />
								<Label className="CC_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? abilityname : $.Localize("#DOTA_Tooltip_ability_" + abilityname)} />
							</CCBaseButton>
						);
					})}
				</CCPanel>
			</CCDebugTool_SelectContainer>
		);
	}
}
/** 英雄选择 */
export class CCDebugTool_HeroPicker extends CCPanel<{
	/** 事件名 */
	eventName: string;
	/** 单位名列表 */
	unitNames?: string[];
	/** 窗口标题 */
	title: string;
}> {
	state = {
		rawMode: false,
	};
	render() {
		return (
			<CCDebugTool_SelectContainer
				eventName={this.props.eventName}
				title={this.props.title}
				hasFilter={false}
				onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
			// width="620px"
			// height="360px"
			>
				<CCPanel className="CC_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
					{this.props.unitNames?.map((unitName, index) => {
						return (
							<CCBaseButton className="CC_DebugTool_AbilityPickerItem" key={index + ""} flowChildren="down" onactivate={self => FireEvent(this.props.eventName, unitName)}>
								<DOTAHeroImage heroimagestyle={"portrait"} heroname={unitName} id="HeroPickerCardImage" scaling="stretch-to-fit-x-preserve-aspect" />
								<Label className="CC_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? unitName : $.Localize("#" + unitName)} />
							</CCBaseButton>
						);
					})}
				</CCPanel>
			</CCDebugTool_SelectContainer>
		);
	}
}

/** 普通选择 */
export class CCDebugTool_TextPicker extends CCPanel<{
	/** 事件名 */
	eventName: string;
	/** 列表 */
	itemNames?: string[];
	/** 窗口标题 */
	title: string;
}> {
	state = {
		rawMode: false,
	};
	render() {
		return (
			<CCDebugTool_SelectContainer
				eventName={this.props.eventName}
				title={this.props.title}
				hasFilter={false}
				onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
			// width="620px"
			// height="360px"
			>
				<CCPanel className="CC_DebugTool_TextPicker" flowChildren="right-wrap" width="100%" scroll="y" >
					{this.props.itemNames?.map((itemName, index) => {
						return (
							<TextButton key={index} className="CC_DebugTool_TextPickerItem" localizedText={"#" + itemName} onactivate={self => FireEvent(this.props.eventName, itemName)} />
						);
					})}
				</CCPanel>
			</CCDebugTool_SelectContainer>
		);
	}
}

interface IDebugTool_SectPicker {
	/** 事件名 */
	eventName: string;
	/** 技能名列表 */
	abilityNames?: string[];
	/** 窗口标题 */
	title: string;
	/** 分类 */
	toggleList?: {
		/** type是分类，后面实际显示的描述 */
		[toggleType: string]: string;
	};
	/** 过滤器 */
	filterFunc?: (toggleType: string, itemName: string) => boolean;
}

export class CCDebugTool_SectPicker extends CCPanel<IDebugTool_SectPicker> {
	state = {
		filterWord: "",
		toggleType: "",
		rawMode: false,
	};
	render() {
		return (
			<CCDebugTool_SelectContainer
				eventName={this.props.eventName}
				title={this.props.title}
				toggleList={this.props.toggleList}
				onSearch={text => this.setState({ filterWord: text })}
				onToggleType={text => this.setState({ toggleType: text })}
				onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
			>
				<CCPanel className="CC_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
					{this.props.abilityNames?.map((abilityUpgradeID, index) => {
						if (this.props.filterFunc) {
							if (!this.props.filterFunc(this.state.toggleType, abilityUpgradeID)) {
								return;
							}
						}
						if (this.state.filterWord != "") {
							if (abilityUpgradeID.search(new RegExp(this.state.filterWord, "gim")) == -1 && $.Localize("#DOTA_Tooltip_ability_mechanics_" + abilityUpgradeID).search(new RegExp(this.state.filterWord, "gim")) == -1) {
								return;
							}
						}
						const abilityUpgradeInfo = GameUI.CustomUIConfig().AbilityUpgradesKv[abilityUpgradeID];
						return (
							<CCBaseButton className="CC_DebugTool_AbilityPickerItem" key={index + ""} width="64px" flowChildren="down" onactivate={self => FireEvent(this.props.eventName, abilityUpgradeID)} customTooltip={{ name: "sect_ability", abilityUpgradeID: abilityUpgradeID }}>
								<Image className="DOTAAbilityImage" src={`file://{images}/spellicons/${abilityUpgradeInfo.Texture}.png`} />
								<Label className="CC_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? abilityUpgradeID : $.Localize("#DOTA_Tooltip_ability_mechanics_" + abilityUpgradeID)} />
							</CCBaseButton>
						);
					})}
				</CCPanel>
			</CCDebugTool_SelectContainer>
		);
	}
}

/** 单位信息面板 */
export class CCDebugTool_UnitInfo extends CCPanel {
	state = { unitIndex: -1 as EntityIndex };
	timerID?: ScheduleID;

	onStartUI() {
		TimerHelper.AddIntervalFrameTimer(1, 1, FuncHelper.Handler.create(this, () => {
			this.UpdateState({ unitIndex: Players.GetLocalPlayerPortraitUnit() });
		}), -1)
	}

	getPosition = () => {
		let result = "";
		const position = Entities.GetAbsOrigin(this.state.unitIndex);
		if (position) {
			result = `${Number(position[0])}, ${Number(position[1])}, ${Number(position[2])}`;
		}
		return result;
	};
	getForward = () => {
		let result = "";
		const position = Entities.GetForward(this.state.unitIndex);
		if (position) {
			result = `${Number(position[0])}, ${Number(position[1])}, ${Number(position[2])}`;
		}
		return result;
	};
	render() {
		return (
			<CCDebugTool_SelectContainer
				eventName={"CC_UnitInfo"}
				title={"单位信息面板"}
				width="480px"
				height="620px"
				hasRawMode={false}
				hasToggleSize={false}
				hasFilter={false}
			>
				<CCPanel flowChildren="down">
					<Label text={"单位名：" + `(${this.state.unitIndex})` + Entities.GetUnitName(this.state.unitIndex)} />
					<Label text={"位置：" + this.getPosition()} />
					<Label text={"朝向：" + this.getForward()} />
					<Label text={"生命：" + Entities.GetHealth(this.state.unitIndex) + "/" + Entities.GetMaxHealth(this.state.unitIndex)} />
					<Label text={"魔法：" + Entities.GetMana(this.state.unitIndex) + "/" + Entities.GetMaxMana(this.state.unitIndex)} />
					<Label text={"Modifier："} />
					{[...Array(Entities.GetNumBuffs(this.state.unitIndex))].map((_, index) => {
						return <Label key={index} text={"		" + Buffs.GetName(this.state.unitIndex, Entities.GetBuff(this.state.unitIndex, index))} />;
					})}
				</CCPanel>
			</CCDebugTool_SelectContainer>
		);
	}
}