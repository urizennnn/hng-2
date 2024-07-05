import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
}


export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
	try {
		const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
		return isMatch ? true : false;
	} catch (err) {
		console.error('Error comparing passwords:', err);
		throw err;
	}
}
