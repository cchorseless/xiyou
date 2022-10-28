import classNames from "classnames";
import React from "react";
import EOM_Icon from "./CCIcon";

export default class EOM_IconSearch extends EOM_Icon<{ type?: "Shadow"; }> {
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Shadow":
				return {
					src: "s2r://panorama/images/control_icons/icon_search_shadow_psd.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/icon_search_png.vtex",
				};
		}
	})();
}