import _ from '../utils/index'
import MidSeg from '../points/MidSeg'
import {
    ArcSeg
} from '../points'
export default class mirror {
    constructor(draw, options) {
        this.draw = draw
        this.options = options
        this.points = options._points
        let mirrorOptions = options.mirror

        Object.assign(mirrorOptions, {
            offset: 0,
            timerDelay: 500
        }, {
            ...mirrorOptions,
            level: mirrorOptions.level - 1
        })

        let {
            level,
            // offset = 0,
            timerUse,
            timerDelay = 500,
            colorful,
            // _points: points,
            _colors: colors,
            type
        } = mirrorOptions


        if (colorful && colors) {
            let color = colors[level % colors.length]
            Object.assign(options, {
                color,
                fill: color,
                'stroke-color': color
            })
        }
        let fn = this['_' + type]
        if (fn) {
            timerUse ? setTimeout(() => {
                fn.call(this, mirrorOptions)
            }, level * timerDelay) : fn.call(this, mirrorOptions)
        }
    }
    // 边镜像
    _edge(options) {
        let {
            level,
            radio = 1,
            startPoint,
            startIndex,
            refraction
        } = options
        let midPoints = _.mid(this.points)
        // debugger
        midPoints.forEach((t, index) => {
            let r = this.options.r * radio
            let o = _.mirror(this.options.o, t, radio, refraction)
            let mirrorPoints = _.mirror(this.points, t, radio, refraction)
            this.draw(Object.assign({}, this.options, {
                _points: mirrorPoints,
                o,
                r,
                mirror: {
                    startPoint: t,
                    startIndex: index,
                    ...options,
                    level,
                    use: level > 1
                }
            }))
        })
    }
    // 顶点镜像
    _vertex(options) {
        let {
            level,
            radio = 1,
            refraction
        } = options
        this.points.forEach(t => {
            let r = this.options.r * radio
            let o = _.mirror(this.options.o, t, radio, refraction)
            let mirrorPoints = _.mirror(this.points, t, radio, refraction)
            this.draw(Object.assign({}, this.options, {
                _points: mirrorPoints,
                o,
                r,
                mirror: {
                    ...options,
                    use: level > 1
                }
            }))
        })
    }
    _radiusRatio(options) {
        let {
            level,
            offset,
            radiusRatio
        } = options
        level = level - 1
        radiusRatio -= offset * level
        this.draw(Object.assign({}, this.options, {
            _points: this.points,
            curve: {
                ...this.options.curve,
                radiusRatio
            },
            mirror: {
                ...options,
                level,
                use: level > 1
            }
        }))
    }
    _midSeg(options) {
        // debugger
        let {
            level,
            offset
        } = options
        // level = level - 1
        let midseg = new MidSeg({
            points: this.points,
            offset: offset
        })
        let r = _.dis(midseg.points[0], this.options.o)
        let params = Object.assign({}, this.options, {
            _points: midseg.points,
            r,
            mirror: {
                ...options,
                level,
                use: level > 1,
            }
        })
        this.draw(params)
    }
    _zoom(options) {
        let {
            level,
            offset,
        } = options
        // debugger
        this.draw(Object.assign({}, this.options, {
            _points: this.points,
            mirror: {
                ...options.
                level,
                use: level > 1,
            },
            transform: `scale(${offset* (level+1) },${offset*(level+1)})`
        }))
    }
    _scale(options) {
        let {
            level,
            offset
        } = options
        let r = options.r * Math.pow(offset, level)
        let seg = new ArcSeg({
            ...this.options,
            r,
        })
        this.draw(Object.assign({}, this.options, {
            _points: seg.points,
            mirror: {
                ...options,
                level,
                use: level > 1,
            }

        }))

    }
    _rotate(options) {
        let {
            level,
            offset
        } = options
        let seg = new ArcSeg({
            ...this.options,
            angle: options.angle + offset
        })
        this.draw(Object.assign({}, this.options, {
            _points: seg.points,

            angle: this.options.angle + offset,
            mirror: {
                ...options,
                level,
                use: level > 1,
            }
        }))
    }
    _reproduce(options) {
        let {
            level,
            offset,
            timerUse,
            timerDelay,

        } = options

        this.points.forEach((t, index) => {
            let fn = () => {
                let o = t
                let r = this.options.r * Math.pow(offset, level)
                let seg = new ArcSeg({
                    ...this.options,
                    o,
                    r
                })
                this.draw(Object.assign({}, this.options, {
                    o,
                    r,
                    _points: seg.points,
                    mirror: {
                        ...options,
                        level,
                        use: level > 1
                    }

                }))
            }
            timerUse ? setTimeout(fn, level * timerDelay * (index + 1)) : fn()
        })

    }
    _tree(options) {
        let {
            level,
            offset,
            timerUse,
            timerDelay,

        } = options
        this.points.forEach((t, index) => {
            let fn = () => {
                let o = t
                let r = this.options.r * Math.pow(offset, level)
                let seg = new ArcSeg({
                    ...this.options,
                    o,
                    r
                })
                this.draw(Object.assign({}, this.options, {
                    o,
                    r,
                    _points: seg.points.slice(0, 3),
                    mirror: {
                        ...options,
                        level,
                        use: level > 1
                    }

                }))
            }
            timerUse ? setTimeout(fn, level * timerDelay * (index + 1)) : fn()
        })
    }
    // 正玄
    _sin(options) {

        let {
            num = 36,
                r = 100,
                k = 0,
                a = 0,
                w = 1
        } = options
        let o = this.options.o || [0, 0]
        let points = Array.from({
            length: num
        }, (t, i) => [i * 360 / num + o[0] - 180, r * _.sin(w * (i * 360 / num - 180) - a) + o[1] - k].map(t => _.twoDecimal(t)))

        points.forEach(t => {

            let fn = () => {
                let o = t
                let r = this.options.r //* Math.pow(offset, level)
                let seg = new ArcSeg({
                    ...this.options,
                    o,
                    // r
                })
                this.draw(Object.assign({}, this.options, {
                    o,
                    r,
                    _points: seg.points, // .slice(0, 3),
                    mirror: {
                        use: false
                    }

                }))
            }
            fn()
        })

    }

    _circle(options) {

        let {
            num = 36,
                r = 100,
                k = 0,
                a = 0,
                w = 1
        } = options
        let o = this.options.o || [0, 0]
        let points = Array.from({
            length: num
        }, (t, i) => _.polar(o, r, a + i * 360 / num))

        points.forEach(t => {

            let fn = () => {
                let o = t
                let r = this.options.r //* Math.pow(offset, level)
                let seg = new ArcSeg({
                    ...this.options,
                    o,
                    // r
                })
                this.draw(Object.assign({}, this.options, {
                    o,
                    r,
                    _points: seg.points, // .slice(0, 3),
                    mirror: {
                        use: false
                    }

                }))
            }
            fn()
        })

    }

}