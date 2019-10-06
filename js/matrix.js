class Matrix {
    constructor(data) {
        for (let row of data)
            if (row.length() !== data.length())
                throw "bad matrix data";
        this.data = data;
        this.rank = data.length();
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
        let w2 = w.copy();
        w2.mul_left(w2);
        w.mul_c(Math.sin(theta));
        w2.mul_c(1 - Math.cos(theta));
        return new Matrix([
            [1 + w[0][0] + w2[0][0], w[0][1] + w2[0][1], w[0][2] + w2[0][2], 0],
            [w[1][0] + w2[1][0], w[1][1] + w2[1][1] + 1, w[1][2] + w2[1][2], 0],
            [w[2][0] + w2[2][0], w[2][1] + w2[2][1], w[2][2] + w2[2][2] + 1, 0],
            [0, 0, 0, 1],
        ])
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
}
