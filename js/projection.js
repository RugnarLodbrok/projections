class Isometric {
    proj_vertex(v) {
        v.z = 0;
    }
}

class Perspective extends Isometric {
    constructor(n, w, h, f) {
        super();
        if (h === undefined)
            h = w;
        if (f === undefined)
            f = 1000 * n;
        this.n = n;
        this.f = f;
        this.r = w / 2;
        this.l = -w / 2;
        this.t = h / 2;
        this.b = -h / 2;

        let l = this.l;
        let r = this.r;
        let b = this.b;
        let t = this.t;

        this.m = new Matrix([
            [2 * n / (r - l), 0, (r + l) / (r - l), 0],
            [0, 2 * n / (t - b), (t + b) / (t - b), 0],
            [0, 0, -(f + n) / (f - n), -2 * f * n / (f - n)],
            [0, 0, -1, 0]]);
    }

    proj_vertex(v) {
        if (SIMPLE) {
            let n = this.n;
            let f = this.f;
            let w = this.r - this.l;
            let h = this.t - this.b;
            let c = 2 * n * (f - n) / (v.z * (f + n) - 2 * n * f);
            v.x *= c / w;
            v.y *= c / h;
        } else {
            v.transform4(this.m); //from world coords to eye coords
            v.x *= -1;
            v.y *= -1;
        }
        v.z = 0;
    }
}

const SIMPLE = 1; // do projection matrix transformation manually
