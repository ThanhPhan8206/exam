
let tempQuestions = [];
let editingExamId = null;

function renderTeacherStats() {
  const exams = typeof getExams === "function" ? getExams() : [];
  const results = typeof getExamResults === "function" ? getExamResults() : [];

  const totalExamsEl = document.getElementById("teacherTotalExams");
  const totalQuestionsEl = document.getElementById("teacherTotalQuestions");
  const totalSubmissionsEl = document.getElementById("teacherTotalSubmissions");
  const avgScoreEl = document.getElementById("teacherAvgScore");

  if (totalExamsEl) {
    totalExamsEl.textContent = `${exams.length} Đề`;
  }

  if (totalQuestionsEl) {
    const totalQ = exams.reduce((acc, ex) => acc + (ex.questions ? ex.questions.length : 0), 0);
    totalQuestionsEl.textContent = `${totalQ} Câu`;
  }

  if (totalSubmissionsEl) {
    totalSubmissionsEl.textContent = `${results.length} lượt`;
  }

  if (avgScoreEl) {
    if (results.length > 0) {
      const avg = (results.reduce((acc, r) => acc + (Number(r.score) || 0), 0) / results.length).toFixed(1);
      avgScoreEl.textContent = `${avg} / 10`;
    } else {
      avgScoreEl.textContent = "Chưa có lượt nộp";
    }
  }
}

function renderTeacherExams() {
  const exams = typeof getExams === "function" ? getExams() : [];
  const tbody = document.getElementById("teacherExamTableBody");
  if (!tbody) return;

  if (exams.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="padding: 3.5rem 1rem; text-align: center; color: #64748b;">
          <div style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 0.5rem;"><i class="fas fa-folder-open"></i></div>
          <p style="font-weight: 800; font-size: 1.15rem; color: #0a1330; margin-bottom: 0.5rem;">Kho đề thi hiện đang trống!</p>
          <p style="font-size: 0.9rem; margin-bottom: 1.25rem;">Hãy bấm nút <strong>"+ Tạo Đề Thi Mới"</strong> để soạn đề thi và các câu hỏi trắc nghiệm.</p>
          <button type="button" class="btn btn-primary btn-sm" onclick="openCreateExamModal()" style="background: #dc2626; border-color: #0f172a; border-radius: 9999px;">
            <i class="fas fa-plus"></i> Tạo Đề Thi Đầu Tiên
          </button>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = exams
    .map((ex) => {
      const qCount = ex.questions ? ex.questions.length : 0;
      const isOpen = ex.status === "Đang mở";
      const subjectTagClass = typeof getSubjectColorClass === "function" ? getSubjectColorClass(ex.subject) : "tag-toan";

      return `
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background 0.15s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
        <td style="padding: 1rem; font-weight: 800; color: #dc2626; white-space: nowrap;">
          <i class="fas fa-file-signature"></i> ${ex.code || ex.id}
        </td>
        <td style="padding: 1rem; font-weight: 800; color: #0a1330;">
          <div style="font-size: 0.95rem; margin-bottom: 0.2rem;">${ex.title}</div>
          <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Ngày tạo: ${ex.createdAt || "2026-10-18"}</span>
        </td>
        <td style="padding: 1rem; white-space: nowrap;">
          <span class="card-subject-tag ${subjectTagClass}" style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; padding: 3px 10px; border-radius: 9999px;">
            ${ex.subject}
          </span>
        </td>
        <td style="padding: 1rem; font-weight: 800; color: #0a1330; white-space: nowrap;">
          <span style="background: #e2e8f0; padding: 3px 9px; border-radius: 6px; font-size: 0.85rem;">
            <i class="fas fa-question-circle text-muted"></i> ${qCount} câu
          </span>
        </td>
        <td style="padding: 1rem; font-weight: 700; color: #64748b; white-space: nowrap;">
          <i class="far fa-clock"></i> ${ex.duration} phút
        </td>
        <td style="padding: 1rem; white-space: nowrap;">
          ${
            isOpen
              ? `<span style="color: #16a34a; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.85rem;"><i class="fas fa-check-circle"></i> Đang mở</span>`
              : `<span style="color: #64748b; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.85rem;"><i class="fas fa-lock"></i> Đã đóng</span>`
          }
        </td>
        <td style="padding: 1rem; text-align: right; white-space: nowrap;">
          <div style="display: inline-flex; gap: 0.45rem; align-items: center;">
            <!-- Nút Sửa đề (Mở modal chung để sửa thông tin hoặc câu hỏi) -->
            <button type="button" class="btn btn-sm btn-secondary" onclick="openEditExamModal('${ex.id}')" title="Sửa thông tin đề & câu hỏi" style="padding: 0.4rem 0.75rem; font-size: 0.8rem; border-color: #0f172a;">
              <i class="fas fa-edit text-accent"></i> Sửa đề
            </button>
            <!-- Nút In A4 -->
            <button type="button" class="btn btn-sm btn-secondary" onclick="printFullExam('${ex.id}')" title="In đề thi A4 chuẩn Bộ GD&ĐT" style="padding: 0.4rem 0.75rem; font-size: 0.8rem; border-color: #0f172a;">
              <i class="fas fa-print"></i> In A4
            </button>
            <!-- Nút Xóa đề -->
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteExam('${ex.id}')" title="Xóa đề thi khỏi hệ thống" style="padding: 0.4rem 0.75rem; font-size: 0.8rem; border: 1.5px solid #dc2626; color: #dc2626; background: transparent; border-radius: 9999px; cursor: pointer;">
              <i class="fas fa-trash-alt"></i> Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}

function openCreateExamModal() {
  editingExamId = null;
  tempQuestions = [];

  const heading = document.getElementById("fullExamModalHeading");
  if (heading) {
    heading.innerHTML = `<i class="fas fa-plus-circle text-accent"></i> Tạo Đề Thi & Soạn Câu Hỏi Mới`;
  }

  const idInput = document.getElementById("fullExamFormId");
  const titleInput = document.getElementById("fullExamFormTitle");
  const subjectInput = document.getElementById("fullExamFormSubject");
  const codeInput = document.getElementById("fullExamFormCode");
  const durationInput = document.getElementById("fullExamFormDuration");
  const statusInput = document.getElementById("fullExamFormStatus");

  if (idInput) idInput.value = "";
  if (titleInput) titleInput.value = "";
  if (subjectInput) subjectInput.value = "Toán học";
  if (durationInput) durationInput.value = "45";
  if (statusInput) statusInput.value = "Đang mở";

  updateSuggestedCode();

  resetQuestionInputs();

  renderDraftQuestionsList();

  if (typeof openModal === "function") {
    openModal("examFullModal");
  }
}

function updateSuggestedCode() {
  if (editingExamId) return; 

  const subject = document.getElementById("fullExamFormSubject")?.value || "Toán học";
  const exams = typeof getExams === "function" ? getExams() : [];

  let prefix = "TOAN";
  if (subject === "Vật lý") prefix = "LY";
  else if (subject === "Hóa học") prefix = "HOA";
  else if (subject === "Tiếng Anh") prefix = "ANH";
  else if (subject === "Sinh học") prefix = "SINH";
  else if (subject === "Lịch sử") prefix = "SU";

  const countSubject = exams.filter((e) => e.subject === subject).length;
  const nextNum = (countSubject + 1).toString().padStart(2, "0");

  const codeInput = document.getElementById("fullExamFormCode");
  if (codeInput) codeInput.value = `${prefix}-${nextNum}`;

  const titleInput = document.getElementById("fullExamFormTitle");
  if (titleInput && !titleInput.value) {
    titleInput.value = `Đề số ${countSubject + 1}`;
  }
}

function openEditExamModal(examId) {
  const exams = typeof getExams === "function" ? getExams() : [];
  const exam = exams.find((e) => e.id === examId);
  if (!exam) return;

  editingExamId = examId;
  
  tempQuestions = JSON.parse(JSON.stringify(exam.questions || []));

  const heading = document.getElementById("fullExamModalHeading");
  if (heading) {
    heading.innerHTML = `<i class="fas fa-edit text-accent"></i> Chỉnh Sửa Đề Thi: ${exam.code} (${exam.title})`;
  }

  const idInput = document.getElementById("fullExamFormId");
  const titleInput = document.getElementById("fullExamFormTitle");
  const subjectInput = document.getElementById("fullExamFormSubject");
  const codeInput = document.getElementById("fullExamFormCode");
  const durationInput = document.getElementById("fullExamFormDuration");
  const statusInput = document.getElementById("fullExamFormStatus");

  if (idInput) idInput.value = exam.id;
  if (titleInput) titleInput.value = exam.title || "";
  if (subjectInput) subjectInput.value = exam.subject || "Toán học";
  if (codeInput) codeInput.value = exam.code || "";
  if (durationInput) durationInput.value = exam.duration || 45;
  if (statusInput) statusInput.value = exam.status || "Đang mở";

  resetQuestionInputs();

  renderDraftQuestionsList();

  if (typeof openModal === "function") {
    openModal("examFullModal");
  }
}

function resetQuestionInputs() {
  const qText = document.getElementById("draftQuestionText");
  const optA = document.getElementById("draftOptA");
  const optB = document.getElementById("draftOptB");
  const optC = document.getElementById("draftOptC");
  const optD = document.getElementById("draftOptD");
  const radioA = document.getElementById("draftCorrectA");

  if (qText) qText.value = "";
  if (optA) optA.value = "";
  if (optB) optB.value = "";
  if (optC) optC.value = "";
  if (optD) optD.value = "";
  if (radioA) radioA.checked = true;
}

function handleAddDraftQuestion() {
  const qTextInput = document.getElementById("draftQuestionText");
  const optAInput = document.getElementById("draftOptA");
  const optBInput = document.getElementById("draftOptB");
  const optCInput = document.getElementById("draftOptC");
  const optDInput = document.getElementById("draftOptD");
  const selectedRadio = document.querySelector('input[name="draftCorrectOption"]:checked');

  const qText = qTextInput?.value.trim();
  const optA = optAInput?.value.trim();
  const optB = optBInput?.value.trim();
  const optC = optCInput?.value.trim();
  const optD = optDInput?.value.trim();
  const correctIdx = selectedRadio ? parseInt(selectedRadio.value, 10) : 0;

  if (!qText) {
    alert("Vui lòng nhập nội dung câu hỏi!");
    qTextInput?.focus();
    return;
  }

  if (!optA || !optB || !optC || !optD) {
    alert("Vui lòng nhập đầy đủ cả 4 phương án trả lời A, B, C, D!");
    return;
  }

  const nextId = tempQuestions.length > 0 ? Math.max(...tempQuestions.map((q) => q.id || 0)) + 1 : 1;

  const newQ = {
    id: nextId,
    question: qText,
    options: [optA, optB, optC, optD],
    correctAnswer: correctIdx
  };

  tempQuestions.push(newQ);

  resetQuestionInputs();

  renderDraftQuestionsList();

  if (typeof showToast === "function") {
    showToast("Đã thêm câu hỏi!", `Đã thêm Câu ${tempQuestions.length} vào đề thi đang soạn.`, "success");
  }

  const listContainer = document.getElementById("draftQuestionsList");
  if (listContainer) {
    listContainer.scrollTop = listContainer.scrollHeight;
  }
}

function deleteDraftQuestion(index) {
  if (index >= 0 && index < tempQuestions.length) {
    tempQuestions.splice(index, 1);
    renderDraftQuestionsList();
    if (typeof showToast === "function") {
      showToast("Đã xóa câu hỏi", "Đã xóa câu hỏi khỏi danh sách soạn thảo.", "info");
    }
  }
}

function renderDraftQuestionsList() {
  const container = document.getElementById("draftQuestionsList");
  const countBadge = document.getElementById("draftQuestionsCountBadge");

  if (countBadge) {
    countBadge.textContent = tempQuestions.length;
  }

  if (!container) return;

  if (tempQuestions.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; background: #ffffff; border: 2px dashed #cbd5e1; border-radius: var(--radius-md);">
        <i class="fas fa-clipboard-list" style="font-size: 2rem; color: #94a3b8; margin-bottom: 0.5rem; display: block;"></i>
        <p style="font-weight: 700; color: #0a1330; margin: 0 0 0.35rem;">Chưa có câu hỏi nào trong đề này!</p>
        <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
          Hãy nhập nội dung câu hỏi và 4 phương án ở khung trên, sau đó bấm <strong>"+ Thêm câu hỏi này vào đề"</strong>.
        </p>
      </div>
    `;
    return;
  }

  const letters = ["A", "B", "C", "D"];

  container.innerHTML = tempQuestions
    .map((q, idx) => {
      return `
      <div style="background: #ffffff; border: 2px solid #0f172a; border-radius: var(--radius-md); padding: 1.15rem; box-shadow: 0 2px 0 #0f172a; margin-bottom: 0.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem;">
          <h5 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0a1330; line-height: 1.45;">
            <span style="color: #dc2626; font-weight: 900; background: #fee2e2; padding: 1px 6px; border-radius: 4px; margin-right: 4px;">Câu ${idx + 1}</span>
            ${q.question}
          </h5>
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteDraftQuestion(${idx})" title="Xóa câu hỏi này"
            style="border: 1.5px solid #dc2626; color: #dc2626; background: transparent; border-radius: 9999px; padding: 0.2rem 0.6rem; font-size: 0.75rem; cursor: pointer; flex-shrink: 0;">
            <i class="fas fa-trash-alt"></i> Xóa
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
          ${(q.options || [])
            .map((opt, oIdx) => {
              const isCorrect = Number(q.correctAnswer) === oIdx;
              return `
              <div style="padding: 0.45rem 0.65rem; border-radius: var(--radius-sm); font-size: 0.825rem; font-weight: ${
                isCorrect ? "800" : "600"
              }; border: 1.5px solid ${isCorrect ? "#16a34a" : "#e2e8f0"}; background: ${
                isCorrect ? "#dcfce7" : "#f8fafc"
              }; color: ${isCorrect ? "#15803d" : "#0f172a"}; display: flex; align-items: center; justify-content: space-between;">
                <span><strong>${letters[oIdx]}.</strong> ${opt}</span>
                ${isCorrect ? `<span style="font-size: 0.65rem; background: #16a34a; color: #fff; padding: 1px 5px; border-radius: 4px; font-weight: 900;"><i class="fas fa-check"></i> ĐÚNG</span>` : ""}
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
    })
    .join("");
}

/**
 * 8. HOÀN TẤT & LƯU TOÀN BỘ ĐỀ THI KÈM CÂU HỎI VÀO LOCALSTORAGE
 */
function handleSaveFullExam(e) {
  if (e && e.preventDefault) e.preventDefault();

  const titleInput = document.getElementById("fullExamFormTitle");
  const subjectInput = document.getElementById("fullExamFormSubject");
  const codeInput = document.getElementById("fullExamFormCode");
  const durationInput = document.getElementById("fullExamFormDuration");
  const statusInput = document.getElementById("fullExamFormStatus");

  const titleVal = titleInput?.value.trim();
  const subjectVal = subjectInput?.value || "Toán học";
  const codeVal = codeInput?.value.trim();
  const durationVal = parseInt(durationInput?.value, 10) || 45;
  const statusVal = statusInput?.value || "Đang mở";

  if (!titleVal) {
    alert("Vui lòng nhập Tên đề thi!");
    titleInput?.focus();
    return;
  }

  if (!codeVal) {
    alert("Vui lòng nhập Mã đề thi!");
    codeInput?.focus();
    return;
  }

  let exams = typeof getExams === "function" ? getExams() : [];

  if (editingExamId) {
    // CẬP NHẬT ĐỀ THI ĐÃ CÓ
    const index = exams.findIndex((e) => e.id === editingExamId);
    if (index !== -1) {
      exams[index].title = titleVal;
      exams[index].subject = subjectVal;
      exams[index].code = codeVal;
      exams[index].duration = durationVal;
      exams[index].status = statusVal;
      exams[index].questions = tempQuestions;

      if (typeof showToast === "function") {
        showToast("Cập nhật thành công!", `Đã lưu toàn bộ thông tin và ${tempQuestions.length} câu hỏi của đề ${codeVal}!`, "success");
      }
    }
  } else {
    
    const cleanPrefix = (codeVal || "EXAM").replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
    const newId = `EXAM-${cleanPrefix}-${Date.now().toString().slice(-4)}`;

    const newExam = {
      id: newId,
      code: codeVal,
      title: titleVal,
      subject: subjectVal,
      duration: durationVal,
      status: statusVal,
      createdAt: new Date().toISOString().split("T")[0],
      questions: tempQuestions
    };

    exams.push(newExam);

    if (typeof showToast === "function") {
      showToast("Tạo đề thành công!", `Đã tạo đề thi mới ${codeVal} với ${tempQuestions.length} câu hỏi!`, "success");
    }
  }

  if (typeof saveExams === "function") {
    saveExams(exams);
  } else {
    localStorage.setItem("exampro_exams", JSON.stringify(exams));
  }

  if (typeof closeModal === "function") {
    closeModal("examFullModal");
  }

  renderTeacherExams();
  renderTeacherStats();
}

function deleteExam(examId) {
  let exams = typeof getExams === "function" ? getExams() : [];
  const exam = exams.find((e) => e.id === examId);
  if (!exam) return;

  const confirmMsg = `⚠️ BẠN CÓ CHẮC CHẮN MUỐN XÓA ĐỀ THI NÀY?\n\n- Tên đề: ${exam.title} (${exam.code})\n- Môn học: ${exam.subject}\n- Số câu hỏi: ${
    exam.questions ? exam.questions.length : 0
  } câu\n\nLưu ý: Hành động này sẽ xóa vĩnh viễn đề thi khỏi hệ thống của cả Giáo viên và Học sinh!`;

  if (window.confirm(confirmMsg)) {
    exams = exams.filter((e) => e.id !== examId);
    if (typeof saveExams === "function") {
      saveExams(exams);
    } else {
      localStorage.setItem("exampro_exams", JSON.stringify(exams));
    }

    if (typeof showToast === "function") {
      showToast("Đã xóa!", `Đề thi ${exam.code} đã được xóa thành công.`, "info");
    }

    renderTeacherExams();
    renderTeacherStats();
  }
}

function renderTeacherResults() {
  const results = typeof getExamResults === "function" ? getExamResults() : [];
  const resTbody = document.getElementById("teacherResultsTableBody");
  if (!resTbody) return;

  if (results.length === 0) {
    resTbody.innerHTML = `
      <tr>
        <td colspan="6" style="padding: 2.5rem; text-align: center; color: #64748b; font-weight: 600;">
          <i class="fas fa-inbox" style="font-size: 2rem; color: #cbd5e1; margin-bottom: 0.5rem; display: block;"></i>
          Chưa có học sinh nào nộp bài thi trên hệ thống.
        </td>
      </tr>
    `;
    return;
  }

  resTbody.innerHTML = results
    .slice()
    .reverse()
    .map((r) => {
      const isPassed = Number(r.score) >= 5;
      const formattedDate = r.completedAt
        ? new Date(r.completedAt).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })
        : "Vừa xong";

      return `
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background 0.15s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
        <td style="padding: 1rem; font-weight: 800; color: #0a1330;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; border: 1.5px solid #0f172a;">
              ${r.studentName ? r.studentName.charAt(0).toUpperCase() : "H"}
            </div>
            <span>${r.studentName || "Thí sinh"}</span>
          </div>
        </td>
        <td style="padding: 1rem; color: #64748b; font-size: 0.85rem;">${r.studentEmail || "student@utc.edu.vn"}</td>
        <td style="padding: 1rem; font-weight: 700; color: #0a1330;">${r.examTitle || r.examId}</td>
        <td style="padding: 1rem; font-weight: 800; color: #0284c7;">
          ${r.correctCount || 0} / ${r.totalQuestions || 10} câu
        </td>
        <td style="padding: 1rem; font-weight: 900; color: ${isPassed ? "#16a34a" : "#dc2626"}; font-size: 1.05rem;">
          ${r.score} điểm
        </td>
        <td style="padding: 1rem; color: #64748b; font-size: 0.85rem;">
          <i class="far fa-calendar-alt"></i> ${formattedDate}
        </td>
      </tr>
    `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  
  const currentUser = typeof requireTeacherAuth === "function" ? requireTeacherAuth() : null;
  if (!currentUser) return;
  if (currentUser) {
    document.querySelectorAll(".user-name-display").forEach((el) => {
      if (el.tagName === "INPUT") el.value = currentUser.fullName || "Giảng viên";
      else el.textContent = currentUser.fullName || "Giảng viên";
    });
    document.querySelectorAll(".user-role-display").forEach((el) => {
      if (el.tagName === "INPUT") el.value = currentUser.roleTitle || "Giáo viên / Giảng viên";
      else el.textContent = currentUser.roleTitle || "Giáo viên / Giảng viên";
    });
    document.querySelectorAll(".user-avatar-char").forEach((el) => {
      el.textContent = currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "G";
    });

    const emailInp = document.getElementById("teacherProfileEmail");
    if (emailInp) emailInp.value = currentUser.email || "";

    const idInp = document.getElementById("teacherProfileId");
    if (idInp) idInp.value = currentUser.id || "GV-2026-001";
  }

  const tabs = document.querySelectorAll(".menu-item-link[data-tab]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.getAttribute("data-tab");
      const tabOverview = document.getElementById("tabPaneOverview");
      const tabResults = document.getElementById("tabPaneResults");
      const tabProfile = document.getElementById("tabPaneProfile");

      if (tabOverview) tabOverview.style.display = target === "overview" || target === "exams" ? "block" : "none";
      if (tabResults) tabResults.style.display = target === "results" ? "block" : "none";
      if (tabProfile) tabProfile.style.display = target === "profile" ? "block" : "none";

      const breadcrumb = document.getElementById("currentBreadcrumb");
      if (breadcrumb) {
        if (target === "results") breadcrumb.textContent = "Báo Cáo Kết Quả Thí Sinh";
        else if (target === "profile") breadcrumb.textContent = "Hồ Sơ Giảng Viên";
        else breadcrumb.textContent = "Quản Lý Đề Thi & Khảo Thí";
      }
    });
  });

  const btnCreateBanner = document.getElementById("btnBannerCreateExam");
  if (btnCreateBanner) {
    btnCreateBanner.addEventListener("click", openCreateExamModal);
  }

  const btnCreateTable = document.getElementById("btnTableCreateExam");
  if (btnCreateTable) {
    btnCreateTable.addEventListener("click", openCreateExamModal);
  }

  const subjectSelect = document.getElementById("fullExamFormSubject");
  if (subjectSelect) {
    subjectSelect.addEventListener("change", updateSuggestedCode);
  }

  const btnAddQ = document.getElementById("btnAddDraftQuestionBtn");
  if (btnAddQ) {
    btnAddQ.addEventListener("click", handleAddDraftQuestion);
  }

  const btnSaveExam = document.getElementById("btnSaveFullExamBtn");
  if (btnSaveExam) {
    btnSaveExam.addEventListener("click", handleSaveFullExam);
  }

  const btnLogout = document.getElementById("btnHeaderLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      if (typeof logout === "function") logout();
    });
  }

  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (backdrop && sidebar) {
    backdrop.addEventListener("click", () => {
      sidebar.classList.remove("show");
      backdrop.classList.remove("show");
    });
  }

  renderTeacherStats();
  renderTeacherExams();
  renderTeacherResults();
});

window.openCreateExamModal = openCreateExamModal;
window.openEditExamModal = openEditExamModal;
window.deleteExam = deleteExam;
window.handleAddDraftQuestion = handleAddDraftQuestion;
window.deleteDraftQuestion = deleteDraftQuestion;
window.handleSaveFullExam = handleSaveFullExam;
window.renderTeacherExams = renderTeacherExams;
window.renderTeacherStats = renderTeacherStats;
