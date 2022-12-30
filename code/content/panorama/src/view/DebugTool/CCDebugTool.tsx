import React, { Children, ReactNode } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCDropDownButton } from "../AllUIElement/CCButton/CCDropDownButton";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCIcon_Arrow } from "../AllUIElement/CCIcons/CCIcon_Arrow";
import { CCIcon_Gear } from "../AllUIElement/CCIcons/CCIcon_Gear";
import { CCIcon_Lock } from "../AllUIElement/CCIcons/CCIcon_Lock";
import { CCIcon_Refresh } from "../AllUIElement/CCIcons/CCIcon_Refresh";
import { CCIcon_XClose } from "../AllUIElement/CCIcons/CCIcon_XClose";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCSwitch } from "../AllUIElement/CCSwitch/CCSwitch";

import "./CCDebugTool.less";

interface ICCDebugTool {
	/** 面板的方向 */
	direction: "top" | "right" | "left";
	onSetting?: (p: Panel) => void;
	onRefresh?: (p: Panel) => void;
}

export class CCDebugTool extends CCPanel<ICCDebugTool> {
	state = {
		Minimized: true,
		bManualShowPanel: false,
		direction: this.props.direction,
		config: {}
	};
	defaultClass() { return "CC_DebugTool"; };

	static defaultProps = {
		direction: "top",
	};
	onInitUI() {
		GTimerHelper.AddFrameTimer(5, GHandler.create(this, () => {
			if (!this.state.bManualShowPanel) {
				if (this.state.Minimized == GameUI.IsAltDown()) {
					this.UpdateState({ Minimized: !GameUI.IsAltDown() });
				}
			} else {
				if (GameUI.IsAltDown()) {
					this.UpdateState({ bManualShowPanel: false });
				}
			}
			return 5
		}));
	}


	render() {
		return (
			this.__root___isValid &&
			<Panel ref={this.__root__} id="CC_DebugTool"  {...this.initRootAttrs()} hittest={false}>
				<Panel id="CC_DebugToolControlPanel"
					className={CSSHelper.ClassMaker("ControlPanel", { Minimized: this.state.Minimized, DirectionLeft: this.state.direction == "left", DirectionRight: this.state.direction == "right", DirectionTop: this.state.direction == "top", })}>
					<Panel className="ControlPanelContainer">
						<Panel className="ControlPanelTitle">
							<Panel className="CategoryHeaderFilledFront" />
							<Label className="CategoryHeader" localizedText={"工具"} />
							<Panel className="CategoryHeaderFilledNext" />
							<CCIconButton className="CategoryHeaderIcon" tooltip={"切换布局"} verticalAlign="center" width="20px" icon={<CCIcon_Arrow type="Popout" />} >
								<CCDropDownButton id="ToggleSize" onChange={(index, item) => { this.setState({ direction: item.id }) }}>
									<Label text={"左侧"} id="left" />
									<Label text={"上方"} id="top" />
									<Label text={"右侧"} id="right" />
								</CCDropDownButton>
							</CCIconButton>
							<CCIconButton className="CategoryHeaderIcon" tooltip={"重载数据"} verticalAlign="center" width="20px" icon={<CCIcon_Refresh />} onactivate={self => { this.props.onRefresh && this.props.onRefresh(self) }} />
							<CCIconButton className="CategoryHeaderIcon" tooltip={"设置"} verticalAlign="center" width="20px" icon={<CCIcon_Gear />} onactivate={self => { this.props.onSetting && this.props.onSetting(self) }} />
						</Panel>
						{this.props.children}
					</Panel>
					<CCPanel id="ExpandButtonContainer" horizontalAlign="left" verticalAlign="center" >
						<Button id="ExpandButton" onactivate={self => {
							this.UpdateState({ bManualShowPanel: this.state.Minimized, Minimized: !this.state.Minimized });
						}} >
							<CCIcon_Arrow type="Right" width="8px" height="14px" align="center center" rotate={this.state.Minimized ? (this.state.direction == "top" ? 90 : 0) : (this.state.direction == "top" ? 270 : 180)} />
						</Button>
					</CCPanel>
				</Panel>
			</Panel >
		);
	}
}

interface IDebugTool_Category {
	/** 标题 */
	title: string,
	/** 自动排版根据col数进行分列排版，默认为2 */
	col?: number,
	/** 是否使用手动排版，默认为false */
	layout?: boolean,
}
// 分类
export class CCDebugTool_Category extends CCPanel<IDebugTool_Category> {
	defaultClass() { return CSSHelper.ClassMaker("Category", { SingleCol: this.props.col! <= 1 }); };
	state = { col: this.props.col };
	static defaultProps = {
		col: 2,
		layout: false
	};
	render() {
		const { title, layout, children } = this.props;
		const col = this.state.col!;
		return (
			this.__root___isValid &&
			<Panel ref={this.__root__}      {...this.initRootAttrs()}>
				<Panel className="CategoryHeader">
					<Label className="CategoryHeaderLabel" localizedText={title} />
					<Panel style={{ width: "fill-parent-flow(1)" }} />
					<CCSwitch horizontalAlign="right" checkedChildren="1列" unCheckedChildren="2列" checked={col == 1 ? true : false} onChange={(checked) => { this.setState({ col: checked ? 1 : 2 }); }} />
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


/** 切换面板 */
function ToggleSelection(sPickerName: string) {
	let rootpanel = CCDebugTool.GetInstance()?.__root__.current;
	if (!rootpanel) { return }
	let aPickerList = rootpanel.FindChildrenWithClassTraverse("SelectionContainer");
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
interface ICCDebugTool_DemoButton {
	eventName: string; str?: string; localtext: string; btncolor?: "RedButton" | "GreenButton" | "QuitButton";
}
export class CCDebugTool_DemoButton extends CCPanel<ICCDebugTool_DemoButton, TextButton>{
	static defaultProps = {
		str: "",
	};
	defaultClass() {
		return CSSHelper.ClassMaker("DemoButton", "HotKeyValid", "FireEvent", this.props.btncolor)
	}
	defaultStyle() {
		return {
			id: this.props.eventName,
			localizedText: this.props.localtext,
			onactivate: (self: Panel) => {
				if (this.props.eventName && this.props.eventName.length > 0) {
					NetHelper.SendToLua(this.props.eventName)
				}
			}
		}
	}
	render() {
		return (
			this.__root___isValid &&
			<TextButton ref={this.__root__}  {...this.initRootAttrs()} />
		);
	}
}
// 切换按钮
interface ICCDebugTool_DemoToggle {
	eventName: string, str?: string, selected?: boolean, localtext: string;
}
export class CCDebugTool_DemoToggle extends CCPanel<ICCDebugTool_DemoToggle, ToggleButton>{
	static defaultProps = {
		str: "",
		selected: false,
	};
	defaultClass() {
		return "HotKeyValid FireEvent"
	}
	defaultStyle() {
		return { id: this.props.eventName, localizedText: this.props.localtext, selected: this.props.selected, }
	}
	render() {
		return (
			this.__root___isValid &&
			<ToggleButton ref={this.__root__}  {...this.initRootAttrs()} />
		);
	}
}

// 切换按钮
interface ICCDebugTool_DemoSwitch {
	eventName: string,
	checkedChildren?: ReactNode | string,
	unCheckedChildren?: ReactNode | string,
	str?: string,
	selected?: boolean,
	onChange: (b: boolean) => void;
}
export class CCDebugTool_DemoSwitch extends CCPanel<ICCDebugTool_DemoSwitch>{
	static defaultProps = {
		str: "",
		selected: false,
		onChange: (b: boolean) => { }
	};
	defaultClass() {
		return "CC_DebugTool_DemoSwitch"
	}
	defaultStyle() {
		return { id: this.props.eventName, selected: this.props.selected, onChange: this.props.onChange }
	}
	render() {
		return (
			this.__root___isValid &&
			<Panel ref={this.__root__}  {...this.initRootAttrs()} >
				<CCSwitch defaultChecked={this.props.selected} checkedChildren={this.props.checkedChildren} unCheckedChildren={this.props.unCheckedChildren}
					onChange={this.props.onChange} />
			</Panel>
		);
	}
}

// 下拉按钮
interface ICCDebugTool_DemoDropDown {
	onChange: (index: number, item: Panel) => void,
	eventName: string, list: string[], index?: number,
}
export class CCDebugTool_DemoDropDown extends CCPanel<ICCDebugTool_DemoDropDown>{
	static defaultProps = {
		onChange: (index: number, item: Panel) => { }
	};
	render() {
		return (
			this.__root___isValid &&
			<Panel ref={this.__root__}  {...this.initRootAttrs()} >
				<CCDropDownButton index={this.props.index} onChange={(index, item) => { this.props.onChange(index, item); }}>
					{this.props.list.map((tData: any, key: any) => {
						return <Label key={String(tData)} id={String(tData)} text={String(tData)} />;
					})}
				</CCDropDownButton >
			</Panel>
		);
	}
}

// 文本输入按钮
interface ICCDebugTool_DemoTextEntry {
	onBtnClick?: (item: Panel) => void,
	onTxtInput?: (item: Panel) => void,
	eventName: string, localtext: string, defaultValue?: string;
}
export class CCDebugTool_DemoTextEntry extends CCPanel<ICCDebugTool_DemoTextEntry, TextButton> {
	static defaultProps = {
		onBtnClick: (item: Panel) => { },
		onTxtInput: (item: Panel) => { },
		defaultValue: ""
	};
	render() {
		return (
			this.__root___isValid &&
			<Panel ref={this.__root__}  {...this.initRootAttrs()} >
				<TextButton className="DemoTextEntry" style={{ flowChildren: "right" }} onactivate={this.props.onBtnClick} localizedText={this.props.localtext}>
					<TextEntry id="DemoTextEntry" text={this.props.defaultValue} oninputsubmit={this.props.onTxtInput}>
					</TextEntry>
				</TextButton>
			</Panel>
		);
	}
}

interface ICCDebugTool_DemoSlider {
	eventName: string, titletext: string, min: number, max: number, defaultValue: number, onChange: (value: number) => void;
}
export class CCDebugTool_DemoSlider extends CCPanel<ICCDebugTool_DemoSlider> {
	static defaultProps = {
		onChange: (value: number) => { },
	};
	onInitUI() {
		this.UpdateState({ defaultValue: this.props.defaultValue });
	}
	render() {
		const value = this.GetState<number>("defaultValue");
		const min = this.props.min;
		const max = this.props.max;
		return (
			this.__root___isValid &&
			<Panel ref={this.__root__} className="DemoSlider" {...this.initRootAttrs()} >
				<CCPanel flowChildren="right">
					<Label className="Title" text={this.props.titletext} />
					<Label className="Value" text={"" + value} />
				</CCPanel>
				<Slider className="HorizontalSlider" value={(this.props.defaultValue - min) / (max - min)} direction="horizontal"
					onvaluechanged={self => {
						let v = self.value * (max - min) + min;
						this.props.onChange(v);
						this.UpdateState({ defaultValue: v });
					}}
					onload={self => {
						this.props.onChange(self.value * (max - min) + min);
					}} />
			</Panel>
		);
	}
}


/** 打开一个面板 */
interface ICCDebugTool_DemoSelectionButton {
	eventName: string, localtext: string;
}
export class CCDebugTool_DemoSelectionButton extends CCPanel<ICCDebugTool_DemoSelectionButton, TextButton> {
	defaultClass() {
		return "DemoButton HotKeyValid ToggleSelection"
	}
	render() {
		return (
			this.__root___isValid &&
			<TextButton ref={this.__root__} id={this.props.eventName} localizedText={this.props.localtext}   {...this.initRootAttrs()} >
				<CCIcon_Arrow type="SolidRight" width="10px" align="right center" marginRight="4px" />
			</TextButton>
		);
	}
}

/** 选择容器 */
interface ICCDebugTool_SelectContainer {
	DomainPanel?: CCPanel;
	/** 事件名 */
	eventName?: string,
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
		hasToggleList: Object.keys(this.props.toggleList!).length > 0,
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
	};
	// 切换锁定
	toggleLock = () => {
		this.setState({ lock: !this.state.lock });
	};
	// 拖拽相关
	dragable = false;
	dragPanel: Panel & { offsetX?: number, offsetY?: number; } | undefined = undefined;
	dragStart = (panel: Panel & { dragable?: boolean; }) => {
		if (this.props.hasDragable != false && this.props.DomainPanel != null) {
			this.dragable = true;
			this.GetNodeChild
			let parent = this.props.DomainPanel.__root__.current;
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
		const { title: text, toggleList } = this.props;
		const { lock, size } = this.state;
		return (
			this.__root___isValid &&
			<Panel ref={this.__root__}  {...this.initRootAttrs()} >
				<CCPanel className={CSSHelper.ClassMaker("SelectionContainer show", { LockWindow: lock })} hittest={true} width={size.width} height={size.height}>
					<Panel id="SelectionPicker" >
						<Panel id="SelectionPickerHeader" onactivate={() => { }} onmouseover={self => this.dragStart(self)} onmouseout={self => this.dragable = false}>
							<Label id="SelectionTitle" localizedText={text} />
							<Panel className="FillWidth" />
							{this.props.hasFilter != false &&
								<Panel id="SelectionSearch" className="SearchBox" >
									{this.state.hasToggleList &&
										<CCDropDownButton placeholder="筛选" onChange={(index, item) => {
											if (this.props.onToggleType) {
												this.props.onToggleType(Object.keys(toggleList!)[index - 1]);
											}
										}} onClear={() => {
											if (this.props.onToggleType) {
												this.props.onToggleType("");
											}
										}}>
											<Label id="CC_DropDown_Clear" text="X 清除筛选" />
											{Object.keys(toggleList!).map((key, _index) => {
												return <Label key={_index} text={toggleList![key]} />;
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
							<CCIconButton width="28px" tooltip={"关闭窗口"} tooltipPosition="top" icon={<CCIcon_XClose type="Default" />} onactivate={() => { this.props.DomainPanel && this.props.DomainPanel.close() }} />
						</Panel>
						{/* 物品列表 */}
						<Panel id="SelectionList" >
							{this.props.children}
						</Panel>
					</Panel>
				</CCPanel>
			</Panel >
		);
	}
}










