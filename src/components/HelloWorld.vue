<template>
  <div class="hello">
    <p>
        <table>
          <thead>
            <tr>
                <th v-for="(column, idx) in columns" :key="idx">
                    <input v-model="columns[idx]" />
                </th>
                <input type="button" value="click me for free covid-19" @click="addColumn" />
                <th>Desired result</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowindex) in rows" :key="rowindex">
              <td v-for="(col, colindex) in row" :key="rowindex-colindex">
                  <select v-model="rows[rowindex][colindex]">
                    <option value=true>true</option>
                    <option value=false>false</option>
                  </select>
              </td>
              <td v-if="rows && rowindex != rows.length - 1"></td>
              <td v-if="rows && rowindex == rows.length - 1">
                <input type="button" value="+" @click="addRow">
              </td>
              <td>
                  <select v-model="results[rowindex]">
                    <option value=true>true</option>
                    <option value=false>false</option>
                  </select>
              </td>
            </tr>
            <tr v-if="rows.length == 0">
              <td v-if="rows.length == 0">
                <input type="button" value="+" @click="addRow">
              </td>
            </tr>
          </tbody>
          <div v-for="error in errors" :key="error">
              {{ error }}
          </div>
          <div v-for="expression in expressions" :key="expression">
            {{ expression }}
          </div>
          <div>
            Number of expressions generated: {{ statistics.numberOfExpressions }}
          </div>
          <input type="button" @click="run" value="Find my expression" />
        </table>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { reverseLookup } from './truthtable'

@Component
export default class HelloWorld extends Vue {
    get rows(): Array<Array<boolean>> {
        console.log('rows')
       return this.$store.state.rows
    }
    get columns(): Array<string> {
       return this.$store.state.columnNames
    }
    get results(): Array<boolean> {
       return this.$store.state.results
    }

    addColumn() {
        this.$store.commit('addColumn')
    }

    addRow() {
        this.$store.commit('addRow')
    }

    checkUniqueColumns(columns) {
        if(columns.length <= 0) {
            this.errors.push('Must have at least one column')
        }
    }

    run() {
        this.clearErrors()
        this.checkUniqueColumns(this.columns)

        if (this.errors.length == 0) {
            const ran = reverseLookup(
                this.rows,
                this.results,
                this.columns
            )
            this.expressions = ran.expressions
            this.statistics.numberOfExpressions = ran.statistics.numberOfExpressions
        }
    }

    clearErrors() {
        this.errors = []
    }

    data() {
        return {
            errors: [],
            expressions: Array<string>(),
            statistics: {
                numberOfExpressions: 0
            }
        }
    }

    created() {
        console.log('CREATED')
        this.$store.commit('addColumn')
        this.$store.commit('addRow')
    }

    @Watch('columns')
    onPropertyChanged(newColumns) {
        console.log('Watch', newColumns)
        this.clearErrors()
        this.checkUniqueColumns(newColumns)
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
