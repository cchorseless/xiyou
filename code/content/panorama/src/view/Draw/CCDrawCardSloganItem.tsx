import React from "react";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCDrawCardSloganItem.less";

interface ICCDrawCardSloganItem {
    bStarUp?: boolean;
    bSect?: boolean;
    bWanted?: boolean;
}


export class CCDrawCardSloganItem extends CCPanel<ICCDrawCardSloganItem> {

    render() {
        return (<Panel className="CCDrawCardSloganItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            {
                this.props.bStarUp && <CCButton id="slogan_star_up" color="Gold" >
                    <Label className="CCDrawCardSloganName" text={"升星"} />
                </CCButton>
            }
            {
                this.props.bSect && <CCButton id="slogan_sect" color="Red" >
                    <Label className="CCDrawCardSloganName" text={"组合"} />
                </CCButton>
            }
            {
                this.props.bWanted && <CCButton id="slogan_wanted" color="Blue" >
                    <Label className="CCDrawCardSloganName" text={"心愿单"} />
                </CCButton>
            }
        </Panel>)
    }
}