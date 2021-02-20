async function getCategories(count, offset) {
  let response = await fetch(
    `https://jservice.io/api/categories?count=${count}&offset=${offset}`
  );
  let data = await response.json();
  return data;
}

function getClueHtml(clueValue, categoryId) {
  return `<div class="my-category-clue" data-cluevalue=${clueValue} data-categoryId=${categoryId} style="grid-row-start: ${
    clueValue / 100 + 1
  }">$${clueValue}</div>`;
}

function getCategoryHtml(category) {
  return `
        <div class="my-category-title">${category.title}</div>
        ${getClueHtml(100, category.id)}
        ${getClueHtml(200, category.id)}
        ${getClueHtml(300, category.id)}
        ${getClueHtml(400, category.id)}
    `;
}

async function openModal(clue) {
  let value = clue.dataset.cluevalue;
  let categoryId = clue.dataset.categoryid;
  let question;
  let answer;

  const modalOverlay = document.querySelector(".modal-overlay");
  const modal = document.querySelector(".modal");
  const questionParagraph = document.querySelector(".question");
  const answerParagraph = document.querySelector(".answer");
  const closeModal = document.getElementById("close-modal");
  const showAnswer = document.getElementById("show-answer");

  let response = await fetch(
    `https://jservice.io/api/clues?value=${value}&category=${categoryId}`
  );
  let data = await response.json();

  if (Array.isArray(data) && !data.length) {
    question = `Sorry, it seems like server doesn't have a question for this value and category`;
  } else {
    question = data[0].question;
    answer = data[0].answer;
  }

  questionParagraph.innerText = question;
  answerParagraph.innerText = answer;

  modalOverlay.style.display = "flex";

  if (!answer) {
    showAnswer.style.display = "none";
  } else {
    showAnswer.style.display = "inline";
    showAnswer.addEventListener("click", () => {
      answerParagraph.style.display = "block";
    });
  }

  modalOverlay.addEventListener("click", () => {
    answerParagraph.style.display = "none";
    modalOverlay.style.display = "none";
  });

  closeModal.addEventListener("click", () => {
    answerParagraph.style.display = "none";
    modalOverlay.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
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
    clue.addEventListener("click", (e) => {
      openModal(e.target);
    });
  });
}

buildGame();
