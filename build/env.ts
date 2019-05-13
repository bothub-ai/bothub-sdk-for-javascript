interface Environment {
    /** 后端 APP 编号 */
    messenger_app_id: number;
    /** 后端接口地址 */
    api_server: string;
}

export const uat: Environment = {
    messenger_app_id: 611599205958417,
    api_server: 'https://api.uat.bothub.ai/',
};

export const uat2: Environment = {
    messenger_app_id: 1070326039719294,
    api_server: 'https://api2.uat.bothub.ai/',
};

export const prod: Environment = {
    messenger_app_id: 985673201550272,
    api_server: 'https://t.bothub.ai/',
};
