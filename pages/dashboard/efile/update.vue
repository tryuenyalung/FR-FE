<template>
  <div>

    <loader :isActive="this.isLoaderActive" />

    <section class="section">
      <TinyMce v-model="content" :init="tinymce" />
      <br>
    </section>

    <div class="section" style="padding-top:0px !important;">
      <button class="button is-danger is-pulled-right" v-if="this.isUpdatedButtonShown === true" @click="updateEfile">Update</button>
    </div>


  </div>
</template>

<script>
  import TinyMce from '@tinymce/tinymce-vue'
  import axios from 'axios'
  import keys from '~/components/keys.js'
  import loader from '~/components/loader'


  export default {


    components: {
      TinyMce,
      loader
    },

    created() {

      if (localStorage.getItem('token') === null) {
        this.$router.push('/')
      }

      this.tinymce = {
        height: 500,
        // readonly: 1,
        content_style: keys.TINYMCE_STYLE,
        theme: 'modern',
        plugins: 'print fullpage',
      }
    },

    mounted() {
      const id = this.$route.query.id

      const config = {
        method: 'GET',
        url: `${keys.BASE_URL}/api/v1/efiles/${id}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$store.state.user_details.token}`
        }
      }

      if (id === undefined | id === null) {
        this.$router.push('/dashboard/efile/view/idParameterNeeded')
      } else {
        axios(config)
          .then(res => {
            if (res.data.rejection_reason === null) {
              //make tinymce read only
              this.tinymce = {
                height: 500,
                readonly: 1,
                content_style: keys.TINYMCE_STYLE,
                theme: 'modern',
                plugins: 'print fullpage',
              }

              this.isUpdatedButtonShown = false

              setTimeout(() => this.toggleLoader(), 3000)
              this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle',
                "cannot edit this efile!"))
            } else {
              this.efileDetails = res.data
              this.content = unescape(res.data.content)
              setTimeout(() => this.toggleLoader(), 3000)
            }

          })
          .catch(err => {
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.message))
            this.toggleLoader()
          })
      }

    },





    data() {
      return {

        isLoaderActive: true,
        content: '',
        isUpdatedButtonShown: true,
        efileDetails: {},

        tinymce: {}, //tinymce


      } //return
    },

    methods: {

      showNotif(type, title, icon, msg) {
        return {
          type: type,
          group: 'vnotif',
          title: `<span ><span class='fas ${icon} fa-2x'></span><span class='title is-5'> ${title}:</span></span>`,
          text: `<p class='subtitle is-5'>${msg}</p>`
        }
      },

      toggleLoader() {
        this.isLoaderActive = !this.isLoaderActive
      },

      updateEfile() {
        this.toggleLoader()

        const id = this.$route.query.id

        const content = {
          content: escape(this.content),
          rejection_reason: null,
          rejected_recipient: null
        }

        const body = Object.assign(this.efileDetails, content)

        // alert(JSON.stringify(body))


        const config = {
          method: 'PUT',
          url: `${keys.BASE_URL}/api/v1/efiles/${id}`,
          data: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'Efile succesfully updated.'));
            this.isUpdatedButtonShown = false
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
          })
      }


    }
  }

</script>
