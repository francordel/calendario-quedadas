import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, IconButton } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fetchCalendarSelections } from '../services/mockDatabase';

const Recommendation = ({ calendarId, currentUserSelections, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [recommendedDates, setRecommendedDates] = useState([]);
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [explanation, setExplanation] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [userVotes, setUserVotes] = useState({});

    const handlePrevDate = () => {
        setCurrentDateIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNextDate = () => {
        setCurrentDateIndex((prev) => (prev < recommendedDates.length - 1 ? prev + 1 : prev));
    };

    const generateExplanation = (counts) => {
        if (!counts) return '';
        return `En esta fecha hay:\n- ${counts.yes} personas disponibles\n- ${counts.no} personas no disponibles\n- ${counts.maybe} personas que hacen un esfuerzo`;
    };

    const generateDetailedExplanation = (date, allSelections) => {
        const details = {
            available: [],
            unavailable: [],
            maybe: []
        };

        allSelections.forEach(user => {
            if (user.selectedDays.green.includes(date)) {
                details.available.push(user.userId);
            } else if (user.selectedDays.red.includes(date)) {
                details.unavailable.push(user.userId);
            } else if (user.selectedDays.orange.includes(date)) {
                details.maybe.push(user.userId);
            }
        });

        return details;
    };

    const analyzeDates = async () => {
        try {
            const previousSelections = await fetchCalendarSelections(calendarId);
            
            const currentUserId = `usuario${previousSelections.length + 1}`;
            const allSelections = [
                ...previousSelections,
                { userId: currentUserId, selectedDays: currentUserSelections }
            ];
            
            const dateAnalysis = {};
            
            allSelections.forEach(userSelection => {
                Object.entries(userSelection.selectedDays).forEach(([type, dates]) => {
                    dates.forEach(date => {
                        if (!dateAnalysis[date]) {
                            dateAnalysis[date] = { yes: 0, no: 0, maybe: 0 };
                        }
                        
                        if (type === 'green') dateAnalysis[date].yes++;
                        if (type === 'red') dateAnalysis[date].no++;
                        if (type === 'orange') dateAnalysis[date].maybe++;
                    });
                });
            });

            const possibleDates = Object.entries(dateAnalysis)
                .filter(([date]) => !currentUserSelections.red.includes(date))
                .map(([date, counts]) => ({
                    date,
                    counts,
                    hasNegatives: counts.no > 0,
                    score: counts.yes + (counts.maybe * 0.1)
                }));

            const sortedDates = possibleDates.sort((a, b) => {
                if (a.hasNegatives !== b.hasNegatives) {
                    return a.hasNegatives ? 1 : -1;
                }
                return b.score - a.score;
            });

            setRecommendedDates(sortedDates.map(item => ({
                date: new Date(item.date),
                counts: item.counts
            })));

            if (sortedDates.length > 0) {
                setUserVotes(generateDetailedExplanation(sortedDates[0].date, allSelections));
                setExplanation(generateExplanation(sortedDates[0].counts));
            }

            setLoading(false);
        } catch (error) {
            console.error('Error al analizar las fechas:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        analyzeDates();
    }, []);

    useEffect(() => {
        if (recommendedDates.length > 0) {
            const currentDate = recommendedDates[currentDateIndex];
            setExplanation(generateExplanation(currentDate.counts));
            fetchCalendarSelections(calendarId).then(previousSelections => {
                const currentUserId = `usuario${previousSelections.length + 1}`;
                const allSelections = [
                    ...previousSelections,
                    { userId: currentUserId, selectedDays: currentUserSelections }
                ];
                setUserVotes(generateDetailedExplanation(currentDate.date.toDateString(), allSelections));
            });
        }
    }, [currentDateIndex]);

    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Fechas recomendadas ({currentDateIndex + 1} de {recommendedDates.length}):
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
                            <Button
                                onClick={handlePrevDate}
                                disabled={currentDateIndex === 0}
                                sx={{
                                    fontSize: "18px",
                                    backgroundColor: "#E0F7FA",
                                    borderRadius: "50%",
                                    minWidth: "40px",
                                    height: "40px",
                                }}
                            >
                                ←
                            </Button>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    color: 'primary.main',
                                    textAlign: 'center',
                                    width: '100%'
                                }}
                            >
                                {recommendedDates.length > 0 
                                    ? format(recommendedDates[currentDateIndex].date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
                                    : 'No se encontró una fecha óptima'}
                            </Typography>
                            <Button
                                onClick={handleNextDate}
                                disabled={currentDateIndex === recommendedDates.length - 1}
                                sx={{
                                    fontSize: "18px",
                                    backgroundColor: "#E0F7FA",
                                    borderRadius: "50%",
                                    minWidth: "40px",
                                    height: "40px",
                                }}
                            >
                                →
                            </Button>
                        </Box>
                        <Typography 
                            variant="body1" 
                            component={Box} 
                            sx={{ 
                                whiteSpace: 'pre-line',
                                textAlign: 'center',
                                '& > *': {
                                    textAlign: 'center'
                                }
                            }}
                        >
                            {explanation}
                        </Typography>
                        
                        <Button 
                            onClick={() => setShowDetails(!showDetails)}
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            {showDetails ? 'Ver menos' : 'Leer más'}
                        </Button>

                        {showDetails && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Personas disponibles:</strong> {userVotes.available.join(', ') || 'Ninguna'}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Personas no disponibles:</strong> {userVotes.unavailable.join(', ') || 'Ninguna'}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Personas que hacen un esfuerzo:</strong> {userVotes.maybe.join(', ') || 'Ninguna'}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Recommendation;