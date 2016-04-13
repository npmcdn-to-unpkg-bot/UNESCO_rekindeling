function Collide(nodes, padding) {
    // Resolve collisions between nodes.
    var maxRadius = d3.max(nodes, function(d) {
        return d.q.radius
    });
    return function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function(d) {
            var r   = d.radius + maxRadius + padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function v(quad, x1, y1, x2, y2) {
                var possible = !(x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1);
                if(quad.point && (quad.point !== d) && possible) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + padding;
                    if(l < r) {
                        for(; Math.abs(l) == 0;) {
                            x = Math.round(Math.random() * r);
                            y = Math.round(Math.random() * r);
                            l = Math.sqrt(x * x + y * y);
                        }
                        ;
                        //move the nodes away from each other along the radial (normal) vector
                        //taking relative size into consideration, the sign is already established
                        //in calculating x and y
                        l = (r - l) / l * alpha;

                        // if the nodes are in the wrong radial order for there size, swap radius ordinate
                        var rel = d.radius / quad.point.radius, bigger = (rel > 1),
                            rad = d.r / quad.point.r, farther = rad > 1;
                        if(bigger && farther || !bigger && !farther) {
                            var d_r = d.r;
                            d.r = quad.point.r;
                            quad.point.r = d_r;
                            d_r = d.pr;
                            d.pr = quad.point.pr;
                            quad.point.pr = d_r;
                        }
                        // move nodes apart but preserve their velocity
                        d.x += (x *= l);
                        d.y += (y *= l);
                        d.px += x;
                        d.py += y;
                        quad.point.x -= x;
                        quad.point.y -= y;
                        quad.point.px -= x;
                        quad.point.py -= y;
                    }
                }
                return !possible;
            });
        };
    }
}  
Position swapping plus momentu