var cvs = document.getElementById("myCanvas");
var ctx = cvs.getContext("2d");

lastFrameTime = null;

function Vec2(x=0, y=0)
{
    this.x = x;
    this.y = y;

    this.add = function(v2)
    {
        return new Vec2(this.x + v2.x, this.y + v2.y);
    }
    
    this.subtract = function(v2)
    {
        return new Vec2(this.x - v2.x, this.y - v2.y);
    }
    
    this.scale = function(s)
    {
        return new Vec2(this.x*s, this.y*s);
    }
    
    this.dot = function(v2)
    { 
        return this.x*v2.x + this.y*v2.y;
    }

    // 2D cross product only has a z component
    this.cross = function(v2)
    {
        return this.x*v2.y - this.y*v2.x;
    }
    
    this.rotate = function(angle, v)
    {
        var x = this.x - vector.x;
        var y = this.y - vector.y;

        var x_prime = vector.x + ((x*Math.cos(angle)) - (y*Math.sin(angle)));
        var y_prime = vector.y + ((x*Math.sin(angle)) + (y*Math.cos(angle)));

        return new Vec2(x_prime, y_prime);
    }

    this.length_squared = function()
    {
        return this.x*this.x + this.y*this.y;
    }

    this.length = function()
    {
        return Math.sqrt(this.length_squared());
    }
}

function Circle(p = new Vec2(), r=1, m=1, v = new Vec2())
{
    this.p = p;
    this.r = r;
    this.m = m;
    this.invm = 1/m;

    this.v = v;

    this.a = new Vec2();
    
    this.netf = new Vec2();

    this.addForce = function(f) { this.netf = this.netf.add(f); }

    this.update = function(delta)
    {
        // Velocity Verlot integration
        var preva = this.a;

        // p = p + v*dt + (1/2)*a*dt*dt
        this.p = this.p.add(this.v.scale(delta).add(this.a.scale(0.5*delta*delta)));

        // a = f/m
        this.a = this.netf.scale(this.invm);

        // avg_a = (a+prev_a)/2
        var avga = this.a.add(preva).scale(0.5);

        // v = v + avg_a*dt
        this.v = this.v.add(avga.scale(delta));

        this.netf = new Vec2();
    }

    this.render = function(ctx)
    {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
}

var orbit_r = 150;
var init_m = 0.1;

var gravPoint = new function()
{
    this.p = new Vec2(cvs.width/2, cvs.height/2);
    this.m = 10;

    this.update = function(delta){}

    this.render = function(ctx)
    {
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, 10, 0, 2*Math.PI);
        ctx.fill();
    }
}

var STEPS_PER_FRAME = 1;

var G = 6.646e-11; // N m^2 / kg^2
var meters_to_pixels = 100000;
var pixels_to_meters = 1/meters_to_pixels; // 100 px = 1 cm
var circle;
// initialize circle without polluting namespace
(function ()
{
    var r = orbit_r*pixels_to_meters;
    var v_mag = Math.sqrt(G*gravPoint.m/r);

    var v = new Vec2(0, v_mag*meters_to_pixels);

    circle = new Circle(gravPoint.p.subtract(new Vec2(orbit_r, 0)), 50, init_m, v);
})();

function update(delta)
{
    var diff = gravPoint.p.subtract(circle.p).scale(pixels_to_meters);
    var rsq = diff.length_squared();
    if (rsq == 0) rsq = 0.1;
    var r = Math.sqrt(rsq);
    var f_mag = G*gravPoint.m*circle.m/rsq;

    var f = diff.scale(f_mag*meters_to_pixels/r);

    circle.addForce(f);
    circle.update(delta);
}

function render(delta)
{
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0, cvs.width, cvs.height);
    circle.render(ctx);
    gravPoint.render(ctx);
}

function gameloop(timestamp)
{
    if(!lastFrameTime) lastFrameTime = timestamp;
    var delta = (timestamp - lastFrameTime)/1000; // Time between frames in seconds
    lastFrameTime = timestamp;
    for (var i = 0; i < STEPS_PER_FRAME; i++)
        update(delta/STEPS_PER_FRAME);
    render(delta);
    window.requestAnimationFrame(gameloop);
}

window.requestAnimationFrame(gameloop);
