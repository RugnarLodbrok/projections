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

    draw(sketch) {
        let w_2 = this.screen.w / 2;
        sketch.strokeWeight(.5);
        sketch.stroke(200, 0, 0);
        let p1 = new Vector3(-w_2, 0);
        let p2 = new Vector3(w_2, 0);
        p1.transform(this.m);
        p2.transform(this.m);
        sketch.line(p1.x, p1.y, p2.x, p2.y);
        p1 = new Vector3(-w_2, 0);
        p2 = new Vector3(-w_2, 5);
        p1.transform(this.m);
        p2.transform(this.m);
        sketch.line(p1.x, p1.y, p2.x, p2.y);
        p1 = new Vector3(w_2, 0);
        p2 = new Vector3(w_2, 5);
        p1.transform(this.m);
        p2.transform(this.m);
        sketch.line(p1.x, p1.y, p2.x, p2.y);
    }

    draw_projection(sketch, mesh) {
        sketch.drawingContext.setLineDash([5, 5]);
        sketch.strokeWeight(.3);
        sketch.stroke(0, 0, 200);
        for (let v of mesh.vertices) {
            v = v.transformed(mesh.m);
            let p = v.transformed(this.m_inv); // now we have p relative to the screen, in other words p contains screen coordinates
            p.transform(basis_swap_yz);
            this.projection.proj_vertex(p); // project along z
            p.x *= -this.screen.w;
            p.transform(basis_swap_yz);
            p.transform(this.m); // draw projected vertices on the screen
            sketch.line(v.x, v.y, p.x, p.y);
        }
        sketch.drawingContext.setLineDash([]);
    }

    draw_on_screen(sketch, mesh) {
        let s = this.screen;
        s.draw(sketch);
        sketch.strokeWeight(1);
        sketch.stroke(0, 200, 0);
        let m = mat_mul(basis_swap_yz, this.m_inv, mesh.m); // from world to camera coords
        for (let edge of mesh.edges) {
            let v1 = mesh.vertices[edge[0]].transformed(m);
            let v2 = mesh.vertices[edge[1]].transformed(m);
            this.projection.proj_vertex(v1);
            this.projection.proj_vertex(v2);
            s.line(sketch, v1, v2);
        }
    }
}

class CamScreen {
    constructor(x, y, w, h) {
        this.w = w;
        this.h = h;
        this.m = Matrix.translation(new Vector3(x, y));
        this.m.data[0][0] = this.w;
        this.m.data[1][1] = this.h;
        this.m.translate(new Vector3(w / 2, h / 2));
    }

    draw(sketch) {
        let p1 = new Vector3(-.5, -.5);
        let p2 = new Vector3(.5, -.5);
        let p3 = new Vector3(.5, .5);
        let p4 = new Vector3(-.5, .5);
        p1.transform(this.m);
        p2.transform(this.m);
        p3.transform(this.m);
        p4.transform(this.m);
        sketch.strokeWeight(0);
        sketch.fill(0);
        sketch.beginShape();
        sketch.vertex(p1.x, p1.y);
        sketch.vertex(p2.x, p2.y);
        sketch.vertex(p3.x, p3.y);
        sketch.vertex(p4.x, p4.y);
        sketch.endShape(sketch.CLOSE);
    }

    line(sketch, p1, p2) {
        p1 = p1.copy();
        p2 = p2.copy();
        p1.transform(this.m);
        p2.transform(this.m);
        sketch.line(p1.x, p1.y, p2.x, p2.y);
    }
}
