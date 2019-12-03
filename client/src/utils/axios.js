import axios from 'axios';
const host = `${location.protocol === 'https:' ? 'https:' : 'http:'}//${location.host}`;
const proxy = /leapmotor/.test(location.origin) ? '' : '/proxy';
const commonUrl = `${host}${proxy}`;
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
    instance['interceptors'].request.use((config) => {
        // 在发送请求之前做些什么
        const { headers: iHeader } = config;
        const headers = (iHeader['Content-type'] && iHeader) || { 'Content-Type': 'application/json; charset=UTF-8' };
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
    instance['interceptors'].response.use((response) => {
        // 对响应数据做点什么
        const data = response.data;
        return data;
    }, error => {
        // 对响应错误做点什么
        return Promise.reject(error);
    });
};
const ajax = init();
export {
    ajax
};
