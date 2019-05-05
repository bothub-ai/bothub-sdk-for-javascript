import { log } from 'src/lib/print';
import { local } from 'src/lib/cache';
import { daysOffset } from 'src/lib/time';
import { fromCamelCase } from 'src/lib/string';

import {
    h,
    render,
    Component,
    AnyComponent,
    ComponentConstructor,
    FunctionalComponent,
} from 'preact';

/** 插件类型 */
export enum WidgetType {
    // 原生
    Checkbox,
    Customerchat,
    SendToMessenger,
    MessageUs,
    ShareButton,
    // 封装
    Discount,
}

/** 对象属性名称由驼峰转为下划线 */
export function underlineObject(from: object) {
    const result: object = {};

    for (const key in from) {
        if (from.hasOwnProperty(key)) {
            result[fromCamelCase(key)] = from[key];
        }
    }

    return result;
}

/** 组件类型 */
export interface ComponentType<T extends object = object> {
    update(props?: Partial<T>): void;
    destroy(): void;
}

/** 是否是函数组件 */
const isFunctional = <U extends object>(x: AnyComponent<U>): x is FunctionalComponent<U> => {
    return Object.getPrototypeOf(x) !== Component;
};

/** preact 组件包装器 */
export function componentWarpper<T extends object>(
    component: FunctionalComponent<T> | ComponentConstructor<T, object>,
    warpperEle: Element,
    firstProps: T,
): ComponentType<T> {
    /** 当前属性暂存 */
    let storeProps = firstProps;
    /** 当前包装器的编号 */
    const id = warpperEle.getAttribute('id')!;
    /** 是否是函数式组件 */
    const isFunction = isFunctional(component);

    /** 更新组件 */
    function update(props: Partial<T> = {}) {
        storeProps = { ...storeProps, ...props };

        // 函数式组件
        if (isFunction) {
            render((component as FunctionalComponent)(storeProps), document.body, warpperEle);
        }
        // 类组件
        else {
            // FIXME: 真的能这样刷新？
            render(h(component as any, storeProps), document.body, warpperEle);
        }
    }

    /** 销毁组件 */
    function destroy() {
        const parentEle = warpperEle.parentElement;

        if (!parentEle) {
            return;
        }

        const newEle = document.createElement('div');

        newEle.setAttribute('id', id);

        parentEle.insertBefore(newEle, warpperEle);
        parentEle.removeChild(warpperEle);
    }

    return {
        update,
        destroy,
    };
}

/** 可以设定自动隐藏的组件所需要的基础接口 */
interface HiddenWidget {
    /** 组件编号 */
    id: string;
    /** 组件名称 */
    name: string;
    /** 储存隐藏时间的键名 */
    hidenKey: string;
    /** 自动隐藏配置 */
    hideAfterChecked: number;
}

/** 设置自动隐藏储存数据 */
export function setHiddenTime(widget: HiddenWidget) {
    if (widget.hideAfterChecked > 0) {
        local.set(widget.hidenKey, new Date().getTime());
    }
}

/** 检查是否自动隐藏 */
export function checkHiddenTime(widget: HiddenWidget) {
    const lastHideTime = local.get<number>(widget.hidenKey) || 0;
    const offset = daysOffset(new Date(), lastHideTime);

    // 还在隐藏时间范围内
    if (offset < widget.hideAfterChecked) {
        log(`${widget.name} with id ${widget.id}, set auto hide, skip`);
        return false;
    }
    // 超过时间范围
    else {
        local.remove(widget.hidenKey);
    }

    return true;
}
