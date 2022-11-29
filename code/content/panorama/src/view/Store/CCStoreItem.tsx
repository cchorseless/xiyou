
import React, { createRef, PureComponent } from "react";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import "./CCStoreItem.less";


interface ICCStoreItem extends IGoodsInfo {
}

export class CCStoreItem extends CCPanel<ICCStoreItem> {



    render() {
        return (
            this.__root___isValid &&
            <Panel className="CC_StoreItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <Label id="StoreItemName" text={sName} />
                <Image id="StoreItemImg" src={sItemImg} />
                {(num != undefined && Number(num) > 1) && <Panel id="StoreItemNumBG" >
                    <Label id="StoreItemNum" text={`X${num}`} />
                </Panel>}
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}