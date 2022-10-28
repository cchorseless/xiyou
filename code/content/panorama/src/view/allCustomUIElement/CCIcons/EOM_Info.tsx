import { DEFAULT_ADDON_TYPE } from "../config";
import EOM_Icon from "./CCIcon";

export default class EOM_Info extends EOM_Icon<{ type?: "Default" | "Tui6" | "Tui7"; }> {
	static defaultProps = {
		type: DEFAULT_ADDON_TYPE,
	};
	defaultIconAttribute = (() => {
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
	})();
}