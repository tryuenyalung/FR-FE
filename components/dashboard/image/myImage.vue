<template>
  <div>

    <div class="modal " :class="{'is-active' : this.isSharedImageModalActive}">
      <div class="modal-background" @click="toogleShareImageModal()" />

      <div class="modal-content">

        <div class="box">
          <div class="columns">
            <div class="column">
              <p class="subtitle is-4">Share Image To:</p>
            </div>
            <div class="column">
              <span class="is-pulled-right">
                Select All
                <input class="chk_box_big" v-model="selectAllRecipient" type="checkbox">
              </span>

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



          <table class="table is-table-scrollable is-bordered is-striped is-narrow is-hoverable is-fullwidth">

            <tbody>

              <tr v-for="users in filteredUserList" :key="users._id">
                <td>

                  <input v-model="recipientList" :value="users._id" class="chk_box_big" type="checkbox">
                </td>
                <td>{{users.name.first_name}} {{users.name.middle_name}} {{users.name.last_name}} </td>
                <td>{{users.username}}</td>
                <td>{{users.department}}</td>
                <td>{{users.position}}</td>
              </tr>

            </tbody>

            <tfoot><br>
              <button @click="shareImages" class="button is-danger is-pulled-right">Send</button>
            </tfoot>

          </table>

        </div>
        <!--box-->
      </div>
      <!--modal-content-->
    </div>
    <!--modal-->


    <div class="modal" :class="{'is-active': this.isUploadImageModalActive}">
      <div @click="toggleUploadImageModal" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h3 class="subtitle is-3 has-text-centered">Upload Image</h3>

          <div class="file has-name is-boxed is-centered is-danger">
            <form id="uploadImageForm">

              <label class="file-label">
                <input class="file-input" type="file" name="file" ref="inputImage" v-on:change="displayImageInfoOnForm"
                  accept="image/png, image/jpeg">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Choose a image file…
                  </span>
                </span>
                <span class="file-name">
                  {{this.imageUploadFileName}}
                </span>
                <span>
                  <br>
                  <input @keydown.enter.prevent v-model="image_tag" class="is-fullwidth input has-background-white-ter"
                    type="text" name="image_tag" placeholder="add image tag..">
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

    <div class="modal" :class="{'is-active': this.isDeleteImageModalActive}">
      <div @click="toggleDeleteImageModal" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h4 class="subtitle is-4 has-text-centered">Are you sure you want to delete this image?</h4>

          <img :src="`${this.imageToBeDeleted.url}`" alt="">
          <div>
            <button @click="deleteImage()" class="button is-danger is-pulled-right is-outlined">Delete</button>
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
          <input @keydown.enter="searchImage" v-model="imageSearchInput" class="input is-medium" type="text"
            placeholder="Search images...">
        </p>

        <p class="control">
          <button @click="searchImage" class="button is-danger is-outlined is-pulled-right fas fa-search is-medium" />
        </p>

        <p class="control">
          <button @click="toggleUploadImageModal()" class="button is-danger is-outlined is-pulled-right fas fa-cloud-upload-alt is-medium" />
        </p>
      </div>

      <!--image box-->


      <div class="columns" v-for="images in chunkedUserImageData" :key="images._id">
        <div class="column is-one-quarter" v-for="image in images" :key="image._id">

          <div class="card">

            <div class="padding is-10">
              <span class="subtitle is-5">
                <b class="is-size-6">{{image.metadata.tag}}</b>
              </span>
              <br>
              <span class=" is-pulled-right tag is-danger">
                <b> {{ byteToMb(image.length) }} mb</b>
              </span>&nbsp;
            </div>

            <div class="card-image">
              <figure class="image is-5by4">
                <img :src="`${API_IMAGE}${image.filename}`" alt="Placeholder image">
              </figure>
            </div>

            <footer class="card-footer">
              <a @click="getImageDetailsToBeDeleted(`${image.filename}`, `${API_IMAGE}${image.filename}`)" class="card-footer-item fas fa-trash-alt" />
              <a @click="copyToClipBoard(`${API_IMAGE}${image.filename}`)" class="card-footer-item fas fa-copy" />
              <a target="_blank" :href="`${API_IMAGE}${image.filename}`" class="card-footer-item fas fa-external-link-alt" />
              <a @click="toogleShareImageModal" class="card-footer-item fas fa-share-alt" />
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
              <a class="button is-static"> Total: {{imageListTotalNo}} </a>
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



     <!-- <table>
        <tr>
            <th><input type="checkbox" v-model="selectAllRecipient"></th>
            <th align="left">Name</th>
        </tr>
        <tr v-for="user in filteredUserList" :key="user._id">
            <td>
                <input type="checkbox" v-model="selected" :value="user._id">
            </td>
            <td>{{ user.name.first_name }}</td>
        </tr>
        </table> -->

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
      this.getListOfUsers()
      this.getMyImages()
      // this.users = [{ "id": "1", "name": "Shad Jast", "email": "pfeffer.matt@yahoo.com" },
      //       { "id": "2", "name": "Duane Metz", "email": "mohammad.ferry@yahoo.com" }, 
      //       { "id": "3", "name": "Myah Kris", "email": "evolkman@hotmail.com" }, 
      //       { "id": "4", "name": "Dr. Kamron Wunsch", "email": "lenora95@leannon.com" }]
    },

    components: {
      loader
    }, //components


    data() {
      return {
        API_IMAGE: `${keys.BASE_URL}${keys.API_IMAGE}/`,


        //numeric
        imageListTotalPageNo: 0,
        imageListTotalNo: 0,
        imagePageNo: 1,

        //string
        userSearchInput: '',
        userSearchBy: 'Name',
        imageSearchInput: "",
        image_tag: '',
        imageUploadFileName: '',

        //boolean
        isLoaderActive: false,
        isUploadImageModalActive: false,
        isDeleteImageModalActive: false,
        isSharedImageModalActive: false,
        isRecipentSelectAll: false,
        // updateModalState: false,

        //object
        imageToBeDeleted: {},

        //collection
        imageList: [],
        userList: [],
        recipientList: []


      } //return
    }, //data

    computed: {
      chunkedUserImageData() {
        return _.chunk(this.imageList, 4);
      },


      selectAllRecipient: { //i dont really get this :(
        get: function () {
          // let isRecipientListEqualToFilteredUserList = this.recipientList.length == this.filteredUserList.length
          return this.filteredUserList ? this.recipientList.length == this.filteredUserList.length : false
        },
        set: function (value) {
          let recipientList = []

          if (value) {
            this.filteredUserList.forEach( (user) =>  recipientList.push(user._id) )
          }

          this.recipientList = recipientList
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
      toogleShareImageModal() {
        // this.toogleSelecAllRecipient
        this.isSharedImageModalActive = !this.isSharedImageModalActive
      },
      toogleSelecAllRecipient() {
        this.isRecipentSelectAll = !this.isRecipentSelectAll
      },
      
      shareImages(){
        let yuen = []
     
          this.userList.forEach( x => {
            if( this.recipientList.includes(x._id) ){
                let tempObj = {id: x._id, name: `${x.name.first_name} ${x.name.middle_name} ${x.name.last_name}` }
                yuen.push(tempObj)
            }
          })

        console.log(yuen)
      },


      getMyImages() {
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_IMAGE}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }

        }

        axios(config)
          .then(res => {
            this.imageList = res.data.docs
            this.imageListTotalPageNo = res.data.pages
            this.imageListTotalNo = res.data.total
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            alert(err)
          })
      },

      getListOfUsers() {
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/users/search?status=y`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.userList = res.data
          })
          .catch(err => {
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
      toggleUploadImageModal() {
        this.isUploadImageModalActive = !this.isUploadImageModalActive
      },
      toggleDeleteImageModal() {
        this.isDeleteImageModalActive = !this.isDeleteImageModalActive
      },

      getImageDetailsToBeDeleted(filename, url) {
        this.imageToBeDeleted = {
          filename: filename,
          url: url
        }
        this.toggleDeleteImageModal()
      },

      firstPage() {
        this.toggleLoader()

        this.imagePageNo = 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_IMAGE}&page=${this.imagePageNo}&tag=${this.imageSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.imageList = res.data.docs
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      lastPage() {
        this.toggleLoader()

        this.imagePageNo = this.imageListTotalPageNo

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_IMAGE}&page=${this.imagePageNo}&tag=${this.imageSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.imageList = res.data.docs
            this.toggleLoader()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      nextPage() {
        this.toggleLoader()

        this.imagePageNo += 1

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_IMAGE}&page=${this.imagePageNo}&tag=${this.imageSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {

            if ((res.data.docs).length === 0) {
              this.imagePageNo -= 1
              this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', 'no more data to display'))
              this.toggleLoader()
            } else {
              this.imageList = res.data.docs
              this.toggleLoader()
            }

          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      prevPage() {

        if (this.imagePageNo === 1) {

        } else {
          this.imagePageNo -= 1
          this.toggleLoader()

          const config = {
            method: 'GET',
            url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_IMAGE}&page=${this.imagePageNo}&tag=${this.imageSearchInput}`,
            headers: {
              "Authorization": `Bearer ${this.$store.state.user_details.token}`
            }
          }

          axios(config)
            .then(res => {
              this.toggleLoader()
              this.imageList = res.data.docs
            })
            .catch(err => {
              this.toggleLoader()
              this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
            })
        }
      },

      displayImageInfoOnForm() {
        this.imageUploadFileName = this.$refs.inputImage.value
      },

      validateUploadImageForm() {

        if (!_.isEmpty(this.imageUploadFileName) && !_.isEmpty(this.image_tag)) {
          this.uploadImage()
        } else {
          this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle',
            'Please choose an image to upload and add image tag..'))
        }

      },

      uploadImage() {
        this.toggleLoader()
        let formData = new FormData(uploadImageForm) //new FormData(formNameHere)

        const config = {
          method: 'POST',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_IMAGE}&tag=${this.image_tag}`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${this.$store.state.user_details.token}`,
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.toggleUploadImageModal()
            this.searchImage()
            this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'Image successfully upload..'))
            this.imageUploadFileName = ''
            this.image_tag = ''
          })
          .catch(err => {
            this.toggleLoader()
            this.toggleUploadImageModal()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
            this.imageUploadFileName = ''
            this.image_tag = ''
          })

      },

      searchImage() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_IMAGE}&tag=${this.imageSearchInput}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.imageList = res.data.docs
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
          })
      },

      deleteImage() {
        this.toggleLoader()
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/files/delete?bucket=${keys.BUCKET_IMAGE}&filename=${this.imageToBeDeleted.filename}`,
          headers: {
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.searchImage()
            this.toggleDeleteImageModal()
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err))
            this.toggleDeleteImageModal()
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

