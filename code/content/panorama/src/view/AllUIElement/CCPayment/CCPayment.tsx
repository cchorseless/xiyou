import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";

import "./CCPayment.less";

interface ICCPayment extends NodePropsData {
    gid: string, num: number, title: string, body: string;
}

export class CCPayment extends CCPanel<ICCPayment> {



    render() {
        return (
            <Panel className="CC_Payment" ref={this.__root__} {...this.initRootAttrs()}>
                <Panel id="PaymentMain" className="CommonWindowBG" hittest={false}>
                    <Button className="CommonCloseButton" onactivate={HidePopup} />
                    <Panel id="DefaultPayments">
                        {defaultNode}
                    </Panel>
                </Panel>
                <Panel id="MorePaymentMethod" hittest={false}>
                    <TextEntry id="PaymentSearch" ontextentrychange={onSearch} oninputsubmit={onSearch} ref={refText} placeholder="#DOTA_Search" />
                    <Panel id="MorePaymentMethodList" hittest={false}>
                        {filteredPayments.map(([pmid, enable]) => {
                            if (enable > 0) {
                                let payType = (notPayssion.indexOf(pmid) == -1 ? "4000" : pmid) as PaymentType;
                                return (
                                    <Panel key={pmid} className="Paytype" onactivate={() => { requestLinkAndOpen(payType, pmid); }}>
                                        <Image src={`file://{images}/custom_game/payssion_icon/${pmid}.png`} />
                                    </Panel>
                                );
                            }
                        })}
                    </Panel>
                </Panel>
                <Panel id="overSeaCodeContainer" className="CommonWindowBG" visible={overSeaCode != undefined} hittest={false}>
                    <Button className="CommonCloseButton" onactivate={() => { SetOverSeaCode(undefined); }} />
                    {overSeaCode}
                </Panel>
            </Panel>
        )
    }
}