var cvs = document.getElementById("myCanvas");
var ctx = cvs.getContext("2d");

lastFrameTime = null;

function Circle(x=0, y=0, r=1, m=1, vx=0, vy=0)
{
    this.x = x;
    this.y = y;
    this.r = r;
    this.m = m;
    this.invm = 1/m;

    this.vx = vx;
    this.vy = vy;

    this.ax = 0;
    this.ay = 0;
    
    this.netfx = 0;
    this.netfy = 0;

    this.addForce = function(fx, fy) { this.netfx += fx; this.netfy += fy; }

    this.update = function(delta)
    {
        // Velocity Verlot integration
        var prevax = this.ax;
        var prevay = this.ay;

        this.x += this.vx*delta + 0.5*this.ax*delta*delta;
        this.y += this.vy*delta + 0.5*this.ay*delta*delta;

        this.ax = this.netfx*this.invm;
        this.ay = this.netfy*this.invm;

        var avgax = (this.ax + prevax)/2;
        var avgay = (this.ay + prevay)/2;

        this.vx += avgax * delta;
        this.vy += avgay * delta;

        this.netfx = 0;
        this.netfy = 0;
    }

    this.render = function(ctx)
    {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
}

var orbit_r = 150;
var init_m = 100;

var gravPoint = new function()
{
    this.x = cvs.width/2;
    this.y = cvs.height/2;
    this.m = 100000;

    this.update = function(delta){}
    this.render = function(ctx)
    {
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
        ctx.fill();
    }
}

var STEPS_PER_FRAME = 1;

var G = 6.646e-11; // N m^2 / kg^2
var pixels_to_meters = 1/100000*// 100 px = 1 cm
var circle;
// initialize circle without polluting namespace
(function ()
{
    var v = Math.sqrt(G*gravPoint.m/orbit_r);

    var vx = 0;
    var vy = v;
    circle = new Circle(gravPoint.x-orbit_r, gravPoint.y, 50, init_m, vx, vy);
})();

function update(delta)
{
    var deltax = gravPoint.x - circle.x;
    var deltay = gravPoint.y - circle.y;
    var rsq = deltax*deltax + deltay*deltay;
    if (rsq == 0) rsq = 0.1;
    var r = Math.sqrt(rsq);
    r *= pixels_to_meters;
    var f = G*gravPoint.m*circle.m/rsq;

    var fx = f*deltax/r;
    var fy = f*deltay/r;

    circle.addForce(fx, fy);
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
