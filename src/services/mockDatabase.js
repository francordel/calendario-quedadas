// mockDatabase.js

// Añadimos un objeto que guardará la info de cada calendario, incluida la contraseña.
// Ahora cada entrada de mockDatabase contendrá un objeto con el array de usuarios y la password.
export const mockSelections = {
    'calendario1': {
        password: '1234', // Contraseña existente para calendario1 (ejemplo)
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
        password: 'abcd', // Otra contraseña de ejemplo
        users: []
    }
};

// Actualizamos la variable mockDatabase
let mockDatabase = {...mockSelections};

// Función para verificar si existe el calendario
export const calendarExists = (calendarId) => {
    return mockDatabase[calendarId] !== undefined;
};

// Función para crear un nuevo calendario
export const createCalendar = (calendarId, password) => {
    mockDatabase[calendarId] = {
        password,
        users: []
    };
};

// Función para comprobar la contraseña
export const checkCalendarPassword = (calendarId, password) => {
    if (!calendarExists(calendarId)) return false;
    return mockDatabase[calendarId].password === password;
};

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
