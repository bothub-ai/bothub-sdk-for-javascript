import uuid from 'uuid';

import { DiscountData } from 'src/widget';
import { getAddToCartBtn, getSelectedVariantId } from './utils';

/** Checkbox 初始化 */
export function initCheckbox() {
    // 获取页面添加购物车按钮
    const btn = getAddToCartBtn();

    // 复选框数据
    const data: DiscountData = {
        id: `bothub-shopify-${uuid()}`,
        type: 'Discount' as any,
        position: getAddToCartBtn,
        title: 'Get 5% off from your order',
        subtitle: 'Reveal discount to our Messenger list',
        discountText: 'Your discount code:',
        discountCode: 'GET15',
        showCodeBtnText: 'Get Your Discount',
        copyCodeBtnText: 'Copy the code',
        discount: '5%',
        align: 'center',
    };

    // 没有找到添加按钮，退出
    if (!btn) {
        return data;
    }

    // 按钮绑定事件
    btn.addEventListener('click', () => {
        const skuId = getSelectedVariantId();

        if (!skuId) {
            console.warn('(Bothub SDK) 未找到选中的 SKU');
            return;
        }

        const { ShopifyAnalytics, BH: { Event }} = window;
        const { currency, product } = ShopifyAnalytics.meta;

        const skuData = product!.variants.find(({ id }) => id === +skuId);

        if (!skuData) {
            console.warn('(Bothub SDK) 选中的 SKU 编号错误，未找到对应的 SKU 数据');
            return;
        }

        Event.addedToCart({
            sku: skuId,
            name: product!.type,
            currency,
            price: (skuData.price / 100).toFixed(2),
        });
    });

    return data;
}
