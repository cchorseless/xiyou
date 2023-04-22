import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCItemLockStars.less";

interface ICCItemLockStars extends NodePropsData {
    iUnlockStar?: number,
}

export class CCItemLockStars extends CCPanel<ICCItemLockStars> {

    onInitUI() {
    }

    onStartUI() {
    }
    render() {
        const iUnlockStar = this.props.iUnlockStar!;
        return <Panel className="CCItemLockStars" ref={this.__root__} hittest={false}   {...this.initRootAttrs()}>
            {
                [...Array(iUnlockStar)].map((_, index) => {
                    return <Image key={index} className="ItemLockStar" />
                })
            }
        </Panel>
    }
}