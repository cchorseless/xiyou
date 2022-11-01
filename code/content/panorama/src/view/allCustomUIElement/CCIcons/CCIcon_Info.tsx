import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIcon } from "./CCIcon";

export class CCIcon_Info extends CCIcon<{ type?: "Default" | "Tui6" | "Tui7"; }> {
	static defaultProps = {
		type: CSSHelper.DEFAULT_ADDON_TYPE,
	};
	defaultStyle = () => {
		switch (this.props.type) {
			case "Default":
				return {
					src: "s2r://panorama/images/control_icons/icon_info_png.vtex",
				};
			case "Tui6":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui6/info_png.vtex",
				};
			case "Tui7":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui7/mini_info_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/icon_info_png.vtex",
				};
		}
	}
}