const symbols = ['||', '&&', '^']

function calculateStatement(fn: string) { return new Function('return ' + fn)(); }


interface Expression {
    format: string;
    parenOpen: number;
    debugField: string;
}
interface Result {
    expressions: Array<string>;
    statistics: {
        numberOfExpressions: number;
    };
}

function countCharacterInExpression(
    e1: Expression,
    e2: Expression,
    str: RegExp
): number {
    const _e1 = (e1.format.match(str) || []).length
    const _e2 = (e2.format.match(str) || []).length

    if (_e1 > _e2) {
        return 1
    } else if(_e2 > _e1) {
        return -1
    }
    return 0
}

function compareAlphabeticWord(e1r: string, e2r: string): number {
    if (e1r > e2r) {
        return 1
    }
    else if (e2r > e1r) {
        return -1
    }
    return 0
}

function sortExpression(expressions: Array<Expression>) {
    const splitByOperators = /[||]{2}|[&&]{2}|[\^]/g

    return expressions.sort(
        (e1: Expression, e2: Expression) => {
            const nots = countCharacterInExpression(e1, e2, /!/g)
            if (nots != 0) {
                return nots
            }
            const xors = countCharacterInExpression(e1, e2, /\^/g)
            if (xors != 0) {
                return xors
            }

            const e1r = e1.format.split(splitByOperators)
            const e2r = e2.format.split(splitByOperators)
            if (e1r.length == e2r.length) {
                for(let i = 0; i < e1r.length; i++) {
                    const wordAlphabetOrder = compareAlphabeticWord(e1r[i], e2r[i])
                    if (wordAlphabetOrder != 0) {
                        return wordAlphabetOrder
                    }
                }
            }

            return 0
        }
    )

}

function resolveIterator(it: Generator<Expression>) {
    const results: Array<Expression> = []
    let result = it.next();
    while (!result.done) {
        results.push(result.value)
        result = it.next();
    }
    return results
}

function* recursivePermutationExpressionGeneratorBody(
    columnNames: Array<string>,
    context? : Expression,
):  Generator<Expression> {
    if (!context) {
      // null init
        context = { format: '', parenOpen: 0, debugField: '' }
    }
    const ctxFirstSpace = (ctx: string) => ctx.trim()
    const concatContextValueAndSymbol = (
      ctx: string, value: string, symbol: string
    ) => `${ctxFirstSpace(ctx)}${value} ${symbol}`
    const concatContextAndValue = (
      ctx: string, value: string
    ) => `${ctxFirstSpace(ctx)}${value}`

    if (columnNames.length > 1) {
        for(let i = 0; i < columnNames.length; i++) {
            const columnNamesCopy = columnNames.slice(0, columnNames.length)
            const currentColumnName = `${columnNamesCopy[i]}`
            columnNamesCopy.splice(i, 1)

            for (const sym of symbols) {
                const tc = Object.assign({}, context)
                tc.format = concatContextValueAndSymbol(
                    context.format, currentColumnName, sym + ' ('
                )
                tc.parenOpen = context.parenOpen + 1
                tc.debugField = context.debugField + ". v:" + columnNames[i] + " i:" + i + " sym:" + sym
                yield * recursivePermutationExpressionGeneratorBody(
                    columnNamesCopy, tc
                )
                const tc2 = Object.assign({}, context)
                tc2.format = concatContextValueAndSymbol(
                    context.format, "!"+currentColumnName, sym + ' ('
                )
                tc2.parenOpen = context.parenOpen + 1
                tc2.debugField = context.debugField + ". v:" + columnNames[i] + " i:" + i + " sym:" + sym
                yield * recursivePermutationExpressionGeneratorBody(
                    columnNamesCopy, tc2
                )
            }
        }
    } else {

        const field: Expression = {
            format: context.format,
            debugField: context.debugField,
            parenOpen: context.parenOpen
        }
        const currentColumnName = `${columnNames[0]}`
        const closingParent = ')'.repeat(context.parenOpen)
        field.debugField = context.debugField + ". v:" + currentColumnName + " i:" + -1
        field.format = concatContextAndValue(
            context.format, currentColumnName + closingParent
        )
        yield field 
        const negatedField: Expression = {
            format: context.format,
            debugField: context.debugField,
            parenOpen: context.parenOpen
        }
        negatedField.debugField = context.debugField + ". v:" + currentColumnName + " i:" + -1
        negatedField.format = concatContextAndValue(
            context.format, "!" + currentColumnName + closingParent
        )
        yield negatedField 
    }
}

function recursivePermutationExpressionGenerator(
    columnNames: Array<string>,
):  Array<Expression> {
    const columnNamesCopy = columnNames.slice(0, columnNames.length)
    return resolveIterator(recursivePermutationExpressionGeneratorBody(columnNamesCopy))
}

function populateExpressionFormat(
    x: Expression,
    values: Array<boolean>,
    columnNames: Array<string>,
): string {
    const columnNameWithValue: Array<[string, boolean]> = values.map(
        (v: boolean, i: number) => [columnNames[i], v]
    )
    let str = x.format
    for (const [name, value] of columnNameWithValue) {
        const re = new RegExp(name, "g")
        str = str.replace(re, String(value))
    }
    return str

}

function permutationTest(
    expression: Array<Expression>,
    columnNames: Array<string>,
    data: Array<boolean>,
    desiredResult: boolean
) {
    return expression.filter(p => calculateStatement(
        populateExpressionFormat(p, data, columnNames)
    ) == desiredResult)
}

function removeRendundantParen(expressions: Array<Expression>): Array<Expression> {
    expressions.forEach(
        (expr: Expression) => {
            const searchForParent = /\([A-Za-z0-9]*\)/g
            if (expr.format.search(searchForParent)) {
                const getVariable = /\(([A-Za-z0-9]*)\)/g
                const search = getVariable.exec(expr.format)
                if (search && search.length > 1) {
                    expr.format = expr.format.replace(
                        searchForParent,
                        search[1]
                    )
                }
            }
        }
    )
    return expressions
}

function filterSimpleEqualExpressions(expr: Array<Expression>) {
    const regedSymbols = [{
        're': /\|\|/,
        'key': '||'
    }, {
        're': /&&/,
        'key': '&&'
    }, {
        're': /!/,
        'key': '!'
    }, {
        're': /\^/,
        'key': '^'
    }]
    const regedSymbolsNames = regedSymbols.map(k => k.key)
    const clusters: { [key: string]: Array<Expression> } = {}
    const allExcept = (eSymbols: { [key: string]: number }, sy: string) => {
        const symbolsThatHasToBeFalsy = regedSymbolsNames.slice(
            0, regedSymbolsNames.length
        )
        symbolsThatHasToBeFalsy.splice(
            regedSymbolsNames.indexOf(sy), 1
        )
        if(!symbolsThatHasToBeFalsy.every((p) => !eSymbols[p])){
            return false
        }
        return eSymbols[sy] > 0
    }

    for (const e of expr) {
        const eSymbols:  { [key: string]: number } = {}
        for(const symbol of regedSymbols) {
            const re = new RegExp(symbol.re, 'g')
            eSymbols[symbol.key] = (e.format.match(re) || []).length
        }
        if (allExcept(eSymbols, '&&')) {
            if (!clusters['&&']) {
                clusters['&&'] = []
            }
            clusters['&&'].push(e)
        }
        if (allExcept(eSymbols, '||')) {
            if (!clusters['||']) {
                clusters['||'] = []
            }
            clusters['||'].push(e)
        }
    }

    let algos = expr
    const onlyAnd = sortExpression(clusters['&&'] || []).slice(1, (clusters['&&'] || []).length)
    const onlyAndFormats = onlyAnd.map(e => e.format)
    algos = algos.filter(
        p => !onlyAndFormats.includes(p.format)
    )

    const onlyOr = sortExpression(clusters['||'] || []).slice(1, (clusters['||'] || []).length)
    const onlyOrFormats= onlyOr.map(e => e.format)
    algos = algos.filter(
        p => !onlyOrFormats.includes(p.format)
    )
    return algos
}

function reverseLookup(
    table: Array<Array<boolean>>,
    desiredResult: Array<boolean>,
    params: Array<string>
): Result {
    const res: Result = {
        expressions: [],
        statistics: {
            numberOfExpressions: -1
        }
    }
    if (table[0].length != params.length) {
        console.log('Table sizing is not equal to amount of params. Check your inputs.')
        throw new Error('Table sizing is not equal to amount of params. Check your inputs.')
    }
    let methodsToTry = recursivePermutationExpressionGenerator(params)
    res.statistics.numberOfExpressions = methodsToTry.length
    console.log(methodsToTry)
    table.forEach(
        (elements: Array<boolean>, index: number) => {
            methodsToTry = permutationTest(methodsToTry, params, elements, desiredResult[index])
        }
    )

    methodsToTry = removeRendundantParen(methodsToTry)
    methodsToTry = sortExpression(methodsToTry)
    methodsToTry = filterSimpleEqualExpressions(methodsToTry)

    res.expressions = methodsToTry.map(e => e.format)

    return res
}

export {
    reverseLookup,
    Expression,
    Result,
}
