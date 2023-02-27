/**
 * Classe que representa el joc de la serp (snake)
 * @class
 */
class Game {
	/**
	 * Inicialitza els paràmetres del joc i crea el canvas
	 * @constructor
	 * @param {number} width -  width del canvas
	 * @param {number} height -  height del canvas
	 * @param {number} amount -  nombre de quadrats per fila de la quadrícula
	 */
	constructor(width,height,amount) {
		this.width = width;
		this.height = height;
		this.cols = amount;
		this.rows = amount;

		this.cellWidth = width / amount;
		this.cellHeight = height / amount;

		this.initCanvas(width, height);
		this.start();
	}

	/**
	 * Crea un canvas i es guarda el [context](https://developer.mozilla.org/es/docs/Web/API/CanvasRenderingContext2D) a un atribut per poder
	 * accedir-hi des dels mètodes de pintar al canvas (com ara drawSquare, clear)
	 * @param {number} width -  width del canvas
	 * @param {number} height -  height del canvas
	 */
	initCanvas(width, height) {
		const canvas = document.getElementById('canvas');
		canvas.width = width;
		canvas.height = height;

		this.context = canvas.getContext('2d');
		this.context.strokeRect(0, 0, width, height);
	}

	/**
	 * Inicialitza els paràmetres del joc:
	 * Serp al centre, direcció cap a la dreta, puntuació 0
	 */
	start() {
		this.score = 0;
		this.snake = {
			position: [0, 0],
			direction: 'right'
		};
		this.food = [];
		this.max_food = 1;

		this.drawSnake();
	}

	/**
	 * Dibuixa un quadrat de la mida de la quadrícula (passada al constructor) al canvas
	 * @param {number} x -  posició x de la quadrícula (no del canvas)
	 * @param {number} y -  posició y de la quadrícula (no del canvas)
	 * @param {string} color -  color del quadrat
	 */
	drawSquare(x,y,color) {
		this.context.fillStyle = color;
		this.context.fillRect(x, y, this.cellWidth, this.cellHeight);
	}

	/**
	 * Neteja el canvas (pinta'l de blanc)
	 */
	clear() {
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.strokeRect(0, 0, this.width, this.height);
	}

	/**
	 * Dibuixa la serp al canvas
	 */
	drawSnake() {
		this.drawSquare(this.snake.position[0], this.snake.position[1], 'blue');
	}

	/**
	 * Dibuixa la poma al canvas
	 */
	drawFood() {
		const self = this;
		this.food.forEach(function(f) {
			self.drawSquare(f[0], f[1], 'green');
		})
	}

	/**
	 * La serp xoca amb la posició donada?
	 * @param {number} x -  posició x a comprovar
	 * @param {number} y -  posició y a comprovar
	 * @return {boolean} - xoca o no
	 */
	collides(x, y) {
		return (x < 0 || x >= this.width) || (y < 0 || y >= this.height);
	}

	/**
	 * Afegeix un menjar a una posició aleatòria, la posició no ha de ser cap de les de la serp
	 */
	addFood() {
		if(this.food.length < this.max_food) {
			const randomPosition = [(Math.floor(Math.random() * this.cols) * this.cellWidth), (Math.floor(Math.random() * this.rows) * this.cellHeight)];

			if(this.snake.position.toString() != randomPosition.toString() && this.food.every(function(f) { return f.toString() != randomPosition.toString() })) {
				this.food.push(randomPosition);
			}
		}
	}

	/**
	 * Calcula una nova posició a partir de la ubicació de la serp
	 * @return {Array} - nova posició
	 */
	newTile() {
		let tile = [...this.snake.position];

		if(this.snake.direction == 'right' || this.snake.direction == 'left') {
			tile[0] = tile[0] + (this.cellWidth * (this.snake.direction == 'right' ? 1 : -1));
		}

		if(this.snake.direction == 'up' || this.snake.direction == 'down') {
			tile[1] = tile[1] + (this.cellHeight * (this.snake.direction == 'down' ? 1 : -1));
		}

		return tile;
	}

	/**
	 * Calcula el nou estat del joc, nova posició de la serp, nou menjar si n'hi ha ...
	 * i ho dibuixa al canvas
	 */
	step() {
		this.clear();

		const new_position = this.newTile()
		if(this.collides(new_position[0], new_position[1])) {
			this.drawSquare(this.snake.position[0], this.snake.position[1], 'red');
			console.log(this.score);
			clearInterval(intervalStep);
			clearInterval(intervalFood);
		} else {
			this.snake.position = new_position;
			this.drawSnake();

			if(this.food.some(function(f) { return f.toString() == new_position.toString() })) {
				this.food.splice(this.food.findIndex(function(f) { return f.toString() == new_position.toString() }), 1);
				this.score++;
			}

			this.drawFood();
		}
	}

	/**
	 * Actualitza la direcció de la serp a partir de l'event (tecla dreta, esquerra, amunt, avall)
	 * @param {event} e - l'event de la tecla premuda
	 */
	input(e) {
		switch(e.key) {
			case 'ArrowDown':
				this.snake.direction = 'down';
				break;
			case 'ArrowUp':
				this.snake.direction = 'up';
				break;
			case 'ArrowLeft':
				this.snake.direction = 'left';
				break;
			case 'ArrowRight':
				this.snake.direction = 'right';
				break;
		}
	}
}

let game = new Game(300,300,15); // Crea un nou joc
document.onkeydown = game.input.bind(game); // Assigna l'event de les tecles a la funció input del nostre joc
let intervalStep = window.setInterval(game.step.bind(game),100); // Fes que la funció que actualitza el nostre joc s'executi cada 100ms
let intervalFood = window.setInterval(game.addFood.bind(game),1000);
