const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const shapes = [];
// const colors = ['#FF5733', '#33FF57', '#3357FF']; // Фиксированные цвета фигур

function createShape() {
    const size = canvas.width / 4; // Размер фигуры (примерно 1 / 3 ширины экрана)
    const x = Math.random() * (canvas.width - size);
    const y = Math.random() * (canvas.height - size);
    const speedX = (Math.random() - 0.5) * 0.1;
    const speedY = (Math.random() - 0.5) * 0.1;
    const shapeType = ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)]; // Случайный выбор фигуры
    const rotation = Math.random() * Math.PI * 1; // Начальный угол вращения

    // Генерация уникального цвета
    const uniqueColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // Используем HSL для уникальных цветов

    shapes.push({ x, y, size, speedX, speedY, shapeType, rotation, color: uniqueColor }); // Добавляем цвет в объект
}

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас

    shapes.forEach((shape) => {
        ctx.save();
        ctx.translate(shape.x + shape.size / 2, shape.y + shape.size / 2); // Перемещение к центру фигуры
        ctx.rotate(shape.rotation); // Вращение фигуры
        ctx.strokeStyle = shape.color; // Используем уникальный цвет для каждой фигуры
        ctx.lineWidth = 3;

        if (shape.shapeType === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
            ctx.stroke();
        } else if (shape.shapeType === 'square') {
            ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        } else if (shape.shapeType === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -shape.size / 2);
            ctx.lineTo(-shape.size / 2, shape.size / 2);
            ctx.lineTo(shape.size / 2, shape.size / 2);
            ctx.closePath();
            ctx.stroke();
        }

        ctx.restore();

        // Обновление позиции
        shape.x += shape.speedX;
        shape.y += shape.speedY;

        // Отскок от краёв
        if (shape.x + shape.size > canvas.width || shape.x < 0) {
            shape.speedX = -shape.speedX;
        }
        if (shape.y + shape.size > canvas.height || shape.y < 0) {
            shape.speedY = -shape.speedY;
        }

        // Обновление угла вращения
        shape.rotation += 0.0001; // Скорость вращения
    });
}

// Создание фигур
while (shapes.length < 3) { // Убедимся, что всегда 3 уникальные фигуры
    createShape();
}

setInterval(drawShapes, 10); // Обновление анимации