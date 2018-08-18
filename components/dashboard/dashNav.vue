<template>
  <div>
    <nav class="navbar is-fixed-top has-shadow">

      <div class="navbar-brand">

        <p class="navbar-item">
          <!-- <img src="~/assets/images/logo.png" alt="dashboard logo" width="120" height="200"> -->
          <img src="~/assets/images/logo.png" alt="dashboard logo" width="40" height="200">
        </p>

        <div @click="toggleNavbarMenu" role="button" class="navbar-burger">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </div>
      </div>


      <div :class="{'is-active' : this.isNavbarMenuActive}" class="navbar-menu has-text-centered is-hidden-desktop">
        <a @click="navigateAndCloseNavbar('efile')" class="navbar-item">Efiles</a>
        <a @click="navigateAndCloseNavbar('document')" class="navbar-item">Documents</a>
        <a @click="navigateAndCloseNavbar('spreadsheet')" class="navbar-item">Spreadsheet</a>
        <a @click="navigateAndCloseNavbar('presentation')" class="navbar-item">Presentation</a>
        <a @click="navigateAndCloseNavbar('image')" class="navbar-item">Images</a>
        <a @click="navigateAndCloseNavbar('update_info')" class="navbar-item">Update Info</a>
        <a @click="logout" class="navbar-item">Logout</a>
      </div>

    </nav>
    <br>
    <br>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isNavbarMenuActive: false
      }
    }, //data

    methods: {

      navigateAndCloseNavbar(content) {
        this.changeActiveContent(content)
        this.toggleNavbarMenu()
      },

      logout() {
        localStorage.clear()
        this.$router.push('/')
        // this.$store.commit('logout/clearStoreAndLogout')
      },

      toggleNavbarMenu() {
        this.isNavbarMenuActive = !this.isNavbarMenuActive
      },

      changeActiveContent(contentToRender) {
        this.$store.dispatch('sidebar/CHANGE_ACTIVE_CONTENT', contentToRender)
      }
    }
  }

</script>

<style scoped>
  .navbar-link::after {
    border-color: #c62828;
  }

  a.navbar-item:hover,
  a.navbar-item.is-active,
  .navbar-link:hover,
  .navbar-link.is-active {
    background-color: #c62828;
    color: white;
  }

  .navbar-link::after {
    border-color: #2e7d32;
  }

  a.navbar-item:hover,
  a.navbar-item.is-active,
  .navbar-link:hover,
  .navbar-link.is-active {
    background-color: #2e7d32;
    color: white;
  }

</style>
