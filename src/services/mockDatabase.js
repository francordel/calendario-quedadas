// mockDatabase.js

// Generate a random calendar ID with a readable format
export const generateCalendarId = () => {
  const adjectives = [
    'amazing', 'bright', 'creative', 'dynamic', 'elegant', 'fantastic', 'gorgeous', 'happy',
    'incredible', 'joyful', 'kind', 'lovely', 'magnificent', 'nice', 'outstanding', 'perfect',
    'quality', 'radiant', 'stunning', 'terrific', 'unique', 'vibrant', 'wonderful', 'excellent'
  ];
  
  const nouns = [
    'calendar', 'meeting', 'event', 'schedule', 'planner', 'organizer', 'agenda', 'timeline',
    'gather', 'connect', 'sync', 'plan', 'book', 'date', 'time', 'slot', 'space', 'room',
    'session', 'appointment', 'conference', 'group', 'team', 'project'
  ];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomAdjective}-${randomNoun}-${randomNumber}`;
};

// Mock calendar data (password functionality removed)
export const mockSelections = {
    'calendario1': {
        createdAt: new Date().toISOString(),
        users: [
            {
                userId: "usuario1",
                selectedDays: {
                    green: [
                        new Date(2025, 0, 15).toDateString(), 
                        new Date(2025, 0, 16).toDateString(), 
                        new Date(2025, 0, 20).toDateString()  
                    ],
                    red: [
                        new Date(2025, 0, 10).toDateString(),
                        new Date(2025, 0, 11).toDateString()
                    ],
                    orange: [
                        new Date(2025, 0, 18).toDateString()
                    ]
                }
            },
            {
                userId: "usuario2",
                selectedDays: {
                    green: [
                        new Date(2025, 0, 15).toDateString(), 
                        new Date(2025, 0, 20).toDateString()  
                    ],
                    red: [
                        new Date(2025, 0, 11).toDateString()
                    ],
                    orange: [
                        new Date(2025, 0, 16).toDateString()
                    ]
                }
            }
        ]
    },
    'calendario2': {
        createdAt: new Date().toISOString(),
        users: []
    }
};

// Actualizamos la variable mockDatabase
let mockDatabase = {...mockSelections};

// Función para verificar si existe el calendario
export const calendarExists = (calendarId) => {
    return mockDatabase[calendarId] !== undefined;
};

// Función para crear un nuevo calendario (sin contraseña)
export const createCalendar = async (calendarId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate async
        mockDatabase[calendarId] = {
            createdAt: new Date().toISOString(),
            users: []
        };
        return { success: true, calendarId };
    } catch (error) {
        console.error("❌ Error creating calendar:", error);
        return { success: false, error: error.message };
    }
};

// Generate a unique calendar ID by checking if it already exists
export const generateUniqueCalendarId = async (maxAttempts = 10) => {
    console.log("🎲 Generando ID único de calendario (mock)");
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const calendarId = generateCalendarId();
        console.log(`📝 Intento ${attempt}: ${calendarId}`);
        
        try {
            if (!calendarExists(calendarId)) {
                console.log("✅ ID único encontrado:", calendarId);
                return { success: true, calendarId };
            }
            console.log("⚠️ ID ya existe, generando otro...");
        } catch (err) {
            console.error(`❌ Error verificando ID en intento ${attempt}:`, err);
        }
    }
    
    console.error("❌ No se pudo generar un ID único después de", maxAttempts, "intentos");
    return { success: false, error: "No se pudo generar un ID único" };
};

// Password functionality removed - calendars are now open access

// Guardado de selecciones (actualizado según la nueva estructura)
export const saveUserSelections = async (userId, calendarId, selectedDays) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Aseguramos que exista el calendario
        if (!calendarExists(calendarId)) {
            console.error('El calendario no existe.');
            return false;
        }

        const calendarData = mockDatabase[calendarId];
        // Buscamos si existe el usuario en este calendario
        const existingUserIndex = calendarData.users.findIndex(
            user => user.userId === userId
        );

        if (existingUserIndex !== -1) {
            // Actualizamos usuario existente
            calendarData.users[existingUserIndex].selectedDays = selectedDays;
            console.log('Selecciones actualizadas para usuario:', userId);
        } else {
            // Creamos nuevo usuario
            const newSelection = {
                userId,
                selectedDays
            };
            calendarData.users.push(newSelection);
            console.log('Nuevo usuario añadido:', newSelection);
        }

        return true;
    } catch (error) {
        console.error('Error al guardar las selecciones:', error);
        return false;
    }
};

// Función para obtener selecciones
export const fetchCalendarSelections = async (calendarId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return calendarExists(calendarId) ? mockDatabase[calendarId].users : [];
};
