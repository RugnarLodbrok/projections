class Mesh {
    constructor(x, y) {
        this.m = Matrix.identity(4);
        this.vertices = [];
        this.faces = [];
        this.m.translate(new Vector3(x, y, 0));
    }

    scale(c) {
        for (let v of this.vertices)
            v.scale(c);
    }

    static square(x, y, size) {
        let mesh = new Mesh(x, y);
        mesh.vertices.push(new Vector3(-size, -size, 0));
        mesh.vertices.push(new Vector3(size, -size, 0));
        mesh.vertices.push(new Vector3(size, size, 0));
        mesh.vertices.push(new Vector3(-size, size, 0));
        mesh.add_face(0, 1, 2, 3);
        return mesh;
    }

    static tetrahedron(x, y, size) {
        let mesh = new Mesh(x, y);
        mesh.vertices.push(new Vector3(Math.sqrt(8 / 9), 0, -1 / 3));
        mesh.vertices.push(new Vector3(-Math.sqrt(2 / 9), Math.sqrt(2 / 3), -1 / 3));
        mesh.vertices.push(new Vector3(-Math.sqrt(2 / 9), -Math.sqrt(2 / 3), -1 / 3));
        mesh.vertices.push(new Vector3(0, 0, 1));
        mesh.scale(size);
        mesh.scale(1.6);

        mesh.add_face(1, 0, 2);
        mesh.add_face(3, 0, 1);
        mesh.add_face(2, 0, 3);
        mesh.add_face(3, 1, 2);

        return mesh;
    }

    static octahedron(x, y, size) {
        let mesh = new Mesh(x, y);
        mesh.vertices.push(new Vector3(0, 0, -1));
        mesh.vertices.push(new Vector3(0, 0, 1));
        mesh.vertices.push(new Vector3(0, -1, 0));
        mesh.vertices.push(new Vector3(0, 1, 0));
        mesh.vertices.push(new Vector3(-1, 0, 0));
        mesh.vertices.push(new Vector3(1, 0, 0));
        mesh.scale(size);
        mesh.scale(1.4);

        mesh.add_face(2, 0, 5);
        mesh.add_face(5, 0, 3);
        mesh.add_face(3, 0, 4);
        mesh.add_face(4, 0, 2);
        mesh.add_face(1, 2, 5);
        mesh.add_face(1, 5, 3);
        mesh.add_face(1, 3, 4);
        mesh.add_face(1, 4, 2);

        return mesh;
    }

    static icosahedron(x, y, size) {
        let mesh = new Mesh(x, y);
        let t = (1.0 + Math.sqrt(5.0)) / 2.0;

        mesh.vertices.push(new Vector3(-1, t, 0));
        mesh.vertices.push(new Vector3(1, t, 0));
        mesh.vertices.push(new Vector3(-1, -t, 0));
        mesh.vertices.push(new Vector3(1, -t, 0));

        mesh.vertices.push(new Vector3(0, -1, t));
        mesh.vertices.push(new Vector3(0, 1, t));
        mesh.vertices.push(new Vector3(0, -1, -t));
        mesh.vertices.push(new Vector3(0, 1, -t));

        mesh.vertices.push(new Vector3(t, 0, -1));
        mesh.vertices.push(new Vector3(t, 0, 1));
        mesh.vertices.push(new Vector3(-t, 0, -1));
        mesh.vertices.push(new Vector3(-t, 0, 1));
        mesh.scale(size);
        mesh.scale(0.7);

        // 5 faces around point 0
        mesh.add_face(0, 11, 5);
        mesh.add_face(0, 5, 1);
        mesh.add_face(0, 1, 7);
        mesh.add_face(0, 7, 10);
        mesh.add_face(0, 10, 11);

        // 5 adjacent faces
        mesh.add_face(1, 5, 9);
        mesh.add_face(5, 11, 4);
        mesh.add_face(11, 10, 2);
        mesh.add_face(10, 7, 6);
        mesh.add_face(7, 1, 8);

        // 5 faces around point 3
        mesh.add_face(3, 9, 4);
        mesh.add_face(3, 4, 2);
        mesh.add_face(3, 2, 6);
        mesh.add_face(3, 6, 8);
        mesh.add_face(3, 8, 9);

        // 5 adjacent faces
        mesh.add_face(4, 9, 5);
        mesh.add_face(2, 4, 11);
        mesh.add_face(6, 2, 10);
        mesh.add_face(8, 6, 7);
        mesh.add_face(9, 8, 1);

        return mesh;
    }

    static dodecahedron(x, y, size) {
        let mesh = new Mesh(x, y);
        let phi = (1 + Math.sqrt(5)) / 2;
        mesh.vertices.push(new Vector3(-1, -1, -1));
        mesh.vertices.push(new Vector3(1, -1, -1));
        mesh.vertices.push(new Vector3(-1, 1, -1));
        mesh.vertices.push(new Vector3(1, 1, -1));
        mesh.vertices.push(new Vector3(-1, -1, 1));
        mesh.vertices.push(new Vector3(1, -1, 1));
        mesh.vertices.push(new Vector3(-1, 1, 1));
        mesh.vertices.push(new Vector3(1, 1, 1));

        mesh.vertices.push(new Vector3(0, -1 / phi, -phi));
        mesh.vertices.push(new Vector3(0, -1 / phi, phi));
        mesh.vertices.push(new Vector3(0, 1 / phi, -phi));
        mesh.vertices.push(new Vector3(0, 1 / phi, phi));

        mesh.vertices.push(new Vector3(-1 / phi, -phi, 0));
        mesh.vertices.push(new Vector3(-1 / phi, phi, 0));
        mesh.vertices.push(new Vector3(1 / phi, -phi, 0));
        mesh.vertices.push(new Vector3(1 / phi, phi, 0));

        mesh.vertices.push(new Vector3(-phi, 0, -1 / phi));
        mesh.vertices.push(new Vector3(phi, 0, -1 / phi));
        mesh.vertices.push(new Vector3(-phi, 0, 1 / phi));
        mesh.vertices.push(new Vector3(phi, 0, 1 / phi));
        mesh.scale(size);
        mesh.scale(0.7);

        mesh.add_face(15, 13, 6, 11, 7);
        mesh.add_face(13, 15, 3, 10, 2);
        mesh.add_face(14, 12, 0, 8, 1);
        mesh.add_face(12, 14, 5, 9, 4);

        mesh.add_face(18, 4, 9, 11, 6);
        mesh.add_face(16, 2, 10, 8, 0);
        mesh.add_face(11, 9, 5, 19, 7);
        mesh.add_face(8, 10, 3, 17, 1);

        mesh.add_face(16, 18, 6, 13, 2);
        mesh.add_face(18, 16, 0, 12, 4);
        mesh.add_face(17, 19, 5, 14, 1);
        mesh.add_face(19, 17, 3, 15, 7);

        return mesh;
    }

    static cube(x, y, size) {
        let mesh = new Mesh(x, y);
        mesh.vertices.push(new Vector3(-1, -1, -1));
        mesh.vertices.push(new Vector3(1, -1, -1));
        mesh.vertices.push(new Vector3(1, 1, -1));
        mesh.vertices.push(new Vector3(-1, 1, -1));
        mesh.vertices.push(new Vector3(-1, -1, 1));
        mesh.vertices.push(new Vector3(1, -1, 1));
        mesh.vertices.push(new Vector3(1, 1, 1));
        mesh.vertices.push(new Vector3(-1, 1, 1));
        mesh.scale(size);
        mesh.scale(0.8);

        mesh.add_face(3, 2, 1, 0);
        mesh.add_face(4, 5, 6, 7);
        mesh.add_face(1, 5, 4, 0);
        mesh.add_face(2, 6, 5, 1);
        mesh.add_face(0, 4, 7, 3);
        mesh.add_face(7, 6, 2, 3);

        return mesh;
    }

    add_face() {
        this.faces.push(arguments);
    }

    * edges() {
        let edges = new PairSet(this.vertices.length, true);
        for (let f of this.faces) {
            let len = f.length;
            for (let i = 0; i < len; ++i) {
                let f1 = f[i];
                let f2 = f[(i + 1) % len];
                if (edges.has(f1, f2))
                    continue;
                edges.add(f1, f2);
                yield [f1, f2];
            }
        }
    }

    draw(sketch) {
        sketch.stroke(0);
        sketch.strokeWeight(2);
        for (let edge of this.edges()) {
            let p1 = this.vertices[edge[0]].copy();
            let p2 = this.vertices[edge[1]].copy();
            p1.transform(this.m);
            p2.transform(this.m);
            sketch.line(p1.x, p1.y, p2.x, p2.y);
        }
    }
}

let mesh;
let camera;

function p5_func(sketch) {
    sketch.setup = () => {
        const screen_w = 300;
        const aspect = 1.5;
        const near_plane = 1;
        const fov = 80;
        let w = 2 * near_plane * Math.tan(radians(fov / 2));
        sketch.createCanvas(800, 600);
        camera = new Camera(500, 500,
            // new Isometric(screen_w, screen_w/aspect),
            new Perspective(near_plane, w, w / aspect, 600),
            new CamScreen(0, 0, screen_w, screen_w / aspect));
        camera.m.rotate(basis.k, radians(180));
        camera.update_inv();
        mesh = Mesh.dodecahedron(500, 400, 25);
    };
    sketch.draw = () => {
        if (sketch.keyIsDown(W)) {
            let v = new Vector3(0, 1);
            v.transform(camera.m);
            camera.m.set_translate(v);
            camera.update_inv();
        }
        if (sketch.keyIsDown(S)) {
            let v = new Vector3(0, -1);
            v.transform(camera.m);
            camera.m.set_translate(v);
            camera.update_inv();
        }
        if (sketch.keyIsDown(A)) {
            let v = new Vector3(1, 0);
            v.transform(camera.m);
            camera.m.set_translate(v);
            camera.update_inv();
        }
        if (sketch.keyIsDown(D)) {
            let v = new Vector3(-1, 0);
            v.transform(camera.m);
            camera.m.set_translate(v);
            camera.update_inv();
        }
        if (sketch.keyIsDown(Q)) {
            camera.m.rotate(basis.k, radians(-1));
            camera.update_inv();
        }
        if (sketch.keyIsDown(E)) {
            camera.m.rotate(basis.k, radians(1));
            camera.update_inv();
        }
        mesh.m.rotate(basis.k, radians(1));
        sketch.background(220);
        sketch.fill(0);
        sketch.stroke(0);
        sketch.textSize(24);
        sketch.text("controls: W A S D Q E", 35, 235);
        mesh.draw(sketch);
        camera.draw(sketch);
        camera.draw_projection(sketch, mesh);
        camera.draw_on_screen(sketch, mesh);
    };
}

new p5(p5_func, document.getElementById("sketch"));
