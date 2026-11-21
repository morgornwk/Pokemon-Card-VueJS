
<template>
  <section id="edu" class="edu-section reveal-section">
    <div class="edu-container">

      <div class="edu-header reveal-item">
        <span class="edu-label">02 / BACKGROUND</span>
        <h2 class="edu-title">Education<span>.</span></h2>
        <p class="edu-sub">The foundation of my journey.</p>
      </div>

      <div class="edu-card reveal-item">

        <div class="edu-image-wrap">
          <img
            :src="universityImage"
            :alt="education.university || 'University campus'"
            class="edu-image"
            loading="lazy"
          />

          <div class="edu-image-overlay">
            <span>UNIVERSITY LIFE</span>
            <span class="edu-image-number">01</span>
          </div>
        </div>

        <div class="edu-details">

          <div class="edu-icon-wrap">
            <v-icon size="24" color="#71816d">
              mdi-school-outline
            </v-icon>
          </div>

          <span class="edu-eyebrow">MY EDUCATION</span>

          <h3 class="edu-uni">
            {{ education.university }}
          </h3>

          <p class="edu-major">
            {{ education.major }}
          </p>

          <p class="edu-campus">
            <v-icon small color="#84917f">
              mdi-map-marker-outline
            </v-icon>
            {{ education.campus }}
          </p>

          <div class="edu-divider"></div>

          <div class="edu-bottom">
            <div>
              <span class="edu-meta-label">ACADEMIC YEAR</span>
              <p class="edu-year">
                {{ education.graduatedYear }}
              </p>
            </div>

            <span class="edu-status">
              <span class="edu-status-dot"></span>
              Education
            </span>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script>
import universityImage from '@/assets/images/university.jpeg'

export default {
  name: 'EducationSection',

  props: {
    education: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      universityImage
    }
  }
}
</script>

<style scoped src="../../assets/style/cards/education-section.css"></style>
