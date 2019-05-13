import { DiscountData } from 'src/widget';

/** 获取商品表单元素 */
function getProductForm() {
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
function getSelectedVariantId() {
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
function getAddToCartBtn() {
    const form = getProductForm();

    if (form) {
        const addToCart = form.querySelector('input[type=submit], button[name=add]');

        if (addToCart) {
            return addToCart;
        }
    }
}

/** Checkbox 初始化 */
export function initCheckbox() {
    // 获取页面添加购物车按钮
    const btn = getAddToCartBtn();

    // 复选框数据
    const data: DiscountData = {
        id: 'bothub-shopify-widget-abc',
        origin: location.origin,
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
