<template>
  <div>

    <section class="section has-background-white-ter is-fixed">

      <!-- <img class="is-paddingless is-marginless" src="~/assets/images/logo.png" alt="" ><br><br>  -->

      <figure :class="'avatar has-text-centered'">
        <img v-if="this.$store.state.user_details.user.avatar === null" :src="`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF1zJt89f-BE-BEriCrVlTfXhOKdTnVzo-CdfbL4S9aC4gzA03`">
        <img v-if="this.$store.state.user_details.user.avatar !== null" :src="`${API_PROFILE}${this.$store.state.user_details.user.avatar}`">
      </figure>

      <aside class="menu">
        <p class="has-text-centered">
            {{this.$store.state.user_details.user.name.first_name}} {{this.$store.state.user_details.user.name.middle_name}} {{this.$store.state.user_details.user.name.last_name}}
        
        </p><br>

        <ul class="menu-list">
          <li @click="changeActiveContent('efile')"><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'efile' }">Efiles</a></li>
        </ul>

        <p class="menu-label">Documents</p>
        <ul class="menu-list">

          <li @click="changeActiveContent('pdf')"><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'pdf' }">Pdfs</a></li>
          <li @click="changeActiveContent('document')"><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'document' }">Words</a></li>
          <li @click="changeActiveContent('spreadsheet')"><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'spreadsheet' }">Spreadsheets</a></li>
          <li @click="changeActiveContent('presentation')"><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'presentation' }">Presentations</a></li>
          <li @click="changeActiveContent('image')"><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'image' }">Images</a></li>
        </ul>

        <p class="menu-label">Account</p>
        <ul class="menu-list">
          <li @click="changeActiveContent('update_info')"><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'update_info' }">Update
              Info</a></li>
          <li @click="logout"><a>Logout</a></li>
        </ul>

      </aside>

    </section>
  </div>
</template>

<script>
  import keys from '~/components/keys.js'

  export default {

    created() {
      if (localStorage.getItem('token') === null) {
        this.$router.push('/')
      }
    },

    data() {

      return {
        user_avatar: localStorage.getItem('user.avatar'),
        API_PROFILE: `${keys.BASE_URL}${keys.API_PROFILE}/`,
      }

    }, //data


    methods: {

      //go to homepage and clear localstorage
      logout() {
        localStorage.clear()
        this.$router.push('/')
      },

      changeActiveContent(contentToRender) {
        this.$store.dispatch('sidebar/CHANGE_ACTIVE_CONTENT', contentToRender)
      }

    } //methods
  }

</script>

<style scoped>
  section {
    height: 150vh;
  }

  .avatar img {
    width: 170px !important;
    height: 170px !important;
    padding: 5px;
    background: #fff;
    border-radius: 50%;
    -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .1);
    box-shadow: 0 2px 3px rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .1);
  }

</style>
