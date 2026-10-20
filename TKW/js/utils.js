
const DEFAULT_EXAMS = [
  
  {
    id: "EXAM-TOAN-01",
    code: "TOAN-01",
    title: "Đề số 1",
    subject: "Toán học",
    duration: 45,
    status: "Đang mở",
    createdAt: "2026-10-18",
    questions: [
      {
        id: 1,
        question: "Hàm số y = x^3 - 3x + 2 đồng biến trên khoảng nào dưới đây?",
        options: ["(-1; 1)", "(-∞; -1) và (1; +∞)", "(-∞; 1)", "(-1; +∞)"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Đồ thị của hàm số y = (2x + 1) / (x - 1) có đường tiệm cận đứng là đường thẳng nào?",
        options: ["x = 1", "y = 2", "x = 2", "y = 1"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Tích phân ∫ (từ 0 đến 1) của e^(2x) dx có giá trị bằng bao nhiêu?",
        options: ["e^2 - 1", "(e^2 - 1) / 2", "2(e^2 - 1)", "e^2 / 2"],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "Trong không gian Oxyz, mặt cầu (S): (x - 1)^2 + (y + 2)^2 + (z - 3)^2 = 16 có bán kính R bằng:",
        options: ["R = 16", "R = 8", "R = 4", "R = 2"],
        correctAnswer: 2
      },
      {
        id: 5,
        question: "Cho số phức z = 3 - 4i. Môđun của số phức z bằng bao nhiêu?",
        options: ["|z| = 5", "|z| = 7", "|z| = 25", "|z| = 1"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "EXAM-TOAN-02",
    code: "TOAN-02",
    title: "Đề số 2",
    subject: "Toán học",
    duration: 45,
    status: "Đang mở",
    createdAt: "2026-10-18",
    questions: [
      {
        id: 1,
        question: "Nghiệm của phương trình log2(x - 1) = 3 là:",
        options: ["x = 7", "x = 8", "x = 9", "x = 10"],
        correctAnswer: 2
      },
      {
        id: 2,
        question: "Cho hình chóp S.ABC có đáy ABC là tam giác vuông tại B, SA vuông góc với đáy. Thể tích khối chóp S.ABC được tính theo công thức:",
        options: ["V = SA * AB * BC", "V = (1/3) * SA * S_ABC", "V = (1/2) * SA * S_ABC", "V = (1/6) * SA * S_ABC"],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Một tổ học sinh có 6 nam và 4 nữ. Chọn ngẫu nhiên 2 học sinh. Xác suất để chọn được 1 nam và 1 nữ là:",
        options: ["8/15", "7/15", "1/2", "6/25"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Giá trị lớn nhất của hàm số f(x) = x^4 - 2x^2 + 3 trên đoạn [0; 2] là:",
        options: ["3", "2", "11", "12"],
        correctAnswer: 2
      },
      {
        id: 5,
        question: "Trong mặt phẳng tọa độ Oxy, cho hai vectơ a = (1; 2) và b = (-3; 4). Tích vô hướng a.b bằng:",
        options: ["5", "11", "-5", "8"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "EXAM-TOAN-03",
    code: "TOAN-03",
    title: "Đề số 3",
    subject: "Toán học",
    duration: 45,
    status: "Đang mở",
    createdAt: "2026-10-18",
    questions: [
      {
        id: 1,
        question: "Đạo hàm của hàm số y = 3^x là:",
        options: ["y' = x * 3^(x - 1)", "y' = 3^x * ln3", "y' = 3^x / ln3", "y' = 3^x"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Cho cấp số nhân (u_n) có u1 = 2 và công bội q = 3. Số hạng u2 bằng:",
        options: ["u2 = 5", "u2 = 6", "u2 = 8", "u2 = 9"],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Số cách chọn 3 học sinh từ một nhóm 10 học sinh là:",
        options: ["A(10, 3)", "C(10, 3)", "10^3", "30"],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "Thể tích khối lăng trụ có diện tích đáy B và chiều cao h là:",
        options: ["V = B * h", "V = (1/3) * B * h", "V = (1/2) * B * h", "V = (1/6) * B * h"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Trong không gian Oxyz, phương trình mặt phẳng đi qua gốc tọa độ O(0,0,0) có dạng:",
        options: ["Ax + By + Cz + D = 0 (D ≠ 0)", "Ax + By + Cz = 0", "x + y + z = 1", "xy + yz + zx = 0"],
        correctAnswer: 1
      }
    ]
  },

  {
    id: "EXAM-LY-01",
    code: "LY-01",
    title: "Đề số 1",
    subject: "Vật lý",
    duration: 40,
    status: "Đang mở",
    createdAt: "2026-10-18",
    questions: [
      {
        id: 1,
        question: "Một vật dao động điều hòa theo phương trình x = A*cos(ωt + φ). Vận tốc cực đại của vật là:",
        options: ["v_max = ωA", "v_max = ω^2 * A", "v_max = ωA / 2", "v_max = 2ωA"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Chu kỳ dao động điều hòa của con lắc đơn có chiều dài l tại nơi có gia tốc trọng trường g là:",
        options: ["T = 2π * √(g/l)", "T = 2π * √(l/g)", "T = √(l/g) / 2π", "T = 2π * (l/g)"],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Sóng cơ truyền trong môi trường có bước sóng λ và chu kỳ T. Vận tốc truyền sóng v được tính theo công thức:",
        options: ["v = λ / T", "v = λ * T", "v = T / λ", "v = λ / T^2"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Trong thí nghiệm giao thoa sóng trên mặt nước của 2 nguồn kết hợp cùng pha, điểm cực đại giao thoa có hiệu đường đi thỏa mãn:",
        options: ["d2 - d1 = (k + 0.5)λ", "d2 - d1 = kλ (k ∈ Z)", "d2 - d1 = 2kλ", "d2 - d1 = (2k + 1)λ/4"],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "Đặc trưng sinh lý nào của âm gắn liền với tần số của âm?",
        options: ["Độ cao của âm", "Độ to của âm", "Âm sắc", "Cường độ âm"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "EXAM-LY-02",
    code: "LY-02",
    title: "Đề số 2",
    subject: "Vật lý",
    duration: 40,
    status: "Đang mở",
    createdAt: "2026-10-18",
    questions: [
      {
        id: 1,
        question: "Đặt điện áp xoay chiều u = U0*cos(ωt) vào hai đầu đoạn mạch chỉ chứa tụ điện có điện dung C. Dung kháng ZC của mạch là:",
        options: ["ZC = ωC", "ZC = 1 / (ωC)", "ZC = √(ωC)", "ZC = ω / C"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Hiện tượng cộng hưởng điện trong đoạn mạch RLC nối tiếp xảy ra khi điều kiện nào sau đây được thỏa mãn?",
        options: ["ωL = 1 / (ωC)", "ωL = ωC", "R = ωL", "R = 1 / (ωC)"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Trong mạch dao động LC lý tưởng, năng lượng điện từ của mạch được bảo toàn và bằng:",
        options: ["Tổng năng lượng điện trường và từ trường", "Chỉ năng lượng điện trường", "Chỉ năng lượng từ trường", "Năng lượng cơ học"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Tia nào sau đây có bản chất là sóng điện từ và có bước sóng nhỏ hơn bước sóng của ánh sáng nhìn thấy?",
        options: ["Tia hồng ngoại", "Tia tử ngoại", "Sóng vô tuyến", "Tia alpha"],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "Giới hạn quang điện của một kim loại là λ0 = 0.30 µm. Chiếu ánh sáng có bước sóng nào sau đây sẽ gây ra hiện tượng quang điện ngoài?",
        options: ["λ = 0.25 µm", "λ = 0.35 µm", "λ = 0.40 µm", "λ = 0.50 µm"],
        correctAnswer: 0
      }
    ]
  },

  {
    id: "EXAM-HOA-01",
    code: "HOA-01",
    title: "Đề số 1",
    subject: "Hóa học",
    duration: 40,
    status: "Đang mở",
    createdAt: "2026-10-18",
    questions: [
      {
        id: 1,
        question: "Chất nào sau đây là este no, đơn chức, mạch hở?",
        options: ["C2H4O2 (HCOOCH3)", "C3H4O2", "C3H8O2", "C4H6O2"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Thủy phân hoàn toàn etyl axetat (CH3COOC2H5) trong dung dịch NaOH đun nóng thu được sản phẩm gồm:",
        options: ["CH3COOH và C2H5OH", "CH3COONa và C2H5OH", "HCOONa và C2H5OH", "CH3COONa và CH3OH"],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Dung dịch chất nào sau đây làm quỳ tím chuyển sang màu xanh?",
        options: ["Glyxin", "Metylamin", "Axit axetic", "Anilin"],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "Tripeptit mạch hở là hợp chất hữu cơ chứa bao nhiêu liên kết peptit trong phân tử?",
        options: ["3 liên kết", "2 liên kết", "1 liên kết", "4 liên kết"],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "Chất béo (triglixerit) khi đun nóng với dung dịch kiềm NaOH luôn luôn sinh ra sản phẩm nào sau đây?",
        options: ["Etylen glicol", "Glixerol", "Etanol", "Metanol"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "EXAM-HOA-02",
    code: "HOA-02",
    title: "Đề số 2",
    subject: "Hóa học",
    duration: 40,
    status: "Đang mở",
    createdAt: "2026-10-18",
    questions: [
      {
        id: 1,
        question: "Kim loại nào sau đây có tính dẫn điện và dẫn nhiệt tốt nhất trong tất cả các kim loại?",
        options: ["Vàng (Au)", "Đồng (Cu)", "Bạc (Ag)", "Nhôm (Al)"],
        correctAnswer: 2
      },
      {
        id: 2,
        question: "Để bảo vệ vỏ tàu biển bằng thép khi ngâm trong nước biển, người ta thường gắn vào vỏ tàu tấm kim loại nào sau đây?",
        options: ["Đồng (Cu)", "Kẽm (Zn)", "Chì (Pb)", "Niken (Ni)"],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Kim loại nào sau đây phản ứng mãnh liệt với nước ở nhiệt độ thường tạo thành dung dịch kiềm và giải phóng khí H2?",
        options: ["Sắt (Fe)", "Natri (Na)", "Đồng (Cu)", "Bạc (Ag)"],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "Chất nào sau đây được ứng dụng phổ biến để làm mềm nước cứng có tính cứng tạm thời?",
        options: ["Ca(OH)2 vừa đủ", "HCl", "H2SO4", "NaCl"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Quặng bôxit là nguyên liệu quan trọng nhất dùng trong công nghiệp để sản xuất kim loại nào?",
        options: ["Sắt (Fe)", "Nhôm (Al)", "Magie (Mg)", "Đồng (Cu)"],
        correctAnswer: 1
      }
    ]
  }
];

function initExamsStorage() {
  const version = localStorage.getItem("exampro_version");
  const currentVer = "student_exam_v5";
  const stored = localStorage.getItem("exampro_exams");
  if (!stored) {
    localStorage.setItem("exampro_exams", JSON.stringify(DEFAULT_EXAMS));
    localStorage.setItem("exampro_version", currentVer);
  } else if (version !== currentVer) {
    try {
      const exams = JSON.parse(stored);
      
      DEFAULT_EXAMS.forEach((defEx) => {
        if (!exams.some((e) => e.code === defEx.code || e.id === defEx.id)) {
          exams.push(defEx);
        }
      });
      localStorage.setItem("exampro_exams", JSON.stringify(exams));
    } catch (err) {
      localStorage.setItem("exampro_exams", JSON.stringify(DEFAULT_EXAMS));
    }
    localStorage.setItem("exampro_version", currentVer);
  }
}

function getExams() {
  initExamsStorage();
  try {
    return JSON.parse(localStorage.getItem("exampro_exams") || "[]");
  } catch (e) {
    return DEFAULT_EXAMS;
  }
}

function saveExams(exams) {
  localStorage.setItem("exampro_exams", JSON.stringify(exams));
}

function getExamResults() {
  try {
    return JSON.parse(localStorage.getItem("exampro_results") || "[]");
  } catch (e) {
    return [];
  }
}

function saveExamResult(resultRecord) {
  const results = getExamResults();
  results.push(resultRecord);
  localStorage.setItem("exampro_results", JSON.stringify(results));
}

function getLatestResultForExam(examId) {
  const results = getExamResults();
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  const filtered = user
    ? results.filter((r) => r.studentEmail === user.email && r.examId === examId)
    : results.filter((r) => r.examId === examId);
  return filtered.length > 0 ? filtered[filtered.length - 1] : null;
}

function getBookmarkStorageKey() {
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  const userEmail = user && user.email ? user.email : "guest";
  return `exampro_bookmarks_${userEmail}`;
}

function getBookmarks() {
  return getBookmarkedExamIds();
}

function saveBookmarks(bookmarks) {
  setBookmarkedExamIds(bookmarks);
}

function getBookmarkedExamIds() {
  const key = getBookmarkStorageKey();
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}

function setBookmarkedExamIds(ids) {
  const key = getBookmarkStorageKey();
  localStorage.setItem(key, JSON.stringify(ids));
}

function isExamBookmarked(examId) {
  const ids = getBookmarkedExamIds();
  return ids.includes(examId);
}

function toggleBookmark(examId) {
  const ids = getBookmarkedExamIds();
  const index = ids.indexOf(examId);
  let isSaved = false;

  if (index > -1) {
    ids.splice(index, 1);
    isSaved = false;
  } else {
    ids.push(examId);
    isSaved = true;
  }

  setBookmarkedExamIds(ids);

  showToast(
    isSaved ? "Đã lưu đề thi" : "Đã bỏ lưu",
    isSaved ? "Đề thi đã được thêm vào mục Đề thi đã lưu của bạn!" : "Đã xóa đề thi khỏi danh sách lưu trữ.",
    isSaved ? "success" : "info"
  );

  return isSaved;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedMins = mins < 10 ? "0" + mins : mins;
  const formattedSecs = secs < 10 ? "0" + secs : secs;
  return `${formattedMins}:${formattedSecs}`;
}

function getSubjectColorClass(subject) {
  if (!subject) return "tag-toan";
  if (subject.includes("Toán")) return "tag-toan";
  if (subject.includes("Lý")) return "tag-ly";
  if (subject.includes("Hóa")) return "tag-hoa";
  if (subject.includes("Anh")) return "tag-hoa";
  if (subject.includes("Sinh")) return "tag-ly";
  return "tag-toan";
}

function showToast(title, message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: '<i class="fas fa-check-circle text-success" style="font-size: 1.25rem;"></i>',
    error: '<i class="fas fa-times-circle text-danger" style="font-size: 1.25rem;"></i>',
    warning: '<i class="fas fa-exclamation-triangle text-warning" style="font-size: 1.25rem;"></i>',
    info: '<i class="fas fa-info-circle text-accent" style="font-size: 1.25rem;"></i>'
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div style="flex-shrink: 0;">${icons[type] || icons.info}</div>
    <div style="flex: 1;">
      <h4 style="font-size: 0.875rem; font-weight: 800; color: #0a1330; margin-bottom: 0.15rem;">${title}</h4>
      <p style="font-size: 0.775rem; color: #64748b; margin: 0;">${message}</p>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
  }
  const closeBtn = e.target.closest("[data-close-modal]");
  if (closeBtn) {
    const targetModal = closeBtn.closest(".modal-overlay");
    if (targetModal) targetModal.classList.remove("active");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.active").forEach((m) => m.classList.remove("active"));
  }
});

function generateFullExamPrintHTML(exam) {
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  const studentName = user && user.fullName ? user.fullName : "....................................................................";
  const studentId = user && user.id ? user.id : "........................";

  let bubbleSheetHTML = "";
  if (exam.questions && exam.questions.length > 0) {
    bubbleSheetHTML = `
      <div class="print-bubble-box">
        <div class="print-bubble-header">PHIẾU TRẢ LỜI TRẮC NGHIỆM (THÍ SINH TÔ ĐEN HÌNH TRÒN TƯƠNG ỨNG VỚI ĐÁP ÁN CHỌN)</div>
        <div class="print-bubble-row">
    `;
    exam.questions.forEach((q, idx) => {
      bubbleSheetHTML += `
        <div class="print-bubble-cell">
          <span class="q-num">${idx + 1}.</span>
          <span class="circle-opt">Ⓐ</span>
          <span class="circle-opt">Ⓑ</span>
          <span class="circle-opt">Ⓒ</span>
          <span class="circle-opt">Ⓓ</span>
        </div>
      `;
    });
    bubbleSheetHTML += `
        </div>
      </div>
    `;
  }

  let questionsHTML = "";
  if (exam.questions && exam.questions.length > 0) {
    exam.questions.forEach((q, idx) => {
      questionsHTML += `
        <div class="print-question-item">
          <div class="print-question-text">
            <strong>Câu ${idx + 1}: ${q.question}</strong>
          </div>
          <div class="print-options-grid">
            <div class="print-opt-item"><strong>A.</strong> ${q.options[0]}</div>
            <div class="print-opt-item"><strong>B.</strong> ${q.options[1]}</div>
            <div class="print-opt-item"><strong>C.</strong> ${q.options[2]}</div>
            <div class="print-opt-item"><strong>D.</strong> ${q.options[3]}</div>
          </div>
        </div>
      `;
    });
  }

  return `
    <div class="print-exam-header-table">
      <div class="print-header-col col-left">
        <div class="print-org-name">BỘ GIÁO DỤC VÀ ĐÀO TẠO</div>
        <div class="print-sub-org">CỔNG KHẢO THÍ TRỰC TUYẾN EXAM</div>
        <div class="print-exam-badge">ĐỀ THI CHÍNH THỨC</div>
        <div class="print-page-note">(Đề thi gồm có 01 trang)</div>
      </div>
      <div class="print-header-col col-right">
        <div class="print-exam-name">KỲ THI KHẢO SÁT CHẤT LƯỢNG HỌC KỲ</div>
        <div class="print-exam-subject">Môn thi: ${exam.subject.toUpperCase()}</div>
        <div class="print-exam-time">Thời gian làm bài: <strong>${exam.duration} phút</strong> (Không kể thời gian phát đề)</div>
        <div class="print-code-box">MÃ ĐỀ THI: ${exam.code}</div>
      </div>
    </div>

    <div class="print-candidate-box">
      <div class="print-candidate-row">
        <span>Họ và tên thí sinh: <strong>${studentName}</strong></span>
        <span>Số báo danh: <strong>${studentId}</strong></span>
      </div>
      <div class="print-candidate-row">
        <span>Phòng thi: ................................................................</span>
        <span>Chữ ký thí sinh: .................................................</span>
      </div>
    </div>

    ${bubbleSheetHTML}

    <div class="print-questions-wrapper">
      ${questionsHTML}
    </div>

    <div class="print-footer-container">
      <div class="print-divider">----------------- HẾT -----------------</div>
      <div class="print-rules-note">
        (Cán bộ coi thi không giải thích gì thêm)
      </div>
      <div class="print-signatures-table">
        <div class="print-sig-block">
          <div class="sig-role">CÁN BỘ COI THI 1</div>
          <div class="sig-note">(Ký và ghi rõ họ tên)</div>
        </div>
        <div class="print-sig-block">
          <div class="sig-role">CÁN BỘ COI THI 2</div>
          <div class="sig-note">(Ký và ghi rõ họ tên)</div>
        </div>
      </div>
    </div>
  `;
}

function printFullExam(examId) {
  const exams = getExams();
  const exam = exams.find((e) => e.id === examId);
  if (!exam) {
    showToast("Lỗi", "Không tìm thấy thông tin đề thi để in!", "error");
    return;
  }

  let printArea = document.getElementById("fullExamPrintArea");
  if (!printArea) {
    printArea = document.createElement("div");
    printArea.id = "fullExamPrintArea";
    document.body.appendChild(printArea);
  }

  printArea.innerHTML = generateFullExamPrintHTML(exam);

  closeModal("examPreviewModal");

  document.body.classList.add("printing-exam");
  window.print();
  document.body.classList.remove("printing-exam");
}

window.DEFAULT_EXAMS = DEFAULT_EXAMS;
window.initExamsStorage = initExamsStorage;
window.getExams = getExams;
window.saveExams = saveExams;
window.getExamResults = getExamResults;
window.saveExamResult = saveExamResult;
window.getBookmarkedExamIds = getBookmarkedExamIds;
window.setBookmarkedExamIds = setBookmarkedExamIds;
window.isExamBookmarked = isExamBookmarked;
window.toggleBookmark = toggleBookmark;
window.getLatestResultForExam = getLatestResultForExam;
window.getBookmarks = getBookmarks;
window.saveBookmarks = saveBookmarks;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.getSubjectColorClass = getSubjectColorClass;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.generateFullExamPrintHTML = generateFullExamPrintHTML;
window.printFullExam = printFullExam;
