class Camera {
    constructor(x, y, projection, screen) {
        this.m = Matrix.identity(4);
        this.projection = projection;
        this.m.translate(new Vector3(x, y, 0));
        this.m_inv = this.m.inverted();
        this.screen = screen;
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
            let p = v.copy();
            p.transform(this.m_inv); // now we have p relative to the screen, in other words p contains screen coordinates
            p.transform(basis_rotate_cw); // turn y to z
            this.projection.proj_vertex(p); // project along z
            p.transform(basis_rotate_ccw); // turn z to y
            p.transform(this.m); // draw projected vertices on the screen
            line(v.x, v.y, p.x, p.y);
        }
        drawingContext.setLineDash([]);
    }

    draw_on_screen() {
        let s = this.screen;
        s.draw();
        strokeWeight(1);
        stroke(0, 200, 0);
        for (let edge of mesh.edges) {
            let v1 = mesh.vertices[edge[0]].copy();
            let v2 = mesh.vertices[edge[1]].copy();
            v1.transform(mesh.m);
            v1.transform(this.m_inv);
            v1.transform(basis_swap_yz); // turn y to z
            this.projection.proj_vertex(v1);
            v2.transform(mesh.m);
            v2.transform(this.m_inv);
            v2.transform(basis_swap_yz);
            this.projection.proj_vertex(v2);
            s.line(v1, v2);
        }
    }
}

class CamScreen {
    constructor(x, y, w, h) {
        this.m = Matrix.translation(new Vector3(x, y));
        this.m.translate(new Vector3(w / 2, h / 2));
        this.w = w;
        this.h = h;
    }

    draw() {
        let w_2 = this.w / 2;
        let h_2 = this.h / 2;
        let p1 = new Vector3(-w_2, -h_2);
        let p2 = new Vector3(w_2, -h_2);
        let p3 = new Vector3(w_2, h_2);
        let p4 = new Vector3(-w_2, h_2);
        p1.transform(this.m);
        p2.transform(this.m);
        p3.transform(this.m);
        p4.transform(this.m);
        strokeWeight(0);
        fill(0);
        beginShape();
        vertex(p1.x, p1.y);
        vertex(p2.x, p2.y);
        vertex(p3.x, p3.y);
        vertex(p4.x, p4.y);
        endShape(CLOSE);
    }

    line(p1, p2) {
        p1 = p1.copy();
        p2 = p2.copy();
        p1.transform(this.m);
        p2.transform(this.m);
        // console.log("screen vertex:", p1.x, p2.x);
        line(p1.x, p1.y, p2.x, p2.y);
    }
}
