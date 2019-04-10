import * as Store from 'src/store';
import * as Print from 'src/lib/print';

import { WidgetType, CheckboxData, SendToMessengerData } from 'src/widget';

/** facebook 初始化函数 */
interface FbAsyncInit {
    (): void;
    hasRun: boolean;
}

/** Checkbox 事件回调堆栈 */
const checkboxCallback = [];
/** Send To Messenger 事件回调堆栈 */
const sendToMessengerCallbacks = [];

/** 加载 facebook SDK */
export function loadFacebookSDK() {
    const id = 'facebook-jssdk';
    let script = document.getElementById(id) as HTMLScriptElement;

    // 网页已经加载脚本
    if (script) {
        // 已加载的脚本是全量 facebook SDK
        if (/sdk\/xfbml\.customerchat\.js$/.test(script.src)) {
            return true;
        }
        else {
            Print.warn(
                'Some other Facebook SDK have been loaded on the website, ' +
                'some features of the Bothub SDK may not be available.',
            );
            return false;
        }
    }

    // 加载 facebook 脚本
    script = document.createElement('script');

    script.id = id;
    script.async = true;
    script.src = `https://connect.facebook.net/${Store.language}/sdk/xfbml.customerchat.js`;

    document.getElementsByTagName('head')[0].appendChild(script);

    return true;
}

function bothubFacebookInit() {
    // Facebook SDK 初始化
    FB.init({
        appId: Store.messengerAppId,
        xfbml: true,
        version: 'v3.2',
    });

    // 插件中含有 Checkbox
    if (Store.widgets.some(({ type }) => type === WidgetType.Checkbox)) {
        FB.Event.subscribe('messenger_checkbox', (ev: FacebookCheckboxEvent) => {
            if (!ev.ref) {
                Print.warn(`Can not found 'ref' attrubite, find 'user_ref': ${ev.user_ref}`, true);
                return;
            }

            const getId = window.atob(ev.ref);
            const widget = Store.widgets.find(({ id }) => id === getId) as CheckboxData;

            if (!widget) {
                Print.warn(`Invalid Widget ID: ${getId}`, true);
                return;
            }

            if (ev.state === 'checked' && widget.checked) {
                widget.checked(ev.user_ref);
            }

            if (ev.state === 'unchecked' && widget.unChecked) {
                widget.unChecked(ev.user_ref);
            }
        });
    }

    // 插件中含有 Send To Messenger
    if (Store.widgets.some(({ type }) => type === WidgetType.SendToMessenger)) {
        FB.Event.subscribe('send_to_messenger', (ev: FacebookSendToMessengerEvent) => {
            debugger;
        });
    }
}

/** facebook SDK 初始化 */
export function facebookInit() {
    const fbAsyncInitPrev: FbAsyncInit = (window as any).fbAsyncInit;

    if (fbAsyncInitPrev) {
        // 初始化函数已经运行
        if (fbAsyncInitPrev.hasRun) {
            bothubFacebookInit();
        }
        // 初始化函数还未运行
        else {
            (window as any).fbAsyncInit = () => {
                fbAsyncInitPrev();
                bothubFacebookInit();
            };
        }
    }
    else {
        (window as any).fbAsyncInit = bothubFacebookInit;
    }
}
