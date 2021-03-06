/**
 * External dependencies.
 */
const babel = require( '@babel/core' );
const { flatten } = require( 'lodash' );

/**
 * Internal dependencies.
 */
const getIntermediateRepresentation = require( './get-intermediate-representation' );

const getAST = ( source ) => {
	return babel.parse( source || '' ).program;
};

const getExportTokens = ( ast ) =>
	ast.body.filter( ( node ) =>
		[
			'ExportNamedDeclaration',
			'ExportDefaultDeclaration',
			'ExportAllDeclaration',
		].some( ( declaration ) => declaration === node.type )
	);

const engine = ( path, code, getIRFromPath = () => {} ) => {
	const result = {};
	result.ast = getAST( code );
	result.tokens = getExportTokens( result.ast );
	result.ir = flatten(
		result.tokens.map( ( token ) =>
			getIntermediateRepresentation(
				path,
				token,
				result.ast,
				getIRFromPath
			)
		)
	);

	return result;
};

/**
 * Function that takes code and returns an intermediate representation.
 *
 * @param {string} code The code to parse.
 * @param {Function} [getIRFromPath=noop] Callback to retrieve the
 * Intermediate Representation from a path relative to the file
 * being parsed.
 *
 * @return {Object} Intermediate Representation in JSON.
 */
module.exports = engine;
