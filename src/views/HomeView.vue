<template>
  <main class="portfolio-page">
    <Navbar />
    <HeroFrame id="about" :profile="profile" />
    <StrengthBand />
    <EducationSection id="edu" :education="profile.education" />
    <PersonalSection id="personal" :profile="profile" />
    <AppFooter id="contact" :profile="profile" />
  </main>
</template>
<script>
import profile from '@/data/profile'
import Navbar from '@/components/cards/Navbar.vue'
import HeroFrame from '@/components/cards/HeroFrame.vue'
import StrengthBand from '@/components/cards/StrengthBand.vue'
import EducationSection from '@/components/cards/EducationSection.vue'
import PersonalSection from '@/components/cards/PersonalSection.vue'
import AppFooter from '@/components/cards/AppFooter.vue'
export default {
  name: 'HomeView',
  components: { Navbar, HeroFrame, StrengthBand, EducationSection, PersonalSection, AppFooter },
  data: () => ({ profile }),
  mounted() {
    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          this.revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    this.$nextTick(() => {
      this.$el.querySelectorAll('.reveal-section, .reveal-item').forEach(el => this.revealObserver.observe(el))
    })
  },
  beforeDestroy() { if (this.revealObserver) this.revealObserver.disconnect() },
}
</script>
<style>
.portfolio-page { --ink:#202522; --muted:#7b827e; --line:#e8ebe7; --paper:#fbfcfa; --sage:#dfe8e2; --sage-dark:#71877c; --peach:#f1e5dc; color:var(--ink); background:var(--paper); font-family:'DM Sans',sans-serif; overflow:hidden; }
.portfolio-page * { box-sizing:border-box; }
.editorial-container { width:min(1160px, calc(100% - 64px)); margin:0 auto; }
.section-kicker { display:flex; align-items:center; gap:14px; color:#8a928d; font-size:10px; letter-spacing:.2em; font-weight:700; }
.section-kicker span:first-child { color:var(--sage-dark); }
.section-kicker i { width:48px; height:1px; background:#cfd6d0; }
.eyebrow { margin:0 0 15px; color:#8a928d; font-size:10px; font-weight:700; letter-spacing:.2em; }
.section-heading { margin:0; font-family:Manrope,sans-serif; font-size:clamp(42px,6vw,72px); font-weight:600; letter-spacing:-.065em; line-height:1.02; }
.heading-period { color:#9bad9f; }
.section-lead { margin:18px 0 0; color:#737c76; font-size:15px; }
.reveal-section,.reveal-item { opacity:0; transform:translateY(24px); transition:opacity .75s ease, transform .75s cubic-bezier(.2,.7,.2,1); }
.reveal-section.is-visible,.reveal-item.is-visible { opacity:1; transform:translateY(0); }
.reveal-item:nth-child(2) { transition-delay:.12s; }
@media (prefers-reduced-motion: reduce) { .reveal-section,.reveal-item { opacity:1; transform:none; transition:none; } }
</style>
