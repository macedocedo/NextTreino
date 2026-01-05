// Função para corrigir caminhos de imagem automaticamente
function fixImagePath(path) {
    if (!path) return '/assets/default-exercise.gif';
    
    console.log(`🔧 Corrigindo caminho: ${path}`);
    
    // Remove espaços e caracteres problemáticos
    let fixedPath = path.replace(/ /g, '-');
    
    // Se ainda tiver %20, substitui por -
    fixedPath = fixedPath.replace(/%20/g, '-');
    
    // Converte para minúsculas (problema comum em servidores Linux)
    fixedPath = fixedPath.toLowerCase();
    
    // Remove caracteres especiais
    fixedPath = fixedPath.replace(/[^a-zA-Z0-9\-_./]/g, '');
    
    // Corrige problemas comuns de caminho
    if (fixedPath.includes('img-msc')) {
        fixedPath = fixedPath.replace('img-msc', 'img-msc');
    } else if (fixedPath.includes('img msc')) {
        fixedPath = fixedPath.replace('img msc', 'img-msc');
    }
    
    // Garante que não tenha barras duplas
    fixedPath = fixedPath.replace(/\/+/g, '/');
    
    // Se o caminho já começar com /assets/, mantém
    if (fixedPath.startsWith('/assets/')) {
        return fixedPath;
    }
    
    // Se começar com assets/, adiciona a barra inicial
    if (fixedPath.startsWith('assets/')) {
        return '/' + fixedPath;
    }
    
    // Se não tiver /assets no caminho, adiciona
    if (!fixedPath.includes('/assets/')) {
        return '/assets/img-msc/' + fixedPath.split('/').pop();
    }
    
    return fixedPath;
}

// Função para tratamento de erros de imagem - VERSÃO MELHORADA
function handleImageError(img) {
    console.warn(`⚠️ Erro ao carregar imagem: ${img.src}`);
    img.onerror = null; // Previne loop infinito
    
    // Tenta várias estratégias para carregar a imagem
    const originalSrc = img.src;
    const filename = originalSrc.split('/').pop();
    
    // Estratégias de fallback em ordem de tentativa
    const fallbackStrategies = [
        // 1. Tenta com caminho todo em minúsculas
        originalSrc.toLowerCase(),
        
        // 2. Tenta caminho relativo sem barra inicial
        originalSrc.replace(window.location.origin + '/assets/', 'assets/'),
        
        // 3. Tenta apenas o nome do arquivo na pasta padrão
        '/assets/img-msc/default/' + filename.toLowerCase(),
        
        // 4. Usa imagem padrão do sistema
        '/assets/default-exercise.gif'
    ];
    
    let currentTry = 0;
    
    function tryNextStrategy() {
        if (currentTry >= fallbackStrategies.length) {
            // Todas as estratégias falharam
            img.src = '/assets/default-exercise.gif';
            img.style.backgroundColor = '#f0f0f0';
            img.style.padding = '20px';
            img.alt = 'Imagem não disponível';
            console.log('📦 Usando imagem padrão');
            return;
        }
        
        const nextSrc = fallbackStrategies[currentTry];
        currentTry++;
        
        console.log(`🔄 Tentando estratégia ${currentTry}: ${nextSrc}`);
        
        const testImg = new Image();
        testImg.onload = function() {
            console.log(`✅ Imagem encontrada: ${nextSrc}`);
            img.src = nextSrc;
        };
        testImg.onerror = function() {
            setTimeout(tryNextStrategy, 100);
        };
        testImg.src = nextSrc;
    }
    
    tryNextStrategy();
}

// Função para verificar se uma imagem existe
function checkImageExists(url, callback) {
    const img = new Image();
    img.onload = function() {
        callback(true);
    };
    img.onerror = function() {
        callback(false);
    };
    img.src = url;
}

// Função para pré-carregar imagens importantes
function preloadImportantImages() {
    const importantImages = [
        '/assets/default-exercise.gif',
        '/assets/img-msc/peito/supino-reto.gif',
        '/assets/img-msc/peito/supino-inclinado.gif'
    ];
    
    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Base de dados de exercícios com caminhos PADRÃO e CONSISTENTES
const exerciseDatabase = {
    "peito": [
        {
            id: "supino-reto",
            name: "Supino Reto",
            muscle: "Peito",
            description: "Deitando-se em um banco, com os pés apoiados no chão. Segure a barra com as mãos um pouco mais abertas que os ombros, desça até o peito e depois empurre para cima, estendendo os braços. Mantenha o corpo firme e controle a respiração.",
            image: "/assets/img-msc/peito/supino-reto.gif",
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
            description: "Deite-se no banco inclinado. Segure a barra com as mãos afastadas. Desça a barra até o peito superior e empurre para cima.",
            image: "/assets/img-msc/peito/supino-inclinado.gif",
            sets: "4x8-12",
            rest: "90s",
            intensity: "Média",
            icon: "fas fa-arrow-up",
            category: "peito"
        },
        {
            id: "crucifixo-inclinado",
            name: "Crucifixo Inclinado",
            muscle: "Peito",
            description: "Deite-se no banco com halteres. Com os braços levemente flexionados, abra os braços até a altura dos ombros e retorne.",
            image: "/assets/img-msc/peito/crucifixo-inclinado.gif",
            sets: "4x8-10",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-expand-alt",
            category: "peito"
        },
        {
            id: "crucifixo-baixo",
            name: "Crucifixo Baixo",
            muscle: "Peito Superior",
            description: "Fique entre as polias. Segure as alças e traga as mãos juntas na frente do corpo em movimento de arco.",
            image: "/assets/img-msc/peito/crucifixo-baixo.gif",
            sets: "3x12-15",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-expand-alt",
            category: "peito"
        },
        {
            id: "fly-na-maquina",
            name: "Fly na Maquina",
            muscle: "Peito",
            description: "Sente-se no banco, braços abertos com cotovelos levemente flexionados. Feche os braços em arco até à frente do peito, contraindo o peitoral, e volte devagar. Solte o ar ao fechar e inspire ao abrir.",
            image: "/assets/img-msc/peito/fly-maquina.gif",
            sets: "4x8-10",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-crosshairs",
            category: "peito"
        },
        {
            id: "crossover",
            name: "Crossover",
            muscle: "Peito",
            description: "Fique entre as polias. Segure as alças e traga as mãos juntas na frente do corpo em movimento de arco.",
            image: "/assets/img-msc/peito/crucifixo-crossover.gif",
            sets: "3x12-15",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-crosshairs",
            category: "peito"
        }
    ],
    "costas": [
        {
            id: "costas-pulley-aberto",
            name: "Costas Pulley Aberto",
            muscle: "Costas",
            description: "Sente-se na máquina, segure a barra com as mãos afastadas. Puxe a barra em direção ao peito.",
            image: "/assets/img-msc/costas/pulley-aberto.gif",
            sets: "3x8-12",
            rest: "90s",
            intensity: "Alta",
            icon: "fas fa-arrow-down",
            category: "costas"
        },
        {
            id: "remada-baixa",
            name: "Remada baixa",
            muscle: "Costas",
            description: "Com os pés afastados, segure a barra com as palmas para baixo. Puxe a barra em direção ao abdômen.",
            image: "/assets/img-msc/costas/remada-baixa.gif",
            sets: "4x8-12",
            rest: "90s",
            intensity: "Alta",
            icon: "fas fa-arrows-alt-h",
            category: "costas"
        },
        {
            id: "pulley-neutro",
            name: "Pulley neutro",
            muscle: "Costas",
            description: "Sente-se na máquina, segure as alças com as palmas voltadas uma para a outra. Puxe as alças em direção ao abdômen, contraindo as costas, e volte devagar ao ponto inicial. Expire ao puxar, inspire ao soltar.",
            image: "/assets/img-msc/costas/pulley-neutro.gif",
            sets: "4x8-10",
            rest: "90s",
            intensity: "Alta",
            icon: "fas fa-arrows-alt-h",
            category: "costas"
        },
        {
            id: "remada-curvada",
            name: "Remada Curvada",
            muscle: "Costas",
            description: "Fique em pé, pés na largura dos ombros, segure a barra com braços estendidos. Incline o tronco à frente, mantendo costas retas. Puxe a barra em direção ao abdômen, contraindo as costas, e desça devagar. Expire ao puxar, inspire ao soltar.",
            image: "/assets/img-msc/costas/remada-curvada.gif",
            sets: "3x8-10",
            rest: "90s",
            intensity: "Alta",
            icon: "fas fa-arrows-alt-h",
            category: "costas"
        },
        {
            id: "barra-fixa",
            name: "Barra fixa",
            muscle: "Costas",
            description: "Segure a barra com as mãos afastadas, palmas voltadas para frente (ou para você, se for pegada supinada). Puxe o corpo até o queixo passar da barra, mantendo o peito aberto e os ombros para baixo. Desça devagar e controlado. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/costas/barra-fixa.gif",
            sets: "4x8-10",
            rest: "90s",
            intensity: "Alta",
            icon: "fas fa-arrows-alt-h",
            category: "costas"
        },
        {
            id: "levantamento-terra",
            name: "Levantamento Terra",
            muscle: "Costas",
            description: "Fique em pé com os pés na largura dos ombros, barra à frente. Flexione os quadris e joelhos, segure a barra com firmeza. Levante a barra mantendo costas retas, quadril e ombros subindo juntos. Desça controlando o movimento. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/costas/levantamento-terra.gif",
            sets: "3x3-4",
            rest: "90s",
            intensity: "Alta",
            icon: "fas fa-arrows-alt-h",
            category: "costas"
        },
        {
            id: "costas-pull-down",
            name: "Costas Pull Down",
            muscle: "Costas",
            description: "Sente-se na máquina, segure a barra com as mãos afastadas, costas retas. Puxe a barra até a altura do peito, contraindo as costas, e suba devagar controlando o movimento. Expire ao puxar, inspire ao soltar.",
            image: "/assets/img-msc/costas/costas-pull-down.gif",
            sets: "4x10-12",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-point-right",
            category: "costas"
        }
    ],
    "pernas": [
        {
            id: "agachamento-livre",
            name: "Agachamento livre",
            muscle: "Pernas",
            description: "Com os pés afastados, segure a barra sobre os ombros. Flexione os joelhos e desça como se fosse sentar.",
            image: "/assets/img-msc/perna/agachamento-livre.gif",
            sets: "3x8-10",
            rest: "120s",
            intensity: "Alta",
            icon: "fas fa-people-arrows",
            category: "pernas"
        },
        {
            id: "leg-press",
            name: "Leg Press",
            muscle: "Pernas",
            description: "Sente-se na máquina com os pés na plataforma. Empurre a plataforma até estender as pernas.",
            image: "/assets/img-msc/perna/leg45.gif",
            sets: "3x8-10",
            rest: "90s",
            intensity: "Média-Alta",
            icon: "fas fa-shoe-prints",
            category: "pernas"
        },
        {
            id: "bulgaro",
            name: "Bulgaro",
            muscle: "Pernas",
            description: "Coloque um pé atrás apoiado em um banco, o outro à frente firme no chão. Agache mantendo o tronco reto até o joelho da frente quase formar 90°, depois suba. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/perna/bulgaro.gif",
            sets: "4x10-12",
            rest: "90s",
            intensity: "Média-Alta",
            icon: "fas fa-shoe-prints",
            category: "pernas"
        },
        {
            id: "cadeira-flexora",
            name: "Cadeira flexora",
            muscle: "Pernas",
            description: "Sente-se na máquina, encaixe os tornozelos sob o rolo. Flexione os joelhos, levando os calcanhares em direção aos glúteos, e volte devagar à posição inicial. Expire ao dobrar, inspire ao estender.",
            image: "/assets/img-msc/perna/cadeira-flexora.gif",
            sets: "4x10-12",
            rest: "90s",
            intensity: "Média-Alta",
            icon: "fas fa-shoe-prints",
            category: "pernas"
        },
        {
            id: "panturrilha",
            name: "Panturrilha",
            muscle: "Pernas",
            description: "Fique em pé com os pés na largura dos ombros, eleve os calcanhares o máximo que conseguir e desça devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/perna/panturrilha.gif",
            sets: "3x10-12",
            rest: "90s",
            intensity: "Média-Alta",
            icon: "fas fa-shoe-prints",
            category: "pernas"
        },
        {
            id: "cadeira-extensora",
            name: "Cadeira Extensora",
            muscle: "Quadríceps",
            description: "Sente-se na máquina com os tornozelos apoiados. Estenda as pernas contra a resistência.",
            image: "/assets/img-msc/perna/cadeira-extensora.gif",
            sets: "3x12-15",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-arrow-up",
            category: "pernas"
        }
    ],
    "ombros": [
        {
            id: "desenvolvimento-halteres",
            name: "Desenvolvimento com halteres",
            muscle: "Ombros",
            description: "Sente-se com as costas retas, segure os halteres ou barra na altura dos ombros. Empurre para cima até estender os braços sem travar os cotovelos e desça devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/ombro/desenvolvimento-halteres.gif",
            sets: "4x8-12",
            rest: "90s",
            intensity: "Média-Alta",
            icon: "fas fa-arrow-up",
            category: "ombros"
        },
        {
            id: "crucifixo-reverso",
            name: "Crucifixo reverso",
            muscle: "Ombros",
            description: "Sente-se na máquina com o peito apoiado, segure as alças com braços quase estendidos à frente. Abra os braços para trás, contraindo as costas, e volte devagar. Expire ao abrir, inspire ao retornar.",
            image: "/assets/img-msc/ombro/crucifixo-reverso.gif",
            sets: "4x8-12",
            rest: "90s",
            intensity: "Média-Alta",
            icon: "fas fa-arrow-up",
            category: "ombros"
        },
        {
            id: "elevacao-frontal",
            name: "Elevação frontal",
            muscle: "Ombros",
            description: "Segure halteres à frente das coxas, braços estendidos. Levante-os até a altura dos ombros, mantendo os cotovelos levemente dobrados, e desça devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/ombro/elevacao-frontal.gif",
            sets: "4x8-10",
            rest: "90s",
            intensity: "Média-Alta",
            icon: "fas fa-arrow-up",
            category: "ombros"
        },
        {
            id: "elevacao-lateral",
            name: "Elevação Lateral",
            muscle: "Ombros",
            description: "Em pé, segure halteres ao lado do corpo. Eleve os braços lateralmente até a altura dos ombros.",
            image: "/assets/img-msc/ombro/elevacao-lateral.gif",
            sets: "4x12-15",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-arrows-alt-h",
            category: "ombros"
        }
    ],
    "biceps": [
        {
            id: "rosca-direta-barra-w",
            name: "Rosca direta barra W",
            muscle: "Bíceps",
            description: "Em pé, segure a barra com as palmas para frente. Flexione os cotovelos trazendo a barra aos ombros.",
            image: "/assets/img-msc/biceps/rosca-direta-barra-w.gif",
            sets: "4x10-12",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-rock",
            category: "biceps"
        },
        {
            id: "rosca-alternada",
            name: "Rosca alternada",
            muscle: "Bíceps",
            description: "Segure um halter em cada mão, braços estendidos ao lado do corpo. Flexione um braço de cada vez, levando o halter ao ombro, e desça devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/biceps/rosca-alternada.gif",
            sets: "4x10-12",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-rock",
            category: "biceps"
        },
        {
            id: "rosca-direta-polia",
            name: "Rosca direta na polia",
            muscle: "Bíceps",
            description: "Segure a barra da polia com os braços estendidos e cotovelos fixos ao lado do corpo. Puxe a barra em direção aos ombros, contraindo os bíceps, e volte devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/biceps/rosca-direta-polia.gif",
            sets: "3x10-12",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-rock",
            category: "biceps"
        },
        {
            id: "rosca-martelo-polia",
            name: "Rosca martelo na polia",
            muscle: "Bíceps",
            description: "Segure a corda da polia com as palmas voltadas uma para a outra. Flexione os cotovelos, levando a corda aos ombros, e desça devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/biceps/rosca-martelo-polia.gif",
            sets: "3x10-12",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-rock",
            category: "biceps"
        },
        {
            id: "rosca-martelo",
            name: "Rosca Martelo",
            muscle: "Bíceps",
            description: "Em pé, segure halteres com as palmas voltadas uma para a outra. Flexione os cotovelos.",
            image: "/assets/img-msc/biceps/rosca-martelo.gif",
            sets: "3x10-12",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-gavel",
            category: "biceps"
        }
    ],
    "punho": [
        {
            id: "encolhimento-punho",
            name: "Encolhimento de punho",
            muscle: "Punho",
            description: "Segure halteres ou barra com os braços ao lado do corpo. Eleve apenas os ombros em direção às orelhas e desça devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/punho/encolhimento-punho.gif",
            sets: "4x10-15",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-rock",
            category: "punho"
        },
        {
            id: "rosca-inversa",
            name: "Rosca inversa",
            muscle: "Punho",
            description: "Segure a barra ou halteres com as palmas voltadas para baixo. Flexione os cotovelos, levando o peso aos ombros, e desça devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/punho/rosca-inversa.gif",
            sets: "4x10-12",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-rock",
            category: "punho"
        },
        {
            id: "rosca-invertida",
            name: "Rosca invertida",
            muscle: "Punho",
            description: "Segure barra ou halteres com as palmas voltadas para baixo. Flexione os cotovelos, levando o peso aos ombros, mantendo os pulsos firmes, e desça devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/punho/rosca-invertida.gif",
            sets: "4x10-12",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-rock",
            category: "punho"
        },
        {
            id: "rosca-punho",
            name: "Rosca punho",
            muscle: "Punho",
            description: "Segure halteres ou barra com os braços apoiados e mãos voltadas para cima (ou para baixo, dependendo da variação). Flexione apenas os punhos, elevando o peso, e desça devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/punho/rosca-punho.gif",
            sets: "3x12-15",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-rock",
            category: "punho"
        }
    ],
    "triceps": [
        {
            id: "pushdown",
            name: "Pushdown",
            muscle: "Tríceps",
            description: "Segure a barra ou corda da polia com os cotovelos junto ao corpo. Empurre para baixo até os braços ficarem quase estendidos e volte devagar. Expire ao descer a barra, inspire ao subir.",
            image: "/assets/img-msc/triceps/pushdown.gif",
            sets: "3x10-15",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-point-up",
            category: "triceps"
        },
        {
            id: "triceps-frances",
            name: "Triceps frances",
            muscle: "Tríceps",
            description: "Segure um halter ou barra acima da cabeça, braços estendidos. Flexione os cotovelos levando o peso atrás da cabeça e estenda os braços devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/triceps/triceps-frances.gif",
            sets: "4x10-12",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-point-up",
            category: "triceps"
        },
        {
            id: "supino-fechado-halteres",
            name: "Supino fechado com halteres",
            muscle: "Tríceps",
            description: "Deite no banco, segure os halteres com as mãos próximas uma da outra. Abaixe-os até o peito e empurre de volta, mantendo os cotovelos perto do corpo. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/triceps/supino-fechado-com-halteres.gif",
            sets: "3x10-12",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-hand-point-up",
            category: "triceps"
        },
        {
            id: "rosca-testa-halteres",
            name: "Rosca testa com halteres",
            muscle: "Tríceps",
            description: "Deite no banco, segure os halteres com os braços estendidos acima do peito. Flexione os cotovelos, levando os halteres em direção à testa, e estenda devagar. Expire ao subir, inspire ao descer.",
            image: "/assets/img-msc/triceps/rosca-testa-com-halteres.gif",
            sets: "3x12-15",
            rest: "60s",
            intensity: "Média",
            icon: "fas fa-arrows-alt-v",
            category: "triceps"
        }
    ]
};

// Estado da aplicação
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

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏋️‍♂️ NextTreino Iniciando...");
    
    // Pré-carrega imagens importantes
    preloadImportantImages();
    
    // Verifica a estrutura do servidor
    checkServerStructure();
    
    // Carrega dados salvos
    loadSavedData();
    
    // Configura todos os eventos
    setupAllEventListeners();
    
    // Inicializa a página inicial
    updateHomePage();
    
    console.log("✅ NextTreino Pronto!");
});

// Nova função para verificar estrutura do servidor
function checkServerStructure() {
    console.log("🔍 Verificando estrutura do servidor...");
    
    // Verifica se a imagem padrão existe
    checkImageExists('/assets/default-exercise.gif', function(exists) {
        if (!exists) {
            console.warn('⚠️ Imagem padrão não encontrada em /assets/default-exercise.gif');
            console.log('💡 Criando fallback para imagem padrão...');
        }
    });
    
    // Verifica uma imagem de exemplo
    checkImageExists('/assets/img-msc/peito/supino-reto.gif', function(exists) {
        console.log(exists ? 
            '✅ Estrutura de imagens OK' : 
            '⚠️ Verifique se a pasta /assets/img-msc/ existe no servidor'
        );
    });
}

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
        // Inicializa arrays vazios
        customWorkouts = [];
        favoriteExercises = [];
    }
}

// ======================
// CONFIGURAÇÃO DE EVENTOS
// ======================

function setupAllEventListeners() {
    console.log("🔌 Configurando eventos...");
    
    // Menu Lateral
    document.getElementById('menu-btn').addEventListener('click', openMenu);
    document.getElementById('close-menu').addEventListener('click', closeMenu);
    document.getElementById('menu-overlay').addEventListener('click', closeMenu);
    
    // Navegação do Menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.dataset.page;
            
            // Atualiza item ativo
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Navega para a página
            navigateToPage(pageId);
        });
    });
    
    // Página Inicial
    document.getElementById('quick-start').addEventListener('click', function() {
        if (currentWorkout) {
            navigateToPage('page-train');
        } else {
            showMessage('Crie um treino primeiro!', 'warning');
            navigateToPage('page-create');
        }
    });
    
    document.getElementById('quick-create').addEventListener('click', function() {
        navigateToPage('page-create');
    });
    
    document.getElementById('edit-workout').addEventListener('click', function() {
        if (currentWorkout) {
            editWorkout(currentWorkout.id);
        } else {
            navigateToPage('page-create');
        }
    });
    
    document.getElementById('start-workout').addEventListener('click', function() {
        if (currentWorkout) {
            navigateToPage('page-train');
        } else {
            showMessage('Selecione um treino primeiro!', 'warning');
        }
    });
    
    // Página Criar Treino
    document.getElementById('workout-name').addEventListener('input', updateCharCount);
    document.getElementById('cancel-create').addEventListener('click', cancelCreation);
    document.getElementById('save-workout-btn').addEventListener('click', saveWorkout);
    
    // Página Meus Treinos
    document.getElementById('new-workout-btn').addEventListener('click', function() {
        navigateToPage('page-create');
    });
    
    document.getElementById('create-first-workout').addEventListener('click', function() {
        navigateToPage('page-create');
    });
    
    // Página Favoritos
    document.getElementById('clear-favorites-btn').addEventListener('click', clearFavorites);
    
    // Página Treinar
    document.getElementById('carousel-prev').addEventListener('click', prevExercise);
    document.getElementById('carousel-next').addEventListener('click', nextExercise);
    document.getElementById('prev-exercise-btn').addEventListener('click', prevExercise);
    document.getElementById('next-exercise-btn').addEventListener('click', nextExercise);
    document.getElementById('start-rest-btn').addEventListener('click', startRestTimer);
    document.getElementById('complete-btn').addEventListener('click', completeExercise);
    
    // Timer
    document.getElementById('timer-pause').addEventListener('click', toggleTimer);
    document.getElementById('timer-reset').addEventListener('click', resetTimer);
    document.getElementById('timer-skip').addEventListener('click', skipTimer);
    document.getElementById('timer-close').addEventListener('click', closeTimer);
    document.getElementById('timer-btn').addEventListener('click', function() {
        if (isRestTimerActive) showTimer();
    });
    
    // Modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    
    console.log("✅ Eventos configurados");
}

// ======================
// NAVEGAÇÃO
// ======================

function navigateToPage(pageId) {
    console.log(`➡️ Navegando para: ${pageId}`);
    
    // Esconde todas as páginas
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    // Mostra a página solicitada
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
        
        // Atualizações específicas por página
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
            default:
                console.warn(`⚠️ Página desconhecida: ${pageId}`);
        }
    } else {
        console.error(`❌ Página não encontrada: ${pageId}`);
        // Fallback para página inicial
        document.getElementById('page-home').classList.add('active');
        updateHomePage();
    }
}

function openMenu() {
    document.getElementById('side-menu').classList.add('active');
    document.getElementById('menu-overlay').classList.add('active');
}

function closeMenu() {
    document.getElementById('side-menu').classList.remove('active');
    document.getElementById('menu-overlay').classList.remove('active');
}

// ======================
// PÁGINA INICIAL
// ======================

function updateHomePage() {
    console.log("🏠 Atualizando página inicial...");
    
    // Atualiza card do treino atual
    const title = document.getElementById('current-workout-title');
    const count = document.getElementById('current-workout-count');
    const desc = document.getElementById('current-workout-desc');
    const editBtn = document.getElementById('edit-workout');
    const startBtn = document.getElementById('start-workout');
    
    if (currentWorkout) {
        title.textContent = currentWorkout.name;
        count.textContent = `${currentWorkout.exercises.length} exercícios`;
        desc.textContent = 'Pronto para começar!';
        editBtn.disabled = false;
        startBtn.disabled = false;
        
        // Adiciona classe de destaque
        document.getElementById('current-workout-card').classList.add('featured');
    } else {
        title.textContent = 'Nenhum treino';
        count.textContent = '0 exercícios';
        desc.textContent = 'Crie ou selecione um treino para começar';
        editBtn.disabled = true;
        startBtn.disabled = true;
        
        // Remove classe de destaque
        document.getElementById('current-workout-card').classList.remove('featured');
    }
    
    // Atualiza lista de treinos recentes
    updateRecentWorkouts();
}

function updateRecentWorkouts() {
    const recentList = document.getElementById('recent-list');
    
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
    
    // Mostra até 3 treinos recentes
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
    
    // Reseta seleção
    selectedExercises = [];
    
    // Carrega categorias
    loadCategories();
    
    // Carrega exercícios
    loadExercises();
    
    // Atualiza contador de caracteres
    updateCharCount();
    
    // Atualiza lista selecionada
    updateSelectedList();
}

function loadCategories() {
    const container = document.getElementById('category-tags');
    const categories = [
        { id: "todos", name: "Todos" },
        { id: "peito", name: "Peito" },
        { id: "costas", name: "Costas" },
        { id: "pernas", name: "Pernas" },
        { id: "ombros", name: "Ombros" },
        { id: "biceps", name: "Bíceps" },
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
    
    // Filtra exercícios
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
        
        // USANDO fixImagePath para garantir caminho correto
        const imagePath = fixImagePath(exercise.image);
        
        card.innerHTML = `
            <div class="exercise-card-image">
                <img src="${imagePath}" alt="${exercise.name}" loading="lazy"
                     onerror="handleImageError(this)"
                     data-original-src="${exercise.image}">
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
        // Remove da seleção
        selectedExercises.splice(index, 1);
    } else {
        // Adiciona à seleção
        selectedExercises.push({...exercise});
    }
    
    updateSelectedList();
    loadExercises(); // Atualiza visualização
}

function updateSelectedList() {
    const list = document.getElementById('selected-list');
    const count = document.getElementById('selected-count');
    
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
    count.textContent = `${input.value.length}/50`;
}

function cancelCreation() {
    if (selectedExercises.length > 0) {
        showConfirm(
            'Cancelar criação',
            'Tem certeza? Sua seleção será perdida.',
            () => {
                selectedExercises = [];
                document.getElementById('workout-name').value = '';
                navigateToPage('page-home');
            }
        );
    } else {
        navigateToPage('page-home');
    }
}

function saveWorkout() {
    const nameInput = document.getElementById('workout-name');
    const workoutName = nameInput.value.trim();
    
    // Validação do nome
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
    
    // Verifica se já existe treino com mesmo nome
    const existingWorkout = customWorkouts.find(w => 
        w.name.toLowerCase() === workoutName.toLowerCase()
    );
    
    if (existingWorkout) {
        showConfirm(
            'Treino existente',
            `Já existe um treino chamado "${workoutName}". Deseja substituí-lo?`,
            () => {
                // Remove o existente e continua
                customWorkouts = customWorkouts.filter(w => w.id !== existingWorkout.id);
                finishSavingWorkout(workoutName);
            }
        );
        return;
    }
    
    finishSavingWorkout(workoutName);
}

function finishSavingWorkout(workoutName) {
    // Cria novo treino
    const newWorkout = {
        id: Date.now().toString(),
        name: workoutName,
        exercises: [...selectedExercises],
        createdAt: new Date().toISOString(),
        lastUsed: null,
        isFavorite: false
    };
    
    console.log("💾 Salvando treino:", newWorkout);
    
    // Adiciona à lista de treinos
    customWorkouts.unshift(newWorkout);
    
    // Salva no localStorage
    try {
        localStorage.setItem('NextTreinoWorkouts', JSON.stringify(customWorkouts));
        
        // Define como treino atual
        currentWorkout = newWorkout;
        localStorage.setItem('NextTreinoCurrent', JSON.stringify(newWorkout));
        
        // Limpa formulário
        selectedExercises = [];
        document.getElementById('workout-name').value = '';
        updateCharCount();
        updateSelectedList();
        
        // Redireciona para a página de treino
        showMessage(`Treino "${workoutName}" criado com sucesso!`, 'success');
        navigateToPage('page-train');
        
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        showMessage('Erro ao salvar treino. Espaço de armazenamento pode estar cheio.', 'error');
    }
}

// ======================
// PÁGINA MEUS TREINOS
// ======================

function updateWorkoutsPage() {
    const list = document.getElementById('workouts-list');
    const empty = document.getElementById('empty-workouts');
    
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
        
        // Botão Treinar
        item.querySelector('.train-action').addEventListener('click', function(e) {
            e.stopPropagation();
            loadWorkout(this.dataset.id);
        });
        
        // Botão Editar
        item.querySelector('.edit-action').addEventListener('click', function(e) {
            e.stopPropagation();
            editWorkout(this.dataset.id);
        });
        
        // Botão Excluir
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
    
    // Define como treino atual
    currentWorkout = workout;
    localStorage.setItem('NextTreinoCurrent', JSON.stringify(workout));
    
    // Atualiza data de último uso
    workout.lastUsed = new Date().toISOString();
    localStorage.setItem('NextTreinoWorkouts', JSON.stringify(customWorkouts));
    
    // Vai para a página de treino
    showMessage(`Treino "${workout.name}" carregado!`, 'success');
    navigateToPage('page-train');
}

function editWorkout(workoutId) {
    const workout = customWorkouts.find(w => w.id === workoutId);
    if (!workout) {
        showMessage('Treino não encontrado!', 'error');
        return;
    }
    
    // Preenche formulário
    document.getElementById('workout-name').value = workout.name;
    selectedExercises = [...workout.exercises];
    
    // Remove da lista (será recriado)
    customWorkouts = customWorkouts.filter(w => w.id !== workoutId);
    localStorage.setItem('NextTreinoWorkouts', JSON.stringify(customWorkouts));
    
    // Vai para página de criação
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
            
            // Se for o treino atual, limpa
            if (currentWorkout && currentWorkout.id === workoutId) {
                currentWorkout = null;
                localStorage.removeItem('NextTreinoCurrent');
            }
            
            // Salva alterações
            localStorage.setItem('NextTreinoWorkouts', JSON.stringify(customWorkouts));
            
            // Atualiza UI
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
            // Usa o primeiro treino disponível
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
    
    // Atualiza informações
    document.getElementById('training-workout-name').textContent = currentWorkout.name;
    
    // Reinicia índice
    currentExerciseIndex = 0;
    
    // Atualiza carrossel
    updateTrainingCarousel();
    
    // Atualiza detalhes do exercício atual
    updateCurrentExercise();
}

function updateTrainingCarousel() {
    const carousel = document.getElementById('training-carousel');
    const indicators = document.getElementById('carousel-indicators');
    
    // Limpa
    carousel.innerHTML = '';
    indicators.innerHTML = '';
    
    // Adiciona slides
    currentWorkout.exercises.forEach((exercise, index) => {
        // Slide
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === currentExerciseIndex ? 'active' : ''}`;
        
        // USANDO fixImagePath
        const imagePath = fixImagePath(exercise.image);
        
        slide.innerHTML = `
            <img src="${imagePath}" alt="${exercise.name}" class="exercise-image"
                 onerror="handleImageError(this)"
                 data-original-src="${exercise.image}">
            <div class="slide-overlay">
                <h3>${exercise.name}</h3>
                <p>${exercise.muscle}</p>
            </div>
        `;
        
        carousel.appendChild(slide);
        
        // Indicador
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
    
    // Atualiza detalhes
    document.getElementById('exercise-name').textContent = exercise.name;
    document.getElementById('exercise-muscle').textContent = exercise.muscle;
    document.getElementById('exercise-sets').textContent = exercise.sets;
    document.getElementById('exercise-rest').textContent = exercise.rest;
    document.getElementById('exercise-intensity').textContent = exercise.intensity;
    document.getElementById('exercise-description').textContent = exercise.description;
    
    // Atualiza contador
    document.getElementById('exercise-counter').textContent = 
        `${currentExerciseIndex + 1}/${currentWorkout.exercises.length}`;
    
    // Configura timer
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
    
    // Adiciona aos favoritos (se não estiver)
    const isFavorite = favoriteExercises.some(fav => fav.id === exercise.id);
    if (!isFavorite) {
        favoriteExercises.unshift({...exercise});
        localStorage.setItem('NextTreinoFavorites', JSON.stringify(favoriteExercises));
    }
    
    showMessage(`${exercise.name} concluído! ✅`, 'success');
    
    // Vai para próximo
    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
        currentExerciseIndex++;
        updateCarouselView();
        updateCurrentExercise();
        
        // Inicia descanso automaticamente
        setTimeout(() => startRestTimer(), 500);
    } else {
        showMessage('🎉 Treino concluído! Parabéns!', 'success');
    }
}

// ======================
// TIMER
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
    
    // Configura timer
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
    document.getElementById('rest-timer').classList.add('active');
}

function closeTimer() {
    document.getElementById('rest-timer').classList.remove('active');
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
    
    document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0');
}

function toggleTimer() {
    const btn = document.getElementById('timer-pause');
    
    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
        btn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        startTimer();
        btn.innerHTML = '<i class="fas fa-pause"></i>';
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
        
        // USANDO fixImagePath
        const imagePath = fixImagePath(exercise.image);
        
        card.innerHTML = `
            <div class="favorite-card-image">
                <img src="${imagePath}" alt="${exercise.name}"
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
    
    // Configura conteúdo
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Remove listener antigo
    const newConfirm = modalConfirm.cloneNode(true);
    modalConfirm.parentNode.replaceChild(newConfirm, modalConfirm);
    
    // Configura novo listener
    document.getElementById('modal-confirm').addEventListener('click', function() {
        closeModal();
        if (callback) callback();
    });
    
    // Mostra modal
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('confirm-modal').classList.remove('active');
}

function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    
    messageEl.textContent = text;
    messageEl.className = `message message-${type} show`;
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

// ======================
// INICIALIZAÇÃO FINAL
// ======================

// Configura evento de teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') prevExercise();
    if (e.key === 'ArrowRight') nextExercise();
    if (e.key === 'Escape') {
        closeTimer();
        closeMenu();
        closeModal();
    }
});

console.log("✅ Aplicativo totalmente funcional com correções de imagem!");