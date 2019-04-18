import { warn } from 'src/lib/print';
import { addClass } from 'src/lib/dom';

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
const WarpperClassName = 'bothub-widget-warpper';

/** 类的公共实现 */
export interface WidgetCommon {
    /** 当前插件的唯一编号 */
    id: string;
    /** 当前插件的类型 */
    type: WidgetType;
    /** 当前插件的 DOM 属性 */
    attrs: object;
    /** 是否可以渲染 */
    canRender: boolean;
    /** 当前是否已经渲染 */
    isRendered: boolean;
    /** 当前插件的渲染函数 */
    render(): void;
}

/** 插件数据公共接口 */
export interface WidgetDataCommon {
    /** 当前插件的唯一编号 */
    id: string;
    /** Facebook 主页编号 */
    pageId: string;
}

/** 未找到插件 ID 时的报错日志 */
export function renderNotFound(name: string, id: string) {
    warn(
        `Can not find the ${name} Plugin element with ID: ${id}, Skip.`,
        true,
    );
}

/** 获取并创建本体以及包装 */
export function getWarpperById(name: string, id: string) {
    const warpper = document.getElementById(id);

    // 未找到包装的 DOM
    if (!warpper) {
        renderNotFound(name, id);
        return {};
    }

    addClass(warpper, WarpperClassName);

    const dom = Boolean(warpper.firstElementChild)
        ? warpper.firstElementChild
        : warpper.appendChild(document.createElement('div'));

    return { warpper, dom };
}

/** Facebook 插件渲染 */
export function renderDom(...args: Parameters<FacebookSDK['XFBML']['parse']>) {
    if (window.FB) {
        window.FB.XFBML.parse(...args);
    }
}

export function setAttributes<U extends object, T extends keyof U>(dom: Element, attrs: U, props?: T[]) {
    const keys = props ? props : Object.keys(attrs) as T[];

    keys.forEach((key) => {
        const name = (key as string).replace(/([A-Z])/g, (_, item1: string) => {
            return `_${item1.toLowerCase()}`;
        });

        if (attrs[key]) {
            dom.setAttribute(name, String(attrs[key]));
        }
    });
}
