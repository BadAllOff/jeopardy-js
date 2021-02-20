async function getCategories(count, offset) {
  let response = await fetch(
    `https://jservice.io/api/categories?count=${count}&offset=${offset}`
  );
  let data = await response.json();
  return data;
}

function getClueHtml(clueValue) {
  return `<div class="my-category-clue" style="grid-row-start: ${
    clueValue / 100 + 1
  }">$${clueValue}</div>`;
}

function getCategoryHtml(category) {
  return `
        <div class="my-category-title">${category.title}</div>
        ${getClueHtml(100)}
        ${getClueHtml(200)}
        ${getClueHtml(300)}
        ${getClueHtml(400)}
    `;
}

function openModal(question, answer) {
  const modalOverlay = document.querySelector(".modal-overlay");
  const modal = document.querySelector(".modal");
  const questionParagraph = document.querySelector(".question");
  const answerParagraph = document.querySelector(".answer");
  const closeModal = document.getElementById("close-modal");
  const showAnswer = document.getElementById("show-answer");

  modalOverlay.style.display = "flex";
  modal.addEventListener("click", (e) => {
      e.stopImmediatePropagation()
  });

  modalOverlay.addEventListener("click", () => {
    answerParagraph.style.display = "none";
    modalOverlay.style.display = "none";
  });

  closeModal.addEventListener("click", () => {
    answerParagraph.style.display = "none";
    modalOverlay.style.display = "none";
  });

  showAnswer.addEventListener("click", () => {
    answerParagraph.style.display = "block";
  });
}

async function buildGame() {
  const categories = await getCategories(5);
  document.body.innerHTML = `<div class="board">
        ${categories.map(getCategoryHtml).join("")}
    </div>
    <div class="modal-overlay">
        <div class="modal">
            <p class="question">question</p>
            <p class="answer">answer</p>
            <div>
                <button id="show-answer" class="btn"> Show answer</button>
                <button id="close-modal" class="btn"> Close modal </button>
            </div>
        </div>
    </div>`;

  const clues = document.querySelectorAll(".my-category-clue");

  clues.forEach((clue) => {
    clue.addEventListener("click", () => openModal());
  });
}

buildGame();
