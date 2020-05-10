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
  },
  mutations: {
    addColumn(state) {
        const element = leftJoin(state.columnNames, generatedColumnNames)
        console.log('current', state.columnNames, 'pushing elem', element)
        state.rows = state.rows.map(
            row => row.concat(false)
        )
        state.results = state.results.concat(false)
        state.columnNames.push(element)
    },
    addRow(state) {
        state.rows.push(
            Array(state.columnNames.length).fill(false)
        )
        state.results = state.results.concat(false)
    }
  },
  actions: {
  },
  modules: {
  }
})
