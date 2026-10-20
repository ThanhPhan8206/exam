
const DEFAULT_ACCOUNTS = [
  {
    email: "hocsinh@utc.edu.vn",
    password: "password123",
    fullName: "Trần Thị Bích Ngọc",
    role: "student",
    roleTitle: "Học sinh / Thí sinh",
    id: "HS-2026-089"
  },
  {
    email: "sinhvien@utc.edu.vn",
    password: "password123",
    fullName: "Lê Văn Hùng",
    role: "student",
    roleTitle: "Học sinh / Thí sinh",
    id: "HS-2026-090"
  }
];

function initAuthStorage() {
  const authVer = localStorage.getItem("exampro_auth_ver");
  const currentAuthVer = "auth_role_v3";
  if (!localStorage.getItem("exampro_users") || authVer !== currentAuthVer) {
    localStorage.setItem("exampro_users", JSON.stringify(DEFAULT_ACCOUNTS));
    localStorage.setItem("exampro_auth_ver", currentAuthVer);
  }
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function setInputError(inputElement, errorElement, message) {
  if (!inputElement) return;
  inputElement.classList.add("is-invalid");
  inputElement.classList.remove("is-valid");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function setInputValid(inputElement, errorElement) {
  if (!inputElement) return;
  inputElement.classList.remove("is-invalid");
  inputElement.classList.add("is-valid");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}

function validateEmail(email) {
  if (!email || email.trim() === "") {
    return { valid: false, message: "Email không được để trống!" };
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, message: "Email không đúng định dạng (VD: example@domain.com)!" };
  }
  return { valid: true, message: "" };
}

function validatePassword(password) {
  if (!password || password.trim() === "") {
    return { valid: false, message: "Mật khẩu không được để trống!" };
  }
  if (password.length < 6) {
    return { valid: false, message: "Mật khẩu phải chứa ít nhất 6 ký tự!" };
  }
  return { valid: true, message: "" };
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword || confirmPassword.trim() === "") {
    return { valid: false, message: "Vui lòng nhập lại mật khẩu!" };
  }
  if (password !== confirmPassword) {
    return { valid: false, message: "Mật khẩu nhập lại không khớp!" };
  }
  return { valid: true, message: "" };
}

function getCurrentUser() {
  try {
    const userJson = localStorage.getItem("exampro_current_user");
    if (!userJson) return null;
    const user = JSON.parse(userJson);
    if (!user || typeof user !== "object") return null;

    const roleLower = (user.role || "").toLowerCase().trim();
    const roleTitleLower = (user.roleTitle || "").toLowerCase().trim();
    const isTeacher =
      roleLower === "teacher" ||
      roleLower === "giáo viên" ||
      roleLower === "giang vien" ||
      roleTitleLower.includes("giáo viên") ||
      roleTitleLower.includes("giảng viên");

    if (isTeacher) {
      if (user.role !== "Giáo viên" && user.role !== "teacher") {
        user.role = "teacher";
      }
    } else {
      if (user.role !== "student" && user.role !== "Học sinh") {
        user.role = "student";
      }
    }

    return user;
  } catch (e) {
    console.error("Lỗi đọc thông tin phiên đăng nhập:", e);
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem("exampro_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("exampro_current_user");
  }
}

function logout() {
  localStorage.removeItem("exampro_current_user");
  window.location.href = "index.html";
}

function isTeacherUser(user) {
  if (!user) return false;
  const role = (user.role || "").toLowerCase().trim();
  const roleTitle = (user.roleTitle || "").toLowerCase().trim();
  return (
    role === "teacher" ||
    role === "giáo viên" ||
    role === "giang vien" ||
    roleTitle.includes("giáo viên") ||
    roleTitle.includes("giảng viên")
  );
}

function requireTeacherAuth() {
  const user = getCurrentUser();
  if (!user || (user.role !== "Giáo viên" && user.role !== "teacher" && !isTeacherUser(user))) {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.replace("dashboard.html");
    return null;
  }
  return user;
}

function requireStudentAuth() {
  const user = getCurrentUser();

  if (user) {
    const isTeacher = user.role === "Giáo viên" || user.role === "teacher" || isTeacherUser(user);
    if (isTeacher) {
      alert("ℹ️ Bạn đang đăng nhập với vai trò Giảng viên.\n\nHệ thống đang chuyển hướng bạn về Bảng Quản Lý Giảng Viên.");
      window.location.replace("teacher-dashboard.html");
      return null;
    }
    return user;
  }

  return {
    email: "hocsinh@utc.edu.vn",
    fullName: "Trần Thị Bích Ngọc",
    role: "student",
    roleTitle: "Học sinh / Thí sinh",
    id: "HS-2026-089"
  };
}

function requireAuth(requiredRole) {
  if (requiredRole === "teacher") {
    return requireTeacherAuth();
  }
  if (requiredRole === "student") {
    return requireStudentAuth();
  }
  return getCurrentUser();
}

document.addEventListener("DOMContentLoaded", () => {
  initAuthStorage();
  const currentUser = getCurrentUser();

  const navAuthGuest = document.getElementById("navAuthGuest");
  const navAuthUser = document.getElementById("navAuthUser");
  const btnNavLogout = document.getElementById("btnNavLogout");

  if (navAuthGuest && navAuthUser) {
    if (currentUser) {
      navAuthGuest.style.display = "none";
      navAuthUser.style.display = "flex";
      const btnDashboard = navAuthUser.querySelector("a");
      if (btnDashboard) {
        const isTeacher = isTeacherUser(currentUser);
        btnDashboard.href = isTeacher ? "teacher-dashboard.html" : "dashboard.html";
        btnDashboard.innerHTML = isTeacher 
          ? '<i class="fas fa-chalkboard-teacher"></i> Bảng Giáo Viên'
          : '<i class="fas fa-th-large"></i> Bảng điều khiển';
      }
    } else {
      navAuthGuest.style.display = "flex";
      navAuthUser.style.display = "none";
    }
  }

  if (btnNavLogout) {
    btnNavLogout.addEventListener("click", () => {
      logout();
    });
  }

  const togglePassBtns = document.querySelectorAll(".btn-toggle-password");
  togglePassBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const targetInput = document.getElementById(targetId);
      if (targetInput) {
        const isPassword = targetInput.getAttribute("type") === "password";
        targetInput.setAttribute("type", isPassword ? "text" : "password");
        btn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
      }
    });
  });

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabRegisterBtn = document.getElementById("tabRegisterBtn");
  const authHeaderTitle = document.getElementById("authHeaderTitle");
  const authHeaderSubtitle = document.getElementById("authHeaderSubtitle");

  if (loginForm && registerForm) {
    
    function switchTab(tab) {
      if (tab === "register") {
        if (tabRegisterBtn) tabRegisterBtn.classList.add("active");
        if (tabLoginBtn) tabLoginBtn.classList.remove("active");
        registerForm.style.display = "block";
        loginForm.style.display = "none";
        if (authHeaderTitle) authHeaderTitle.textContent = "Tạo Tài Khoản Mới";
        if (authHeaderSubtitle) authHeaderSubtitle.textContent = "Đăng ký để tham gia phòng thi trực tuyến";
      } else {
        if (tabLoginBtn) tabLoginBtn.classList.add("active");
        if (tabRegisterBtn) tabRegisterBtn.classList.remove("active");
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        if (authHeaderTitle) authHeaderTitle.textContent = "Chào Mừng Trở Lại";
        if (authHeaderSubtitle) authHeaderSubtitle.textContent = "Hệ thống Luyện thi & Quản lý Đề thi Trực tuyến";
      }
    }

    if (tabLoginBtn) {
      tabLoginBtn.addEventListener("click", () => {
        window.location.hash = "login";
        switchTab("login");
      });
    }

    if (tabRegisterBtn) {
      tabRegisterBtn.addEventListener("click", () => {
        window.location.hash = "register";
        switchTab("register");
      });
    }

    if (window.location.hash === "#register") {
      switchTab("register");
    } else {
      switchTab("login");
    }

    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#register") {
        switchTab("register");
      } else {
        switchTab("login");
      }
    });

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = document.getElementById("loginEmail");
      const passwordInput = document.getElementById("loginPassword");
      const emailError = document.getElementById("loginEmailError");
      const passwordError = document.getElementById("loginPasswordError");

      const emailCheck = validateEmail(emailInput.value);
      if (!emailCheck.valid) {
        setInputError(emailInput, emailError, emailCheck.message);
      } else {
        setInputValid(emailInput, emailError);
      }

      const passCheck = validatePassword(passwordInput.value);
      if (!passCheck.valid) {
        setInputError(passwordInput, passwordError, passCheck.message);
      } else {
        setInputValid(passwordInput, passwordError);
      }

      if (!emailCheck.valid || !passCheck.valid) return;

      const users = JSON.parse(localStorage.getItem("exampro_users") || "[]");
      const foundUser = users.find(
        (u) => u && u.email && u.email.toLowerCase() === emailInput.value.trim().toLowerCase() && u.password === passwordInput.value
      );

      if (foundUser) {
        
        setCurrentUser(foundUser);

        const isTeacher = isTeacherUser(foundUser);

        if (typeof showToast === "function") {
          showToast("Đăng nhập thành công!", `Chào mừng ${foundUser.fullName} (${isTeacher ? "Giáo viên" : "Học sinh"}) quay trở lại!`, "success");
        }
        setTimeout(() => {
          if (isTeacher) {
            window.location.href = "teacher-dashboard.html";
          } else {
            window.location.href = "dashboard.html";
          }
        }, 500);
      } else {
        setInputError(passwordInput, passwordError, "Email hoặc mật khẩu không chính xác!");
      }
    });

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("regName");
      const emailInput = document.getElementById("regEmail");
      const roleSelect = document.getElementById("regRole");
      const passwordInput = document.getElementById("regPassword");
      const confirmInput = document.getElementById("regConfirmPassword");

      const nameError = document.getElementById("regNameError");
      const emailError = document.getElementById("regEmailError");
      const roleError = document.getElementById("regRoleError");
      const passwordError = document.getElementById("regPasswordError");
      const confirmError = document.getElementById("regConfirmPasswordError");

      let isValid = true;

      if (!nameInput.value.trim()) {
        setInputError(nameInput, nameError, "Vui lòng nhập họ và tên của bạn!");
        isValid = false;
      } else {
        setInputValid(nameInput, nameError);
      }

      const emailCheck = validateEmail(emailInput.value);
      if (!emailCheck.valid) {
        setInputError(emailInput, emailError, emailCheck.message);
        isValid = false;
      } else {
        
        const users = JSON.parse(localStorage.getItem("exampro_users") || "[]");
        const isExist = users.some((u) => u && u.email && u.email.toLowerCase() === emailInput.value.trim().toLowerCase());
        if (isExist) {
          setInputError(emailInput, emailError, "Email này đã được đăng ký trên hệ thống!");
          isValid = false;
        } else {
          setInputValid(emailInput, emailError);
        }
      }

      const passCheck = validatePassword(passwordInput.value);
      if (!passCheck.valid) {
        setInputError(passwordInput, passwordError, passCheck.message);
        isValid = false;
      } else {
        setInputValid(passwordInput, passwordError);
      }

      const confirmCheck = validateConfirmPassword(passwordInput.value, confirmInput.value);
      if (!confirmCheck.valid) {
        setInputError(confirmInput, confirmError, confirmCheck.message);
        isValid = false;
      } else {
        setInputValid(confirmInput, confirmError);
      }

      if (!isValid) return;

      const selectedRole = roleSelect && roleSelect.value === "teacher" ? "teacher" : "student";
      const isTeacher = selectedRole === "teacher";

      const newUser = {
        email: emailInput.value.trim(),
        password: passwordInput.value,
        fullName: nameInput.value.trim(),
        role: selectedRole, 
        roleTitle: isTeacher ? "Giáo viên / Giảng viên" : "Học sinh / Thí sinh",
        id: (isTeacher ? "GV-2026-" : "HS-2026-") + Math.floor(100 + Math.random() * 900)
      };

      const users = JSON.parse(localStorage.getItem("exampro_users") || "[]");
      users.push(newUser);
      localStorage.setItem("exampro_users", JSON.stringify(users));

      alert(`🎉 Đăng ký tài khoản ${isTeacher ? "Giáo viên" : "Học sinh"} thành công! Bạn có thể đăng nhập ngay bây giờ.`);

      switchTab("login");
      window.location.hash = "login";
      const loginEmail = document.getElementById("loginEmail");
      const loginPassword = document.getElementById("loginPassword");
      if (loginEmail) loginEmail.value = newUser.email;
      if (loginPassword) loginPassword.value = "";
    });
  }
});

if (typeof window !== "undefined") {
  window.getCurrentUser = getCurrentUser;
  window.setCurrentUser = setCurrentUser;
  window.isTeacherUser = isTeacherUser;
  window.requireTeacherAuth = requireTeacherAuth;
  window.requireStudentAuth = requireStudentAuth;
  window.requireAuth = requireAuth;
  window.logout = logout;
}
