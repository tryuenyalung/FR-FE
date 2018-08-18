<template>
  <div>

    <div class="modal" :class="{'is-active': this.isUploadDocumentModalActive}">
      <div @click="toggleUploadDocumentModal" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h3 class="subtitle is-3 has-text-centered">Upload Document</h3>

          <div class="file has-name is-boxed is-centered is-danger">
            <form id="uploadDocumentForm">

              <label class="file-label">
                <input class="file-input" type="file" name="file" ref="inputDocument" v-on:change="displayDocumentInfoOnForm" accept=".doc, .dot, .wbk, .docx, .docm, .dotx, .dotm, .docb">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Choose a document file…
                  </span>
                </span>
                <span class="file-name">
                  {{this.documentUploadFileName}}
                </span>
                <span>
                  <br>
                  <input @keydown.enter.prevent v-model="document_tag" class="is-fullwidth input has-background-white-ter" type="text" name="document_tag"
                    placeholder="add document tag..">
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

    <div class="modal" :class="{'is-active': this.isDeleteDocumentModalActive}">
      <div @click="toggleDeleteDocumentModal" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h4 class="subtitle is-4 has-text-centered">Are you sure you want to delete this document?</h4>

          <img :src="`${this.documentToBeDeleted.url}`" alt="">
          <div>
            <button @click="deleteDocument()" class="button is-danger is-pulled-right is-outlined">Delete</button>
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
          <input @keydown.enter="searchDocument" v-model="documentSearchInput" class="input is-medium" type="text" placeholder="Search documents...">
        </p>
        <p class="control">
          <button @click="searchDocument" class="button is-danger is-outlined is-pulled-right fas fa-search is-medium" />
        </p>
        <p class="control">
          <button @click="toggleUploadDocumentModal()" class="button is-danger is-outlined is-pulled-right fas fa-cloud-upload-alt is-medium"
          />
        </p>
      </div>

      <!--image box-->


      <div class="columns" v-for="documents in chunkedUserDocumentData" :key="documents._id">
        <div class="column is-one-quarter" v-for="document in documents" :key="document._id">

          <div class="card">

            <div class="padding is-10">
              <span class="subtitle is-5">
                <b class="is-size-6">{{document.metadata.tag}}</b>
              </span>
              <br>
              <span class=" is-pulled-right tag is-danger">
                <b> {{ byteToMb(document.length) }} mb</b>
              </span>&nbsp;
            </div>

            <div class="card-image">
              <div class="has-text-centered">
                <i class="fa-10x far fa-file-word has-text-danger"></i>
                <br>
                <br>
              </div>
            </div>

            <footer class="card-footer">
              <a @click="getDocumentDetailsToBeDelete(`${document.filename}`, `${API_DOCUMENT}${document.filename}`)" class="card-footer-item fas fa-trash-alt"
              />
              <a target="_blank" :href="`${API_DOCUMENT}${document.filename}`" class="card-footer-item fas fa-download" />
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
              <a class="button is-static"> Total: {{documentListTotalNo}} </a>
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
        url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}`,
        headers: {
          "Authorization": `Bearer ${this.$store.state.user_details.token}`
        }

      }

      axios(config)
        .then(res => {
          this.documentList = res.data.docs
          this.documentListTotalPageNo = res.data.pages
          this.documentListTotalNo = res.data.total
          this.toggleLoader()
          console.log(this.documentList)
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
        API_DOCUMENT: `${keys.BASE_URL}${keys.API_DOCUMENT}/`,

        updateModalState: false,
        documentSearchInput: "",

        document_tag: '',
        isLoaderActive: false,

        isUploadDocumentModalActive: false,
        isDeleteDocumentModalActive: false,
        documentUploadFileName: '',

        documentList: [],
        documentListTotalPageNo: 0,
        documentListTotalNo: 0,
        documentPageNo: 1,

        documentToBeDeleted: {}

      } //return
    }, //data

    computed: {
      chunkedUserDocumentData() {
        return _.chunk(this.documentList, 4);
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

      toggleUploadDocumentModal() {
        this.isUploadDocumentModalActive = !this.isUploadDocumentModalActive
      },

      toggleDeleteDocumentModal() {
        this.isDeleteDocumentModalActive = !this.isDeleteDocumentModalActive
      },


      getDocumentDetailsToBeDelete(filename, url) {
        this.documentToBeDeleted = {
          filename: filename,
          url: url
        }
        this.toggleDeleteDocumentModal()
      },

      firstPage() {
        this.toggleLoader()

        this.documentPageNo = 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&page=${this.documentPageNo}&tag=${this.documentSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.documentList = res.data.docs
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      lastPage() {
        this.toggleLoader()

        this.documentPageNo = this.documentListTotalPageNo

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&page=${this.documentPageNo}&tag=${this.documentSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.documentList = res.data.docs
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      nextPage() {
        this.toggleLoader()

        this.documentPageNo += 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&page=${this.documentPageNo}&tag=${this.documentSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {

            if ((res.data.docs).length === 0) {
              this.documentPageNo -= 1
              this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', 'no more data to display'))
              this.toggleLoader()
            } else {
              this.documentList = res.data.docs
              this.toggleLoader()
            }

          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      prevPage() {

        if (this.documentPageNo === 1) {

        } else {
          this.documentPageNo -= 1
          this.toggleLoader()

          const config = {
            method: 'GET',
            url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&page=${this.documentPageNo}&tag=${this.documentSearchInput}`,
            headers: {
              "Authorization": `Bearer ${this.$store.state.user_details.token}`
            }
          }

          axios(config)
            .then(res => {
              this.toggleLoader()
              this.documentList = res.data.docs
            })
            .catch(err => {
              this.toggleLoader()
              this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
            })
        }
      },

      displayDocumentInfoOnForm() {
        this.documentUploadFileName = this.$refs.inputDocument.value
      },

      validateUploadImageForm() {

        if (!_.isEmpty(this.documentUploadFileName) && !_.isEmpty(this.document_tag)) {
          this.uploadDocument()
        } else {
          this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle',
            'Please choose a document to upload and add document tag..'))
        }

      },

      uploadDocument() {
        this.toggleLoader()
        let formData = new FormData(uploadDocumentForm) //new FormData(formNameHere)

        const config = {
          method: 'POST',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&tag=${this.document_tag}`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${this.$store.state.user_details.token}`,
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.toggleUploadDocumentModal()
            this.searchDocument()
            this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'Document successfully upload..'))
            this.documentUploadFileName = ''
            this.document_tag = ''
          })
          .catch(err => {
            this.toggleLoader()
            this.toggleUploadDocumentModal()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
            this.documentUploadFileName = ''
            this.document_tag = ''
          })

      },

      searchDocument() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&tag=${this.documentSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.documentList = res.data.docs
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },


      deleteDocument() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files/delete?bucket=${keys.BUCKET_DOCUMENT}&filename=${this.documentToBeDeleted.filename}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.searchDocument()
            this.toggleDeleteDocumentModal()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
            this.toggleDeleteDocumentModal()
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
