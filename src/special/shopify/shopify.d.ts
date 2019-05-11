/** 页面元数据 */
interface ShopifyMeta {
    /** 当前使用的货币单位 */
    currency: string;
    /** 页面信息 */
    page: ShopifyPage;
    /** 当前选中的商品编号 */
    selectedVariantId?: string;
    /** 页面商品信息 */
    product?: ShopifyProduct;
}

/** 页面信息 */
interface ShopifyPage {
    /** 页面类型 */
    pageType?: string;
    /** 页面资源类型 */
    resourceType?: string;
    /** 页面资源编号 */
    resourceId?: number;
}

/** 页面商品信息 */
interface ShopifyProduct {
    /** 产品编号 */
    id: number;
    /** 产品名称 */
    vendor: string;
    /** 产品类型 */
    type: string;
    /**  */
    variants: ShopifyProductSku[];
}

/** 页面商品 SKU 数据 */
interface ShopifyProductSku {
    /** 编号 */
    id: number;
    /** 名称 */
    name: string;
    /** 价格 */
    price: number;
    /** 公共名称 */
    public_title: string;
    /** sku 编号 */
    sku: string;
}

/** shopify 元数据 */
interface ShopifyAnalyticsData {
    /** 内部库函数 */
    lib?: any;
    /** 添加 GTM 的函数 */
    merchantGoogleAnalytics: () => void;
    /** 页面元数据 */
    meta: ShopifyMeta;
}

/** Shopify API 校验信息 */
interface ShopifyApiCheckout {
    /** 接口地址 */
    apiHost: string;
    /** 检验编码 */
    token?: string;
    /** 是否是订单状态页面 */
    isOrderStatusPage?: boolean;
    /** 订单状态 */
    OrderStatus?: object;
}

/** 订单信息 */
interface ShopifyCheckout {
    created_at: string;
    currency: string;
    customer_id: number;
    customer_locale: string;
    email: string;
    location_id?: unknown;
    order_id: number;
    payment_due: string;
    payment_url: string;
    phone?: unknown;
    presentment_currency: string;
    reservation_time?: unknown;
    reservation_time_left: number;
    requires_shipping: boolean;
    source_name: string;
    source_identifier?: unknown;
    source_url?: unknown;
    subtotal_price: string;
    taxes_included: boolean;
    tax_exempt: boolean;
    tax_lines: [],
    token: string;
    total_price: string;
    total_tax: string;
    updated_at: string;
    gift_cards: unknown[],
    discount?: {
        amount: string;
        applicable: boolean;
        code: string;
        rate: string;
        reason?: string;
        uses_remaining: number;
    };
    line_items: Array<{
        id: string;
        key: string;
        product_id: number;
        variant_id: number;
        sku: string;
        vendor: string;
        title: string;
        variant_title: string;
        image_url: string;
        taxable: boolean;
        requires_shipping: boolean;
        gift_card: boolean;
        price: string;
        compare_at_price: string;
        line_price: string;
        properties: {};
        quantity: number;
        grams: number;
        fulfillment_service: string;
        applied_discounts: []
    }>;
    shipping_rate: {
        handle: string;
        price: string;
        title: string;
    };
    shipping_address: {
        id: number;
        first_name: string;
        last_name: string;
        phone?: unknown;
        company?: unknown;
        address1: string;
        address2: string;
        city: string;
        province: string;
        province_code: string;
        country: string;
        country_code: string;
        zip: string;
    };
    credit_card: {
        first_name: string;
        last_name: string;
        first_digits: string;
        last_digits: string;
        brand: string;
        expiry_month: number;
        expiry_year: number;
        customer_id: number;
    };
    billing_address: {
        id: number;
        first_name: string;
        last_name: string;
        phone?: unknown;
        company?: unknown;
        address1: string;
        address2: string;
        city: string;
        province: string;
        province_code: string;
        country: string;
        country_code: string;
        zip: string;
    };
}

/** shopify 数据结构 */
interface ShopifyData {
    /** 店铺网址 */
    shop: string;
    /** 店铺使用的主题 */
    theme: object;
    /** 货币单位 */
    currency: object;
    /** 付款按钮数据 */
    PaymentButton?: object;
    /** 快速收藏按钮数据 */
    StorefrontExpressButtons?: object;

    /** api 校验接口 */
    Checkout: ShopifyApiCheckout;
    /** 订单信息 */
    checkout?: ShopifyCheckout;
}

declare global {
    interface Window {
        Shopify: ShopifyData;
        ShopifyAnalytics: ShopifyAnalyticsData;
    }
}

export const $$: unknown;
