
function openExamPreviewModal(examId) {
  const exams = typeof getExams === "function" ? getExams() : [];
  const exam = exams.find((e) => e.id === examId);
  if (!exam) return;

  const modalTitle = document.getElementById("previewModalTitle");
  const modalMeta = document.getElementById("previewModalMeta");
  const modalQuestions = document.getElementById("previewModalQuestions");
  const btnModalStart = document.getElementById("btnPreviewModalStart");
  const btnModalPrint = document.getElementById("btnPreviewModalPrint");

  if (modalTitle) modalTitle.textContent = `${exam.title} - Môn ${exam.subject}`;

  if (modalMeta) {
    modalMeta.innerHTML = `
      <div class="exam-preview-meta-item">
        <span class="exam-preview-meta-label">Môn học</span>
        <span class="exam-preview-meta-value">${exam.subject}</span>
      </div>
      <div class="exam-preview-meta-item">
        <span class="exam-preview-meta-label">Mã đề thi</span>
        <span class="exam-preview-meta-value">${exam.code}</span>
      </div>
      <div class="exam-preview-meta-item">
        <span class="exam-preview-meta-label">Thời gian làm bài</span>
        <span class="exam-preview-meta-value">${exam.duration} phút</span>
      </div>
      <div class="exam-preview-meta-item">
        <span class="exam-preview-meta-label">Số câu hỏi</span>
        <span class="exam-preview-meta-value">${exam.questions ? exam.questions.length : 0} câu trắc nghiệm</span>
      </div>
    `;
  }

  if (modalQuestions && exam.questions) {
    const letters = ["A", "B", "C", "D"];
    modalQuestions.innerHTML = exam.questions
      .map(
        (q, idx) => `
      <div class="preview-question-card">
        <h5>Câu ${idx + 1}: ${q.question}</h5>
        <div class="preview-options-list">
          ${q.options
            .map(
              (opt, oIdx) => `
            <div><strong>${letters[oIdx]}.</strong> ${opt}</div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("");
  }

  if (btnModalStart) {
    btnModalStart.href = `exam.html?id=${exam.id}`;
  }

  if (btnModalPrint) {
    btnModalPrint.onclick = () => {
      if (typeof printFullExam === "function") {
        printFullExam(exam.id);
      }
    };
  }

  if (typeof openModal === "function") {
    openModal("examPreviewModal");
  }
}

window.openExamPreviewModal = openExamPreviewModal;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof initExamsStorage === "function") {
    initExamsStorage();
  }

  const studentExamsGrid = document.getElementById("studentExamsGrid");
  if (!studentExamsGrid) return;

  const currentUser = typeof requireStudentAuth === "function" ? requireStudentAuth() : (typeof requireAuth === "function" ? requireAuth() : null);
  if (!currentUser) return;

  const userNameElements = document.querySelectorAll(".user-name-display");
  const userRoleElements = document.querySelectorAll(".user-role-display");
  const userAvatarElements = document.querySelectorAll(".user-avatar-char");
  const bannerStudentName = document.getElementById("bannerStudentName");

  if (userNameElements) userNameElements.forEach((el) => (el.textContent = currentUser.fullName));
  if (userRoleElements) userRoleElements.forEach((el) => (el.textContent = currentUser.roleTitle || (currentUser.role === "teacher" ? "Giáo viên / Giảng viên" : "Học sinh / Thí sinh")));
  if (bannerStudentName) bannerStudentName.textContent = currentUser.fullName;
  if (userAvatarElements) {
    userAvatarElements.forEach((el) => {
      el.textContent = currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "H";
    });
  }

  const logoutButtons = document.querySelectorAll(".btn-logout");
  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi cổng thi?")) {
        if (typeof logout === "function") logout();
        else window.location.href = "index.html";
      }
    });
  });

  const menuToggle = document.getElementById("menuToggleBtn");
  const sidebar = document.querySelector(".sidebar");
  const sidebarBackdrop = document.querySelector(".sidebar-backdrop");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show");
      if (sidebarBackdrop) sidebarBackdrop.classList.toggle("show");
    });

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener("click", () => {
        sidebar.classList.remove("show");
        sidebarBackdrop.classList.remove("show");
      });
    }
  }

  function renderStudentStats() {
    const exams = typeof getExams === "function" ? getExams() : [];
    const bookmarks = typeof getBookmarks === "function" ? getBookmarks() : [];
    const results = typeof getExamResults === "function" ? getExamResults() : [];

    const statTotalExams = document.getElementById("statTotalExams");
    const statActiveExams = document.getElementById("statActiveExams");
    const statBookmarkedExams = document.getElementById("statBookmarkedExams");
    const navAllExamsBadge = document.getElementById("navAllExamsBadge");
    const navBookmarkBadge = document.getElementById("navBookmarkBadge");
    const navHistoryBadge = document.getElementById("navHistoryBadge");

    if (statTotalExams) statTotalExams.textContent = exams.length;
    if (statActiveExams) {
      statActiveExams.textContent = exams.filter((e) => e.status === "Đang mở").length;
    }
    if (statBookmarkedExams) statBookmarkedExams.textContent = bookmarks.length;
    if (navAllExamsBadge) navAllExamsBadge.textContent = `${exams.length} ĐỀ`;
    if (navBookmarkBadge) navBookmarkBadge.textContent = bookmarks.length;
    if (navHistoryBadge) navHistoryBadge.textContent = results.length;
  }

  function getSubjectIcon(subject) {
    if (subject.includes("Toán")) return "fa-calculator";
    if (subject.includes("Lý")) return "fa-atom";
    if (subject.includes("Hóa")) return "fa-flask";
    return "fa-book-open";
  }

  function renderStudentExamCards(filterKeyword = "", filterSubject = "all", filterStatus = "all") {
    const exams = typeof getExams === "function" ? getExams() : [];
    const bookmarks = typeof getBookmarks === "function" ? getBookmarks() : [];
    studentExamsGrid.innerHTML = "";

    const filtered = exams.filter((exam) => {
      
      const kw = filterKeyword.toLowerCase().trim();
      const matchKeyword =
        !kw ||
        exam.title.toLowerCase().includes(kw) ||
        exam.code.toLowerCase().includes(kw) ||
        exam.subject.toLowerCase().includes(kw);

      const matchSubject = filterSubject === "all" || exam.subject.toLowerCase().includes(filterSubject.toLowerCase());

      let matchStatus = true;
      const latestResult = typeof getLatestResultForExam === "function" ? getLatestResultForExam(exam.id) : null;
      const isDone = !!latestResult;
      const isSaved = bookmarks.includes(exam.id);

      if (filterStatus === "Đang mở") {
        matchStatus = exam.status === "Đang mở";
      } else if (filterStatus === "Đã làm") {
        matchStatus = isDone;
      } else if (filterStatus === "Đã lưu") {
        matchStatus = isSaved;
      }

      return matchKeyword && matchSubject && matchStatus;
    });

    if (filtered.length === 0) {
      studentExamsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 20px;">
          <div style="width: 70px; height: 70px; margin: 0 auto 1rem; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #dc2626;">
            <i class="fas fa-search"></i>
          </div>
          <h4 style="font-size: 1.25rem; font-weight: 800; color: #0a1330; margin-bottom: 0.5rem;">Không tìm thấy đề thi phù hợp!</h4>
          <p style="color: #64748b; font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.25rem;">
            Hãy thử tìm kiếm với từ khóa khác (ví dụ: Toán, Lý, Hóa, Đề số 1, Đề số 2) hoặc chọn lại bộ lọc tất cả môn học.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" id="btnResetFilters">
            <i class="fas fa-redo"></i> Đặt lại bộ lọc
          </button>
        </div>
      `;

      const btnReset = document.getElementById("btnResetFilters");
      if (btnReset) {
        btnReset.addEventListener("click", () => {
          if (searchInput) searchInput.value = "";
          if (subjectFilter) subjectFilter.value = "all";
          if (statusFilter) statusFilter.value = "all";
          document.querySelectorAll(".subject-pill-btn").forEach((p) => p.classList.remove("active"));
          const allPill = document.querySelector(".subject-pill-btn[data-subject='all']");
          if (allPill) allPill.classList.add("active");
          renderStudentExamCards();
        });
      }
      return;
    }

    filtered.forEach((exam) => {
      const isSaved = bookmarks.includes(exam.id);
      const latestResult = typeof getLatestResultForExam === "function" ? getLatestResultForExam(exam.id) : null;
      const isDone = !!latestResult;
      const tagClass = typeof getSubjectColorClass === "function" ? getSubjectColorClass(exam.subject) : "tag-toan";
      const iconClass = getSubjectIcon(exam.subject);

      const card = document.createElement("div");
      card.className = "student-exam-card";

      card.innerHTML = `
        <div class="student-card-header">
          <span class="card-subject-tag ${tagClass}">
            <i class="fas ${iconClass}"></i> ${exam.subject}
          </span>
          <button type="button" class="btn-bookmark-toggle ${isSaved ? "active" : ""}" data-id="${exam.id}" title="${
        isSaved ? "Bỏ lưu đề thi này" : "Lưu đề thi này vào mục yêu thích"
      }">
            <i class="${isSaved ? "fas" : "far"} fa-bookmark"></i>
          </button>
        </div>

        <div class="student-card-body">
          <span class="student-card-code">${exam.code}</span>
          <h3 class="student-card-title" title="${exam.title} - Môn ${exam.subject}">${exam.title}</h3>

          <div style="margin-bottom: 0.5rem;">
            ${
              isDone
                ? `<span class="status-pill completed"><i class="fas fa-check-circle"></i> Đã làm: <strong>${latestResult.score}/10đ</strong></span>`
                : `<span class="status-pill open"><i class="fas fa-clock"></i> Sẵn sàng thi</span>`
            }
          </div>

          <div class="student-card-meta">
            <span><i class="fas fa-question-circle text-muted"></i> ${
              exam.questions ? exam.questions.length : 0
            } câu</span>
            <span><i class="far fa-clock text-muted"></i> ${exam.duration} phút</span>
            <span><i class="fas fa-calendar-alt text-muted"></i> ${exam.createdAt}</span>
          </div>
        </div>

        <div class="student-card-footer">
          <a href="exam.html?id=${exam.id}" class="btn-start-quiz" title="Vào phòng làm bài trắc nghiệm trực tuyến">
            <i class="fas fa-pencil-alt"></i> ${isDone ? "Thi lại" : "Vào thi ngay"}
          </a>
          <button type="button" class="btn-print-exam btn-print-quick" data-id="${exam.id}" title="In đề thi full ra giấy A4 chuẩn Bộ GD&ĐT">
            <i class="fas fa-print"></i> In đề
          </button>
          <button type="button" class="btn btn-secondary btn-icon btn-preview-exam" data-id="${exam.id}" title="Xem trước cấu trúc đề thi" style="width: 36px; height: 36px; border: 1.5px solid #0a1330; box-shadow: 0 2px 0 #0a1330;">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      `;

      studentExamsGrid.appendChild(card);
    });

    studentExamsGrid.querySelectorAll(".btn-bookmark-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const examId = btn.getAttribute("data-id");
        if (typeof toggleBookmark === "function") {
          const active = toggleBookmark(examId);
          btn.classList.toggle("active", active);
          btn.querySelector("i").className = active ? "fas fa-bookmark" : "far fa-bookmark";
          renderStudentStats();
          const myExamsSection = document.getElementById("sectionMyExams");
          if (myExamsSection && myExamsSection.classList.contains("active")) {
            renderMyExams();
          }
        }
      });
    });

    studentExamsGrid.querySelectorAll(".btn-print-quick").forEach((btn) => {
      btn.addEventListener("click", () => {
        const examId = btn.getAttribute("data-id");
        if (typeof printFullExam === "function") {
          printFullExam(examId);
        }
      });
    });

    studentExamsGrid.querySelectorAll(".btn-preview-exam").forEach((btn) => {
      btn.addEventListener("click", () => {
        const examId = btn.getAttribute("data-id");
        openExamPreviewModal(examId);
      });
    });
  }

  function renderMyExams() {
    const container = document.getElementById("myExamsContainer");
    if (!container) return;

    const exams = typeof getExams === "function" ? getExams() : [];
    const bookmarks = typeof getBookmarks === "function" ? getBookmarks() : [];
    const results = typeof getExamResults === "function" ? getExamResults() : [];

    const bookmarkedExams = exams.filter((e) => bookmarks.includes(e.id));
    const completedExamIds = Array.from(new Set(results.map((r) => r.examId)));
    const completedExams = exams.filter((e) => completedExamIds.includes(e.id));

    container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <h3 style="font-size: 1.35rem; font-weight: 900; color: #0a1330;">
            <i class="fas fa-bookmark" style="color: #facc15;"></i> Đề Thi Đã Lưu Vào Mục Yêu Thích (${bookmarkedExams.length})
          </h3>
        </div>
        ${
          bookmarkedExams.length === 0
            ? `<div style="background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 2rem; text-align: center; color: #64748b;">
                <i class="far fa-bookmark" style="font-size: 2rem; color: #facc15; margin-bottom: 0.5rem; display: block;"></i>
                Bạn chưa lưu đề thi nào. Bấm vào biểu tượng bookmark trên mỗi thẻ đề thi ở Kho đề thi để lưu lại ôn luyện sau!
              </div>`
            : `<div class="student-exams-grid" id="myBookmarkedGrid"></div>`
        }
      </div>

      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <h3 style="font-size: 1.35rem; font-weight: 900; color: #0a1330;">
            <i class="fas fa-check-circle" style="color: #10b981;"></i> Đề Thi Bạn Đã Từng Làm Thử (${completedExams.length})
          </h3>
        </div>
        ${
          completedExams.length === 0
            ? `<div style="background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 2rem; text-align: center; color: #64748b;">
                <i class="fas fa-clipboard-list" style="font-size: 2rem; color: #3b82f6; margin-bottom: 0.5rem; display: block;"></i>
                Bạn chưa hoàn thành bài thi nào. Hãy chọn một đề từ Kho đề thi và nhấn "Vào thi ngay" để trải nghiệm!
              </div>`
            : `<div class="student-exams-grid" id="myCompletedGrid"></div>`
        }
      </div>
    `;

    const bmGrid = document.getElementById("myBookmarkedGrid");
    if (bmGrid && bookmarkedExams.length > 0) {
      bookmarkedExams.forEach((exam) => {
        const tagClass = typeof getSubjectColorClass === "function" ? getSubjectColorClass(exam.subject) : "tag-toan";
        const card = document.createElement("div");
        card.className = "student-exam-card";
        card.innerHTML = `
          <div class="student-card-header">
            <span class="card-subject-tag ${tagClass}">${exam.subject}</span>
            <button type="button" class="btn-bookmark-toggle active" data-id="${exam.id}" title="Bỏ lưu đề">
              <i class="fas fa-bookmark"></i>
            </button>
          </div>
          <div class="student-card-body">
            <span class="student-card-code">${exam.code}</span>
            <h3 class="student-card-title">${exam.title}</h3>
            <div class="student-card-meta">
              <span><i class="far fa-clock"></i> ${exam.duration} phút</span>
              <span><i class="fas fa-question-circle"></i> ${exam.questions ? exam.questions.length : 0} câu</span>
            </div>
          </div>
          <div class="student-card-footer">
            <a href="exam.html?id=${exam.id}" class="btn-start-quiz"><i class="fas fa-pencil-alt"></i> Vào thi ngay</a>
            <button type="button" class="btn-print-exam btn-print-quick" data-id="${exam.id}"><i class="fas fa-print"></i> In đề</button>
          </div>
        `;
        bmGrid.appendChild(card);
      });

      bmGrid.querySelectorAll(".btn-bookmark-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          if (typeof toggleBookmark === "function") {
            toggleBookmark(id);
            renderStudentStats();
            renderMyExams();
          }
        });
      });

      bmGrid.querySelectorAll(".btn-print-quick").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (typeof printFullExam === "function") {
            printFullExam(btn.getAttribute("data-id"));
          }
        });
      });
    }

    const compGrid = document.getElementById("myCompletedGrid");
    if (compGrid && completedExams.length > 0) {
      completedExams.forEach((exam) => {
        const res = typeof getLatestResultForExam === "function" ? getLatestResultForExam(exam.id) : null;
        const tagClass = typeof getSubjectColorClass === "function" ? getSubjectColorClass(exam.subject) : "tag-toan";
        const card = document.createElement("div");
        card.className = "student-exam-card";
        card.innerHTML = `
          <div class="student-card-header">
            <span class="card-subject-tag ${tagClass}">${exam.subject}</span>
            <span class="score-badge high">${res ? res.score : "--"}/10đ</span>
          </div>
          <div class="student-card-body">
            <span class="student-card-code">${exam.code}</span>
            <h3 class="student-card-title">${exam.title}</h3>
            <div class="student-card-meta">
              <span><i class="fas fa-check"></i> Đúng: ${res ? res.correctCount : 0}/${exam.questions ? exam.questions.length : 0}</span>
              <span><i class="far fa-clock"></i> Thời gian: ${res ? res.timeSpent : "--"}</span>
            </div>
          </div>
          <div class="student-card-footer">
            <a href="exam.html?id=${exam.id}" class="btn-start-quiz"><i class="fas fa-redo"></i> Thi lại</a>
            <button type="button" class="btn-print-exam btn-print-quick" data-id="${exam.id}"><i class="fas fa-print"></i> In đề</button>
          </div>
        `;
        compGrid.appendChild(card);
      });

      compGrid.querySelectorAll(".btn-print-quick").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (typeof printFullExam === "function") {
            printFullExam(btn.getAttribute("data-id"));
          }
        });
      });
    }
  }

  function renderHistoryTable() {
    const tbody = document.getElementById("historyTableBody");
    if (!tbody) return;

    const results = typeof getExamResults === "function" ? getExamResults() : [];
    if (results.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="padding: 3rem 1rem;">
            <i class="fas fa-history" style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 0.5rem; display: block;"></i>
            <span class="text-muted">Bạn chưa có lịch sử làm bài nào. Hãy vào làm bài tại Kho đề thi!</span>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = "";
    results.slice().reverse().forEach((record, idx) => {
      const tr = document.createElement("tr");

      let badgeClass = "high";
      const scoreNum = parseFloat(record.score || 0);
      if (scoreNum < 5.0) badgeClass = "low";
      else if (scoreNum < 7.5) badgeClass = "medium";

      tr.innerHTML = `
        <td><strong>#${results.length - idx}</strong></td>
        <td>
          <strong>${record.examTitle}</strong>
          <div class="text-muted" style="font-size: 0.75rem;">Mã đề: ${record.examId}</div>
        </td>
        <td>${record.submittedAt || "Vừa xong"}</td>
        <td><span class="score-badge ${badgeClass}">${record.score}/10đ</span></td>
        <td><strong>${record.correctCount}/${record.totalQuestions}</strong> câu đúng</td>
        <td>
          <div class="table-action-btns">
            <a href="exam.html?id=${record.examId}" class="btn btn-sm btn-primary" title="Làm lại đề này">
              <i class="fas fa-redo"></i> Thi lại
            </a>
            <button type="button" class="btn btn-sm btn-secondary btn-print-quick" data-id="${record.examId}" title="In đề thi full">
              <i class="fas fa-print"></i> In đề
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".btn-print-quick").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (typeof printFullExam === "function") {
          printFullExam(btn.getAttribute("data-id"));
        }
      });
    });
  }

  function renderProfileData() {
    const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
    if (!user) return;

    const nameInput = document.getElementById("profileFullName");
    const emailInput = document.getElementById("profileEmail");
    const roleInput = document.getElementById("profileRole");
    const idInput = document.getElementById("profileId");

    if (nameInput) nameInput.value = user.fullName || "Trần Thị Bích Ngọc";
    if (emailInput) emailInput.value = user.email || "sinhvien@utc.edu.vn";
    if (roleInput) roleInput.value = user.role || "Học sinh / Thí sinh";
    if (idInput) idInput.value = user.id || "HS-2026-089";

    const results = typeof getExamResults === "function" ? getExamResults() : [];
    const countCompleted = document.getElementById("profileCompletedCount");
    const avgScoreEl = document.getElementById("profileAvgScore");
    const bookmarkCountEl = document.getElementById("profileBookmarkCount");

    if (countCompleted) countCompleted.textContent = results.length;
    if (bookmarkCountEl && typeof getBookmarks === "function") {
      bookmarkCountEl.textContent = getBookmarks().length;
    }
    if (avgScoreEl) {
      if (results.length > 0) {
        const sum = results.reduce((s, r) => s + parseFloat(r.score || 0), 0);
        avgScoreEl.textContent = `${(sum / results.length).toFixed(1)}/10`;
      } else {
        avgScoreEl.textContent = "--/10";
      }
    }
  }

  const searchInput = document.getElementById("searchExamInput");
  const subjectFilter = document.getElementById("filterSubjectSelect");
  const statusFilter = document.getElementById("filterStatusSelect");

  function triggerFilters() {
    renderStudentExamCards(
      searchInput ? searchInput.value : "",
      subjectFilter ? subjectFilter.value : "all",
      statusFilter ? statusFilter.value : "all"
    );
  }

  if (searchInput) searchInput.addEventListener("input", triggerFilters);
  if (subjectFilter) subjectFilter.addEventListener("change", triggerFilters);
  if (statusFilter) statusFilter.addEventListener("change", triggerFilters);

  const subjectPills = document.querySelectorAll(".subject-pill-btn");
  subjectPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      subjectPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const targetSub = pill.getAttribute("data-subject");
      if (subjectFilter) {
        subjectFilter.value = targetSub;
      }
      triggerFilters();
    });
  });

  const navLinks = document.querySelectorAll(".sidebar-nav-tab");
  const tabSections = {
    "nav-all-exams": document.getElementById("sectionAllExams"),
    "nav-my-exams": document.getElementById("sectionMyExams"),
    "nav-history": document.getElementById("sectionHistory"),
    "nav-profile": document.getElementById("sectionProfile")
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute("data-tab");

      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      if (sidebar && sidebar.classList.contains("show")) {
        sidebar.classList.remove("show");
        if (sidebarBackdrop) sidebarBackdrop.classList.remove("show");
      }

      const pageTitle = document.getElementById("pageTitle");
      if (pageTitle) {
        if (targetTab === "nav-all-exams") pageTitle.textContent = "Kho Đề Thi & Khảo Thí Trực Tuyến";
        if (targetTab === "nav-my-exams") pageTitle.textContent = "Bài Thi Của Tôi & Đề Đã Lưu";
        if (targetTab === "nav-history") pageTitle.textContent = "Kết Quả & Lịch Sử Làm Bài";
        if (targetTab === "nav-profile") pageTitle.textContent = "Thông Tin Cá Nhân Thí Sinh";
      }

      Object.keys(tabSections).forEach((key) => {
        const sec = tabSections[key];
        if (sec) {
          if (key === targetTab) {
            sec.classList.add("active");
          } else {
            sec.classList.remove("active");
          }
        }
      });

      if (targetTab === "nav-all-exams") triggerFilters();
      if (targetTab === "nav-my-exams") renderMyExams();
      if (targetTab === "nav-history") renderHistoryTable();
      if (targetTab === "nav-profile") renderProfileData();
    });
  });

  const profileForm = document.getElementById("studentProfileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("profileFullName").value.trim();
      const id = document.getElementById("profileId").value.trim();

      const user = typeof getCurrentUser === "function" ? getCurrentUser() : {};
      user.fullName = name || user.fullName;
      user.id = id || user.id;

      if (typeof setCurrentUser === "function") {
        setCurrentUser(user);
      }

      userNameElements.forEach((el) => (el.textContent = user.fullName));
      if (bannerStudentName) bannerStudentName.textContent = user.fullName;
      if (typeof showToast === "function") {
        showToast("Cập nhật thành công", "Thông tin thí sinh đã được lưu lại!", "success");
      }
    });
  }

  renderStudentStats();
  renderStudentExamCards();
});
