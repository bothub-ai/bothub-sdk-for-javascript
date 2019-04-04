/** SDK 类别 */
export const enum SDKType {
    Main,
    CustomerChat,
}

/** 当前页面时否已经加载 Facebook SDK 文件 */
function hasFacebookSDK(type: SDKType) {
    const script = document.getElementById('facebook-jssdk') as HTMLScriptElement;

    if (!script) {
        return false;
    }

    let matchStr = 'https:\\/\\/connect\\.facebook\\.net\\/(zh_CN|zh_TW|en_US)\\/';

    if (type === SDKType.Main) {
        matchStr += 'sdk(\\/debug)?\\.js';
    }
    else {
        matchStr += 'sdk\\/xfbml\\.customerchat\\.js';
    }

    return new RegExp(matchStr, 'i').test(script.src);
}

/** 加载 facebook SDK 文件 */
// export function loadFacebookSdk(bothub: Bothub, type: SDKType) {
//     if (hasFacebookSDK(type)) {
//         return;
//     }

//     // 默认为中文简体
//     if (!/^(zh_CN|zh_TW|en_US)$/.test(bothub.language)) {
//         bothub.language = 'zh_CN';
//     }

//     let scriptName: string;
//     const facebookScript = document.createElement('script');

//     if (type === SDKType.Main) {
//         scriptName = bothub.debug ? 'sdk/debug' : 'sdk';
//     }
//     else {
//         scriptName = 'sdk/xfbml.customerchat';
//     }

//     facebookScript.id = 'facebook-jssdk';
//     facebookScript.src = `https://connect.facebook.net/${bothub.language}/${scriptName}.js`;

//     document.body.appendChild(facebookScript);
// }
