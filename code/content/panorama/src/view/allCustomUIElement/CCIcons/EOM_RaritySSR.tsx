import EOM_Icon from "./CCIcon";

export default class EOM_RaritySSR extends EOM_Icon<{ type?: "Tui3"; }> {
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Tui3":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui3/card_rarity_ssr_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui3/card_rarity_ssr_png.vtex",
				};
		}
	})();
}