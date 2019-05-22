import axios from 'axios';

const init = () => {
    let instance = null;
    return () => {
        if (!instance) {
            instance = create();
            responseInterceptors(instance);
        }
        return instance;
    };
};
const create = () => {
    const http = axios.create({
        timeout: 60000,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        responseType: 'json'
    });
    return http;
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
