// ==========================================
// 1. SIMULATED DATABASE FRAMEWORK
// ==========================================

const DEFAULT_WORKOUT_TEMPLATE = {
    segunda: { name: "Segunda-Feira", focus: "Peito e Tríceps", exercises: [
        { id: "s1", name: "Supino Reto Barra", details: "4 séries x 10 repetições" },
        { id: "s2", name: "Supino Inclinado Halteres", details: "3 séries x 12 repetições" },
        { id: "s3", name: "Tríceps Corda", details: "4 séries x 15 repetições" }
    ]},
    terca: { name: "Terça-Feira", focus: "Quadríceps", exercises: [
        { id: "t1", name: "Agachamento Livre", details: "4 séries x 8 repetições" },
        { id: "t2", name: "Leg Press 45º", details: "4 séries x 12 repetições" }
    ]},
    quarta: { name: "Quarta-Feira", focus: "Costas e Bíceps", exercises: [
        { id: "q1", name: "Puxada Alta Frente", details: "4 séries x 12 repetições" },
        { id: "q2", name: "Rosca Direta W-Barra", details: "4 séries x 10 repetições" }
    ]},
    quinta: { name: "Quinta-Feira", focus: "Posterior de Coxa", exercises: [
        { id: "qi1", name: "Stiff Halteres", details: "4 séries x 10 repetições" },
        { id: "qi2", name: "Mesa Flexora", details: "4 séries x 12 repetições" }
    ]},
    sexta: { name: "Sexta-Feira", focus: "Ombro e Peito", exercises: [
        { id: "sx1", name: "Desenvolvimento Halteres", details: "4 séries x 10 repetições" },
        { id: "sx2", name: "Elevação Lateral", details: "4 séries x 15 repetições" }
    ]},
    sabado: { name: "Sábado", focus: "Bíceps e Tríceps", exercises: [
        { id: "sa1", name: "Rosca Scott Máquina", details: "4 séries x 12 repetições" },
        { id: "sa2", name: "Tríceps Coice", details: "3 séries x 12 repetições" }
    ]}
};

const DEFAULT_DIET_TEMPLATE = [
    { id: "d1", time: "07:00", name: "Café da Manhã", items: ["3 Ovos Inteiros mexidos", "2 Fatias de Pão Integral", "Café Preto"] },
    { id: "d2", time: "12:00", name: "Almoço", items: ["150g Peito de Frango", "200g Arroz Integral", "Brócolis e Salada"] },
    { id: "d3", time: "15:30", name: "Lanche da Tarde", items: ["30g Whey Protein", "40g Aveia", "1 Banana"] },
    { id: "d4", time: "19:30", name: "Janta", items: ["150g Patinho moído", "150g Batata Doce"] },
    { id: "d5", time: "22:00", name: "Ceia", items: ["1 Potinho de Iogurte Grego Natural", "10g Castanhas"] }
];

const INITIAL_DB = {
    users: [
        { id: "u_coach", username: "coach", password: "coach", role: "coach", name: "Felipe Alves" },
        { id: "u_arthur", username: "arthur", password: "123", role: "student", name: "Arthur Alves", age: 26, height: 178 },
        { id: "u_alves", username: "alves", password: "123", role: "student", name: "Gabriel Alves", age: 22, height: 184 }
    ],
    studentData: {
        "u_arthur": {
            workout: JSON.parse(JSON.stringify(DEFAULT_WORKOUT_TEMPLATE)),
            diet: JSON.parse(JSON.stringify(DEFAULT_DIET_TEMPLATE)),
            measurements: [
                { date: "2026-05-10", weight: 84.5, bf: 16.2, chest: 102, waist: 90, arms: 37, legs: 59 },
                { date: "2026-06-10", weight: 81.8, bf: 13.8, chest: 104, waist: 85, arms: 37.8, legs: 58.2 }
            ],
            photos: [],
            completions: {},
            monthlyFee: 150,
            pixKey: "pix@teamalves.com.br",
            bankDetails: "Banco Itaú (341) - Agência: 1234 - Conta: 56789-0",
            payments: [
                { id: "pay_1", date: "2026-05-05", monthRef: "Maio/2026", amount: 150, status: "Pago", attachmentName: "recibo_maio.png", attachmentSrc: "" },
                { id: "pay_2", date: "2026-06-01", monthRef: "Junho/2026", amount: 150, status: "Pendente", attachmentName: "", attachmentSrc: "" }
            ],
            cardDetails: null,
            isArchived: false,
            isDeleted: false
        },
        "u_alves": {
            workout: JSON.parse(JSON.stringify(DEFAULT_WORKOUT_TEMPLATE)),
            diet: JSON.parse(JSON.stringify(DEFAULT_DIET_TEMPLATE)),
            measurements: [
                { date: "2026-06-12", weight: 76.0, bf: 11.5, chest: 98, waist: 77, arms: 35.5, legs: 53.0 }
            ],
            photos: [],
            completions: {},
            monthlyFee: 180,
            pixKey: "pix@teamalves.com.br",
            bankDetails: "Banco Itaú (341) - Agência: 1234 - Conta: 56789-0",
            payments: [
                { id: "pay_3", date: "2026-06-05", monthRef: "Junho/2026", amount: 180, status: "Pago", attachmentName: "comprovante_alves.png", attachmentSrc: "" }
            ],
            cardDetails: null,
            isArchived: false,
            isDeleted: false
        }
    }
};

let db = null;
let currentUser = null;
let activeDay = "segunda";
let coachMobileFilter = "active"; // "active" | "archived" | "trash"

function initDb() {
    const savedDb = localStorage.getItem("team_alves_db");
    if (savedDb) {
        try {
            db = JSON.parse(savedDb);
        } catch (e) {
            console.error("Erro ao ler banco de dados no mobile, resetando...", e);
            db = JSON.parse(JSON.stringify(INITIAL_DB));
            saveDb();
        }
    } else {
        db = JSON.parse(JSON.stringify(INITIAL_DB));
        saveDb();
    }
}

function saveDb() {
    localStorage.setItem("team_alves_db", JSON.stringify(db));
}

// ==========================================
// 2. MOBILE CANVAS LIGHTNING (Optimized for Mobile)
// ==========================================

const canvas = document.getElementById("lightning-canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

let lightningBolts = [];
let ambientSparks = [];
let isBoostMode = false;
let hasShownRadianteToday = false;

window.addEventListener("resize", () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
});

class MobileLightning {
    constructor(startX, startY, endX, endY, isTaskStrike = false) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.isTaskStrike = isTaskStrike;
        this.points = [];
        this.opacity = 1;
        this.decay = isTaskStrike ? 0.05 : 0.09;
        this.generatePath();
    }

    generatePath() {
        this.points = [];
        let steps = 10;
        let diffX = this.endX - this.startX;
        let diffY = this.endY - this.startY;

        for (let i = 0; i <= steps; i++) {
            let t = i / steps;
            let px = this.startX + diffX * t;
            let py = this.startY + diffY * t;

            if (i > 0 && i < steps) {
                let offset = (Math.random() - 0.5) * (this.isTaskStrike ? 20 : 40) * (1 - Math.abs(t - 0.5) * 0.8);
                px += offset;
            }
            this.points.push({ x: px, y: py });
        }
    }

    draw() {
        if (this.opacity <= 0) return;

        ctx.lineJoin = "round";

        ctx.lineWidth = this.isTaskStrike ? 6 : 9;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.isTaskStrike ? "rgba(0, 230, 118, 0.7)" : "rgba(255, 215, 0, 0.7)";
        ctx.strokeStyle = this.isTaskStrike ? `rgba(0, 230, 118, ${this.opacity * 0.2})` : `rgba(255, 172, 28, ${this.opacity * 0.2})`;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();

        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 2;
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();

        this.opacity -= this.decay;
    }
}

class MobileSpark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 1.5 - 0.5;
        this.size = Math.random() * 2 + 0.8;
        this.alpha = 1;
        this.decay = Math.random() * 0.04 + 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 215, 0, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function spawnSparks(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
        ambientSparks.push(new MobileSpark(x, y));
    }
}

function triggerLightningStrike(x = null, y = null) {
    let startX = x !== null ? x + (Math.random() - 0.5) * 100 : Math.random() * width;
    let startY = -10;
    let endX = x !== null ? x : Math.random() * width;
    let endY = y !== null ? y : height * 0.7 + Math.random() * (height * 0.3);

    lightningBolts.push(new MobileLightning(startX, startY, endX, endY, x !== null && y !== null));
    
    if (x !== null && y !== null) {
        spawnSparks(endX, endY, 8);
    }
}

window.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const target = e.target;
    if (target.tagName !== "BUTTON" && target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.closest("button") && !target.closest("nav") && !target.closest("header") && !target.closest(".drawer-content")) {
        triggerLightningStrike(touch.clientX, touch.clientY);
    }
}, { passive: true });

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = lightningBolts.length - 1; i >= 0; i--) {
        lightningBolts[i].draw();
        if (lightningBolts[i].opacity <= 0) lightningBolts.splice(i, 1);
    }

    for (let i = ambientSparks.length - 1; i >= 0; i--) {
        ambientSparks[i].update();
        if (ambientSparks[i].alpha <= 0) {
            ambientSparks.splice(i, 1);
        } else {
            ambientSparks[i].draw();
        }
    }

    let strikeChance = isBoostMode ? 0.05 : 0.003;
    if (Math.random() < strikeChance) {
        triggerLightningStrike();
    }

    requestAnimationFrame(animate);
}
animate();

// ==========================================
// 3. LOGIN & ROUTER CONTROLLER
// ==========================================

const loginForm = document.getElementById("login-form");
const loginWrapper = document.getElementById("login-wrapper");
const appWrapper = document.getElementById("app-wrapper");
const flashOverlay = document.getElementById("flash-overlay");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userVal = document.getElementById("username").value.trim().toLowerCase();
    const passVal = document.getElementById("password").value;

    const user = db.users.find(u => u.username === userVal && u.password === passVal);

    if (user) {
        if (user.role === "student") {
            const sData = db.studentData[user.id];
            if (sData) {
                if (sData.isDeleted) {
                    alert("Sua conta está na lixeira. Contate o treinador Felipe Alves para mais informações.");
                    return;
                }
                if (sData.isArchived) {
                    alert("Atenção: Seu perfil está arquivado pelo treinador. Você terá acesso de apenas visualização.");
                }
            }
        }
        flashOverlay.style.opacity = "1";
        setTimeout(() => {
            currentUser = user;
            sessionStorage.setItem("team_alves_user", JSON.stringify(user));
            loginWrapper.classList.add("hidden");
            
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";

            initApp();

            triggerLightningStrike(width / 2, height / 2);
            setTimeout(() => {
                flashOverlay.style.opacity = "0";
            }, 150);
        }, 300);
    } else {
        alert("Dados incorretos!");
    }
});

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
    flashOverlay.style.opacity = "1";
    setTimeout(() => {
        currentUser = null;
        sessionStorage.removeItem("team_alves_user");
        appWrapper.classList.add("hidden");
        loginWrapper.classList.remove("hidden");
        
        document.body.classList.remove("boost-active");
        isBoostMode = false;
        hasShownRadianteToday = false;

        setTimeout(() => {
            flashOverlay.style.opacity = "0";
        }, 150);
    }, 300);
});

// Auto login Session check
window.addEventListener("load", () => {
    initDb();
    const activeSession = sessionStorage.getItem("team_alves_user");
    if (activeSession) {
        currentUser = JSON.parse(activeSession);
        loginWrapper.classList.add("hidden");
        initApp();
    }
});

function initApp() {
    activeDay = "segunda";
    
    // Toggle bottom navigation bar items depending on role
    const studentItems = document.querySelectorAll(".student-nav-item");
    const coachItems = document.querySelectorAll(".coach-nav-item");

    if (currentUser.role === "coach") {
        document.getElementById("app-header-title").innerText = "TEAM ALVES | COACH";
        
        // Show coach menu items, hide student ones
        studentItems.forEach(item => item.classList.add("hidden"));
        coachItems.forEach(item => item.classList.remove("hidden"));
        
        coachMobileFilter = "active";
        const mobileFilter = document.getElementById("coach-mobile-filter");
        if (mobileFilter) {
            mobileFilter.value = coachMobileFilter;
            mobileFilter.onchange = (e) => {
                coachMobileFilter = e.target.value;
                renderCoachStudentsList();
            };
        }
        
        switchTab("coach");
    } else {
        document.getElementById("app-header-title").innerText = "TEAM ALVES";
        
        studentItems.forEach(item => item.classList.remove("hidden"));
        coachItems.forEach(item => item.classList.add("hidden"));
        
        // Display student specific home info
        document.getElementById("welcome-athlete-name").innerText = currentUser.name.split(" ")[0];
        updateDateDisplay();
        setupStudentTabs();
        
        switchTab("home");
    }
}

function updateDateDisplay() {
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    const todayStr = new Date().toLocaleDateString('pt-BR', options);
    document.getElementById("date-display").innerText = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);
}

// ==========================================
// 4. BOTTOM NAV TAB SWITCHER (MOBILE ROUTING)
// ==========================================

window.switchTab = function(tabName) {
    // Hide all views
    document.querySelectorAll(".app-view").forEach(view => view.classList.add("hidden"));
    
    // Show active view
    const activeView = document.getElementById(`view-${tabName}`);
    if (activeView) activeView.classList.remove("hidden");

    // Remove active class from all nav buttons
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    
    // Set active tab button
    const activeBtn = document.getElementById(`btn-tab-${tabName}`);
    if (activeBtn) activeBtn.classList.add("active");

    // Route specific rendering
    if (currentUser.role === "student") {
        if (tabName === "home") {
            calculateStudentEnergy();
            updateHomeCounters();
        } else if (tabName === "workout") {
            renderStudentWorkout();
        } else if (tabName === "diet") {
            renderStudentDiet();
        } else if (tabName === "progress") {
            renderStudentProgressView();
        } else if (tabName === "payments") {
            renderMobilePayments();
        }
    } else {
        if (tabName === "coach") {
            renderCoachStudentsList();
        }
    }
};

function setupStudentTabs() {
    const tabBtns = document.querySelectorAll(".day-tab-btn");
    tabBtns.forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.day === activeDay) btn.classList.add("active");
        
        btn.onclick = () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeDay = btn.dataset.day;
            renderStudentWorkout();
            renderStudentDiet();
            calculateStudentEnergy();
            updateHomeCounters();
        };
    });
}

// ==========================================
// 5. STUDENT VIEW CONTROLLERS (MOBILE)
// ==========================================

function renderStudentWorkout() {
    const data = db.studentData[currentUser.id];
    const workoutData = data.workout[activeDay];
    
    document.getElementById("workout-focus-badge").innerText = workoutData.focus;
    document.getElementById("workout-day-name").innerText = workoutData.name;

    const listContainer = document.getElementById("exercise-list-container");
    listContainer.innerHTML = "";

    let dayCompletedCount = 0;

    workoutData.exercises.forEach((ex) => {
        const stateKey = `${activeDay}_${ex.id}`;
        const isCompleted = !!data.completions[stateKey];
        if (isCompleted) dayCompletedCount++;

        const card = document.createElement("div");
        card.className = `exercise-card ${isCompleted ? 'completed' : ''}`;
        card.id = `card-${stateKey}`;

        card.innerHTML = `
            <div class="exercise-info">
                <span class="exercise-name">${ex.name}</span>
                <span class="exercise-details">${ex.details}</span>
            </div>
            <button class="check-btn-mobile" onclick="toggleStudentExercise('${ex.id}', this, event)">
                <i class="fa-solid ${isCompleted ? 'fa-square-check' : 'fa-square'}"></i>
            </button>
        `;
        listContainer.appendChild(card);
    });

    document.getElementById("workout-overall-badge").innerText = `Progresso: ${dayCompletedCount}/${workoutData.exercises.length}`;
}

function renderStudentDiet() {
    const data = db.studentData[currentUser.id];
    const dietContainer = document.getElementById("meal-list-container");
    dietContainer.innerHTML = "";

    let dietCompletedCount = 0;

    data.diet.forEach((meal) => {
        const stateKey = `${activeDay}_${meal.id}`;
        const isCompleted = !!data.completions[stateKey];
        if (isCompleted) dietCompletedCount++;

        const card = document.createElement("div");
        card.className = `meal-card ${isCompleted ? 'completed' : ''}`;
        card.id = `card-diet-${stateKey}`;

        const itemsLi = meal.items.map(item => `<li>${item}</li>`).join("");

        card.innerHTML = `
            <div class="meal-title-row">
                <span class="meal-title-mobile">${meal.name}</span>
                <span class="meal-time-badge">${meal.time}</span>
            </div>
            <ul class="meal-details-list-mobile">
                ${itemsLi}
            </ul>
            <div class="meal-card-footer">
                <button class="meal-check-btn" onclick="toggleStudentMeal('${meal.id}', this, event)">
                    <i class="fa-solid ${isCompleted ? 'fa-square-check' : 'fa-square'}"></i>
                    <span>${isCompleted ? 'Concluída' : 'Marcar Feita'}</span>
                </button>
            </div>
        `;
        dietContainer.appendChild(card);
    });

    document.getElementById("diet-overall-badge").innerText = `Concluído: ${dietCompletedCount}/${data.diet.length}`;
}

window.toggleStudentExercise = function(exId, btn, event) {
    event.stopPropagation();
    const data = db.studentData[currentUser.id];
    const stateKey = `${activeDay}_${exId}`;
    const card = document.getElementById(`card-${stateKey}`);
    const isCompleted = !data.completions[stateKey];

    data.completions[stateKey] = isCompleted;
    saveDb();

    if (isCompleted) {
        card.classList.add("completed");
        btn.innerHTML = `<i class="fa-solid fa-square-check"></i>`;
        const rect = btn.getBoundingClientRect();
        triggerLightningStrike(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
        card.classList.remove("completed");
        btn.innerHTML = `<i class="fa-solid fa-square"></i>`;
    }

    // Refresh workout progress
    const workoutData = data.workout[activeDay];
    let completedCount = 0;
    workoutData.exercises.forEach(ex => {
        if (data.completions[`${activeDay}_${ex.id}`]) completedCount++;
    });
    document.getElementById("workout-overall-badge").innerText = `Progresso: ${completedCount}/${workoutData.exercises.length}`;

    calculateStudentEnergy();
    updateHomeCounters();
};

window.toggleStudentMeal = function(mealId, btn, event) {
    event.stopPropagation();
    const data = db.studentData[currentUser.id];
    const stateKey = `${activeDay}_${mealId}`;
    const card = document.getElementById(`card-diet-${stateKey}`);
    const isCompleted = !data.completions[stateKey];

    data.completions[stateKey] = isCompleted;
    saveDb();

    if (isCompleted) {
        card.classList.add("completed");
        btn.innerHTML = `<i class="fa-solid fa-square-check"></i> <span>Concluída</span>`;
        const rect = btn.getBoundingClientRect();
        triggerLightningStrike(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
        card.classList.remove("completed");
        btn.innerHTML = `<i class="fa-solid fa-square"></i> <span>Marcar Feita</span>`;
    }

    let completedCount = 0;
    data.diet.forEach(m => {
        if (data.completions[`${activeDay}_${m.id}`]) completedCount++;
    });
    document.getElementById("diet-overall-badge").innerText = `Concluído: ${completedCount}/${data.diet.length}`;

    calculateStudentEnergy();
    updateHomeCounters();
};

function calculateStudentEnergy() {
    const data = db.studentData[currentUser.id];
    const workoutData = data.workout[activeDay];
    
    let completedExercisesNum = 0;
    workoutData.exercises.forEach(ex => {
        if (data.completions[`${activeDay}_${ex.id}`]) completedExercisesNum++;
    });

    let completedMealsNum = 0;
    data.diet.forEach(m => {
        if (data.completions[`${activeDay}_${m.id}`]) completedMealsNum++;
    });

    const totalCompleted = completedExercisesNum + completedMealsNum;
    const totalTasks = workoutData.exercises.length + data.diet.length;
    const pct = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    // Update UI progress meter
    document.getElementById("energy-bar-fill").style.width = `${pct}%`;
    document.getElementById("energy-percentage").innerText = `${pct}%`;

    let msg = "";
    if (pct === 0) {
        msg = "Sem carga. Inicie os treinos!";
    } else if (pct < 35) {
        msg = "Bateria iniciando... ⚡";
    } else if (pct < 70) {
        msg = "Carga média! Força! ⚡";
    } else if (pct < 100) {
        msg = "Falta pouco para carga máxima! 🔥";
    } else {
        msg = "CARGA TOTAL COMPLETA! ⚡🔥";
        document.body.classList.add("boost-active");
        isBoostMode = true;

        if (!hasShownRadianteToday) {
            hasShownRadianteToday = true;

            const wrapper = document.getElementById("app-wrapper");
            wrapper.classList.add("shake-screen");
            setTimeout(() => wrapper.classList.remove("shake-screen"), 500);

            const overlay = document.getElementById("radiante-overlay");
            overlay.classList.remove("hidden");
            overlay.style.opacity = "1";

            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    triggerLightningStrike(Math.random() * width, Math.random() * height);
                }, i * 150);
            }
        }
    }

    if (pct < 100) {
        document.body.classList.remove("boost-active");
        isBoostMode = false;
        hasShownRadianteToday = false;

        const overlay = document.getElementById("radiante-overlay");
        if (!overlay.classList.contains("hidden")) {
            overlay.classList.add("hidden");
        }
    }

    document.getElementById("energy-msg").innerText = msg;
}

window.closeRadianteOverlay = function() {
    const overlay = document.getElementById("radiante-overlay");
    overlay.style.opacity = "0";
    setTimeout(() => {
        overlay.classList.add("hidden");
    }, 400);
};

function updateHomeCounters() {
    const data = db.studentData[currentUser.id];
    const workoutData = data.workout[activeDay];
    
    let completedExercisesNum = 0;
    workoutData.exercises.forEach(ex => {
        if (data.completions[`${activeDay}_${ex.id}`]) completedExercisesNum++;
    });

    let completedMealsNum = 0;
    data.diet.forEach(m => {
        if (data.completions[`${activeDay}_${m.id}`]) completedMealsNum++;
    });

    document.getElementById("home-workout-progress").innerText = `${completedExercisesNum}/${workoutData.exercises.length}`;
    document.getElementById("home-diet-progress").innerText = `${completedMealsNum}/${data.diet.length}`;
}

// Student Reset Button
document.getElementById("reset-progress-btn").addEventListener("click", () => {
    if (confirm("Resetar progresso de treino e refeições de hoje?")) {
        const data = db.studentData[currentUser.id];
        const workoutData = data.workout[activeDay];
        
        workoutData.exercises.forEach(ex => {
            delete data.completions[`${activeDay}_${ex.id}`];
        });

        data.diet.forEach(m => {
            delete data.completions[`${activeDay}_${m.id}`];
        });

        saveDb();
        renderStudentWorkout();
        renderStudentDiet();
        calculateStudentEnergy();
        updateHomeCounters();

        spawnSparks(width / 2, height / 2, 12);
    }
});

// ==========================================
// 6. STUDENT EVOLUTION SUBVIEW (MOBILE)
// ==========================================

function renderStudentProgressView() {
    const data = db.studentData[currentUser.id];
    
    // Render photos
    renderMobilePhotosGallery(data.photos, "mobile-photos-gallery", true);

    // Render metrics list (vertical cards instead of table to fit mobile)
    const historyList = document.getElementById("mobile-metrics-history-list");
    historyList.innerHTML = "";

    const sortedMeasures = [...data.measurements].reverse();
    if (sortedMeasures.length === 0) {
        historyList.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px 0;">Sem avaliações registradas.</p>`;
        return;
    }

    sortedMeasures.forEach((m) => {
        const card = document.createElement("div");
        card.className = "metric-history-card";
        card.innerHTML = `
            <div class="metric-history-header">
                <span>${formatDate(m.date)}</span>
                <strong>Peso: ${m.weight} kg</strong>
            </div>
            <div class="metric-history-grid">
                <div class="metric-history-item"><span>BF</span><strong>${m.bf}%</strong></div>
                <div class="metric-history-item"><span>Cintura</span><strong>${m.waist}cm</strong></div>
                <div class="metric-history-item"><span>Braço</span><strong>${m.arms}cm</strong></div>
                <div class="metric-history-item"><span>Coxa</span><strong>${m.legs}cm</strong></div>
            </div>
        `;
        historyList.appendChild(card);
    });
}

function formatDate(dateStr) {
    const parts = dateStr.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return dateStr;
}

function renderMobilePhotosGallery(photos, containerId, allowDelete) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (photos.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); text-align: center; width: 100%; padding: 20px 0; font-size: 0.78rem;">Nenhuma foto cadastrada.</p>`;
        return;
    }

    photos.forEach((photo, idx) => {
        const card = document.createElement("div");
        card.className = "photo-card";
        card.innerHTML = `
            <img src="${photo.src}" alt="Evolução">
            <span class="photo-card-date">${formatDate(photo.date)}</span>
            ${allowDelete ? `<button class="photo-delete-btn" onclick="deleteMobilePhoto(${idx})"><i class="fa-solid fa-trash"></i></button>` : ''}
        `;
        container.appendChild(card);
    });
}

// Save measurements (mobile)
const mobMetricsForm = document.getElementById("mobile-metrics-form");
mobMetricsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = db.studentData[currentUser.id];

    data.measurements.push({
        date: new Date().toISOString().split("T")[0],
        weight: parseFloat(document.getElementById("mob-weight").value),
        bf: parseFloat(document.getElementById("mob-bf").value),
        waist: parseFloat(document.getElementById("mob-waist").value),
        arms: parseFloat(document.getElementById("mob-arms").value),
        chest: 0, legs: 0 // Default values for mobile simplified layout
    });

    saveDb();
    mobMetricsForm.reset();
    renderStudentProgressView();
    spawnSparks(width / 2, height / 2, 12);
    alert("Avaliação física salva!");
});

// Photo upload (mobile)
const mobPhotoInput = document.getElementById("mob-photo-input");
mobPhotoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const data = db.studentData[currentUser.id];
        data.photos.push({
            date: new Date().toISOString().split("T")[0],
            src: event.target.result
        });
        saveDb();
        renderStudentProgressView();
        spawnSparks(width / 2, height / 2, 10);
    };
    reader.readAsDataURL(file);
});

window.deleteMobilePhoto = function(index) {
    if (confirm("Deseja excluir esta foto?")) {
        const data = db.studentData[currentUser.id];
        data.photos.splice(index, 1);
        saveDb();
        renderStudentProgressView();
    }
};

// ==========================================
// 6.5 STUDENT PAYMENTS SUBVIEW (MOBILE)
// ==========================================

window.renderMobilePayments = function() {
    const data = db.studentData[currentUser.id];

    // 1. Render Basic Values
    document.getElementById("mob-student-fee-value").innerText = `R$ ${parseFloat(data.monthlyFee || 150).toFixed(2).replace('.', ',')}`;
    document.getElementById("mob-student-pix-key").innerText = data.pixKey || "pix@teamalves.com.br";
    document.getElementById("mob-student-bank-details").innerText = data.bankDetails || "Banco Itaú - Ag 1234 - CC 56789-0";

    // 2. Render Credit Card Details
    const cardForm = document.getElementById("mob-card-form-wrapper");
    const cardDisplay = document.getElementById("mob-card-registered-display");

    if (data.cardDetails) {
        cardForm.classList.add("hidden");
        cardDisplay.classList.remove("hidden");

        const rawNum = data.cardDetails.cardNumber.replace(/\s/g, '');
        const last4 = rawNum.slice(-4);
        document.getElementById("mob-registered-card-number").innerText = `**** **** **** ${last4}`;
        document.getElementById("mob-registered-card-holder").innerText = data.cardDetails.holderName.toUpperCase();
        document.getElementById("mob-registered-card-expiry").innerText = data.cardDetails.expiryDate;
    } else {
        cardForm.classList.remove("hidden");
        cardDisplay.classList.add("hidden");
        document.getElementById("mob-credit-card-form").reset();
    }

    // 3. Render Status alert card
    const statusCard = document.getElementById("mob-payment-status-card");
    const statusTitle = document.getElementById("mob-payment-status-title");
    const statusDesc = document.getElementById("mob-payment-status-desc");

    const pendingPay = (data.payments || []).find(p => p.status.toLowerCase() === 'pendente');

    if (pendingPay) {
        statusCard.className = "payment-status-alert-mobile glass-panel";
        statusTitle.innerText = `Mensalidade: Pendente (${pendingPay.monthRef})`;
        statusDesc.innerText = `Lançado no valor de R$ ${parseFloat(pendingPay.amount).toFixed(2).replace('.', ',')}.`;
    } else {
        statusCard.className = "payment-status-alert-mobile paid glass-panel";
        statusTitle.innerText = "Mensalidade: Regularizada 🟢";
        statusDesc.innerText = "Nenhuma pendência ativa para este mês.";
    }

    // 4. Fill upload selector with pending months
    const monthSelect = document.getElementById("mob-proof-month-select");
    monthSelect.innerHTML = "";

    const pendingMonths = (data.payments || []).filter(p => p.status.toLowerCase() === 'pendente');
    
    if (pendingMonths.length === 0) {
        monthSelect.innerHTML = `<option value="">Nenhuma pendência</option>`;
    } else {
        pendingMonths.forEach((p) => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.innerText = `${p.monthRef} - R$ ${parseFloat(p.amount).toFixed(2).replace('.', ',')}`;
            monthSelect.appendChild(opt);
        });
    }

    // 5. Render mobile payments list
    const list = document.getElementById("mobile-payments-history-list");
    list.innerHTML = "";

    const sortedPayments = [...(data.payments || [])].reverse();

    if (sortedPayments.length === 0) {
        list.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px 0; font-size: 0.75rem;">Sem histórico de pagamentos.</p>`;
        return;
    }

    sortedPayments.forEach((pay) => {
        const item = document.createElement("div");
        item.className = "payment-list-item-mobile glass-panel";

        const statusClass = pay.status.toLowerCase() === 'pago' ? 'pago' : 'pendente';
        const badgeHTML = `<span class="status-badge ${statusClass}">${pay.status}</span>`;

        let attachmentBtnHTML = "";
        if (pay.attachmentSrc) {
            attachmentBtnHTML = `
                <button class="btn-view-proof" onclick="viewPaymentAttachment('${currentUser.id}', '${pay.id}')">
                    <i class="fa-solid fa-receipt"></i> Recibo
                </button>
            `;
        }

        item.innerHTML = `
            <div class="payment-item-info-mobile">
                <h4>Cobrança ${pay.monthRef}</h4>
                <span style="font-size:0.7rem; color:var(--text-secondary);">
                    Vencimento: ${formatDate(pay.date || new Date().toISOString().split("T")[0])} | 
                    <strong>R$ ${parseFloat(pay.amount).toFixed(2).replace('.', ',')}</strong>
                </span>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
                ${badgeHTML}
                ${attachmentBtnHTML}
            </div>
        `;
        list.appendChild(item);
    });
};

window.copyPixKey = function() {
    const key = document.getElementById("mob-student-pix-key").innerText;
    navigator.clipboard.writeText(key).then(() => {
        alert("Chave Pix copiada!");
    }).catch(err => {
        alert("Chave Pix: " + key);
    });
};

// Credit Card Submit
document.getElementById("mob-credit-card-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = db.studentData[currentUser.id];

    data.cardDetails = {
        cardNumber: document.getElementById("mob-card-num").value.trim(),
        holderName: document.getElementById("mob-card-name").value.trim(),
        expiryDate: document.getElementById("mob-card-expiry").value.trim(),
        cvv: document.getElementById("mob-card-cvv").value.trim()
    };

    const pendingPayIndex = (data.payments || []).findIndex(p => p.status.toLowerCase() === 'pendente');
    if (pendingPayIndex !== -1) {
        data.payments[pendingPayIndex].status = "Pago";
        data.payments[pendingPayIndex].date = new Date().toISOString().split("T")[0];
        alert("Cartão cadastrado! Mensalidade debitada automaticamente.");
    } else {
        alert("Cartão cadastrado com sucesso!");
    }

    saveDb();
    renderMobilePayments();
    spawnSparks(width / 2, height / 2, 15);
});

window.deleteStudentCard = function() {
    if (confirm("Remover cartão de crédito cadastrado?")) {
        const data = db.studentData[currentUser.id];
        data.cardDetails = null;
        saveDb();
        renderMobilePayments();
    }
};

// Mobile Proof Upload
const mobProofFileInput = document.getElementById("mob-proof-file-input");
mobProofFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const paymentId = document.getElementById("mob-proof-month-select").value;

    if (!paymentId) {
        alert("Nenhuma pendência selecionada.");
        return;
    }
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const data = db.studentData[currentUser.id];
        const base64Img = event.target.result;

        const payment = data.payments.find(p => p.id === paymentId);
        if (payment) {
            payment.attachmentName = file.name;
            payment.attachmentSrc = base64Img;
            payment.status = "Pago";
            payment.date = new Date().toISOString().split("T")[0];

            saveDb();
            renderMobilePayments();
            spawnSparks(width / 2, height / 2, 15);
            alert("Comprovante enviado!");
        }
    };
    reader.readAsDataURL(file);
});

// Mobile Attachment Viewer
window.viewPaymentAttachment = function(studentId, paymentId) {
    const studentData = db.studentData[studentId];
    if (!studentData) return;
    const payment = studentData.payments.find(p => p.id === paymentId);
    if (!payment || !payment.attachmentSrc) return;

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.95)";
    overlay.style.zIndex = "25000";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.onclick = () => document.body.removeChild(overlay);

    const img = document.createElement("img");
    img.src = payment.attachmentSrc;
    img.style.maxWidth = "95%";
    img.style.maxHeight = "75%";
    img.style.border = "2px solid var(--gold)";
    img.style.borderRadius = "8px";

    const title = document.createElement("h3");
    title.innerText = `Comprovante: ${payment.monthRef}`;
    title.style.color = "var(--gold)";
    title.style.marginBottom = "10px";
    title.style.fontSize = "1rem";
    title.style.fontFamily = "Orbitron";

    const closeTxt = document.createElement("p");
    closeTxt.innerText = "Toque para fechar";
    closeTxt.style.color = "var(--text-secondary)";
    closeTxt.style.marginTop = "15px";
    closeTxt.style.fontSize = "0.75rem";

    overlay.appendChild(title);
    overlay.appendChild(img);
    overlay.appendChild(closeTxt);
    document.body.appendChild(overlay);
};

// ==========================================
// 7. COACH PORTAL - STUDENTS LIST (MOBILE)
// ==========================================

function renderCoachStudentsList() {
    const container = document.getElementById("coach-students-list-container");
    container.innerHTML = "";

    const students = db.users.filter(u => u.role === "student");

    students.forEach((student) => {
        const data = db.studentData[student.id];
        if (!data) return;

        // Apply filters based on view mode
        if (coachMobileFilter === "active") {
            if (data.isArchived || data.isDeleted) return;
        } else if (coachMobileFilter === "archived") {
            if (!data.isArchived || data.isDeleted) return;
        } else if (coachMobileFilter === "trash") {
            if (!data.isDeleted) return;
        }

        const workoutData = data.workout[activeDay];
        
        let completedExercisesNum = 0;
        workoutData.exercises.forEach(ex => {
            if (data.completions[`${activeDay}_${ex.id}`]) completedExercisesNum++;
        });

        let completedMealsNum = 0;
        data.diet.forEach(m => {
            if (data.completions[`${activeDay}_${m.id}`]) completedMealsNum++;
        });

        const totalCompleted = completedExercisesNum + completedMealsNum;
        const totalTasks = workoutData.exercises.length + data.diet.length;
        const pct = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

        const latestWeight = data.measurements.length > 0 ? `${data.measurements[data.measurements.length-1].weight} kg` : "N/D";

        const card = document.createElement("div");
        card.className = "student-list-item-mobile glass-panel";
        
        if (coachMobileFilter !== "trash") {
            card.onclick = () => openStudentDrawer(student.id);
            card.style.cursor = "pointer";
        } else {
            card.style.cursor = "default";
        }

        let actionsHTML = "";
        if (coachMobileFilter === "trash") {
            actionsHTML = `
                <div style="display:flex; gap:8px; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.05);">
                    <button class="btn-primary" onclick="event.stopPropagation(); restoreStudent('${student.id}')" style="flex:1; height:30px; font-size:0.7rem; padding:0; background: var(--green-electric); color:#000;">
                        <i class="fa-solid fa-trash-arrow-up"></i> RESTAURAR
                    </button>
                    <button class="btn-danger" onclick="event.stopPropagation(); destroyStudentPermanently('${student.id}')" style="flex:1; height:30px; font-size:0.7rem; padding:0;">
                        <i class="fa-solid fa-circle-xmark"></i> EXCLUIR
                    </button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="student-card-header">
                <div class="student-card-avatar"><i class="fa-solid fa-user-ninja"></i></div>
                <div class="student-card-info">
                    <h3 style="font-size:0.95rem;">${student.name}</h3>
                    <span style="font-size:0.68rem; color:var(--text-secondary);">Peso: ${latestWeight} | Bateria: ${pct}%</span>
                </div>
            </div>
            <div class="student-card-progress">
                <div class="student-card-progress-bar" style="height:6px;">
                    <div class="student-card-progress-fill" style="width: ${pct}%"></div>
                </div>
            </div>
            ${actionsHTML}
        `;
        container.appendChild(card);
    });
}

// ==========================================
// 8. COACH STUDENT DRAWER (BOTTOM OVERLAY PANEL)
// ==========================================

let activeDrawerStudentId = null;
let activeDrawerPrescDay = "segunda";

function openStudentDrawer(studentId) {
    activeDrawerStudentId = studentId;
    activeDrawerPrescDay = "segunda";
    
    const studentUser = db.users.find(u => u.id === studentId);
    const data = db.studentData[studentId];
    
    document.getElementById("drawer-student-name").innerText = studentUser.name;
    document.getElementById("drawer-student-meta").innerText = `Idade: ${studentUser.age} | Altura: ${studentUser.height}cm`;

    // Configure quick actions in drawer header
    const quickArchiveBtn = document.getElementById("btn-draw-quick-archive");
    const quickTrashBtn = document.getElementById("btn-draw-quick-trash");

    if (quickArchiveBtn) {
        if (data && data.isArchived) {
            quickArchiveBtn.innerHTML = `<i class="fa-solid fa-box-open"></i> <span id="text-draw-quick-archive">Desarquivar</span>`;
            quickArchiveBtn.onclick = () => {
                unarchiveStudent(studentId);
                closeStudentDrawer();
            };
        } else {
            quickArchiveBtn.innerHTML = `<i class="fa-solid fa-box-archive"></i> <span id="text-draw-quick-archive">Arquivar</span>`;
            quickArchiveBtn.onclick = () => {
                archiveStudent(studentId);
                closeStudentDrawer();
            };
        }
    }

    if (quickTrashBtn) {
        quickTrashBtn.onclick = () => {
            if (confirm(`Deseja mover ${studentUser.name} para a lixeira?`)) {
                deleteStudent(studentId);
                closeStudentDrawer();
            }
        };
    }

    // Reset select element
    document.getElementById("draw-presc-day").value = activeDrawerPrescDay;

    // Default tab
    switchDrawerTab("eval");

    // Slide up drawer
    document.getElementById("coach-student-drawer").classList.remove("hidden");
}

window.closeStudentDrawer = function() {
    document.getElementById("coach-student-drawer").classList.add("hidden");
    activeDrawerStudentId = null;
    renderCoachStudentsList();
};

window.switchDrawerTab = function(tabName) {
    const evalBtn = document.getElementById("btn-draw-eval");
    const prescBtn = document.getElementById("btn-draw-presc");
    const payBtn = document.getElementById("btn-draw-pay");
    const evalSec = document.getElementById("drawer-tab-eval");
    const prescSec = document.getElementById("drawer-tab-presc");
    const paySec = document.getElementById("drawer-tab-pay");

    evalBtn.classList.remove("active");
    prescBtn.classList.remove("active");
    payBtn.classList.remove("active");
    evalSec.classList.add("hidden");
    prescSec.classList.add("hidden");
    paySec.classList.add("hidden");

    if (tabName === "eval") {
        evalBtn.classList.add("active");
        evalSec.classList.remove("hidden");
        renderDrawerEvolution();
    } else if (tabName === "presc") {
        prescBtn.classList.add("active");
        prescSec.classList.remove("hidden");
        loadDrawerWorkoutDay();
        loadDrawerDiet();
    } else if (tabName === "pay") {
        payBtn.classList.add("active");
        paySec.classList.remove("hidden");
        renderDrawerPayments();
    }
};

function renderDrawerEvolution() {
    const data = db.studentData[activeDrawerStudentId];

    // Render photos
    renderMobilePhotosGallery(data.photos, "drawer-photos-gallery", false);

    // Render measures list
    const list = document.getElementById("drawer-metrics-history-list");
    list.innerHTML = "";

    const sortedMeasures = [...data.measurements].reverse();
    if (sortedMeasures.length === 0) {
        list.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 15px 0; font-size: 0.72rem;">Sem avaliações salvas.</p>`;
        return;
    }

    sortedMeasures.forEach((m) => {
        const card = document.createElement("div");
        card.className = "metric-history-card";
        card.innerHTML = `
            <div class="metric-history-header">
                <span>${formatDate(m.date)}</span>
                <strong>Peso: ${m.weight} kg</strong>
            </div>
            <div class="metric-history-grid">
                <div class="metric-history-item"><span>BF</span><strong>${m.bf}%</strong></div>
                <div class="metric-history-item"><span>Cintura</span><strong>${m.waist}cm</strong></div>
                <div class="metric-history-item"><span>Braço</span><strong>${m.arms}cm</strong></div>
                <div class="metric-history-item"><span>Coxa</span><strong>${m.legs}cm</strong></div>
            </div>
        `;
        list.appendChild(card);
    });
}

window.loadDrawerWorkoutDay = function() {
    activeDrawerPrescDay = document.getElementById("draw-presc-day").value;
    const data = db.studentData[activeDrawerStudentId];
    const workoutData = data.workout[activeDrawerPrescDay];

    document.getElementById("draw-presc-focus").value = workoutData.focus;

    // Convert list to text lines
    const txt = workoutData.exercises.map(ex => `${ex.name} | ${ex.details}`).join("\n");
    document.getElementById("draw-presc-exercises").value = txt;
};

window.saveDrawerWorkout = function() {
    const data = db.studentData[activeDrawerStudentId];
    const focus = document.getElementById("draw-presc-focus").value.trim();
    const content = document.getElementById("draw-presc-exercises").value.trim();

    if (!focus) {
        alert("Foco do treino é necessário!");
        return;
    }

    const lines = content.split("\n").filter(l => l.trim() !== "");
    const parsedExs = [];

    for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].split("|");
        if (parts.length < 2) {
            alert(`Erro na linha ${i+1}: Use o separador '|'`);
            return;
        }
        parsedExs.push({
            id: `ex_${Date.now()}_${i}`,
            name: parts[0].trim(),
            details: parts[1].trim()
        });
    }

    // Save
    data.workout[activeDrawerPrescDay].focus = focus;
    data.workout[activeDrawerPrescDay].exercises = parsedExs;
    
    // Reset completions for this day
    Object.keys(data.completions).forEach(key => {
        if (key.startsWith(`${activeDrawerPrescDay}_`)) {
            delete data.completions[key];
        }
    });

    saveDb();
    alert("Treino atualizado!");
};

function loadDrawerDiet() {
    const data = db.studentData[activeDrawerStudentId];
    const dietText = data.diet.map(meal => {
        return `${meal.time} | ${meal.name}\n${meal.items.join("\n")}`;
    }).join("\n---\n");

    document.getElementById("draw-presc-diet").value = dietText;
}

window.saveDrawerDiet = function() {
    const data = db.studentData[activeDrawerStudentId];
    const content = document.getElementById("draw-presc-diet").value.trim();

    if (!content) return;

    const blocks = content.split("---");
    const parsedDiet = [];

    for (let i = 0; i < blocks.length; i++) {
        const lines = blocks[i].split("\n").map(l => l.trim()).filter(l => l !== "");
        if (lines.length === 0) continue;

        const header = lines[0];
        const parts = header.split("|");
        if (parts.length < 2) {
            alert(`Erro no bloco ${i+1}: Use o formato Horário | Nome`);
            return;
        }

        const items = lines.slice(1);
        if (items.length === 0) return;

        parsedDiet.push({
            id: `d_${Date.now()}_${i}`,
            time: parts[0].trim(),
            name: parts[1].trim(),
            items
        });
    }

    data.diet = parsedDiet;
    
    // Reset diet completions
    Object.keys(data.completions).forEach(key => {
        if (key.includes("_d")) {
            delete data.completions[key];
        }
    });

    saveDb();
    alert("Dieta atualizada!");
};

// ==========================================
// 9. REGISTER STUDENT (MOBILE MODALS)
// ==========================================

const mobRegModal = document.getElementById("mobile-register-modal");
const mobRegForm = document.getElementById("mobile-register-form");

window.openMobileRegisterModal = function() {
    mobRegModal.classList.remove("hidden");
};

window.closeMobileRegisterModal = function() {
    mobRegModal.classList.add("hidden");
    mobRegForm.reset();
};

mobRegForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("mob-reg-name").value.trim();
    const username = document.getElementById("mob-reg-username").value.trim().toLowerCase();
    const password = document.getElementById("mob-reg-password").value;
    const age = parseInt(document.getElementById("mob-reg-age").value);
    const height = parseInt(document.getElementById("mob-reg-height").value);

    if (db.users.some(u => u.username === username)) {
        alert("Usuário já existe!");
        return;
    }

    const studentId = `u_${username}_${Date.now()}`;

    db.users.push({
        id: studentId,
        username,
        password,
        role: "student",
        name,
        age,
        height
    });

    db.studentData[studentId] = {
        workout: JSON.parse(JSON.stringify(DEFAULT_WORKOUT_TEMPLATE)),
        diet: JSON.parse(JSON.stringify(DEFAULT_DIET_TEMPLATE)),
        measurements: [],
        photos: [],
        completions: {},
        monthlyFee: 150,
        pixKey: "pix@teamalves.com.br",
        bankDetails: "Banco Itaú (341) - Agência: 1234 - Conta: 56789-0",
        payments: [],
        cardDetails: null,
        isArchived: false,
        isDeleted: false
    };

    saveDb();
    alert("Aluno cadastrado!");
    closeMobileRegisterModal();
    renderCoachStudentsList();
    spawnSparks(width / 2, height / 2, 15);
});

// ==========================================
// 9.2 STUDENT MANAGEMENT ACTIONS (ARCHIVE & TRASH - MOBILE)
// ==========================================

window.archiveStudent = function(studentId) {
    const data = db.studentData[studentId];
    if (data) {
        data.isArchived = true;
        saveDb();
        renderCoachStudentsList();
        alert("Aluno arquivado!");
    }
};

window.unarchiveStudent = function(studentId) {
    const data = db.studentData[studentId];
    if (data) {
        data.isArchived = false;
        saveDb();
        renderCoachStudentsList();
        alert("Aluno desarquivado!");
    }
};

window.deleteStudent = function(studentId) {
    const data = db.studentData[studentId];
    if (data) {
        data.isDeleted = true;
        data.isArchived = false;
        saveDb();
        renderCoachStudentsList();
        alert("Aluno movido para a lixeira!");
    }
};

window.restoreStudent = function(studentId) {
    const data = db.studentData[studentId];
    if (data) {
        data.isDeleted = false;
        data.isArchived = false;
        saveDb();
        renderCoachStudentsList();
        alert("Aluno restaurado!");
    }
};

window.destroyStudentPermanently = function(studentId) {
    const studentUser = db.users.find(u => u.id === studentId);
    if (!studentUser) return;

    if (confirm(`Excluir permanentemente ${studentUser.name}?\nEsta ação NÃO pode ser desfeita!`)) {
        if (confirm(`CONFIRMAÇÃO FINAL: Excluir ${studentUser.name}?`)) {
            db.users = db.users.filter(u => u.id !== studentId);
            delete db.studentData[studentId];
            saveDb();
            renderCoachStudentsList();
            alert("Aluno excluído!");
        }
    }
};

// ==========================================
// 8.5 COACH DRAWER FINANCE & DIRECT METRICS EDITING
// ==========================================

window.renderDrawerPayments = function() {
    const data = db.studentData[activeDrawerStudentId];

    // 1. Fill Config inputs
    document.getElementById("draw-student-fee").value = data.monthlyFee || 150;
    document.getElementById("draw-pix-key").value = data.pixKey || "pix@teamalves.com.br";
    document.getElementById("draw-bank-details").value = data.bankDetails || "Banco Itaú (341) - Agência: 1234 - Conta: 56789-0";

    // 2. Set Billing defaults
    document.getElementById("draw-payment-amount").value = data.monthlyFee || 150;
    document.getElementById("draw-payment-month").value = "";
    document.getElementById("coach-mob-payment-file").value = "";
    document.getElementById("coach-mob-payment-file-label").innerText = "Selecionar Imagem";

    // 3. Render Payments History inside drawer
    const list = document.getElementById("drawer-payments-history-list");
    list.innerHTML = "";

    const sortedPayments = [...(data.payments || [])].reverse();

    if (sortedPayments.length === 0) {
        list.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 15px 0; font-size: 0.72rem;">Nenhuma cobrança registrada.</p>`;
        return;
    }

    sortedPayments.forEach((pay) => {
        const item = document.createElement("div");
        item.className = "payment-list-item-mobile glass-panel";
        item.style.background = "rgba(255,255,255,0.01)";
        item.style.flexDirection = "column";
        item.style.alignItems = "stretch";
        item.style.gap = "8px";

        const statusClass = pay.status.toLowerCase() === 'pago' ? 'pago' : 'pendente';
        const badgeHTML = `<span class="status-badge ${statusClass}">${pay.status}</span>`;

        let attachmentHTML = `<span style="color:var(--text-muted); font-size:0.65rem;">Sem anexo</span>`;
        if (pay.attachmentSrc) {
            attachmentHTML = `<button class="btn-view-proof" onclick="viewPaymentAttachment('${activeDrawerStudentId}', '${pay.id}')">
                                <i class="fa-solid fa-receipt"></i> Ver Anexo
                              </button>`;
        }

        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="font-size:0.8rem;">${pay.monthRef}</h4>
                ${badgeHTML}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.68rem; color:var(--text-secondary);">
                <span>Valor: R$ ${parseFloat(pay.amount).toFixed(2).replace('.', ',')}</span>
                ${attachmentHTML}
            </div>
            <div style="display:flex; gap:8px; margin-top:4px;">
                <button class="btn-secondary" onclick="toggleDrawerPaymentStatus('${pay.id}')" style="flex:1; height:26px; font-size:0.7rem; padding:0;">
                    <i class="fa-solid fa-arrows-rotate"></i> Status
                </button>
                <button class="btn-danger" onclick="deleteDrawerPaymentRecord('${pay.id}')" style="flex:1; height:26px; font-size:0.7rem; padding:0;">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            </div>
        `;
        list.appendChild(item);
    });
};

window.saveDrawerPaymentConfig = function() {
    const data = db.studentData[activeDrawerStudentId];
    data.monthlyFee = parseFloat(document.getElementById("draw-student-fee").value) || 150;
    data.pixKey = document.getElementById("draw-pix-key").value.trim();
    data.bankDetails = document.getElementById("draw-bank-details").value.trim();

    saveDb();
    alert("Configurações salvas!");
    renderDrawerPayments();
};

window.toggleDrawerPaymentStatus = function(paymentId) {
    const data = db.studentData[activeDrawerStudentId];
    const payment = data.payments.find(p => p.id === paymentId);
    if (payment) {
        payment.status = payment.status === "Pago" ? "Pendente" : "Pago";
        if (payment.status === "Pago" && !payment.date) {
            payment.date = new Date().toISOString().split("T")[0];
        }
        saveDb();
        renderDrawerPayments();
    }
};

window.deleteDrawerPaymentRecord = function(paymentId) {
    if (confirm("Deseja realmente excluir esta cobrança?")) {
        const data = db.studentData[activeDrawerStudentId];
        data.payments = data.payments.filter(p => p.id !== paymentId);
        saveDb();
        renderDrawerPayments();
    }
};

// File change label update listener for mobile coach
document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "coach-mob-payment-file") {
        const file = e.target.files[0];
        const label = document.getElementById("coach-mob-payment-file-label");
        if (label) {
            label.innerText = file ? file.name : "Selecionar Imagem";
        }
    }
});

// Coach mobile payment form submit listener
document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "coach-mob-payment-form") {
        e.preventDefault();
        const data = db.studentData[activeDrawerStudentId];
        const monthVal = document.getElementById("draw-payment-month").value.trim();
        const amountVal = parseFloat(document.getElementById("draw-payment-amount").value) || 0;
        const statusVal = document.getElementById("draw-payment-status").value;
        const fileInput = document.getElementById("coach-mob-payment-file");
        const file = fileInput ? fileInput.files[0] : null;

        const newPayment = {
            id: `pay_${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            monthRef: monthVal,
            amount: amountVal,
            status: statusVal,
            attachmentName: "",
            attachmentSrc: ""
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                newPayment.attachmentName = file.name;
                newPayment.attachmentSrc = event.target.result;

                data.payments.push(newPayment);
                saveDb();
                alert("Cobrança lançada!");
                renderDrawerPayments();
            };
            reader.readAsDataURL(file);
        } else {
            data.payments.push(newPayment);
            saveDb();
            alert("Cobrança lançada!");
            renderDrawerPayments();
        }
    }
});

// Coach mobile student measurements form submit listener
document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "coach-mob-measurements-form") {
        e.preventDefault();
        const data = db.studentData[activeDrawerStudentId];

        const newMeasure = {
            date: new Date().toISOString().split("T")[0],
            weight: parseFloat(document.getElementById("coach-mob-metric-weight").value),
            bf: parseFloat(document.getElementById("coach-mob-metric-bf").value),
            waist: parseFloat(document.getElementById("coach-mob-metric-waist").value),
            arms: parseFloat(document.getElementById("coach-mob-metric-arms").value),
            legs: 0, chest: 0 // mobile defaults
        };

        data.measurements.push(newMeasure);
        saveDb();

        e.target.reset();
        renderDrawerEvolution();
        spawnSparks(width / 2, height / 2, 10);
        alert("Novas medidas salvas!");
    }
});

