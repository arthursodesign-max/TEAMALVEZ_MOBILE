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
let currentUser = null; // Currently logged in user object
let activeDay = "segunda"; // Selected workout tab
let coachListViewMode = "active"; // "active" | "archived" | "trash"

function initDb() {
    const savedDb = localStorage.getItem("team_alves_db");
    if (savedDb) {
        try {
            db = JSON.parse(savedDb);
        } catch (e) {
            console.error("Erro ao ler banco de dados, resetando...", e);
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
// 2. CANVAS LIGHTNING ENGINE
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

class Lightning {
    constructor(startX, startY, endX, endY, isTaskStrike = false) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.isTaskStrike = isTaskStrike;
        this.points = [];
        this.opacity = 1;
        this.decay = isTaskStrike ? 0.04 : 0.07;
        this.generatePath();
    }

    generatePath() {
        this.points = [];
        let steps = 15;
        let diffX = this.endX - this.startX;
        let diffY = this.endY - this.startY;

        for (let i = 0; i <= steps; i++) {
            let t = i / steps;
            let px = this.startX + diffX * t;
            let py = this.startY + diffY * t;

            if (i > 0 && i < steps) {
                let offset = (Math.random() - 0.5) * (this.isTaskStrike ? 30 : 60) * (1 - Math.abs(t - 0.5) * 0.8);
                px += offset;
            }
            this.points.push({ x: px, y: py });
        }
    }

    draw() {
        if (this.opacity <= 0) return;

        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.shadowColor = this.isTaskStrike ? "rgba(0, 230, 118, 0.8)" : "rgba(255, 215, 0, 0.8)";
        ctx.lineJoin = "round";

        // Draw outer glow (thick)
        ctx.lineWidth = this.isTaskStrike ? 8 : 12;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = this.isTaskStrike ? `rgba(0, 230, 118, ${this.opacity * 0.2})` : `rgba(255, 172, 28, ${this.opacity * 0.25})`;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();

        // Draw middle glow
        ctx.lineWidth = this.isTaskStrike ? 4 : 6;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = this.isTaskStrike ? `rgba(0, 230, 118, ${this.opacity * 0.6})` : `rgba(255, 215, 0, ${this.opacity * 0.75})`;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();

        // Draw white core
        ctx.lineWidth = 1.5;
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

class Spark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = -Math.random() * 2 - 0.5;
        this.size = Math.random() * 2.5 + 1;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.fillStyle = `rgba(255, 215, 0, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function spawnSparks(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
        ambientSparks.push(new Spark(x, y));
    }
}

function triggerLightningStrike(x = null, y = null) {
    let startX = x !== null ? x + (Math.random() - 0.5) * 200 : Math.random() * width;
    let startY = -10;
    let endX = x !== null ? x : Math.random() * width;
    let endY = y !== null ? y : height * 0.7 + Math.random() * (height * 0.3);

    lightningBolts.push(new Lightning(startX, startY, endX, endY, x !== null && y !== null));
    
    if (x !== null && y !== null) {
        spawnSparks(endX, endY, 15);
    }
}

let mouseX = 0, mouseY = 0, mouseInside = false;
window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseInside = true;
    if (Math.random() < 0.15) {
        ambientSparks.push(new Spark(mouseX, mouseY));
    }
});

window.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "SELECT" && !e.target.closest("button") && !e.target.closest(".sidebar") && !e.target.closest(".modal-card")) {
        triggerLightningStrike(e.clientX, e.clientY);
    }
});

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

    let strikeChance = isBoostMode ? 0.08 : 0.005;
    if (Math.random() < strikeChance) {
        triggerLightningStrike();
    }

    requestAnimationFrame(animate);
}
animate();

// ==========================================
// 3. LOGIN & AUTHENTICATION ROUTER
// ==========================================

const loginForm = document.getElementById("login-form");
const loginWrapper = document.getElementById("login-wrapper");
const dashboardWrapper = document.getElementById("dashboard-wrapper");
const coachWrapper = document.getElementById("coach-wrapper");
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
            
            // Clear input fields
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";

            if (user.role === "coach") {
                coachWrapper.classList.remove("hidden");
                initCoachDashboard();
            } else {
                dashboardWrapper.classList.remove("hidden");
                initStudentDashboard();
            }

            triggerLightningStrike(width / 2, height / 2);
            setTimeout(() => {
                flashOverlay.style.opacity = "0";
            }, 150);
        }, 300);
    } else {
        alert("Credenciais incorretas! Tente novamente.");
    }
});

// Logout Student
document.getElementById("student-logout-btn").addEventListener("click", () => logoutUser());
// Logout Coach
document.getElementById("coach-logout-btn").addEventListener("click", () => logoutUser());

function logoutUser() {
    flashOverlay.style.opacity = "1";
    setTimeout(() => {
        currentUser = null;
        sessionStorage.removeItem("team_alves_user");
        dashboardWrapper.classList.add("hidden");
        coachWrapper.classList.add("hidden");
        loginWrapper.classList.remove("hidden");
        
        // Disable boost
        document.body.classList.remove("boost-active");
        isBoostMode = false;
        hasShownRadianteToday = false;

        setTimeout(() => {
            flashOverlay.style.opacity = "0";
        }, 150);
    }, 300);
}

// Auto-Login Session Check on Page Load
window.addEventListener("load", () => {
    initDb();
    const activeSession = sessionStorage.getItem("team_alves_user");
    if (activeSession) {
        currentUser = JSON.parse(activeSession);
        loginWrapper.classList.add("hidden");
        if (currentUser.role === "coach") {
            coachWrapper.classList.remove("hidden");
            initCoachDashboard();
        } else {
            dashboardWrapper.classList.remove("hidden");
            initStudentDashboard();
        }
    }
});

// ==========================================
// 4. STUDENT DASHBOARD CONTROLLER
// ==========================================

function initStudentDashboard() {
    activeDay = "segunda";
    
    // Set Navigation active
    document.getElementById("nav-student-dashboard").classList.add("active");
    document.getElementById("nav-student-evolution").classList.remove("active");
    document.getElementById("nav-student-payments").classList.remove("active");
    document.getElementById("student-dashboard-view").classList.remove("hidden");
    document.getElementById("student-evolution-view").classList.add("hidden");
    document.getElementById("student-payments-view").classList.add("hidden");

    // Display student name and stats
    document.getElementById("student-display-name").innerText = currentUser.name;
    document.getElementById("student-display-meta").innerText = `Altura: ${currentUser.height}cm | Idade: ${currentUser.age}`;
    document.getElementById("welcome-athlete-name").innerText = currentUser.name.split(" ")[0];

    updateDateDisplay("date-display");
    setupStudentTabs();
    renderStudentWorkout();
    renderStudentDiet();
    calculateStudentEnergy();
}

function updateDateDisplay(elementId) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const todayStr = new Date().toLocaleDateString('pt-BR', options);
    document.getElementById(elementId).innerText = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);
}

// Student Tab navigation handlers
function setupStudentTabs() {
    // Day tabs switcher
    const dayTabs = document.querySelectorAll(".tab-btn");
    dayTabs.forEach(tab => {
        tab.classList.remove("active");
        if (tab.dataset.day === activeDay) tab.classList.add("active");
        
        tab.onclick = () => {
            dayTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeDay = tab.dataset.day;
            renderStudentWorkout();
            renderStudentDiet();
            calculateStudentEnergy();
        };
    });

    // Subviews switches (Treino/Dieta vs Evolução vs Pagamentos)
    document.getElementById("nav-student-dashboard").onclick = () => {
        document.getElementById("nav-student-dashboard").classList.add("active");
        document.getElementById("nav-student-evolution").classList.remove("active");
        document.getElementById("nav-student-payments").classList.remove("active");
        document.getElementById("student-dashboard-view").classList.remove("hidden");
        document.getElementById("student-evolution-view").classList.add("hidden");
        document.getElementById("student-payments-view").classList.add("hidden");
    };

    document.getElementById("nav-student-evolution").onclick = () => {
        document.getElementById("nav-student-dashboard").classList.remove("active");
        document.getElementById("nav-student-evolution").classList.add("active");
        document.getElementById("nav-student-payments").classList.remove("active");
        document.getElementById("student-dashboard-view").classList.add("hidden");
        document.getElementById("student-evolution-view").classList.remove("hidden");
        document.getElementById("student-payments-view").classList.add("hidden");
        renderStudentEvolution();
    };

    document.getElementById("nav-student-payments").onclick = () => {
        document.getElementById("nav-student-dashboard").classList.remove("active");
        document.getElementById("nav-student-evolution").classList.remove("active");
        document.getElementById("nav-student-payments").classList.add("active");
        document.getElementById("student-dashboard-view").classList.add("hidden");
        document.getElementById("student-evolution-view").classList.add("hidden");
        document.getElementById("student-payments-view").classList.remove("hidden");
        renderStudentPayments();
    };
}

function renderStudentWorkout() {
    const data = db.studentData[currentUser.id];
    const workoutData = data.workout[activeDay];
    
    document.getElementById("workout-day-name").innerText = workoutData.name;
    document.getElementById("workout-focus-badge").innerText = workoutData.focus;

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
            <button class="check-btn" onclick="toggleStudentExercise('${ex.id}', this, event)">
                <i class="fa-solid ${isCompleted ? 'fa-square-check' : 'fa-square'}"></i>
                <span>${isCompleted ? 'Objetivo Concluído' : 'Marcar Concluído'}</span>
            </button>
        `;
        listContainer.appendChild(card);
    });

    document.getElementById("workout-count").innerText = `${dayCompletedCount}/${workoutData.exercises.length}`;
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
            <div class="meal-header">
                <div class="meal-title-wrapper">
                    <span class="meal-time-badge">${meal.time}</span>
                    <span class="meal-title">${meal.name}</span>
                </div>
            </div>
            <ul class="meal-details-list">
                ${itemsLi}
            </ul>
            <button class="check-btn" onclick="toggleStudentMeal('${meal.id}', this, event)">
                <i class="fa-solid ${isCompleted ? 'fa-square-check' : 'fa-square'}"></i>
                <span>${isCompleted ? 'Refeição Feita' : 'Marcar Refeição'}</span>
            </button>
        `;
        dietContainer.appendChild(card);
    });

    document.getElementById("diet-count").innerText = `${dietCompletedCount}/${data.diet.length}`;
}

window.toggleStudentExercise = function(exId, btn, event) {
    const data = db.studentData[currentUser.id];
    const stateKey = `${activeDay}_${exId}`;
    const card = document.getElementById(`card-${stateKey}`);
    const isCompleted = !data.completions[stateKey];

    data.completions[stateKey] = isCompleted;
    saveDb();

    if (isCompleted) {
        card.classList.add("completed");
        btn.innerHTML = `<i class="fa-solid fa-square-check"></i> <span>Objetivo Concluído</span>`;
        const rect = btn.getBoundingClientRect();
        triggerLightningStrike(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
        card.classList.remove("completed");
        btn.innerHTML = `<i class="fa-solid fa-square"></i> <span>Marcar Concluído</span>`;
    }

    // Refresh count
    const workoutData = data.workout[activeDay];
    let completedCount = 0;
    workoutData.exercises.forEach(ex => {
        if (data.completions[`${activeDay}_${ex.id}`]) completedCount++;
    });
    document.getElementById("workout-count").innerText = `${completedCount}/${workoutData.exercises.length}`;

    calculateStudentEnergy();
};

window.toggleStudentMeal = function(mealId, btn, event) {
    const data = db.studentData[currentUser.id];
    const stateKey = `${activeDay}_${mealId}`;
    const card = document.getElementById(`card-diet-${stateKey}`);
    const isCompleted = !data.completions[stateKey];

    data.completions[stateKey] = isCompleted;
    saveDb();

    if (isCompleted) {
        card.classList.add("completed");
        btn.innerHTML = `<i class="fa-solid fa-square-check"></i> <span>Refeição Feita</span>`;
        const rect = btn.getBoundingClientRect();
        triggerLightningStrike(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
        card.classList.remove("completed");
        btn.innerHTML = `<i class="fa-solid fa-square"></i> <span>Marcar Refeição</span>`;
    }

    // Refresh count
    let completedCount = 0;
    data.diet.forEach(m => {
        if (data.completions[`${activeDay}_${m.id}`]) completedCount++;
    });
    document.getElementById("diet-count").innerText = `${completedCount}/${data.diet.length}`;

    calculateStudentEnergy();
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

    // Update UI Progress Bar
    const fill = document.getElementById("energy-bar-fill");
    fill.style.width = `${pct}%`;
    document.getElementById("energy-percentage").innerText = `${pct}%`;

    let msg = "";
    if (pct === 0) {
        msg = "Sem carga. Inicie as tarefas!";
    } else if (pct < 35) {
        msg = "Carga inicial carregando... ⚡";
    } else if (pct < 70) {
        msg = "Carga média! Foco total! ⚡";
    } else if (pct < 100) {
        msg = "Quase 100%! Energia alta! 🔥";
    } else {
        msg = "FORÇA TOTAL! 100% CARREGADO! ⚡🔥";
        document.body.classList.add("boost-active");
        isBoostMode = true;
        
        if (!hasShownRadianteToday) {
            hasShownRadianteToday = true;
            
            // Shake screen
            const wrapper = document.getElementById("dashboard-wrapper");
            wrapper.classList.add("shake-screen");
            setTimeout(() => wrapper.classList.remove("shake-screen"), 600);

            // Show Radiante Overlay
            const overlay = document.getElementById("radiante-overlay");
            overlay.classList.remove("hidden");
            overlay.style.opacity = "1";

            // Spawns lightning bolts
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    triggerLightningStrike(Math.random() * width, Math.random() * height);
                }, i * 120);
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
    }, 500);
};

// Reset Button Student
document.getElementById("reset-progress-btn").addEventListener("click", () => {
    if (confirm("Resetar todo o progresso de treino e dieta de hoje?")) {
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
        spawnSparks(width / 2, height / 2, 20);
    }
});

// ==========================================
// 5. STUDENT EVOLUTION SUBVIEW
// ==========================================

function renderStudentEvolution() {
    const data = db.studentData[currentUser.id];
    
    // 1. Render Metrics Table
    const tableBody = document.getElementById("student-metrics-table-body");
    tableBody.innerHTML = "";

    // Show from newest to oldest
    const sortedMeasures = [...data.measurements].reverse();

    sortedMeasures.forEach((m) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formatDate(m.date)}</td>
            <td><strong>${m.weight} kg</strong></td>
            <td>${m.bf}%</td>
            <td>${m.waist} cm</td>
            <td>${m.arms} cm</td>
            <td>${m.legs} cm</td>
        `;
        tableBody.appendChild(row);
    });

    // 2. Render Photos Gallery
    renderPhotosGallery(data.photos, "student-photos-gallery", true);
}

function formatDate(dateStr) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

function renderPhotosGallery(photosList, containerId, allowDelete) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (photosList.length === 0) {
        container.innerHTML = `<p style="grid-column: span 2; color: var(--text-muted); text-align: center; padding: 40px 0;">Nenhuma foto cadastrada ainda.</p>`;
        return;
    }

    photosList.forEach((photo, idx) => {
        const card = document.createElement("div");
        card.className = "photo-card";
        card.innerHTML = `
            <img src="${photo.src}" alt="Evolução">
            <span class="photo-card-date">${formatDate(photo.date)}</span>
            ${allowDelete ? `<button class="photo-delete-btn" onclick="deleteStudentPhoto(${idx})"><i class="fa-solid fa-trash"></i></button>` : ''}
        `;
        container.appendChild(card);
    });
}

// Record new measurements
const measurementsForm = document.getElementById("measurements-form");
measurementsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = db.studentData[currentUser.id];

    const newMeasure = {
        date: new Date().toISOString().split("T")[0],
        weight: parseFloat(document.getElementById("metric-weight").value),
        bf: parseFloat(document.getElementById("metric-bf").value),
        chest: parseFloat(document.getElementById("metric-chest").value),
        waist: parseFloat(document.getElementById("metric-waist").value),
        arms: parseFloat(document.getElementById("metric-arms").value),
        legs: parseFloat(document.getElementById("metric-legs").value)
    };

    data.measurements.push(newMeasure);
    saveDb();
    
    // Clear inputs
    measurementsForm.reset();
    
    renderStudentEvolution();
    spawnSparks(width / 2, height / 2, 15);
    alert("Avaliação registrada com sucesso!");
});

// File Photo Upload
const photoFileInput = document.getElementById("photo-file-input");
photoFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione um arquivo de imagem válido.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const data = db.studentData[currentUser.id];
        const base64Img = event.target.result;

        data.photos.push({
            date: new Date().toISOString().split("T")[0],
            src: base64Img
        });

        saveDb();
        renderStudentEvolution();
        spawnSparks(width / 2, height / 2, 15);
    };
    reader.readAsDataURL(file);
});

window.deleteStudentPhoto = function(index) {
    if (confirm("Deseja realmente excluir esta foto?")) {
        const data = db.studentData[currentUser.id];
        data.photos.splice(index, 1);
        saveDb();
        renderStudentEvolution();
    }
};

// ==========================================
// 5.5 STUDENT PAYMENTS SUBVIEW
// ==========================================

window.renderStudentPayments = function() {
    const data = db.studentData[currentUser.id];
    
    // 1. Render Basic Config
    document.getElementById("student-fee-value").innerText = `R$ ${parseFloat(data.monthlyFee || 150).toFixed(2).replace('.', ',')}`;
    document.getElementById("student-pix-key").innerText = data.pixKey || "pix@teamalves.com.br";
    document.getElementById("student-bank-details").innerText = data.bankDetails || "Banco Itaú - Ag 1234 - CC 56789-0";

    // 2. Render Virtual Card Details
    const cardForm = document.getElementById("card-form-wrapper");
    const cardDisplay = document.getElementById("card-registered-display");
    
    if (data.cardDetails) {
        cardForm.classList.add("hidden");
        cardDisplay.classList.remove("hidden");
        
        // Mask card number
        const rawNum = data.cardDetails.cardNumber.replace(/\s/g, '');
        const last4 = rawNum.slice(-4);
        document.getElementById("registered-card-number").innerText = `**** **** **** ${last4}`;
        document.getElementById("registered-card-holder").innerText = data.cardDetails.holderName;
        document.getElementById("registered-card-expiry").innerText = data.cardDetails.expiryDate;
    } else {
        cardForm.classList.remove("hidden");
        cardDisplay.classList.add("hidden");
        document.getElementById("credit-card-form").reset();
    }

    // 3. Render Payments History Table
    const tableBody = document.getElementById("student-payments-table-body");
    tableBody.innerHTML = "";

    const sortedPayments = [...(data.payments || [])].reverse();
    
    sortedPayments.forEach((pay) => {
        const row = document.createElement("tr");
        
        // Status Badge HTML
        const statusClass = pay.status.toLowerCase() === 'pago' ? 'pago' : 'pendente';
        const badgeHTML = `<span class="status-badge ${statusClass}">${pay.status}</span>`;

        // Proof View Button HTML
        let proofHTML = `<span style="color:var(--text-muted); font-size:0.75rem;">Sem anexo</span>`;
        if (pay.attachmentSrc) {
            proofHTML = `<button class="btn-view-proof" onclick="viewPaymentAttachment('${currentUser.id}', '${pay.id}')">
                            <i class="fa-solid fa-receipt"></i> Ver Recibo
                         </button>`;
        }

        row.innerHTML = `
            <td><strong>${pay.monthRef}</strong></td>
            <td>R$ ${parseFloat(pay.amount).toFixed(2).replace('.', ',')}</td>
            <td>${badgeHTML}</td>
            <td>${proofHTML}</td>
        `;
        tableBody.appendChild(row);
    });

    // 4. Update Current Month Payment Status Box
    const statusCard = document.getElementById("payment-status-card");
    const statusTitle = document.getElementById("payment-status-title");
    const statusDesc = document.getElementById("payment-status-desc");

    // Check if there is any pending payment
    const pendingPay = (data.payments || []).find(p => p.status.toLowerCase() === 'pendente');
    
    if (pendingPay) {
        statusCard.className = "payment-status-alert";
        statusTitle.innerText = `Status: Pendente (${pendingPay.monthRef})`;
        statusDesc.innerText = `Aguardando pagamento no valor de R$ ${parseFloat(pendingPay.amount).toFixed(2).replace('.', ',')}. Use PIX ou cadastre seu cartão acima.`;
    } else {
        statusCard.className = "payment-status-alert paid";
        statusTitle.innerText = "Status: Regularizado 🟢";
        statusDesc.innerText = "Todas as suas mensalidades registradas estão pagas. Bom treino!";
    }

    // 5. Populate Upload Selector with Pending Months
    const monthSelect = document.getElementById("proof-month-select");
    monthSelect.innerHTML = "";

    const pendingMonths = (data.payments || []).filter(p => p.status.toLowerCase() === 'pendente');
    
    if (pendingMonths.length === 0) {
        monthSelect.innerHTML = `<option value="">Nenhuma cobrança pendente</option>`;
    } else {
        pendingMonths.forEach((p) => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.innerText = `${p.monthRef} - R$ ${parseFloat(p.amount).toFixed(2).replace('.', ',')}`;
            monthSelect.appendChild(opt);
        });
    }
};

window.copyPixKey = function() {
    const key = document.getElementById("student-pix-key").innerText;
    navigator.clipboard.writeText(key).then(() => {
        alert("Chave Pix copiada com sucesso!");
    }).catch(err => {
        console.error("Erro ao copiar: ", err);
        alert("Chave Pix: " + key);
    });
};

// Credit card registration listener
document.getElementById("credit-card-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = db.studentData[currentUser.id];

    data.cardDetails = {
        cardNumber: document.getElementById("card-num").value.trim(),
        holderName: document.getElementById("card-name").value.trim(),
        expiryDate: document.getElementById("card-expiry").value.trim(),
        cvv: document.getElementById("card-cvv").value.trim()
    };

    const pendingPayIndex = (data.payments || []).findIndex(p => p.status.toLowerCase() === 'pendente');
    if (pendingPayIndex !== -1) {
        data.payments[pendingPayIndex].status = "Pago";
        data.payments[pendingPayIndex].date = new Date().toISOString().split("T")[0];
        alert("Cartão cadastrado! A mensalidade pendente foi debitada automaticamente.");
    } else {
        alert("Cartão de crédito cadastrado com sucesso para cobranças recorrentes!");
    }

    saveDb();
    renderStudentPayments();
    spawnSparks(width / 2, height / 2, 20);
});

window.deleteStudentCard = function() {
    if (confirm("Tem certeza que deseja remover o cartão de crédito cadastrado?")) {
        const data = db.studentData[currentUser.id];
        data.cardDetails = null;
        saveDb();
        renderStudentPayments();
    }
};

// Proof Upload
const proofFileInput = document.getElementById("proof-file-input");
proofFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const paymentId = document.getElementById("proof-month-select").value;

    if (!paymentId) {
        alert("Por favor, certifique-se de que há uma mensalidade pendente selecionada.");
        return;
    }
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione um arquivo de imagem válido (JPEG/PNG).");
        return;
    }

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
            renderStudentPayments();
            spawnSparks(width / 2, height / 2, 20);
            alert("Comprovante enviado com sucesso! Mensalidade marcada como paga.");
        }
    };
    reader.readAsDataURL(file);
});

// Attachment Viewer
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
    overlay.style.backgroundColor = "rgba(0,0,0,0.85)";
    overlay.style.zIndex = "20000";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.onclick = () => document.body.removeChild(overlay);

    const img = document.createElement("img");
    img.src = payment.attachmentSrc;
    img.style.maxWidth = "90%";
    img.style.maxHeight = "80%";
    img.style.border = "2px solid var(--gold)";
    img.style.borderRadius = "8px";
    img.style.boxShadow = "0 0 25px rgba(255,215,0,0.3)";

    const title = document.createElement("h3");
    title.innerText = `Comprovante - ${payment.monthRef}`;
    title.style.color = "var(--gold)";
    title.style.marginBottom = "15px";
    title.style.fontFamily = "Orbitron";

    const closeTxt = document.createElement("p");
    closeTxt.innerText = "Clique em qualquer lugar para fechar";
    closeTxt.style.color = "var(--text-secondary)";
    closeTxt.style.marginTop = "15px";
    closeTxt.style.fontSize = "0.8rem";

    overlay.appendChild(title);
    overlay.appendChild(img);
    overlay.appendChild(closeTxt);
    document.body.appendChild(overlay);
};

// ==========================================
// 6. COACH PORTAL CONTROLLER
// ==========================================

let activeInspectedStudentId = null;

function initCoachDashboard() {
    updateDateDisplay("coach-date-display");
    document.getElementById("nav-coach-students").classList.add("active");
    const archivedBtn = document.getElementById("nav-coach-archived");
    if (archivedBtn) archivedBtn.classList.remove("active");
    const trashBtn = document.getElementById("nav-coach-trash");
    if (trashBtn) trashBtn.classList.remove("active");
    coachListViewMode = "active";
    backToStudentsList();
    renderCoachStudentsList();
}

function renderCoachStudentsList() {
    const grid = document.getElementById("coach-students-grid");
    grid.innerHTML = "";

    const titleEl = document.getElementById("coach-section-title");
    if (titleEl) {
        if (coachListViewMode === "active") {
            titleEl.innerHTML = `<i class="fa-solid fa-users text-gold"></i> Meus Alunos`;
        } else if (coachListViewMode === "archived") {
            titleEl.innerHTML = `<i class="fa-solid fa-box-archive text-gold"></i> Alunos Arquivados`;
        } else if (coachListViewMode === "trash") {
            titleEl.innerHTML = `<i class="fa-solid fa-trash-can text-gold"></i> Lixeira de Alunos`;
        }
    }

    const students = db.users.filter(u => u.role === "student");

    students.forEach((student) => {
        const data = db.studentData[student.id];
        if (!data) return;

        // Apply filters based on view mode
        if (coachListViewMode === "active") {
            if (data.isArchived || data.isDeleted) return;
        } else if (coachListViewMode === "archived") {
            if (!data.isArchived || data.isDeleted) return;
        } else if (coachListViewMode === "trash") {
            if (!data.isDeleted) return;
        }

        const workoutData = data.workout[activeDay];
        
        // Calculate student's progress today
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

        // Get latest weight record
        const latestWeight = data.measurements.length > 0 ? `${data.measurements[data.measurements.length-1].weight} kg` : "N/D";
        const latestBf = data.measurements.length > 0 ? `${data.measurements[data.measurements.length-1].bf}%` : "N/D";

        const card = document.createElement("div");
        card.className = "student-card glass-panel";
        
        // If not in trash, allow inspecting the student by clicking the card
        if (coachListViewMode !== "trash") {
            card.onclick = (e) => {
                if (e.target.closest("button")) return; // Don't inspect if an action button was clicked
                inspectStudent(student.id);
            };
            card.style.cursor = "pointer";
        } else {
            card.style.cursor = "default";
        }

        let actionsHTML = "";
        if (coachListViewMode === "active") {
            actionsHTML = `
                <div class="student-card-actions">
                    <button class="student-card-btn card-action-btn" onclick="inspectStudent('${student.id}')">AVALIAR ATLETA</button>
                    <button class="btn-secondary card-icon-btn" onclick="event.stopPropagation(); archiveStudent('${student.id}')" title="Arquivar Aluno">
                        <i class="fa-solid fa-box-archive"></i>
                    </button>
                    <button class="btn-danger card-icon-btn" onclick="event.stopPropagation(); deleteStudent('${student.id}')" title="Mover para Lixeira">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
        } else if (coachListViewMode === "archived") {
            actionsHTML = `
                <div class="student-card-actions">
                    <button class="student-card-btn card-action-btn" onclick="inspectStudent('${student.id}')">AVALIAR ATLETA</button>
                    <button class="btn-secondary card-icon-btn" onclick="event.stopPropagation(); unarchiveStudent('${student.id}')" title="Desarquivar Aluno">
                        <i class="fa-solid fa-box-open"></i>
                    </button>
                    <button class="btn-danger card-icon-btn" onclick="event.stopPropagation(); deleteStudent('${student.id}')" title="Mover para Lixeira">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
        } else if (coachListViewMode === "trash") {
            actionsHTML = `
                <div class="student-card-actions split">
                    <button class="btn-success card-action-btn" onclick="event.stopPropagation(); restoreStudent('${student.id}')" title="Restaurar Aluno">
                        <i class="fa-solid fa-trash-arrow-up"></i> RESTAURAR
                    </button>
                    <button class="btn-danger card-action-btn" onclick="event.stopPropagation(); destroyStudentPermanently('${student.id}')" title="Excluir Definitivamente">
                        <i class="fa-solid fa-circle-xmark"></i> EXCLUIR DEFINITIVO
                    </button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="student-card-header">
                <div class="student-card-avatar"><i class="fa-solid fa-user-ninja"></i></div>
                <div class="student-card-info">
                    <h3>${student.name}</h3>
                    <span>Peso: ${latestWeight} | BF: ${latestBf}</span>
                </div>
            </div>
            <div class="student-card-progress">
                <div class="student-card-progress-label">
                    <span>Carga de Hoje</span>
                    <span>${pct}%</span>
                </div>
                <div class="student-card-progress-bar">
                    <div class="student-card-progress-fill" style="width: ${pct}%"></div>
                </div>
            </div>
            ${actionsHTML}
        `;
        grid.appendChild(card);
    });
}

function backToStudentsList() {
    document.getElementById("coach-students-list-view").classList.remove("hidden");
    document.getElementById("coach-student-inspector-view").classList.add("hidden");
    activeInspectedStudentId = null;
    renderCoachStudentsList();
}

function inspectStudent(studentId) {
    activeInspectedStudentId = studentId;
    
    document.getElementById("coach-students-list-view").classList.add("hidden");
    document.getElementById("coach-student-inspector-view").classList.remove("hidden");

    const studentUser = db.users.find(u => u.id === studentId);
    const data = db.studentData[studentId];

    document.getElementById("inspector-student-name").innerText = studentUser.name;
    document.getElementById("inspector-student-meta").innerText = `Idade: ${studentUser.age} anos | Altura: ${studentUser.height}cm`;

    // Configure quick actions in inspector header
    const quickArchiveBtn = document.getElementById("btn-quick-archive");
    const quickTrashBtn = document.getElementById("btn-quick-trash");
    
    if (quickArchiveBtn) {
        if (data && data.isArchived) {
            quickArchiveBtn.innerHTML = `<i class="fa-solid fa-box-open"></i> <span id="text-quick-archive">Desarquivar</span>`;
            quickArchiveBtn.onclick = () => {
                unarchiveStudent(studentId);
                inspectStudent(studentId);
            };
        } else {
            quickArchiveBtn.innerHTML = `<i class="fa-solid fa-box-archive"></i> <span id="text-quick-archive">Arquivar</span>`;
            quickArchiveBtn.onclick = () => {
                archiveStudent(studentId);
                inspectStudent(studentId);
            };
        }
    }
    
    if (quickTrashBtn) {
        quickTrashBtn.onclick = () => {
            if (confirm(`Deseja mover ${studentUser.name} para a lixeira?`)) {
                deleteStudent(studentId);
                backToStudentsList();
            }
        };
    }

    // Render inspector tab
    switchInspectorTab("evolution");
}

window.switchInspectorTab = function(tabName) {
    const evalBtn = document.getElementById("btn-inspect-evolution");
    const prescBtn = document.getElementById("btn-inspect-prescribe");
    const payBtn = document.getElementById("btn-inspect-payments");
    const evalTab = document.getElementById("inspector-tab-evolution");
    const prescTab = document.getElementById("inspector-tab-prescribe");
    const payTab = document.getElementById("inspector-tab-payments");

    evalBtn.classList.remove("active");
    prescBtn.classList.remove("active");
    payBtn.classList.remove("active");
    evalTab.classList.add("hidden");
    prescTab.classList.add("hidden");
    payTab.classList.add("hidden");

    if (tabName === "evolution") {
        evalBtn.classList.add("active");
        evalTab.classList.remove("hidden");
        renderInspectorEvolution();
    } else if (tabName === "prescribe") {
        prescBtn.classList.add("active");
        prescTab.classList.remove("hidden");
        initPrescriptionPanel();
    } else if (tabName === "payments") {
        payBtn.classList.add("active");
        payTab.classList.remove("hidden");
        renderInspectorPayments();
    }
};

function renderInspectorEvolution() {
    const data = db.studentData[activeInspectedStudentId];
    
    // Render measures history
    const tbody = document.getElementById("inspector-metrics-table-body");
    tbody.innerHTML = "";

    const sortedMeasures = [...data.measurements].reverse();
    sortedMeasures.forEach((m) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formatDate(m.date)}</td>
            <td><strong>${m.weight} kg</strong></td>
            <td>${m.bf}%</td>
            <td>${m.waist} cm</td>
            <td>${m.arms} cm</td>
            <td>${m.legs} cm</td>
        `;
        tbody.appendChild(row);
    });

    // Render photo gallery (no delete permission for coach, or you can allow it - let's hide the button)
    renderPhotosGallery(data.photos, "inspector-photos-gallery", false);
}

// ==========================================
// 7. PRESCRIPTION ENGINE (PARSERS & COMPILERS)
// ==========================================

let activePrescriptionDay = "segunda";

function initPrescriptionPanel() {
    activePrescriptionDay = "segunda";
    document.getElementById("prescription-workout-day-select").value = activePrescriptionDay;
    loadPrescriptionWorkoutDay();
    loadPrescriptionDiet();
}

window.loadPrescriptionWorkoutDay = function() {
    activePrescriptionDay = document.getElementById("prescription-workout-day-select").value;
    const data = db.studentData[activeInspectedStudentId];
    const workoutData = data.workout[activePrescriptionDay];

    document.getElementById("prescription-workout-focus").value = workoutData.focus;

    // Convert exercises array to plain text string: "Name | details"
    const exercisesText = workoutData.exercises.map(ex => `${ex.name} | ${ex.details}`).join("\n");
    document.getElementById("prescription-workout-content").value = exercisesText;
};

window.savePrescribedWorkout = function() {
    const data = db.studentData[activeInspectedStudentId];
    const focusVal = document.getElementById("prescription-workout-focus").value.trim();
    const contentVal = document.getElementById("prescription-workout-content").value.trim();

    if (!focusVal) {
        alert("Por favor, preencha o foco do treino!");
        return;
    }

    const lines = contentVal.split("\n").filter(line => line.trim() !== "");
    const parsedExercises = [];

    // Parse text lines: "Supino | 4x10"
    for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].split("|");
        if (parts.length < 2) {
            alert(`Erro na linha ${i+1}: Use o separador '|' para dividir o Exercício das Séries/Reps.`);
            return;
        }
        parsedExercises.push({
            id: `ex_${Date.now()}_${i}`,
            name: parts[0].trim(),
            details: parts[1].trim()
        });
    }

    // Save
    data.workout[activePrescriptionDay].focus = focusVal;
    data.workout[activePrescriptionDay].exercises = parsedExercises;
    
    // Reset completions for this day so they can perform the new routine
    workoutDataResetCompletions(data, activePrescriptionDay);

    saveDb();
    alert("Treino prescrito e salvo com sucesso!");
    spawnSparks(width / 2, height / 2, 10);
};

function workoutDataResetCompletions(studentData, day) {
    // Remove completions matching this day
    Object.keys(studentData.completions).forEach(key => {
        if (key.startsWith(`${day}_`)) {
            delete studentData.completions[key];
        }
    });
}

function loadPrescriptionDiet() {
    const data = db.studentData[activeInspectedStudentId];
    
    // Compile diet list to textual representation
    // Format:
    // 07:30 | Café da Manhã
    // Alimento 1
    // Alimento 2
    // ---
    // 12:00 | Almoço
    // Alimento 3
    const dietText = data.diet.map(meal => {
        const header = `${meal.time} | ${meal.name}`;
        const items = meal.items.join("\n");
        return `${header}\n${items}`;
    }).join("\n---\n");

    document.getElementById("prescription-diet-content").value = dietText;
}

window.savePrescribedDiet = function() {
    const data = db.studentData[activeInspectedStudentId];
    const contentVal = document.getElementById("prescription-diet-content").value.trim();

    if (!contentVal) {
        alert("O plano alimentar não pode estar vazio!");
        return;
    }

    const mealBlocks = contentVal.split("---");
    const parsedDiet = [];

    for (let i = 0; i < mealBlocks.length; i++) {
        const lines = mealBlocks[i].split("\n").map(l => l.trim()).filter(l => l !== "");
        if (lines.length === 0) continue;

        const headerLine = lines[0];
        const headerParts = headerLine.split("|");
        if (headerParts.length < 2) {
            alert(`Erro no bloco ${i+1}: A primeira linha deve conter o horário e o nome separados por '|' (ex: 07:30 | Café da Manhã)`);
            return;
        }

        const mealItems = lines.slice(1);
        if (mealItems.length === 0) {
            alert(`Erro no bloco ${i+1}: Adicione pelo menos um item alimentar abaixo da primeira linha.`);
            return;
        }

        parsedDiet.push({
            id: `d_${Date.now()}_${i}`,
            time: headerParts[0].trim(),
            name: headerParts[1].trim(),
            items: mealItems
        });
    }

    // Save
    data.diet = parsedDiet;
    
    // Reset diet completions for all days
    Object.keys(data.completions).forEach(key => {
        if (key.includes("_d")) {
            delete data.completions[key];
        }
    });

    saveDb();
    alert("Plano alimentar prescrito e salvo com sucesso!");
    spawnSparks(width / 2, height / 2, 10);
};

// ==========================================
// 8. ADD/REGISTER STUDENT SYSTEM
// ==========================================

const registerModal = document.getElementById("register-modal");
const registerForm = document.getElementById("register-student-form");

document.getElementById("open-register-modal-btn").onclick = () => {
    registerModal.classList.remove("hidden");
};

window.closeRegisterModal = function() {
    registerModal.classList.add("hidden");
    registerForm.reset();
};

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const username = document.getElementById("reg-username").value.trim().toLowerCase();
    const password = document.getElementById("reg-password").value;
    const age = parseInt(document.getElementById("reg-age").value);
    const height = parseInt(document.getElementById("reg-height").value);

    // Validate unique username
    if (db.users.some(u => u.username === username)) {
        alert("Este usuário já está cadastrado!");
        return;
    }

    const studentId = `u_${username}_${Date.now()}`;

    // Add user account
    db.users.push({
        id: studentId,
        username,
        password,
        role: "student",
        name,
        age,
        height
    });

    // Initialize default templates
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
    alert(`Aluno ${name} cadastrado com sucesso!`);
    closeRegisterModal();
    renderCoachStudentsList();
    spawnSparks(width / 2, height / 2, 25);
});

// ==========================================
// 6.2 STUDENT MANAGEMENT ACTIONS (ARCHIVE & TRASH)
// ==========================================

window.archiveStudent = function(studentId) {
    const data = db.studentData[studentId];
    if (data) {
        data.isArchived = true;
        saveDb();
        renderCoachStudentsList();
        alert("Aluno arquivado com sucesso!");
    }
};

window.unarchiveStudent = function(studentId) {
    const data = db.studentData[studentId];
    if (data) {
        data.isArchived = false;
        saveDb();
        renderCoachStudentsList();
        alert("Aluno desarquivado com sucesso!");
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
        alert("Aluno restaurado com sucesso!");
    }
};

window.destroyStudentPermanently = function(studentId) {
    const studentUser = db.users.find(u => u.id === studentId);
    if (!studentUser) return;
    
    if (confirm(`Tem certeza que deseja excluir permanentemente o aluno ${studentUser.name}?\nEsta ação NÃO pode ser desfeita e apagará todas as fichas, dietas e histórico!`)) {
        if (confirm(`CONFIRMAÇÃO FINAL: Excluir permanentemente ${studentUser.name}?`)) {
            db.users = db.users.filter(u => u.id !== studentId);
            delete db.studentData[studentId];
            saveDb();
            renderCoachStudentsList();
            alert("Aluno excluído permanentemente do sistema!");
        }
    }
};

// Sidebar navigation handler for Coach view modes
document.addEventListener("click", (e) => {
    const target = e.target.closest("#nav-coach-students, #nav-coach-archived, #nav-coach-trash");
    if (!target) return;
    
    document.getElementById("nav-coach-students").classList.remove("active");
    const archivedBtn = document.getElementById("nav-coach-archived");
    if (archivedBtn) archivedBtn.classList.remove("active");
    const trashBtn = document.getElementById("nav-coach-trash");
    if (trashBtn) trashBtn.classList.remove("active");
    
    target.classList.add("active");
    
    if (target.id === "nav-coach-students") {
        coachListViewMode = "active";
    } else if (target.id === "nav-coach-archived") {
        coachListViewMode = "archived";
    } else if (target.id === "nav-coach-trash") {
        coachListViewMode = "trash";
    }
    backToStudentsList();
});

// ==========================================
// 6.5 COACH FINANCE & DIRECT METRICS EDITING
// ==========================================

window.renderInspectorPayments = function() {
    const data = db.studentData[activeInspectedStudentId];
    
    // Set config values
    document.getElementById("coach-student-fee").value = data.monthlyFee || 150;
    document.getElementById("coach-pix-key").value = data.pixKey || "pix@teamalves.com.br";
    document.getElementById("coach-bank-details").value = data.bankDetails || "Banco Itaú (341) - Agência: 1234 - Conta: 56789-0";

    // Set default value for amount input in billing form
    document.getElementById("coach-payment-amount").value = data.monthlyFee || 150;
    document.getElementById("coach-payment-month").value = "";
    document.getElementById("coach-payment-file").value = "";
    document.getElementById("coach-payment-file-label").innerText = "Selecionar Imagem";
    
    const tbody = document.getElementById("coach-payments-table-body");
    tbody.innerHTML = "";

    const sortedPayments = [...(data.payments || [])].reverse();

    if (sortedPayments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhuma cobrança registrada para este aluno.</td></tr>`;
        return;
    }

    sortedPayments.forEach((pay) => {
        const row = document.createElement("tr");

        const statusClass = pay.status.toLowerCase() === 'pago' ? 'pago' : 'pendente';
        const badgeHTML = `<span class="status-badge ${statusClass}">${pay.status}</span>`;

        let attachmentHTML = `<span style="color:var(--text-muted); font-size:0.75rem;">Sem anexo</span>`;
        if (pay.attachmentSrc) {
            attachmentHTML = `<button class="btn-view-proof" onclick="viewPaymentAttachment('${activeInspectedStudentId}', '${pay.id}')">
                                <i class="fa-solid fa-receipt"></i> Ver Anexo
                              </button>`;
        }

        row.innerHTML = `
            <td>${formatDate(pay.date || new Date().toISOString().split("T")[0])}</td>
            <td><strong>${pay.monthRef}</strong></td>
            <td>R$ ${parseFloat(pay.amount).toFixed(2).replace('.', ',')}</td>
            <td>${badgeHTML}</td>
            <td>${attachmentHTML}</td>
            <td>
                <button class="btn-secondary" onclick="toggleCoachPaymentStatus('${pay.id}')" style="width: auto; padding: 4px 8px; font-size: 0.72rem; margin-right: 6px; height: 26px;">
                    <i class="fa-solid fa-arrows-rotate"></i> Alternar
                </button>
                <button class="btn-danger" onclick="deleteCoachPaymentRecord('${pay.id}')" style="width: auto; padding: 4px 8px; font-size: 0.72rem; height: 26px;">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
};

window.saveCoachPaymentConfig = function() {
    const data = db.studentData[activeInspectedStudentId];
    data.monthlyFee = parseFloat(document.getElementById("coach-student-fee").value) || 150;
    data.pixKey = document.getElementById("coach-pix-key").value.trim();
    data.bankDetails = document.getElementById("coach-bank-details").value.trim();

    saveDb();
    alert("Configurações de faturamento salvas com sucesso!");
    renderInspectorPayments();
};

window.toggleCoachPaymentStatus = function(paymentId) {
    const data = db.studentData[activeInspectedStudentId];
    const payment = data.payments.find(p => p.id === paymentId);
    if (payment) {
        payment.status = payment.status === "Pago" ? "Pendente" : "Pago";
        if (payment.status === "Pago" && !payment.date) {
            payment.date = new Date().toISOString().split("T")[0];
        }
        saveDb();
        renderInspectorPayments();
    }
};

window.deleteCoachPaymentRecord = function(paymentId) {
    if (confirm("Deseja realmente excluir esta cobrança?")) {
        const data = db.studentData[activeInspectedStudentId];
        data.payments = data.payments.filter(p => p.id !== paymentId);
        saveDb();
        renderInspectorPayments();
    }
};

// Coach Payment file select change listener
document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "coach-payment-file") {
        const file = e.target.files[0];
        const label = document.getElementById("coach-payment-file-label");
        if (label) {
            label.innerText = file ? file.name : "Selecionar Imagem";
        }
    }
});

// Coach Payment Form submit listener
document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "coach-payment-form") {
        e.preventDefault();
        const data = db.studentData[activeInspectedStudentId];
        const monthVal = document.getElementById("coach-payment-month").value.trim();
        const amountVal = parseFloat(document.getElementById("coach-payment-amount").value) || 0;
        const statusVal = document.getElementById("coach-payment-status").value;
        const fileInput = document.getElementById("coach-payment-file");
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
                alert("Cobrança lançada com sucesso (com anexo)!");
                renderInspectorPayments();
            };
            reader.readAsDataURL(file);
        } else {
            data.payments.push(newPayment);
            saveDb();
            alert("Cobrança lançada com sucesso!");
            renderInspectorPayments();
        }
    }
});

// Coach Measurements Form submit listener
document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "coach-measurements-form") {
        e.preventDefault();
        const data = db.studentData[activeInspectedStudentId];

        const newMeasure = {
            date: new Date().toISOString().split("T")[0],
            weight: parseFloat(document.getElementById("coach-metric-weight").value),
            bf: parseFloat(document.getElementById("coach-metric-bf").value),
            chest: parseFloat(document.getElementById("coach-metric-chest").value),
            waist: parseFloat(document.getElementById("coach-metric-waist").value),
            arms: parseFloat(document.getElementById("coach-metric-arms").value),
            legs: parseFloat(document.getElementById("coach-metric-legs").value)
        };

        data.measurements.push(newMeasure);
        saveDb();

        e.target.reset();
        renderInspectorEvolution();
        spawnSparks(width / 2, height / 2, 15);
        alert("Medidas do aluno registradas com sucesso pelo treinador!");
    }
});

