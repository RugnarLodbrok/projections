function radians(degrees) {
    return degrees * Math.PI / 180.;
}

function timeit(f, n) {
    if (n === undefined)
        n = 1000000;
    let t0 = performance.now();
    for (let i = 0; i < n; ++i)
        f();
    console.log("time:", performance.now() - t0);
}

const W = 87;
const S = 83;
const A = 65;
const D = 68;
const Q = 81;
const E = 69;

//http://keycode.info/
