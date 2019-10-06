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
