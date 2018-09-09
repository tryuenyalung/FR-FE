<template>
  <div>

    <loader :isActive="this.registrationLoader" />

    <section class="hero has-background-white-ter is-fullheight">

      <div class="hero-body">

        <div class="container">

          <div class="columns">

            <div class="column is-half is-offset-one-quarter">

              <form name="registerForm">
                <!-- @submit.prevent="validateBeforeSubmit" -->

                <div class="box">

                  <div>
                    <nuxt-link class=" has-text-danger" to="/">
                      <span class="fa fa-chevron-circle-left fa-lg"></span>&nbsp;
                      <span class="has-text-danger subtitle is-5">Login</span>
                    </nuxt-link>
                    <br>
                    <br>
                  </div>

                  <div class="columns">

                    <div class="column">
                      <p for="label">Username</p>
                      <input name="username" v-model="username" class="input" data-vv-as="username" :class="{ 'is-danger': errors.has('username') }"
                        v-validate="'required|email'" type="text" placeholder="Username">
                      <small class="has-text-danger">{{ errors.first('username') }}</small>
                    </div>


                    <div class="column">
                      <p for="label">Password</p>
                      <input name="password" v-model="password" class="input" :class="{ 'is-danger': errors.has('password') }" v-validate="{required:true, min:6, is:confirm_password}"
                        type="password" placeholder="Password">
                      <small class="has-text-danger">{{ errors.first('password') }}</small>
                    </div>

                    <div class="column">
                      <p for="label">Confirm Password</p>
                      <input name="confirm_password" class="input" data-vv-as="confirm password" :class="{ 'is-danger': errors.has('password:is') }"
                        v-model="confirm_password" v-validate="'required'" type="password" placeholder="Confirm Password">
                      <small class="has-text-danger">{{ errors.first('confirm_password') }}</small>
                      <br>
                      <small class="has-text-danger">{{ errors.first('password:is') }}</small>
                    </div>

                  </div>
                  <!-- columns -->


                  <span>Name</span>
                  <div class="columns">

                    <div class="column">
                      <input name="name.firstName" v-model="firstName" data-vv-as="first name" class="input" :class="{ 'is-danger': errors.has('name.firstName') }"
                        v-validate="'required'" type="text" placeholder="First Name">
                      <small class="has-text-danger">{{ errors.first('name.firstName') }}</small>
                    </div>

                    <div class="column">
                      <input name="name.middleName" v-model="middleName" data-vv-as="middle name" class="input" :class="{ 'is-danger': errors.has('name.middleName') }"
                        v-validate="'required'" type="text" placeholder="Middle Name">
                      <small class="has-text-danger">{{ errors.first('name.middleName') }}</small>
                    </div>


                    <div class="column">
                      <input name="name.lastName" v-model="lastName" data-vv-as="last name" class="input" :class="{ 'is-danger': errors.has('name.lastName') }"
                        v-validate="'required'" type="text" placeholder="Last Name">
                      <small class="has-text-danger">{{ errors.first('name.lastName') }}</small>
                    </div>

                  </div>
                  <!-- columns -->

                  <div class="columns">

                    <div class="column">
                      <p for="label">Address</p>
                      <input name="address" v-model="address" class="input" :class="{ 'is-danger': errors.has('address') }" v-validate="'required'"
                        type="text" placeholder="Street, Barangay, Municipality, Province, City">
                      <small class="has-text-danger">{{ errors.first('address') }}</small>
                    </div>

                    <div class="column">
                      <p for="label">Date of Birth</p>
                      <input name="dateOfBirth" v-model="dateOfBirth" class="input" :class="{ 'is-danger': errors.has('dateOfBirth') }" v-validate="'required'"
                        type="date" placeholder="Street, Barangay, Municipality, Province, City">
                      <small class="has-text-danger">{{ errors.first('dateOfBirth') }}</small>
                    </div>

                  </div>
                  <!-- columns -->





                  <div class="columns">

                    <div class="column">
                      <p for="label">Gender</p>
                      <div class="select is-fullwidth" :class="{ 'is-danger': errors.has('gender') }">
                        <select name="gender" v-model="gender" v-validate="'required'">
                          <option value="">Select Gender</option>
                          <option :key="gender" v-for="gender in genderOption" :value="gender">{{ gender }}</option>
                        </select>
                      </div>
                      <small class="has-text-danger">{{ errors.first('gender') }}</small>
                    </div>

                    <div class="column">

                      <p for="label">Position</p>
                      <div class="select is-fullwidth" :class="{ 'is-danger': errors.has('position') }">
                        <select name="position" v-model="position" v-validate="'required'">
                          <option value="">Select Position</option>
                          <option :key="position" v-for="position in positionOption" :value="position">{{ position }}</option>
                        </select>
                        <small class="has-text-danger">{{ errors.first('position') }}</small>
                      </div>

                    </div>

                    <div class="column">

                      <p for="label">Department</p>
                      <div class="select is-fullwidth" :class="{ 'is-danger': errors.has('department') }">
                        <select name="department" v-model="department" v-validate="'required'" required>
                          <option value="">Select Department</option>
                          <option :key="department" v-for="department in departmentOption" :value="department">{{ department }}</option>
                        </select>
                        <small class="has-text-danger">{{ errors.first('department') }}</small>
                      </div>

                    </div>

                  </div>
                  <!-- columns -->



                  <p>Digital Signature</p>
                  <br>
                  <div class="columns">
                    <div class="column">
                      <VueSignaturePad width="auto" height="200px" ref="signaturePad" class="signaturePadBorder" />
                      <!-- :options= vueSignatureOptions -->


                      <div class="field has-addons float is-pulled-right">
                        <p class="control">
                          <button type="button" class="button is-outlined is-danger is-small" @click="saveSignature">Save</button>
                        </p>

                        <p class="control">
                          <button type="button" class="button is-outlined is-danger is-small" @click="undoSignature">Undo</button>
                        </p>
                      </div>


                    </div>
                    <!-- column -->
                  </div>

                  <div>
                    <!-- <nuxt-link  type="submit" class="button is-fullwidth is-danger " to="/dashboard">Submit</nuxt-link> -->
                    <button @click="validateBeforeSubmit" type="button" class="button is-fullwidth is-danger">Submit</button>
                  </div>

                </div>
                <!--box-->

              </form>


            </div>
            <!--column-->
          </div>
          <!--columns-->

        </div>
      </div>
    </section>

  </div>
</template>

<script>
  import VueSignaturePad from 'vue-signature-pad'
  import axios from 'axios'
  import keys from '~/components/keys.js'
  import loader from '~/components/loader'

  export default {

    components: {
      VueSignaturePad,
      loader
    },

    created() {
      if (localStorage.getItem('token') !== null) {
        this.$router.push('/dashboard')
      }
    },
    
    data() {

      return {

        //for validation
        confirm_password: "",
        gender: "",

        username: "",
        password: "",
        firstName: "",
        middleName: "",
        lastName: "",
        address: "",
        department: "",
        position: "",
        dateOfBirth: "",

        registrationLoader: false,


        genderOption: [
          "male",
          "female"
        ],
        departmentOption: [
          "Department of Something",
          "Department of Another"
        ],
        positionOption: [
          "Admin Aid 1",
          "Admin Aid 2"
        ],
        //////////////////////////////////

        signatureImage: null,

        vueSignatureOptions: {
          backgroundColor: "#eceff1",
        },

        warningMsgs: {
          type: 'warn',
          group: 'warning',
          title: `<span ><span class='fas fa-exclamation-triangle fa-2x'></span><span class='title is-5'> Warning:</span></span>`,
          text: `<p class='subtitle is-5'>asdasd</p>`
        },

      } //return
    },

    computed: {


    },

    methods: {

      undoSignature() {
        this.$refs.signaturePad.undoSignature()
      },

      showNotif(type, title, icon, msg) {
        return {
          type: type,
          group: 'vnotif',
          title: `<span ><span class='fas ${icon} fa-2x'></span><span class='title is-5'> ${title}:</span></span>`,
          text: `<p class='subtitle is-5'>${msg}</p>`
        }
      },

      dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, {
          type: mime
        })
      },

      saveSignature() {
        //get signature pad data url content
        const {
          isEmpty,
          data
        } = this.$refs.signaturePad.saveSignature()

        if (isEmpty) {
          this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', 'empty signature is not allowed'));
        } else {
          this.signatureImage = this.dataURLtoFile(data, "signature.png")
          this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'signature added to form..'));
        } //else
      },

      putSignatureToForm() {
        let formData = new FormData() //new FormData(formNameHere)

        //add <input type='file' value =''  name='file'  >
        formData.append('file', this.signatureImage, this.signatureImage.name)

        // check the value of formData
        // for(var pair of formData.entries()) {
        //     console.log(pair[0]+ ', '+ pair[1]); 
        // }
        return formData
      },

      submitRegisterForm() {
        this.uploadImageToApi()
      },

      uploadImageToApi() {
        this.registrationLoader = true
        const config = {
          method: 'POST',
          url: `${keys.BASE_URL}/api/v1/files?id=${this.$store.state.user_details.user._id}&bucket=${keys.BUCKET_SIGNATURE}`,
          data: this.putSignatureToForm(),
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }

        axios(config)
          .then(res => this.createUserWhenImageUpload(res))
          .catch(err => {
            this.registrationLoader = false
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
          })
      },

      createUserWhenImageUpload(res) {
        const signature = `${res.data.file.filename}`
        let formData = new FormData(registerForm)
        formData.append('signature', signature)

        let serializeForm = {
          username: this.username,
          password: this.password,
          name: {
            first_name: this.firstName,
            middle_name: this.middleName,
            last_name: this.lastName
          },
          signature: signature,
          gender: this.gender,
          address: this.address,
          department: this.department,
          position: this.position,
          dateOfBirth: this.dateOfBirth
        }

        console.log(JSON.stringify(serializeForm))
        const config = {
          method: 'POST',
          url: `${keys.BASE_URL}/api/v1/users`,
          data: JSON.stringify(serializeForm),
          headers: {
            "Content-Type": "application/json"
          }
        }

        axios(config)
          .then(res => {
            this.registrationLoader = false
            this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'Registration Successfull'))
            setTimeout(() => this.$router.push('/'), 1500)
          })
          .catch(err => {
            this.registrationLoader = false
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
          })

      }, //createUserWhenImageUpload


      validateBeforeSubmit() {
        this.$validator.validateAll().then((res) => {
          //check if the form has no error and the signature has been saved
          res && this.signatureImage !== null ? this.submitRegisterForm() : null
          this.signatureImage === null ? this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle',
            'please fill up the form')) : null
        })
      }




    } //methods

  }

</script>

<style scoped>
  /* .signaturePadBorder{
     border-style: solid; 
     border-width: thin; 
     border-color: #c62828;
 } */

  .signaturePadBorder {
    border-style: solid;
    border-width: thin;
    border-color: #2e7d32;
  }

</style>
