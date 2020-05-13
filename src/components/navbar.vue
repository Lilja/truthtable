<template>
    <div class="navwrap">
    <b-navbar class="nav">
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <span class="brand">truthtable</span>
            </b-navbar-item>
        </template>
        <template slot="end">
           <b-navbar-item href="https://dersand.net">
                Me
            </b-navbar-item>
            <b-navbar-item href="#/about">
                About
            </b-navbar-item>
            <b-navbar-item href="https://github.com/lilja/truthtable">
               <b-icon
                  icon="github"
                  pack="fab" >
               </b-icon>
            </b-navbar-item>
        </template>
    </b-navbar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class NavBar extends Vue {}
</script>

<style lang="less">
.nav {
    padding-left: 5%;
    padding-right: 5%;
}
.navwrap {
    width: 100%;
}
</style>
