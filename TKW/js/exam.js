
document.addEventListener("DOMContentLoaded", () => {
  
  let currentUser = typeof requireStudentAuth === "function" ? requireStudentAuth() : (typeof requireAuth === "function" ? requireAuth() : null);
  if (!currentUser) return;

  const candidateNameEl = document.getElementById("candidateName");
  if (candidateNameEl) {
    candidateNameEl.textContent = `${currentUser.fullName}`;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const examId = urlParams.get("id");

  let exams = typeof getExams === "function" ? getExams() : (window.DEFAULT_EXAMS || []);
  if (!Array.isArray(exams) || exams.length === 0) {
    exams = window.DEFAULT_EXAMS || [];
  }

  let currentExam = exams.find((e) => e.id === examId) || exams[0];
  if (!currentExam || !currentExam.questions || currentExam.questions.length === 0) {
    if (window.DEFAULT_EXAMS && window.DEFAULT_EXAMS.length > 0) {
      currentExam = window.DEFAULT_EXAMS[0];
    }
  }

  const titleEl = document.getElementById("examHeaderTitle");
  const codeEl = document.getElementById("examHeaderCode");
  if (titleEl) titleEl.textContent = `${currentExam.subject} - ${currentExam.title}`;
  if (codeEl) codeEl.textContent = `Mã đề: ${currentExam.code} • Thời gian: ${currentExam.duration} phút`;

  const STORAGE_KEY = `exampro_state_${currentExam.id}_${currentUser.email || "demo"}`;
  let savedState = null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) savedState = JSON.parse(raw);
  } catch (err) {
    console.error("Lỗi đọc dữ liệu tạm:", err);
  }

  const totalQuestions = currentExam.questions.length;
  let currentIndex = 0; 
  let userAnswers = savedState && savedState.answers ? savedState.answers : {}; 
  let flaggedQuestions = new Set(savedState && savedState.flagged ? savedState.flagged : []);
  let timeRemaining = savedState && typeof savedState.timeRemaining === "number" 
    ? savedState.timeRemaining 
    : currentExam.duration * 60; 

  let timerInterval = null;
  let isReviewMode = false; 
  let finalScore = null;

  const timerDisplay = document.getElementById("timerDisplay");
  const timerContainer = document.querySelector(".timer-container");

  function formatCountdown(seconds) {
    if (typeof formatTime === "function") {
      return formatTime(seconds);
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  }

  function startCountdown() {
    if (timerDisplay) timerDisplay.textContent = formatCountdown(timeRemaining);

    timerInterval = setInterval(() => {
      timeRemaining--;

      saveCurrentExamState();

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        if (timerDisplay) timerDisplay.textContent = "00:00";
        if (timerContainer) timerContainer.classList.add("warning");
        alert("⏰ Hết thời gian làm bài! Hệ thống đang tự động nộp bài của bạn.");
        submitExam(true);
        return;
      }

      if (timeRemaining <= 60 && timerContainer) {
        timerContainer.classList.add("warning");
      }

      if (timerDisplay) timerDisplay.textContent = formatCountdown(timeRemaining);
    }, 1000);
  }

  function saveCurrentExamState() {
    if (isReviewMode) return;
    const stateToSave = {
      answers: userAnswers,
      flagged: Array.from(flaggedQuestions),
      timeRemaining: timeRemaining,
      lastUpdated: Date.now()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Không thể lưu trạng thái bài thi:", e);
    }
  }

  const currentQuestionNumberEl = document.getElementById("currentQuestionNumber");
  const totalQuestionsNumberEl = document.getElementById("totalQuestionsNumber");
  const questionContentEl = document.getElementById("questionContent");
  const answersListEl = document.getElementById("answersList");
  const btnFlagQuestion = document.getElementById("btnFlagQuestion");
  const btnPrevQuestion = document.getElementById("btnPrevQuestion");
  const btnNextQuestion = document.getElementById("btnNextQuestion");

  if (totalQuestionsNumberEl) {
    totalQuestionsNumberEl.textContent = totalQuestions;
  }

  function renderCurrentQuestion() {
    const qData = currentExam.questions[currentIndex];
    if (!qData) return;

    if (currentQuestionNumberEl) {
      currentQuestionNumberEl.textContent = currentIndex + 1;
    }

    if (questionContentEl) {
      questionContentEl.textContent = `Câu ${currentIndex + 1}: ${qData.question}`;
    }

    if (btnFlagQuestion) {
      if (isReviewMode) {
        btnFlagQuestion.style.display = "none";
      } else {
        btnFlagQuestion.style.display = "inline-flex";
        if (flaggedQuestions.has(currentIndex)) {
          btnFlagQuestion.classList.add("flagged");
          btnFlagQuestion.innerHTML = `<i class="fas fa-flag"></i> Đã đánh dấu xem lại`;
        } else {
          btnFlagQuestion.classList.remove("flagged");
          btnFlagQuestion.innerHTML = `<i class="far fa-flag"></i> Đánh dấu xem lại`;
        }
      }
    }

    if (answersListEl) {
      answersListEl.innerHTML = "";
      const prefixes = ["A", "B", "C", "D"];

      qData.options.forEach((optText, optIndex) => {
        const optionLabel = document.createElement("label");
        optionLabel.className = "answer-option";

        const isUserChoice = userAnswers[currentIndex] === optIndex;
        const isCorrectOption = optIndex === qData.correctAnswer;

        if (!isReviewMode) {
          
          if (isUserChoice) {
            optionLabel.classList.add("selected");
          }

          optionLabel.innerHTML = `
            <input type="radio" name="questionOption" value="${optIndex}" ${isUserChoice ? "checked" : ""}>
            <div class="option-prefix">${prefixes[optIndex]}</div>
            <div class="option-text">${optText}</div>
          `;

          optionLabel.addEventListener("click", () => {
            userAnswers[currentIndex] = optIndex;
            saveCurrentExamState();

            answersListEl.querySelectorAll(".answer-option").forEach((el) => {
              el.classList.remove("selected");
            });
            optionLabel.classList.add("selected");

            renderPalette();
            updateProgressBar();
          });
        } else {
          
          optionLabel.style.cursor = "default";

          let badgeHTML = "";
          if (isCorrectOption) {
            optionLabel.classList.add("review-correct");
            badgeHTML = `<span class="answer-badge badge-correct"><i class="fas fa-check"></i> Đáp án đúng</span>`;
          } else if (isUserChoice && !isCorrectOption) {
            optionLabel.classList.add("review-wrong");
            badgeHTML = `<span class="answer-badge badge-wrong"><i class="fas fa-times"></i> Lựa chọn của bạn</span>`;
          }

          optionLabel.innerHTML = `
            <div class="option-prefix">${prefixes[optIndex]}</div>
            <div class="option-text">${optText}</div>
            ${badgeHTML}
          `;
        }

        answersListEl.appendChild(optionLabel);
      });
    }

    if (btnPrevQuestion) {
      btnPrevQuestion.disabled = currentIndex === 0;
    }
    if (btnNextQuestion) {
      if (currentIndex === totalQuestions - 1) {
        btnNextQuestion.innerHTML = `Câu cuối <i class="fas fa-check"></i>`;
      } else {
        btnNextQuestion.innerHTML = `Câu tiếp theo <i class="fas fa-arrow-right"></i>`;
      }
    }

    renderPalette();
  }

  const paletteGridEl = document.getElementById("paletteGrid");
  const progressFillEl = document.getElementById("progressFill");
  const answeredCountEl = document.getElementById("answeredCount");
  const totalCountEl = document.getElementById("totalCount");

  function renderPalette() {
    if (!paletteGridEl) return;
    paletteGridEl.innerHTML = "";

    for (let i = 0; i < totalQuestions; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "palette-btn";
      btn.textContent = i + 1;

      if (i === currentIndex) {
        btn.classList.add("current");
      }

      if (!isReviewMode) {
        if (userAnswers[i] !== undefined) {
          btn.classList.add("answered");
        }
        if (flaggedQuestions.has(i)) {
          btn.classList.add("flagged");
        }
      } else {
        const q = currentExam.questions[i];
        const isCorrect = userAnswers[i] !== undefined && userAnswers[i] === q.correctAnswer;
        if (isCorrect) {
          btn.classList.add("review-correct");
          btn.title = `Câu ${i + 1}: Đúng`;
        } else {
          btn.classList.add("review-wrong");
          btn.title = `Câu ${i + 1}: Sai hoặc Chưa làm`;
        }
      }

      btn.addEventListener("click", () => {
        currentIndex = i;
        renderCurrentQuestion();
      });

      paletteGridEl.appendChild(btn);
    }
  }

  function updateProgressBar() {
    const answeredCount = Object.keys(userAnswers).length;
    const percentage = Math.round((answeredCount / totalQuestions) * 100);
    const progressPercentEl = document.getElementById("progressPercent");

    if (answeredCountEl) answeredCountEl.textContent = answeredCount;
    if (totalCountEl) totalCountEl.textContent = totalQuestions;
    if (progressFillEl) progressFillEl.style.width = `${percentage}%`;
    if (progressPercentEl) progressPercentEl.textContent = `${percentage}%`;
  }

  if (btnPrevQuestion) {
    btnPrevQuestion.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderCurrentQuestion();
      }
    });
  }

  if (btnNextQuestion) {
    btnNextQuestion.addEventListener("click", () => {
      if (currentIndex < totalQuestions - 1) {
        currentIndex++;
        renderCurrentQuestion();
      }
    });
  }

  if (btnFlagQuestion) {
    btnFlagQuestion.addEventListener("click", () => {
      if (flaggedQuestions.has(currentIndex)) {
        flaggedQuestions.delete(currentIndex);
      } else {
        flaggedQuestions.add(currentIndex);
      }
      saveCurrentExamState();
      renderCurrentQuestion();
    });
  }

  const btnSubmitExam = document.getElementById("btnSubmitExam");
  const btnSubmitExamPalette = document.getElementById("btnSubmitExamPalette");
  const btnConfirmSubmit = document.getElementById("btnConfirmSubmit");

  function openSubmitConfirmationModal() {
    if (isReviewMode) {
      window.location.href = "dashboard.html";
      return;
    }

    const answeredCount = Object.keys(userAnswers).length;
    const unansweredCount = totalQuestions - answeredCount;

    const modalTotalQ = document.getElementById("modalTotalQ");
    const modalAnsweredQ = document.getElementById("modalAnsweredQ");
    const modalUnansweredQ = document.getElementById("modalUnansweredQ");
    if (modalTotalQ) modalTotalQ.textContent = totalQuestions;
    if (modalAnsweredQ) modalAnsweredQ.textContent = answeredCount;
    if (modalUnansweredQ) modalUnansweredQ.textContent = unansweredCount;

    const unansweredWarning = document.getElementById("unansweredWarning");
    if (unansweredWarning) {
      unansweredWarning.style.display = unansweredCount > 0 ? "block" : "none";
    }

    if (typeof openModal === "function") {
      openModal("submitConfirmModal");
    }
  }

  if (btnSubmitExam) {
    btnSubmitExam.addEventListener("click", (e) => {
      e.preventDefault();
      openSubmitConfirmationModal();
    });
  }

  if (btnSubmitExamPalette) {
    btnSubmitExamPalette.addEventListener("click", (e) => {
      e.preventDefault();
      openSubmitConfirmationModal();
    });
  }

  if (btnConfirmSubmit) {
    btnConfirmSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof closeModal === "function") {
        closeModal("submitConfirmModal");
      }
      submitExam(false);
    });
  }

  function submitExam(isAuto = false) {
    clearInterval(timerInterval);

    let correctCount = 0;
    currentExam.questions.forEach((q, index) => {
      if (userAnswers[index] !== undefined && Number(userAnswers[index]) === Number(q.correctAnswer)) {
        correctCount++;
      }
    });

    finalScore = ((correctCount / totalQuestions) * 10).toFixed(1);
    const scoreNum = parseFloat(finalScore);

    const timeSpentSeconds = Math.max(0, currentExam.duration * 60 - timeRemaining);
    const timeSpentMins = Math.floor(timeSpentSeconds / 60);
    const timeSpentSecs = timeSpentSeconds % 60;

    try {
      const resultRecord = {
        examId: currentExam.id,
        examTitle: currentExam.title,
        studentName: currentUser.fullName,
        studentEmail: currentUser.email,
        score: finalScore,
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        timeSpent: `${timeSpentMins}p ${timeSpentSecs}s`,
        submittedAt: new Date().toLocaleString("vi-VN")
      };

      if (typeof saveExamResult === "function") {
        saveExamResult(resultRecord);
      } else {
        const examResults = JSON.parse(localStorage.getItem("exampro_results") || "[]");
        examResults.push(resultRecord);
        localStorage.setItem("exampro_results", JSON.stringify(examResults));
      }
    } catch (e) {
      console.error("Lỗi lưu kết quả bài thi:", e);
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    const resScore = document.getElementById("resultScore");
    const resCorrect = document.getElementById("resultCorrectCount");
    const resAcc = document.getElementById("resultAccuracy");
    const resTime = document.getElementById("resultTimeSpent");
    const resFeedback = document.getElementById("resultFeedback");

    if (resScore) resScore.textContent = finalScore;
    if (resCorrect) resCorrect.textContent = `${correctCount}/${totalQuestions}`;
    if (resAcc) resAcc.textContent = `${Math.round((correctCount / totalQuestions) * 100)}%`;
    if (resTime) resTime.textContent = `${timeSpentMins}p ${timeSpentSecs}s`;

    if (resFeedback) {
      if (scoreNum >= 9.0) {
        resFeedback.textContent = "🌟 Xuất sắc! Bạn nắm rất vững kiến thức bài học!";
        resFeedback.style.color = "#16a34a";
      } else if (scoreNum >= 7.0) {
        resFeedback.textContent = "🎉 Rất tốt! Đạt kết quả thi mức giỏi!";
        resFeedback.style.color = "#2563eb";
      } else if (scoreNum >= 5.0) {
        resFeedback.textContent = "👍 Đạt yêu cầu! Hãy ôn luyện thêm các câu sai nhé!";
        resFeedback.style.color = "#ca8a04";
      } else {
        resFeedback.textContent = "💪 Cần cố gắng hơn! Xem lại đáp án và ôn tập lại nhé!";
        resFeedback.style.color = "#dc2626";
      }
    }

    if (typeof openModal === "function") {
      openModal("resultModal");
    }
  }

  const btnReviewAnswers = document.getElementById("btnReviewAnswers");
  if (btnReviewAnswers) {
    btnReviewAnswers.addEventListener("click", () => {
      if (typeof closeModal === "function") {
        closeModal("resultModal");
      }
      enableReviewMode();
    });
  }

  function enableReviewMode() {
    isReviewMode = true;

    if (btnSubmitExam) {
      btnSubmitExam.className = "btn btn-primary btn-sm";
      btnSubmitExam.innerHTML = `<i class="fas fa-th-large"></i> Về Kho Đề`;
    }

    if (btnSubmitExamPalette) {
      btnSubmitExamPalette.innerHTML = `<i class="fas fa-home"></i> Về Kho Đề Thi`;
      btnSubmitExamPalette.onclick = () => {
        window.location.href = "dashboard.html";
      };
    }

    if (timerContainer) {
      timerContainer.classList.remove("warning");
      timerContainer.style.background = "#f1f5f9";
      timerContainer.style.borderColor = "#cbd5e1";
    }
    if (timerDisplay) {
      timerDisplay.innerHTML = `<span style="color: #10b981; font-weight: 800;">Đã nộp bài</span>`;
    }

    const questionCard = document.querySelector(".question-card");
    if (questionCard && !document.getElementById("reviewBanner")) {
      const banner = document.createElement("div");
      banner.id = "reviewBanner";
      banner.className = "review-mode-banner";
      banner.innerHTML = `
        <span><i class="fas fa-check-double"></i> <strong>Chế độ Xem lại bài làm:</strong> Điểm số đạt được: <strong style="color: #dc2626; font-size: 1.15rem;">${finalScore || "10.0"}/10</strong></span>
        <button type="button" class="btn btn-sm btn-dark" onclick="if(typeof openModal==='function') openModal('resultModal');">
          <i class="fas fa-award"></i> Xem Lại Điểm
        </button>
      `;
      questionCard.insertBefore(banner, questionCard.firstChild);
    }

    renderCurrentQuestion();
    renderPalette();
  }

  startCountdown();
  renderCurrentQuestion();
  updateProgressBar();
});
