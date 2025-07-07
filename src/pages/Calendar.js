import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { es } from "date-fns/locale";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { 
  Button, 
  Typography, 
  Box, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  IconButton,
  Paper,
  Container,
  Stack,
  Chip,
  Breadcrumbs,
  Link,
  TextField
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Share as ShareIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  ContentCopy as CopyIcon
} from "@mui/icons-material";
import "./Calendar.css";

// Importamos las funciones de utilidad
import { generateEvents, eventStyleGetter, dayPropGetter } from './CalendarUtils';
import Recommendation from '../components/Recommendation';
import { saveUserSelections, getUserFromCalendar, fetchCalendarSelections } from '../services';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

function Calendar() {
  const { t } = useLanguage();
  const { calendarId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userName = queryParams.get('name');
  const [selectedDays, setSelectedDays] = useState({ green: [], red: [], orange: [] });
  const [events, setEvents] = useState([]);
  const [step, setStep] = useState(1);
  const [popupDate, setPopupDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [tempUserName, setTempUserName] = useState('');
  const [nameError, setNameError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  // Detect mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Check if user needs to enter their name
  useEffect(() => {
    if (!userName) {
      setShowNameDialog(true);
    }
  }, [userName]);

  // Load all users' data for the calendar
  useEffect(() => {
    const loadAllUsers = async () => {
      if (!calendarId) return;
      
      try {
        const users = await fetchCalendarSelections(calendarId);
        setAllUsers(users);
        
        // Update events to show all users' selections
        if (userName && selectedDays) {
          const updatedEvents = generateEvents(selectedDays, handleEventClick, users, userName);
          setEvents(updatedEvents);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadAllUsers();
  }, [calendarId, userName, selectedDays]);

  // Update events when current user's selections change
  useEffect(() => {
    if (userName && selectedDays) {
      const updatedEvents = generateEvents(selectedDays, handleEventClick, allUsers, userName);
      setEvents(updatedEvents);
    }
  }, [selectedDays, allUsers, userName]);

  // Force re-render of events on window resize for responsive styling
  useEffect(() => {
    const handleResize = () => {
      if (userName && selectedDays) {
        const updatedEvents = generateEvents(selectedDays, handleEventClick, allUsers, userName);
        setEvents(updatedEvents);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedDays, allUsers, userName]);

  const handleSelectSlot = ({ start }) => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (start >= today) {
      setPopupDate(start);
      setOpenDialog(true);
    }
  };

  // Enhanced date selection handling for all devices
  const handleDateClick = useCallback((event) => {
    // Handle both mobile and desktop clicks
    event.preventDefault();
    const clickedElement = event.target.closest('.rbc-date-cell');
    if (clickedElement) {
      const dateButton = clickedElement.querySelector('.rbc-button-link');
      if (dateButton) {
        const dateText = dateButton.textContent;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const selectedDate = new Date(currentYear, currentMonth, parseInt(dateText));
        
        const today = new Date().setHours(0, 0, 0, 0);
        if (selectedDate >= today) {
          setPopupDate(selectedDate);
          setOpenDialog(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Add both click and touch event listeners for universal compatibility
    const calendarElement = document.querySelector('.rbc-calendar');
    if (calendarElement) {
      calendarElement.addEventListener('click', handleDateClick);
      calendarElement.addEventListener('touchend', handleDateClick);
      
      return () => {
        calendarElement.removeEventListener('click', handleDateClick);
        calendarElement.removeEventListener('touchend', handleDateClick);
      };
    }
  }, [handleDateClick]);

  const handleDialogClose = () => {
    setPopupDate(null);
    setOpenDialog(false);
  };

  const handleDaySelection = (type) => {
    setSelectedDays((prev) => {
      const updated = { ...prev };
      const dateStr = popupDate.toDateString();

      // Eliminar la fecha de todos los estados previos
      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].filter((day) => day !== dateStr);
      });

      updated[type].push(dateStr);
      const updatedEvents = generateEvents(updated, handleEventClick, allUsers, userName);
      setEvents(updatedEvents);

      return updated;
    });
    handleDialogClose();
  };

  const handleEventClick = (eventDate) => {
    setPopupDate(eventDate);
    setOpenDialog(true);
  };

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      try {
        setIsLoading(true);
        await saveUserSelections(userName, calendarId, selectedDays);
        setShowRecommendation(true);
        // Show share dialog after completing voting
        setTimeout(() => {
          setShowShareDialog(true);
        }, 2000);
      } catch (error) {
        console.error("Error al guardar las selecciones:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate('/');
    }
  };

  const getSelectionCounts = () => {
    return {
      available: selectedDays.green.length,
      unavailable: selectedDays.red.length,
      maybe: selectedDays.orange.length
    };
  };

  const counts = getSelectionCounts();

  // Sharing functionality
  const getShareableLink = () => {
    return `${window.location.origin}/${calendarId}`;
  };

  const getShareMessage = () => {
    return `${t('shareMessage')}\n\n${t('joinCalendar')} "${calendarId}" ${t('shareMessageEnd')}\n\n${getShareableLink()}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareableLink());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      const textArea = document.createElement('textarea');
      textArea.value = getShareableLink();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const message = encodeURIComponent(getShareMessage());
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareTelegram = () => {
    const message = encodeURIComponent(getShareMessage());
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(getShareableLink())}&text=${message}`;
    window.open(telegramUrl, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Calendario de Quedadas',
          text: 'Te invito a coordinar nuestra reunión',
          url: getShareableLink(),
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const handleNameSubmit = async () => {
    if (!tempUserName.trim()) {
      setNameError(t('enterName'));
      return;
    }

    setIsLoading(true);
    setNameError('');

    try {
      // Check if user already exists in this calendar
      const existingUser = await getUserFromCalendar(calendarId, tempUserName.trim());
      
      if (existingUser && existingUser.selectedDays) {
        // User exists, load their existing data
        setSelectedDays(existingUser.selectedDays);
        const loadedEvents = generateEvents(existingUser.selectedDays, handleEventClick, allUsers, tempUserName.trim());
        setEvents(loadedEvents);
      }

      // Update URL to include the name
      navigate(`/${calendarId}?name=${encodeURIComponent(tempUserName.trim())}`, { replace: true });
      setShowNameDialog(false);
    } catch (error) {
      console.error('Error checking user:', error);
      setNameError(t('errorCheckingCalendar'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        position: "relative",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: { xs: 2, md: 3 },
            backgroundColor: "white",
            border: "1px solid #E5E5EA",
            borderRadius: 2,
          }}
        >
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2, fontSize: 14 }} separator="›">
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/')}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#007AFF",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              <HomeIcon sx={{ fontSize: 16 }} />
              {t('home')}
            </Link>
            <Typography color="text.primary" variant="body2">
              {calendarId}
            </Typography>
          </Breadcrumbs>

          {/* Header Content */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: "#1C1C1E",
                  mb: 0.5,
                  fontSize: { xs: "1.75rem", md: "2.125rem" }
                }}
              >
                {calendarId}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <PersonIcon sx={{ fontSize: 16, color: "#8E8E93" }} />
                <Typography variant="body2" color="#8E8E93">
                  {userName} • {t('step')} {step} {t('stepOf')} 2
                </Typography>
              </Stack>
              <Typography variant="body1" color="#616161" sx={{ maxWidth: 600 }}>
                {step === 1 ? t('stepOneDesc') : t('stepTwoDesc')}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => setShowShareDialog(true)}
                sx={{
                  backgroundColor: "#F0F9FF",
                  border: "1px solid #007AFF",
                  "&:hover": {
                    backgroundColor: "#E3F2FD",
                    borderColor: "#0056CC",
                  },
                  width: 44,
                  height: 44,
                }}
              >
                <ShareIcon sx={{ color: "#007AFF" }} />
              </IconButton>

              <IconButton
                onClick={handleBack}
                sx={{
                  backgroundColor: "#F5F5F5",
                  border: "1px solid #E0E0E0",
                  "&:hover": {
                    backgroundColor: "#EEEEEE",
                    borderColor: "#BDBDBD",
                  },
                  width: 44,
                  height: 44,
                }}
              >
                <ArrowBackIcon sx={{ color: "#424242" }} />
              </IconButton>
            </Stack>
          </Stack>

          {/* Status Chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            <Chip
              icon={<CheckIcon sx={{ fontSize: 16 }} />}
              label={`${t('available')} (${counts.available})`}
              size="small"
              sx={{
                backgroundColor: "#D4EDDA",
                color: "#155724",
                fontWeight: 500,
                "& .MuiChip-icon": { color: "#28A745" }
              }}
            />
            <Chip
              icon={<HelpIcon sx={{ fontSize: 16 }} />}
              label={`${t('maybe')} (${counts.maybe})`}
              size="small"
              sx={{
                backgroundColor: "#FFF3CD",
                color: "#856404",
                fontWeight: 500,
                "& .MuiChip-icon": { color: "#FF9500" }
              }}
            />
            <Chip
              icon={<CancelIcon sx={{ fontSize: 16 }} />}
              label={`${t('notAvailable')} (${counts.unavailable})`}
              size="small"
              sx={{
                backgroundColor: "#F8D7DA",
                color: "#721C24",
                fontWeight: 500,
                "& .MuiChip-icon": { color: "#FF3B30" }
              }}
            />
          </Stack>
        </Paper>

        {/* Calendar Section */}
        <Paper
          elevation={0}
          sx={{
            height: { xs: "500px", md: "600px", lg: "700px" },
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "white",
            border: "1px solid #E5E5EA",
            mb: 3,
          }}
        >
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable={true}
            onSelectSlot={handleSelectSlot}
            views={["month"]}
            style={{
              height: "100%",
              width: "100%",
              fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
            }}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            components={{
              toolbar: (props) => {
                return (
                  <Box className="calendar-month-nav" sx={{ p: 3 }}>
                    <IconButton
                      onClick={() => props.onNavigate("PREV")}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 3,
                        backgroundColor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        color: 'text.primary',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          borderColor: 'text.secondary',
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                      }}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>
                    
                    <Typography 
                      sx={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: 'text.primary !important',
                        margin: 0,
                        textAlign: 'center',
                        fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
                      }}
                    >
                      {props.label}
                    </Typography>

                    <IconButton
                      onClick={() => props.onNavigate("NEXT")}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 3,
                        backgroundColor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        color: 'text.primary',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          borderColor: 'text.secondary',
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                      }}
                    >
                      <NavigateNextIcon />
                    </IconButton>
                  </Box>
                );
              },
            }}
          />
        </Paper>

        {/* Action Buttons */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "white",
            border: "1px solid #E5E5EA",
            borderRadius: 2,
          }}
        >
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2} 
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="outlined"
              size="large"
              onClick={handleBack}
              disabled={isLoading}
              sx={{
                borderColor: "#007AFF",
                color: "#007AFF",
                fontWeight: 500,
                borderRadius: 1.5,
                px: 4,
                py: 1.5,
                "&:hover": {
                  borderColor: "#0056CC",
                  backgroundColor: "rgba(0, 122, 255, 0.04)",
                },
                "&:disabled": {
                  borderColor: "#C7C7CC",
                  color: "#C7C7CC",
                },
              }}
            >
              {step === 1 ? t('backToHome') : t('previousStep')}
            </Button>
            
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              disabled={isLoading}
              sx={{
                backgroundColor: "#007AFF",
                fontWeight: 500,
                borderRadius: 1.5,
                px: 4,
                py: 1.5,
                boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)",
                "&:hover": {
                  backgroundColor: "#0056CC",
                  boxShadow: "0 4px 12px rgba(0, 122, 255, 0.4)",
                },
                "&:disabled": {
                  backgroundColor: "#C7C7CC",
                  boxShadow: "none",
                },
              }}
            >
              {isLoading ? t('saving') : step === 1 ? t('continue') : t('finish')}
            </Button>
          </Stack>
        </Paper>

        {/* Selection Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleDialogClose} 
          maxWidth="xs" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              border: "1px solid #E5E5EA",
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: "center", 
            fontWeight: 600,
            color: "#1C1C1E",
            pb: 1,
            borderBottom: "1px solid #F2F2F7"
          }}>
            {popupDate ? format(popupDate, "EEEE, dd 'de' MMMM", { locale: es }) : ""}
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Typography variant="body2" color="#8E8E93" textAlign="center" sx={{ mb: 3 }}>
              ¿Cuál es tu disponibilidad para este día?
            </Typography>
            
            <Stack spacing={2}>
              <Button 
                onClick={() => handleDaySelection("green")} 
                fullWidth 
                variant="contained"
                startIcon={<CheckIcon />}
                sx={{
                  backgroundColor: "#28A745",
                  py: 1.5,
                  borderRadius: 1.5,
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#218838",
                  },
                }}
              >
                {t('available')}
              </Button>
              
              <Button 
                onClick={() => handleDaySelection("orange")} 
                fullWidth 
                variant="contained"
                startIcon={<HelpIcon />}
                sx={{
                  backgroundColor: "#FF9500",
                  py: 1.5,
                  borderRadius: 1.5,
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#E68900",
                  },
                }}
              >
                {t('maybe')}
              </Button>
              
              <Button 
                onClick={() => handleDaySelection("red")} 
                fullWidth 
                variant="contained"
                startIcon={<CancelIcon />}
                sx={{
                  backgroundColor: "#FF3B30",
                  py: 1.5,
                  borderRadius: 1.5,
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#E3342F",
                  },
                }}
              >
                {t('notAvailable')}
              </Button>
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleDialogClose} 
              sx={{ 
                color: "#8E8E93",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" }
              }}
            >
              {t('cancel')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Name Input Dialog */}
        <Dialog 
          open={showNameDialog} 
          maxWidth="sm" 
          fullWidth
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: "1px solid #E5E5EA",
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: "center", 
            fontWeight: 600,
            color: "#1C1C1E",
            pb: 2,
            pt: 4,
          }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              {t('welcomeToCalendar')}
            </Typography>
            <Typography variant="body2" color="#8E8E93">
              {calendarId}
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 2, pb: 2 }}>
            <Typography variant="body1" color="#1C1C1E" textAlign="center" sx={{ mb: 3 }}>
              {t('enterNameToStart')}
            </Typography>
            
            <TextField
              label={t('yourName')}
              value={tempUserName}
              onChange={(e) => {
                setTempUserName(e.target.value);
                setNameError('');
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleNameSubmit();
                }
              }}
              variant="outlined"
              fullWidth
              disabled={isLoading}
              error={!!nameError}
              helperText={nameError}
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#007AFF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                  },
                },
              }}
            />
            
            <Typography variant="body2" color="#8E8E93" textAlign="center" sx={{ mt: 2 }}>
              {t('autoRecover')}
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleNameSubmit} 
              variant="contained"
              disabled={isLoading || !tempUserName.trim()}
              fullWidth
              size="large"
              sx={{
                backgroundColor: "#007AFF",
                borderRadius: 2,
                py: 1.5,
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#0056CC",
                },
                "&:disabled": {
                  backgroundColor: "#C7C7CC",
                },
              }}
            >
              {isLoading ? t('accessing') : t('continue')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Share Dialog */}
        <Dialog 
          open={showShareDialog} 
          onClose={() => setShowShareDialog(false)}
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: "1px solid #E5E5EA",
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: "center", 
            fontWeight: 600,
            color: "#1C1C1E",
            pb: 2,
            pt: 4,
          }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              {t('shareCalendar')}
            </Typography>
            <Typography variant="body2" color="#8E8E93">
              {t('shareCalendarDesc')}
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 2, pb: 2 }}>
            {/* Link Display */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "#F0F9FF",
                border: "1px solid #007AFF",
                borderRadius: 3,
                mb: 3,
              }}
            >
              <Typography variant="body2" sx={{ color: "#007AFF", mb: 1, fontWeight: 500 }}>
                {t('calendarLink')}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "#1C1C1E", 
                  fontWeight: 500, 
                  fontSize: "0.9rem",
                  wordBreak: "break-all",
                  mb: 2,
                  p: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: 2,
                }}
              >
                {getShareableLink()}
              </Typography>
              
              {/* Sharing Buttons */}
              <Stack direction="row" spacing={1} justifyContent="center">
                <IconButton
                  onClick={copyToClipboard}
                  sx={{
                    color: copySuccess ? "#28A745" : "#007AFF",
                    backgroundColor: copySuccess ? "rgba(40, 167, 69, 0.1)" : "rgba(0, 122, 255, 0.1)",
                    "&:hover": { 
                      backgroundColor: copySuccess ? "rgba(40, 167, 69, 0.2)" : "rgba(0, 122, 255, 0.2)" 
                    },
                    width: 44,
                    height: 44,
                  }}
                >
                  {copySuccess ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
                
                <IconButton
                  onClick={shareWhatsApp}
                  sx={{
                    color: "#25D366",
                    backgroundColor: "rgba(37, 211, 102, 0.1)",
                    "&:hover": { backgroundColor: "rgba(37, 211, 102, 0.2)" },
                    width: 44,
                    height: 44,
                  }}
                >
                  <WhatsAppIcon />
                </IconButton>
                
                <IconButton
                  onClick={shareTelegram}
                  sx={{
                    color: "#0088CC",
                    backgroundColor: "rgba(0, 136, 204, 0.1)",
                    "&:hover": { backgroundColor: "rgba(0, 136, 204, 0.2)" },
                    width: 44,
                    height: 44,
                  }}
                >
                  <TelegramIcon />
                </IconButton>
                
                {navigator.share && (
                  <IconButton
                    onClick={shareNative}
                    sx={{
                      color: "#8E8E93",
                      backgroundColor: "rgba(142, 142, 147, 0.1)",
                      "&:hover": { backgroundColor: "rgba(142, 142, 147, 0.2)" },
                      width: 44,
                      height: 44,
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                )}
              </Stack>
            </Paper>
            
            <Typography variant="body2" color="#8E8E93" textAlign="center" sx={{ mb: 2 }}>
              {t('shareInstructions')}
            </Typography>
            
            <Typography variant="body2" color="#616161" textAlign="center" sx={{ fontSize: "0.8rem" }}>
              {t('mobileAppsHint')}
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setShowShareDialog(false)}
              variant="contained"
              fullWidth
              size="large"
              sx={{
                backgroundColor: "#007AFF",
                borderRadius: 2,
                py: 1.5,
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#0056CC",
                },
              }}
            >
              {t('close')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Recommendation Component */}
        {showRecommendation && (
          <Recommendation 
            calendarId={calendarId}
            currentUserName={userName}
            currentUserSelections={selectedDays}
            onClose={() => setShowRecommendation(false)}
          />
        )}
        
      </Container>
    </Box>
  );
}

export default Calendar;