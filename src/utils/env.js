
export function getEnv(name) {
	const val = process.env[name];
  
	if (!val) {
	  throw new Error(`Cannot find environmental variable: ${name}`);
	}
  
	return val;
  }
  