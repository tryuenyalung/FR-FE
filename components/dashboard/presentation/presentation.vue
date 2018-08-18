<template>
  <div>

    <div class="modal" :class="{'is-active': this.isUploadPresentationModalActive}">
      <div @click="toggleUploadPresentationModal" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h3 class="subtitle is-3 has-text-centered">Upload Presentation</h3>

          <div class="file has-name is-boxed is-centered is-danger">
            <form id="uploadPresentationForm">

              <label class="file-label">
                <input class="file-input" type="file" name="file" ref="inputPresentation" v-on:change="displayPresentationInfoOnForm" accept=".ppt, .pot, .pps, .pptx, .pptm, .potx, .potm, .ppam, .ppsx, .ppsm, .sldx, .sldm">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Choose a presentation file…
                  </span>
                </span>
                <span class="file-name">
                  {{this.presentationUploadFileName}}
                </span>
                <span>
                  <br>
                  <input @keydown.enter.prevent v-model="presentation_tag" class="is-fullwidth input has-background-white-ter" type="text"
                    name="presentation_tag" placeholder="add presentation tag..">
                </span>
              </label>

            </form>



          </div>

          <div>
            <button @click="validateUploadImageForm()" class="button is-danger is-pulled-right is-outlined">Upload</button>
            <br>
          </div>


        </div>
      </div>

    </div>
    <!-- end of modal upload -->

    <div class="modal" :class="{'is-active': this.isDeletePresentationModalActive}">
      <div @click="toggleDeletePresentationModal" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h4 class="subtitle is-4 has-text-centered">Are you sure you want to delete this presentation?</h4>

          <img :src="`${this.presentationToBeDeleted.url}`" alt="">
          <div>
            <button @click="deletePresentation()" class="button is-danger is-pulled-right is-outlined">Delete</button>
            <br>
          </div>


        </div>
      </div>

    </div>
    <!-- end of modal delete -->

    <div class="section">

      <!--search input-->
      <div class="field has-addons has-addons-centered">
        <p class="control is-expanded">
          <input @keydown.enter="searchPresentation" v-model="presentationSearchInput" class="input is-medium" type="text" placeholder="Search presentations...">
        </p>
        <p class="control">
          <button @click="searchPresentation" class="button is-danger is-outlined is-pulled-right fas fa-search is-medium" />
        </p>
        <p class="control">
          <button @click="toggleUploadPresentationModal()" class="button is-danger is-outlined is-pulled-right fas fa-cloud-upload-alt is-medium"
          />
        </p>
      </div>

      <!--image box-->


      <div class="columns" v-for="presentations in chunkedUserPresentationData" :key="presentations._id">
        <div class="column is-one-quarter" v-for="presentation in presentations" :key="presentation._id">

          <div class="card">

            <div class="padding is-10">
              <span class="subtitle is-5">
                <b class="is-size-6">{{presentation.metadata.tag}}</b>
              </span>
              <br>
              <span class=" is-pulled-right tag is-danger">
                <b> {{ byteToMb(presentation.length) }} mb</b>
              </span>&nbsp;
            </div>

            <div class="card-image">
              <div class="has-text-centered">
                <i class="fa-10x far fa-file-powerpoint has-text-danger"></i>
                <br>
                <br>
              </div>
            </div>

            <footer class="card-footer">
              <a @click="getPresentationDetailsToBeDelete(`${presentation.filename}`, `${API_PRESENTATION}${presentation.filename}`)" class="card-footer-item fas fa-trash-alt"
              />
              <a target="_blank" :href="`${API_PRESENTATION}${presentation.filename}`" class="card-footer-item fas fa-download" />
            </footer>

          </div>

        </div>
      </div>



      <div class="level">

        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <a class="button" @click="firstPage"> First </a>
            </p>

            <p class="control">
              <a class="button" @click="lastPage"> Last </a>
            </p>
          </div>
        </div>


        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static"> Page: 1 </a>
            </p>

            <p class="control">
              <a class="button is-static"> Total: {{presentationListTotalNo}} </a>
            </p>
          </div>
        </div>


        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <a class="button" @click="prevPage"> Previous </a>
            </p>

            <p class="control">
              <a class="button" @click="nextPage"> Next </a>
            </p>
          </div>
        </div>
      </div>








    </div>

    <loader :isActive="this.isLoaderActive" />
  </div>
</template>

<script>
  import _ from "lodash"
  import axios from 'axios'
  import keys from '~/components/keys.js'
  import loader from '~/components/loader'

  export default {

    mounted() {
      this.toggleLoader()

      const config = {
        method: 'GET',
        url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PRESENTATION}`,
        headers: {
          "Authorization": `Bearer ${this.$store.state.user_details.token}`
        }

      }

      axios(config)
        .then(res => {
          this.presentationList = res.data.docs
          this.presentationListTotalPageNo = res.data.pages
          this.presentationListTotalNo = res.data.total
          this.toggleLoader()
          console.log(this.presentationList)
        })
        .catch(err => {
          this.toggleLoader()
          alert(err)
        })



    },

    components: {
      loader
    }, //components


    data() {
      return {
        API_PRESENTATION: `${keys.BASE_URL}${keys.API_PRESENTATION}/`,

        updateModalState: false,
        presentationSearchInput: "",

        presentation_tag: '',
        isLoaderActive: false,

        isUploadPresentationModalActive: false,
        isDeletePresentationModalActive: false,
        presentationUploadFileName: '',

        presentationList: [],
        presentationListTotalPageNo: 0,
        presentationListTotalNo: 0,
        presentationPageNo: 1,

        presentationToBeDeleted: {}

      } //return
    }, //data

    computed: {
      chunkedUserPresentationData() {
        return _.chunk(this.presentationList, 4);
      },



    }, //computed

    methods: {
      byteToMb: function (byte) {
        let mb = byte * 0.000001
        return _.ceil(mb, 2)
      },

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

      toggleUploadPresentationModal() {
        this.isUploadPresentationModalActive = !this.isUploadPresentationModalActive
      },

      toggleDeletePresentationModal() {
        this.isDeletePresentationModalActive = !this.isDeletePresentationModalActive
      },


      getPresentationDetailsToBeDelete(filename, url) {
        this.presentationToBeDeleted = {
          filename: filename,
          url: url
        }
        this.toggleDeletePresentationModal()
      },

      firstPage() {
        this.toggleLoader()

        this.presentationPageNo = 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PRESENTATION}&page=${this.presentationPageNo}&tag=${this.presentationSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.presentationList = res.data.docs
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      lastPage() {
        this.toggleLoader()

        this.presentationPageNo = this.presentationListTotalPageNo

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PRESENTATION}&page=${this.presentationPageNo}&tag=${this.presentationSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.presentationList = res.data.docs
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      nextPage() {
        this.toggleLoader()

        this.presentationPageNo += 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PRESENTATION}&page=${this.presentationPageNo}&tag=${this.presentationSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {

            if ((res.data.docs).length === 0) {
              this.presentationPageNo -= 1
              this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', 'no more data to display'))
              this.toggleLoader()
            } else {
              this.presentationList = res.data.docs
              this.toggleLoader()
            }

          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      prevPage() {

        if (this.presentationPageNo === 1) {

        } else {
          this.presentationPageNo -= 1
          this.toggleLoader()

          const config = {
            method: 'GET',
            url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PRESENTATION}&page=${this.presentationPageNo}&tag=${this.presentationSearchInput}`,
            headers: {
              "Authorization": `Bearer ${this.$store.state.user_details.token}`
            }
          }

          axios(config)
            .then(res => {
              this.toggleLoader()
              this.presentationList = res.data.docs
            })
            .catch(err => {
              this.toggleLoader()
              this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
            })
        }
      },

      displayPresentationInfoOnForm() {
        this.presentationUploadFileName = this.$refs.inputPresentation.value
      },

      validateUploadImageForm() {

        if (!_.isEmpty(this.presentationUploadFileName) && !_.isEmpty(this.presentation_tag)) {
          this.uploadPresentation()
        } else {
          this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle',
            'Please choose a presentation to upload and add presentation tag..'))
        }

      },

      uploadPresentation() {
        this.toggleLoader()
        let formData = new FormData(uploadPresentationForm) //new FormData(formNameHere)

        const config = {
          method: 'POST',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PRESENTATION}&tag=${this.presentation_tag}`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${this.$store.state.user_details.token}`,
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.toggleUploadPresentationModal()
            this.searchPresentation()
            this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'Presentation successfully upload..'))
            this.presentationUploadFileName = ''
            this.presentation_tag = ''
          })
          .catch(err => {
            this.toggleLoader()
            this.toggleUploadPresentationModal()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
            this.presentationUploadFileName = ''
            this.presentation_tag = ''
          })

      },

      searchPresentation() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PRESENTATION}&tag=${this.presentationSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.presentationList = res.data.docs
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },


      deletePresentation() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files/delete?bucket=${keys.BUCKET_PRESENTATION}&filename=${this.presentationToBeDeleted.filename}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.searchPresentation()
            this.toggleDeletePresentationModal()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
            this.toggleDeletePresentationModal()
          })
      },




    }
  };

</script>

<style scoped>
  /* a {
    color: #c62828;
  } */

  a {
    color: #2e7d32;
  }
  
  .padding.is-10 {
    padding: 10px;
  }

</style>
