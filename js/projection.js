class Isometric2 {
    constructor(n, f, l, r) {
        this.n = n;
        this.f = f;
        this.r = r;
        this.l = l;
        this.m = new Matrix3(
            2 * n / (r - l), (r + l) / (r - l), 0,
            0, -(f + n) / (f - n), -2 * f * n / (f - n),
            0, -1, 0);

    }

    proj_vertex(v) {
        v.y = 0;
    }
}

class Perspective2 extends Isometric2 {
    proj_vertex(v) {
        v.transform(this.m); //from world coords to eye coords
        v.x = -this.n * v.x / v.y;
        v.y = 0;
    }
}

class Isometric {
    constructor(n, f, l, r, t, b) {
        this.n = n;
        this.f = f;
        this.r = r;
        this.l = l;
        if (t === undefined)
            t = r;
        if (b === undefined)
            b = l;
        this.t = t;
        this.b = b;
        this.m = new Matrix([
            [2 * n / (r - l), 0, (r + l) / (r - l), 0],
            [0, 2 * n / (t - b), (t + b) / (t - b), 0],
            [0, 0, -(f + n) / (f - n), -2 * f * n / (f - n)],
            [0, 0, -1, 0]]);
    }

    proj_vertex(v) {
        v.y = 0;
    }
}

class Perspective extends Isometric {
    proj_vertex(v) {
        v.transform(this.m); //from world coords to eye coords
        v.x = -this.n * v.x / v.z;
        v.y = -this.n * v.y / v.z;
        v.z = 0;
    }
}
