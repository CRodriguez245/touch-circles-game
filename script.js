// Simple Touch Circles Game
class TouchCirclesGame {
    constructor() {
        console.log("Initializing game...");
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        console.log("Canvas:", this.canvas);
        console.log("Canvas size:", this.canvas.width, "x", this.canvas.height);
        
        // Game state
        this.gameRunning = false;
        this.score = 0;
        this.timeLeft = 30;
        this.gameInterval = null;
        this.timerInterval = null;
        
        // Circle properties
        this.circle = {
            x: 100,
            y: 100,
            radius: 40,
            dx: 3,
            dy: 3,
            color: '#FF6B6B'
        };
        
        this.setupEventListeners();
        this.startMovement();
        this.draw();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }
    
    startMovement() {
        console.log("Starting movement animation...");
        this.gameInterval = setInterval(() => this.gameLoop(), 16);
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
            if (this.gameRunning) {
                this.score++;
                this.updateDisplay();
            }
            
            this.circle.color = this.getRandomColor();
            this.circle.dx *= 1.1;
            this.circle.dy *= 1.1;
        }
    }
    
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw circle
        this.ctx.beginPath();
        this.ctx.arc(this.circle.x, this.circle.y, this.circle.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.circle.color;
        this.ctx.fill();
        
        // Add border
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        console.log(`Drawing circle at: x=${this.circle.x}, y=${this.circle.y}, color=${this.circle.color}`);
    }
    
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.timerElement.textContent = this.timeLeft;
    }
    
    endGame() {
        this.gameRunning = false;
        clearInterval(this.timerInterval);
        this.startBtn.disabled = false;
        alert(`Game Over!\nFinal Score: ${this.score}`);
    }
    
    resetGame() {
        this.endGame();
        this.circle.x = 100;
        this.circle.y = 100;
        this.circle.dx = 3;
        this.circle.dy = 3;
        this.circle.color = '#FF6B6B';
        this.score = 0;
        this.timeLeft = 30;
        this.updateDisplay();
        this.draw();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing game...");
    new TouchCirclesGame();
});