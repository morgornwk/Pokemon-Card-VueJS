<template>
  <section id="personal" class="personal-section reveal-section">
    <div class="editorial-container">
      <div class="section-kicker"><span>03</span><i></i><span>BEYOND THE CODE</span></div>
      <div class="personal-heading-row reveal-item">
        <div>
          <p class="eyebrow">THE PERSON BEHIND THE SCREEN</p>
          <h2 class="section-heading">A bit more <em>personal.</em></h2>
        </div>
        <p class="personal-intro">สิ่งที่ผมให้ความสำคัญ วิธีคิด และเรื่องเล็ก ๆ ที่เป็นตัวผม</p>
      </div>

      <div class="personal-grid">
        <article class="personal-panel strengths-panel reveal-item">
          <div class="panel-top"><span class="panel-number">A / 01</span><v-icon color="#728d87">mdi-sparkles</v-icon></div>
          <h3>What I bring</h3>
          <p class="panel-description">จุดแข็งที่นำมาใช้ในการทำงานและพัฒนาตัวเอง</p>
          <ol class="strength-list">
            <li v-for="(item, i) in parsedStrengths" :key="'str-' + i">
              <span class="strength-num">0{{ i + 1 }}</span>
              <div><strong>{{ item.title }}</strong><p v-if="item.desc">{{ item.desc }}</p></div>
            </li>
          </ol>
        </article>

        <article class="personal-panel interests-panel reveal-item">
          <div class="panel-top"><span class="panel-number">B / 02</span><v-icon color="#b68e70">mdi-heart-outline</v-icon></div>
          <h3>Little things I love</h3>
          <div v-if="profile.hobbies && profile.hobbies.length" class="interest-group">
            <span class="interest-label">HOBBIES</span><div class="pill-row"><span v-for="(item, i) in profile.hobbies" :key="'h-' + i" class="interest-pill">{{ item }}</span></div>
          </div>
          <div v-if="profile.likes && profile.likes.length" class="interest-group">
            <span class="interest-label">I LIKE</span><div class="pill-row"><span v-for="(item, i) in profile.likes" :key="'l-' + i" class="interest-pill interest-pill--sage">{{ item }}</span></div>
          </div>
          <div v-if="profile.dislikes && profile.dislikes.length" class="interest-group">
            <span class="interest-label">NOT A FAN OF</span><div class="pill-row"><span v-for="(item, i) in profile.dislikes" :key="'d-' + i" class="interest-pill interest-pill--muted">{{ item }}</span></div>
          </div>
          <p v-if="!hasInterests" class="empty-hint">เพิ่ม hobbies, likes และ dislikes ใน profile.js เพื่อแสดงส่วนนี้</p>
        </article>

        <article v-if="profile.favoriteTeam" class="personal-panel team-panel reveal-item">
          <span class="panel-number">C / 03 · OFF THE CLOCK</span>
          <v-icon size="30" color="#b68e70">{{ profile.favoriteTeam.icon || 'mdi-basketball' }}</v-icon>
          <span class="interest-label">{{ profile.favoriteTeam.sport }}</span>
          <h3>{{ profile.favoriteTeam.name }}</h3><p>{{ profile.favoriteTeam.reason }}</p>
        </article>
        <article v-if="profile.freeSpace" class="personal-panel motto-panel reveal-item">
          <span class="panel-number">A THOUGHT TO KEEP</span>
          <v-icon size="26" color="#728d87">mdi-format-quote-close</v-icon>
          <blockquote>“{{ profile.freeSpace }}”</blockquote>
        </article>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'PersonalSection',
  props: { profile: { type: Object, required: true } },
  computed: {
    parsedStrengths() {
      return (this.profile.strengths || []).map((raw) => {
        const idx = raw.indexOf(' - ')
        return idx === -1 ? { title: raw, desc: '' } : { title: raw.slice(0, idx).trim(), desc: raw.slice(idx + 3).trim() }
      })
    },
    hasInterests() { return ['hobbies', 'likes', 'dislikes'].some(key => this.profile[key] && this.profile[key].length) },
  },
}
</script>
<style scoped src="../../assets/style/cards/personal-section.css"></style>
