import React, { useEffect, useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  CircularProgress, 
  Box, 
  Paper,
  Stack,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fetchCalendarSelections } from '../services';

const Recommendation = ({ calendarId, currentUserName, currentUserSelections, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [recommendedDates, setRecommendedDates] = useState([]);
    const [currentDateIndex, setCurrentDateIndex] = useState(0);

    const handlePrevDate = () => {
        setCurrentDateIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNextDate = () => {
        setCurrentDateIndex((prev) => (prev < recommendedDates.length - 1 ? prev + 1 : prev));
    };

    const generateDetailedExplanation = (date, allSelections) => {
        const details = {
            available: [],
            unavailable: [],
            maybe: []
        };

        allSelections.forEach(user => {
            if (user.selectedDays.green?.includes(date)) {
                details.available.push(user.userId);
            } else if (user.selectedDays.red?.includes(date)) {
                details.unavailable.push(user.userId);
            } else if (user.selectedDays.orange?.includes(date)) {
                details.maybe.push(user.userId);
            }
        });

        return details;
    };

    const analyzeDates = useCallback(async () => {
        try {
            setLoading(true);
            
            // Fetch all user selections
            const allUserSelections = await fetchCalendarSelections(calendarId);
            
            // Include current user selections
            const currentUserData = {
                userId: currentUserName,
                selectedDays: currentUserSelections
            };
            
            const completeSelections = [...allUserSelections, currentUserData];

            // Collect all dates that have been selected by any user
            const allDates = new Set();
            
            completeSelections.forEach(user => {
                if (user.selectedDays) {
                    [...(user.selectedDays.green || []), 
                     ...(user.selectedDays.red || []), 
                     ...(user.selectedDays.orange || [])].forEach(date => {
                        allDates.add(date);
                    });
                }
            });

            // Calculate scores for each date
            const dateScores = Array.from(allDates).map(date => {
                const details = generateDetailedExplanation(date, completeSelections);
                const score = details.available.length * 2 + details.maybe.length * 1 - details.unavailable.length * 0.5;
                
                return {
                    date,
                    score,
                    counts: {
                        yes: details.available.length,
                        no: details.unavailable.length,
                        maybe: details.maybe.length
                    },
                    details
                };
            });

            // Sort by score and filter out dates with negative scores
            const sortedDates = dateScores
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, 5); // Top 5 recommendations

            setRecommendedDates(sortedDates);
            setLoading(false);
        } catch (error) {
            console.error('Error analyzing dates:', error);
            setLoading(false);
        }
    }, [calendarId, currentUserName, currentUserSelections]);

    useEffect(() => {
        analyzeDates();
    }, [analyzeDates]);

    const currentRecommendation = recommendedDates[currentDateIndex];

    return (
        <Dialog 
            open={true} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    border: "1px solid #E5E5EA",
                    maxHeight: "90vh"
                }
            }}
        >
            {/* Header */}
            <Box sx={{ p: 3, pb: 0 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                backgroundColor: "#F0F9FF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid #007AFF"
                            }}
                        >
                            <TrendingUpIcon sx={{ color: "#007AFF", fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" fontWeight={600} color="#1C1C1E">
                                Fechas Recomendadas
                            </Typography>
                            <Typography variant="body2" color="#8E8E93">
                                Basado en las disponibilidades del equipo
                            </Typography>
                        </Box>
                    </Stack>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </Box>

            <Divider />

            <DialogContent sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ p: 6, textAlign: "center" }}>
                        <CircularProgress sx={{ color: "#007AFF", mb: 2 }} />
                        <Typography color="#8E8E93">
                            Analizando disponibilidades...
                        </Typography>
                    </Box>
                ) : recommendedDates.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: "center" }}>
                        <CalendarIcon sx={{ fontSize: 48, color: "#C7C7CC", mb: 2 }} />
                        <Typography variant="h6" color="#1C1C1E" sx={{ mb: 1 }}>
                            No hay fechas disponibles
                        </Typography>
                        <Typography color="#8E8E93">
                            No se encontraron fechas con disponibilidad positiva.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ p: 3 }}>
                        {/* Date Navigation */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                backgroundColor: "#FAFAFA",
                                border: "1px solid #E5E5EA",
                                borderRadius: 2,
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <IconButton
                                    onClick={handlePrevDate}
                                    disabled={currentDateIndex === 0}
                                    sx={{
                                        backgroundColor: "white",
                                        border: "1px solid #E0E0E0",
                                        "&:hover": { backgroundColor: "#F5F5F5" },
                                        "&:disabled": { backgroundColor: "#FAFAFA", color: "#C7C7CC" }
                                    }}
                                >
                                    <NavigateBeforeIcon />
                                </IconButton>

                                <Box textAlign="center">
                                    <Typography variant="h4" fontWeight={700} color="#1C1C1E" sx={{ mb: 0.5 }}>
                                        {currentRecommendation && format(new Date(currentRecommendation.date), "EEEE, dd 'de' MMMM", { locale: es })}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                        <Typography variant="body2" color="#8E8E93">
                                            Recomendación {currentDateIndex + 1} de {recommendedDates.length}
                                        </Typography>
                                        <Chip
                                            label={`Puntuación: ${currentRecommendation?.score.toFixed(1)}`}
                                            size="small"
                                            sx={{
                                                backgroundColor: "#E8F5E8",
                                                color: "#2E7D32",
                                                fontWeight: 500
                                            }}
                                        />
                                    </Stack>
                                </Box>

                                <IconButton
                                    onClick={handleNextDate}
                                    disabled={currentDateIndex === recommendedDates.length - 1}
                                    sx={{
                                        backgroundColor: "white",
                                        border: "1px solid #E0E0E0",
                                        "&:hover": { backgroundColor: "#F5F5F5" },
                                        "&:disabled": { backgroundColor: "#FAFAFA", color: "#C7C7CC" }
                                    }}
                                >
                                    <NavigateNextIcon />
                                </IconButton>
                            </Stack>
                        </Paper>

                        {/* Summary Cards */}
                        {currentRecommendation && (
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
                                <Card elevation={0} sx={{ flex: 1, border: "1px solid #E8F5E8" }}>
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <CheckIcon sx={{ fontSize: 32, color: "#28A745", mb: 1 }} />
                                        <Typography variant="h3" fontWeight={700} color="#28A745">
                                            {currentRecommendation.counts.yes}
                                        </Typography>
                                        <Typography variant="body2" color="#155724">
                                            Disponibles
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card elevation={0} sx={{ flex: 1, border: "1px solid #FFF3CD" }}>
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <HelpIcon sx={{ fontSize: 32, color: "#FF9500", mb: 1 }} />
                                        <Typography variant="h3" fontWeight={700} color="#FF9500">
                                            {currentRecommendation.counts.maybe}
                                        </Typography>
                                        <Typography variant="body2" color="#856404">
                                            Con esfuerzo
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card elevation={0} sx={{ flex: 1, border: "1px solid #F8D7DA" }}>
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <CancelIcon sx={{ fontSize: 32, color: "#FF3B30", mb: 1 }} />
                                        <Typography variant="h3" fontWeight={700} color="#FF3B30">
                                            {currentRecommendation.counts.no}
                                        </Typography>
                                        <Typography variant="body2" color="#721C24">
                                            No disponibles
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Stack>
                        )}

                        {/* Detailed Breakdown */}
                        {currentRecommendation && (
                            <Paper
                                elevation={0}
                                sx={{
                                    border: "1px solid #E5E5EA",
                                    borderRadius: 2,
                                    overflow: "hidden"
                                }}
                            >
                                <Box sx={{ p: 2, backgroundColor: "#FAFAFA", borderBottom: "1px solid #E5E5EA" }}>
                                    <Typography variant="h6" fontWeight={600} color="#1C1C1E">
                                        Desglose por persona
                                    </Typography>
                                </Box>

                                <Box sx={{ p: 0 }}>
                                    {currentRecommendation.details.available.length > 0 && (
                                        <Box>
                                            <Box sx={{ p: 2, backgroundColor: "#F8F9FA" }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <CheckIcon sx={{ fontSize: 20, color: "#28A745" }} />
                                                    <Typography variant="subtitle1" fontWeight={600} color="#28A745">
                                                        Disponibles
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                            <List sx={{ py: 0 }}>
                                                {currentRecommendation.details.available.map((user, index) => (
                                                    <ListItem key={index} sx={{ borderBottom: "1px solid #F2F2F7" }}>
                                                        <ListItemIcon>
                                                            <Box
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#28A745",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "white",
                                                                    fontSize: 12,
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                {user.charAt(0).toUpperCase()}
                                                            </Box>
                                                        </ListItemIcon>
                                                        <ListItemText primary={user} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}

                                    {currentRecommendation.details.maybe.length > 0 && (
                                        <Box>
                                            <Box sx={{ p: 2, backgroundColor: "#F8F9FA" }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <HelpIcon sx={{ fontSize: 20, color: "#FF9500" }} />
                                                    <Typography variant="subtitle1" fontWeight={600} color="#FF9500">
                                                        Disponibles con esfuerzo
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                            <List sx={{ py: 0 }}>
                                                {currentRecommendation.details.maybe.map((user, index) => (
                                                    <ListItem key={index} sx={{ borderBottom: "1px solid #F2F2F7" }}>
                                                        <ListItemIcon>
                                                            <Box
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#FF9500",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "white",
                                                                    fontSize: 12,
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                {user.charAt(0).toUpperCase()}
                                                            </Box>
                                                        </ListItemIcon>
                                                        <ListItemText primary={user} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}

                                    {currentRecommendation.details.unavailable.length > 0 && (
                                        <Box>
                                            <Box sx={{ p: 2, backgroundColor: "#F8F9FA" }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <CancelIcon sx={{ fontSize: 20, color: "#FF3B30" }} />
                                                    <Typography variant="subtitle1" fontWeight={600} color="#FF3B30">
                                                        No disponibles
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                            <List sx={{ py: 0 }}>
                                                {currentRecommendation.details.unavailable.map((user, index) => (
                                                    <ListItem key={index} sx={{ borderBottom: "1px solid #F2F2F7" }}>
                                                        <ListItemIcon>
                                                            <Box
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#FF3B30",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "white",
                                                                    fontSize: 12,
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                {user.charAt(0).toUpperCase()}
                                                            </Box>
                                                        </ListItemIcon>
                                                        <ListItemText primary={user} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        )}
                    </Box>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 3 }}>
                <Button 
                    onClick={onClose} 
                    variant="contained"
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
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Recommendation;