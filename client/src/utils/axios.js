import axios from 'axios';
import qs from 'qs';
const host = `${location.protocol === 'https:' ? 'https:' : 'http:'}//${location.host}`;
const proxy = process.env.NODE_ENV === 'production' ? '' : '/proxy';
const commonUrl = `${host}${proxy}`;
const HTTP_STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};
const init = () => {
    let instance = null;
    return () => {
        if (!instance) {
            instance = create();
            requestInterceptors(instance);
            responseInterceptors(instance);
        }
        return instance;
    };
};
const create = () => {
    const http = axios.create({
        baseURL: commonUrl,
        timeout: 60000,
        responseType: 'json'
    });
    return http;
};
const requestInterceptors = (instance) => {
    instance.interceptors.request.use((config) => {
        // 在发送请求之前做些什么
        const { headers: iHeader } = config;
        const headers = (iHeader['Content-type'] && iHeader) || { 'Content-Type': 'application/json; charset=UTF-8' };
        if (config.method === 'get') {
            config.paramsSerializer = params => qs.stringify(params, { arrayFormat: 'repeat' });
        }
        Object.assign(config, {
            url: `${config.url}`,
            headers,
            xsrfCookieName: 'csrfToken',
            xsrfHeaderName: 'x-csrf-token'
        });
        return config;
    }, error => {
    // 对请求错误做些什么
        return Promise.reject(error);
    });
};
const responseInterceptors = (instance) => {
    instance.interceptors.response.use((response) => {
        // 对响应数据做点什么
        const { status, data } = response;
        if (status === HTTP_STATUS.NOT_FOUND) {
            return Promise.reject(new Error('请求资源不存在'));
        } else if (status === HTTP_STATUS.BAD_GATEWAY) {
            return Promise.reject(new Error('服务端出现了问题'));
        } else if (status === HTTP_STATUS.FORBIDDEN) {
            return Promise.reject(new Error('没有权限访问'));
        } else if (status === HTTP_STATUS.UNAUTHORIZED) {
            return Promise.reject(new Error('需要鉴权'));
        } else if (status === HTTP_STATUS.SUCCESS) {
            return data;
        }
    }, error => {
        // 对响应错误做点什么
        return Promise.reject(error);
    });
};
const ajax = init();
export {
    ajax
};
