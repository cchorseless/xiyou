import { CCIcon } from "./CCIcon";

interface ICCIcon_CoinType {

    cointype: CoinType;
}

export class CCIcon_CoinType extends CCIcon<ICCIcon_CoinType> {
    defaultStyle() {
        let superStyle = super.defaultStyle();
        let src = "";
        switch (this.props.cointype) {
            case "Gold":
                src = "s2r://panorama/images/custom_game/icon/gold_png.vtex";
                break;
            case "SoulCrystal":
                src = "s2r://panorama/images/custom_game/icon/soulcrystal_png.vtex";
                break;
            case "Wood":
                src = "s2r://panorama/images/custom_game/icon/wood_png.vtex";
                break;
            case "Population":
                src = "s2r://panorama/images/custom_game/icon/population_png.vtex";
                break;
            case "MetaStone":
                src = "s2r://panorama/images/custom_game/icon/metastone_png.vtex";
                break;
            case "StarStone":
                src = "s2r://panorama/images/custom_game/icon/starstone_png.vtex";
                break;
        }
        if (src.length > 0) {
            superStyle.src = src;
        }
        return superStyle;
    }
}