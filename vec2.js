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
