const navbar = document.getElementById("navbar");
const hero = document.getElementById("hero");
const learnVocab = document.getElementById("learnVocab");
const faq = document.getElementById("faq");
const footer = document.getElementById("footer");
const nameInput = document.getElementById("nameInput");
const passwordInput = document.getElementById("passwordInput");

navbar.classList.add("hidden");
learnVocab.classList.add("hidden");
faq.classList.add("hidden");

function getStarted() {
  if (nameInput.value.length > 0 && parseInt(passwordInput.value) === 123456) {
    navbar.classList.remove("hidden");
    learnVocab.classList.remove("hidden");
    faq.classList.remove("hidden");

    hero.classList.add("hidden");

    Swal.fire({
      title: "Good job!",
      text: "You're logged in!",
      icon: "success",
    });
  } else {
    if (parseInt(passwordInput.value) !== 123456) {
      Swal.fire({
        title: "Wrong Password",
        text: "Enter 123456 for password",
        icon: "error",
      });
    } else if (nameInput.value.length === 0) {
      Swal.fire({
        title: "Wrong Nmae",
        text: "Enter a valid name",
        icon: "error",
      });
    }
  }
}

function allLevels() {
  const levelsContainer = document.getElementById("levels");
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((allLevels) => {
      let levels = allLevels.data;
      levels.forEach((level) => {
        let newLevelsContainer = document.createElement("div");
        newLevelsContainer.innerHTML = `
                        <button class="btn lessonBtn flex-1 font-semibold  bg-white text-[#3D26C7] border border-[3D26C7] hover:bg-[#3D26C7] hover:text-white " onclick="loadWordsforLevels(${level.level_no}, this)"><i class="fa-solid fa-graduation-cap" ></i>Lesson-${level.level_no}</button>  
                `;
        levelsContainer.appendChild(newLevelsContainer);
      });
    })
    .catch((x) => console.error(x.message));
}
allLevels();

async function loadWordsforLevels(id, lessonBtn) {
  const startTime = performance.now();

  const fetchWords = await fetch(
    `https://openapi.programming-hero.com/api/level/${id}`
  );

  const converted_fetchWords = await fetchWords.json();
  const wordData = converted_fetchWords.data;

  const endTime = performance.now();
  const timeTaken = (endTime - startTime).toFixed(2);

  const wordDataContainer = document.getElementById("levels_details");

  const allLessonBtn = document.querySelectorAll(".lessonBtn");
  Array.from(allLessonBtn).forEach((x) => {
    x.classList.remove("bg-[#422AD5]", "text-white");
    x.classList.add("bg-white", "text-[#3D26C7]");
  });

  lessonBtn.classList.remove("bg-white", "text-[#3D26C7]");
  lessonBtn.classList.add("bg-[#422AD5]", "text-white");

  if (wordData.length === 0) {
    wordDataContainer.innerHTML = "";

    const noWordsMessage = document.createElement("div");
    const loadingDiv = document.createElement("div");

    loadingDiv.innerHTML = `<span class="loading loading-spinner loading-xl"></span>`;
    wordDataContainer.appendChild(loadingDiv);

    setTimeout(() => {
      noWordsMessage.classList.add(
        "flex",
        "flex-col",
        "gap-2",
        "justify-center",
        "items-center"
      );
      noWordsMessage.innerHTML = ` 
   <img src="assets/alert-error.png" alt="" id="errImg" class="h-24 w-24">
        <p class="text-[12px] text-[#79716B] ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <p class="text-[32px] font-medium text-[#292524]">নেক্সট Lesson এ যান</p>`;

      wordDataContainer.appendChild(noWordsMessage);

      loadingDiv.classList.add("hidden");
    }, parseInt(timeTaken)+200);
  } else {
    wordDataContainer.innerHTML = "";

    const loadingDiv = document.createElement("div");
    loadingDiv.innerHTML = `<span class="loading loading-spinner loading-xl"></span>`;
    wordDataContainer.appendChild(loadingDiv);

    setTimeout(() => {
      wordDataContainer.classList.remove(
        "items-center",
        "flex-col"
      );
      wordDataContainer.classList.add("gap-5");
      wordData.forEach((each) => {
        const newDiv = document.createElement("div");
        newDiv.classList.add(
          "flex",
          "flex-col",
          "items-center",
          "p-5",
          "gap-3",
          "rounded-lg",
          "bg-white",
          "shadow-md",
          "w-[330px]",
          "hover:bg-[#edf1ff]"
        );
        newDiv.innerHTML = `<p class="text-[24px] font-bold">${each.word}</p>
                 <p class="text-[14px] font-medium">Meaning /Pronounciation</p>
                 <p class="font-semibold text-[18px]">"${
                   each.meaning == null ? "অর্থ নেই" : each.meaning
                 }/${
          each.pronunciation == null ? "অর্থ নেই" : each.pronunciation
        }"</p>
                 <div class="flex justify-between w-full mt-4">
                  <button  class="openBtn cursor-pointer" onclick='showWordDetails(${
                    each.id
                  })'><img src="assets/Details-icon.png" alt="" class="h-8 w-8"  ></button>
                  <button class="cursor-pointer" onclick="pronounceWord('${
                    each.word
                  }')"><img src="assets/pronounce-icon.png" alt="" class="h-8 w-8"></button>
                 </div>


<div class="fixed z-10 inset-0 hidden  " id="modalWrapper">
  <div class="flex items-center justify-center min-h-screen  bg-[#000000c5] transition-all "> 
    <!-- This div is the backdrop -->
    <div class="flex flex-col gap-5 bg-white px-6 py-5 rounded-lg w-max shadow-lg "> 
      <h3 class="text-2xl lg:text-3xl font-bold w-max" id="mainWord"></h3>

      <div>
        <h3 class="text-md lg:text-xl font-medium">Meaning:</h3>
        <h3 class="text-sm lg:text-lg" id="meaning"></h3>
      </div>

      <div>
        <h3 class="text-md lg:text-xl font-medium mt-4 ">Example:</h3>
        <h3 class="text-sm lg:text-lg max-w-80 leading-tight mb-4" id="example"></h3>
      </div>

      <div>
        <h3 class="mb-1 text-md lg:text-xl font-medium">সমার্থক শব্দ গুলো</h3>
        <div class="flex gap-3" id="examples"></div>
      </div>

      <button id="closeBtn" class="cursor-pointer mt-3 py-2 px-3 rounded-sm bg-[#3D26C7] text-white text-sm lg:text-md font-bold w-max">
        Complete Learning
      </button>
    </div>
  </div>
</div>

                 

                 
`;
        wordDataContainer.appendChild(newDiv);
        loadingDiv.classList.add("hidden");
      });
    }, parseInt(timeTaken) + 200);
  }
}

async function showWordDetails(wordId) {
  const loadDetails = await fetch(
    `https://openapi.programming-hero.com/api/word/${wordId}`
  );
  const jsonwordId = await loadDetails.json();
  const wordDetails = jsonwordId.data;

  document.getElementById("navbar").classList.add("hidden");

  document.getElementById("modalWrapper").classList.remove("hidden");
  const mainWord = document.getElementById("mainWord");
  mainWord.innerText = `${wordDetails.word} (🎙️: ${wordDetails.pronunciation})`;
  const meaning = document.getElementById("meaning");
  meaning.innerText = `${
    wordDetails.meaning == null ? "অর্থ নেই" : wordDetails.meaning
  }`;
  const example = document.getElementById("example");
  example.innerText = `${wordDetails.sentence}`;

  const exampleDiv = document.getElementById("examples");
  exampleDiv.innerHTML = "";

  if (wordDetails.synonyms.length > 0) {
    wordDetails.synonyms.forEach((synonym) => {
      const newExampleDiv = document.createElement("div");
      newExampleDiv.classList.add(
        "px-2",
        "py-1",
        "bg-[#D7E4EF]",
        "text-[14px]",
        "lg:text-md",
        "rounded-sm"
      );
      newExampleDiv.innerHTML = `<p>${synonym}</p>`;
      exampleDiv.appendChild(newExampleDiv);
    });

    document.getElementById("closeBtn").addEventListener("click", () => {
      document.getElementById("modalWrapper").classList.add("hidden");
      document.getElementById("navbar").classList.remove("hidden");
    });
  } else {
    const newExampleDiv = document.createElement("div");
    newExampleDiv.classList.add(
      "px-2",
      "py-1",
      "bg-[#D7E4EF]",
      "text-[14px]",
      "lg:text-md",
      "rounded-sm"
    );
    newExampleDiv.innerHTML = `<p class="italic">No data</p>`;
    exampleDiv.appendChild(newExampleDiv);

    document.getElementById("closeBtn").addEventListener("click", () => {
      document.getElementById("modalWrapper").classList.add("hidden");
      document.getElementById("navbar").classList.remove("hidden");
    });
  }

  //   document.getElementById("modalWrapper").classList.remove("hidden");

  //   const mainWord = document.getElementById("mainWord");
  //   mainWord.innerText = `hi`;

  //   const meaning = document.getElementById("meaning");
  //   meaning.innerText = `${wordDetails.meaning}`;

  //   const example = document.getElementById("example");
  //   example.innerText = `${wordDetails.sentence}`;

  //   const exampleDiv = document.getElementById("examples");
  //   wordDetails.synonyms.forEach((synonym) => {
  //     const newExampleDiv = document.createElement("div");
  //     newExampleDiv.classList.add("px-3", "py-2", "bg-[#D7E4EF]", "text-[10px]");
  //     exampleDiv.innerHTML = `<p>${synonym}</p>`;
  //     exampleDiv.appendChild(newExampleDiv);
  //   });

  //     document.getElementById("closeBtn").addEventListener("click", () => {
  //         document.getElementById("modalWrapper").classList.add("hidden");
  //     });

  //const mainWord = document.getElementById("");

  //     const cardDetails = document.createElement("div");
  //     cardDetails.innerHTML = `<input type="checkbox" id="my_modal_7" class="modal-toggle" />
  // <div class="modal" role="dialog">
  //   <div class="modal-box">
  //     <h3 class="text-lg font-bold">${wordDetails.word} (🎙️:${wordDetails.pronunciation})</h3>
  //     <p class="py-4">This modal works with a hidden checkbox!</p>
  //   </div>
  //   <label class="modal-backdrop" for="my_modal_7">Close</label>
  // </div>`;
  //     document.getElementById("levels_details").appendChild(cardDetails);
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

function logout() {
  //window.location.reload();
  Swal.fire({
    title: "Are you sure?",
    text: "You must login again!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log out!",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload();
    }
  });
  //window.location.reload();
}
