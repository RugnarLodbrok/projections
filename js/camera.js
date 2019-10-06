class Isometric {
    constructor(n, f, l, r, t, b) {
        this.n = n;
        this.f = f;
        this.r = r;
        this.l = l;
        if (t === undefined)
            t = l;
        if (b === undefined)
            b = r;
        this.t = t;
        this.b = b;
        // this.m = new Matrix3(
        //     2 * n / (r - l), (r + l) / (r - l), 0,
        //     0, -(f + n) / (f - n), -2 * f * n / (f - n),
        //     0, -1, 0);
        this.m = new Matrix([
            [2 * n / (r - l), 0, (r + l) / (r - l), 0],
            [0, 2 * n / (t - b), (t + b) / (t - b), 0],
            [0, 0, -(f + n) / (f - n), -2 * f * n / (f - n)],
            [0, 0, -1, 0]]);
    }

    proj_vertex(v) {
        // v.transform(this.m); //from world coords to eye coords
        // v.x = v.x * this.n * this.n / ((this.r - this.l) * this.f);
        // v.x = v.x * (this.r - this.l) / this.f;
        v.y = 0;
    }
}

class Perspective extends Isometric {
    proj_vertex(v) {
        v.transform(this.m); //from world coords to eye coords
        v.x = -this.n * v.x / v.y;
        v.y = 0;
    }
}

class Camera {
    constructor(x, y) {
        this.m = Matrix.identity(4);
        // this.projection = new Isometric(20, 600, -5, 5);
        this.projection = new Perspective(20, 600, -5, 5);
        this.m.translate(new Vector3(x, y, 0));
        this.m_inv = this.m.inverted();
    }

    update_inv() {
        this.m_inv = this.m.inverted();
    }

    draw() {
        strokeWeight(.5);
        stroke(200, 0, 0);
        let p1 = new Vector3(-100, 0);
        let p2 = new Vector3(100, 0);
        p1.transform(this.m);
        p2.transform(this.m);
        line(p1.x, p1.y, p2.x, p2.y);
        p1 = new Vector3(-30, 0);
        p2 = new Vector3(-30, 5);
        p1.transform(this.m);
        p2.transform(this.m);
        line(p1.x, p1.y, p2.x, p2.y);
        p1 = new Vector3(30, 0);
        p2 = new Vector3(30, 5);
        p1.transform(this.m);
        p2.transform(this.m);
        line(p1.x, p1.y, p2.x, p2.y);

    }

    draw_projection(mesh) {
        drawingContext.setLineDash([5, 5]);
        strokeWeight(.3);
        stroke(0, 0, 200);
        for (let v of mesh.vertices) {
            v = v.copy();
            v.transform(mesh.m);
            this.draw_projection_vertex(v);
        }
        drawingContext.setLineDash([]);
    }

    draw_projection_vertex(v) {
        let p = v.copy();
        p.transform(this.m_inv); // now we have p relative to the screen, in other words p contains screen coordinates
        this.projection.proj_vertex(p);
        p.transform(this.m); // draw projected vertices on the screen
        line(v.x, v.y, p.x, p.y);
    }
}
