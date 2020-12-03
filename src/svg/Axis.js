import BaseSvg from "./baseSvg"
import Transform from '../points/Transform'

// 坐标轴
export default class Axis extends BaseSvg {
    constructor(options, svg) {
        super(options)
        // Object.assign(this, options)
        Object.assign(this, {
            ...options,
            svg
        })
    }
    // x轴
    _axisX(options) {
        let {
            width,
            height,
            svg
        } = this
        let opt = this._regualrOptions(options, "axisX")
        let g = this._g({
            id: 'axisX',
            fill: 'transparent'
        }, svg)

        // let offset = 150
        let offset = (width - 10 * 50) / 2
        this._axis([0 + offset, height / 2],
            [width - offset, height / 2], opt, g)
    }
    // y轴
    _axisY(options) {
        let {
            width,
            height,
            svg
        } = this
        let opt = this._regualrOptions(options, "axisY")
        let g = this._g({
            id: 'axisY',
            fill: 'transparent'
        }, svg)
        // let offset = 150
        let offset = (height - 10 * 50) / 2
        this._axis([width / 2, 0 + offset], [width / 2, height - offset], opt, g)
    }
    // 坐标轴
    _axis(p1, p2, opt, g) {
        let props = this._lineProps(opt)
        this._line(p1, p2, {
            ...props,
            'marker-end': 'url(#markerArrow)'
        }, g)
        // 刻度
        if (opt.sticks) {
            this._line(p1, p2, {
                ...opt,
                ...this._lineProps({
                    lineWidth: 10,
                    dashLine: true,
                    dashArray: [1, 50],
                    dashOffset:5
                })
            }, g)
        }
    }
    // 网格坐标
    _grid(options) {
        let {
            width,
            height,
            svg
        } = this
        let opt = this._regualrOptions(options, "grid")
        let props = this._lineProps(opt)
        let g = this._g({
            ...props,
            id: 'grid',
            fill: 'transparent',
            transform: opt.rotate ? `rotate(${opt.rotate})` : undefined,
            'transform-origin': `${width/2} ${height/2}`
        }, svg)

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

        this._path(d, {}, g)

    }
    // 极坐标
    _polar(options) {
        let {
            width,
            height,
            svg
        } = this
        let opt = this._regualrOptions(options, "polar")
        let props = this._lineProps(opt)
        let g = this._g({
            ...props,
            id: 'polar',
            fill: 'transparent'
        }, svg)
        let interval = opt.interval || 100
        let o = [width / 2, height / 2]

        for (let i = 0; i < height / interval; i++) {
            this._circle(o, interval * i, {}, g)
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
        this._path(d, {}, g)
    }
    // 箭头
    _marker() {
        let defs = this._defs(this.svg)
        let market = this._marker({
            id: 'markerArrow',
            markerWidth: 13,
            markerHeight: 13,
            refx: 2,
            refy: 6,
            orient: 'auto'
        }, defs)

        this._path(this._d([
            [2, 2],
            [2, 11],
            [10, 6],
            [2, 2]
        ]), {
            fill: 'red'
        }, market)
    }
}