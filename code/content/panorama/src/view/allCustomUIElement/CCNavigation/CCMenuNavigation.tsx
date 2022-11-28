import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { PathHelper } from "../../../helper/PathHelper";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCImage } from "../CCImage/CCImage";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCMenuNavigation.less";

interface IMenuNavigationProps extends NodePropsData {
	/** 菜单列表 */
	list: string[];
	showlogo?: boolean;
	/** 操作回调 */
	onToggle?: (menuName: string, state: boolean) => void;
}

export class CCMenuNavigation extends CCPanel<IMenuNavigationProps> {
	state = { select_name: "", subscribeEnable: true };

	NoSelectAny() {
		this.UpdateState({ select_name: "", subscribeEnable: true })
	}

	render() {
		return this.__root___isValid &&
			<Panel ref={this.__root__} id="LeftTopMain" hittest={false} {...this.initRootAttrs()}>
				<Panel id="DotaButtonsBG" hittest={false} />
				<Panel id="LeftTopBG" hittest={false} />
				<Panel id="LeftTopGameLogo" className={CSSHelper.ClassMaker({ Showlogo: Boolean(this.props.showlogo) })} hittest={false} />
				<Panel id="CC_MenuButtons" className={CSSHelper.ClassMaker({ Showlogo: Boolean(this.props.showlogo) })} >
					{this.props.list.map((sName, sLoc) => {
						return (
							<Button id={sName} key={sName} className={CSSHelper.ClassMaker("CC_MenuButton", { IsActive: this.state.select_name == sName })}
								onactivate={self => {
									if (this.props.onToggle) {
										this.setState({ subscribeEnable: false });
										this.props.onToggle(sName, this.state.select_name == sName ? false : true);
										this.setState({ subscribeEnable: true });
									}
									this.setState({ select_name: this.state.select_name == sName ? "" : sName });
								}} >
								<CCImage id={`${sName}Icon`} className="LeftTopButtonIcon" backgroundImage={CSSHelper.getCustomImageUrl("icon/" + sName + ".png")} />
								<Label localizedText={"#lang_MenuButton_" + sName} />
							</Button>
						);
					})}
				</Panel>
				{this.__root___childs}
				{this.props.children}
			</Panel>
	}
}

interface MenuButtonAttribute {
	/** 菜单名 */
	menuName: string;
	/** label */
	label?: string | boolean;
	/** 图标 */
	icon?: JSX.Element;
}
/** 左上角按钮组，RPG常用 */
export class CCMenuNavigationButton extends CCPanel<MenuButtonAttribute> {
	state = { hasMark: false, selected: false };
	id: GameEventListenerID | undefined;
	// componentDidMount() {
	// 	if (this.id == undefined) {
	// 		this.id = GameEvents.Subscribe("custom_ui_exclamation", (event) => {
	// 			if (event.name == this.props.menuName) {
	// 				this.setState({ hasMark: true });
	// 			}
	// 		});
	// 	}
	// }
	// componentWillUnmount() {
	// 	if (this.id) {
	// 		GameEvents.Unsubscribe(this.id);
	// 	}
	// }
	OnActive = () => {
		// GameEvents.SendEventClientSide("custom_ui_toggle_windows", { window_name: this.props.menuName });
	};
	render() {
		const { menuName, label, icon } = this.props;
		const { selected } = this.state;
		let name = menuName;
		if (typeof (label) == "string") {
			name = label;
		}
		if ($.Localize("#" + name) != "#" + name) {
			name = $.Localize("#" + name);
		}
		return (
			<TabButton selected={selected} className={CSSHelper.ClassMaker(this.props.className, "CC_MenuButton")} {...this.props} onactivate={self => this.OnActive()}>
				{label &&
					<Label className="CC_MenuLabel" text={name} />
				}
				{this.state.hasMark &&
					<Image className="CC_MenuExclamationMark" />
				}
				{icon}
			</TabButton>
		);
	}
}