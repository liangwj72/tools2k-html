<template>
    <el-popconfirm title="确定重置计数器吗？"
                   v-on:confirm="resetAll">
        <el-button type="danger" slot="reference">重置计数器</el-button>
    </el-popconfirm>
</template>

<script>
    import apiUrl from '../../ApiUrl'
    import jsLib from '@gztree/jslib'

    export default {

        name: 'CompResetDruid',

        /** 本页面可用的方法 */
        methods: {
            resetAll() {
                console.debug('点击了重置计数器按钮')
                jsLib.ajax.post(apiUrl.commonDurid.resetAll, {}).then(() => {
                    this.$emit('refresh');
                })
            },
        },
    }
</script>
