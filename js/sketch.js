class Mesh {
    constructor(x, y) {
        this.m = Matrix.identity(4);
        this.vertices = [];
        this._edges = [];
        this.faces = [];
        this.m.translate(new Vector3(x, y, 0));
    }

    static square(x, y, size) {
        let mesh = new Mesh(x, y);
        mesh.vertices.push(new Vector3(-size, -size, 0));
        mesh.vertices.push(new Vector3(size, -size, 0));
        mesh.vertices.push(new Vector3(size, size, 0));
        mesh.vertices.push(new Vector3(-size, size, 0));
        mesh.add_edge(0, 1);
        mesh.add_edge(1, 2);
        mesh.add_edge(2, 3);
        mesh.add_edge(3, 0);
        return mesh;
    }

    static tetrahedron(x, y, size) {
        let mesh = new Mesh(x, y);
        mesh.vertices.push(new Vector3(0, -size, -size / 2));
        mesh.vertices.push(new Vector3(size, size / 2, -size / 2));
        mesh.vertices.push(new Vector3(-size, size / 2, -size / 2));
        mesh.vertices.push(new Vector3(0, 0, size));

        // mesh.add_edge(0, 1);
        // mesh.add_edge(0, 2);
        // mesh.add_edge(0, 3);
        // mesh.add_edge(1, 2);
        // mesh.add_edge(1, 3);
        // mesh.add_edge(2, 3);

        mesh.add_face(0, 1, 2);
        mesh.add_face(0, 1, 3);
        mesh.add_face(0, 2, 3);
        mesh.add_face(1, 2, 3);


        return mesh;
    }

    static cube(x, y, size) {
        let mesh = new Mesh(x, y);
        mesh.vertices.push(new Vector3(-size, -size, -size));
        mesh.vertices.push(new Vector3(size, -size, -size));
        mesh.vertices.push(new Vector3(size, size, -size));
        mesh.vertices.push(new Vector3(-size, size, -size));
        mesh.vertices.push(new Vector3(-size, -size, size));
        mesh.vertices.push(new Vector3(size, -size, size));
        mesh.vertices.push(new Vector3(size, size, size));
        mesh.vertices.push(new Vector3(-size, size, size));
        mesh.add_edge(0, 1);
        mesh.add_edge(1, 2);
        mesh.add_edge(2, 3);
        mesh.add_edge(3, 0);

        mesh.add_edge(4, 5);
        mesh.add_edge(5, 6);
        mesh.add_edge(6, 7);
        mesh.add_edge(7, 4);

        mesh.add_edge(0, 4);
        mesh.add_edge(1, 5);
        mesh.add_edge(2, 6);
        mesh.add_edge(3, 7);

        return mesh;
    }

    add_edge(i, j) {
        this._edges.push([i, j]);
    }

    add_face(p1, p2, p3) {
        this.faces.push([p1, p2, p3]);
    }

    *edges() {
        for (let f of this.faces) {
            yield [f[0], f[1]];
            yield [f[1], f[2]];
            yield [f[2], f[0]];
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
        camera = new Camera(500, 480,
            // new Isometric(screen_w, screen_w/aspect),
            new Perspective(near_plane, w, w / aspect, 600),
            new CamScreen(0, 0, screen_w, screen_w / aspect));
        camera.m.rotate(basis.k, radians(180));
        camera.update_inv();
        mesh = Mesh.cube(500, 400, 25);
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
