var cvs = document.getElementById("myCanvas");
var ctx = cvs.getContext("2d");

lastFrameTime = null;

var orbit_r = 150;
var init_m = 0.1;

//var gravPoint = new Circle(new Vec2(cvs.width/2, cvs.height/2), 10, 10, new Vec2(), "red");

var G = 6.646e-11; // N m^2 / kg^2
var meters_to_pixels = 100; // 100 px = 1m
var pixels_to_meters = 1/meters_to_pixels;
var circle = new Circle(new Vec2(orbit_r, 100), 50, init_m, new Vec2(200, -100));

var b = -0.05; // For viscous damping

// Max step size for physics simulation
var max_step = 1/30;
// initialize circle without polluting namespace
/*
(function ()
{
    var r = orbit_r*pixels_to_meters;
    var v_mag = Math.sqrt(G*gravPoint.m/r);

    var v = new Vec2(0, v_mag*meters_to_pixels);

    circle = new Circle(gravPoint.p.subtract(new Vec2(orbit_r, 0)), 50, init_m, v);
})();
*/

var e = -0.8
function update(delta)
{
    /*
    // Calculate gravitational forces between circles
    var diff = gravPoint.p.subtract(circle.p).scale(pixels_to_meters);
    var rsq = diff.length_squared();
    if (rsq == 0) rsq = 0.1;
    var r = Math.sqrt(rsq);
    var f_mag = G*gravPoint.m*circle.m/rsq;

    var f = diff.scale(f_mag*meters_to_pixels/r);

    // Apply forces
    circle.addForce(f);
    circle.update(delta);
    gravPoint.addForce(f.scale(-1));
    gravPoint.update(delta);
    */
    var f = new Vec2(0,9.81*meters_to_pixels*circle.m);
    if (circle.p.y + circle.r > cvs.height)
    {
        circle.v.y *= e;
        circle.p.y = cvs.height - circle.r;
    }
    if (circle.p.x - circle.r < 0)
    {
        circle.v.x *= e;
        circle.p.x = circle.r;
    }
    if (circle.p.x + circle.r > cvs.width)
    {
        circle.v.x *= e;
        circle.p.x = cvs.width - circle.r;
    }
    circle.addForce(f);
    circle.addForce(circle.v.scale(b));
    circle.update(delta);
}

function render(delta)
{
    // Clear screen to white
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0, cvs.width, cvs.height);

    // Render objects
    circle.render(ctx);
    // gravPoint.render(ctx);
}

function gameloop(timestamp)
{
    if(!lastFrameTime) lastFrameTime = timestamp;
    var delta = (timestamp - lastFrameTime)/1000; // Time between frames in seconds
    lastFrameTime = timestamp;
    // Semi-fixed timestep
    while (delta > 0.0)
    {
        var dt = Math.min(delta, max_step);
        update(dt);

        delta -= dt;
    }
    render(delta);
    window.requestAnimationFrame(gameloop);
}

window.requestAnimationFrame(gameloop);
