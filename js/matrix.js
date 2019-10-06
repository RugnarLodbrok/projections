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
