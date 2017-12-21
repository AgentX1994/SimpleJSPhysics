function Circle(p = new Vec2(), r=1, m=1, v = new Vec2(), fillColor = "black")
{
    this.p = p;
    this.r = r;
    this.m = m;
    this.invm = 1/m;

    this.v = v;

    this.a = new Vec2();
    
    this.netf = new Vec2();

    this.fillStyle = fillColor;

    this.addForce = function(f) { this.netf = this.netf.add(f); }

    this.update = function(delta)
    {
        // Semi-Implicit Euler Integration
        // v = v + (F/m)*dt
        this.v = this.v.add(this.netf.scale(this.invm*delta));
        // p = p + v*dt
        this.p = this.p.add(this.v.scale(delta));

        this.netf = new Vec2();
    }

    this.render = function(ctx)
    {
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
}
