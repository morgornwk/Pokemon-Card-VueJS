<template>
  <footer id="contact" class="footer-section">
    <div class="footer-container">
      <div class="section-kicker section-kicker--light"><span>04</span><i></i><span>LET'S CONNECT</span></div>
      <div class="footer-main">
        <div><p class="eyebrow eyebrow--light">HAVE A PROJECT IN MIND?</p><h2>Let's make<br /><em>something good.</em></h2></div>
        <a v-if="profile.contacts && profile.contacts.email" :href="`mailto:${profile.contacts.email}`" class="footer-email">{{ profile.contacts.email }} <v-icon color="white">mdi-arrow-top-right</v-icon></a>
      </div>
      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} {{ profile.fullName }}. Made with care.</span>
        <div class="footer-socials">
          <a v-if="profile.contacts && profile.contacts.github" :href="profile.contacts.github" target="_blank" rel="noopener noreferrer">GITHUB <v-icon color="white" size="16">mdi-arrow-top-right</v-icon></a>
          <a v-if="profile.contacts && profile.contacts.instagram" :href="profile.contacts.instagram" target="_blank" rel="noopener noreferrer">INSTAGRAM <v-icon color="white" size="16">mdi-arrow-top-right</v-icon></a>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default { name: 'AppFooter', props: { profile: { type: Object, required: true } } }
</script>
<style scoped src="../../assets/style/cards/app-footer.css"></style>
