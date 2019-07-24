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
    wrapperEle: Element,
    firstProps: T,
): ComponentType<T> {
    /** 当前属性暂存 */
    let storeProps = firstProps;
    /** 当前包装器的编号 */
    const id = wrapperEle.getAttribute('id')!;
    /** 当前包装器的父级元素 */
    const parent = wrapperEle.parentElement!;
    /** 是否是函数式组件 */
    const isFunction = isFunctional(component);

    /** 更新组件 */
    function update(props: Partial<T> = {}) {
        storeProps = { ...storeProps, ...props };

        // 函数式组件
        if (isFunction) {
            render((component as FunctionalComponent)(storeProps), parent, wrapperEle);
        }
        // 类组件
        else {
            // FIXME: 真的能这样刷新？
            render(h(component as any, storeProps), parent, wrapperEle);
        }
    }

    /** 销毁组件 */
    function destroy() {
        const parentEle = wrapperEle.parentElement;

        if (!parentEle) {
            return;
        }

        const newEle = document.createElement('div');

        newEle.setAttribute('id', id);

        parentEle.insertBefore(newEle, wrapperEle);
        parentEle.removeChild(wrapperEle);
    }

    return {
        update,
        destroy,
    };
}

/** 自动隐藏的插件存储的数据 */
export interface HiddenData {
    [id: string]: {
        /** 隐藏时候的时间戳 */
        time: number;
        /** 当前插件需要保存的数据 */
        meta: string;
    };
}

/** 自动隐藏数据储存 key */
export const HiddenKey = 'bothub-widget-hide';
