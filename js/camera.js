class Camera {
    constructor(x, y, projection, screen) {
        this.m = Matrix.identity(4);
        this.projection = projection.mul_left(ndc_matrix);
        this.m.translate(new Vector3(x, y, 0));
        this.m_inv = this.m.inverted();
        this.screen = screen;
        this.world_to_screen_m = new Matrix([
            [1, 0, 0, 0],
            [0, 0, 1, 0],
            [0, -1, 0, 0],
            [0, 0, 0, 1],
        ]);
        this.screen_to_world_m = this.world_to_screen_m.inverted();
    }

    update_inv() {
        this.m_inv = this.m.inverted();
    }

    draw(sketch) {
        this.draw_frame(sketch);
        this.draw_fov(sketch);
    }

    draw_fov(sketch) {
        if (!this.projection.data[3][2])
            return;
        let p0 = new Vector3(0, 0);
        let pl = new Vector3(-.5, this.projection.data[0][0] / 2);
        let pr = new Vector3(.5, this.projection.data[0][0] / 2);
        for (let p of [p0, pl, pr]) {
            p.scale(this.screen.w);
            p.transform(this.m);
        }
        // console.log("fov:", p0.x, p0.y, pl.x, pl.y);
        sketch.line(p0.x, p0.y, pl.x, pl.y);
        sketch.line(p0.x, p0.y, pr.x, pr.y);
    }

    draw_frame(sketch) {
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
        sketch.push();
        sketch.drawingContext.setLineDash([5, 5]);
        sketch.strokeWeight(.3);
        sketch.stroke(0, 0, 200);
        for (let v of mesh.vertices) {
            v = v.transformed(mesh.m);
            let p = v.transformed(this.m_inv); // now we have p relative to the screen, in other words p contains screen coordinates
            p.transform(this.world_to_screen_m);
            p.transform4(this.projection);
            p.x *= this.screen.w / 2;
            p.transform(this.screen_to_world_m);
            p.transform(this.m); // draw projected vertices on the screen
            sketch.line(v.x, v.y, p.x, p.y);
        }
        sketch.pop();
    }

    draw_on_screen(sketch, mesh) {
        let s = this.screen;
        let front_edges = new PairSet(mesh.vertices.length, true);
        let back_edges = new PairSet(mesh.vertices.length, true);
        let edges_set;

        let m = mat_mul(this.world_to_screen_m, this.m_inv, mesh.m); // from world to camera coords
        let vertices = [];
        for (let v of mesh.vertices) {
            v = v.transformed(m);
            v.transform4(this.projection);
            vertices.push(v);
        }

        s.draw(sketch);
        sketch.push();
        sketch.stroke(0, 200, 0);

        for (let face of mesh.faces) {
            let v1 = vertices[face[0]];
            let v2 = vertices[face[1]];
            let v3 = vertices[face[2]];
            let backface = (v1.minus(v2).cross(v2.minus(v3)).z < 0);
            if (backface) {
                sketch.strokeWeight(.5);
                edges_set = back_edges;
            } else {
                sketch.strokeWeight(2);
                edges_set = front_edges;
            }
            let len = face.length;
            for (let k = 0; k < len; ++k) {
                let i = face[k];
                let j = face[(k + 1) % len];
                if (edges_set.has(i, j))
                    continue;
                edges_set.add(i, j);
                s.line(sketch, vertices[i], vertices[j]);
            }
        }
        sketch.pop();
    }
}

class CamScreen {
    constructor(x, y, w, h) {
        this.w = w;
        this.h = h;
        this.m = Matrix.translation(new Vector3(x, y));
        this.m.data[0][0] = -this.w / 2;
        this.m.data[1][1] = -this.h / 2;
        // invert because like human's eye, projection matrix flips both axis
        this.m.translate(new Vector3(w / 2, h / 2));
    }

    draw(sketch) {
        let points = [];
        points.push(new Vector3(-1, -1));
        points.push(new Vector3(1, -1));
        points.push(new Vector3(1, 1));
        points.push(new Vector3(-1, 1));
        sketch.strokeWeight(0);
        sketch.fill(0);
        sketch.beginShape();
        for (let p of points) {
            p.transform(this.m);
            sketch.vertex(p.x, p.y);
        }
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
