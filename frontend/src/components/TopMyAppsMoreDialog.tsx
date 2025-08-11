import React from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Button } from '@mui/material';

interface Item { id?: number; icon?: string; name?: string; url?: string }

interface Props {
  open: boolean;
  onClose: () => void;
  data?: {
    myapps?: Item[];
    myCompany?: Item[];
    online?: Item[];
    offline?: Item[];
  };
}

const Section: React.FC<{ title: string; items?: Item[] }> = ({ title, items }) => {
  if (!items || !items.length) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <h6 style={{ margin: '8px 0' }}>{title}</h6>
      <Grid container spacing={1}>
        {items.map((i, idx) => (
          <Grid item xs={6} sm={3} key={`${title}-${idx}`}>
            <Button fullWidth variant="outlined" href={i.url || '#'} sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
              {i.icon && <img src={i.icon} alt={i.name} style={{ width: 18, marginRight: 8 }} />}
              {i.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const TopMyAppsMoreDialog: React.FC<Props> = ({ open, onClose, data }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>More</DialogTitle>
      <DialogContent dividers>
        <Section title="My Apps" items={data?.myapps} />
        <Section title="My Company" items={data?.myCompany} />
        <Section title="My Online Apps" items={data?.online} />
        <Section title="My Offline Apps" items={data?.offline} />
      </DialogContent>
    </Dialog>
  );
};

export default TopMyAppsMoreDialog;

