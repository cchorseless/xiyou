import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIcon } from "./CCIcon";

interface IIcon_ArrowType {
	type?: "DoubleRight" | "DoubleRightThin" | "DoubleLeft" | "DoubleLeftThin" | "Dropdown" | "DropdownUp" | "Left" | "Right" | "ArrowLeft" | "ArrowRight" | "SolidUp" | "SolidDown" | "SolidLeft" | "SolidRight" | "TopRight" | "UpDown" | "Popout" | "RightUp" | "Download" | "ReturnToGame" | "Shuffle" | "Swap" | "Expand" | "Minimize" | "Maximize" | "Move";
}

export class CCIcon_Arrow extends CCIcon<IIcon_ArrowType> {
	defaultClass() { return CSSHelper.ClassMaker(this.props.className, "CC_Icon", { CC_IconSpin: this.props.spin || this.props.spinDuration, CC_IconShadow: this.props.shadow, Mirror: this.props.type == "DoubleLeft" }); };
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "DoubleLeft":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_double_psd.vtex",
				});
			case "DoubleRight":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_double_psd.vtex",
				});
			case "DoubleLeftThin":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/double_arrow_left_png.vtex",
				});
			case "DoubleRightThin":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/double_arrow_right_png.vtex",
				});
			case "DropdownUp":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_dropdown_up_png.vtex",
				});
			case "Dropdown":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_dropdown_png.vtex",
				});
			case "Left":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_min_left_psd.vtex",
					width: "18px",
					height: "width-percentage(175%)",
				});
			case "Right":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_min_right_psd.vtex",
					width: "18px",
					height: "width-percentage(175%)",
				});
			case "ArrowLeft":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_left_png.vtex",
				});
			case "ArrowRight":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_right_png.vtex",
				});
			case "SolidUp":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_solid_up_png.vtex",
					height: "width-percentage(60%)",
				});
			case "SolidDown":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_solid_down_png.vtex",
					height: "width-percentage(60%)",
				});
			case "SolidLeft":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_solid_left_png.vtex",
					width: "19px",
					height: "width-percentage(167%)",
				});
			case "SolidRight":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_solid_right_png.vtex",
					width: "19px",
					height: "width-percentage(167%)",
				});
			case "TopRight":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_top_right_psd.vtex",
				});
			case "UpDown":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_up_down_psd.vtex",
				});
			case "Popout":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_popout_png.vtex",
				});
			case "RightUp":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_right_up_psd.vtex",
				});
			case "Download":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/download_png.vtex",
				});
			case "ReturnToGame":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/return_to_game_png.vtex",
				});
			case "Shuffle":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/shuffle_psd.vtex",
					height: "width-percentage(87.5%)",
				});
			case "Swap":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/swap_psd.vtex",
					height: "width-percentage(84%)",
				});
			case "Expand":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/expand_png.vtex",
				});
			case "Minimize":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/restore_icon_psd.vtex",
				});
			case "Maximize":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/maximize_icon_psd.vtex",
				});
			case "Move":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/move_png.vtex",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/arrow_right_up_psd.vtex",
				});
		}
	}
}