import Cookie from 'js-cookie';

import { CustomUserIdKey } from 'src/lib/utils';

/** 获取商品表单元素 */
export function getProductForm() {
    /** 页面的所有表单元素 */
    const forms = document.getElementsByTagName('form');
    // 迭代所有表单元素
    for (let i = 0; i < forms.length; i++) {
        // 带有`cart/add`的标记就是所求
        if (forms[i].action.match(/cart\/add/)) {
            return forms[i];
        }
    }
}

/** 获取当前用户选项 */
export function getSelectedVariantId() {
    const { meta } = window.ShopifyAnalytics;

    // 如果页面已经写入选中的 VariantId，则直接返回
    if (meta && meta.selectedVariantId) {
        return meta.selectedVariantId;
    }

    // 商品表单元素
    const form = getProductForm();

    if (!form) {
        return;
    }

    const formSelection = form.id as any as HTMLSelectElement;
    const options = formSelection.options && formSelection.options[formSelection.selectedIndex];
    const value: string = options ? options.value : (formSelection && formSelection.value);

    if (value) {
        meta.selectedVariantId = value;
        return value;
    }
}

/** 获取`add-to-cart`按钮 */
export function getAddToCartBtn() {
    const form = getProductForm();

    if (form) {
        const addToCart = form.querySelector('input[type=submit], button[name=add]');

        if (addToCart) {
            return addToCart;
        }
    }
}

/** 获取用户自定义编号 */
export function getCustomUserId() {
    const ref = Cookie.get('_shopify_sa_p');
    let index = 0;

    if (ref) {
        index = ref.indexOf(CustomUserIdKey);

        if (index >= 0) {
            Cookie.remove('_shopify_sa_p');
            return unescape(ref).substr(index + 22, 32);
        }
    }
}
