import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Alert, 
  CircularProgress,
  Container,
  Paper,
  Stack,
  IconButton,
  Divider
} from "@mui/material";
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Add as AddIcon,
  Login as LoginIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Share as ShareIcon,
  Check as CheckIcon
} from "@mui/icons-material";
import { calendarExists, createCalendar, generateUniqueCalendarId } from "../services";

function Home() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [calendarId, setCalendarId] = useState("");

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedCalendarId, setGeneratedCalendarId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const navigate = useNavigate();

  const handleCreateCalendarClick = () => {
    setShowCreateDialog(true);
  };

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  const handleCreateCalendarSubmit = async () => {
    if (!name.trim()) {
      setErrorMessage(t('enterName'));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Generate a unique calendar ID
      const idResult = await generateUniqueCalendarId();
      
      if (!idResult.success) {
        setErrorMessage(idResult.error || t('errorCreatingCalendar'));
        setIsLoading(false);
        return;
      }

      // Create the calendar
      const createResult = await createCalendar(idResult.calendarId);
      
      if (!createResult.success) {
        setErrorMessage(createResult.error || t('errorCreatingCalendar'));
        setIsLoading(false);
        return;
      }

      // Success!
      setGeneratedCalendarId(idResult.calendarId);
      setShowCreateDialog(false);
      setShowSuccessDialog(true);
      setIsLoading(false);

    } catch (error) {
      console.error("Error creating calendar:", error);
      setErrorMessage(t('errorUnexpected'));
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    if (!name.trim() || !calendarId.trim()) {
      setErrorMessage(t('enterNameAndId'));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const exists = await calendarExists(calendarId);
      if (!exists) {
        setErrorMessage(t('calendarNotExists'));
        setIsLoading(false);
        return;
      }

      // Calendar exists, navigate to it
      navigate(`/${calendarId}?name=${encodeURIComponent(name)}`);
    } catch (error) {
      console.error("Error checking calendar:", error);
      setErrorMessage(t('errorCheckingCalendar'));
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Navigate to the created calendar
    navigate(`/${generatedCalendarId}?name=${encodeURIComponent(name)}`);
  };

  const resetForm = () => {
    setName("");
    setCalendarId("");
    setErrorMessage("");
    setGeneratedCalendarId("");
    setIsLoading(false);
  };

  const handleDialogClose = (dialogSetter) => {
    dialogSetter(false);
    resetForm();
  };

  const getShareableLink = () => {
    return `${window.location.origin}/${generatedCalendarId}`;
  };

  const getShareMessage = () => {
    return `${t('shareMessage')} ${generatedCalendarId} ${t('shareMessageEnd')}\n\n${getShareableLink()}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareableLink());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
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
          title: t('appTitle'),
          text: t('shareMessage'),
          url: getShareableLink(),
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        py: { xs: 1, md: 2 }, // antes: { xs: 4, md: 8 }
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 2, md: 4 }, // antes: { xs: 4, md: 8 }
          }}
        >
          {/* Hero Section */}
          <Box sx={{ mb: 3 }}> {/* antes: mb: 6 */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.1,
                mb: 2,
                letterSpacing: "-0.02em",
              }}
            >
              {t('appTitle')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#8E8E93",
                fontWeight: 400,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: "auto",
                mb: 4, // antes: mb: 6
              }}
            >
              {t('appSubtitle')}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={3} 
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateCalendarClick}
              sx={{
                backgroundColor: "#007AFF",
                fontWeight: 500,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)",
                "&:hover": {
                  backgroundColor: "#0056CC",
                  boxShadow: "0 4px 12px rgba(0, 122, 255, 0.4)",
                },
                minWidth: 200,
              }}
            >
              {t('createCalendar')}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<LoginIcon />}
              onClick={handleLoginClick}
              sx={{
                borderColor: "#007AFF",
                color: "#007AFF",
                fontWeight: 500,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#0056CC",
                  backgroundColor: "rgba(0, 122, 255, 0.04)",
                },
                minWidth: 200,
              }}
            >
              {t('joinCalendar')}
            </Button>
          </Stack>

         
        </Box>
      </Container>

      {/* Create Calendar Dialog */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => handleDialogClose(setShowCreateDialog)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid #E5E5EA",
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              {t('createNewCalendar')}
            </Typography>
            <IconButton 
              onClick={() => handleDialogClose(setShowCreateDialog)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="#8E8E93" sx={{ mb: 3 }}>
            {t('enterNameToStart')}
          </Typography>
          
          <TextField
            label={t('yourName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "&:hover fieldset": {
                  borderColor: "#007AFF",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#007AFF",
                },
              },
            }}
          />
          
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => handleDialogClose(setShowCreateDialog)} 
            disabled={isLoading}
            sx={{ 
              color: "#8E8E93",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 1.5,
            }}
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleCreateCalendarSubmit} 
            variant="contained"
            disabled={isLoading || !name.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: 1.5,
              px: 3,
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
            {isLoading ? t('creating') : t('create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Login Dialog */}
      <Dialog 
        open={showLoginDialog} 
        onClose={() => handleDialogClose(setShowLoginDialog)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid #E5E5EA",
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              {t('joinCalendarTitle')}
            </Typography>
            <IconButton 
              onClick={() => handleDialogClose(setShowLoginDialog)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="#8E8E93" sx={{ mb: 3 }}>
            {t('enterNameAndId')}
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              label={t('yourName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&:hover fieldset": {
                    borderColor: "#007AFF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                  },
                },
              }}
            />
            
            <TextField
              label={t('calendarId')}
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={isLoading}
              placeholder="ejemplo: amazing-calendar-123"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&:hover fieldset": {
                    borderColor: "#007AFF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                  },
                },
              }}
            />
          </Stack>
          
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => handleDialogClose(setShowLoginDialog)} 
            disabled={isLoading}
            sx={{ 
              color: "#8E8E93",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 1.5,
            }}
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleLoginSubmit} 
            variant="contained"
            disabled={isLoading || !name.trim() || !calendarId.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: 1.5,
              px: 3,
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
            {isLoading ? t('verifying') : t('join')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog 
        open={showSuccessDialog} 
        onClose={handleSuccessDialogClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid #E5E5EA",
          }
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pt: 4 }}>
          <Typography variant="h5" fontWeight={700} color="#1C1C1E" sx={{ mb: 1 }}>
            {t('calendarCreated')}
          </Typography>
          <Typography variant="body2" color="#8E8E93">
            {t('calendarCreatedDesc')}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: "center", pt: 2 }}>
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
          
          <Typography variant="body2" color="#8E8E93" sx={{ mb: 2 }}>
            {t('shareInstructions')}
          </Typography>
          
          <Typography variant="body2" color="#616161" sx={{ fontSize: "0.8rem" }}>
            {t('mobileAppsHint')}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: "center" }}>
          <Button 
            onClick={handleSuccessDialogClose} 
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: 1.5,
              px: 4,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0056CC",
              },
            }}
          >
            {t('continue')}
          </Button>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
}

export default Home;