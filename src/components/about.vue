<template>
  <section class="section">
      <div class="container">
          <div class="columns is-centered">
              <div class="column is-half">
                <p>
                    <small>truthtable</small> is a small little project that tries to reverse lookup a boolean expression, given a few input paramters. It's all ran in the browser, no server needed. See the examples in the main page for ideas of that it does.
                </p>
                <p>
                    Written in typescript, to enforce static typing. The user interface is vue.js and as for graphical elements, bulma was used. <a href="https://github.com/lilja/truthtable"><b-icon icon="github" pack="fab"></b-icon></a>
                </p>
              </div>
          </div>
      </div>
  </section>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
@Component({})
export default class About extends Vue{}
</script>

