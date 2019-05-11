import uuid from 'uuid';

import { CheckboxData } from 'src/widget';
import { getAddToCartBtn, getSelectedVariantId } from './utils';

/** Checkbox 初始化 */
export function initCheckbox() {
    // 获取页面添加购物车按钮
    const btn = getAddToCartBtn();

    // checkbox 是否勾选
    let isChecked = false;

    // 复选框数据
    const data: CheckboxData = {
        id: `bothub-shopify-${uuid()}`,
        type: 'Checkbox' as any,
        position: getAddToCartBtn,
        check() {
            isChecked = true;
        },
        unCheck() {
            isChecked = false;
        },
    };

    // 没有找到添加按钮，退出
    if (!btn) {
        return data;
    }

    // 按钮绑定事件
    btn.addEventListener('click', () => {
        // 未勾选就不触发事件记录
        if (!isChecked) {
            return;
        }

        const skuId = getSelectedVariantId();

        if (!skuId) {
            console.warn('(Bothub SDK) 未找到选中的 SKU');
            return;
        }

        const { BH, ShopifyAnalytics } = window;
        const { currency, product } = ShopifyAnalytics.meta;

        const skuData = product!.variants.find(({ id }) => id === +skuId);

        if (!skuData) {
            console.warn('(Bothub SDK) 选中的 SKU 编号错误，未找到对应的 SKU 数据');
            return;
        }

        BH.Event.addedToCart({
            sku: skuId,
            name: product!.type,
            currency,
            price: (skuData.price / 100).toFixed(2),
        });
    });

    return data;
}
