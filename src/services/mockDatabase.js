// Datos de prueba simulados
export const mockSelections = {
    'calendario1': [
        {
            userId: "usuario1",
            selectedDays: {
                green: [
                    new Date(2025, 0, 15).toDateString(), // 15 de enero
                    new Date(2025, 0, 16).toDateString(), // 16 de enero
                    new Date(2025, 0, 20).toDateString()  // 20 de enero
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
                    new Date(2025, 0, 15).toDateString(), // 15 de enero
                    new Date(2025, 0, 20).toDateString()  // 20 de enero
                ],
                red: [
                    new Date(2025, 0, 11).toDateString()
                ],
                orange: [
                    new Date(2025, 0, 16).toDateString()
                ]
            }
        }
    ],
    'calendario2': [
        // Puedes añadir más datos de prueba para otro calendario
    ]
};

// Inicializamos la base de datos como un objeto, no como array
let mockDatabase = {...mockSelections};
/*
  // Función para guardar las selecciones del usuario
  export const saveUserSelections = async (calendarId, selectedDays) => {
    try {
      // Aquí deberías implementar la lógica para guardar en tu backend
      // Por ejemplo, usando Firebase, una API REST, etc.
      await fetch('/api/calendar/selections', {
        method: 'POST',
        body: JSON.stringify({
          calendarId,
          selectedDays
        })
      });
    } catch (error) {
      console.error('Error al guardar las selecciones:', error);
    }
  };
  */
  
  // Función simulada que guarda las selecciones en nuestra "base de datos" mock
  // Función para guardar selecciones
export const saveUserSelections = async (userId, calendarId, selectedDays) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Aseguramos que existe el array para este calendario
        if (!mockDatabase[calendarId]) {
            mockDatabase[calendarId] = [];
        }

        // Buscamos si existe el usuario en este calendario
        const existingUserIndex = mockDatabase[calendarId].findIndex(
            user => user.userId === userId
        );

        if (existingUserIndex !== -1) {
            // Actualizamos usuario existente
            mockDatabase[calendarId][existingUserIndex].selectedDays = selectedDays;
            console.log('Selecciones actualizadas para usuario:', mockDatabase[calendarId][existingUserIndex]);
            console.log('Selecciones actualizadas para usuario:', calendarId);
        } else {
            // Creamos nuevo usuario
            const newSelection = {
                userId,
                selectedDays
            };
            mockDatabase[calendarId].push(newSelection);
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
    return mockDatabase[calendarId] || [];
};