
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Group as GroupIcon,
  Person,
  Lock,
  Public,
  CalendarToday,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { groupsAPI } from '../services/api';

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const groupId = id ? parseInt(id) : undefined;

  const {
    data: group,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['group', id],
    queryFn: () => groupsAPI.getGroupById(groupId as number),
    enabled: !!groupId,
  });

  if (!id) {
    return <Navigate to="/groups" replace />;
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          Failed to load group details. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container maxWidth="lg">
        <Alert severity="info" sx={{ mt: 4 }}>
          Group not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Main Group Info */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                    <GroupIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      {group.name}
                    </Typography>
                    <Box display="flex" gap={1} alignItems="center">
                      {/* Additional group metadata chips could go here if available */}
                    </Box>
                  </Box>
                  {/* You can add actions like Join/Leave here when backend fields are available */}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  About this Group
                </Typography>
                <Typography variant="body1" paragraph>
                  {group.description || 'No description provided for this group.'}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday fontSize="small" />
                      <Typography variant="body2">
                        {new Date(group.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday fontSize="small" />
                      <Typography variant="body2">
                        {new Date(group.updated_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Creator Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Group Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This group has no additional metadata available.
                </Typography>
              </CardContent>
            </Card>

            {/* Group Stats */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Group Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary" align="center">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Members
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="secondary" align="center">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Posts
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Button variant="outlined" fullWidth disabled>
                    View Members
                  </Button>
                  <Button variant="outlined" fullWidth disabled>
                    Group Posts
                  </Button>
                  <Button variant="outlined" fullWidth disabled>
                    Group Events
                  </Button>
                  <Button variant="outlined" fullWidth disabled>
                    Share Group
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default GroupDetail;
