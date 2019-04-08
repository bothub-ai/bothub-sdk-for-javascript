/** 插件类型 */
export const enum WidgetType {
    Checkbox,
    Customerchat,
    Discount,
    SendToMessenger,
    MessageUs,
}

/** 插件对应的 facebook 渲染的 class 名称 */
export const WidgetFbClass = {
    [WidgetType.Checkbox]: 'fb-messenger-checkbox',
    [WidgetType.Customerchat]: 'fb-customerchat',
    [WidgetType.Discount]: 'bothub-discount',
    [WidgetType.SendToMessenger]: 'fb-send-to-messenger',
    [WidgetType.MessageUs]: 'fb-messengermessageus',
};

/** 插件基础接口 */
interface BaseWidgetData {
    /** 当前插件的唯一编号 */
    id: string;
    /** Facebook 主页编号 */
    pageId: number;
}

/**
 * 确认框数据接口
 * @link https://developers.facebook.com/docs/messenger-platform/reference/web-plugins#checkbox
 */
export interface CheckboxData extends BaseWidgetData {
    type: WidgetType.Checkbox;
    /** 插件加载网址的基域 */
    origin: string;
    /** 指代用户的唯一标识符 */
    userRef: string;
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
    center_align?: boolean;
}

/**
 * 聊天插件数据接口
 * @link https://developers.facebook.com/docs/messenger-platform/reference/web-plugins/#customer_chat
 */
export interface CustomerchatData extends BaseWidgetData {
    type: WidgetType.Customerchat;
    /** 主题颜色 */
    themeColor?: string;
    /**
     * 对当前已登录 Facebook 的用户显示的欢迎语
     * 不超过 80 个字符
     */
    loggedInGreeting?: string;
    /**
     * 对当前未登录 Facebook 的用户显示的欢迎语
     * 不超过 80 个字符
     */
    loggedOutGreeting?: string;
    /**
     * 设置欢迎对话框的显示方式，支持下列值：
     *  - `show`：通过 greeting_dialog_delay 属性设置延迟多少秒才在桌面端和移动端显示欢迎对话框，并保持开启
     *  - `hide`：欢迎对话框将一直隐藏，除非用户在桌面端和移动端点击插件才会显示
     *  - `fade`：通过 greeting_dialog_delay 属性设置延迟多少秒才短暂显示欢迎对话框，之后使其淡出，并在桌面端隐藏。对话框会在移动端隐藏
     */
    greetingDialogDisplay?: 'show' | 'hide' | 'fade';
    /** 设置插件加载后延迟多少秒才显示欢迎对话框 */
    greetingDialogDelay?: number;
    /** 传回其他上下文的参考参数。 */
    ref?: number;
}

/**
 * 砍价插件数据接口
 * @link TODO:
 */
export interface DiscountData extends BaseWidgetData {
    type: WidgetType.Discount;
}

/**
 * “发送至Messenger”插件
 * @link https://developers.facebook.com/docs/messenger-platform/reference/web-plugins/#send_to_messenger
 */
export interface SendToMessengerData extends BaseWidgetData {
    type: WidgetType.SendToMessenger;
    /**
     * 主题颜色
     *  - 默认为`blue`
     */
    color?: 'blue' | 'white';
    /**
     * 插件大小
     *  - 默认为`large`
     */
    size?: 'standard' | 'large' | 'xlarge';
    /**
     * 自定义状态参数。最多 250 个字符
     *  - 有效字符为`a-z A-Z 0-9 +/=-._`
     *  - 出于安全考虑，应编码和加密
     */
    dataRef?: string;
    /**
     * 如果为 true，则点击该按钮时，
     * 已登录用户必须重新登录，
     * 默认为 false
     */
    enforceLogin?: boolean;
}

/**
 * “给我们发消息”插件
 * @link https://developers.facebook.com/docs/messenger-platform/reference/web-plugins/#message_us
 */
export interface MessageUsData extends BaseWidgetData {
    type: WidgetType.MessageUs;
    /**
     * 主题颜色
     *  - 默认为`blue`
     */
    color: 'blue' | 'white';
    /**
     * 插件大小
     *  - 默认为`large`
     */
    size: 'standard' | 'large' | 'xlarge';
}

/** 插件数据集合 */
export type WidgetData = CheckboxData | CustomerchatData | DiscountData | SendToMessengerData | MessageUsData;
