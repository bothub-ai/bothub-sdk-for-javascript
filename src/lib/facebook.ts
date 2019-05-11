import { warn } from 'src/lib/print';
import { render } from 'src/widget';
import { loadScript } from './utils';
import { language, messengerAppId, renderImmediately } from 'src/store';

/** 加载 facebook SDK */
export function loadFacebookSDK() {
    const id = 'facebook-jssdk';
    const script = document.getElementById(id) as HTMLScriptElement;

    // 网页已经加载脚本
    if (script) {
        // 已加载的脚本是全量 facebook SDK
        if (/sdk\/xfbml\.customerchat\.js$/.test(script.src)) {
            return true;
        }
        else {
            warn(
                'Some other Facebook SDK have been loaded on the website, ' +
                'some features of the Bothub SDK may not be available',
            );
            return false;
        }
    }

    loadScript(`https://connect.facebook.net/${language}/sdk/xfbml.customerchat.js`, id);

    return true;
}

/** facebook 异步开关 */
let _switch: () => void;

/** facebook sdk 是否加载完毕 */
export const facebookStatus = new Promise((resolve) => _switch = resolve);

function bothubFacebookInit() {
    // Facebook SDK 初始化
    window.FB.init({
        appId: messengerAppId,
        xfbml: true,
        version: 'v3.2',
    });

    // 延迟函数
    const delay = () => {
        // 加载完成开关打开
        _switch();

        // 允许立即渲染
        if (renderImmediately) {
            render(false);
        }
    };

    // 延迟 500 毫秒，确认加载完成
    setTimeout(delay, 500);
}

/** facebook SDK 初始化 */
export function facebookInit() {
    const fbAsyncInitPrev = window.fbAsyncInit;

    if (fbAsyncInitPrev) {
        // 初始化函数已经运行
        if (fbAsyncInitPrev.hasRun) {
            bothubFacebookInit();
        }
        // 初始化函数还未运行
        else {
            window.fbAsyncInit = () => {
                fbAsyncInitPrev();
                bothubFacebookInit();
            };
        }
    }
    else {
        window.fbAsyncInit = bothubFacebookInit;
    }
}
