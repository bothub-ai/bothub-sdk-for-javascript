interface Environment {
    /** 后端 APP 编号 */
    messenger_app_id: number;
    /** 后端接口地址 */
    api_server: string;
    /** sdk 文件地址 */
    sdk_href: string;
    /** 上传属性 */
    storage: {
        projectId: string;
        bucketName: string;
        gcloudFileName: string;
    };
}

export const uat: Environment = {
    messenger_app_id: 611599205958417,
    api_server: 'https://api.uat.bothub.ai/',
    sdk_href: 'https://storage.googleapis.com/bothub-uat-sdk/dist/sdk-2-latest.js',
    storage: {
        projectId: 'bothub-uat',
        bucketName: 'bothub-uat-sdk',
        gcloudFileName: 'gcloud-uat.json',
    },
};

export const prod: Environment = {
    messenger_app_id: 985673201550272,
    api_server: 'https://t.bothub.ai/',
    sdk_href: 'https://sdk.bothub.ai/dist/sdk-2-latest.js',
    storage: {
        projectId: 'bothub-1340',
        bucketName: 'sdk.bothub.ai',
        gcloudFileName: 'gcloud.json',
    },
};
