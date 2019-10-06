class Matrix {
    constructor(x1, x2, x3, y1, y2, y3, z1, z2, z3) {
        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;
    }

    copy() {
        return new Matrix(
            this.x1, this.x2, this.x3,
            this.y1, this.y2, this.y3,
            this.z1, this.z2, this.z3);
    }

    static identity() {
        return new Matrix(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1);
    }

    inverse() {
        let m = matrix_invert([
            [this.x1, this.x2, this.x3],
            [this.y1, this.y2, this.y3],
            [this.z1, this.z2, this.z3]]);
        return new Matrix(
            m[0][0], m[0][1], m[0][2],
            m[1][0], m[1][1], m[1][2],
            m[2][0], m[2][1], m[2][2]);
    }

    mul_left(other) {
        let x1 = other.x1 * this.x1 + other.x2 * this.y1 + other.x3 * this.z1;
        let x2 = other.x1 * this.x2 + other.x2 * this.y2 + other.x3 * this.z2;
        let x3 = other.x1 * this.x3 + other.x2 * this.y3 + other.x3 * this.z3;

        let y1 = other.y1 * this.x1 + other.y2 * this.y1 + other.y3 * this.z1;
        let y2 = other.y1 * this.x2 + other.y2 * this.y2 + other.y3 * this.z2;
        let y3 = other.y1 * this.x3 + other.y2 * this.y3 + other.y3 * this.z3;

        let z1 = other.z1 * this.x1 + other.z2 * this.y1 + other.z3 * this.z1;
        let z2 = other.z1 * this.x2 + other.z2 * this.y2 + other.z3 * this.z2;
        let z3 = other.z1 * this.x3 + other.z2 * this.y3 + other.z3 * this.z3;

        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;
    }

    static rotation(theta, point) {
        let sin = Math.sin(theta);
        let cos = Math.cos(theta);
        let r = new Matrix(
            cos, sin, 0,
            -sin, cos, 0,
            0, 0, 1);
        if (point === undefined)
            return r;
        let move = Matrix.identity();
        move.x3 = point.x;
        move.y3 = point.y;
        let unmove = Matrix.identity();
        unmove.x3 = -point.x;
        unmove.y3 = -point.y;
        r.mul_left(move);
        unmove.mul_left(r);
        return unmove;
    }

    rotate(theta, point) {
        this.mul_left(Matrix.rotation(theta, point));
    }

    rotate_rel(theta) {
        this.mul_left(Matrix.rotation(theta, new Vector(this.x3, this.y3)));
    }

    move(d) {
        this.x3 += d.x;
        this.y3 += d.y;
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    transform(m) {
        let x = m.x1 * this.x + m.x2 * this.y + m.x3;
        let y = m.y1 * this.x + m.y2 * this.y + m.y3;
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
}

class Mesh {
    constructor(x, y) {
        this.m = Matrix.identity();
        this.vertices = [];
        this.edges = [];
        this.m.move(new Vector(x, y));
    }

    add_edge(i, j) {
        this.edges.push([i, j]);
    }

    draw() {
        stroke(0);
        strokeWeight(2);
        for (let edge of this.edges) {
            let p1 = this.vertices[edge[0]].copy();
            let p2 = this.vertices[edge[1]].copy();
            p1.transform(this.m);
            p2.transform(this.m);
            line(p1.x, p1.y, p2.x, p2.y);
        }
    }
}

class Isometric {
    constructor(n, f, l, r) {
        this.n = n;
        this.f = f;
        this.r = r;
        this.l = l;
        this.m = new Matrix(
            2 * n / (r - l), (r + l) / (r - l), 0,
            0, -(f + n) / (f - n), -2 * f * n / (f - n),
            0, -1, 0);
    }

    proj_vertex(v) {
        v.transform(this.m); //from world coords to eye coords
        v.x = v.x * this.n * this.n / ((this.r - this.l) * this.f);
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
        this.m = Matrix.identity();
        this.perspective = new Isometric(20, 600, -5, 5);
        // this.perspective = new Perspective(20, 600, -5, 5);
        this.m.move(new Vector(x, y));
        this.m_inv = this.m.inverse();
    }

    update_inv() {
        this.m_inv = this.m.inverse();
    }

    draw() {
        strokeWeight(.5);
        stroke(200, 0, 0);
        let p1 = new Vector(-100, 0);
        let p2 = new Vector(100, 0);
        p1.transform(this.m);
        p2.transform(this.m);
        line(p1.x, p1.y, p2.x, p2.y);
        p1 = new Vector(-30, 0);
        p2 = new Vector(-30, 5);
        p1.transform(this.m);
        p2.transform(this.m);
        line(p1.x, p1.y, p2.x, p2.y);
        p1 = new Vector(30, 0);
        p2 = new Vector(30, 5);
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
        this.perspective.proj_vertex(p);
        p.transform(this.m); // draw projected vertices on the screen
        line(v.x, v.y, p.x, p.y);
    }
}

let mesh;
let camera;

function setup() {
    createCanvas(600, 400);
    camera = new Camera(300, 360);
    camera.m.rotate_rel(radians(180));
    camera.update_inv();
    mesh = new Mesh(300, 200);
    mesh.vertices.push(new Vector(0, 0));
    mesh.vertices.push(new Vector(50, 0));
    mesh.vertices.push(new Vector(50, 50));
    mesh.vertices.push(new Vector(0, 50));
    mesh.add_edge(0, 1);
    mesh.add_edge(1, 2);
    mesh.add_edge(2, 3);
    mesh.add_edge(3, 0);
}

function draw() {
    if (keyIsDown(W)) {
        let v = new Vector(0, 1);
        v.transform(camera.m);
        camera.m.x3 = v.x;
        camera.m.y3 = v.y;
        camera.update_inv();
    }
    if (keyIsDown(S)) {
        let v = new Vector(0, -1);
        v.transform(camera.m);
        camera.m.x3 = v.x;
        camera.m.y3 = v.y;
        camera.update_inv();
    }
    if (keyIsDown(A)) {
        let v = new Vector(1, 0);
        v.transform(camera.m);
        camera.m.x3 = v.x;
        camera.m.y3 = v.y;
        camera.update_inv();
    }
    if (keyIsDown(D)) {
        let v = new Vector(-1, 0);
        v.transform(camera.m);
        camera.m.x3 = v.x;
        camera.m.y3 = v.y;
        camera.update_inv();
    }
    if (keyIsDown(Q)) {
        camera.m.rotate_rel(radians(1));
        camera.update_inv();
    }
    if (keyIsDown(E)) {
        camera.m.rotate_rel(radians(-1));
        camera.update_inv();
    }
    background(220);
    mesh.m.rotate(radians(1), new Vector(325, 225));
    mesh.draw();
    camera.draw();
    camera.draw_projection(mesh);
}
