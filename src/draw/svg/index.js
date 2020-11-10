import config from '../../config'
import MidSeg from '../../points/MidSeg'
import _ from '../../utils/index'
import Transform from '../../points/Transform'
import './index.css'
import {
    ArcSeg
} from '../../points'
let {
    env,
    center
} = config
let {
    width,
    height
} = env

export default class DrawSVG {
    constructor(options) {
        this.init(options)
    }
    init(options) {
        let _svg = this.svgWrappper()
        document.body.appendChild(_svg);
        // let defs = this._defs()
        // _svg.appendChild(defs)
        // let g = this._g()
        // defs.appendChild(g)
        // let _symbol=this._symbol()
        // _svg.appendChild(_symbol)
        // setTimeout(()=>{
        // let use = this._use()
        // _svg.appendChild(use)
        // },2000)

        Object.assign(this, {
            _svg,
            // _svg: _symbol,
            width,
            height,
            props: 'colorful,markerArrow,propA,propB,iterationCount,duration,name,o,r,n,shape,radius,fill,color,text,opacity,lineWidth,lineOpactiy,dashLine,dashArray,textColor,textFontSize,interval,linecap,linejoin,animationShift,animationTwinkle,rotate,level,offset,type,use'.split(",")
        })
        // this._path(this)
    }
    _createEle(tag, options) {
        let ele = document.createElementNS('http://www.w3.org/2000/svg', tag)
        for (let key in options) {
            if (options[key] !== undefined) {
                switch (key.toLocaleLowerCase()) {
                    case "class":
                        ele.className = options[key]
                        break;
                    case "name":
                    case "innertext":
                    case "id":
                    case "innerhtml":
                    case "value":
                    case "textcontent":
                        ele[key] = options[key]
                        break;
                    case "click":
                        ele.addEventListener("click", options[key], false)
                        break;
                    default:
                        ele.setAttribute(key, options[key])
                        break;
                }
            }
        }
        return ele
    }
    svgWrappper(svgDom) {
        let svg = this._createEle("svg", {
            width,
            height
        })
        if (Array.isArray(svgDom)) {
            svgDom.forEach(t => {
                svg.appendChild(t)
            })
        } else if (svgDom) {
            svg.appendChild(svgDom)
        }
        return svg
    }
    _regualrOptions(options, prefix) {
        let opt = {};
        this.props.forEach(t => {
            if (prefix) {
                let name = _.camelCase([prefix, t])
                if (options[name]) {
                    opt[t] = options[name]
                }
            } else {
                if (options[t]) {
                    opt[t] = options[t]
                }
            }
        })
        return opt
    }
    // 线条属性
    _lineProps(opt = {}) {
        return {
            stroke: opt.color || opt.stroke || 'black',
            'stroke-opacity': _.isUndefined(opt.opacity) ? 1 : opt.opacity,
            'stroke-width': opt.lineWidth || opt.strokeWidth || 1,
            'stroke-dasharray': opt.dashLine ? opt.dashArray || [5, 5] : undefined,
            'stroke-linecap': opt.linecap ? opt.linecap : undefined,
            'stroke-linejoin': opt.linejoin,
            'style': opt.animationShift ? 'animation:shift 3s infinite linear' : undefined
            // 'marker-end': 'url(#markerArrow)'
        }
    }
    // 图形属性
    _shapeProps(opt) {
        return opt.fill ? {
            fill: opt.color || 'red',
            'fill-opacity': _.isUndefined(opt.opacity) ? 1 : opt.opacity
        } : {
            fill: 'transparent',
        }
    }
    // 动画属性
    _animationProps(opt, t = opt.o || [width / 2, height / 2]) {
        // let opt = this._regualrOptions(options, "animation")
        // let t = opt.o || [width / 2, height / 2]
        return opt.use ? {
            'style': `animation:${opt.name} ${opt.duration||1}s ${opt.iterationCount||'infinite'} linear`,
            'transform-origin': `${t[0]}px ${t[1]}px`
            // 'style': opt.animationShift ? 'animation:shift 3s infinite linear' : undefined
        } : {}
    }
    // 变形属性
    _transformProps(opt, t = opt.o || [width / 2, height / 2]) {
        if (opt.use) {
            let transform = ""
            switch (opt.name) {
                case "skew":
                    transform = `${opt.name}X(${opt.propA})${opt.name}Y(${opt.propB})` //,${opt.propB}
                    break;
                case "rotate":
                    transform = `${opt.name}(${opt.propA})`
                    break;
                default:
                    transform = `${opt.name}(${opt.propA},${opt.propB})`

            }

            return {
                transform,
                'transform-origin': `${t[0]}px ${t[1]}px`
            }
        }

        // return opt.use ? {
        //     // transform: 'scale(2,2)',
        //     transform: `${opt.name}(${opt.propA},${opt.propB})`,
        //     'transform-origin': `${t[0]}px ${t[1]}px`
        // } : {}
    }
    // 规则图形
    _regularShape(name, points, options, root = this._svg) {
        let opt = this._regualrOptions(options, name)
        let defaultProps = Object.assign(this._lineProps(opt), this._shapeProps(opt))
        let g = this._g({
            id: name,
            ...defaultProps
        })
        root.appendChild(g)

        let props = {}
        let colors = _.colorCircle(points.length, 0.5)
        points.forEach((t, index) => {
            // 动画发光效果辅助
            if (opt.animationTwinkle) {
                Object.assign(props, {
                    style: `animation:twinkle 1s infinite linear`, //;transform-origin: ${t[0]}px ${t[1]}px
                    'transform-origin': `${t[0]}px ${t[1]}px`
                })
            }
            // debugger
            if (opt.colorful) {
                Object.assign(props, {
                    fill: colors[index],
                    stroke: colors[index],
                })
            }

            switch (opt.shape) {
                case "rect":
                    // 正方形
                    let width = _.sin(45) * opt.radius || 5
                    Object.assign(props, {
                        x: t[0] - width / 2,
                        y: t[1] - width / 2,
                        width,
                        height: width,
                    })
                    break;
                case "line":
                    let r = opt.radius / 2
                    Object.assign(props, {
                        x1: t[0] - r,
                        y1: t[1] - r,
                        x2: t[0] + r,
                        y2: t[1] + r,
                    })
                    break;
                case "polygon":
                    let seg = new ArcSeg({
                        o: t,
                        r: opt.radius,
                        n: options.n
                    })
                    Object.assign(props, {
                        points: seg.points.join(" ")
                    })

                    break;
                default:
                    // 圆形
                    Object.assign(props, {
                        cx: t[0],
                        cy: t[1],
                        r: opt.radius || 5

                        // filter: 'url(#f3)'
                    })
                    break;
            }
            let shape = this._createEle(opt.shape || 'circle', props)
            g.appendChild(shape)

            // 标注文字
            if (opt.text) {
                let text = this._createEle("text", {
                    x: t[0],
                    y: t[1],
                    fill: opt.textColor || opt.color || 'black',
                    textContent: index,
                    'font-size': opt.textFontSize || 12
                })
                g.appendChild(text)
            }
        })
    }
    _line(points, options) {
        let props = {
            x1: points[0][0],
            y1: points[0][1],
            x2: points[1][0],
            y2: points[1][1],
        }
        Object.assign(props, this._lineProps(options))

        let line = this._createEle("line", props)
        this._svg.appendChild(line)
    }
    // 网格坐标
    _grid(options) {
        let opt = this._regualrOptions(options, "grid")
        let props = this._lineProps(opt)
        let g = this._g(Object.assign(props, {
            id: 'grid',
            fill: 'transparent',
            transform: opt.rotate ? `rotate(${opt.rotate})` : undefined,
            'transform-origin': `${width/2} ${height/2}`
        }))
        this._svg.appendChild(g)
        let interval = opt.interval || 100
        let offsetX = (width / 2) % interval
        let offsetY = (height / 2) % interval
        // 竖线
        let points = [
            [0 + offsetX, 0],
            [0 + offsetX, height]
        ]
        let tf = new Transform({
            points
        })
        for (let i = 0; i < width / interval; i++) {
            points = points.concat(tf.translate(interval * i))
        }
        // 横线
        let points2 = [
            [0, 0 + offsetY],
            [width, 0 + offsetY]
        ]
        tf = new Transform({
            points: points2
        })
        for (let i = 0; i < height / interval; i++) {
            points = points.concat(tf.translateY(interval * i))
        }

        let d = points.map((t, index) => {
            return (index % 2 === 0 ? "M" : "L") + t.join(" ")
        }).join(" ")

        let grid = this._createEle("path", {
            d
        })
        g.appendChild(grid)
    }
    // 极坐标
    _polar(options) {
        let opt = this._regualrOptions(options, "polar")
        let props = this._lineProps(opt)
        let g = this._g(Object.assign(props, {
            id: 'polar',
            fill: 'transparent'
        }))
        this._svg.appendChild(g)
        let interval = opt.interval || 100
        let o = [width / 2, height / 2]

        for (let i = 0; i < height / interval; i++) {
            let circle = this._createEle("circle", {
                cx: o[0],
                cy: o[1],
                r: interval * i
            })
            g.appendChild(circle)
        }

        let points = [
            [width / 2, 0],
            [width / 2, height],
            [0, height / 2],
            [width, height / 2]
        ]
        let d = points.map((t, index) => {
            return (index % 2 === 0 ? "M" : "L") + t.join(" ")
        }).join(" ")
        let grid = this._createEle("path", {
            d
        })
        g.appendChild(grid)
    }
    // 图形组成
    _path(options) {
        console.log(options)
        let defaultOpt = this._regualrOptions(options)
        let shapeProps = this._shapeProps(defaultOpt)
        let lineProps = this._lineProps(defaultOpt)
        let animationProps = this._animationProps(this._regualrOptions(options, "animation"))
        let transformProps = this._transformProps(this._regualrOptions(options, "transform"))
        let g = this._g({
            id: options.fractalUse ? `shape${options.fractalLevel}` : "shape",
            ...shapeProps,
            ...lineProps,
            ...animationProps,
            ...transformProps
        })

        this._svg.appendChild(g)
        let points = options._points || []
        // 边
        let d = points.map((t, index) => {
            return (index === 0 ? "M" : "L") + t.join(" ")
        }).concat(["z"]).join(" ")
        if (options.edgeShow) { // 有边
            let defaultOpt = this._regualrOptions(options)
            let opt = this._regualrOptions(options, "edge")
            let edgeShapeProps = this._shapeProps(defaultOpt)
            let edgeLineProps = this._lineProps(opt)
            let edge = this._createEle("path", Object.assign(edgeShapeProps, edgeLineProps, {
                d,
                transform: options.transform,
                'transform-origin': `${width/2} ${height/2}`
            }))
            g.appendChild(edge)

            // 标注文字
            if (opt.text) {
                let midseg = new MidSeg({
                    points
                })
                let groupEdgeText = this._g({
                    id: 'edgeText',
                    fill: opt.textColor || opt.color || 'black',
                    'font-size': opt.textFontSize || 12
                })
                g.appendChild(groupEdgeText)
                midseg.points.forEach((t, index) => {
                    let text = this._createEle("text", {
                        x: t[0],
                        y: t[1],
                        textContent: index,
                    })
                    groupEdgeText.appendChild(text)
                })
            }
        } else { // 无边
            let edge = this._createEle("path", {
                d
            })
            g.appendChild(edge)
        }
        // 半径
        if (options.radiusShow) {
            let d = points.map((t, index) => {
                return `M${options.o.join(" ")} L${t.join(" ")}`
            }).join(" ")
            let opt = this._regualrOptions(options, "radius")
            let radiusProps = this._lineProps(opt)
            let radius = this._createEle("path", {
                d
            })
            let groupRadius = this._g({
                id: 'radius',
                ...radiusProps
            })
            groupRadius.appendChild(radius)
            g.appendChild(groupRadius)
        }

        // 顶点
        if (options.vertexShow) {
            this._regularShape('vertex', points, options, g)
        }
        // 圆心
        if (options.centerShow) {
            this._regularShape('center', [options.o], options, g)
        }
        if (options.excircleShow) {
            this._regularShape('excircle', [options.o], {
                ...options,
                'excircleRadius': options.r
            }, g)
        }

        // 分形
        if (options.fractalUse) {
            let colors = _.colorCircle(points.length, 0.5)
            this._fractal(Object.assign(options, {
                _colors: colors
            }))
        }
    }
    clear() {
        let div = this._svg
        while (div.hasChildNodes()) //当div下还存在子节点时 循环继续
        {
            div.removeChild(div.firstChild);
        }
        return this
    }
    // 分形
    _fractal(options) {
        let {
            fractalLevel,
            fractalOffset = 0,
            fractalTimerUse,
            fractalTimerDelay = 500,
            fractalColorful
        } = options
        fractalLevel = fractalLevel - 1
        let points = options._points || []
        if (fractalColorful && options._colors) {
            let color = options._colors[fractalLevel % options._colors.length]
            Object.assign(options, {
                color,
                fill: color,
                'stroke-color': color
            })
        }
        switch (options.fractalType) {
            case "midSeg":
                let fn = () => {
                    let midseg = new MidSeg({
                        points,
                        offset: fractalOffset
                    })


                    this._path(Object.assign({}, options, {
                        _points: midseg.points,
                        fractalLevel,
                        fractalUse: fractalLevel > 1,
                    }))
                }
                fn()
                // fractalTimerUse ? setTimeout(fn, fractalTimerDelay * (fractalLevel + 1)) : fn()

                break;
            case "zoom":
                this._path(Object.assign({}, options, {
                    _points: points,
                    fractalLevel,
                    fractalUse: fractalLevel > 1,
                    transform: `scale(${fractalOffset* (fractalLevel+1) },${fractalOffset*(fractalLevel+1)})`
                }))
                break
            case "reproduce":
                if (fractalLevel > 3) {
                    alert(`fractalLevel=${fractalLevel}太大了，目前电脑处理不了`)
                    return
                }
                points.forEach((t, index) => {
                    let fn = () => {
                        let seg = new ArcSeg({
                            ...options,
                            o: t,
                            r: options.r * Math.pow(fractalOffset, fractalLevel),
                            // n: options.n
                        })
                        this._path(Object.assign({}, options, {
                            _points: seg.points,
                            fractalLevel,
                            fractalUse: fractalLevel > 1
                        }))
                    }
                    fractalTimerUse ? setTimeout(fn, fractalTimerDelay * (index + 1)) : fn()
                })
                break;
        }

    }

    // 图形
    _shape(options) {
        // 图形
        this._path(options)
        // 网格坐标
        if (options.gridShow) {
            this._grid(options)
        }

        // 极坐标
        if (options.polarShow) {
            this._polar(options)
        }
    }
    _defs() {
        return this._createEle("defs")
    }
    _g(options) {
        return this._createEle("g", Object.assign({
            id: 'shape'
        }, options))
    }
    _use() {
        return this._createEle("use", {
            x: 0,
            y: 0,
            width,
            height,
            'xlink:href': '#shape'
        })
    }
    _symbol() {
        return this._createEle("symbol", {
            id: "shape"
        })
    }
}