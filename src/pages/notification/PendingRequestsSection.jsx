// PendingRequestsSection.jsx
import React, { useState } from "react";
import { 
    Box, 
    Typography, 
    IconButton, 
    useTheme, 
    Collapse,
    Tooltip 
} from "@mui/material";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";

const PendingRequestsSection = ({ requests, onAccept, onDecline, isLoading }) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(true);

    console.log("Requests: ", requests);

    const EmptyState = () => (
        <Box textAlign="center" py={4} color="text.secondary">
            No pending friend requests
        </Box>
    );

    const RequestItem = ({ request }) => (
        <Box
            sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: theme.shape.borderRadius,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            <Box sx={{ 
                // flexGrow: 1, 
                overflow: 'hidden',
                mr: 2
            }}>
                <Typography variant="body1" fontWeight="medium" noWrap>
                    {request.sender.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    @{request.sender.username}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                <Tooltip title="Accept Request">
                    <IconButton
                        color="primary"
                        size="small"
                        disabled={isLoading}
                        onClick={() => onAccept(request._id)}
                        sx={{
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                            '& svg': {
                                color: 'white'
                            }
                        }}
                    >
                        <Check size={16} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Decline Request">
                    <IconButton
                        color="error"
                        size="small"
                        disabled={isLoading}
                        onClick={() => onDecline(request._id)}
                        sx={{
                            bgcolor: 'error.main',
                            '&:hover': {
                                bgcolor: 'error.dark',
                            },
                            '& svg': {
                                color: 'white'
                            }
                        }}
                    >
                        <X size={16} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ 
            width: '100%',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: theme.shape.borderRadius,
            p: 2,
            boxSizing: 'border-box'
        }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 2,
                    cursor: 'pointer',
                    '&:hover': {
                        opacity: 0.8
                    }
                }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <Typography variant="h6" color="white">
                    Pending Requests
                </Typography>
                <IconButton 
                    size="small" 
                    sx={{ color: 'white' }}
                >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </IconButton>
            </Box>
            <Collapse in={isExpanded}>
                {requests.length === 0 ? (
                    <EmptyState />
                ) : (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2,
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        width: '100%',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '3px',
                        }
                    }}>
                        {requests.map((req) => (
                            <RequestItem
                                key={req._id}
                                request={req}
                            />
                        ))}
                    </Box>
                )}
            </Collapse>
        </Box>
    );
};

export default PendingRequestsSection;