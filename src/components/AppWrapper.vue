<template>
<div class="rootElem">
<table>
  <thead>
    <tr>
        <th></th>
        <th :colspan="columns.length" class="params">Parameters</th>
        <th></th>
        <th>Results</th>
    </tr>
      <tr>
        <th />
        <th v-for="(column, idx) in columns" :key="column" class="tdCenterContext" @click="deleteColumn(idx)">
            <b-icon
                icon="times"
                size="is-small">
            </b-icon>
        </th>
      </tr>
    <tr>
        <th />
        <th v-for="(column, idx) in columns" :key="idx" class="columnText">
            <b-input v-model="columns[idx]" size="25"></b-input>
        </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(row, rowindex) in rows" :key="rowindex" @click="deleteRow(rowindex)">
        <td class="tdCenterContext">
            <b-icon
                icon="times"
                size="is-small">
            </b-icon>
        </td>
      <td v-for="(col, colindex) in row" :key="rowindex-colindex">
          <b-select v-model="rows[rowindex][colindex]" size="is-small" >
            <option :value="true">true</option>
            <option :value="false">false</option>
          </b-select>
      </td>
      <td>=></td>
      <td>
          <b-select v-model="results[rowindex]" size="is-small">
            <option :value="true">true</option>
            <option :value="false">false</option>
          </b-select>
      </td>
    </tr>
  </tbody>
</table>
<div class="columns tableButtons is-centered" id="extramargin">
    <div class="column">
        <b-button @click="addRow" class="addBtn" size="is-small">Add row</b-button>
    </div>
    <div class="column">
        <b-button @click="addColumn" class="addBtn" size="is-small">Add parameter</b-button>
    </div>
</div>
<div class="columns tableButtons is-centered">
    <div class="column is-one-fifth">
        <b-button @click="$store.dispatch('exampleOne')" class="addBtn" size="is-small">Example 1</b-button>
    </div>
    <div class="column is-one-fifth">
        <b-button @click="$store.dispatch('exampleTwo')" class="addBtn" size="is-small">Example 2</b-button>
    </div>
    <div class="column is-one-fifth">
        <b-button @click="$store.dispatch('exampleThree')" class="addBtn" size="is-small">Example 3</b-button>
    </div>
    <div class="column is-one-fifth">
        <b-button @click="$store.dispatch('exampleFour')" class="addBtn" size="is-small">Example 4</b-button>
    </div>
    <div class="column is-one-fifth">
        <b-button @click="$store.dispatch('reset')" class="addBtn" size="is-small">Reset</b-button>
    </div>
</div>
<div>
    <p v-if="exampleText" v-html="exampleText" class="exampleText"></p>
</div>
</div>

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';


@Component({})
export default class AppWrapper extends Vue {
    get rows(): Array<Array<boolean>> {
       return this.$store.state.rows
    }
    get columns(): Array<string> {
       return this.$store.state.columnNames
    }
    get results(): Array<boolean> {
       return this.$store.state.results
    }
    get exampleText(): string {
       return this.$store.state.exampleText
    }

    addColumn() {
        this.$store.commit('addColumn')
    }

    deleteColumn(e: number) {
        this.$store.commit('deleteColumn', e)
    }

    deleteRow(e: number) {
        this.$store.commit('deleteRow', e)
    }

    addRow() {
        this.$store.commit('addRow')
    }

    mounted() {
        // TODO: remove if statement, debug mode
        if (this.rows.length == 0) {
            this.$store.commit('addColumn')
            this.$store.commit('addRow')
        }
    }

    @Watch('columns')
    onPropertyChanged(newColumns: Array<string>) {
        this.$store.dispatch('clearErrors')
        this.$store.dispatch('checkUniqueColumns', newColumns)
    }
}
</script>
<style>
.rootElem {
  display:block;
  overflow-x: auto;
}

table {
    width: 100%;
    background-color: #cfcfcf;
}

tr {
     border-bottom: 1px solid #b0b0b0;
}
.tdCenterContext {
    text-align: center !important;
}
.params {
    text-align: center;
}
.columnText {
    max-width: 10px;
}
.tableButtons > div{
    padding-right: 0 !important;
    padding-left: 0 !important;
    text-align: center;
}
.tableButtons {
    margin-left: 0 !important;
    margin-right: 0 !important;
}
#extramargin {
    margin-top: 0.5rem;
}
.brand {
    font-family: "Source Sans Pro";
    font-weight: bolder;
    font-size: 1.5em;
}
.exampleText {
    color: white;
}
.exampleText > a {
    color: hsl(48, 100%, 67%);
    text-decoration: none
}

</style>
