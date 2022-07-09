/** Create By Editor*/
			import React, { createRef, useState } from "react";
			import { HeroFashionItem_UI } from "./HeroFashionItem_UI" ;
			export class HeroFashionItem extends HeroFashionItem_UI {
				// 初始化数据
				componentDidMount() {
					super.componentDidMount();
				};
				/**
				 *更新渲染
				 * @param prevProps 上一个状态的 props
				 * @param prevState
				 * @param snapshot
				 */
				componentDidUpdate(prevProps: any, prevState: any, snapshot?: any) {
					super.componentDidUpdate(prevProps, prevState, snapshot);
				};
				// 销毁
				componentWillUnmount() {
					super.componentWillUnmount();
				};
			}
			