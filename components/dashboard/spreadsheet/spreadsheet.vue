<template>
  <div>
    <br>
    <div class="tab-padding tabs is-centered is-boxed is-marginless is-paddingless">
      <ul>

        <li @click="changeActiveTab('my spreadsheets')" :class="{'is-active' : activeTab === 'my spreadsheets' }">
          <a>
            <span>My Spreadsheets</span>
          </a>
        </li>

        <li @click="changeActiveTab('shared spreadsheets')" :class="{'is-active' : activeTab === 'shared spreadsheets' }">
          <a>
            <!-- <p v-if="this.$store.state.efile_notification.pendingEfileNotif > 0">
                            <span class="tag is-danger"><p class="title is-6 has-text-white">{{this.$store.state.efile_notification.pendingEfileNotif}}</p></span>
                            &nbsp;&nbsp;
                        </p> -->
            <span>Shared Spreadsheets</span>
          </a>
        </li>

      </ul>
    </div>
    <!--tabs-->

    <!--tab's content-->
    <mySpreadsheets v-if="activeTab === 'my spreadsheets' " />
    <sharedSpreadsheets v-if="activeTab === 'shared spreadsheets' " />

  </div>
</template>

<script>
  import loader from '~/components/loader'
  import axios from 'axios'
  import keys from '~/components/keys.js'
  import mySpreadsheets from './mySpreadsheet'
  import sharedSpreadsheets from './sharedSpreadsheet'

  export default {

    components: {
      mySpreadsheets,
      sharedSpreadsheets,
      loader
    }, //components


    data() {

      return {
        activeTab: 'my spreadsheets',
      } //return

    }, //data

    methods: {
      changeActiveTab(tab) {
        this.activeTab = tab
        // this.getAllNotifs()
      },



    } //methods
  }

</script>

<style scoped>

</style>
