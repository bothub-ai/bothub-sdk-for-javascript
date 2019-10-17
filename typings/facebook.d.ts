/**
 * facebook 初始化函数参数
 * @link https://developers.facebook.com/docs/javascript/reference/FB.init/v3.2
 */
interface InitParams {
    /**
     * Your application ID
     *  - Defaults to `null`.
     */
    appId?: string | null;
    /**
     * Determines which versions of the Graph API and any API dialogs or plugins are invoked when using the `.api()` and `.ui()` functions. Valid values are determined by currently available versions, such as `v2.0`.
     */
    version: string;
    /**
     * Determines whether a cookie is created for the session or not. If enabled, it can be accessed by server-side code.
     *  - Defaults to `false`.
     */
    cookie?: boolean;
    /**
     * Determines whether the current login status of the user is freshly retrieved on every page load. If this is disabled, that status will have to be manually retrieved using `.getLoginStatus()`.
     *  - Defaults to `false`.
     */
    status?: boolean;
    /**
     * Determines whether XFBML tags used by social plugins are parsed, and therefore whether the plugins are rendered or not.
     *  - Defaults to `false`.
     */
    xfbml?: boolean;
    /**
     * Frictionless Requests are available to games on Facebook.com or on mobile web using the JavaScript SDK. This parameter determines whether they are enabled.
     *  - Defaults to `false`.
     */
    frictionlessRequests?: boolean;
    /**
     * This specifies a function that is called whenever it is necessary to hide Adobe Flash objects on a page. This is used when `.api()` requests are made, as Flash objects will always have a higher `z-index` than any other DOM element. See our Custom Flash Hide Callback for more details on what to put in this function.
     *  - Defaults to `null`.
     */
    hideFlashCallback?: Function | null;
}

/** facebook 初始化函数 */
interface AsyncInit {
    (): void;
    hasRun?: boolean;
}

/** facebook 插件事件基础接口 */
interface PluginEvent {
    /** 事件名称 */
    event: string;
    /** DOM 元素中设置的`data-ref`的值 */
    ref: null | string;
    /** 弹出窗口确认之后是否发生了事件 */ 
    is_after_optin?: boolean;
}

/** Checkbox 事件接口 */
export interface CheckboxEvent extends PluginEvent {
    event: 'rendered' | 'checkbox' | 'not_you' | 'hidden';
    /** 当前确认框状态 */
    state: 'unchecked' | 'checked';
    /** DOM 元素中设置的`user_ref`的值 */
    user_ref: string;
}

/** Send To Messenger 事件接口 */
export interface SendToMessengerEvent extends PluginEvent {
    event: 'rendered' | 'clicked' | 'not_you' | 'opt_in';
}

/** 事件订阅函数接口 */
interface EventSubscription {
    /**
     * Fired when FB.XFBML.parse() completes. This indicates that all of the social plugins on the page have been loaded.
     * @link https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/v3.2
     */
    (name: 'xfbml.render', callback: () => void): void;
    /**
     * Checkbox 事件订阅接口
     * @link https://developers.facebook.com/docs/messenger-platform/discovery/checkbox-plugin/
     */
    (name: 'messenger_checkbox', callback: (event: any) => void): void;
    /**
     * Send To Messenger 事件订阅接口
     * @link https://developers.facebook.com/docs/messenger-platform/discovery/send-to-messenger-plugin/
     */
    (name: 'send_to_messenger', callback: (event: any) => void): void;
    /**
     * This function provides the ability to subscribe to the plugin load event.
     * It is emitted when the Facebook JavaScript SDK has been initialized and the plugin is about to load.
     * The callback function is a required parameter.
     * @link https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/sdk
     */
    (name: 'customerchat.load', callback: () => void): void;
    (name: 'customerchat.show', callback: () => void): void;
    (name: 'customerchat.hide', callback: () => void): void;
    (name: 'customerchat.dialogShow', callback: () => void): void;
}

/** 解除事件订阅函数接口 */
interface EventUnSubscription {
    (name: 'xfbml.render', callback: () => void): void;
}

/** 应用事件名称 */
export declare enum AppEventNames {
    ACHIEVED_LEVEL,
    ADDED_PAYMENT_INFO,
    ADDED_TO_CART,
    ADDED_TO_WISHLIST,
    COMPLETED_REGISTRATION,
    COMPLETED_TUTORIAL,
    INITIATED_CHECKOUT,
    PAGE_VIEW,
    RATED,
    SEARCHED,
    SPENT_CREDITS,
    UNLOCKED_ACHIEVEMENT,
    VIEWED_CONTENT,
}

/** 应用参数名称 */
export declare enum AppParameterNames {
    APP_USER_ID,
    APP_VERSION,
    CONTENT_ID,
    CONTENT_TYPE,
    CURRENCY,
    DESCRIPTION,
    LEVEL,
    MAX_RATING_VALUE,
    NUM_ITEMS,
    PAYMENT_INFO_AVAILABLE,
    REGISTRATION_METHOD,
    SEARCH_STRING,
    SUCCESS,
}

/** 应用事件部分接口 */
interface AppEvents {
    EventNames: typeof AppEventNames;
    ParameterNames: typeof AppParameterNames;

    logEvent(eventName: string, valueToSum?: number | null, parameters?: object): void;
    logPurchase(purchaseAmount: number, currency: string, parameters?: object): void;
    logPageView(): void;

    setUserID(userID: string): void;
    getUserID(): string;
    clearUserID(): void;
    updateUserProperties(params: AnyObject<string | number>, cb?: (response: object) => void): void;

    activateApp(): void;
    setAppVersion(appVersion: string): void;
    getAppVersion(): string;
    clearAppVersion(): void;
}

/** Facebook 接口定义 */
interface SDK {
    /** 初始化函数 */
    init(params: InitParams): void;
    /** 事件模块 */
    Event: {
        subscribe: EventSubscription;
        unsubscribe: EventUnSubscription;
    };
    /** 页面插件渲染模块 */
    XFBML: {
        parse(dom?: Element, cb?: () => void): void;
    };
    /** facebook 应用事件模块 */
    AppEvents: AppEvents;
}

declare global {
    interface Window {
        FB: SDK;
        fbAsyncInit: AsyncInit;
        bhAsyncInit: Array<() => void> | (() => void);
    }
}
