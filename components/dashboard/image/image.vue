<template>
  <div>

    <div class="modal" :class="{'is-active': this.isUploadImageModalActive}">
      <div @click="toggleUploadImageModal" class="modal-background" />

      <div class="modal-content">
        <div class="box">

          <h3 class="subtitle is-3 has-text-centered">Upload Image</h3>

          <div class="file has-name is-boxed is-centered is-danger">
            <form id="uploadImageForm">

              <label class="file-label">
                <input class="file-input" type="file" name="file" ref="inputImage" v-on:change="displayImageInfoOnForm" accept="image/png, image/jpeg">
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
                  <input @keydown.enter.prevent v-model="image_tag" class="is-fullwidth input has-background-white-ter" type="text" name="image_tag"
                    placeholder="add image tag..">
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
          <input @keydown.enter="searchImage" v-model="imageSearchInput" class="input is-medium" type="text" placeholder="Search images...">
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
              <a @click="getImageDetailsToBeDeleted(`${image.filename}`, `${API_IMAGE}${image.filename}`)" class="card-footer-item fas fa-trash-alt"
              />
              <a @click="copyToClipBoard(`${API_IMAGE}${image.filename}`)" class="card-footer-item fas fa-copy" />
              <a target="_blank" :href="`${API_IMAGE}${image.filename}`" class="card-footer-item fas fa-external-link-alt" />
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
          console.log(this.imageList)
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
        API_IMAGE: `${keys.BASE_URL}${keys.API_IMAGE}/`,

        updateModalState: false,
        imageSearchInput: "",

        image_tag: '',
        isLoaderActive: false,
        isUploadImageModalActive: false,
        isDeleteImageModalActive: false,
        imageUploadFileName: '',

        imageList: [],
        imageListTotalPageNo: 0,
        imageListTotalNo: 0,
        imagePageNo: 1,

        imageToBeDeleted: {}

      } //return
    }, //data

    computed: {
      chunkedUserImageData() {
        return _.chunk(this.imageList, 4);
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
