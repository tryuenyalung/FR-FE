<template>
  <div>

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
            <button @click="getMyFiles()" class="button is-danger is-outlined is-pulled-left fas fa-sync-alt is-medium" />
          </p>
        </div>

        <div class="column">
          <div class="select is-fullwidth ">
            <select @change="filterFileList()" v-model="filterFileBy">
              <option disabled value="">Filter by category</option>
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
                <i class="fa-10x far fa-file-word has-text-danger"></i>
                <br>
                <br>
              </div>
            </div>

            <div class="padding is-10">
              <span v-if="isUserListLoaded">
                <p><small><b>Shared by:</b> <em> {{getUserInfoById(file.metadata.owner)}}</em> </small></p>
                <small><b>Date shared:</b> <em> {{ getFileSharedDate(file.metadata.sharedUser) | dateTimeFormatter }}</em>
                </small>
              </span>
            </div>




            <footer class="card-footer">
              <a target="_blank" :href="`${API_DOCUMENT}${file.filename}`" class="card-footer-item tooltip is-tooltip-bottom"
                data-tooltip="Download">
                <i class=" fas fa-cloud-download-alt"></i>
              </a>
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
  import moment from 'moment'
  import keys from '~/components/keys.js'
  import loader from '~/components/loader'

  export default {


    mounted() {
      // Code that will run only after the
      // entire view has been rendered
      this.getMyFiles()
      this.getListOfUsers()
      this.getFileTags()

    },


    components: {
      loader
    }, //components


    data() {
      return {
        API_DOCUMENT: `${keys.BASE_URL}${keys.API_DOCUMENT}/`,


        //numeric
        fileListTotalPageNo: 0,
        fileListTotalNo: 0,
        filePageNo: 1,

        //string
        userSearchInput: '',
        userSearchBy: 'Name',
        filterFileBy: '',
        fileSearchInput: "",

        //boolean
        isLoaderActive: false,

        //collection
        fileList: [],
        filteredFileList: [],
        userList: [],
        recipientListIds: [],
        fileTagOption: [],


      } //return
    }, //data

    filters: {

      dateTimeFormatter: function (value) {
        if (value)
          return moment(String(value)).format('MMM Do YY')
      }

    },
    computed: {
      chunkedUserFileData() {
        return _.chunk(this.filteredFileList, 4)
      },

      isUserListLoaded() {
        return this.userList.length;
      },

      isFileTagLoaded() {
        return this.fileTagOption.length;
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

      filterFileList() {
        this.filteredFileList = this.fileList.filter(x => {
          if (_.isEmpty(this.filterFileBy)) {
            return this.fileList
          } else {
            return x.metadata.tag === this.filterFileBy
          }
        })
      }, //filteredUserList

      getFileTagNameById(id) {
        let fileTag = this.fileTagOption.find(x => x._id === id)
        return `${fileTag.file_tag}`
      },

      getUserInfoById(id) {
        let userInfo = this.userList.find(x => x._id === id)
        return `${userInfo.name.first_name} ${userInfo.name.middle_name} ${userInfo.name.last_name}`
      },

      getFileSharedDate(arr) {
        console.log(JSON.stringify(arr));
        let sharedUserInfo = arr.find(x => x.id === this.$store.state.user_details.user._id)
        return sharedUserInfo.sharedDate
        // return `${userInfo.name.first_name} ${userInfo.name.middle_name} ${userInfo.name.last_name}`
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
            this.userList = res.data.docs
            this.userList.filter(x => x._id === this.$store.state.user_details.user.department).inde
            let indexOfUser = this.userList.findIndex(x => x._id === this.$store.state.user_details.user._id)
            this.userList.splice(indexOfUser, 1)
            this.getFileTags()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
          })
      },

      getMyFiles() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files/sharedFile?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}`,
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

      firstPage() {

        this.toggleLoader()

        this.filePageNo = 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files/sharedFile?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&page=${this.filePageNo}`,
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
          url: `${keys.BASE_URL}/api/v1/files/sharedFile?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&page=${this.filePageNo}`,
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
          url: `${keys.BASE_URL}/api/v1/files/sharedFile?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&page=${this.filePageNo}`,
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
            url: `${keys.BASE_URL}/api/v1/files/sharedFile?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&page=${this.filePageNo}`,
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

      searchFile() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files/sharedFile?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_DOCUMENT}&name=${this.fileSearchInput}`,
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
