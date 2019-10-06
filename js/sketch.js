class Mesh {
    constructor(x, y) {
        this.m = Matrix3.identity();
        this.vertices = [];
        this.edges = [];
        this.m.move(new Vector2(x, y));
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
    createCanvas(600, 400);
    camera = new Camera(300, 360);
    camera.m.rotate_rel(radians(180));
    camera.update_inv();
    mesh = new Mesh(300, 200);
    mesh.vertices.push(new Vector2(0, 0));
    mesh.vertices.push(new Vector2(50, 0));
    mesh.vertices.push(new Vector2(50, 50));
    mesh.vertices.push(new Vector2(0, 50));
    mesh.add_edge(0, 1);
    mesh.add_edge(1, 2);
    mesh.add_edge(2, 3);
    mesh.add_edge(3, 0);
}

function draw() {
    if (keyIsDown(W)) {
        let v = new Vector2(0, 1);
        v.transform(camera.m);
        camera.m.x3 = v.x;
        camera.m.y3 = v.y;
        camera.update_inv();
    }
    if (keyIsDown(S)) {
        let v = new Vector2(0, -1);
        v.transform(camera.m);
        camera.m.x3 = v.x;
        camera.m.y3 = v.y;
        camera.update_inv();
    }
    if (keyIsDown(A)) {
        let v = new Vector2(1, 0);
        v.transform(camera.m);
        camera.m.x3 = v.x;
        camera.m.y3 = v.y;
        camera.update_inv();
    }
    if (keyIsDown(D)) {
        let v = new Vector2(-1, 0);
        v.transform(camera.m);
        camera.m.x3 = v.x;
        camera.m.y3 = v.y;
        camera.update_inv();
    }
    if (keyIsDown(Q)) {
        camera.m.rotate_rel(radians(1));
        camera.update_inv();
    }
    if (keyIsDown(E)) {
        camera.m.rotate_rel(radians(-1));
        camera.update_inv();
    }
    background(220);
    mesh.m.rotate(radians(1), new Vector2(325, 225));
    mesh.draw();
    camera.draw();
    camera.draw_projection(mesh);
}
