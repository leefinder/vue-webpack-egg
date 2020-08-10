export const pickerProps = {
    itemHeight: {
        type: [Number, String],
        default: 44
    },
    showToolbar: Boolean,
    title: {
        type: String,
        default: '请选择'
    },
    cancelButtonText: {
        type: String,
        default: '取消'
    },
    confirmButtonText: {
        type: String,
        default: '确认'
    },
    columnList: {
        type: Array,
        default: () => []
    },
    visibleItemCount: {
        type: [Number, String],
        default: 5
    },
    defaultIndex: {
        type: [Number, String],
        default: 0
    },
    swipeDuration: {
        type: [Number, String],
        default: 1000
    }
};
