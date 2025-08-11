import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Select, MenuItem, Grid, Alert, Typography } from '@mui/material';
import { authAPI, geographicAPI } from '../services/api';

interface Props {
  show: boolean;
  onClose: () => void;
  onRegistered: (token: string) => void;
  onOpenLogin?: () => void;
}

const RegisterModal: React.FC<Props> = ({ show, onClose, onRegistered, onOpenLogin }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Metadata
  const [countries, setCountries] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);

  // Step1 form state
  const [firstName, setFirstName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step2 form state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'M'|'F'|'o'>('M');
  const [marital, setMarital] = useState<'Single'|'Married'|'Other'>('Single');
  const [dob, setDob] = useState({ day: '', month: '', year: ''});
  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [nationality, setNationality] = useState('');
  const [educationVal, setEducationVal] = useState('');
  const [educationOthers, setEducationOthers] = useState('');
  const [professionVal, setProfessionVal] = useState('');
  const [workOthers, setWorkOthers] = useState('');

  const [registerUserId, setRegisterUserId] = useState<number | null>(null);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  useEffect(() => {
    if (show) {
      // Load metadata
      authAPI.registerMetadata()
        .then(({ countries, education, professions }) => {
          setCountries(countries);
          setEducation(education);
          setProfessions(professions);
        })
        .catch(() => {});
    }
  }, [show]);

  useEffect(() => {
    if (countryId) {
      geographicAPI.getStates(Number(countryId)).then((statesRes: any) => setStates(statesRes.states || [])).
        catch(() => setStates([]));
    } else {
      setStates([]);
    }
    setStateId('');
    setDistrictId('');
  }, [countryId]);

  useEffect(() => {
    if (stateId) {
      geographicAPI.getDistricts(Number(stateId)).then((dRes: any) => setDistricts(dRes.districts || [])).
        catch(() => setDistricts([]));
    } else {
      setDistricts([]);
    }
    setDistrictId('');
  }, [stateId]);

  const handleStep1 = async () => {
    setError('');
    if (!firstName || !mobile || !password || !confirmPassword) {
      setError('Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const u = await authAPI.uniqueMobile(mobile);
      if (u.exists) {
        setError('This mobile number already exists.');
        setLoading(false);
        return;
      }
      const res = await authAPI.registerStep1({ first_name: firstName, country_code: countryCode || '+91', mobile_number: mobile, password });
      setRegisterUserId(res.user_id);
      setRegisterUsername(mobile);
      setRegisterPassword(password);
      setStep(2);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    setError('');
    if (!displayName || !gender || !marital || !dob.day || !dob.month || !dob.year || !countryId || !stateId || !districtId || !nationality || !professionVal || !educationVal) {
      setError('Please fill all required fields');
      return;
    }
    if (!email) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        register_user_id: registerUserId,
        register_username: registerUsername,
        register_password: registerPassword,
        display_name: displayName,
        email,
        gender,
        marital,
        from_date: dob.day,
        from_month: dob.month,
        from_year: dob.year,
        country: Number(countryId),
        state: Number(stateId),
        district: Number(districtId),
        nationality,
        education: educationVal,
        education_others: educationVal === 'education_others' ? educationOthers : '',
        profession: professionVal,
        work_others: professionVal === 'work_others' ? workOthers : '',
        };
      // frontend email uniqueness check
      const ue = await authAPI.uniqueEmail(email);
      if (ue.exists) {
        setError('This email already exists.');
        setLoading(false);
        return;
      }
      const res = await authAPI.registerStep2(payload);
      localStorage.setItem('token', res.token);
      onRegistered(res.token);
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = [
    { id: '01', name: 'January' }, { id: '02', name: 'February' }, { id: '03', name: 'March' }, { id: '04', name: 'April' }, { id: '05', name: 'May' }, { id: '06', name: 'June' },
    { id: '07', name: 'July' }, { id: '08', name: 'August' }, { id: '09', name: 'September' }, { id: '10', name: 'October' }, { id: '11', name: 'November' }, { id: '12', name: 'December' }
  ];

  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 0 }}>
        <Typography variant="h5" fontWeight={700} color="primary">{step === 1 ? 'Create Account' : 'Complete Registration'}</Typography>
        <Typography variant="body2" color="text.secondary">{step === 1 ? 'Join My Group in two quick steps' : 'Fill the remaining details to continue'}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {step === 1 ? (
          <>
            <TextField fullWidth label="Full Name *" margin="normal" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
                  <FormLabel>Code *</FormLabel>
                  <Select value={countryCode} onChange={e => setCountryCode(String(e.target.value))}>
                    <MenuItem value="">+91</MenuItem>
                    {countries.map((c: any) => (
                      <MenuItem key={c.id} value={String(c.phonecode || '')}>{c.phonecode || ''}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <TextField fullWidth label="Mobile Number *" margin="normal" value={mobile} onChange={e => setMobile(e.target.value)} />
              </Grid>
            </Grid>
            <TextField fullWidth type="password" label="Password *" margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
            <TextField fullWidth type="password" label="Confirm Password *" margin="normal" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </>
        ) : (
          <>
                <Button variant="text" color="secondary" onClick={onOpenLogin} sx={{ mt: 1 }}>Already have an account? Login</Button>
            <TextField fullWidth label="Display Name (Nickname) *" margin="normal" value={displayName} onChange={e => setDisplayName(e.target.value)} />
            <TextField fullWidth type="email" label="Email" margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
            <FormControl margin="normal">
              <FormLabel>Gender *</FormLabel>
              <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value as any)}>
                <FormControlLabel value="M" control={<Radio />} label="Male" />
                <FormControlLabel value="F" control={<Radio />} label="Female" />
                <FormControlLabel value="o" control={<Radio />} label="Transgender" />
              </RadioGroup>
            </FormControl>
            <FormControl margin="normal">
              <FormLabel>Marital status *</FormLabel>
              <RadioGroup row value={marital} onChange={(e) => setMarital(e.target.value as any)}>
                <FormControlLabel value="Single" control={<Radio />} label="Single" />
                <FormControlLabel value="Married" control={<Radio />} label="Married" />
                <FormControlLabel value="Other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
                  <FormLabel>Date *</FormLabel>
                  <Select value={dob.day} onChange={e => setDob({ ...dob, day: String(e.target.value) })}>
                    <MenuItem value="">Date</MenuItem>
                    {days.map(d => (<MenuItem key={d} value={d}>{d}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
                  <FormLabel>Month *</FormLabel>
                  <Select value={dob.month} onChange={e => setDob({ ...dob, month: String(e.target.value) })}>
                    <MenuItem value="">Month</MenuItem>
                    {months.map(m => (<MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
                  <FormLabel>Year *</FormLabel>
                  <Select value={dob.year} onChange={e => setDob({ ...dob, year: String(e.target.value) })}>
                    <MenuItem value="">Year</MenuItem>
                    {Array.from({ length: new Date().getFullYear() - 1900 }, (_, i) => String(new Date().getFullYear() - i)).map(y => (<MenuItem key={y} value={y}>{y}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <FormControl fullWidth margin="normal">
              <FormLabel>Country *</FormLabel>
              <Select value={countryId} onChange={e => setCountryId(String(e.target.value))}>
                <MenuItem value="">Select Country</MenuItem>
                {countries.map((c: any) => (<MenuItem key={c.id} value={String(c.id)}>{c.name || c.country_name}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>State / Province *</FormLabel>
              <Select value={stateId} onChange={e => setStateId(String(e.target.value))}>
                <MenuItem value="">Select State / Province</MenuItem>
                {states.map((s: any) => (<MenuItem key={s.id} value={String(s.id)}>{s.name || s.state_name}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>District / City *</FormLabel>
              <Select value={districtId} onChange={e => setDistrictId(String(e.target.value))}>
                <MenuItem value="">Select District</MenuItem>
                {districts.map((d: any) => (<MenuItem key={d.id} value={String(d.id)}>{d.name || d.district_name}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField fullWidth label="Nationality *" margin="normal" value={nationality} onChange={e => setNationality(e.target.value)} />
            <FormControl fullWidth margin="normal">
              <FormLabel>Education / Qualification *</FormLabel>
              <Select value={educationVal} onChange={e => setEducationVal(String(e.target.value))}>
                <MenuItem value="">Select Education / Qualification</MenuItem>
                {education.map((e1: any) => (<MenuItem key={e1.id} value={e1.education}>{e1.education}</MenuItem>))}
                <MenuItem value="education_others">Others</MenuItem>
              </Select>
            </FormControl>
            {educationVal === 'education_others' && (
              <TextField fullWidth label="Others" margin="normal" value={educationOthers} onChange={e => setEducationOthers(e.target.value)} />
            )}
            <FormControl fullWidth margin="normal">
              <FormLabel>Work / Profession *</FormLabel>
              <Select value={professionVal} onChange={e => setProfessionVal(String(e.target.value))}>
                <MenuItem value="">Select Work / Profession</MenuItem>
                {professions.map((p: any) => (<MenuItem key={p.id} value={p.profession}>{p.profession}</MenuItem>))}
                <MenuItem value="work_others">Others</MenuItem>
              </Select>
            </FormControl>
            {professionVal === 'work_others' && (
              <TextField fullWidth label="Others" margin="normal" value={workOthers} onChange={e => setWorkOthers(e.target.value)} />
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        {step === 1 ? (
          <Button variant="contained" onClick={handleStep1} disabled={loading}>{loading ? 'Please wait...' : 'Register'}</Button>
        ) : (
          <Button variant="contained" onClick={handleStep2} disabled={loading}>{loading ? 'Please wait...' : 'Submit'}</Button>
        )}
        <Button variant="text" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterModal;

