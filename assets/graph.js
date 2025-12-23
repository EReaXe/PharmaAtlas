/**
 * Simple Force-Directed Graph using HTML5 Canvas
 */
class PharmaGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        this.nodes = [];
        this.links = [];
        this.draggingNode = null;

        // Configuration
        this.config = {
            repulsion: 200,
            springLength: 100,
            springK: 0.05,
            damping: 0.9,
            nodeRadius: 8
        };

        // Resize handler
        window.addEventListener('resize', () => {
            this.width = this.canvas.width = this.canvas.offsetWidth;
            this.height = this.canvas.height = this.canvas.offsetHeight;
        });

        // Mouse Events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());

        // Start Loop
        requestAnimationFrame(() => this.tick());
    }

    setData(nodes, links) {
        this.nodes = nodes.map(n => ({
            ...n,
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: 0,
            vy: 0
        }));
        this.links = links.map(l => ({
            source: this.nodes.find(n => n.id === l.source),
            target: this.nodes.find(n => n.id === l.target)
        })).filter(l => l.source && l.target); // Filter broken links
    }

    tick() {
        this.updatePhysics();
        this.draw();
        requestAnimationFrame(() => this.tick());
    }

    updatePhysics() {
        // Repulsion (Coulomb)
        for (let i = 0; i < this.nodes.length; i++) {
            let a = this.nodes[i];
            for (let j = i + 1; j < this.nodes.length; j++) {
                let b = this.nodes[j];
                let dx = a.x - b.x;
                let dy = a.y - b.y;
                let dist = Math.sqrt(dx * dx + dy * dy) || 1;
                let force = this.config.repulsion / (dist * dist);
                let fx = (dx / dist) * force;
                let fy = (dy / dist) * force;

                a.vx += fx;
                a.vy += fy;
                b.vx -= fx;
                b.vy -= fy;
            }
        }

        // Attraction (Spring)
        for (let link of this.links) {
            let dx = link.target.x - link.source.x;
            let dy = link.target.y - link.source.y;
            let dist = Math.sqrt(dx * dx + dy * dy) || 1;
            let force = (dist - this.config.springLength) * this.config.springK;
            let fx = (dx / dist) * force;
            let fy = (dy / dist) * force;

            link.source.vx += fx;
            link.source.vy += fy;
            link.target.vx -= fx;
            link.target.vy -= fy;
        }

        // Center Gravity & Damping
        const cx = this.width / 2;
        const cy = this.height / 2;

        for (let node of this.nodes) {
            // Dragging overrides physics
            if (node === this.draggingNode) continue;

            // Center pull
            node.vx += (cx - node.x) * 0.005;
            node.vy += (cy - node.y) * 0.005;

            // Damping
            node.vx *= this.config.damping;
            node.vy *= this.config.damping;

            // Apply velocity
            node.x += node.vx;
            node.y += node.vy;

            // Bounds
            node.x = Math.max(10, Math.min(this.width - 10, node.x));
            node.y = Math.max(10, Math.min(this.height - 10, node.y));
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Links
        this.ctx.strokeStyle = '#cbd5e1';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let link of this.links) {
            this.ctx.moveTo(link.source.x, link.source.y);
            this.ctx.lineTo(link.target.x, link.target.y);
        }
        this.ctx.stroke();

        // Draw Nodes
        for (let node of this.nodes) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.config.nodeRadius, 0, Math.PI * 2);

            // Color by type
            if (node.group === 'company') this.ctx.fillStyle = '#ef4444';
            else if (node.group === 'drug') this.ctx.fillStyle = '#3b82f6';
            else if (node.group === 'ingredient') this.ctx.fillStyle = '#10b981';
            else this.ctx.fillStyle = '#64748b';

            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.stroke();

            // Label
            this.ctx.fillStyle = '#1e293b'; // Text color
            this.ctx.font = '10px Inter';
            this.ctx.fillText(node.label, node.x + 12, node.y + 3);
        }
    }

    // Interaction
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    onMouseDown(e) {
        const mouse = this.getMousePos(e);
        // Find clicked node
        for (let node of this.nodes) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            if (dx * dx + dy * dy < 400) { // 20px radius hit
                this.draggingNode = node;
                break;
            }
        }
    }

    onMouseMove(e) {
        if (this.draggingNode) {
            const mouse = this.getMousePos(e);
            this.draggingNode.x = mouse.x;
            this.draggingNode.y = mouse.y;
            this.draggingNode.vx = 0;
            this.draggingNode.vy = 0;
        }
    }

    onMouseUp() {
        this.draggingNode = null;
    }
}
