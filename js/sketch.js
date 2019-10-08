class Mesh {
    constructor(x, y) {
        this.m = Matrix.identity(4);
        this.vertices = [];
        this.edges = [];
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
        this.edges.push([i, j]);
    }

    draw() {
        stroke(0);
        strokeWeight(2);
        for (let edge of this.edges) {
            let p1 = this.vertices[edge[0]].copy();
            let p2 = this.vertices[edge[1]].copy();
            p1.transform(this.m);
            p2.transform(this.m);
            line(p1.x, p1.y, p2.x, p2.y);
        }
    }
}

let mesh;
let camera;

function setup() {
    createCanvas(800, 600);
    camera = new Camera(500, 560,
        // new Isometric(),
        new Perspective(10, 600, -1, 1),
        new CamScreen(0, 0, 300, 200));
    camera.m.rotate(basis.k, radians(180));
    camera.update_inv();
    mesh = Mesh.cube(500, 400, 25);
}

function draw() {
    if (keyIsDown(W)) {
        let v = new Vector3(0, 1);
        v.transform(camera.m);
        camera.m.set_translate(v);
        camera.update_inv();
    }
    if (keyIsDown(S)) {
        let v = new Vector3(0, -1);
        v.transform(camera.m);
        camera.m.set_translate(v);
        camera.update_inv();
    }
    if (keyIsDown(A)) {
        let v = new Vector3(1, 0);
        v.transform(camera.m);
        camera.m.set_translate(v);
        camera.update_inv();
    }
    if (keyIsDown(D)) {
        let v = new Vector3(-1, 0);
        v.transform(camera.m);
        camera.m.set_translate(v);
        camera.update_inv();
    }
    if (keyIsDown(Q)) {
        camera.m.rotate(basis.k, radians(-1));
        camera.update_inv();
    }
    if (keyIsDown(E)) {
        camera.m.rotate(basis.k, radians(1));
        camera.update_inv();
    }
    background(220);
    mesh.m.rotate(basis.k, radians(1));
    mesh.draw();
    camera.draw();
    camera.draw_projection(mesh);
    camera.draw_on_screen(mesh);
}
