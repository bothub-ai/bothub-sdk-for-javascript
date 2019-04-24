import { warn } from 'src/lib/print';
import { addClass } from 'src/lib/dom';
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
export const enum WidgetType {
    Checkbox,
    Customerchat,
    Discount,
    SendToMessenger,
    MessageUs,
    ShareButton,
}

/** 包装 DOM 的 class 名称 */
export const WarpperClassName = 'bothub-widget-warpper';

/** 类的公共实现 */
export interface BaseWidget {
    /** 当前插件的唯一编号 */
    id: string;
    /** 当前插件的类型 */
    type: WidgetType;
    /** 当前插件的核心 facebook 插件属性 */
    fbAttrs: object;
    /** 是否可以渲染 */
    canRender: boolean;
    /** 当前是否已经渲染 */
    isRendered: boolean;

    /** 当前插件的 DOM 元素 */
    $el?: HTMLElement;
    /** 当前插件的虚拟组件 */
    $component?: ComponentType;

    /**
     * 当前插件的渲染函数
     * @param {boolean} [focus] 是否强制刷新
     *  - 默认为`false`
     *  - 非强制刷新模式时，插件如果已经渲染出来，则不会触发重新渲染
     */
    parse(focus?: boolean): void;
}

/** 插件数据公共接口 */
export interface WidgetDataCommon {
    /** 当前插件的唯一编号 */
    id: string;
    /** Facebook 主页编号 */
    pageId: string;
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
export type ComponentType<T extends object = object> = {
    update(props?: Partial<T>): void;
    destroy(): void;
};

/** 是否是函数组件 */
const isFunctional = <U extends object>(x: AnyComponent<U>): x is FunctionalComponent<U> => {
    return Object.getPrototypeOf(x) !== Component;
};

/** react 组件包装器 */
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

/** 未找到插件 ID 时的报错日志 */
export function eleNotFound(name: string, id: string) {
    warn(
        `Can not find the ${name} Plugin element with ID: ${id}, Skip`,
        true,
    );
}

/** 获取并创建本体以及包装 */
export function getWarpperById(name: string, id: string) {
    const warpper = document.getElementById(id);

    // 未找到包装的 DOM
    if (!warpper) {
        eleNotFound(name, id);
        return;
    }

    addClass(warpper, WarpperClassName);

    if (!warpper.firstElementChild) {
        warpper.appendChild(document.createElement('div'));
    }

    return warpper;
}
