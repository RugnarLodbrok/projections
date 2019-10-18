let ndc_matrix = new Matrix([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1],
]);

function isometric_matrix(w, h) {
    return new Matrix([
        [2 / w, 0, 0, 0],
        [0, 2 / h, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ])
}

// http://www.songho.ca/opengl/gl_projectionmatrix.html
// http://www.songho.ca/opengl/gl_transform.html
function perspective_matrix(n, w, h, f) {
    if (h === undefined)
        h = w;
    if (f === undefined)
        f = 1000 * n;
    let l = -w / 2;
    let r = w / 2;
    let b = -h / 2;
    let t = h / 2;

    return new Matrix([
        [2 * n / (r - l), 0, (r + l) / (r - l), 0],
        [0, 2 * n / (t - b), (t + b) / (t - b), 0],
        [0, 0, -(f + n) / (f - n), -2 * f * n / (f - n)],
        [0, 0, -1, 0]]);
}
