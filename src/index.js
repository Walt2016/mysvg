import {
    draw,
    circle
} from './mysvg'

// function component() {
//     var element = document.createElement('div');
//     element.innerHTML = ['Hello', 'webpack'].join(" ")
//     return element;
// }

// document.body.appendChild(component());

console.log(circle)
// draw('circle', {
//     color: 'blue',
//     lineColor: 'red',
//     lineWidth:10,
//     r:100
// })

// draw([{
//     shape:'circle',
//     color:'red'
// },{
//     shape:'text'
// },{
//     shape:'line'
// },{
//     shape:'rect',
//     width:100,
//     height:200,
// }],{
//     color:'pink'
// })



draw([{
        shape: 'text',
        text: '美国队长'
    }, {
        shape: 'circle',
        color: 'red',
        r: 200
    }, {
        shape: 'circle',
        color: 'white',
        r: 150
    }, {
        shape: 'circle',
        color: 'red',
        r: 100
    },
    {
        shape: 'circle',
        color: 'blue',
        r: 50
    },
    {
        shape: 'rect',
        width: 100,
        height: 200,
    }, {
        shape: 'polygon',
        style: 'fill:#cccccc;stroke:#000000;stroke-width:1'
    }
], {
    color: 'pink'
})
// document.body.appendChild()