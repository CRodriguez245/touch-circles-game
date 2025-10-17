class TouchCirclesGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Game state
        this.gameRunning = false;
        this.score = 0;
        this.timeLeft = 30;
        this.gameInterval = null;
        this.timerInterval = null;
        
        // Circle properties
        this.circle = {
            x: 400,
            y: 300,
            radius: 30,
            dx: 4,
            dy: 4,
            color: this.getRandomColor()
        };
        
        // Colors for the circle
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        
        this.setupEventListeners();
        this.startMovement();
        this.draw();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }
    
    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    startMovement() {
        // Start the movement animation loop immediately
        this.gameInterval = setInterval(() => this.gameLoop(), 16); // ~60 FPS
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.score = 0;
        this.timeLeft = 30;
        this.updateDisplay();
        
        this.startBtn.disabled = true;
        
        // Start timer
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    gameLoop() {
        this.updateCircle();
        this.draw();
    }
    
    updateCircle() {
        // Update circle position
        this.circle.x += this.circle.dx;
        this.circle.y += this.circle.dy;
        
        // Bounce off walls
        if (this.circle.x - this.circle.radius <= 0 || 
            this.circle.x + this.circle.radius >= this.canvas.width) {
            this.circle.dx = -this.circle.dx;
        }
        
        if (this.circle.y - this.circle.radius <= 0 || 
            this.circle.y + this.circle.radius >= this.canvas.height) {
            this.circle.dy = -this.circle.dy;
        }
        
        // Keep circle within bounds
        this.circle.x = Math.max(this.circle.radius, 
            Math.min(this.canvas.width - this.circle.radius, this.circle.x));
        this.circle.y = Math.max(this.circle.radius, 
            Math.min(this.canvas.height - this.circle.radius, this.circle.y));
    }
    
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        // Check if click is within circle
        const distance = Math.sqrt(
            Math.pow(clickX - this.circle.x, 2) + 
            Math.pow(clickY - this.circle.y, 2)
        );
        
        if (distance <= this.circle.radius) {
            // Only score points if game is running
            if (this.gameRunning) {
                this.score++;
                this.updateDisplay();
            }
            
            this.circle.color = this.getRandomColor();
            
            // Add a little extra speed when clicked
            this.circle.dx *= 1.1;
            this.circle.dy *= 1.1;
            
            // Add visual feedback
            this.canvas.classList.add('pulse');
            setTimeout(() => this.canvas.classList.remove('pulse'), 300);
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw circle
        this.ctx.beginPath();
        this.ctx.arc(this.circle.x, this.circle.y, this.circle.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.circle.color;
        this.ctx.fill();
        
        // Add a subtle border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Add a subtle shadow effect
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // Redraw the circle with shadow
        this.ctx.beginPath();
        this.ctx.arc(this.circle.x, this.circle.y, this.circle.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }
    
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.timerElement.textContent = this.timeLeft;
    }
    
    endGame() {
        this.gameRunning = false;
        clearInterval(this.timerInterval);
        
        this.startBtn.disabled = false;
        
        // Show game over message
        alert(`Game Over!\nFinal Score: ${this.score}\n\nClick Reset to play again!`);
    }
    
    resetGame() {
        this.endGame();
        
        // Reset circle to center
        this.circle.x = 400;
        this.circle.y = 300;
        this.circle.dx = 4;
        this.circle.dy = 4;
        this.circle.color = this.getRandomColor();
        
        this.score = 0;
        this.timeLeft = 30;
        this.updateDisplay();
        this.draw();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TouchCirclesGame();
});
