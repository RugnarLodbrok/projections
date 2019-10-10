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
        mesh = Mesh.cube(500, 400, 25, 1);
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
