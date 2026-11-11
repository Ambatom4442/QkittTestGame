#!/usr/bin/env node

const checkName = process.argv[2] ?? "nonblocking";
const filters = process.argv.slice(3);

if (filters.length === 0) {
	console.log(`${checkName}: registered (non-blocking until implementation exists)`);
	process.exit(0);
}

console.error(`WHAT: ${checkName} is a placeholder check and cannot verify feature-scoped behavior yet.`);
console.error("WHY: Feature verification requires a real implementation-backed test, not a registration stub.");
console.error(
	`FIX: Implement ${checkName} and replace this stub, or use a real verification command for this feature.`
);
process.exit(1);
