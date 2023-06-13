/**
 * vue scroll的配置
 */

const size = "12px"

//滚动条保持显示
const keepShow = {
    vuescroll: {
        mode: 'native',
        sizeStrategy: 'percent',
        detectResize: true,
        wheelScrollDuration: 0,
        wheelDirectionReverse: false
    },
    scrollPanel: {
        initialScrollY: false,
        initialScrollX: false,
        scrollingX: true,
        scrollingY: true,
        speed: 300,
        easing: 'easeInQuad',
        verticalNativeBarPos: 'right'
    },
    rail: {
        background: '#000000',
        opacity: 0,
        size: size,
        specifyBorderRadius: false,
        gutterOfEnds: '2px',
        gutterOfSide: '2px',
        keepShow: false,
    },
    bar: {
        showDelay: 500,
        onlyShowBarOnScroll: true,
        keepShow: true,
        background: 'linear-gradient(145deg, #e9e9f0, #b8b9be)',
        opacity: 1,
        hoverStyle: false,
        specifyBorderRadius: false,
        minSize: false,
        size: size,
        disable: false,
    },
    scrollButton: {
        enable: false,
        opacity: 1,
        step: 180,
        mousedownStep: 30
    }
}

//自定义滚动条配置
const autoHidden = {
    vuescroll: {
        mode: 'native',
        sizeStrategy: 'percent',
        detectResize: true,
        wheelScrollDuration: 0,
        wheelDirectionReverse: false
    },
    scrollPanel: {
        initialScrollY: false,
        initialScrollX: false,
        scrollingX: true,
        scrollingY: true,
        speed: 300,
        easing: 'easeInQuad',
        verticalNativeBarPos: 'right'
    },
    rail: {
        background: '#01a99a',
        opacity: 0,
        size: '6px',
        specifyBorderRadius: false,
        gutterOfEnds: null,
        gutterOfSide: '2px',
        keepShow: false,
        border: 'none'
    },
    bar: {
        showDelay: 500,
        onlyShowBarOnScroll: true,
        keepShow: false,
        background: '#c1c1c1',
        opacity: 1,
        hoverStyle: false,
        specifyBorderRadius: false,
        minSize: false,
        size: '10px',
        disable: false,
    },
    scrollButton: {
        enable: false,
        background: 'rgb(3, 185, 118)',
        opacity: 1,
        step: 180,
        mousedownStep: 30
    }
}

export default {
    keepShow,
    autoHidden
}