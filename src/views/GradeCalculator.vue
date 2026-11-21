<template>
  <main class="grade-page">
    <!-- Top Floating Navigation -->
    <header class="grade-nav">
      <router-link to="/" class="grade-back" title="Back to Portfolio">
        <v-icon size="18">mdi-arrow-left</v-icon>
        <span>Back to Home</span>
      </router-link>
      <span class="grade-badge">Utility Tool</span>
    </header>

    <div class="grade-container">
      <!-- Ambient Background Glows -->
      <div class="grade-orb grade-orb--1" aria-hidden="true"></div>
      <div class="grade-orb grade-orb--2" aria-hidden="true"></div>

      <div class="grade-card-wrapper">
        <!-- Main Calculator Card -->
        <div class="grade-card">
          <!-- Card Header -->
          <div class="grade-header">
            <div class="grade-icon-box">
              <v-icon size="26" color="#2d5a3f">mdi-calculator-variant-outline</v-icon>
            </div>
            <div>
              <span class="grade-kicker">ACADEMIC EVALUATION</span>
              <h1 class="grade-title">Grade Calculator</h1>
              <p class="grade-sub">กรอกคะแนนเพื่อตัดเกรดและตรวจสอบเกณฑ์คะแนนอัตโนมัติ</p>
            </div>
          </div>

          <!-- Score Input Form -->
          <v-form ref="formRef" class="grade-form" @submit.prevent="calculate">
            <div class="grade-input-group">
              <label class="grade-input-label" for="score-field">
                คะแนนรวมที่ได้ (0 - 100)
              </label>

              <v-text-field
                id="score-field"
                v-model="score"
                placeholder="ระบุคะแนน"
                :rules="rules"
                outlined
                dense
                clearable
                type="number"
                color="#2d5a3f"
                class="grade-field"
                @keydown.enter.prevent="calculate"
              />
            </div>

            <div class="grade-actions">
              <v-btn
                block
                large
                depressed
                type="submit"
                class="grade-btn-submit"
              >
                <v-icon left size="20">mdi-check-circle-outline</v-icon>
                ประมวลผลตัดเกรด
              </v-btn>

              <v-btn
                v-if="score || grade"
                text
                small
                class="grade-btn-reset"
                @click="reset"
              >
                <v-icon left size="16">mdi-refresh</v-icon>
                ล้างคะแนน
              </v-btn>
            </div>
          </v-form>

          <!-- Result Showcase -->
          <transition name="grade-pop">
            <div
              v-if="gradeMeta"
              class="grade-result-card"
              :style="{
                backgroundColor: gradeMeta.bg,
                borderColor: gradeMeta.border
              }"
            >
              <div class="grade-result-top">
                <div
                  class="grade-badge-circle"
                  :style="{ backgroundColor: gradeMeta.color }"
                >
                  <span class="grade-badge-letter">{{ gradeMeta.grade }}</span>
                </div>

                <div class="grade-result-info">
                  <div class="grade-result-status" :style="{ color: gradeMeta.color }">
                    <v-icon small :color="gradeMeta.color" class="mr-1">{{ gradeMeta.icon }}</v-icon>
                    <span>{{ gradeMeta.label }}</span>
                  </div>
                  <div class="grade-result-score">
                    คะแนนที่คำนวณได้: <strong>{{ score }}</strong> / 100
                  </div>
                </div>
              </div>

              <!-- Animated Score Progress Bar -->
              <div class="grade-progress-wrap">
                <div class="grade-progress-bar">
                  <div
                    class="grade-progress-fill"
                    :style="{
                      width: `${numericScore}%`,
                      backgroundColor: gradeMeta.color
                    }"
                  ></div>
                  <span class="grade-cutoff-mark" style="left: 50%;"></span>
                  <span class="grade-cutoff-mark" style="left: 80%;"></span>
                </div>
                <div class="grade-progress-scale">
                  <span class="grade-scale-val grade-scale-val--0">0</span>
                  <span class="grade-scale-val" style="left: 50%;">50</span>
                  <span class="grade-scale-val" style="left: 80%;">80</span>
                  <span class="grade-scale-val grade-scale-val--100">100</span>
                </div>
              </div>

              <p class="grade-result-message">
                {{ gradeMeta.message }}
              </p>
            </div>
          </transition>

          <!-- Grading Criteria Reference Scale -->
          <div class="grade-criteria">
            <div class="grade-criteria__title">
              <v-icon size="16" color="#68736b">mdi-information-outline</v-icon>
              <span>เกณฑ์มาตรฐานการตัดเกรด</span>
            </div>

            <div class="grade-criteria__grid">
              <div
                v-for="item in criteria"
                :key="item.grade"
                class="grade-criteria__item"
                :class="{ 'is-active': grade === item.grade }"
                :style="grade === item.grade ? { borderColor: item.color, backgroundColor: item.bg } : {}"
              >
                <div class="grade-criteria__badge" :style="{ color: item.color }">
                  {{ item.grade }}
                </div>
                <div class="grade-criteria__details">
                  <div class="grade-criteria__range">{{ item.range }} คะแนน</div>
                  <div class="grade-criteria__label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { useGradeCalculator } from '@/hook/useGradeCalculator'

export default {
  name: 'GradeView',
  setup() {
    return useGradeCalculator()
  },
}
</script>

<style scoped src="../assets/style/grade-calculator.css"></style>
