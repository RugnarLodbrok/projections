class Matrix {
    constructor(data) {
        for (let row of data)
            if (row.length !== data.length)
                throw "bad matrix data";
        this.data = data;
        this.rank = data.length;
    }

    static identity(rank) {
        let m = new Matrix([]);
        m.data = Array(rank);
        for (let i = 0; i < rank; ++i) {
            m.data[i] = Array(rank).fill(0);
            m.data[i][i] = 1;
        }
        m.rank = rank;
        return m;
    }

    inverted() {
        let r = new Matrix([]);
        r.rank = this.rank;
        r.data = matrix_invert(this.data);
        return r;
    }

    static rotation(axis, point, theta) {
        if (theta === undefined)
            theta = axis.length();
        axis.normalize();
        let w = new Matrix([
            [0, -axis.z, axis.y],
            [axis.z, 0, -axis.x],
            [-axis.y, axis.x, 0]]);
        let w2 = w.mul_left(w);
        w.mul_c(Math.sin(theta));
        w2.mul_c(1 - Math.cos(theta));
        w = w.data;
        w2 = w2.data;
        let r = new Matrix([
            [1 + w[0][0] + w2[0][0], w[0][1] + w2[0][1], w[0][2] + w2[0][2], 0],
            [w[1][0] + w2[1][0], w[1][1] + w2[1][1] + 1, w[1][2] + w2[1][2], 0],
            [w[2][0] + w2[2][0], w[2][1] + w2[2][1], w[2][2] + w2[2][2] + 1, 0],
            [0, 0, 0, 1],
        ]);
        r = r.mul_left(Matrix.translation(point));
        r = r.mul_right(Matrix.translation(point.inverted()));
        return (r);
    }

    rotate(axis, theta) {
        this.data = this.mul_left(Matrix.rotation(axis,
            new Vector3(this.data[0][3], this.data[1][3], this.data[2][3]),
            theta)).data;
    }

    translate(v) {
        this.data[0][3] += v.x;
        this.data[1][3] += v.y;
        this.data[2][3] += v.z;
    }

    set_translate(v) {
        this.data[0][3] = v.x;
        this.data[1][3] = v.y;
        this.data[2][3] = v.z;
    }

    static translation(v) {
        let r = Matrix.identity(4);
        r.data[0][3] = v.x;
        r.data[1][3] = v.y;
        r.data[2][3] = v.z;
        return r;
    }

    mul_c(c) {
        for (let i = 0; i < this.rank; ++i)
            for (let j = 0; j < this.rank; ++j)
                this.data[i][j] *= c;
    }

    mul_left(other) {
        let r = Matrix.identity(this.rank);
        let m = r.data;
        let b = this.data;
        let a = other.data;
        for (let i = 0; i < this.rank; ++i) {
            for (let j = 0; j < this.rank; ++j) {
                m[i][j] = 0;
                for (let k = 0; k < this.rank; k++) {
                    m[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return r;
    }

    mul_right(other) {
        return other.mul_left(this);
    }

    repr() {
        let r = "Matrix [";
        for (let i = 0; i < this.rank; ++i) {
            r += "\n";
            for (let j = 0; j < this.rank; ++j) {
                r += Math.round(this.data[i][j] * 100) / 100 + " ";
            }
        }
        return r;
    }
}
