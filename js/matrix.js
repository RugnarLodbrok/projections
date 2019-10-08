class Matrix {
    constructor(data) {
        for (let row of data)
            if (row.length !== data.length)
                throw "bad matrix data";
        this.data = data;
        this.rank = data.length;
    }

    copy() {
        const rank = this.rank;
        let r = new Matrix([]);
        r.rank = rank;
        let src = this.data;
        r.data = new Array(rank);
        let dst = r.data;
        for (let i = 0; i < rank; ++i) {
            dst[i] = new Array(rank);
            for (let j = 0; j < rank; ++j)
                dst[i][j] = src[i][j];
        }
        return r;
    }

    static identity(rank) {
        let m = new Matrix([]);
        let data = Array(rank);
        m.data = data;
        for (let i = 0; i < rank; ++i) {
            data[i] = new Array(rank);
            for (let j = 0; j < rank; ++j)
                data[i][j] = 0;
            data[i][i] = 1;
        }
        m.rank = rank;
        return m;
    }

    inverted() {
        const epsilon = .01;
        const rank = this.rank;
        let i;
        let j;

        let r = Matrix.identity(this.rank);
        let M = this.copy().data;
        let I = r.data;

        // Gaussian Elimination
        // (1) 'augment' the matrix (left) by the identity (on the right)
        // (2) Turn the matrix on the left into the identity by elemetry row ops
        // (3) The matrix on the right is the inverse (was the identity matrix)

        let swap_rows = (i, j) => {
            let tmp = M[i];
            M[i] = M[j];
            M[j] = tmp;
            tmp = I[i];
            I[i] = I[j];
            I[j] = tmp;
        };
        let div_row = (i, c) => {
            for (j = 0; j < rank; ++j) {
                M[i][j] /= c;
                I[i][j] /= c;
            }
        };
        let sub_row = (i, k, c) => {
            for (j = 0; j < rank; ++j) {
                M[i][j] -= M[k][j] * c;
                I[i][j] -= I[k][j] * c;
            }
        };

        for (let m = 0; m < rank; ++m) {
            if (Math.abs(M[m][m]) < epsilon) {
                for (i = m + 1; i < rank; ++i) {
                    if (Math.abs(M[i][m]) > epsilon) {
                        swap_rows(m, i);
                        break;
                    }
                }
                if (i < 0)
                    throw "invert matrix error";
            }
            div_row(m, M[m][m]);
            for (i = m + 1; i < rank; ++i) {
                if (M[i][m] !== 0) {
                    sub_row(i, m, M[i][m] / M[m][m])
                }
            }
        }
        // at this point M is triangle matrix
        for (let m = rank - 1; m >= 0; --m) {
            div_row(m, M[m][m]);
            for (i = 0; i < m; ++i) {
                if (M[i][m] !== 0) {
                    sub_row(i, m, M[i][m] / M[m][m])
                }
            }
        }
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
        const rank = this.rank;
        let r = Matrix.identity(rank);
        let m = r.data;
        let b = this.data;
        let a = other.data;
        for (let i = 0; i < rank; ++i) {
            for (let j = 0; j < rank; ++j) {
                m[i][j] = 0;
                for (let k = 0; k < rank; k++) {
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
                r += Math.round(this.data[i][j] * 100) / 100 + "\t";
            }
        }
        return r;
    }
}

let basis_rotate_cw = new Matrix([
    [0, 0, 1, 0],
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1]]);

let basis_rotate_ccw = new Matrix([
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 1]]);

let basis_swap_yz = new Matrix([
    [-1, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1]]);

function mat_mul() {
    let len = arguments.length;
    if (len < 2)
        throw "mat_mul takes at least 2 args";
    r = arguments[len - 1];
    for (let i = len - 2; i >= 0; --i)
        r = r.mul_left(arguments[i]);
    return r;
}
