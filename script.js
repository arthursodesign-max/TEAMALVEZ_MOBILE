// ==========================================
// 1. DATA STRUCTURES (WORKOUTS & DIET)
// ==========================================

const workouts = {
    segunda: {
        name: "Segunda-Feira",
        focus: "Peito e Tríceps",
        exercises: [
            { id: "s1", name: "Supino Reto Barra", details: "4 séries x 10 repetições" },
            { id: "s2", name: "Supino Inclinado Halteres", details: "3 séries x 12 repetições" },
            { id: "s3", name: "Crossover Polia Média", details: "4 séries x 12 repetições" },
            { id: "s4", name: "Tríceps Corda", details: "4 séries x 15 repetições" },
            { id: "s5", name: "Tríceps Testa H-Barra", details: "3 séries x 10 repetições" }
        ]
    },
    terca: {
        name: "Terça-Feira",
        focus: "Quadríceps e Panturrilha",
        exercises: [
            { id: "t1", name: "Agachamento Livre", details: "4 séries x 8 repetições" },
            { id: "t2", name: "Leg Press 45º", details: "4 séries x 12 repetições" },
            { id: "t3", name: "Cadeira Extensora", details: "3 séries x 15 repetições (Drop set)" },
            { id: "t4", name: "Gêmeos Sentado", details: "4 séries x 20 repetições" },
            { id: "t5", name: "Panturrilha em Pé Máquina", details: "4 séries x 15 repetições" }
        ]
    },
    quarta: {
        name: "Quarta-Feira",
        focus: "Costas e Bíceps",
        exercises: [
            { id: "q1", name: "Puxada Alta Frente", details: "4 séries x 12 repetições" },
            { id: "q2", name: "Remada Curvada Pronada", details: "4 séries x 10 repetições" },
            { id: "q3", name: "Pull Down Polia", details: "3 séries x 12 repetições" },
            { id: "q4", name: "Rosca Direta W-Barra", details: "4 séries x 10 repetições" },
            { id: "q5", name: "Rosca Alternada Halteres", details: "3 séries x 12 repetições" }
        ]
    },
    quinta: {
        name: "Quinta-Feira",
        focus: "Posterior de Coxa",
        exercises: [
            { id: "qi1", name: "Stiff Halteres", details: "4 séries x 10 repetições" },
            { id: "qi2", name: "Mesa Flexora", details: "4 séries x 12 repetições" },
            { id: "qi3", name: "Cadeira Flexora", details: "3 séries x 15 repetições" },
            { id: "qi4", name: "Elevação Pélvica Barra", details: "4 séries x 10 repetições" },
            { id: "qi5", name: "Cadeira Abdutora", details: "3 séries x 20 repetições" }
        ]
    },
    sexta: {
        name: "Sexta-Feira",
        focus: "Ombro e Peito",
        exercises: [
            { id: "sx1", name: "Desenvolvimento Militar Halteres", details: "4 séries x 10 repetições" },
            { id: "sx2", name: "Elevação Lateral Halteres", details: "4 séries x 15 repetições" },
            { id: "sx3", name: "Elevação Frontal Polia", details: "3 séries x 12 repetições" },
            { id: "sx4", name: "Crucifixo Inclinado Halteres", details: "3 séries x 12 repetições" },
            { id: "sx5", name: "Peck Deck Peitoral", details: "4 séries x 12 repetições" }
        ]
    },
    sabado: {
        name: "Sábado",
        focus: "Bíceps e Tríceps",
        exercises: [
            { id: "sa1", name: "Rosca Scott Máquina", details: "4 séries x 12 repetições" },
            { id: "sa2", name: "Rosca Concentrada Halter", details: "3 séries x 10 repetições" },
            { id: "sa3", name: "Tríceps Coice Halter", details: "3 séries x 12 repetições" },
            { id: "sa4", name: "Tríceps Francês Halter", details: "4 séries x 10 repetições" },
            { id: "sa5", name: "Flexão de Punho Barra", details: "3 séries x 15 repetições" }
        ]
    }
};

const diet = [
    { id: "d1", time: "07:00", name: "Café da Manhã", items: ["3 Ovos Inteiros mexidos", "2 Pães Integrais", "Café Preto", "1 Banana/Maçã"] },
    { id: "d2", time: "12:00", name: "Almoço", items: ["150g Frango grelhado", "200g Arroz ou Mandioca", "Brócolis e Salada verde", "1 col Azeite"] },
    { id: "d3", time: "15:30", name: "Lanche da Tarde", items: ["30g Whey Protein", "40g Aveia em flocos", "1 Banana", "15g Pasta Amendoim"] },
    { id: "d4", time: "19:30", name: "Janta", items: ["150g Patinho / Tilápia", "150g Batata Doce / Arroz", "Salada à vontade"] },
    { id: "d5", time: "22:00", name: "Ceia", items: ["1 Iogurte Grego Natural", "10g Castanhas de Caju"] }
];

// ==========================================
// 2. MOBILE CANVAS LIGHTNING (Optimized for Mobile GPU)
// ==========================================

const canvas = document.getElementById("lightning-canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

let lightningBolts = [];
let ambientSparks = [];
let isBoostMode = false;
let hasShownRadianteToday = false;

// Handle Resize & Orientation Changes
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
        this.decay = isTaskStrike ? 0.05 : 0.09; // Quicker decay on mobile for speed
        this.generatePath();
    }

    generatePath() {
        this.points = [];
        let steps = 10; // 10 steps instead of 15 for better mobile execution
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

        // Draw outer glow (slightly thinner on mobile)
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

        // Draw white core
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

// Spark class optimized for Mobile performance
class MobileSpark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 1.5 - 0.5;
        this.size = Math.random() * 2 + 0.8;
        this.alpha = 1;
        this.decay = Math.random() * 0.04 + 0.02; // Fade faster on mobile
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

// Simple Touch triggers lightning strike (ignoring buttons)
window.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const target = e.target;
    if (target.tagName !== "BUTTON" && target.tagName !== "INPUT" && !target.closest("button") && !target.closest("nav") && !target.closest("header")) {
        triggerLightningStrike(touch.clientX, touch.clientY);
    }
}, { passive: true });

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = lightningBolts.length - 1; i >= 0; i--) {
        lightningBolts[i].draw();
        if (lightningBolts[i].opacity <= 0) {
            lightningBolts.splice(i, 1);
        }
    }

    for (let i = ambientSparks.length - 1; i >= 0; i--) {
        ambientSparks[i].update();
        if (ambientSparks[i].alpha <= 0) {
            ambientSparks.splice(i, 1);
        } else {
            ambientSparks[i].draw();
        }
    }

    // Random strike (higher frequency if in boost mode)
    let strikeChance = isBoostMode ? 0.05 : 0.003;
    if (Math.random() < strikeChance) {
        triggerLightningStrike();
    }

    requestAnimationFrame(animate);
}
animate();

// ==========================================
// 3. STATE MANAGEMENT (LOCAL STORAGE)
// ==========================================

let appState = {
    completedExercises: {},
    completedMeals: {}
};

function loadProgress() {
    const saved = localStorage.getItem("team_alves_progress_mobile");
    if (saved) {
        try {
            appState = JSON.parse(saved);
        } catch (e) {
            console.error("Erro ao carregar dados salvos no mobile", e);
        }
    }
}

function saveProgress() {
    localStorage.setItem("team_alves_progress_mobile", JSON.stringify(appState));
}

// ==========================================
// 4. LOGIN / SCREEN TRANSITIONS
// ==========================================

const loginForm = document.getElementById("login-form");
const loginWrapper = document.getElementById("login-wrapper");
const appWrapper = document.getElementById("app-wrapper");
const flashOverlay = document.getElementById("flash-overlay");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    flashOverlay.style.opacity = "1";

    setTimeout(() => {
        loginWrapper.classList.add("hidden");
        appWrapper.classList.remove("hidden");
        
        triggerLightningStrike(width / 2, height / 2);
        triggerLightningStrike(width / 3, height / 3);

        initApp();

        setTimeout(() => {
            flashOverlay.style.opacity = "0";
        }, 150);
    }, 300);
});

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
    flashOverlay.style.opacity = "1";

    setTimeout(() => {
        appWrapper.classList.add("hidden");
        loginWrapper.classList.remove("hidden");
        
        setTimeout(() => {
            flashOverlay.style.opacity = "0";
        }, 150);
    }, 300);
});

// ==========================================
// 5. VIEW TAB CONTROLLER (MOBILE ROUTING)
// ==========================================

window.switchTab = function(tabName) {
    // Hide all views
    document.querySelectorAll(".app-view").forEach(view => view.classList.add("hidden"));
    // Show active view
    document.getElementById(`view-${tabName}`).classList.remove("hidden");

    // Remove active state from all nav buttons
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    // Highlight active nav button
    document.getElementById(`btn-tab-${tabName}`).classList.add("active");

    // If switching to home, ensure counters update
    if (tabName === "home") {
        updateHomeCounters();
    }
};

// ==========================================
// 6. APPLICATION INITS & RENDERS
// ==========================================

let activeDay = "segunda";

function initApp() {
    loadProgress();
    updateDateDisplay();
    renderDayTabs();
    renderWorkout(activeDay);
    renderDiet();
    calculateEnergy();
    updateHomeCounters();
}

function updateDateDisplay() {
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    const todayStr = new Date().toLocaleDateString('pt-BR', options);
    document.getElementById("date-display").innerText = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);
}

function renderDayTabs() {
    const tabBtns = document.querySelectorAll(".day-tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeDay = btn.dataset.day;
            renderWorkout(activeDay);
            renderDiet();
            calculateEnergy();
            updateHomeCounters();
        });
    });
}

function renderWorkout(day) {
    const workoutData = workouts[day];
    document.getElementById("workout-day-name").innerText = workoutData.name;
    document.getElementById("workout-focus-badge").innerText = workoutData.focus;

    const listContainer = document.getElementById("exercise-list-container");
    listContainer.innerHTML = "";

    let dayCompletedCount = 0;

    workoutData.exercises.forEach((ex) => {
        const stateKey = `${day}_${ex.id}`;
        const isCompleted = !!appState.completedExercises[stateKey];
        if (isCompleted) dayCompletedCount++;

        const card = document.createElement("div");
        card.className = `exercise-card ${isCompleted ? 'completed' : ''}`;
        card.id = `card-${stateKey}`;

        card.innerHTML = `
            <div class="exercise-info">
                <span class="exercise-name">${ex.name}</span>
                <span class="exercise-details">${ex.details}</span>
            </div>
            <button class="check-btn-mobile" onclick="toggleExercise('${day}', '${ex.id}', this, event)">
                <i class="fa-solid ${isCompleted ? 'fa-square-check' : 'fa-square'}"></i>
            </button>
        `;
        listContainer.appendChild(card);
    });

    document.getElementById("workout-overall-badge").innerText = `Progresso: ${dayCompletedCount}/${workoutData.exercises.length}`;
}

function renderDiet() {
    const dietContainer = document.getElementById("meal-list-container");
    dietContainer.innerHTML = "";

    let dietCompletedCount = 0;

    diet.forEach((meal) => {
        const stateKey = `${activeDay}_${meal.id}`;
        const isCompleted = !!appState.completedMeals[stateKey];
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
                <button class="meal-check-btn" onclick="toggleMeal('${meal.id}', this, event)">
                    <i class="fa-solid ${isCompleted ? 'fa-square-check' : 'fa-square'}"></i>
                    <span>${isCompleted ? 'Concluída' : 'Marcar Feita'}</span>
                </button>
            </div>
        `;
        dietContainer.appendChild(card);
    });

    document.getElementById("diet-overall-badge").innerText = `Concluído: ${dietCompletedCount}/${diet.length}`;
}

// Toggle Exercise state
window.toggleExercise = function(day, exId, btn, event) {
    event.stopPropagation();
    const stateKey = `${day}_${exId}`;
    const card = document.getElementById(`card-${stateKey}`);
    const isCompleted = !appState.completedExercises[stateKey];

    appState.completedExercises[stateKey] = isCompleted;
    saveProgress();

    if (isCompleted) {
        card.classList.add("completed");
        btn.innerHTML = `<i class="fa-solid fa-square-check"></i>`;
        
        // Spawn lightning strike on screen touch button coordinates
        const rect = btn.getBoundingClientRect();
        triggerLightningStrike(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
        card.classList.remove("completed");
        btn.innerHTML = `<i class="fa-solid fa-square"></i>`;
    }

    // Refresh metrics
    const workoutData = workouts[day];
    let completedCount = 0;
    workoutData.exercises.forEach(ex => {
        if (appState.completedExercises[`${day}_${ex.id}`]) completedCount++;
    });
    document.getElementById("workout-overall-badge").innerText = `Progresso: ${completedCount}/${workoutData.exercises.length}`;

    calculateEnergy();
    updateHomeCounters();
};

// Toggle Diet Meal state
window.toggleMeal = function(mealId, btn, event) {
    event.stopPropagation();
    const stateKey = `${activeDay}_${mealId}`;
    const card = document.getElementById(`card-diet-${stateKey}`);
    const isCompleted = !appState.completedMeals[stateKey];

    appState.completedMeals[stateKey] = isCompleted;
    saveProgress();

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
    diet.forEach(m => {
        if (appState.completedMeals[`${activeDay}_${m.id}`]) completedCount++;
    });
    document.getElementById("diet-overall-badge").innerText = `Concluído: ${completedCount}/${diet.length}`;

    calculateEnergy();
    updateHomeCounters();
};

function calculateEnergy() {
    const activeDayWorkout = workouts[activeDay];
    let completedExercisesNum = 0;
    activeDayWorkout.exercises.forEach(ex => {
        if (appState.completedExercises[`${activeDay}_${ex.id}`]) completedExercisesNum++;
    });

    let completedMealsNum = 0;
    diet.forEach(m => {
        if (appState.completedMeals[`${activeDay}_${m.id}`]) completedMealsNum++;
    });

    const totalCompleted = completedExercisesNum + completedMealsNum;
    const totalTasks = activeDayWorkout.exercises.length + diet.length;
    const pct = Math.round((totalCompleted / totalTasks) * 100);

    // Update progress meter
    document.getElementById("energy-bar-fill").style.width = `${pct}%`;
    document.getElementById("energy-percentage").innerText = `${pct}%`;

    // Messages
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

            // Shake screen ("BOOM" impact)
            const wrapper = document.getElementById("app-wrapper");
            wrapper.classList.add("shake-screen");
            setTimeout(() => wrapper.classList.remove("shake-screen"), 500);

            // Show Radiante overlay
            const overlay = document.getElementById("radiante-overlay");
            overlay.classList.remove("hidden");
            overlay.style.opacity = "1";

            // Spawn lightning strikes
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

        // Hide overlay if open
        const overlay = document.getElementById("radiante-overlay");
        if (!overlay.classList.contains("hidden")) {
            overlay.classList.add("hidden");
        }
    }
    document.getElementById("energy-msg").innerText = msg;
}

function updateHomeCounters() {
    const activeDayWorkout = workouts[activeDay];
    let completedExercisesNum = 0;
    activeDayWorkout.exercises.forEach(ex => {
        if (appState.completedExercises[`${activeDay}_${ex.id}`]) completedExercisesNum++;
    });

    let completedMealsNum = 0;
    diet.forEach(m => {
        if (appState.completedMeals[`${activeDay}_${m.id}`]) completedMealsNum++;
    });

    document.getElementById("home-workout-progress").innerText = `${completedExercisesNum}/${activeDayWorkout.exercises.length}`;
    document.getElementById("home-diet-progress").innerText = `${completedMealsNum}/${diet.length}`;
}

// Reset progress button
const resetProgressBtn = document.getElementById("reset-progress-btn");
resetProgressBtn.addEventListener("click", () => {
    if (confirm("Resetar progresso de treino e refeições de hoje?")) {
        const activeDayWorkout = workouts[activeDay];
        activeDayWorkout.exercises.forEach(ex => {
            delete appState.completedExercises[`${activeDay}_${ex.id}`];
        });

        diet.forEach(m => {
            delete appState.completedMeals[`${activeDay}_${m.id}`];
        });

        saveProgress();

        renderWorkout(activeDay);
        renderDiet();
        calculateEnergy();
        updateHomeCounters();

        spawnSparks(width / 2, height / 2, 12);
    }
});

// Close Radiante Overlay
window.closeRadianteOverlay = function() {
    const overlay = document.getElementById("radiante-overlay");
    overlay.style.opacity = "0";
    setTimeout(() => {
        overlay.classList.add("hidden");
    }, 400);
};
