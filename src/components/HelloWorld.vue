<template>
    <div>
        <section class="section main">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-half">
                        <AppWrapper />
                        <div v-for="error in errors" :key="error">
                            {{ error }}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-half is-vertical" style="text-align: center">
                        <b-button v-if="loadingExpressions" class="is-medium is-loading">Process</b-button>
                        <b-button v-if="!loadingExpressions" @click="run" class="is-medium">Process</b-button>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-half">
                        <p v-if="executed && expressions.length > 0">
                            Success! With the test cases above <code>{{ expressions[0] }}</code> is a solution for the problem above.
                        </p>
                        <p v-if="executed && expressions.length == 0">
                            No expressions could be generated that matched your criteria. Double check the inputs above and try again.
                        </p>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-one-quarter" v-if="executed && expressions.length > 1">
                        <p v-if="expressions.length > 1">
                        Here are some other solutions that also fit your criteria(s):
                        </p>
                        <div v-for="expression in expressions" :key="expression" class="stuff2">
                              <b-icon
                                type="is-success"
                                icon="check"
                                size="is-small" ></b-icon>

                            <code>{{ expression }}</code>
                        </div>
                    </div>
                    <div class="column is-one-quarter">
                        <h1 v-if="Object.keys(statistics).length > 1">Statistics</h1>
                        <p v-if="Object.keys(statistics).length > 1">
                            Number of expressions generated: {{ statistics.numberOfExpressions }}
                        </p>
                        <p v-if="Object.keys(statistics).length > 1">
                            Number of expressions that were filtered due to failed test cases: {{ statistics.numberOfExpressions - expressions.length}}
                        </p>
                        <p v-if="Object.keys(statistics).length > 1">
                            Number of matching expressions: {{ expressions.length }}
                        </p>
                    </div>
                </div>
            </div>
       </section>
    </div>
</template>

<script lang="ts">
import AppWrapper from './AppWrapper.vue'
import { Component, Vue } from 'vue-property-decorator';
import { reverseLookup } from './truthtable'

const sleep = async(ms: number) => new Promise(res => setTimeout(res, ms))

@Component({components: {AppWrapper}})
export default class HelloWorld extends Vue {
    get loadingExpressions(): boolean {
       return this.$store.state.loadingExpressions
    }
    get executed(): boolean {
       return this.$store.state.executed
    }
    get expressions(): Array<string> {
       return this.$store.state.expressions
    }
    get errors(): Array<string> {
       return this.$store.state.errors
    }
    get statistics() {
       return this.$store.state.expressions
    }
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

    async run() {
        this.$store.dispatch('loadingExpressions', true)
        this.$store.dispatch('clearErrors')
        this.$store.dispatch('checkUniqueColumns')
        await sleep(1000)

        if (this.errors.length == 0) {
            const ran = reverseLookup(
                this.rows,
                this.results,
                this.columns
            )
            this.$store.commit('setExpressions', ran.expressions)
            this.$store.commit('setStatistics', ran.statistics)
            this.statistics.numberOfExpressions = ran.statistics.numberOfExpressions
            this.$store.dispatch('loadingExpressions', false)
        }
    }
}
</script>

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
.columns.is-vertical {
  flex-direction: column;
}
.main {
    background-color: #2980b9;
}

/* TODO: iterate */
.stuff {
    margin: 1%;
}

@media screen and (max-width: 768px) {
.section {
    padding-top: 2em;
    padding-left: 0.2em;
    padding-right: 0.2em;
    padding-bottom: 2em;
}
}

</style>
