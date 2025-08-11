Step1: POST /api/auth/register-step1
- Input: { first_name, country_code, mobile_number, password }
- Validations: required, password length>=6, mobile unique
- Action: create User (username=mobile, phone=mobile, first_name, password hashed), active=false
- Return: { user_id, username }

Step2: POST /api/auth/register-step2
- Input: { user_id, display_name, email, gender[M/F/o], marital, dob (day,month,year), country_id, state_id, district_id, nationality, education(+others), profession(+others) }
- Action: update users table (display_name, email, active=1); insert into user_registration_form mapped fields
- Return: { success: true, token, user }

GET /api/auth/unique-mobile?mobile=xxxxx
- Return: { exists: true/false }

GET /api/auth/register-metadata
- Return: { countries: [{id, name, phonecode, nationality?}], education: [], professions: [] }

Note: Our Country model has id,name(phonecode), but not nationality/phone_code fields named exactly like legacy; we may need to extend Country model or project from another table if present.

