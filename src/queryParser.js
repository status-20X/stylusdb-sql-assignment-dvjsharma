function parseQuery(query) {
	const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
	const match = query.match(selectRegex);

	if (match) {
		const [, fields, table, whereString] = match;
		const whereClauses = whereString ? parseWhereClause(whereString) : [];
		return {
			fields: fields.split(',').map(field => field.trim()),
			table: table.trim(),
			whereClauses
		};
	} else {
		throw new Error('Invalid query format');
	}
}
function evaluateCondition(row, clause) {
	const { field, operator, value } = clause;
	switch (operator) {
		case '=': return row[field] === value;
		case '!=': return row[field] !== value;
		case '>': return row[field] > value;
		case '<': return row[field] < value;
		case '>=': return row[field] >= value;
		case '<=': return row[field] <= value;
		default: throw new Error(`Unsupported operator: ${operator}`);
	}
}

function parseWhereClause(whereString) {
	const conditionRegex = /(.*?)(=|!=|>|<|>=|<=)(.*)/;
	return whereString.split(/ AND | OR /i).map(conditionString => {
		const match = conditionString.match(conditionRegex);
		if (match) {
			const [, field, operator, value] = match;
			return { field: field.trim(), operator, value: value.trim() };
		}
		throw new Error('Invalid WHERE clause format');
	});
}

module.exports = parseQuery;