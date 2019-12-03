
const view = (dir) => {
    return (resolve) => {
        return import(`@/activity/pages/${dir}/index.vue`).then(o => {
            resolve(o.default);
        });
    };
};
export default view;
