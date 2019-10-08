class Vector3 {
    constructor(x, y, z) {
        if (z === undefined)
            z = 0;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    transform(m) {
        m = m.data;
        let x = this.x;
        let y = this.y;
        let z = this.z;

        this.x = m[0][0] * x + m[0][1] * y + m[0][2] * z + m[0][3];
        this.y = m[1][0] * x + m[1][1] * y + m[1][2] * z + m[1][3];
        this.z = m[2][0] * x + m[2][1] * y + m[2][2] * z + m[2][3];
    }

    transform4(m) {
        m = m.data;
        let x = this.x;
        let y = this.y;
        let z = this.z;

        let w = m[3][0] * x + m[3][1] * y + m[3][2] * z + m[3][3];
        this.x = (m[0][0] * x + m[0][1] * y + m[0][2] * z + m[0][3]) / w;
        this.y = (m[1][0] * x + m[1][1] * y + m[1][2] * z + m[1][3]) / w;
        this.z = (m[2][0] * x + m[2][1] * y + m[2][2] * z + m[2][3]) / w;
    }

    transformed(m) {
        let r = this.copy();
        r.transform(m);
        return r;
    }

    scale(c) {
        this.x *= c;
        this.y *= c;
        this.z *= c;
    }

    inverted() {
        let r = this.copy();
        r.scale(-1);
        return r;
    }

    copy() {
        return new Vector3(this.x, this.y, this.z);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    normalize() {
        let len = this.length();
        if (len) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 1;
        }
    }

    repr() {
        return "Vector<" + this.x + ';' + this.y + ';' + this.z + ">"
    }
}

let basis = {
    i: new Vector3(1, 0, 0),
    j: new Vector3(0, 1, 0),
    k: new Vector3(0, 0, 1),
};
