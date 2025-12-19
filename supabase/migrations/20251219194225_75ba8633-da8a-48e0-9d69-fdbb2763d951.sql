-- Add unique constraint on email for internship_waitlist
ALTER TABLE internship_waitlist 
ADD CONSTRAINT internship_waitlist_email_unique UNIQUE (email);