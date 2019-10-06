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
    // camera = new Camera(300, 360);
    // camera.m.rotate_rel(radians(180));
    // camera.update_inv();
    mesh = Mesh.square(300, 200, 25);
}

function draw() {
    /*    if (keyIsDown(W)) {
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
        }*/
    background(220);
    // mesh.m.rotate(radians(1), new Vector2(325, 225));
    mesh.m.rotate(new Vector3(0, 0, 1), radians(1));
    mesh.draw();
    // camera.draw();
    // camera.draw_projection(mesh);
}
