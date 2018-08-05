<template>
  <div>

    <div class="modal" :class="{'is-active': this.isUploadSpreadsheetModalActive}">
      <div @click="toggleUploadSpreadsheetModal" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h3 class="subtitle is-3 has-text-centered">Upload Spreadsheet</h3>

          <div class="file has-name is-boxed is-centered is-danger">
            <form id="uploadSpreadsheetForm">

              <label class="file-label">
                <input class="file-input" type="file" name="file" ref="inputSpreadsheet" v-on:change="displaySpreadsheetInfoOnForm" accept=".xls, .xlt , .xlm, .xlsx, .xlsm , .xltx , .xltm , .xlsb , .xla , .xlam, .xll  .xlw">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Choose a spreadsheet file…
                  </span>
                </span>
                <span class="file-name">
                  {{this.spreadsheetUploadFileName}}
                </span>
                <span>
                  <br>
                  <input @keydown.enter.prevent v-model="spreadsheet_tag" class="is-fullwidth input has-background-white-ter" type="text" name="spreadsheet_tag"
                    placeholder="add spreadsheet tag..">
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

    <div class="modal" :class="{'is-active': this.isDeleteSpreadsheetModalActive}">
      <div @click="toggleDeleteSpreadsheetModal" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h4 class="subtitle is-4 has-text-centered">Are you sure you want to delete this spreadsheet?</h4>

          <img :src="`${this.spreadsheetToBeDeleted.url}`" alt="">
          <div>
            <button @click="deleteSpreadsheet()" class="button is-danger is-pulled-right is-outlined">Delete</button>
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
          <input @keydown.enter="searchSpreadsheet" v-model="spreadsheetSearchInput" class="input is-medium" type="text" placeholder="Search spreadsheets...">
        </p>
        <p class="control">
          <button @click="searchSpreadsheet" class="button is-danger is-outlined is-pulled-right fas fa-search is-medium" />
        </p>
        <p class="control">
          <button @click="toggleUploadSpreadsheetModal()" class="button is-danger is-outlined is-pulled-right fas fa-cloud-upload-alt is-medium"
          />
        </p>
      </div>

      <!--image box-->


      <div class="columns" v-for="spreadsheets in chunkedUserSpreadsheetData" :key="spreadsheets._id">
        <div class="column is-one-quarter" v-for="spreadsheet in spreadsheets" :key="spreadsheet._id">

          <div class="card">

            <div class="padding is-10">
              <span class="subtitle is-5">
                <b class="is-size-6">{{spreadsheet.metadata.tag}}</b>
              </span>
              <br>
              <span class=" is-pulled-right tag is-danger">
                <b> {{ byteToMb(spreadsheet.length) }} mb</b>
              </span>&nbsp;
            </div>

            <div class="card-image">
              <div class="has-text-centered">
                <i class="fa-10x far fa-file-excel has-text-danger"></i>
                <br>
                <br>
              </div>
            </div>

            <footer class="card-footer">
              <a @click="getSpreadsheetDetailsToBeDelete(`${spreadsheet.filename}`, `${API_SPREADSHEET}${spreadsheet.filename}`)" class="card-footer-item fas fa-trash-alt"
              />
              <a target="_blank" :href="`${API_SPREADSHEET}${spreadsheet.filename}`" class="card-footer-item fas fa-download" />
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
              <a class="button is-static"> Total: {{spreadsheetListTotalNo}} </a>
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
        url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_SPREADSHEET}`,
        headers: {
          "Authorization": `Bearer ${this.$store.state.user_details.token}`
        }

      }

      axios(config)
        .then(res => {
          this.spreadsheetList = res.data.docs
          this.spreadsheetListTotalPageNo = res.data.pages
          this.spreadsheetListTotalNo = res.data.total
          this.toggleLoader()
          console.log(this.spreadsheetList)
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
        API_SPREADSHEET: `${keys.BASE_URL}${keys.API_SPREADSHEET}/`,

        updateModalState: false,
        spreadsheetSearchInput: "",

        spreadsheet_tag: '',
        isLoaderActive: false,

        isUploadSpreadsheetModalActive: false,
        isDeleteSpreadsheetModalActive: false,
        spreadsheetUploadFileName: '',

        spreadsheetList: [],
        spreadsheetListTotalPageNo: 0,
        spreadsheetListTotalNo: 0,
        spreadsheetPageNo: 1,

        spreadsheetToBeDeleted: {}

      } //return
    }, //data

    computed: {
      chunkedUserSpreadsheetData() {
        return _.chunk(this.spreadsheetList, 4);
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

      toggleUploadSpreadsheetModal() {
        this.isUploadSpreadsheetModalActive = !this.isUploadSpreadsheetModalActive
      },

      toggleDeleteSpreadsheetModal() {
        this.isDeleteSpreadsheetModalActive = !this.isDeleteSpreadsheetModalActive
      },


      getSpreadsheetDetailsToBeDelete(filename, url) {
        this.spreadsheetToBeDeleted = {
          filename: filename,
          url: url
        }
        this.toggleDeleteSpreadsheetModal()
      },

      firstPage() {
        this.toggleLoader()

        this.spreadsheetPageNo = 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_SPREADSHEET}&page=${this.spreadsheetPageNo}&tag=${this.spreadsheetSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.spreadsheetList = res.data.docs
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      lastPage() {
        this.toggleLoader()

        this.spreadsheetPageNo = this.spreadsheetListTotalPageNo

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_SPREADSHEET}&page=${this.spreadsheetPageNo}&tag=${this.spreadsheetSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.spreadsheetList = res.data.docs
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      nextPage() {
        this.toggleLoader()

        this.spreadsheetPageNo += 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_SPREADSHEET}&page=${this.spreadsheetPageNo}&tag=${this.spreadsheetSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {

            if ((res.data.docs).length === 0) {
              this.spreadsheetPageNo -= 1
              this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', 'no more data to display'))
              this.toggleLoader()
            } else {
              this.spreadsheetList = res.data.docs
              this.toggleLoader()
            }

          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      prevPage() {

        if (this.spreadsheetPageNo === 1) {

        } else {
          this.spreadsheetPageNo -= 1
          this.toggleLoader()

          const config = {
            method: 'GET',
            url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_SPREADSHEET}&page=${this.spreadsheetPageNo}&tag=${this.spreadsheetSearchInput}`,
            headers: {
              "Authorization": `Bearer ${this.$store.state.user_details.token}`
            }
          }

          axios(config)
            .then(res => {
              this.toggleLoader()
              this.spreadsheetList = res.data.docs
            })
            .catch(err => {
              this.toggleLoader()
              this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
            })
        }
      },

      displaySpreadsheetInfoOnForm() {
        this.spreadsheetUploadFileName = this.$refs.inputSpreadsheet.value
      },

      validateUploadImageForm() {

        if (!_.isEmpty(this.spreadsheetUploadFileName) && !_.isEmpty(this.spreadsheet_tag)) {
          this.uploadSpreadsheet()
        } else {
          this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle',
            'Please choose a spreadsheet to upload and add spreadsheet tag..'))
        }

      },

      uploadSpreadsheet() {
        this.toggleLoader()
        let formData = new FormData(uploadSpreadsheetForm) //new FormData(formNameHere)

        const config = {
          method: 'POST',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_SPREADSHEET}&tag=${this.spreadsheet_tag}`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${this.$store.state.user_details.token}`,
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.toggleUploadSpreadsheetModal()
            this.searchSpreadsheet()
            this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'Spreadsheet successfully upload..'))
            this.spreadsheetUploadFileName = ''
            this.spreadsheet_tag = ''
          })
          .catch(err => {
            this.toggleLoader()
            this.toggleUploadSpreadsheetModal()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
            this.spreadsheetUploadFileName = ''
            this.spreadsheet_tag = ''
          })

      },

      searchSpreadsheet() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_SPREADSHEET}&tag=${this.spreadsheetSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.spreadsheetList = res.data.docs
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },


      deleteSpreadsheet() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files/delete?bucket=${keys.BUCKET_SPREADSHEET}&filename=${this.spreadsheetToBeDeleted.filename}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.searchSpreadsheet()
            this.toggleDeleteSpreadsheetModal()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
            this.toggleDeleteSpreadsheetModal()
          })
      },




    }
  };

</script>

<style scoped>
  a {
    color: #c62828;
  }

  .padding.is-10 {
    padding: 10px;
  }

</style>
