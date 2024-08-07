// cvl.js
import antlr4 from 'antlr4';
import cvlLexer from './.antlr/cvlLexer.mjs';
import cvlParser from './.antlr/cvlParser.mjs';
import cvlVisitor from './.antlr/cvlVisitor.mjs';

class cvlParseVisitor extends cvlVisitor {
	visitChildren(ctx) {
		if (!ctx) {
			return;
		}

		if (ctx.children) {
			return ctx.children.map(child => {
				if (child.children && child.children.length != 0) {
					return child.accept(this);
				} else {
					return child.getText();
				}
			});
		}
	}

	// Visit a parse tree produced by cvlParser#literalTerm.
	visitLiteralTerm(ctx) {
		return ctx.children[0].accept(this);
	}


	// Visit a parse tree produced by cvlParser#intervalSelectorTerm.
	visitIntervalSelectorTerm(ctx) {
		return ctx.children[0].accept(this);
	}


	// Visit a parse tree produced by cvlParser#tupleSelectorTerm.
	visitTupleSelectorTerm(ctx) {
		return ctx.children[0].accept(this);
	}


	// Visit a parse tree produced by cvlParser#instanceSelectorTerm.
	visitInstanceSelectorTerm(ctx) {
		return ctx.children[0].accept(this);
	}


	// Visit a parse tree produced by cvlParser#listSelectorTerm.
	visitListSelectorTerm(ctx) {
		return ctx.children[0].accept(this);
	}


	// Visit a parse tree produced by cvlParser#ratio.
	visitRatio(ctx) {
		return {
			numerator: ctx.children[0].accept(this),
			denominator: ctx.children[2].accept(this)
		}
	}


	// Visit a parse tree produced by cvlParser#booleanLiteral.
	visitBooleanLiteral(ctx) {
		return ctx.getText() === 'true' ? true : false;
	}


	// Visit a parse tree produced by cvlParser#nullLiteral.
	visitNullLiteral(ctx) {
		return null;
	}


	// Visit a parse tree produced by cvlParser#stringLiteral.
	visitStringLiteral(ctx) {
		// TODO: Unescape
		return ctx.getText().slice(1, -1);
	}


	// Visit a parse tree produced by cvlParser#numberLiteral.
	visitNumberLiteral(ctx) {
		return Number(ctx.getText());
	}


	// Visit a parse tree produced by cvlParser#longNumberLiteral.
	visitLongNumberLiteral(ctx) {
		return BigInt(ctx.getText().slice(0, -1));
	}


	// Visit a parse tree produced by cvlParser#dateTimeLiteral.
	visitDateTimeLiteral(ctx) {
		return ctx.getText();
	}


	// Visit a parse tree produced by cvlParser#dateLiteral.
	visitDateLiteral(ctx) {
		return ctx.getText();
	}


	// Visit a parse tree produced by cvlParser#timeLiteral.
	visitTimeLiteral(ctx) {
		return ctx.getText();
	}


	// Visit a parse tree produced by cvlParser#quantityLiteral.
	visitQuantityLiteral(ctx) {
		return ctx.children[0].accept(this);
	}


	// Visit a parse tree produced by cvlParser#ratioLiteral.
	visitRatioLiteral(ctx) {
		return ctx.children[0].accept(this);
	}


	// Visit a parse tree produced by cvlParser#intervalSelector.
	visitIntervalSelector(ctx) {
		return {
			lowClosed: ctx.children[1].accept(this) === '[',
			low: ctx.children[2].accept(this),
			hiClosed: ctx.children[5].accept(this) === ']',
			hi: ctx.children[4].accept(this)
		}
	}


	// Visit a parse tree produced by cvlParser#tupleSelector.
	visitTupleSelector(ctx) {
		var result = { };
		for (let i = 0; i < ctx.children.length; i++) {
			var child = ctx.children[i].accept(this);
			if (child === 'Tuple') {
				continue;
			}

			if (child === ':') {
				continue;
			}

			if (child === '{') {
				continue;
			}

			if (child === '}') {
				continue;
			}

			Object.assign(result, child);
		}
		return result;
	}


	// Visit a parse tree produced by cvlParser#tupleElementSelector.
	visitTupleElementSelector(ctx) {
		return { [ctx.children[0].accept(this)]: ctx.children[2].accept(this) };
	}


	// Visit a parse tree produced by cvlParser#instanceSelector.
	visitInstanceSelector(ctx) {
		var result = { };
		for (let i = 0; i < ctx.children.length; i++) {
			var child = ctx.children[i].accept(this);
			if (i === 0) {
				continue;
			}

			if (child === ':') {
				continue;
			}

			if (child === '{') {
				continue;
			}

			if (child === '}') {
				continue;
			}

			Object.assign(result, child);
		}
		return result;
	}


	// Visit a parse tree produced by cvlParser#instanceElementSelector.
	visitInstanceElementSelector(ctx) {
		return { [ctx.children[0].accept(this)]: ctx.children[2].accept(this) };
	}


	// Visit a parse tree produced by cvlParser#listSelector.
	visitListSelector(ctx) {
		return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by cvlParser#identifier.
	visitIdentifier(ctx) {
		// TODO: Unescape, the unescape() function is apparently deprecated?
		return ctx.getText().slice(1, -1);
	}


	// Visit a parse tree produced by cvlParser#quantity.
	visitQuantity(ctx) {
		if (ctx.unit()) {
			return { value: this.children[0].accept(this), unit: this.unit().accept(this) };
		}
		else {
			return this.children[0].accept(this);
		}
	}


	// Visit a parse tree produced by cvlParser#unit.
	visitUnit(ctx) {
		if (ctx.getText().startsWith('\'')) {
			return ctx.getText().slice(1, -1);
		}
		return ctx.getText();
	}


	// Visit a parse tree produced by cvlParser#dateTimePrecision.
	visitDateTimePrecision(ctx) {
		return ctx.getText();
	}


	// Visit a parse tree produced by cvlParser#pluralDateTimePrecision.
	visitPluralDateTimePrecision(ctx) {
		return ctx.getText();
	}
}

class cvl {
	static parse(input) {
		const chars = new antlr4.InputStream(input);
		const lexer = new cvlLexer(chars);
		const tokens = new antlr4.CommonTokenStream(lexer);
		const parser = new cvlParser(tokens);
		const tree = parser.term();
		return tree.accept(new cvlParseVisitor());
	}
}

export default cvl;