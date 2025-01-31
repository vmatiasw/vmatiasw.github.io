self.onmessage = (event) => {
  const { width, height } = event.data;
  generateBranches(width, height);
};

const PI = Math.PI;
const HALF_PI = PI / 2;
const ANGLE_VARIATION = PI / 12;
const SEGMENT_LENGTH = 10;
const MIN_BRANCHES = 40;
const MAX_BRANCHES = 10000;
const BATCH_SIZE = 50;

function generateBranches(width: number, height: number) {
  let steps: { x: number; y: number; nx: number; ny: number }[] = [];
  let queue: (() => void)[] = [];
  let counter = { value: 0 };

  function drawBranch(x: number, y: number, angle: number) {
    if (
      counter.value > MAX_BRANCHES ||
      x < -100 ||
      y < -100 ||
      x > width + 100 ||
      y > height + 100
    )
      return;

    counter.value++;
    const length = Math.random() * SEGMENT_LENGTH;
    const nx = x + length * Math.cos(angle);
    const ny = y + length * Math.sin(angle);
    steps.push({ x, y, nx, ny });

    const branchingChance = counter.value < MIN_BRANCHES ? 0.8 : 0.5;
    const randAngle = Math.random() * ANGLE_VARIATION;

    if (Math.random() < branchingChance)
      queue.push(() => drawBranch(nx, ny, angle + randAngle));
    if (Math.random() < branchingChance)
      queue.push(() => drawBranch(nx, ny, angle - randAngle));

    // send steps in batches
    if (steps.length >= BATCH_SIZE) {
      self.postMessage({ branches: steps });
      steps = [];
    }
  }

  queue.push(() => drawBranch(Math.random() * width, -5, HALF_PI));
  queue.push(() => drawBranch(Math.random() * width, height + 5, -HALF_PI));
  queue.push(() => drawBranch(-5, Math.random() * height, 0));
  queue.push(() => drawBranch(width + 5, Math.random() * height, PI));

  function processQueue() {
    let i = 0;
    while (i < BATCH_SIZE && queue.length) {
      const task = queue.shift();
      if (task) task();
      i++;
    }
    if (queue.length)
      setTimeout(processQueue, 16); // 60 FPS
    else self.postMessage({ done: true });
  }

  processQueue();
}
