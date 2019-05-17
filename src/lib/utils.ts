import { isIOS } from './env';

/** 函数沙箱 */
export function sandBox<T extends (...args: any[]) => any>(cb: T) {
    return (...args: Parameters<T>): ReturnType<T> | Error => {
        let result: ReturnType<T>;

        try {
            result = cb(...args);
        }
        catch (e) {
            return e;
        }

        return result;
    };
}

/** 复制文本到剪贴板 */
export function copy(text: string) {
    const input = document.createElement('textarea');

    input.value = text;

    input.style.fontSize = '12pt';
    input.style.position = 'fixed';
    input.style.top = '0';
    input.style.left = '-9999px';
    input.style.width = '2em';
    input.style.height = '2em';
    input.style.margin = '0';
    input.style.padding = '0';
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.boxShadow = 'none';
    input.style.background = 'transparent';

    input.setAttribute('readonly', '');

    document.body.appendChild(input);

    if (isIOS) {
        input.contentEditable = 'true';
        input.readOnly = false;

        const range = document.createRange();
        range.selectNodeContents(input);

        const selection = window.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);

        input.setSelectionRange(0, 999999);
    }
    else {
        input.select();
    }

    const ret = document.execCommand('copy');

    input.blur();
    document.body.removeChild(input);

    return ret;
}

/** 加载外部 script 文件 */
export function loadScript(src: string, id?: string, callback?: () => void) {
    const script = document.createElement('script');

    if (id) {
        script.id = id;
    }

    script.async = true;
    script.src = src;

    document.getElementsByTagName('head')[0].appendChild(script);

    if (callback) {
        script.addEventListener('load', callback);
    }
}
