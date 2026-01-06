// Função SIMPLIFICADA para corrigir caminhos de imagem
function fixImagePath(path) {
    if (!path) return '/assets/default-exercise.gif';
    
    console.log(`🔧 Corrigindo caminho: ${path}`);
    
    // Se já é um caminho completo, retorna
    if (path.startsWith('/assets/') || path.startsWith('http')) {
        return path;
    }
    
    // Se parece ser um GIF, mantém como está
    if (path.includes('.gif') || path.includes('.GIF')) {
        // Garante que comece com /assets/
        if (!path.startsWith('/assets/')) {
            return '/assets/' + path.replace(/^\/?/, '');
        }
        return path;
    }
    
    // Fallback padrão
    return '/assets/default-exercise.gif';
}

// Função SIMPLIFICADA para lidar com erro de imagem
function handleImageError(img) {
    console.warn(`⚠️ Erro ao carregar: ${img.src}`);
    img.onerror = null; // Previne loop infinito
    
    // Tenta apenas uma vez a imagem padrão
    if (img.src !== '/assets/default-exercise.gif') {
        img.src = '/assets/default-exercise.gif';
    }
}

// Base de dados de exercícios com caminhos diretos para GIFs
const exerciseDatabase = {
    "peito": [
        {
            id: "supino-reto",
            name: "Supino Reto",
            muscle: "Peito",
            description: "Deitando-se em um banco, com os pés apoiados no chão. Segure a barra com as mãos um pouco mais abertas que os ombros, desça até o peito e depois empulse para cima, estendendo os braços. Mantenha o corpo firme e controle a respiração.",
            image: "/assets/gif/supino-reto.gif",  // CAMINHO DIRETO PARA SUA PASTA GIF
            sets: "4x8-10",
            rest: "60-90s",
            intensity: "Média-Alta",
            icon: "fas fa-user",
            category: "peito"
        },
        {
            id: "supino-inclinado",
            name: "Supino Inclinado",
            muscle: "Peito Superior",
            description: "Deite-se no banco inclinado. Segure a barra com as mãos afastadas. Desça a barra até o peito superior e empulse para cima.",
            image: "/assets/gif/supino-inclinado.gif",  // CAMINHO DIRETO PARA SUA PASTA GIF
            sets: "4x8-12",
            rest: "90s",
            intensity: "Média",
            icon: "fas fa-arrow-up",
            category: "peito"
        }
        // Adicione mais exercícios com caminhos diretos para sua pasta GIF
    ]
};

// Estado da aplicação (mantenha igual)
let currentWorkout = null;
let currentExerciseIndex = 0;
let selectedExercises = [];
let customWorkouts = [];
let favoriteExercises = [];
let isRestTimerActive = false;
let restTimerInterval = null;
let remainingRestTime = 90;
let totalRestTime = 90;
let currentCategory = "todos";

// Função para carregar imagem corretamente
function loadImage(img, path) {
    const imagePath = fixImagePath(path);
    
    // Limpa eventos anteriores para evitar loops
    img.onload = null;
    img.onerror = null;
    
    // Tenta carregar a imagem
    img.src = imagePath;
    
    // Configura fallback em caso de erro
    img.onerror = function() {
        handleImageError(this);
    };
    
    // Adiciona atributo para debug
    img.setAttribute('data-debug-path', path);
}

// REMOVI A FUNÇÃO loadAllGifs() que causava loop infinito

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏋️‍♂️ NextTreino Iniciando...");
    
    // Carrega dados salvos
    loadSavedData();
    
    // Configura todos os eventos
    setupAllEventListeners();
    
    // Inicializa a página inicial
    updateHomePage();
    
    console.log("✅ NextTreino Pronto!");
});

// ======================
// CARREGAMENTO DE DADOS
// ======================

function loadSavedData() {
    try {
        // Carrega treinos personalizados
        const savedWorkouts = localStorage.getItem('NextTreinoWorkouts');
        if (savedWorkouts) {
            customWorkouts = JSON.parse(savedWorkouts);
            console.log(`📂 ${customWorkouts.length} treinos carregados`);
        }
        
        // Carrega exercícios favoritos
        const savedFavorites = localStorage.getItem('NextTreinoFavorites');
        if (savedFavorites) {
            favoriteExercises = JSON.parse(savedFavorites);
            console.log(`⭐ ${favoriteExercises.length} favoritos carregados`);
        }
        
        // Carrega treino atual
        const savedCurrent = localStorage.getItem('NextTreinoCurrent');
        if (savedCurrent) {
            currentWorkout = JSON.parse(savedCurrent);
            console.log(`🎯 Treino atual: ${currentWorkout.name}`);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        customWorkouts = [];
        favoriteExercises = [];
    }
}

// ======================
// CONFIGURAÇÃO DE EVENTOS (mantenha igual)
// ======================

function setupAllEventListeners() {
    console.log("🔌 Configurando eventos...");
    
    // Menu Lateral
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
    
    // Navegação do Menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.dataset.page;
            
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            navigateToPage(pageId);
        });
    });
    
    // Página Inicial
    const quickStartBtn = document.getElementById('quick-start');
    const quickCreateBtn = document.getElementById('quick-create');
    const editWorkoutBtn = document.getElementById('edit-workout');
    const startWorkoutBtn = document.getElementById('start-workout');
    
    if (quickStartBtn) {
        quickStartBtn.addEventListener('click', function() {
            if (currentWorkout) {
                navigateToPage('page-train');
            } else {
                showMessage('Crie um treino primeiro!', 'warning');
                navigateToPage('page-create');
            }
        });
    }
    
    if (quickCreateBtn) {
        quickCreateBtn.addEventListener('click', function() {
            navigateToPage('page-create');
        });
    }
    
    if (editWorkoutBtn) {
        editWorkoutBtn.addEventListener('click', function() {
            if (currentWorkout) {
                editWorkout(currentWorkout.id);
            } else {
                navigateToPage('page-create');
            }
        });
    }
    
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', function() {
            if (currentWorkout) {
                navigateToPage('page-train');
            } else {
                showMessage('Selecione um treino primeiro!', 'warning');
            }
        });
    }
    
    // Página Criar Treino
    const workoutNameInput = document.getElementById('workout-name');
    const cancelCreateBtn = document.getElementById('cancel-create');
    const saveWorkoutBtn = document.getElementById('save-workout-btn');
    
    if (workoutNameInput) workoutNameInput.addEventListener('input', updateCharCount);
    if (cancelCreateBtn) cancelCreateBtn.addEventListener('click', cancelCreation);
    if (saveWorkoutBtn) saveWorkoutBtn.addEventListener('click', saveWorkout);
    
    // Página Meus Treinos
    const newWorkoutBtn = document.getElementById('new-workout-btn');
    const createFirstWorkoutBtn = document.getElementById('create-first-workout');
    
    if (newWorkoutBtn) newWorkoutBtn.addEventListener('click', function() {
        navigateToPage('page-create');
    });
    
    if (createFirstWorkoutBtn) createFirstWorkoutBtn.addEventListener('click', function() {
        navigateToPage('page-create');
    });
    
    // Página Favoritos
    const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
    if (clearFavoritesBtn) clearFavoritesBtn.addEventListener('click', clearFavorites);
    
    // Página Treinar
    const carouselPrevBtn = document.getElementById('carousel-prev');
    const carouselNextBtn = document.getElementById('carousel-next');
    const prevExerciseBtn = document.getElementById('prev-exercise-btn');
    const nextExerciseBtn = document.getElementById('next-exercise-btn');
    const startRestBtn = document.getElementById('start-rest-btn');
    const completeBtn = document.getElementById('complete-btn');
    
    if (carouselPrevBtn) carouselPrevBtn.addEventListener('click', prevExercise);
    if (carouselNextBtn) carouselNextBtn.addEventListener('click', nextExercise);
    if (prevExerciseBtn) prevExerciseBtn.addEventListener('click', prevExercise);
    if (nextExerciseBtn) nextExerciseBtn.addEventListener('click', nextExercise);
    if (startRestBtn) startRestBtn.addEventListener('click', startRestTimer);
    if (completeBtn) completeBtn.addEventListener('click', completeExercise);
    
    // Timer
    const timerPauseBtn = document.getElementById('timer-pause');
    const timerResetBtn = document.getElementById('timer-reset');
    const timerSkipBtn = document.getElementById('timer-skip');
    const timerCloseBtn = document.getElementById('timer-close');
    const timerBtn = document.getElementById('timer-btn');
    
    if (timerPauseBtn) timerPauseBtn.addEventListener('click', toggleTimer);
    if (timerResetBtn) timerResetBtn.addEventListener('click', resetTimer);
    if (timerSkipBtn) timerSkipBtn.addEventListener('click', skipTimer);
    if (timerCloseBtn) timerCloseBtn.addEventListener('click', closeTimer);
    if (timerBtn) {
        timerBtn.addEventListener('click', function() {
            if (isRestTimerActive) showTimer();
        });
    }
    
    // Modal
    const closeModalBtn = document.querySelector('.close-modal');
    const modalCancelBtn = document.getElementById('modal-cancel');
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
    
    console.log("✅ Eventos configurados");
}

// ======================
// NAVEGAÇÃO (mantenha igual)
// ======================

function navigateToPage(pageId) {
    console.log(`➡️ Navegando para: ${pageId}`);
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
        
        switch(pageId) {
            case 'page-home':
                updateHomePage();
                break;
            case 'page-train':
                updateTrainPage();
                break;
            case 'page-create':
                initCreatePage();
                break;
            case 'page-workouts':
                updateWorkoutsPage();
                break;
            case 'page-favorites':
                updateFavoritesPage();
                break;
        }
    } else {
        console.error(`❌ Página não encontrada: ${pageId}`);
        const homePage = document.getElementById('page-home');
        if (homePage) {
            homePage.classList.add('active');
            updateHomePage();
        }
    }
}

function openMenu() {
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (sideMenu) sideMenu.classList.add('active');
    if (menuOverlay) menuOverlay.classList.add('active');
}

function closeMenu() {
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (sideMenu) sideMenu.classList.remove('active');
    if (menuOverlay) menuOverlay.classList.remove('active');
}

// ======================
// PÁGINA INICIAL (mantenha igual)
// ======================

function updateHomePage() {
    console.log("🏠 Atualizando página inicial...");
    
    const title = document.getElementById('current-workout-title');
    const count = document.getElementById('current-workout-count');
    const desc = document.getElementById('current-workout-desc');
    const editBtn = document.getElementById('edit-workout');
    const startBtn = document.getElementById('start-workout');
    const currentWorkoutCard = document.getElementById('current-workout-card');
    
    if (currentWorkout && title && count && desc && editBtn && startBtn && currentWorkoutCard) {
        title.textContent = currentWorkout.name;
        count.textContent = `${currentWorkout.exercises.length} exercícios`;
        desc.textContent = 'Pronto para começar!';
        editBtn.disabled = false;
        startBtn.disabled = false;
        currentWorkoutCard.classList.add('featured');
    } else if (title && count && desc && editBtn && startBtn && currentWorkoutCard) {
        title.textContent = 'Nenhum treino';
        count.textContent = '0 exercícios';
        desc.textContent = 'Crie ou selecione um treino para começar';
        editBtn.disabled = true;
        startBtn.disabled = true;
        currentWorkoutCard.classList.remove('featured');
    }
    
    updateRecentWorkouts();
}

function updateRecentWorkouts() {
    const recentList = document.getElementById('recent-list');
    if (!recentList) return;
    
    if (customWorkouts.length === 0) {
        recentList.innerHTML = `
            <div class="empty-recent">
                <i class="fas fa-dumbbell"></i>
                <p>Nenhum treino criado ainda</p>
            </div>
        `;
        return;
    }
    
    recentList.innerHTML = '';
    
    const recentWorkouts = customWorkouts.slice(0, 3);
    
    recentWorkouts.forEach(workout => {
        const workoutItem = document.createElement('div');
        workoutItem.className = 'recent-workout-item';
        
        const date = new Date(workout.createdAt || Date.now());
        const formattedDate = date.toLocaleDateString('pt-BR');
        
        workoutItem.innerHTML = `
            <div class="recent-workout-info">
                <h4>${workout.name}</h4>
                <p>${workout.exercises.length} exercícios • ${formattedDate}</p>
            </div>
            <div class="recent-workout-actions">
                <button class="btn btn-sm btn-outline load-workout" data-id="${workout.id}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
        
        workoutItem.querySelector('.load-workout').addEventListener('click', function(e) {
            e.stopPropagation();
            loadWorkout(workout.id);
        });
        
        recentList.appendChild(workoutItem);
    });
}

// ======================
// PÁGINA CRIAR TREINO
// ======================

function initCreatePage() {
    console.log("🛠️ Inicializando página de criação...");
    
    selectedExercises = [];
    
    loadCategories();
    loadExercises();
    updateCharCount();
    updateSelectedList();
}

function loadCategories() {
    const container = document.getElementById('category-tags');
    if (!container) return;
    
    const categories = [
        { id: "todos", name: "Todos" },
        { id: "peito", name: "Peito" },
        { id: "costas", name: "Costas" },
        { id: "pernas", name: "Pernas" },
        { id: "ombros", name: "Ombros" },
        { id: "biceps", name: "Bíceps" },
        { id: "posteriores", name: "Posteriores" },
        { id: "punho", name: "Punho" },
        { id: "triceps", name: "Tríceps" }
    ];
    
    container.innerHTML = '';
    
    categories.forEach(category => {
        const tag = document.createElement('div');
        tag.className = `category-tag ${category.id === currentCategory ? 'active' : ''}`;
        tag.textContent = category.name;
        tag.dataset.category = category.id;
        
        tag.addEventListener('click', function() {
            currentCategory = this.dataset.category;
            document.querySelectorAll('.category-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadExercises();
        });
        
        container.appendChild(tag);
    });
}

function loadExercises() {
    const grid = document.getElementById('exercises-grid');
    if (!grid) return;
    
    let exercises = [];
    if (currentCategory === "todos") {
        Object.values(exerciseDatabase).forEach(cat => exercises.push(...cat));
    } else {
        exercises = exerciseDatabase[currentCategory] || [];
    }
    
    if (exercises.length === 0) {
        grid.innerHTML = '<div class="no-exercises"><p>Nenhum exercício encontrado</p></div>';
        return;
    }
    
    grid.innerHTML = '';
    
    exercises.forEach(exercise => {
        const isSelected = selectedExercises.some(e => e.id === exercise.id);
        
        const card = document.createElement('div');
        card.className = `exercise-card ${isSelected ? 'selected' : ''}`;
        card.dataset.id = exercise.id;
        
        card.innerHTML = `
            <div class="exercise-card-image">
                <img src="${exercise.image}" alt="${exercise.name}" loading="lazy"
                     onerror="handleImageError(this)">
                <div class="exercise-card-overlay">
                    <i class="fas fa-check"></i>
                </div>
            </div>
            <div class="exercise-card-content">
                <h4>${exercise.name}</h4>
                <p class="exercise-muscle">${exercise.muscle}</p>
                <div class="exercise-stats">
                    <span><i class="fas fa-redo"></i> ${exercise.sets}</span>
                    <span><i class="fas fa-clock"></i> ${exercise.rest}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => toggleExerciseSelection(exercise));
        grid.appendChild(card);
    });
}

function toggleExerciseSelection(exercise) {
    const index = selectedExercises.findIndex(e => e.id === exercise.id);
    
    if (index > -1) {
        selectedExercises.splice(index, 1);
    } else {
        selectedExercises.push({...exercise});
    }
    
    updateSelectedList();
    loadExercises();
}

function updateSelectedList() {
    const list = document.getElementById('selected-list');
    const count = document.getElementById('selected-count');
    
    if (!list || !count) return;
    
    count.textContent = selectedExercises.length;
    
    if (selectedExercises.length === 0) {
        list.innerHTML = `
            <div class="empty-selection">
                <i class="fas fa-plus-circle"></i>
                <p>Selecione exercícios para criar seu treino</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = '';
    
    selectedExercises.forEach((exercise, index) => {
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="selected-item-content">
                <div class="selected-item-icon">
                    <i class="${exercise.icon}"></i>
                </div>
                <div>
                    <h4>${exercise.name}</h4>
                    <p>${exercise.muscle} • ${exercise.sets}</p>
                </div>
            </div>
            <button class="btn btn-sm btn-outline remove-item" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        item.querySelector('.remove-item').addEventListener('click', function(e) {
            e.stopPropagation();
            const idx = parseInt(this.dataset.index);
            selectedExercises.splice(idx, 1);
            updateSelectedList();
            loadExercises();
        });
        
        list.appendChild(item);
    });
}

function updateCharCount() {
    const input = document.getElementById('workout-name');
    const count = document.getElementById('char-count');
    
    if (!input || !count) return;
    
    count.textContent = `${input.value.length}/50`;
}

function cancelCreation() {
    if (selectedExercises.length > 0) {
        showConfirm(
            'Cancelar criação',
            'Tem certeza? Sua seleção será perdida.',
            () => {
                selectedExercises = [];
                const workoutNameInput = document.getElementById('workout-name');
                if (workoutNameInput) workoutNameInput.value = '';
                navigateToPage('page-home');
            }
        );
    } else {
        navigateToPage('page-home');
    }
}

function saveWorkout() {
    const nameInput = document.getElementById('workout-name');
    if (!nameInput) return;
    
    const workoutName = nameInput.value.trim();
    
    if (!workoutName) {
        showMessage('Digite um nome para o treino!', 'error');
        nameInput.focus();
        return;
    }
    
    if (workoutName.length < 3) {
        showMessage('O nome deve ter pelo menos 3 caracteres!', 'error');
        nameInput.focus();
        return;
    }
    
    if (selectedExercises.length === 0) {
        showMessage('Selecione pelo menos um exercício!', 'error');
        return;
    }
    
    const existingWorkout = customWorkouts.find(w => 
        w.name.toLowerCase() === workoutName.toLowerCase()
    );
    
    if (existingWorkout) {
        showConfirm(
            'Treino existente',
            `Já existe um treino chamado "${workoutName}". Deseja substituí-lo?`,
            () => {
                customWorkouts = customWorkouts.filter(w => w.id !== existingWorkout.id);
                finishSavingWorkout(workoutName);
            }
        );
        return;
    }
    
    finishSavingWorkout(workoutName);
}

function finishSavingWorkout(workoutName) {
    const newWorkout = {
        id: Date.now().toString(),
        name: workoutName,
        exercises: [...selectedExercises],
        createdAt: new Date().toISOString(),
        lastUsed: null,
        isFavorite: false
    };
    
    console.log("💾 Salvando treino:", newWorkout);
    
    customWorkouts.unshift(newWorkout);
    
    try {
        localStorage.setItem('NextTreinoWorkouts', JSON.stringify(customWorkouts));
        
        currentWorkout = newWorkout;
        localStorage.setItem('NextTreinoCurrent', JSON.stringify(newWorkout));
        
        selectedExercises = [];
        const workoutNameInput = document.getElementById('workout-name');
        if (workoutNameInput) workoutNameInput.value = '';
        updateCharCount();
        updateSelectedList();
        
        showMessage(`Treino "${workoutName}" criado com sucesso!`, 'success');
        navigateToPage('page-train');
        
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        showMessage('Erro ao salvar treino. Espaço de armazenamento pode estar cheio.', 'error');
    }
}

// ======================
// PÁGINA MEUS TREINOS (mantenha igual)
// ======================

function updateWorkoutsPage() {
    const list = document.getElementById('workouts-list');
    const empty = document.getElementById('empty-workouts');
    
    if (!list || !empty) return;
    
    if (customWorkouts.length === 0) {
        empty.classList.remove('hidden');
        list.classList.add('hidden');
        return;
    }
    
    empty.classList.add('hidden');
    list.classList.remove('hidden');
    list.innerHTML = '';
    
    customWorkouts.forEach(workout => {
        const item = document.createElement('div');
        item.className = 'workout-list-item';
        
        const date = new Date(workout.createdAt);
        const formattedDate = date.toLocaleDateString('pt-BR');
        
        item.innerHTML = `
            <div class="workout-list-info">
                <h4>${workout.name}</h4>
                <p>${workout.exercises.length} exercícios • Criado em ${formattedDate}</p>
            </div>
            <div class="workout-list-actions">
                <span class="workout-count">
                    <i class="fas fa-dumbbell"></i>
                    ${workout.exercises.length}
                </span>
                <button class="btn btn-sm btn-outline train-action" data-id="${workout.id}">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-sm btn-outline edit-action" data-id="${workout.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline delete-action" data-id="${workout.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        item.querySelector('.train-action').addEventListener('click', function(e) {
            e.stopPropagation();
            loadWorkout(this.dataset.id);
        });
        
        item.querySelector('.edit-action').addEventListener('click', function(e) {
            e.stopPropagation();
            editWorkout(this.dataset.id);
        });
        
        item.querySelector('.delete-action').addEventListener('click', function(e) {
            e.stopPropagation();
            deleteWorkout(this.dataset.id);
        });
        
        list.appendChild(item);
    });
}

function loadWorkout(workoutId) {
    const workout = customWorkouts.find(w => w.id === workoutId);
    if (!workout) {
        showMessage('Treino não encontrado!', 'error');
        return;
    }
    
    currentWorkout = workout;
    localStorage.setItem('NextTreinoCurrent', JSON.stringify(workout));
    
    workout.lastUsed = new Date().toISOString();
    localStorage.setItem('NextTreinoWorkouts', JSON.stringify(customWorkouts));
    
    showMessage(`Treino "${workout.name}" carregado!`, 'success');
    navigateToPage('page-train');
}

function editWorkout(workoutId) {
    const workout = customWorkouts.find(w => w.id === workoutId);
    if (!workout) {
        showMessage('Treino não encontrado!', 'error');
        return;
    }
    
    const workoutNameInput = document.getElementById('workout-name');
    if (workoutNameInput) workoutNameInput.value = workout.name;
    selectedExercises = [...workout.exercises];
    
    customWorkouts = customWorkouts.filter(w => w.id !== workoutId);
    localStorage.setItem('NextTreinoWorkouts', JSON.stringify(customWorkouts));
    
    updateSelectedList();
    loadExercises();
    navigateToPage('page-create');
    
    showMessage('Editando treino...', 'info');
}

function deleteWorkout(workoutId) {
    showConfirm(
        'Excluir treino',
        'Tem certeza que deseja excluir este treino?',
        () => {
            customWorkouts = customWorkouts.filter(w => w.id !== workoutId);
            
            if (currentWorkout && currentWorkout.id === workoutId) {
                currentWorkout = null;
                localStorage.removeItem('NextTreinoCurrent');
            }
            
            localStorage.setItem('NextTreinoWorkouts', JSON.stringify(customWorkouts));
            
            updateWorkoutsPage();
            updateHomePage();
            
            showMessage('Treino excluído!', 'success');
        }
    );
}

// ======================
// PÁGINA TREINAR
// ======================

function updateTrainPage() {
    console.log("🏋️ Atualizando página de treino...");
    
    if (!currentWorkout || !currentWorkout.exercises || currentWorkout.exercises.length === 0) {
        console.warn("⚠️ Nenhum treino disponível");
        
        if (customWorkouts.length > 0) {
            currentWorkout = customWorkouts[0];
            localStorage.setItem('NextTreinoCurrent', JSON.stringify(currentWorkout));
            console.log(`✅ Usando treino: ${currentWorkout.name}`);
        } else {
            showMessage('Nenhum treino disponível. Crie um primeiro!', 'warning');
            navigateToPage('page-create');
            return;
        }
    }
    
    console.log(`✅ Carregando: ${currentWorkout.name} (${currentWorkout.exercises.length} exercícios)`);
    
    const trainingWorkoutName = document.getElementById('training-workout-name');
    if (trainingWorkoutName) {
        trainingWorkoutName.textContent = currentWorkout.name;
    }
    
    currentExerciseIndex = 0;
    updateTrainingCarousel();
    updateCurrentExercise();
}

function updateTrainingCarousel() {
    const carousel = document.getElementById('training-carousel');
    const indicators = document.getElementById('carousel-indicators');
    
    if (!carousel || !indicators) return;
    
    carousel.innerHTML = '';
    indicators.innerHTML = '';
    
    currentWorkout.exercises.forEach((exercise, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === currentExerciseIndex ? 'active' : ''}`;
        
        slide.innerHTML = `
            <img src="${exercise.image}" alt="${exercise.name}" class="exercise-image"
                 onerror="handleImageError(this)">
            <div class="slide-overlay">
                <h3>${exercise.name}</h3>
                <p>${exercise.muscle}</p>
            </div>
        `;
        
        carousel.appendChild(slide);
        
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === currentExerciseIndex ? 'active' : ''}`;
        indicator.dataset.index = index;
        
        indicator.addEventListener('click', function() {
            const newIndex = parseInt(this.dataset.index);
            if (newIndex !== currentExerciseIndex) {
                currentExerciseIndex = newIndex;
                updateCarouselView();
                updateCurrentExercise();
            }
        });
        
        indicators.appendChild(indicator);
    });
}

function updateCarouselView() {
    const slides = document.querySelectorAll('#training-carousel .carousel-slide');
    const indicators = document.querySelectorAll('#carousel-indicators .indicator');
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    if (slides[currentExerciseIndex]) {
        slides[currentExerciseIndex].classList.add('active');
        indicators[currentExerciseIndex].classList.add('active');
    }
}

function updateCurrentExercise() {
    if (!currentWorkout || !currentWorkout.exercises[currentExerciseIndex]) return;
    
    const exercise = currentWorkout.exercises[currentExerciseIndex];
    
    const exerciseName = document.getElementById('exercise-name');
    const exerciseMuscle = document.getElementById('exercise-muscle');
    const exerciseSets = document.getElementById('exercise-sets');
    const exerciseRest = document.getElementById('exercise-rest');
    const exerciseIntensity = document.getElementById('exercise-intensity');
    const exerciseDescription = document.getElementById('exercise-description');
    const exerciseCounter = document.getElementById('exercise-counter');
    
    if (exerciseName) exerciseName.textContent = exercise.name;
    if (exerciseMuscle) exerciseMuscle.textContent = exercise.muscle;
    if (exerciseSets) exerciseSets.textContent = exercise.sets;
    if (exerciseRest) exerciseRest.textContent = exercise.rest;
    if (exerciseIntensity) exerciseIntensity.textContent = exercise.intensity;
    if (exerciseDescription) exerciseDescription.textContent = exercise.description;
    if (exerciseCounter) {
        exerciseCounter.textContent = `${currentExerciseIndex + 1}/${currentWorkout.exercises.length}`;
    }
    
    const restMatch = exercise.rest.match(/(\d+)/);
    if (restMatch) {
        totalRestTime = parseInt(restMatch[1]);
        remainingRestTime = totalRestTime;
        updateTimerDisplay();
    }
}

function prevExercise() {
    if (!currentWorkout || !currentWorkout.exercises) return;
    
    if (currentExerciseIndex > 0) {
        currentExerciseIndex--;
        updateCarouselView();
        updateCurrentExercise();
    }
}

function nextExercise() {
    if (!currentWorkout || !currentWorkout.exercises) return;
    
    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
        currentExerciseIndex++;
        updateCarouselView();
        updateCurrentExercise();
    }
}

function completeExercise() {
    if (!currentWorkout || !currentWorkout.exercises[currentExerciseIndex]) {
        showMessage('Nenhum exercício para concluir!', 'error');
        return;
    }
    
    const exercise = currentWorkout.exercises[currentExerciseIndex];
    
    const isFavorite = favoriteExercises.some(fav => fav.id === exercise.id);
    if (!isFavorite) {
        favoriteExercises.unshift({...exercise});
        localStorage.setItem('NextTreinoFavorites', JSON.stringify(favoriteExercises));
    }
    
    showMessage(`${exercise.name} concluído! ✅`, 'success');
    
    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
        currentExerciseIndex++;
        updateCarouselView();
        updateCurrentExercise();
        
        setTimeout(() => startRestTimer(), 500);
    } else {
        showMessage('🎉 Treino concluído! Parabéns!', 'success');
    }
}

// ======================
// TIMER (mantenha igual)
// ======================

function startRestTimer() {
    if (!currentWorkout || !currentWorkout.exercises[currentExerciseIndex]) {
        showMessage('Selecione um exercício primeiro!', 'warning');
        return;
    }
    
    if (isRestTimerActive) {
        showTimer();
        return;
    }
    
    const exercise = currentWorkout.exercises[currentExerciseIndex];
    const restMatch = exercise.rest.match(/(\d+)/);
    
    if (restMatch) {
        totalRestTime = parseInt(restMatch[1]);
    } else {
        totalRestTime = 60;
    }
    
    remainingRestTime = totalRestTime;
    isRestTimerActive = true;
    
    updateTimerDisplay();
    startTimer();
    showTimer();
    
    showMessage(`⏱️ Descanso de ${totalRestTime}s iniciado`, 'info');
}

function showTimer() {
    const restTimer = document.getElementById('rest-timer');
    if (restTimer) restTimer.classList.add('active');
}

function closeTimer() {
    const restTimer = document.getElementById('rest-timer');
    if (restTimer) restTimer.classList.remove('active');
}

function startTimer() {
    if (restTimerInterval) clearInterval(restTimerInterval);
    
    restTimerInterval = setInterval(() => {
        if (remainingRestTime > 0) {
            remainingRestTime--;
            updateTimerDisplay();
        } else {
            clearInterval(restTimerInterval);
            restTimerInterval = null;
            isRestTimerActive = false;
            showMessage('✅ Descanso concluído! Continue treinando.', 'success');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingRestTime / 60);
    const seconds = remainingRestTime % 60;
    
    const timerMinutes = document.getElementById('timer-minutes');
    const timerSeconds = document.getElementById('timer-seconds');
    
    if (timerMinutes) timerMinutes.textContent = minutes.toString().padStart(2, '0');
    if (timerSeconds) timerSeconds.textContent = seconds.toString().padStart(2, '0');
}

function toggleTimer() {
    const btn = document.getElementById('timer-pause');
    
    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
        if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        startTimer();
        if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

function resetTimer() {
    remainingRestTime = totalRestTime;
    updateTimerDisplay();
    
    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        startTimer();
    }
}

function skipTimer() {
    remainingRestTime = 0;
    updateTimerDisplay();
    
    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
    }
    
    isRestTimerActive = false;
    showMessage('⏭️ Descanso pulado!', 'info');
}

// ======================
// PÁGINA FAVORITOS
// ======================

function updateFavoritesPage() {
    const grid = document.getElementById('favorites-grid');
    const empty = document.getElementById('empty-favorites');
    const clearBtn = document.getElementById('clear-favorites-btn');
    
    if (!grid || !empty || !clearBtn) return;
    
    if (favoriteExercises.length === 0) {
        empty.classList.remove('hidden');
        grid.classList.add('hidden');
        clearBtn.classList.add('hidden');
        return;
    }
    
    empty.classList.add('hidden');
    grid.classList.remove('hidden');
    clearBtn.classList.remove('hidden');
    grid.innerHTML = '';
    
    favoriteExercises.forEach(exercise => {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        
        card.innerHTML = `
            <div class="favorite-card-image">
                <img src="${exercise.image}" alt="${exercise.name}"
                     onerror="handleImageError(this)">
                <div class="favorite-overlay">
                    <i class="fas fa-bookmark"></i>
                </div>
            </div>
            <div class="favorite-card-content">
                <h4>${exercise.name}</h4>
                <p class="favorite-muscle">${exercise.muscle}</p>
                <div class="favorite-stats">
                    <span><i class="fas fa-redo"></i> ${exercise.sets}</span>
                    <span><i class="fas fa-clock"></i> ${exercise.rest}</span>
                </div>
                <button class="btn btn-sm btn-outline add-to-workout" data-id="${exercise.id}">
                    <i class="fas fa-plus"></i> Adicionar
                </button>
            </div>
        `;
        
        card.querySelector('.add-to-workout').addEventListener('click', function(e) {
            e.stopPropagation();
            addFavoriteToWorkout(exercise.id);
        });
        
        grid.appendChild(card);
    });
}

function addFavoriteToWorkout(exerciseId) {
    const exercise = favoriteExercises.find(fav => fav.id === exerciseId);
    if (!exercise) return;
    
    const isSelected = selectedExercises.some(e => e.id === exerciseId);
    
    if (!isSelected) {
        selectedExercises.push({...exercise});
        updateSelectedList();
        loadExercises();
        showMessage(`${exercise.name} adicionado à seleção!`, 'success');
        navigateToPage('page-create');
    } else {
        showMessage('Exercício já está selecionado!', 'info');
    }
}

function clearFavorites() {
    if (favoriteExercises.length === 0) return;
    
    showConfirm(
        'Limpar favoritos',
        'Tem certeza que deseja remover todos os exercícios favoritos?',
        () => {
            favoriteExercises = [];
            localStorage.removeItem('NextTreinoFavorites');
            updateFavoritesPage();
            showMessage('Favoritos limpos!', 'success');
        }
    );
}

// ======================
// FUNÇÕES AUXILIARES
// ======================

function showConfirm(title, message, callback) {
    const modal = document.getElementById('confirm-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirm = document.getElementById('modal-confirm');
    
    if (!modal || !modalTitle || !modalMessage || !modalConfirm) return;
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    const newConfirm = modalConfirm.cloneNode(true);
    modalConfirm.parentNode.replaceChild(newConfirm, modalConfirm);
    
    const newModalConfirm = document.getElementById('modal-confirm');
    if (newModalConfirm) {
        newModalConfirm.addEventListener('click', function() {
            closeModal();
            if (callback) callback();
        });
    }
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.classList.remove('active');
}

function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = `message message-${type} show`;
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

// ======================
// INICIALIZAÇÃO FINAL
// ======================

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') prevExercise();
    if (e.key === 'ArrowRight') nextExercise();
    if (e.key === 'Escape') {
        closeTimer();
        closeMenu();
        closeModal();
    }
});

console.log("✅ Aplicativo pronto! Foco em exibir GIFs da pasta.");
