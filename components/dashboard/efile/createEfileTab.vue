<template>
  <div>

    <div class="modal " :class="{'is-active' : this.isRecipientModalActive}">
      <div class="modal-background" @click="toggleRecipientModal()" />

      <div class="modal-content">

        <div class="box">
          <p class="subtitle is-4">List of Recipients</p>

          <div class="columns">

            <div class="column">
              <p class="label">File Name:</p>
              <input class="input" type="text" v-model="efileName" placeholder="Document for Example..">
            </div>

            <div class="column has-text-centered">
              <p class="label">Document Type:</p>
              <span class="control">
                <label class="radio">
                  <input type="radio" id="rb" value="true" v-model="private_doc">
                  Private
                </label>

                <label class="radio">
                  <input type="radio" id="rb" value="false" v-model="private_doc">
                  Public
                </label>
              </span>
            </div>

            <div class="column has-text-centered">

              <span>
                Select All
                <input class="chk_box_big" v-model="selectAllRecipient" type="checkbox">
              </span>

            </div>

            <div class="column">
              Category
              <div class="select is-fullwidth ">
                <select v-model="efileCategory">
                  <option disabled value="">Filter by category</option>
                  <option :key="file._id" v-for="file in fileTagList" :value="file.file_tag">{{ file.file_tag }}</option>
                </select>
              </div>
            </div>
          </div>
          <!--columns-->



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

              <!-- <tr v-for="users in filteredUserList" :key="users._id">
                <td>
                  use one vmodel array to store values of checkbox
                  <input v-model="recipientList" :value="{id: users._id, name: `${users.name.first_name} ${users.name.middle_name} ${users.name.last_name}` }"
                    class="chk_box_big" type="checkbox">
                </td>
                <td>{{users.name.first_name}} {{users.name.middle_name}} {{users.name.last_name}} </td>
                <td>{{users.username}}</td>
                <td>{{users.department}}</td>
                <td>{{users.position}}</td>
              </tr> -->

              <tr v-for="users in filteredUserList" :key="users._id">
                <td>
                  <span> <input v-model="recipientList" :value="users._id" class="chk_box_big" type="checkbox"></span>
                </td>

                <td class="subtitle is-6">
                  {{users.name.first_name}} {{users.name.middle_name}} {{users.name.last_name}}
                </td>
                <td class="subtitle is-7">{{users.username}}</td>
                <td v-if="isDepartmentLoaded" class="subtitle is-7">{{ getDepartmentById( users.department)}}</td>
                <td v-if="isPositionLoaded" class="subtitle is-7">{{getPositionById(users.position)}}</td>
              </tr>

            </tbody>

            <tfoot><br>
              <button @click="validateEfileBeforeSubmit" class="button is-danger is-pulled-right">Send</button>
            </tfoot>

          </table>

        </div>
        <!--box-->
      </div>
      <!--modal-content-->
    </div>
    <!--modal-->


    <section class="section">
      <TinyMce v-if="isTemplateLoaded" v-model="efileContent"  :init="tinymce"></TinyMce><br>
      <button @click="validateEfileContent()" class="is-pulled-right button is-danger is-medium"><b>Send To</b></button>
    </section>



    <loader :isActive="this.isLoaderActive" />
  </div>
</template>

<script>
  import TinyMce from '@tinymce/tinymce-vue'
  import loader from '~/components/loader'
  import axios from 'axios'
  import keys from '~/components/keys.js'

  export default {

    mounted() {


      this.getTemplateList()

      this.getPositionList()
      this.getDepartmentList()
      this.getCategoryList()
      const config = {
        method: 'GET',
        url: `${keys.BASE_URL}/api/v1/users/search?status=y`,
        headers: {
          "Authorization": `Bearer ${this.$store.state.user_details.token}`
        }
      }

      axios(config)
        .then(res => {
          this.userList = res.data.docs
        })
        .catch(err => {
          this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
        })
    },

    components: {
      TinyMce,
      loader
    },

    computed: {

      isDepartmentLoaded() {
        return this.departmentList.length;
      },

      isTemplateLoaded() {
        return this.templateList.length;
      },

      isPositionLoaded() {
        return this.positionList.length;
      },



      selectAllRecipient: { //i dont really get this :(
        get: function () {
          // let isRecipientListEqualToFilteredUserList = this.recipientList.length == this.filteredUserList.length
          return this.filteredUserList ? this.recipientList.length == this.filteredUserList.length : false
        },
        set: function (value) {
          let recipientList = []

          if (value) {
            this.filteredUserList.forEach((user) => recipientList.push(user._id))
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

      buildEfileForm() {
        let body = {
          name: this.efileName,
          file_tag: this.efileCategory,
          content: escape(this.efileContent),
          recipient: this.getRecipientList(),
          sender: {
            id: this.$store.state.user_details.user._id,
            name: `${this.$store.state.user_details.user.name.first_name} ${this.$store.state.user_details.user.name.middle_name} ${this.$store.state.user_details.user.name.last_name}`
          },
          private_doc: this.private_doc
        }

        return JSON.stringify(body)
      },


    },

    data() {
      return {

        userSearchInput: '',
        userSearchBy: 'Name',
        isRecipientModalActive: false,
        isLoaderActive: false,

        //form
        efileName: null,
        efileContent: null,
        private_doc: null,

        tinymce: {
          height: 500,
          // content_css: "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css",

          theme: 'modern',
          plugins: 'importcss code print fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link template table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
          toolbar1: 'formatselect fontselect fontsize fontsizeselect  | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat pagebreak ',
          image_advtab: true,
          templates: []
        }, //tinymce,//tinymce


        templateList: [],

        userList: [],
        recipientList: [],
        departmentList: [],
        positionList: [],
        fileTagList: [],

        efileCategory: null

      } //return
    },

    methods: {



      getDepartmentById(id) {

        let department = this.departmentList.find(x => x._id === id)

        if (_.isNil(department)) {
          return "NA"
        }
        return `${department.department}`
      },

      getPositionById(id) {

        let position = this.positionList.find(x => x._id === id)

        if (_.isNil(position)) {
          return "NA"
        }
        return `${position.position}`
      },

      asd() {
        alert("gago")
      },

      getTemplateList() {

        //  let templateList = [{
        //               title: 'Sample Document',
        //               content: unescape(
        //                 "%3C%21DOCTYPE%20html%3E%0A%3Chtml%3E%0A%3Chead%3E%0A%3C/head%3E%0A%3Cbody%3E%0A%3Cp%3E%3Cimg%20style%3D%22width%3A%20100%25%3B%20height%3A%20120px%3B%20top%3A%200px%20%21important%3B%20left%3A%200px%20%21important%3B%20z-index%3A%20-20%20%21important%3B%20position%3A%20absolute%20%21important%3B%22%20src%3D%22https%3A//www.toyotafinance.co.in/images/banner-document-784x199.jpg%22%20alt%3D%22%20width%3D%22%20height%3D%22199%22%20/%3E%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Ch1%20style%3D%22text-align%3A%20center%3B%22%3E%26nbsp%3B%3C/h1%3E%0A%3Ch1%20style%3D%22text-align%3A%20center%3B%22%3ESample%20Document%3C/h1%3E%0A%3Cp%3Easdiasdfasdtyasrdyats%20ausydtua%20sytduaystd%20uasytd%20asdtasuy%20dtasd%20auysdtasuydt%20auysdtasasdas%20asd%20ad%20asd%20asd%20asd%20asdu%20tdasuydtas%20ydtasyud%20tasyu%20tdausyt%20dasdt%20auysdtasyu%20tdasuydtasuydt%20asudtasudt%20ausydtauydtasduyats%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%3Cimg%20style%3D%22float%3A%20right%3B%22%20src%3D%22https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%22%20alt%3D%22%20width%3D%22%20height%3D%2296%22%20/%3E%3C/p%3E%0A%3Cp%20style%3D%22padding-left%3A%2060px%3B%20text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3EJohn%20S%20Doe%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/p%3E%0A%3C/body%3E%0A%3C/html%3E"
        //               )
        //             },
        //             {
        //               title: 'Certificate of Enrollment',
        //               content: unescape(
        //                 `%3C%21DOCTYPE%20html%3E%0A%3Chtml%3E%0A%3Chead%3E%0A%3C/head%3E%0A%3Cbody%3E%0A%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2012pt%3B%22%3EDepartment%20of%20%3Cimg%20style%3D%22float%3A%20left%3B%22%20src%3D%22https%3A//raw.githubusercontent.com/tryuenyalung/FR-FE/master/assets/images/logo.png%22%20alt%3D%22%22%20width%3D%22100%22%20height%3D%22100%22%20/%3EEducation%3C/span%3E%3Cimg%20style%3D%22float%3A%20right%3B%22%20src%3D%22https%3A//upload.wikimedia.org/wikipedia/commons/thumb/2/20/Department_of_Education.svg/200px-Department_of_Education.svg.png%22%20alt%3D%22%22%20width%3D%22110%22%20height%3D%22110%22%20/%3E%3Cbr%20/%3ERegion%20III%3Cbr%20/%3EDivision%20of%20Pampanga%3Cbr%20/%3E%3Cspan%20style%3D%22font-size%3A%2012pt%3B%22%3ESAN%20MATIAS%20NATIONAL%20HIGH%20SCHOOL%3C/span%3E%3Cbr%20/%3ESto.%20Tomas%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3EDate%20__________________%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2036pt%3B%22%3ECERTIFICATION%3C/span%3E%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2012pt%3B%22%3EThis%20is%20to%20certifiy%20that%20____________%20is%20a%20bonafide%20Grade%20___%20student%2C%3C/span%3E%3Cbr%20/%3E%3Cspan%20style%3D%22font-size%3A%2012pt%3B%22%3ESection%20__________%20of%20San%20Matias%20National%20High%20School%2C%20for%20the%20year%20%3Cstrong%3E2018%20-%202019.%3C/strong%3E%3C/span%3E%3Cbr%20/%3E%3Cspan%20style%3D%22font-size%3A%2012pt%3B%22%3EThis%20further%20certifies%20that%20he/she%20had%20proven%20himself/herself%20to%20bo%20Good%20Moral%20Character.%3C/span%3E%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%3Cspan%20style%3D%22font-size%3A%2012pt%3B%22%3ECertification%20is%20issued%20for%20whatever%20legal%20purpose%20it%20may%20serve%20him/her%3C/span%3E%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20center%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20left%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20left%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3C/body%3E%0A%3C/html%3E`
        //               )
        //             },
        //             // { title: 'Test template 2', content: unescape(`%3C%21DOCTYPE%20html%3E%0A%3Chtml%3E%0A%3Chead%3E%0A%3C/head%3E%0A%3Cbody%3E%0A%3Cp%3E%3Cimg%20style%3D%27width%3A%20100%25%3B%20height%3A%20120px%3B%20top%3A%200px%20%21important%3B%20left%3A%200px%20%21important%3B%20z-index%3A%20-20%20%21important%3B%20position%3A%20absolute%20%21important%3B%27%20src%3D%27https%3A//www.toyotafinance.co.in/images/banner-document-784x199.jpg%27%20alt%3D%27%20width%3D%27%20height%3D%27199%27%20/%3E%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Ch1%20style%3D%27text-align%3A%20center%3B%27%3E%26nbsp%3B%3C/h1%3E%0A%3Ch1%20style%3D%27text-align%3A%20center%3B%27%3ESample%20Document%3C/h1%3E%0A%3Cp%3Easdiasdfasdtyasrdyats%20ausydtua%20sytduaystd%20uasytd%20asdtasuy%20dtasd%20auysdtasuydt%20auysdtasasdas%20asd%20ad%20asd%20asd%20asd%20asdu%20tdasuydtas%20ydtasyud%20tasyu%20tdausyt%20dasdt%20auysdtasyu%20tdasuydtasuydt%20asudtasudt%20ausydtauydtasduyats%3C/p%3E%0A%3Cp%3E%20%20%20%20Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit.%20Labore%20deserunt%20fugit%20rerum%20reprehenderit%20a%2C%20neque%20aut.%20Ipsa%20ullam%20neque%20dolorum%20ipsam%20dolores%20iure%2C%20placeat%20voluptatem%20ad%20eveniet%20veniam%2C%20quaerat%20amet%3F%0A%20%20%20%20Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit.%20Labore%20deserunt%20fugit%20rerum%20reprehenderit%20a%2C%20neque%20aut.%20Ipsa%20ullam%20neque%20dolorum%20ipsam%20dolores%20iure%2C%20placeat%20voluptatem%20ad%20eveniet%20veniam%2C%20quaerat%20amet%3F%0A%20%20%20%20Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit.%20Labore%20deserunt%20fugit%20rerum%20reprehenderit%20a%2C%20neque%20aut.%20Ipsa%20ullam%20neque%20dolorum%20ipsam%20dolores%20iure%2C%20placeat%20voluptatem%20ad%20eveniet%20veniam%2C%20quaerat%20amet%3F%0A%20%20%20%20Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit.%20Labore%20deserunt%20fugit%20rerum%20reprehenderit%20a%2C%20neque%20aut.%20Ipsa%20ullam%20neque%20dolorum%20ipsam%20dolores%20iure%2C%20placeat%20voluptatem%20ad%20eveniet%20veniam%2C%20quaerat%20amet%3F%0A%20%3C/p%3E%0A%20%0A%0A%0A%3Cdiv%20style%3D%27text-align%3A%20center%20%21important%27%3E%0A%3Cspan%3E%0A%3Cdiv%20style%3D%27display%3Ainline-block%20%21important%3B%20text-align%3Acenter%20%21important%27%3E%0A%3Cimg%20src%3D%27https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%27%20width%3D%27150%27%3E%0A%3Cbr%3E%20Yuen%20Y.%20Yalung%20%3Cbr%3E%0AAdmin%20Aid%201%0A%3C/div%3E%0A%0A%20%0A%3Cdiv%20style%3D%27display%3Ainline-block%20%21important%3B%20text-align%3Acenter%20%21important%27%3E%0A%3Cimg%20src%3D%27https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%27%20width%3D%27150%27%3E%0A%3Cbr%3E%20Yuen%20Y.%20Yalung%20%3Cbr%3E%0AAdmin%20Aid%201%0A%3C/div%3E%0A%0A%0A%20%0A%3Cdiv%20style%3D%27display%3Ainline-block%20%21important%3B%20text-align%3Acenter%20%21important%27%3E%0A%3Cimg%20src%3D%27https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%27%20width%3D%27150%27%3E%0A%3Cbr%3E%20Yuen%20Y.%20Yalung%20%3Cbr%3E%0AAdmin%20Aid%201%0A%3C/div%3E%0A%3Cdiv%20style%3D%27display%3Ainline-block%20%21important%3B%20text-align%3Acenter%20%21important%27%3E%0A%3Cimg%20src%3D%27https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%27%20width%3D%27150%27%3E%0A%3Cbr%3E%20Yuen%20Y.%20Yalung%20%3Cbr%3E%0AAdmin%20Aid%201%0A%3C/div%3E%0A%3Cdiv%20style%3D%27display%3Ainline-block%20%21important%3B%20text-align%3Acenter%20%21important%27%3E%0A%3Cimg%20src%3D%27https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%27%20width%3D%27150%27%3E%0A%3Cbr%3E%20Yuen%20Y.%20Yalung%20%3Cbr%3E%0AAdmin%20Aid%201%0A%3C/div%3E%0A%3Cdiv%20style%3D%27display%3Ainline-block%20%21important%3B%20text-align%3Acenter%20%21important%27%3E%0A%3Cimg%20src%3D%27https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%27%20width%3D%27150%27%3E%0A%3Cbr%3E%20Yuen%20Y.%20Yalung%20%3Cbr%3E%0AAdmin%20Aid%201%0A%3C/div%3E%0A%3Cdiv%20style%3D%27display%3Ainline-block%20%21important%3B%20text-align%3Acenter%20%21important%27%3E%0A%3Cimg%20src%3D%27https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%27%20width%3D%27150%27%3E%0A%3Cbr%3E%20Yuen%20Y.%20Yalung%20%3Cbr%3E%0AAdmin%20Aid%201%0A%3C/div%3E%0A%3Cdiv%20style%3D%27display%3Ainline-block%20%21important%3B%20text-align%3Acenter%20%21important%27%3E%0A%3Cimg%20src%3D%27https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%27%20width%3D%27150%27%3E%0A%3Cbr%3E%20Yuen%20Y.%20Yalung%20%3Cbr%3E%0AAdmin%20Aid%201%0A%3C/div%3E%0A%3Cdiv%20style%3D%27display%3Ainline-block%20%21important%3B%20text-align%3Acenter%20%21important%27%3E%0A%3Cimg%20src%3D%27https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%27%20width%3D%27150%27%3E%0A%3Cbr%3E%20Yuen%20Y.%20Yalung%20%3Cbr%3E%0AAdmin%20Aid%201%0A%3C/div%3E%0A%0A%3C/span%3E%0A%0A%3Cdiv%3E%0A%0A%0A%0A%3Cp%20style%3D%27text-align%3A%20right%3B%27%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%27text-align%3A%20right%3B%27%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%27text-align%3A%20right%3B%27%3EJohn%20S%20Doe%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/p%3E%0A%3C/body%3E%0A%3C/html%3E`) }
        //           ]



        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/templates`
        }


        axios(config)
          .then(res => {

            console.log(this.$store.state.user_details.user.department)

            let templateList = []

            res.data.forEach(x => {

              if ( x.department === this.$store.state.user_details.user.department) {
                let tempObj = {
                  title: x.name,
                  content: unescape(x.content),
                }

                templateList.push(tempObj)

              }


            })

            let tbb = {
                  title: "No template available for this department"
                }

                templateList.push(tbb)

            this.tinymce = {
              height: 500,
              // content_css: "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css",

              theme: 'modern',
              plugins: 'importcss code print fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link template table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
              toolbar1: 'formatselect fontselect fontsize fontsizeselect  | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat pagebreak ',
              image_advtab: true,
              templates: templateList
            }

            this.templateList = templateList


          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
          })
      },


      getCategoryList() {

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/fileTag`
        }


        axios(config)
          .then(res => {
            this.fileTagList = res.data
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
          })
      },


      getPositionList() {

        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/positions`
        }


        axios(config)
          .then(res => {
            this.positionList = res.data
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
          })
      },

      getDepartmentList() {
        const config = {
          method: 'GET',
          url: `${keys.BASE_URL}/api/v1/departments`
        }

        axios(config)
          .then(res => {
            this.departmentList = res.data
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
          })
      },


      getRecipientList() {
        let recipients = []

        this.userList.forEach(x => {
          if (this.recipientList.includes(x._id)) {
            let tempObj = {
              id: x._id,
              name: `${x.name.first_name} ${x.name.middle_name} ${x.name.last_name}`
            }
            recipients.push(tempObj)
          }
        })
        return recipients
      },

      showNotif(type, title, icon, msg) {
        return {
          type: type,
          group: 'vnotif',
          title: `<span ><span class='fas ${icon} fa-2x'></span><span class='title is-5'> ${title}:</span></span>`,
          text: `<p class='subtitle is-5'>${msg}</p>`
        }
      },

      clearEfileVModel() {
        this.efileName = null
        this.efileContent = null
        this.recipientList = []
        this.private_doc = null
      },

      validateEfileContent() {
        console.log(this.efileContent);
        (this.efileContent === null || this.efileContent.length === 0 || /^\s*$/.test(this.efileContent)) ?
        this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', 'empty content is not allowed')):
          this.toggleRecipientModal()

      },

      toggleRecipientModal() {
        this.isRecipientModalActive = !this.isRecipientModalActive
      },

      toggleLoader() {
        this.isLoaderActive = !this.isLoaderActive
      },

      validateEfileBeforeSubmit() {
        if (this.recipientList.length === 0 || this.private_doc === null || this.efileCategory === null) {
          this.$notify(this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', 'complete the form !'))
        } else {
          this.toggleLoader()
          this.submitEfile()
        }
      },


      submitEfile() {

        const config = {
          method: 'POST',
          url: `${keys.BASE_URL}/api/v1/efiles`,
          data: this.buildEfileForm,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.$store.state.user_details.token}`
          }
        }

        axios(config)
          .then(res => {
            this.clearEfileVModel()
            this.toggleLoader()
            this.toggleRecipientModal()
            this.$notify(this.showNotif('success', 'Success', 'fa-check-circle', 'Efile succesfully created.'));
          })
          .catch(err => {
            this.toggleLoader()
            this.$notify(this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
          })
      },



    }
  }

</script>

<style scoped>


</style>
