<template>
  <div>


    <section class="hero has-background-white-ter is-fullheight">
      <div class="hero-body">
        <div class="container">
          
          <div class="columns">
            <div class="column is-one-third is-offset-one-third">
              
              <div class="box">
                <form action="">

                  <figure class="has-text-centered">
                    <br>
                    <img width="260" height="260" src="~/assets/images/logo.png">
                    <br><br>
                  </figure>

                  <div class="field">
                    <p class="control has-icons-left">
                      <input  name ="username"
                              v-model="username"
                              :class="{ 'is-danger': errors.has('username') }" 
                              v-validate="'required|email'" 
                              class="input is-medium" 
                              type="text" 
                              placeholder="Username">
                      <span class="icon is-small is-left">
                        <i class="fas fa-user"></i>
                      </span>
                      <small class="has-text-danger">{{ errors.first('username') }}</small>
                    </p>
                  </div>

                  <div class="field">
                    <p class="control has-icons-left">
                      <input  name="password"
                              v-model="password"
                              :class="{ 'is-danger': errors.has('password') }" 
                              v-validate="'required'" 
                              class="input is-medium" 
                              type="password" 
                              placeholder="Password">
                      <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
                      </span>
                      <small class="has-text-danger">{{ errors.first('password') }}</small>
                    </p>
                  </div>

                  <div><br>
                    <button @click="validateBeforeSubmit" type="button" class="button is-fullwidth is-danger is-medium">Login</button>
                  </div>
                </form>
    
              </div> <!--box-->

              <div class="level is-mobile has-text-centered"><br><br>
                <nuxt-link class="level-item has-text-black" to="/register">Sign Up</nuxt-link>
              </div><!--level-->


            </div><!--column-->
          </div><!--columns-->

       </div>
      </div>
    </section>
   



  </div>
</template>

<script>
  import axios from 'axios'
  import keys from '~/components/keys'

  export default {

    data(){
      return{

        username: '',
        password: '',

      }//return
    },//data

    methods:{

      showNotif(type, title, icon, msg){
        return{
          type: type,
          group: 'vnotif',
          title: `<span ><span class='fas ${icon} fa-2x'></span><span class='title is-5'> ${title}:</span></span>`,
          text: `<p class='subtitle is-5'>${msg}</p>`
        }
      },

      validateBeforeSubmit() {
        const loginForm = {
          username: this.username,
          password: this.password
        }
        console.log(JSON.stringify(loginForm))
        this.$validator.validateAll().then((res) => {
          //check if res === true (valid) then submits the form
          console.log(res)
          res ? this.submitLoginForm(loginForm) : this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','please fill up the form') )
         })
      },

      submitLoginForm(loginForm){

        const config = {
          method: 'POST',
          url: `${keys.BASE_URL}/api/v1/users/login`,
          data: JSON.stringify(loginForm),
          headers: { 
            "Content-Type": "application/json"
          }
        }

        axios(config)
           .then(res => this.$router.push('/dashboard'))
           .catch(err => {
              // this.registrationLoader = false
              this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
            })
      }

    }//methods

  }
</script>

<style scoped>
  .avatar {
    margin-top: -90px;
    padding-bottom: 15px;
  }
  .avatar img {
    padding: 5px;
    background: #fff;
    border-radius: 50%;
    -webkit-box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
    box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
  }
</style>