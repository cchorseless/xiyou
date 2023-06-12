import React from 'react';
import { CSSHelper } from '../../../helper/CSSHelper';
import { CCPanel } from '../CCPanel/CCPanel';
import { CCImageNumber } from './CCImageNumber';
import "./CCScrollImageNumber.less";

type IScrollNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | number;

interface ICCScrollImageNumber {
    isaniplay?: boolean,
    anistoptime?: number,
    start?: IScrollNumber,
    to?: IScrollNumber,
    anistopFunc?(): void,
    type: "1" | "2" | "3" | "4" | "5" | "9";
}

export class CCScrollImageNumber extends CCPanel<ICCScrollImageNumber> {
    defaultClass() { return "CCScrollImageNumber" };

    onInitUI() {
        let isaniplaying = false;
        GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            const isaniplay = this.props.isaniplay || false;
            if (isaniplay && isaniplaying == false) {
                isaniplaying = true;
                const anistoptime = this.props.anistoptime || 1;
                GTimerHelper.AddTimer(anistoptime - 0.5, GHandler.create(this, () => {
                    this.UpdateState({ NumberScrollFinish: true })
                    GTimerHelper.AddTimer(0.5, GHandler.create(this, () => {
                        isaniplaying = false
                        this.props.anistopFunc && this.props.anistopFunc();
                    }))

                }))
            }
            return 0.1;
        }))
    }
    render() {
        const to = this.props.to || 0;
        const start = this.props.start || 0;
        const isaniplay = this.props.isaniplay || false;
        const NumberScrollFinish = isaniplay && this.GetState<boolean>("NumberScrollFinish");
        return (<Panel ref={this.__root__}      {...this.initRootAttrs()}>
            <CCPanel width="40px" height="50px" >
                <CCPanel className={CSSHelper.ClassMaker({ NumberBox: isaniplay, ["NumberScrollFinish" + to]: NumberScrollFinish })} flowChildren='down' scroll={"noclip"}>{
                    [...Array(10)].map((v, index) => {
                        let height = 0;
                        if (!isaniplay && start == index) {
                            height = 50;
                        }
                        else if (isaniplay && !NumberScrollFinish) {
                            height = 50;
                        }
                        else if (NumberScrollFinish && to == index) {
                            height = 50;
                        }
                        return <CCImageNumber key={index + ""} type={this.props.type} value={index} width='40px' height={height + "px"} />
                    })
                }
                </CCPanel>
            </CCPanel>
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}