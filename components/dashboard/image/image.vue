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
                <span><br>
                 <input v-model="image_tag" class="is-fullwidth input has-background-white-ter" type="text" name="image_tag"  placeholder="add image tag..">
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

    <div class="section">




      <!--search input-->
      <div class="field has-addons has-addons-centered">
        <p class="control is-expanded">
          <input v-model="imageSearchInput" class="input is-medium" type="text" placeholder="Search images...">
        </p>

        <p class="control">
          <span class="select is-medium">

            <!--checking by the value of the option-->
            <select v-model="imageSearchBy">
              <option>ID</option>
              <option>Name</option>
              <option>Type</option>
            </select>

          </span>
        </p>&nbsp;&nbsp;

        <p class="control">
          <button @click="toggleUploadImageModal()" class="button is-danger is-pulled-right fas fa-cloud-upload-alt is-medium" />
        </p>
      </div>

      <!--image box-->


      <div class="columns" v-for="images in chunkedUserImageData" :key="images.id">
        <div class="column is-one-quarter" v-for="image in images" :key="image.id">

          <div class="card">

            <div class="padding is-10">
              <span class="subtitle is-5">
                <b>{{image.name}}</b>
              </span>
              <br>
              <span class=" is-pulled-right tag is-danger">
                <b>2 mb</b>
              </span>&nbsp;
            </div>

            <div class="card-image">
              <figure class="image is-5by4">
                <img :src="image.image" alt="Placeholder image">
              </figure>
            </div>

            <footer class="card-footer">
              <a href="#" class="card-footer-item fas fa-trash-alt" />
              <a href="#" class="card-footer-item fas fa-copy" />
            </footer>

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

    components: {
      loader
    }, //components

    data() {
      return {
        updateModalState: false,
        imageSearchInput: "",
        selected: "",
        imageSearchBy: "ID",

        image_tag: null,
        isLoaderActive: false,
        isUploadImageModalActive: false,
        imageUploadFileName: null,

        userImageData: [{
            id: "a56ab46d-ce83-4830-96a0-58161fb5a217",
            name: "nunc_vestibulum.tiff",
            type: "image/x-tiff",
            size: "134.10.65.238",
            image: "http://dummyimage.com/600x480.jpg/dddddd/000000"
          },
          {
            id: "87fe2fa5-140c-481e-993a-3c5a71f30b9b",
            name: "vitae.tiff",
            type: "image/tiff",
            size: "170.209.107.11",
            image: "http://dummyimage.com/600x480.jpg/ff4444/ffffff"
          },
          {
            id: "51896d4a-d06d-41f3-894d-5d5e64a0e8c2",
            name: "cursus.gif",
            type: "image/gif",
            size: "172.138.202.221",
            image: "http://dummyimage.com/600x480.png/cc0000/ffffff"
          },
          {
            id: "48aad398-5ca6-4d57-bc5f-6b203819c651",
            name: "in_blandit.png",
            type: "image/png",
            size: "171.92.231.86",
            image: "http://dummyimage.com/600x480.jpg/cc0000/ffffff"
          },
          {
            id: "9c7385c5-3560-4522-8832-46a032fdac6a",
            name: "elit_ac.tiff",
            type: "image/x-tiff",
            size: "246.200.220.118",
            image: "http://dummyimage.com/600x480.png/ff4444/ffffff"
          },
          {
            id: "2c373edb-c69c-4c7f-bb34-6b01854014c9",
            name: "congue.gif",
            type: "image/gif",
            size: "190.177.10.225",
            image: "http://dummyimage.com/600x480.bmp/dddddd/000000"
          },
          {
            id: "6fc541de-ab14-43c6-be9b-53e2d35fae47",
            name: "ipsum.tiff",
            type: "image/tiff",
            size: "11.45.66.243",
            image: "http://dummyimage.com/600x480.png/dddddd/000000"
          },
          {
            id: "5ac76043-57db-4eb3-8fed-c4dcdabe0200",
            name: "quam_nec.jpeg",
            type: "image/pjpeg",
            size: "57.207.58.116",
            image: "http://dummyimage.com/600x480.jpg/dddddd/000000"
          },
          {
            id: "39f189ec-7e37-468b-9108-22bca5c5ffc9",
            name: "convallis_nulla.jpeg",
            type: "image/jpeg",
            size: "42.125.225.157",
            image: "http://dummyimage.com/600x480.jpg/cc0000/ffffff"
          },
          {
            id: "f5ba7544-bac9-40a3-83b7-205964efa6e3",
            name: "magna.png",
            type: "image/png",
            size: "75.114.176.232",
            image: "http://dummyimage.com/600x480.bmp/cc0000/ffffff"
          },
          {
            id: "e2b7d3e8-c1b6-4c37-8245-1e7c9fecf715",
            name: "tristique.jpeg",
            type: "image/pjpeg",
            size: "147.64.175.164",
            image: "http://dummyimage.com/600x480.bmp/cc0000/ffffff"
          },
          {
            id: "c7c2d929-533b-4889-b57d-2afaa3ef32ba",
            name: "ornare.jpeg",
            type: "image/pjpeg",
            size: "166.35.193.0",
            image: "http://dummyimage.com/600x480.bmp/5fa2dd/ffffff"
          },
          {
            id: "dce7b015-af35-420b-9636-f31ca3abd559",
            name: "id_justo.gif",
            type: "image/gif",
            size: "135.90.126.253",
            image: "http://dummyimage.com/600x480.png/5fa2dd/ffffff"
          },
          {
            id: "fbc83b6b-f65f-46bf-bdad-d955ee44d20f",
            name: "nulla.png",
            type: "image/png",
            size: "189.136.68.129",
            image: "http://dummyimage.com/600x480.bmp/5fa2dd/ffffff"
          },
          {
            id: "8cce6aac-8ab5-49bf-9229-396d984ab6a6",
            name: "consequat_varius.jpeg",
            type: "image/jpeg",
            size: "125.194.131.130",
            image: "http://dummyimage.com/600x480.png/ff4444/ffffff"
          },
          {
            id: "b52b40f2-6c7a-4326-8a88-fff09873b1f2",
            name: "vel.jpeg",
            type: "image/jpeg",
            size: "153.209.36.41",
            image: "http://dummyimage.com/600x480.png/ff4444/ffffff"
          },
          {
            id: "cb6a0518-bd3c-4e80-8253-2a69329bca0b",
            name: "in_felis_eu.jpeg",
            type: "image/pjpeg",
            size: "66.25.109.83",
            image: "http://dummyimage.com/600x480.png/5fa2dd/ffffff"
          },
          {
            id: "c31bd6fe-6034-45d5-9f1a-5a6fc393a7d2",
            name: "imperdiet_et_commodo.tiff",
            type: "image/tiff",
            size: "127.173.112.109",
            image: "http://dummyimage.com/600x480.bmp/cc0000/ffffff"
          },
          {
            id: "045aaab2-c7e6-41ea-8471-7795b4af255f",
            name: "vivamus_vestibulum.tiff",
            type: "image/x-tiff",
            size: "133.145.216.79",
            image: "http://dummyimage.com/600x480.jpg/5fa2dd/ffffff"
          },
          {
            id: "e7472dcd-84ba-4300-b313-1abdcbfaac7f",
            name: "potenti.jpeg",
            type: "image/jpeg",
            size: "36.204.65.205",
            image: "http://dummyimage.com/600x480.bmp/ff4444/ffffff"
          }
        ]
      }; //return
    }, //data

    computed: {
      chunkedUserImageData() {
        return _.chunk(this.userImageData, 4);
      }
    }, //computed

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
      toggleUploadImageModal() {
        this.isUploadImageModalActive = !this.isUploadImageModalActive
      },
      displayImageInfoOnForm() {
        this.imageUploadFileName = this.$refs.inputImage.value
      },

      validateUploadImageForm() {
        this.imageUploadFileName === null || this.imageUploadFileName === '' && this.image_tag === null || this.image_tag === '' ?
        this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','Please choose an image to upload and add image tag..') ):
        this.updateImage() 
       
      },

      updateImage() {
        this.toggleLoader()

        let formData = new FormData(uploadImageForm) //new FormData(formNameHere)

        const config = {
          method: 'POST',
          url: `${keys.BASE_URL}/api/v1/files`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${this.$store.state.user_details.token}`,
            "bucket": keys.BUCKET_IMAGE,
            "owner_id": `${this.$store.state.user_details.user._id}`
          }
        }

        axios(config)
          .then(res => {
            this.toggleLoader()
            this.toggleUploadImageModal()
            this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'Image successfully upload..'))
            this.imageUploadFileName = null
          })
          .catch(err => {
            this.toggleLoader()
            this.toggleUploadImageModal()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
            this.imageUploadFileName = null
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
