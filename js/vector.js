class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    transform(m) {
        let x = m[0][0] * this.x + m[0][1] * this.y + m[0][2] * this.z + m[0][3];
        let y = m[1][0] * this.x + m[1][1] * this.y + m[1][2] * this.z + m[1][3];
        let z = m[2][0] * this.x + m[2][1] * this.y + m[2][2] * this.z + m[2][3];

        this.x = x;
        this.y = y;
        this.z = z;
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
}
