import config from './config'
import {
    _type,
} from './utils'
import {
    cutpoints,
    dis
} from './points'
import filter from './filter'
import {
    latticepoints,
    dots
} from './lattice'
import color from './color'
import fractal from './fractal'
let {
    wrapperOptions,
    center
} = config
let {
    width,
    height
} = wrapperOptions

let canvas, ctx;
var setup = function () {
    canvas = document.createElement('canvas')
    ctx = canvas.getContext("2d")
    canvas.width = width
    canvas.height = height
    document.body.appendChild(canvas)
    // var el = this.el = _.query(options.el)
    // el.appendChild(canvas)
    // var padding = options.padding || 0,
    //     paddingLeft = options.paddingLeft || padding,
    //     paddingRight = options.paddingRight || padding,
    //     paddingTop = options.paddingTop || padding,
    //     paddingBottom = options.paddingBottom || padding;
    // this.center = [this.width / 2, this.height / 2];
    // this.lefttop = [0 + paddingLeft, 0 + paddingTop];
    // this.leftbottom = [0 + paddingLeft, this.height - paddingBottom];
    // this.rightbottom = [this.width - paddingRight, this.height - paddingBottom];
    // this.righttop = [this.width - paddingRight, 0 + paddingTop];
}

// function setup() {
//     canvas = document.querySelector("#canvas");
//     ctx = canvas.getContext("2d");
//     window.addEventListener("resize", resize);
//     canvas.addEventListener("click", draw);
//     resize();
//   }

//   function resize() {
//     w = canvas.width = window.innerWidth;
//     h = canvas.height = window.innerHeight;
//     ctx.fillStyle = "black";
//     ctx.lineWidth = config.lineWidth;
//     ctx.lineCap = "round";
//     ctx.lineJoin = "round";
//     draw();
//   }

var clear = function () {
    ctx.clearRect(0, 0, width, height);
};

function fill({
    color
}) {
    ctx.fillStyle = color
    ctx.rect(0, 0, width, height)

    ctx.fill();
}

//链接
//arr, shape
var link = function (opt) {
    var _link = function (p1, p2, shape, sAngle, eAngle) {
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        switch (shape) {
            case "line":
                ctx.moveTo.apply(ctx, p1)
                ctx.lineTo.apply(ctx, p2)
                break;
            case "arc":
                var sAngle = sAngle || 0;
                var eAngle = eAngle || (sAngle + Math.PI)
                var r = this.dis(p1, p2) / 2
                var o = this.mid(p1, p2)
                ctx.arc.apply(ctx, o.concat([r, sAngle, eAngle]))
                break;
            case "circle":
                var sAngle = 0;
                var eAngle = 2 * Math.PI
                var r = this.dis(p1, p2) / 2
                var o = this.mid(p1, p2)
                ctx.arc.apply(ctx, o.concat([r, sAngle, eAngle]))
                break;
        }
        ctx.stroke()
    }

    var len = arguments.length
    if (len === 3) {
        var p1 = arguments[0],
            p2 = arguments[1];
        var shape = arguments[2];
        _link(p1, p2, shape)

    } else if (len === 2) {
        var arr = arguments[0],
            len = arr.length,
            shape = arguments[1];
        for (var i = 0; i < len - 1; i++) {
            _link.apply(this, arr.slice(i, i + 2).concat([shape]))
        }
    } else if (len === 1) {
        var arr = opt.points,
            len = arr.length,
            shape = opt.shape,
            sAngle = opt.sAngle,
            eAngle = opt.eAngle

        for (var i = 0; i < len - 1; i++) {
            _link.apply(this, arr.slice(i, i + 2).concat([shape, sAngle, eAngle]))
        }
    }

};



//打点
var dot = (options) => {
    let {
        points,
        showLabel
    } = options
    ctx.fillStyle = "#0000ff";
    let _dot = (t) => {
        ctx.beginPath();
        ctx.arc(t[0], t[1], 3, 0, 2 * Math.PI);
        // ctx.stroke();
        ctx.fill();
        if (showLabel)
            this.text(Math.floor(t[0]) + "," + Math.floor(t[1]), [t[0] - 5, t[1] + 10])
    }
    if (_type(points[0]) === "array") { //二维数组
        points.forEach(t => _dot(t))
    } else {
        _dot(points)
    }
    return options
}



//弧线
var arc = (opitons) => {
    let {
        o,
        strokeStyle = "#000"
    } = opitons
    let points = cutpoints(opitons)
    let len = points.length
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    points.forEach((t, i) => {
        let t1 = i + 1 < len ? points[i + 1] : points[0];
        let r = dis(t, t1, o)
        ctx.arcTo.apply(ctx, t.concat(t1).concat([r]))
    })
    ctx.stroke()
    return Object.assign(opitons, {
        points
    })
}

//连线
var line = (options) => {
    let {
        points,
        fillStyle,
        strokeStyle = "#000",
        closePath = true,
        colors,
        index = 0
    } = options
    if (colors)
        strokeStyle = colors[index]
    if (fillStyle) ctx.fillStyle = fillStyle //"white"
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    points.forEach((t, i) => {
        if (i === 0) {
            ctx.moveTo.apply(ctx, t)
        }
        ctx.lineTo.apply(ctx, t)
    })
    if (closePath)
        ctx.closePath();
    ctx.stroke()
    if (fillStyle) ctx.fill()

    return options
};


//射线
//一中心p,多中心o [p1,p2]
var ray = (options) => {
    let {
        o,
        strokeStyle = "#000",
        colors,
        index = 0
    } = options
    let points = cutpoints(options)
    // options.points = points

    if (colors) {
        ctx.strokeStyle = colors[index]
    } else {
        ctx.strokeStyle = strokeStyle;
    }

    ctx.beginPath();
    if (Array.isArray(o[0])) { //二维数组  多中心
        var n = o.length;
        points.forEach((t, i) => {
            ctx.moveTo.apply(ctx, o[i % n])
            ctx.lineTo.apply(ctx, t)
        })
    } else {
        points.forEach((t, i) => {
            ctx.moveTo.apply(ctx, o)
            ctx.lineTo.apply(ctx, t)
        })
    }
    ctx.stroke()
    // return options
    return Object.assign(opitons, {
        points
    })
};
//正方形，矩形
var rect = (options) => {
    let {
        o,
        r,
        strokeStyle = '#000',
        fillStyle
    } = options
    ctx.strokeStyle = strokeStyle;
    if (fillStyle)
        ctx.fillStyle = fillStyle
    ctx.beginPath();
    ctx.rect.apply(ctx, [o[0] - r / 2, o[1] - r / 2].concat([r, r]))
    ctx.stroke()
    if (fillStyle)
        ctx.fill()
    return options
}
//圆形
var circle = function (options) {
    let {
        o,
        r,
        fillStyle,
        strokeStyle = '#000'
    } = options
    ctx.strokeStyle = strokeStyle
    if (fillStyle)
        ctx.fillStyle = fillStyle
    ctx.beginPath();
    ctx.arc.apply(ctx, o.concat([r, 0, 2 * Math.PI]))
    ctx.stroke()
    if (fillStyle)
        ctx.fill()
    return options
}

//文字
var text = function (options) {
    let {
        o,
        text,
        x = 0,
        y = 0,
        fontSize,
        fillStyle = "#000"
    } = options
    ctx.fillStyle = fillStyle
    ctx.font = fontSize || "20px Verdana";
    ctx.fillText(text, o[0] + x, o[1] + y);
    return options
}


//规则多边形
var polygon = function (options) {
    let points = cutpoints(options)
    return line(Object.assign(options, {
        points
    }))
}

//点阵
var lattice = function (options) {
    let points = latticepoints(options)
    return line(Object.assign(options, {
        points
    }))
}
//同义词
var _synonym = function (options) {
    var synonym = {
        color: 'fillStyle',
        linecolor: 'strokeStyle',
        // linewidth: 'strokeWidth'
    }
    Object.keys(options).forEach(t => {
        let key = synonym[t.toLowerCase()]
        if (key) {
            options[key] = options[t]
        }
    })
    return options
}
//默认参数
var defaultOptions = function (tag, options) {
    let _default = {}
    switch (tag) {
        case 'circle':
            _default = {
                o: center,
                r: 100,
                color: 'red',
                lineColor: 'black'
            }
            break;
        case 'text':
            _default = {
                o: center,
                // x: center[0],
                // y: 20,
                // fontSize: 20,
                text: 'Canvas'
            }
            break;
        case 'polygon':
            _default = {
                o: center,
                r: 100,
                n: 5,
                sAngle: 0,
                // color: 'blue',
                lineColor: 'black'
            }
            break;
        case 'rect':
            _default = {
                o: center,
                r: 100,
                sAngle: 0,
                color: 'blue',
                lineColor: 'black'
            }
            break;
        case 'ray':
            _default = {
                o: center,
                r: 100,
                n: 5,
                sAngle: 0,
                // color: 'blue',
                lineColor: 'black'
            }
            break;
        case 'arc':
            _default = {
                o: center,
                r: 100,
                n: 5,
                sAngle: 0,
                // color: 'blue',
                lineColor: 'black'
            }
            break;
        case 'lattice':
            _default = {
                o: center,
                r: 50,
                n: 4
            }
            break;

    }

    return _synonym(Object.assign(_default, options))
}


//图形
var shape = function (tag, options) {
    options = defaultOptions(tag, options)
    switch (tag) {
        case "circle":
            options = circle(options);
            break;
        case 'text':
            options = text(options);
            // console.log(options)
            break;
        case 'polygon':
            options = polygon(options);
            break;
        case 'ray':
            options = ray(options);
            break;
        case 'arc':
            options = arc(options);
            break;
        case 'rect':
            options = rect(options);
            break;
        case 'lattice':
            options = lattice(options)
            break;
    }
    // console.log(options)
    return options
}

//图形点阵
function imagePixel(canvas) {
    let ctx = canvas.getContext("2d")
    let cols = canvas.width;
    let rows = canvas.height;
    // fill({color:"rgb(255,0,0)"})
    var imgData = ctx.getImageData(0, 0, cols, rows)
    let data = imgData.data
    // console.log(data)
    var len = imgData.data.length;
    var res = [];
    let gap=6
    for (var i = 0; i < rows; i+=gap) {
        for (var j = 0; j < cols; j+=gap) {
            var pos = (i * cols + j) * 4;
            // if (data[pos] > 0) {
            //     res.push([j, i])
            // }

            // 判断像素点是不是红色
            if (data[pos] == 255 && data[pos + 1] == 0 && data[pos + 2] == 0 && data[pos + 3] == 255) {
                // var dot = new Dot(x, y);
                // dotList.push(dot);

                res.push([j,i])

                // res.push([i,j])
            }
        }
    }
    return res
}

//滤镜
function doFilter(t, options) {
    if (t === 'lattice') {
        let points = imagePixel(canvas)
        console.log(points)
        clear()
        // let colors = color.circle(points.length)
        points.forEach((t, i) => {
            let opt = Object.assign(options, {
                o: t,
                shape: 'circle',
                r: 2,
                color: '#000'
                // color: colors[i] // hsla()
            })
            // if (i % 100 == 0) {
            //     circle(opt)
            // }

            ctx.beginPath();
            circle(opt)
			// ctx.arc(t[0], t[1], 2, 0, 2 * Math.PI);
			ctx.fill();

        })
    } else {
        filter[t] && filter[t](canvas)
    }
}

//分形调用
var doFractal = function (t, options) {
    let {
        level = 3,
            n = 5
    } = options
    let len = fractal.stat(level, n)
    console.log(len)
    let colors = color.circle(len)
    options.colors = colors
    // options.index = 0
    let index = 0
    fractal[t](options, function (options) {
        // options.index++
        index++
        Object.assign(options, {
            index
        })
        return shape(options.shape, options)
    })
}

//画图
var draw = function (arr, options) {
    console.log(arr)
    arr.forEach(t => {
        console.log(t, options)

        switch (_type(t)) {
            case 'string':
                shape(t, options)
                break;
            case 'object':

                //分形
                if (t.fractal) {
                    doFractal(t.fractal, Object.assign({}, options, t))
                } else {
                    //画图
                    if (t.shape) {
                        shape(t.shape, Object.assign({}, options, t))
                    }
                }

                //滤镜
                if (t.filter) {
                    doFilter(t.filter, Object.assign({}, options, t))
                }

                break;
            default:
                if (_type(t).test(/svg/i)) {
                    console.log("is svg element")
                }
                break;
        }
    })
}

//动画
let anime = (figures, options) => {
    setInterval(() => {
        clear()
        figures = figures.map(t => {
            let {
                sign = 1
            } = t
            let {
                prop,
                range = [0, 0],
                speed,
                act
            } = Object.assign({}, t.anime, options)
            if (t[prop] > range[1]) {
                t.sign = -1
            } else if (t[prop] < range[0]) {
                t.sign = 1
            }
            t[prop] = t[prop] + sign * speed
            return t
        })

        draw(figures)
    }, 17);

}

export {
    setup,
    draw,
    shape,
    clear,
    anime
}