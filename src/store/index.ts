import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function* leftJoinInner(columns: string[], generated: string[]) {
    for (const generatedColumn of generated) {
        if (!columns.includes(generatedColumn)) {
            yield generatedColumn
        }
    }
}

function leftJoin(columns: string[], generated: string[]) {
    const cols = Array.from(leftJoinInner(columns, generated))
    return (cols[0]) || ''
}

const generatedColumnNames = [
    'x', 'y', 'z', 'a', 'b', 'c', 'd'
]


export default new Vuex.Store({
  state: {
      rows: Array<Array<boolean>>(),
      columnNames: Array<string>(),
      results: Array<boolean>(),
      expressions: Array<string>(),
      errors: Array<string>(),
      statistics: {
        numberOfExpressions: 0
      },
      loadingExpressions: false,
      executed: false,
      exampleText: ""
  },
  mutations: {
    addColumn(state) {
        state.exampleText = ''
        const element = leftJoin(state.columnNames, generatedColumnNames)
        console.log('current', state.columnNames, 'pushing elem', element)
        state.rows = state.rows.map(
            row => row.concat(false)
        )
        state.results = state.results.concat(false)
        state.columnNames.push(element)
    },
    addRow(state) {
        state.exampleText = ''
        state.rows.push(
            Array(state.columnNames.length).fill(false)
        )
        state.results = state.results.concat(false)
    },
    deleteColumn(state, deleteIdx: number) {
        state.exampleText = ''
        const deleteFn = (x: string, idx: number) => idx != deleteIdx
        state.rows = state.rows.map(
            (row: Array<boolean>) => {
                const rowCopy = row.slice(0, row.length)
                rowCopy.splice(deleteIdx, 1)
                return rowCopy
            }
        )
        state.columnNames = state.columnNames.filter(deleteFn)
    },
    deleteRow(state, e: number) {
        state.exampleText = ''
        state.rows = state.rows.filter((row, index: number) => index != e)
    },
    setExpressions(state, expressions: Array<string>) {
        state.exampleText = ''
        state.executed = true
        state.expressions = expressions
    },
    setStatistics(state, numberOfExpressions) {
        state.exampleText = ''
        state.statistics.numberOfExpressions = numberOfExpressions
    }
  },
  actions: {
    clearErrors({state}) {
        state.errors = []
    },
    checkUniqueColumns({state}) {
        if(state.columnNames.length <= 0) {
            state.errors.push('Must have at least one column')
        }
    },
    loadingExpressions({state}, val) {
        state.loadingExpressions = val
    },
    reset({state}){
        state.exampleText = ''
        state.columnNames = ['x']
        state.results = [false]
        state.rows = [[false]]
    },
    exampleOne({state}) {
        state.exampleText = 'Is it possible for me to view this movie? Let\'s find out'
        state.columnNames = [
            'isOverTheAgeOf18',
            'hasCinemaTicket'
        ]
        state.rows = [
            [false, true],
            [true, false],
            [false, false],
            [true, true],
        ]
        state.results = [false, false, false, true]
    },
    exampleTwo({state}) {
        state.exampleText = '<a href="https://www.youtube.com/watch?v=pe2cnWpvj2o">Youtube video: Bongo day!</a>'
        state.columnNames = [
            'isAnnoyingJD',
            'isPlayingBongo',
            'isMonday'
        ]
        state.rows = [
            [false, false, false],
            [true, false, false],
            [false, true, false],
            [false, false, true],
            [true, false, true],
            [false, true, true],
            [true, true, true],
        ]
        state.results = [false, false, false, false, false, false, true]
    },
    exampleThree({state}) {
        state.exampleText = 'In europe there is a thing called "small saturday". I say, we should celebrate these days. But what expression to use?'
        state.columnNames = [
            'isSmallSaturday',
            'isWeekend'
        ]
        state.rows = [
            [true, true],
            [true, false],
            [false, true],
            [false, false],
            [true, true],
        ]
        state.results = [true, true, true, false, true]
    },
    exampleFour({state}) {
        state.exampleText = 'Teenagers are not allowed in this exclusive adult-only club. What should our outdoor sign say?'
        state.columnNames = [
            'isTeenager',
        ]
        state.rows = [
            [true],
            [false],
        ]
        state.results = [false, true]
    },
  },
  modules: {
  }
})
