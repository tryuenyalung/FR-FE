<template>
  <div>

    <div class="modal " :class="{'is-active' : this.isSharedFileModalActive}">
      <div class="modal-background" @click="toggleUpdateFileModal()" />

      <div class="modal-content">

        <div class="box">


          <div class="columns">
            <div class="column">

              <div class="columns">

                <div class="column">

                  <div class="field">
                    <label class="has-text-weight-semibold">File Name:</label>
                    <div class="control">
                      <input @keydown.enter.prevent v-model="file_name" class="is-fullwidth input has-background-white-ter"
                        type="text" placeholder="file name">
                    </div>
                  </div>

                </div>

                <div class="column">

                  <div class="field">
                    <label class="has-text-weight-semibold">File Tag:</label>

                    <div class="control select is-fullwidth">
                      <select v-model="file_tag">
                        <option disabled value="">Select File category</option>
                        <option :key="file._id" v-for="file in fileTagOption" :value="file._id">{{
                          file.file_tag }}</option>
                      </select>
                    </div>

                  </div>



                </div>
              </div>

            </div>
          </div>


          <div class="columns">

            <div class="column">
              <p class="subtitle is-4">Share File To:</p>
            </div>

            <div class="column">
              <span class="is-pulled-right">
                Select All
                <input class="chk_box_big" v-model="selectAllRecipient" type="checkbox">
              </span>
            </div>

          </div>



          <div class="columns">
            <div class="column">
              <div class="is-div-scrollable">
                <span v-for="users in filteredUserList" :key="users._id" v-if="isUserRecipient(`${users._id}`)">
                  <span class="tag is-danger padding is-10">
                    <b> {{users.name.first_name}} {{users.name.middle_name}} {{users.name.last_name}} </b>
                    <!-- <button class="delete is-small"></button> -->
                    <input v-model="recipientListIds" :value="users._id" class="delete is-small" type="checkbox">
                  </span> &nbsp;
                </span>
              </div>
            </div>
          </div>

          <!--search input-->
          <div class="field has-addons has-addons-centered">
            <p class="control is-expanded">
              <input v-model="userSearchInput" class="input " type="text" placeholder="Search recipients...">
            </p>

            <p class="control">
              <span class="select">

                <!--checking by the value of the option-->
                <select v-model="userSearchBy">
                  <option>Name</option>
                  <option>Username</option>
                  <option>Department</option>
                  <option>Position</option>
                </select>

              </span>
            </p>
          </div>

          <table class=" table is-table-scrollable is-bordered is-striped is-narrow is-hoverable is-fullwidth">

            <tbody>



              <tr v-for="users in filteredUserList" :key="users._id">
                <td>
                  <span> <input v-model="recipientListIds" :value="users._id" class="chk_box_big" type="checkbox"></span>
                </td>

                <td class="subtitle is-6">
                  {{users.name.first_name}} {{users.name.middle_name}} {{users.name.last_name}}
                </td>
                <td class="subtitle is-7">{{users.username}}</td>
                <td class="subtitle is-7">{{users.department}}</td>
                <td class="subtitle is-7">{{users.position}}</td>
              </tr>


            </tbody>

            <tfoot><br>
              <button @click="validateUpdateFileForm" class="button is-danger is-pulled-right">Send</button>
            </tfoot>

          </table>

        </div>
        <!--box-->
      </div>
      <!--modal-content-->
    </div>
    <!--modal-->


    <div class="modal" :class="{'is-active': this.isUploadFileModalActive}">
      <div @click="toggleUploadFileModal" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h3 class="subtitle is-3 has-text-centered">Upload File</h3>

          <div class="file has-name is-boxed is-centered is-danger">
            <form id="uploadFileForm">

              <label class="file-label">
                <input class="file-input" type="file" name="file" ref="inputImage" v-on:change="displayFileInfoOnForm"
                  accept=".pdf">
                <span class="file-cta is-borderless">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label has-text-centered">
                    Choose a file…
                  </span>
                  <div class="file-name is-centered has-text-centered" style="border-color: transparent !important">
                    <p>{{this.fileUploadFileName}}</p>

                  </div>
                </span>



                <span>
                  <br>
                  <input @keydown.enter.prevent v-model="file_name" class="is-fullwidth input has-background-white-ter"
                    type="text" placeholder="file name">
                </span>
                <span>
                  <div class="select is-fullwidth ">
                    <select v-model="file_tag">
                      <option disabled value="">Select File category</option>
                      <option :key="file._id" v-for="file in fileTagOption" :value="file._id">{{
                        file.file_tag }}</option>
                    </select>
                  </div>
                </span>
              </label>

            </form>

          </div>

          <div>
            <button @click="validateUploadFileForm()" class="button is-danger is-pulled-right is-outlined">Upload</button>
            <br>
          </div>


        </div>
      </div>

    </div>
    <!-- end of modal upload -->

    <div class="modal" :class="{'is-active': this.isDeleteFileModalActive}">
      <div @click="toggleDeleteFileModal()" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h4 class="subtitle is-4 has-text-centered">Are you sure you want to delete this file?</h4>

          <img :src="`${this.fileToBeDeleted.url}`" alt="">
          <div>
            <button @click="deleteFile()" class="button is-danger is-pulled-right is-outlined">Delete</button>
            <br>
          </div>


        </div>
      </div>

    </div>
    <!-- end of modal delete -->

    <div class="section padding is-10">

      <!--search input-->
      <div class="field has-addons has-addons-centered">
        <p class="control is-expanded">
          <input @keydown.enter="searchFile" v-model="fileSearchInput" class="input is-medium" type="text" placeholder="Search files...">
        </p>

        <p class="control">
          <button @click="searchFile" class="button is-danger is-outlined is-pulled-right fas fa-search is-medium" />
        </p>


      </div>

      <div class="columns">
        <div class="column">
          <p class="control">
            <button @click="toggleUploadFileModal()" class="button is-danger is-outlined is-pulled-left fas fa-cloud-upload-alt is-medium" />
          </p>
        </div>

        <div class="column">
          <div class="select is-fullwidth ">
            <select @change="filterFileList()" v-model="filterFileBy">
              <option disabled value="">Filter by tag</option>
              <option value="">All</option>
              <option :key="file._id" v-for="file in fileTagOption" :value="file._id">{{ file.file_tag }}</option>
            </select>
          </div>
        </div>



      </div>

      <!--image box-->


      <div class="columns" v-for="files in chunkedUserFileData" :key="files._id">
        <div class="column is-one-quarter" v-for="file in files" :key="file._id">

          <div class="card">

            <div class="columns v-centered is-marginless">
              <div class="column has-text-centered">
                <b>{{file.metadata.name}}</b>
              </div>
            </div>

            <div class="level has-text-centered padding is-10 is-marginless">

              <div class="level-left is-marginless" v-if="isFileTagLoaded">
                <b class="tag is-danger">{{getFileTagNameById(file.metadata.tag)}}</b>
              </div>

              <div class="level-right is-marginless">
                <b class="tag is-danger"> {{ byteToMb(file.length) }} mb</b>
              </div>

            </div>

            <div class="card-image">
              <div class="has-text-centered">
                <i class="fa-10x fas fa-file-pdf has-text-danger"></i>
                <br>
                <br>
              </div>
            </div>


            <footer class="card-footer">
              <a @click="getFileDetailsToBeDeleted(`${file.filename}`, `${file.metadata}` )" class="card-footer-item fas fa-trash-alt" />
              <a target="_blank" :href="`${API_PDF}${file.filename}`" class="card-footer-item fas fa-cloud-download-alt" />
              <a @click="getFileDetailsToBeShared(`${file.filename}`,`${file.metadata.name}`,`${file.metadata.tag}`)"
                class="card-footer-item fas fa-share-alt" />
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
              <a class="button is-static"> Page: {{filePageNo}} </a>
            </p>

            <p class="control">
              <a class="button is-static"> Total: {{fileListTotalNo}} </a>
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
      this.getListOfUsers()
      this.getMyFiles()
      this.getFileTags()
    },

    components: {
      loader
    }, //components


    data() {
      return {
        API_PDF: `${keys.BASE_URL}${keys.API_PDF}/`,


        //numeric
        fileListTotalPageNo: 0,
        fileListTotalNo: 0,
        filePageNo: 1,

        //string
        userSearchInput: '',
        userSearchBy: 'Name',
        filterFileBy: '',
        fileSearchInput: "",
        file_name: '',
        file_tag: '',
        fileUploadFileName: '',

        //boolean
        isLoaderActive: false,
        isUploadFileModalActive: false,
        isDeleteFileModalActive: false,
        isSharedFileModalActive: false,
        isRecipentSelectAll: false,

        //object
        fileToBeDeleted: {},
        fileToBeUpdated: {},
        fileToBeShared: {},

        //collection
        fileList: [],
        filteredFileList: [],
        userList: [],
        recipientListIds: [],
        fileTagOption: [],


      } //return
    }, //data


    computed: {
      chunkedUserFileData() {
        return _.chunk(this.filteredFileList, 4)
      },

      isFileTagLoaded() {
        return this.fileTagOption.length;
      },


      selectAllRecipient: { //i dont really get this :(
        get: function () {
          // let isrecipientListIdsEqualToFilteredUserList = this.recipientListIds.length == this.filteredUserList.length
          return this.filteredUserList ? this.recipientListIds.length == this.filteredUserList.length : false
        },
        set: function (value) {
          let recipientListIds = []

          if (value) {
            this.filteredUserList.forEach((user) => recipientListIds.push(user._id))
          }

          this.recipientListIds = recipientListIds
        }
      },

      filteredUserList() {
        return this.userList.filter(x => {

          //cannot search Numbers
          if (this.userSearchBy === 'Name') {
            return x.name.first_name.toLowerCase().includes(this.userSearchInput.toLowerCase())
          }
          if (this.userSearchBy === 'Username') {
            return x.username.toLowerCase().includes(this.userSearchInput.toLowerCase())
          }
          if (this.userSearchBy === 'Department') {
            return x.department.toLowerCase().includes(this.userSearchInput.toLowerCase())
          }
          if (this.userSearchBy === 'Position') {
            return x.position.toLowerCase().includes(this.userSearchInput.toLowerCase())
          }
          return x

        })
      }, //filteredUserList

    }, //computed

    methods: {


      getFileTagNameById(id) {
        let fileTag = this.fileTagOption.find(x => x._id === id)
        return `${fileTag.file_tag}`
      },


      isUserRecipient(id) {
        //determines the shared user to be display
        let sharedUser = this.recipientListIds

        let isUserRecipient = false

        sharedUser.forEach(x => {
          if (x === id) {
            isUserRecipient = true
          }
        })

        return isUserRecipient
      },

      toggleUpdateFileModal() {
        // this.toogleSelecAllRecipient
        this.isSharedFileModalActive = !this.isSharedFileModalActive
      },

      toogleSelecAllRecipient() {
        this.isRecipentSelectAll = !this.isRecipentSelectAll
      },



      shareFiles() {

        this.toggleLoader()
        let userIds = []

        this.userList.forEach(x => {
          if (this.recipientListIds.includes(x._id)) {

            let tempObj = {
              id: x._id
            }
            userIds.push(tempObj)

          }
        })

        this.fileToBeShared["sharedUser"] = userIds
        this.fileToBeShared["name"] = this.file_name
        this.fileToBeShared["tag"] = this.file_tag

        const config = {
          method: 'PUT',
          url: `${keys.BASE_URL}/api/v1/files`,
          data: this.fileToBeShared,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }

        }

        axios(config)
          .then(res => {

            this.getMyFiles()
            this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'File successfully shared..'))
            this.toggleUpdateFileModal()
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.toggleUpdateFileModal()
            alert(err)
          })
      },

      filterFileList() {
        this.filteredFileList = this.fileList.filter(x => {
          if (_.isEmpty(this.filterFileBy)) {
            return this.fileList
          } else {
            return x.metadata.tag === this.filterFileBy
          }
        })
      }, //filteredUserList


      getMyFiles() {
        this.toggleLoader()

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PDF}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }

        }

        axios(config)
          .then(res => {
            this.fileList = res.data.docs
            this.filteredFileList = res.data.docs
            this.fileListTotalPageNo = res.data.pages
            this.fileListTotalNo = res.data.total
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            alert(err)
          })
      },

      getListOfUsers() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/users/search?status=y`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.userList = res.data
            this.userList.filter(x => x._id === this.$store.state.user_details.user.department).inde
            let indexOfUser = this.userList.findIndex(x => x._id === this.$store.state.user_details.user._id)
            this.userList.splice(indexOfUser, 1)
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
          })
      },

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


      toggleUploadFileModal() {
        this.isUploadFileModalActive = !this.isUploadFileModalActive
      },


      toggleDeleteFileModal() {
        this.isDeleteFileModalActive = !this.isDeleteFileModalActive
      },


      getFileDetailsToBeDeleted(filename) {

        this.fileToBeDeleted = {
          filename: filename,
          url: `${this.API_PDF}${filename}`,
        }

        this.toggleDeleteFileModal()
      },

      getFileDetailsToBeShared(filename, file_name, file_tag) {
        //get the shared user of the file
        let sharedUser = this.filteredFileList.find(x => x.filename === filename).metadata.sharedUser
        let recipientListIds = []
        //extract the id's for checkbox usage
        sharedUser.forEach(x => recipientListIds.push(x.id))
        this.recipientListIds = recipientListIds


        let tempObj = []

        //set the data for displaying
        this.file_name = file_name
        this.file_tag = file_tag

        this.fileToBeShared = {
          filename: filename,
          bucket: keys.BUCKET_PDF
        }
        this.toggleUpdateFileModal()
      },

      firstPage() {

        this.toggleLoader()

        this.filePageNo = 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PDF}&page=${this.filePageNo}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.fileList = res.data.docs
            this.filterFileBy = ''
            this.filterFileList()
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      lastPage() {
        this.toggleLoader()

        this.filePageNo = this.fileListTotalPageNo

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PDF}&page=${this.filePageNo}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.fileList = res.data.docs
            this.filterFileBy = ''
            this.filterFileList()
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      nextPage() {
        this.toggleLoader()

        this.filePageNo += 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PDF}&page=${this.filePageNo}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {

            if ((res.data.docs).length === 0) {
              this.filePageNo -= 1
              this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', 'no more data to display'))
              this.toggleLoader()
            } else {
              this.fileList = res.data.docs
              this.filterFileBy = ''
              this.filterFileList()
              this.toggleLoader()
            }

          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      prevPage() {

        if (this.filePageNo === 1) {

        } else {
          this.filePageNo -= 1
          this.toggleLoader()

          const config = {
            method: 'GET',
            url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PDF}&page=${this.filePageNo}&tag=${this.fileSearchInput}`,
            headers: {
              "Authorization": `Bearer ${this.$store.state.user_details.token}`
            }
          }

          axios(config)
            .then(res => {
              this.fileList = res.data.docs
              this.filterFileBy = ''
              this.filterFileList()
              this.toggleLoader()
            })
            .catch(err => {
              this.toggleLoader()
              this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
            })
        }
      },


      displayFileInfoOnForm() {
        this.fileUploadFileName = this.$refs.inputImage.value
      },


      validateUpdateFileForm() {

        if (!_.isEmpty(this.file_name) && !_.isEmpty(this.file_tag)) {
          this.shareFiles()
        } else {
          this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle',
            'Please fill in the remaining fields'))
        }

      },


      validateUploadFileForm() {

        let validExt = ['pdf']
        let fileExt = this.fileUploadFileName.toLowerCase().split('.').pop()

        if (validExt.includes(fileExt) === false) {
          this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle',
            'Invalid file type'))

        } else if (!_.isEmpty(this.fileUploadFileName) && !_.isEmpty(this.file_name) && !_.isEmpty(this.file_tag) &&
          validExt.includes(
            fileExt)) {
          this.uploadFile()
        } else {
          this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle',
            'Please fill in the remaining fields'))
        }

      },


      uploadFile() {
        this.toggleLoader()
        let formData = new FormData(uploadFileForm) //new FormData(formNameHere)

        const config = {
          method: 'POST',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PDF}&tag=${this.file_tag}&name=${this.file_name}`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${this.$store.state.user_details.token}`,
          }
        }

        axios(config)
          .then(res => {

            this.toggleUploadFileModal()
            this.getMyFiles()
            this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'Pdf successfully upload..'))
            this.fileUploadFileName = ''
            this.file_name = ''
            this.file_tag = ''
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.toggleUploadFileModal()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
            this.fileUploadFileName = ''
            this.file_name = ''
            this.file_tag = ''
          })

      },

      getFileTags() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/fileTag`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }

        }

        axios(config)
          .then(res => {
            this.fileTagOption = res.data
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            alert(err)
          })
      },

      searchFile() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_PDF}&name=${this.fileSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.fileList = res.data.docs
            this.filterFileBy = ''
            this.filterFileList()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },


      deleteFile() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files/delete?bucket=${keys.BUCKET_PDF}&filename=${this.fileToBeDeleted.filename}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.searchFile()
            this.toggleDeleteFileModal()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
            this.toggleDeleteFileModal()
          })
      },

      copyToClipBoard(stringToCopy) {
        let textArea = document.createElement("textarea")
        textArea.value = stringToCopy
        // textArea.class = "is-hidden"
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        textArea.parentNode.removeChild(textArea)

        this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'Path copy to clipboard..'))

      }


    }
  };

</script>

<style scoped>
  a {
    color: #2e7d32;
  }

  /* a {
    color: #c62828;
  } */

  .padding.is-10 {
    padding: 10px;
  }

</style>
