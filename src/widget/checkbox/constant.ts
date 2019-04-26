import { WidgetType, WidgetDataCommon } from '../helper';

/** 确认框插件数据接口 */
export interface CheckboxData extends WidgetDataCommon {
    /** 确认框插件类型 */
    type: WidgetType.Checkbox;
    /**
     * 让用户能够在没有现有会话的情况下登录，同时启用“不是你”选项
     *  - 默认为`true`
     */
    allowLogin?: boolean;
    /**
     * 插件大小
     *  - 默认为`large`
     */
    size?: 'small' | 'medium' | 'large' | 'standard' | 'xlarge';
    /**
     * 插件内容的色彩主题
     *  - `light`：插件显示深色文本
     *  - `dark`：插件显示白色文本、透明 messenger 图标和白色闪电图标
     *  - 默认为`light`
     */
    skin?: 'light' | 'dark';
    /**
     * 插件内容是否居中对齐
     *  - 默认为`false`
     */
    centerAlign?: boolean;
    /**
     * 用户勾选确认后多少天内自动隐藏
     *  - 默认为`-1`，意为不使用此功能
     */
    hideAfterChecked?: number;
    /**
     * Checkbox 点击选中事件
     * @param {string} userRef 当前用户编号
     */
    check?(userRef: string): void;
    /**
     * Checkbox 点击取消事件
     * @param {string} userRef 当前用户编号
     */
    unCheck?(userRef: string): void;
}

/** Facebook 核心插件的属性 */
export interface FbCheckboxAttrs extends Omit<
    CheckboxData,
    'type' | 'id' | 'check' | 'unCheck' | 'bhRef' | 'hideAfterChecked'
> {
    /** 插件加载网址的基域 */
    origin: string;
    /** Facebook 应用编号 */
    messengerAppId: string | number;
    /**
     * 用于指代用户的唯一参数。最多 250 个字符。
     *  - 有效字符为 `a-z` `A-Z` `0-9` `+/=-._`
     */
    userRef: string;
}

/** 虚拟组件参数 */
export interface ComponentProps {
    /** 当前组件编号 */
    id: string;
    /** 等待插件加载 */
    loading: boolean;
    /** facebook 插件属性集合 */
    attrs: FbCheckboxAttrs;
}

export const fbClass = 'fb-messenger-checkbox';
export const bhClass = 'bothub-messenger-checkbox';
