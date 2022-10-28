import { DEFAULT_ADDON_TYPE } from "../config";
import EOM_Icon from "./CCIcon";

export default class EOM_History extends EOM_Icon<{ type?: "Tui7"; }> {
	static defaultProps = {
		type: DEFAULT_ADDON_TYPE
	};
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Tui7":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui7/history_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/history_png.vtex",
				};
		}
	})();
}