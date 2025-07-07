// Pastel color palette for users
const getUserColor = (userName, isCurrentUser = false) => {
  const pastelColors = [
    { bg: '#FFE4E1', text: '#8B0000', border: '#FFB6C1' }, // Light Pink
    { bg: '#E6E6FA', text: '#4B0082', border: '#DDA0DD' }, // Light Lavender
    { bg: '#F0FFFF', text: '#008B8B', border: '#AFEEEE' }, // Light Cyan
    { bg: '#F5FFFA', text: '#006400', border: '#98FB98' }, // Light Mint
    { bg: '#FFFAF0', text: '#FF8C00', border: '#FFDEAD' }, // Light Peach
    { bg: '#F0F8FF', text: '#1E90FF', border: '#87CEEB' }, // Light Blue
    { bg: '#FFF8DC', text: '#B8860B', border: '#F0E68C' }, // Light Yellow
    { bg: '#F5F5DC', text: '#8B4513', border: '#DEB887' }, // Light Beige
  ];

  if (isCurrentUser) {
    return { bg: '#E3F2FD', text: '#1976D2', border: '#90CAF9' }; // Current user blue
  }

  const hash = userName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return pastelColors[Math.abs(hash) % pastelColors.length];
};

// Genera los eventos a partir de los días seleccionados
export const generateEvents = (currentUserDays, handleEventClick, allUsers = [], currentUserName = '') => {
    console.log("Generando eventos para todos los usuarios...");
    const newEvents = [];
    
    // Add current user's events
    if (currentUserDays) {
      Object.entries(currentUserDays).forEach(([key, dates]) => {
        dates.forEach((date) => {
          newEvents.push({
            start: new Date(date),
            end: new Date(date),
            title: `${currentUserName} (Tú)`,
            type: key,
            className: `event-${key} current-user`,
            isCurrentUser: true,
            userName: currentUserName,
            resource: {
              type: key,
              icon: key === "green" ? "✓" : key === "red" ? "✗" : "?",
              description: key === "green" ? "Disponible para reunirse" : 
                         key === "red" ? "No disponible" : "Disponible con esfuerzo",
              isCurrentUser: true
            }
          });
        });
      });
    }
    
    // Add other users' events
    allUsers.forEach((user) => {
      if (user.userId !== currentUserName && user.selectedDays) {
        Object.entries(user.selectedDays).forEach(([key, dates]) => {
          dates.forEach((date) => {
            newEvents.push({
              start: new Date(date),
              end: new Date(date),
              title: user.userId,
              type: key,
              className: `event-${key} other-user`,
              isCurrentUser: false,
              userName: user.userId,
              resource: {
                type: key,
                icon: key === "green" ? "✓" : key === "red" ? "✗" : "?",
                description: key === "green" ? "Disponible para reunirse" : 
                           key === "red" ? "No disponible" : "Disponible con esfuerzo",
                isCurrentUser: false
              }
            });
          });
        });
      }
    });
    
    return newEvents;
};
      
  
    
  
  // Establece los estilos y las acciones de los eventos
export const eventStyleGetter = (event) => {
    const userColors = getUserColor(event.userName, event.isCurrentUser);
    
    // Responsive sizing based on screen width
    const getResponsiveStyles = () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const isDesktop = window.innerWidth > 1024;
      
      if (isMobile) {
        return {
          fontSize: event.isCurrentUser ? "11px" : "10px",
          padding: "4px 6px",
          minHeight: "24px",
          borderRadius: "12px",
          borderWidth: "1px",
        };
      } else if (isTablet) {
        return {
          fontSize: event.isCurrentUser ? "13px" : "12px",
          padding: "6px 8px",
          minHeight: "32px",
          borderRadius: "14px",
          borderWidth: "2px",
        };
      } else {
        // Desktop and larger screens
        return {
          fontSize: event.isCurrentUser ? "15px" : "13px",
          padding: "8px 12px",
          minHeight: "36px",
          borderRadius: "16px",
          borderWidth: "2px",
        };
      }
    };
    
    const responsiveStyles = getResponsiveStyles();
    
    const baseStyle = {
      border: `${responsiveStyles.borderWidth} solid ${userColors.border}`,
      borderRadius: responsiveStyles.borderRadius,
      color: userColors.text,
      backgroundColor: userColors.bg,
      fontWeight: event.isCurrentUser ? "700" : "600",
      fontSize: responsiveStyles.fontSize,
      textAlign: "center",
      padding: responsiveStyles.padding,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: event.isCurrentUser ? 
        "0 6px 20px rgba(25, 118, 210, 0.3)" : 
        "0 3px 12px rgba(0, 0, 0, 0.1)",
      pointerEvents: "auto",
      zIndex: event.isCurrentUser ? 10 : 5,
      transform: event.isCurrentUser ? "scale(1.05)" : "scale(1)",
      minHeight: responsiveStyles.minHeight,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textShadow: "none",
      lineHeight: "1.2",
      wordBreak: "break-word",
      maxWidth: "100%",
    };

    return { 
      style: baseStyle,
      className: `rbc-event ${event.className || ''}`
    };
  };
  
  
  // Obtiene la configuración para los días pasados
  export const dayPropGetter = (date) => {
    const today = new Date();
    const isPast = date < today.setHours(0, 0, 0, 0);
    const isToday = date.toDateString() === today.toDateString();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
    let className = '';
    let style = {
      position: 'relative',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (isPast) {
      className += 'past-day ';
      style = {
        ...style,
        background: 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
        color: '#94a3b8',
        pointerEvents: 'none',
      };
    } else if (isToday) {
      className += 'today ';
      style = {
        ...style,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        border: '2px solid #667eea',
        fontWeight: '600',
      };
    } else if (isWeekend) {
      className += 'weekend ';
      style = {
        ...style,
        background: 'linear-gradient(145deg, rgba(252, 165, 165, 0.05), rgba(254, 202, 202, 0.05))',
      };
    }
  
    return {
      style,
      className: className.trim(),
    };
  };
  