
const view = (dir) => {
    return (resolve) => {
        return import(`@/components/${dir}/index.vue`).then(o => {
            resolve(o.default);
        });
    };
};
export default view;
