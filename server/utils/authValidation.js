// Strict input checks for auth routes. Everything must be a plain string:
// objects such as { "$ne": null } would otherwise be passed into Mongo queries.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN = 6;
// Upper bound stops someone sending megabytes to the (deliberately slow) Argon2 hasher.
export const PASSWORD_MAX = 128;

const isString = (value) => typeof value === "string";

const normalizeEmail = (value) => value.trim().toLowerCase();

export const validateRegistration = (body = {}) => {
    const { name, email, password } = body;

    if (!isString(name) || !isString(email) || !isString(password)) {
        return { error: "Name, email, and password are required." };
    }

    const cleanName = name.trim();
    const cleanEmail = normalizeEmail(email);

    if (!cleanName || !cleanEmail || !password) {
        return { error: "Name, email, and password are required." };
    }

    if (cleanName.length > 80) {
        return { error: "Name must be 80 characters or fewer." };
    }

    if (cleanEmail.length > 254 || !EMAIL_RE.test(cleanEmail)) {
        return { error: "Please enter a valid email address." };
    }

    if (password.length < PASSWORD_MIN) {
        return { error: `Password must be at least ${PASSWORD_MIN} characters long.` };
    }

    if (password.length > PASSWORD_MAX) {
        return { error: `Password must be ${PASSWORD_MAX} characters or fewer.` };
    }

    return { value: { name: cleanName, email: cleanEmail, password } };
};

export const validateLogin = (body = {}) => {
    const { email, password } = body;

    if (!isString(email) || !isString(password) || !email.trim() || !password) {
        return { error: "Email and password are required." };
    }

    if (password.length > PASSWORD_MAX || email.length > 254) {
        // Same message as a wrong password: gives nothing away.
        return { error: "Invalid email or password.", status: 401 };
    }

    return { value: { email: normalizeEmail(email), password } };
};