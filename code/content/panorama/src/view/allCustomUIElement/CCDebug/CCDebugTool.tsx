import { useNetTableKey } from "@demon673/react-panorama";
import classNames from "classnames";
import React, { Children, ReactElement, ReactNode, useCallback, useState } from "react";
import ContextMenu from "../../../utils/context_menu";
import { DispatchRefreshEvent } from "../../../utils/utils";
import EOM_Panel from "../../Container/EOM_Panel/EOM_Panel";
import EOM_Image from "../../DataDisplay/EOM_Image/EOM_Image";
import EOM_BaseComponent from "../../EOM_BaseComponent";
import EOM_Arrow from "../../Icons/EOM_Arrow";
import EOM_Gear from "../../Icons/EOM_Gear";
import EOM_Lock from "../../Icons/EOM_Lock";
import EOM_Refresh from "../../Icons/EOM_Refresh";
import EOM_XClose from "../../Icons/EOM_XClose";
import EOM_Button, { EOM_BaseButton } from "../../Inputs/EOM_Button/EOM_Button";
import { EOM_DropDown } from "../../Inputs/EOM_DropDown/EOM_DropDown";
import { EOM_IconButton } from "../../Inputs/EOM_IconButton/EOM_IconButton";
import EOM_Switch from "../../Inputs/EOM_Switch/EOM_Switch";
import EOM_IconPicker from "../EOM_IconPicker/EOM_IconPicker";
import { EOM_KeyBinder, KeyCode } from "../EOM_KeyBinder/EOM_KeyBinder";
import "./CCDebugTool.less";

// let pSelf = $.GetContextPanel().FindChildTraverse("EOM_DebugToolControlPanel");
// let bManualShowDemo = false;
// let bDisableAlt = false;
// let bRefreshData = true;

// let update = () => {
// 	$.Schedule(1 / 30, update);
// 	if (pSelf) {
// 		if (bDisableAlt) {
// 			return;
// 		}
// 		// if (CustomNetTables.GetTableValue("common", "settings").is_cheat_mode == 0) {
// 		// 	pSelf.style.visibility = "collapse";
// 		// }
// 		if (!bManualShowDemo) {
// 			pSelf.SetHasClass('Minimized', !GameUI.IsAltDown());
// 		} else {
// 			if (pSelf.BHasClass("Minimized") && GameUI.IsAltDown()) {
// 				pSelf.SetHasClass('Minimized', false);
// 				bManualShowDemo = false;
// 			}
// 		}
// 	} else {
// 		pSelf = $.GetContextPanel().FindChildTraverse("EOM_DebugToolControlPanel");
// 	}
// };
// update();

interface EOM_DebugToolAttribute {
	/** 面板的方向 */
	direction: "top" | "right" | "left";
	/** 展开按钮的位置 */
	expandButtonAlign?: "top" | "bottom" | "left" | "right";
	/** 子元素 */
	containerElement?: ReactNode;
}

export default class EOM_DebugTool extends EOM_BaseComponent<EOM_DebugToolAttribute> {
	defaultClass = () => { return "EOM_DebugTool"; };
	state = { Minimized: true, bManualShowPanel: false, direction: this.props.direction, config: CustomNetTables.GetTableValue("common", "demo_settings")?.tool_setting[Players.GetLocalPlayer()] ?? {} };
	expandButtonStyle = {
		verticalAlign: (this.props.expandButtonAlign == "top" || this.props.expandButtonAlign == "bottom") ? this.props.expandButtonAlign : undefined,
		horizontalAlign: (this.props.expandButtonAlign == "left" || this.props.expandButtonAlign == "right") ? this.props.expandButtonAlign : undefined,
	};
	listener: NetTableListenerID | undefined;

	componentDidMount() {
		if (this.state.config.direction != undefined && this.state.config.direction != this.state.direction) {
			this.setState({ direction: this.state.config.direction });
		}
		this.listener = CustomNetTables.SubscribeNetTableListener("common", (_, eventKey, eventValue) => {
			if ("demo_settings" === eventKey) {
				// @ts-ignore
				let config = eventValue.tool_setting[Players.GetLocalPlayer()] ?? {};
				this.setState({ config: config });
				if (config.direction != undefined && this.state.direction != config.direction) {
					this.setState({ direction: config.direction });
				}
			}
		});
	}

	componentWillUnmount(): void {
		if (this.listener) {
			CustomNetTables.UnsubscribeNetTableListener(this.listener);
		}
	}

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
			<Panel id="EOM_DebugTool" hittest={false} {...this.getBaseProp()}>
				{this.props.containerElement}
				<EOM_DebugTool_Setting />
				<Panel id="EOM_DebugToolControlPanel" onload={self => this.checkAltDown(self)} className={classNames("ControlPanel", { Minimized: this.state.Minimized, DirectionLeft: this.state.direction == "left", DirectionRight: this.state.direction == "right", DirectionTop: this.state.direction == "top", })}>
					<Panel className="ControlPanelContainer">
						<Panel className="ControlPanelTitle">
							<Panel className="CategoryHeaderFilledFront" />
							<Label className="CategoryHeader" localizedText={"工具"} />
							<Panel className="CategoryHeaderFilledNext" />
							<EOM_IconButton className="CategoryHeaderIcon" tooltip={"切换布局"} verticalAlign="center" width="20px" icon={<EOM_Arrow type="Popout" />} >
								<EOM_DropDown id="ToggleSize" onChange={(index, item) => { this.setState({ direction: item.id }); SaveConfig({ direction: item.id }); }}>
									<Label text={"左侧"} id="left" />
									<Label text={"上方"} id="top" />
									<Label text={"右侧"} id="right" />
								</EOM_DropDown>
							</EOM_IconButton>
							<EOM_IconButton className="CategoryHeaderIcon" tooltip={"重载数据"} verticalAlign="center" width="20px" icon={<EOM_Refresh />} onactivate={self => GameEvents.SendEventClientSide("custom_refresh_order", { name: "RefreshContainer" })} />
							<EOM_IconButton className="CategoryHeaderIcon" tooltip={"设置"} verticalAlign="center" width="20px" icon={<EOM_Gear />} onactivate={self => ToggleSelection("EOM_DebugTool_Setting")} />
						</Panel>
						{this.props.children}
					</Panel>
					<Panel id="ExpandButtonContainer" style={this.expandButtonStyle} >
						<Button id="ExpandButton" onactivate={self => {
							this.setState({ bManualShowPanel: this.state.Minimized, Minimized: !this.state.Minimized });
						}} >
							<EOM_Arrow type="Right" width="8px" height="14px" align="center center" rotate={this.state.Minimized ? (this.state.direction == "top" ? 90 : 0) : (this.state.direction == "top" ? 270 : 180)} />
						</Button>
					</Panel>
				</Panel>
			</Panel>
		);
	}
}

// 分类
export class EOM_DebugTool_Category extends EOM_BaseComponent<{
	/** 标题 */
	title: string,
	/** 自动排版根据col数进行分列排版，默认为2 */
	col: number,
	/** 是否使用手动排版，默认为false */
	layout: boolean,
}> {
	defaultClass = () => { return classNames("Category", { SingleCol: this.state.col <= 1 }); };
	state = { col: this.props.col };
	listener: NetTableListenerID | undefined;
	componentDidMount() {
		const config = CustomNetTables.GetTableValue("common", "demo_settings")?.tool_setting[Players.GetLocalPlayer()] ?? {};
		if (config["ctg_col_" + this.props.title] != undefined && config["ctg_col_" + this.props.title] != this.state.col) {
			this.setState({ col: config["ctg_col_" + this.props.title] });
		}
		this.listener = CustomNetTables.SubscribeNetTableListener("common", (_, eventKey, eventValue) => {
			if ("demo_settings" === eventKey) {
				// @ts-ignore
				let config = eventValue.tool_setting[Players.GetLocalPlayer()];
				if (config["ctg_col_" + this.props.title] != undefined && config["ctg_col_" + this.props.title] != this.state.col) {
					this.setState({ col: config["ctg_col_" + this.props.title] });
				}
			}
		});
	}

	componentWillUnmount(): void {
		if (this.listener) {
			CustomNetTables.UnsubscribeNetTableListener(this.listener);
		}
	}
	static defaultProps = {
		col: 2,
		layout: false
	};
	render() {
		const { title, layout, children } = this.props;
		const { col } = this.state;
		return (
			<Panel {...this.props} {...this.getBaseProp()}>
				<Panel className="CategoryHeader">
					<Label className="CategoryHeaderLabel" localizedText={title} />
					<Panel style={{ width: "fill-parent-flow(1)" }} />
					<EOM_Switch horizontalAlign="right" checkedChildren="1列" unCheckedChildren="2列" checked={col == 1 ? true : false} onChange={(checked) => { SaveConfig({ ["ctg_col_" + this.props.title]: checked ? 1 : 2 }); this.setState({ col: checked ? 1 : 2 }); }} />
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
		<TextButton id={eventName} className={classNames("DemoButton", "HotKeyValid", "FireEvent", color)} localizedText={text} onactivate={onactivate} />
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
		<Panel className="EOM_SwitchContainer">
			<EOM_Switch defaultChecked={selected} checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren} onChange={(checked) => {
				FireEvent(eventName, checked ? "1" : "0");
			}} />
		</Panel>
	);
}
// 下拉按钮
export function DemoDropDown({ eventName, list, index }: { eventName: string, list: string[], index?: number; }) {
	return (
		<EOM_DropDown index={index} onChange={(index, item) => { FireEvent(eventName, item.text); }}>
			{list.map((tData: any, key: any) => {
				return <Label key={String(tData)} id={String(tData)} text={String(tData)} />;
			})}
		</EOM_DropDown >
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
			<EOM_Panel flowChildren="right">
				<Label className="Title" text={text} />
				<Label className="Value" text={Round(value)} />
			</EOM_Panel>
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
			<EOM_Arrow type="SolidRight" width="10px" align="right center" style={{ marginRight: "4px" }} />
		</TextButton>
	);
}

/** 选择容器 */
interface SelectContainerAttribute {
	/** 事件名 */
	eventName: string,
	/** 标题 */
	title: string,
	/** 子元素 */
	itemNames?: string[],

	/** 筛选选项 */
	toggleList: Table,

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
export class SelectContainer extends EOM_BaseComponent<SelectContainerAttribute> {
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
			<EOM_Panel id={eventName} className={classNames("SelectionContainer", { LockWindow: lock })} hittest={true} width={size.width} height={size.height}>
				<Panel id="SelectionPicker" >
					<Panel id="SelectionPickerHeader" onactivate={() => { }} onmouseover={self => this.dragStart(self)} onmouseout={self => this.dragable = false}>
						<Label id="SelectionTitle" localizedText={text} />
						<Panel className="FillWidth" />
						{this.props.hasFilter != false &&
							<Panel id="SelectionSearch" className="SearchBox" >
								{this.state.hasToggleList &&
									<EOM_DropDown placeholder="筛选" onChange={(index, item) => {
										if (this.props.onToggleType) {
											this.props.onToggleType(Object.keys(toggleList)[index - 1]);
										}
									}} onClear={() => {
										if (this.props.onToggleType) {
											this.props.onToggleType("");
										}
									}}>
										<Label id="EOM_DropDown_Clear" text="X 清除筛选" />
										{Object.keys(toggleList).map((key, _index) => {
											return <Label key={_index} text={toggleList[key]} />;
										})}
									</EOM_DropDown>
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
							<EOM_Panel className="CodeModeLabel" tooltip={"查看内部编码"} tooltipPosition="top" height="28px" verticalAlign="center">
								<TextButton style={{ fontSize: "20px", width: "27px", height: "27px", marginTop: "2px" }} text={this.state.rawMode ? "汉" : "Aa"} onactivate={() => this.toggleRawMode()} />
							</EOM_Panel>
						}
						{this.props.hasToggleSize != false &&
							<EOM_IconButton width="30px" tooltip={"切换窗口大小"} tooltipPosition="top" icon={<EOM_Arrow type="Expand" />} >
								<EOM_DropDown id="ToggleSize" onChange={(index, item) => { this.toggleSize(item.text.split("x")); }}>
									<Label text={"1280x720"} />
									<Label text={"864x620"} />
									<Label text={"620x360"} />
									<Label text={"620x620"} />
								</EOM_DropDown>
							</EOM_IconButton>
						}
						{this.props.hasLock != false &&
							<EOM_IconButton width="26px" tooltip={"锁定窗口"} tooltipPosition="top" className={classNames("LockIconButton", { Unlock: !this.state.lock })} icon={<EOM_Lock type="Small" />} onactivate={() => this.toggleLock()} />
						}
						<EOM_IconButton width="28px" tooltip={"关闭窗口"} tooltipPosition="top" icon={<EOM_XClose type="Default" />} onactivate={() => ToggleSelection(eventName)} />
					</Panel>
					{/* 物品列表 */}
					<Panel id="SelectionList" >
						{this.props.children}
					</Panel>
				</Panel>
			</EOM_Panel>
		);
	}
}
/** 设置界面 */
export function EOM_DebugTool_Setting() {
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
				const EOM_DebugTool = $.GetContextPanel().FindChildTraverse("EOM_DebugTool");
				if (EOM_DebugTool) {
					const demoButtonList = EOM_DebugTool.FindChildrenWithClassTraverse("HotKeyValid") as TextButton[];
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
		const root = self.FindAncestor("EOM_DebugTool");
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
		<SelectContainer
			eventName={"EOM_DebugTool_Setting"}
			title={"调试工具设置"}
			width="500px"
			height="700px"
			hasRawMode={false}
			hasToggleSize={false}
			hasFilter={false}
		>
			<EOM_Panel id="EOM_DebugTool_Setting" className="EOM_DebugTool_Setting" flowChildren="down" width="100%" height="100%">
				{/* 面板热键 */}
				<EOM_Panel flowChildren="down" width="100%" marginTop="12px" onload={self => OnLoad(self)}>
					<Label text="面板热键" className="SectionHeader" />
					<Panel className="SectionHeaderLine" />
					{/* 默认设置 */}
					{eventNameList.length > 0 && defaultSettingList.map((eventName, index) => {
						return <EOM_KeyBinder key={"defaultSettingList" + eventName + index} text={buttonTextList[eventNameList.indexOf(eventName)]} initKey={tSettings["hotkey_" + eventName]} callback={(key) => RegisterDemoButton(key, "hotkey_" + eventName, false)} />;
					})}
					{/* 已保存的自定义热键设置 */}
					{buttonTextList.length > 0 && Object.keys(tSettings).map((eventName, index) => {
						if (eventName.indexOf("hotkey_") != -1 && defaultSettingList.indexOf(eventName.replace("hotkey_", "")) == -1) {
							return (
								<EOM_Panel width="100%" height="36px" key={"saved" + eventName + index} flowChildren="right" className={classNames("CanRemoveKeyBind", { deleteMode: deleteMode })}>
									<EOM_IconButton verticalAlign="center" icon={<EOM_Image src="s2r://panorama/images/control_icons/x_close_png.vtex" />} onactivate={self => FireEvent("ChangeToolSettingKeyBind", "_delete_" + eventName)} />
									<EOM_KeyBinder text={buttonTextList} initDropIndex={eventNameList.indexOf(eventName.replace("hotkey_", "")) + 1} initKey={tSettings[eventName]} callback={(key, bInit, dropIndex) => {
										if (eventNameList[dropIndex]) {
											RegisterDemoButton(key, "hotkey_" + eventNameList[dropIndex], bInit);
										}
									}} />
								</EOM_Panel>
							);
						}
					})}
					{/* 添加热键 */}
					{[...Array(customKeyBindCount)].map((_, index) => {
						if (buttonTextList.length > 0) {
							return (
								<EOM_Panel width="100%" height="36px" key={index} flowChildren="right" className={classNames("CanRemoveKeyBind", { deleteMode: deleteMode })}>
									<EOM_IconButton verticalAlign="center" icon={<EOM_Image src="s2r://panorama/images/control_icons/x_close_png.vtex" />} onactivate={self => setCustomKeyBindCount(customKeyBindCount - 1)} />
									<EOM_KeyBinder text={buttonTextList} callback={(key, bInit, dropIndex) => {
										if (eventNameList[dropIndex]) {
											if (key && key != "") {
												RegisterDemoButton(key, "hotkey_" + eventNameList[dropIndex], bInit);
											}
										}
									}} />
								</EOM_Panel>
							);
						}
					})}
					<EOM_Panel width="100%">
						<EOM_Button margin="4px 8px" className="AddNewKeyBind" type="Text" text="+ 按键绑定" onactivate={self => addKeyBind(self)} />
						{!deleteMode &&
							<EOM_Button margin="4px 8px" className="AddNewKeyBind" horizontalAlign="right" type="Text" text="- 删除绑定" onactivate={self => setDeleteMode(true)} />
						}
						{deleteMode &&
							<EOM_Button margin="4px 8px" className="AddNewKeyBind" horizontalAlign="right" type="Text" text="取消" onactivate={self => setDeleteMode(false)} />
						}
					</EOM_Panel>
				</EOM_Panel>
				<EOM_Button verticalAlign="bottom" type="Outline" color="Blue" text="清空设置" onactivate={self => { FireEvent("ChangeToolSettingKeyBind", "_clear_all_config"); setCustomKeyBindCount(0); }} />
			</EOM_Panel>
		</SelectContainer>
	);
}

/** 封装好的图标选择 */
export function EOM_DebugTool_IconPicker() {
	const [filterWord, setFilterWord] = useState("");
	const [type, setType] = useState("");
	return (
		<SelectContainer eventName="EOM_DebugTool_IconPicker" title="图标选择" hasRawMode={false} toggleList={{
			All: "全部",
			Eom: "EOM",
			Tui7: "Tui7",
			Tui3: "Tui3",
			NoType: "无类型",
		}} onSearch={text => setFilterWord(text)} onToggleType={text => setType(text)}>
			<EOM_IconPicker type={type == "" ? undefined : type} filterWord={filterWord} />
		</SelectContainer>
	);
}

/** 技能选择 */
export class EOM_DebugTool_AbilityPicker extends EOM_BaseComponent<{
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
			<SelectContainer
				eventName={this.props.eventName}
				title={this.props.title}
				toggleList={this.props.toggleList}
				onSearch={text => this.setState({ filterWord: text })}
				onToggleType={text => this.setState({ toggleType: text })}
				onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
			>
				<EOM_Panel className="EOM_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
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
							<EOM_BaseButton className="EOM_DebugTool_AbilityPickerItem" key={index} width="64px" flowChildren="down" onactivate={self => FireEvent(this.props.eventName, abilityname)}>
								<DOTAAbilityImage abilityname={abilityname} showtooltip />
								<Label className="EOM_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? abilityname : $.Localize("#DOTA_Tooltip_ability_" + abilityname)} />
							</EOM_BaseButton>
						);
					})}
				</EOM_Panel>
			</SelectContainer>
		);
	}
}
/** 选择物品 */
export class EOM_DebugTool_ItemPicker extends EOM_BaseComponent<{
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
			<SelectContainer
				eventName={this.props.eventName}
				title={this.props.title}
				toggleList={this.props.toggleList}
				onSearch={text => this.setState({ filterWord: text })}
				onToggleType={text => this.setState({ toggleType: text })}
				onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
			>
				<EOM_Panel className="EOM_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
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
							<EOM_BaseButton className="EOM_DebugTool_AbilityPickerItem" key={index} flowChildren="down" onactivate={self => FireEvent(this.props.eventName, abilityname)}>
								<DOTAItemImage itemname={abilityname} showtooltip />
								<Label className="EOM_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? abilityname : $.Localize("#DOTA_Tooltip_ability_" + abilityname)} />
							</EOM_BaseButton>
						);
					})}
				</EOM_Panel>
			</SelectContainer>
		);
	}
}
/** 英雄选择 */
export class EOM_DebugTool_HeroPicker extends EOM_BaseComponent<{
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
			<SelectContainer
				eventName={this.props.eventName}
				title={this.props.title}
				hasFilter={false}
				onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
			// width="620px"
			// height="360px"
			>
				<EOM_Panel className="EOM_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
					{this.props.unitNames?.map((unitName, index) => {
						return (
							<EOM_BaseButton className="EOM_DebugTool_AbilityPickerItem" key={index} flowChildren="down" onactivate={self => FireEvent(this.props.eventName, unitName)}>
								<DOTAHeroImage heroimagestyle={"portrait"} heroname={unitName} id="HeroPickerCardImage" scaling="stretch-to-fit-x-preserve-aspect" />
								<Label className="EOM_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? unitName : $.Localize("#" + unitName)} />
							</EOM_BaseButton>
						);
					})}
				</EOM_Panel>
			</SelectContainer>
		);
	}
}

/** 普通选择 */
export class EOM_DebugTool_TextPicker extends EOM_BaseComponent<{
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
			<SelectContainer
				eventName={this.props.eventName}
				title={this.props.title}
				hasFilter={false}
				onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
			// width="620px"
			// height="360px"
			>
				<EOM_Panel className="EOM_DebugTool_TextPicker" flowChildren="right-wrap" width="100%" scroll="y" >
					{this.props.itemNames?.map((itemName, index) => {
						return (
							<TextButton key={index} className="EOM_DebugTool_TextPickerItem" localizedText={"#" + itemName} onactivate={self => FireEvent(this.props.eventName, itemName)} />
						);
					})}
				</EOM_Panel>
			</SelectContainer>
		);
	}
}


export class EOM_DebugTool_SectPicker extends EOM_BaseComponent<{
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
			<SelectContainer
				eventName={this.props.eventName}
				title={this.props.title}
				toggleList={this.props.toggleList}
				onSearch={text => this.setState({ filterWord: text })}
				onToggleType={text => this.setState({ toggleType: text })}
				onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
			>
				<EOM_Panel className="EOM_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
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
							<EOM_BaseButton className="EOM_DebugTool_AbilityPickerItem" key={index} width="64px" flowChildren="down" onactivate={self => FireEvent(this.props.eventName, abilityUpgradeID)} customTooltip={{ name: "sect_ability", abilityUpgradeID: abilityUpgradeID }}>
								<Image className="DOTAAbilityImage" src={`file://{images}/spellicons/${abilityUpgradeInfo.Texture}.png`} />
								<Label className="EOM_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? abilityUpgradeID : $.Localize("#DOTA_Tooltip_ability_mechanics_" + abilityUpgradeID)} />
							</EOM_BaseButton>
						);
					})}
				</EOM_Panel>
			</SelectContainer>
		);
	}
}

/** 单位信息面板 */
export class EOM_UnitInfo extends EOM_BaseComponent {
	state = { unitIndex: -1 as EntityIndex };
	timerID?: ScheduleID;

	Timer = () => {
		this.setState({ unitIndex: Players.GetLocalPlayerPortraitUnit() });
		this.timerID = $.Schedule(Game.GetGameFrameTime(), this.Timer);
	};
	componentDidMount() {
		this.Timer();
	}
	componentWillUnmount() {
		if (this.timerID) {
			$.CancelScheduled(this.timerID);
		}
	}
	getPosition = () => {
		let result = "";
		const position = Entities.GetAbsOrigin(this.state.unitIndex);
		if (position) {
			result = `${Float(position[0])}, ${Float(position[1])}, ${Float(position[2])}`;
		}
		return result;
	};
	getForward = () => {
		let result = "";
		const position = Entities.GetForward(this.state.unitIndex);
		if (position) {
			result = `${Float(position[0])}, ${Float(position[1])}, ${Float(position[2])}`;
		}
		return result;
	};
	render() {
		return (
			<SelectContainer
				eventName={"EOM_UnitInfo"}
				title={"单位信息面板"}
				width="480px"
				height="620px"
				hasRawMode={false}
				hasToggleSize={false}
				hasFilter={false}
			>
				<EOM_Panel flowChildren="down">
					<Label text={"单位名：" + `(${this.state.unitIndex})` + Entities.GetUnitName(this.state.unitIndex)} />
					<Label text={"位置：" + this.getPosition()} />
					<Label text={"朝向：" + this.getForward()} />
					<Label text={"生命：" + Entities.GetHealth(this.state.unitIndex) + "/" + Entities.GetMaxHealth(this.state.unitIndex)} />
					<Label text={"魔法：" + Entities.GetMana(this.state.unitIndex) + "/" + Entities.GetMaxMana(this.state.unitIndex)} />
					<Label text={"Modifier："} />
					{[...Array(Entities.GetNumBuffs(this.state.unitIndex))].map((_, index) => {
						return <Label key={index} text={"		" + Buffs.GetName(this.state.unitIndex, Entities.GetBuff(this.state.unitIndex, index))} />;
					})}
				</EOM_Panel>
			</SelectContainer>
		);
	}
}