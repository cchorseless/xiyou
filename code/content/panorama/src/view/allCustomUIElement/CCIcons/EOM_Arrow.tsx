import classNames from "classnames";
import EOM_Icon from "./CCIcon";

interface EOM_ArrowType {
	type?: "DoubleRight" | "DoubleRightThin" | "DoubleLeft" | "DoubleLeftThin" | "Dropdown" | "DropdownUp" | "Left" | "Right" | "ArrowLeft" | "ArrowRight" | "SolidUp" | "SolidDown" | "SolidLeft" | "SolidRight" | "TopRight" | "UpDown" | "Popout" | "RightUp" | "Download" | "ReturnToGame" | "Shuffle" | "Swap" | "Expand" | "Minimize" | "Maximize" | "Move";
}

export default class EOM_Arrow extends EOM_Icon<EOM_ArrowType> {
	defaultClass = () => { return classNames(this.props.className, "EOM_Icon", { EOM_IconSpin: this.props.spin || this.props.spinDuration, EOM_IconShadow: this.props.shadow, Mirror: this.props.type == "DoubleLeft" }); };
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "DoubleLeft":
				return {
					src: "s2r://panorama/images/control_icons/arrow_double_psd.vtex",
				};
			case "DoubleRight":
				return {
					src: "s2r://panorama/images/control_icons/arrow_double_psd.vtex",
				};
			case "DoubleLeftThin":
				return {
					src: "s2r://panorama/images/control_icons/double_arrow_left_png.vtex",
				};
			case "DoubleRightThin":
				return {
					src: "s2r://panorama/images/control_icons/double_arrow_right_png.vtex",
				};
			case "DropdownUp":
				return {
					src: "s2r://panorama/images/control_icons/arrow_dropdown_up_png.vtex",
				};
			case "Dropdown":
				return {
					src: "s2r://panorama/images/control_icons/arrow_dropdown_png.vtex",
				};
			case "Left":
				return {
					src: "s2r://panorama/images/control_icons/arrow_min_left_psd.vtex",
					width: "18px",
					height: "width-percentage(175%)",
				};
			case "Right":
				return {
					src: "s2r://panorama/images/control_icons/arrow_min_right_psd.vtex",
					width: "18px",
					height: "width-percentage(175%)",
				};
			case "ArrowLeft":
				return {
					src: "s2r://panorama/images/control_icons/arrow_left_png.vtex",
				};
			case "ArrowRight":
				return {
					src: "s2r://panorama/images/control_icons/arrow_right_png.vtex",
				};
			case "SolidUp":
				return {
					src: "s2r://panorama/images/control_icons/arrow_solid_up_png.vtex",
					height: "width-percentage(60%)",
				};
			case "SolidDown":
				return {
					src: "s2r://panorama/images/control_icons/arrow_solid_down_png.vtex",
					height: "width-percentage(60%)",
				};
			case "SolidLeft":
				return {
					src: "s2r://panorama/images/control_icons/arrow_solid_left_png.vtex",
					width: "19px",
					height: "width-percentage(167%)",
				};
			case "SolidRight":
				return {
					src: "s2r://panorama/images/control_icons/arrow_solid_right_png.vtex",
					width: "19px",
					height: "width-percentage(167%)",
				};
			case "TopRight":
				return {
					src: "s2r://panorama/images/control_icons/arrow_top_right_psd.vtex",
				};
			case "UpDown":
				return {
					src: "s2r://panorama/images/control_icons/arrow_up_down_psd.vtex",
				};
			case "Popout":
				return {
					src: "s2r://panorama/images/control_icons/arrow_popout_png.vtex",
				};
			case "RightUp":
				return {
					src: "s2r://panorama/images/control_icons/arrow_right_up_psd.vtex",
				};
			case "Download":
				return {
					src: "s2r://panorama/images/control_icons/download_png.vtex",
				};
			case "ReturnToGame":
				return {
					src: "s2r://panorama/images/control_icons/return_to_game_png.vtex",
				};
			case "Shuffle":
				return {
					src: "s2r://panorama/images/control_icons/shuffle_psd.vtex",
					height: "width-percentage(87.5%)",
				};
			case "Swap":
				return {
					src: "s2r://panorama/images/control_icons/swap_psd.vtex",
					height: "width-percentage(84%)",
				};
			case "Expand":
				return {
					src: "s2r://panorama/images/control_icons/expand_png.vtex",
				};
			case "Minimize":
				return {
					src: "s2r://panorama/images/control_icons/restore_icon_psd.vtex",
				};
			case "Maximize":
				return {
					src: "s2r://panorama/images/control_icons/maximize_icon_psd.vtex",
				};
			case "Move":
				return {
					src: "s2r://panorama/images/control_icons/move_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/arrow_right_up_psd.vtex",
				};
		}
	})();
}