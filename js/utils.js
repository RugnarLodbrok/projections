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

class PairSet {
    constructor(max_value, commutative) {
        this.max_value = max_value;
        this.commutative = commutative;
        this.set = new Set();
    }

    add(a, b) {
        let set = this.set;
        let n = this.max_value;
        set.add(a + b * n);
        if (this.commutative)
            set.add(a * n + b)
    }

    has(a, b) {
        return this.set.has(a + this.max_value * b);
    }
}
