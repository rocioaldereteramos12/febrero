let personaje;
let puntos = [];
let enemigos = [];
let obstaculos = [];
let tamCelda = 40;
let columnas, filas;
let ambiente;
let vidas = 3;
let ganaste = false;
let perdiste = false;
let audioIniciado = false; 
let imgPersonaje, imgPunto, imgEnemigo, imgObstaculo, imgCasillero;

let estado = "inicio";

function preload() {
  imgPersonaje = loadImage('data/personaje.png');
  imgPunto = loadImage('data/punto.png');
  imgEnemigo = loadImage('data/enemigo.png');
  imgObstaculo = loadImage('data/obstaculo.png');
  imgCasillero = loadImage('data/casillero.jpeg');
  soundFormats('mp3');
  ambiente = loadSound('data/sound.mp3');
}

class Personaje {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mover(dx, dy) {
    let nuevaX = this.x + dx * tamCelda;
    let nuevaY = this.y + dy * tamCelda;

    if (
      nuevaX >= 0 &&
      nuevaX < columnas * tamCelda &&
      nuevaY >= 0 &&
      nuevaY < filas * tamCelda &&
      !this.colisionaConObstaculo(nuevaX, nuevaY)
    ) {
      this.x = nuevaX;
      this.y = nuevaY;
    }
  }

  mostrar() {
    image(imgPersonaje, this.x, this.y, tamCelda, tamCelda);
  }

  colisionaCon(objeto) {
    return this.x === objeto.x && this.y === objeto.y;
  }

  colisionaConObstaculo(x, y) {
    return obstaculos.some((o) => o.x === x && o.y === y);
  }
}

class Punto {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mostrar() {
    image(imgPunto, this.x, this.y, tamCelda, tamCelda);
  }
}

class Enemigo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.contadorMovimiento = 0;
    this.velocidadMovimiento = 30;
  }

  mover() {
    this.contadorMovimiento++;
    if (this.contadorMovimiento >= this.velocidadMovimiento) {
      let opciones = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
      ];
      let opcion = random(opciones);

      let nuevaX = this.x + opcion.dx * tamCelda;
      let nuevaY = this.y + opcion.dy * tamCelda;

      if (
        nuevaX >= 0 &&
        nuevaX < columnas * tamCelda &&
        nuevaY >= 0 &&
        nuevaY < filas * tamCelda &&
        !obstaculos.some((o) => o.x === nuevaX && o.y === nuevaY)
      ) {
        this.x = nuevaX;
        this.y = nuevaY;
      }

      this.contadorMovimiento = 0;
    }
  }

  mostrar() {
    image(imgEnemigo, this.x, this.y, tamCelda, tamCelda);
  }
}
class Obstaculo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mostrar() {
    image(imgObstaculo, this.x, this.y, tamCelda, tamCelda);
  }
}

function setup() {
  createCanvas(600, 400);
  columnas = width / tamCelda;
  filas = height / tamCelda;

  inicializarJuego();
}

function inicializarJuego() {
  personaje = new Personaje(0, 0);
  puntos = [];
  enemigos = [];
  obstaculos = [];
  vidas = 3;
  ganaste = false;
  perdiste = false;

  for (let i = 0; i < 10; i++) {
    let x = floor(random(columnas)) * tamCelda;
    let y = floor(random(filas)) * tamCelda;
    if (x !== 0 || y !== 0) {
      puntos.push(new Punto(x, y));
    }
  }

  for (let i = 0; i < 3; i++) {
    let x = floor(random(columnas)) * tamCelda;
    let y = floor(random(filas)) * tamCelda;
    if (x !== 0 || y !== 0) {
      enemigos.push(new Enemigo(x, y));
    }
  }

  for (let i = 0; i < 15; i++) {
    let x = floor(random(columnas)) * tamCelda;
    let y = floor(random(filas)) * tamCelda;
    if (x !== 0 || y !== 0) {
      obstaculos.push(new Obstaculo(x, y));
    }
  }
}

function draw() {
  background(0);

  if (estado === "inicio") {
    mostrarPantallaInicio();
  } else if (estado === "instrucciones") {
    mostrarPantallaInstrucciones();
  } else if (estado === "juego") {
    ejecutarJuego();
  } else if (estado === "créditos") {
    mostrarPantallaCreditos();
  }
}

function mostrarPantallaInicio() {
  textSize(32);
  fill(255);
  textAlign(CENTER);
  text("Juego de Laberinto", width / 2, height / 3);

  fill(100, 200, 255);
  rect(width / 4, height / 2 - 30, width / 2, 50);
  fill(0);
  text("Jugar", width / 2, height / 2);

  fill(100, 255, 200);
  rect(width / 4, height / 2 + 50, width / 2, 50);
  fill(0);
  text("Créditos", width / 2, height / 2 + 80);
}

function mostrarPantallaInstrucciones() {
  textSize(16);
  fill(255);
  textAlign(CENTER);
  text(
    "Instrucciones: Usa las flechas para moverte.\n" +
    "Recoge todos los puntos, evita los enemigos\n" +
    "y no choques con los obstáculos.",
    width / 2,
    height / 3
  );

  fill(200, 255, 100);
  rect(width / 4, height / 2, width / 2, 50);
  fill(0);
  text("Continuar", width / 2, height / 2 + 30);
}

function mostrarPantallaCreditos() {
  textSize(16);
  fill(255);
  textAlign(CENTER);
  text("Creado por: Rocio Alderete Ramos\nLegajo: 93053/4", width / 2, height / 2);

  fill(200, 100, 255);
  rect(width / 4, height / 2 + 50, width / 2, 50);
  fill(0);
  text("Volver", width / 2, height / 2 + 80);
}

function ejecutarJuego() {
  if (ganaste || perdiste) {
    textSize(32);
    fill(ganaste ? "green" : "red");
    textAlign(CENTER);
    text(ganaste ? "¡Ganaste!" : "Perdiste", width / 2, height / 2);

    fill(200, 255, 100);
    rect(width / 4, height / 2 + 50, width / 2, 50);
    fill(0);
    text("Volver al inicio", width / 2, height / 2 + 80);
    noLoop();
    return;
  }

  for (let x = 0; x < columnas; x++) {
    for (let y = 0; y < filas; y++) {
      image(imgCasillero, x * tamCelda, y * tamCelda, tamCelda, tamCelda);
    }
  }

  for (let obstaculo of obstaculos) {
    obstaculo.mostrar();
  }

  for (let i = puntos.length - 1; i >= 0; i--) {
    puntos[i].mostrar();
    if (personaje.colisionaCon(puntos[i])) {
      puntos.splice(i, 1);
    }
  }

  if (puntos.length === 0) {
    ganaste = true;
  }

  for (let enemigo of enemigos) {
    enemigo.mostrar();
    enemigo.mover();
    if (personaje.colisionaCon(enemigo)) {
      vidas--;
      personaje.x = 0;
      personaje.y = 0;
      if (vidas <= 0) {
        perdiste = true;
      }
    }
  }

  personaje.mostrar();

  fill(255);
  textSize(16);
  text("Vidas: ${vidas}, 10, 20");
}

function mousePressed() {
  
 /* if (!audioIniciado) {
    ambiente.loop();  
    audioIniciado = true; 
  }*/
  if (estado === "inicio") {
    if (mouseX > width / 4 && mouseX < (3 * width) / 4) {
      if (mouseY > height / 2 - 30 && mouseY < height / 2 + 20) {
        estado = "instrucciones";
      } else if (mouseY > height / 2 + 50 && mouseY < height / 2 + 100) {
        estado = "créditos";
      }
    }
  } else if (estado === "instrucciones") {
    if (mouseX > width / 4 && mouseX < (3 * width) / 4 && mouseY > height / 2 && mouseY < height / 2 + 50) {
      estado = "juego";
    }
  } else if (estado === "créditos" || ganaste || perdiste) {
    if (mouseX > width / 4 && mouseX < (3 * width) / 4 && mouseY > height / 2 + 50 && mouseY < height / 2 + 100) {
      estado = "inicio";
      inicializarJuego();
      loop();
    }
  }

}

function keyPressed() {
  if (estado === "juego") {
    if (keyCode === LEFT_ARROW) personaje.mover(-1, 0);
    if (keyCode === RIGHT_ARROW) personaje.mover(1, 0);
    if (keyCode === UP_ARROW) personaje.mover(0, -1);
    if (keyCode === DOWN_ARROW) personaje.mover(0, 1);
  }
}
