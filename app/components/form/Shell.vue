<script setup lang="ts">
import { ArrowLeft, ArrowRight, Check, LoaderCircle, RotateCcw } from 'lucide-vue-next'

/**
 * The form card: contact block, consent, honeypot, submit, and every outcome state.
 * With `steps`, the feature fields are split into short screens (slots `step-0`, `step-1`, …),
 * each validated on its own, and the contact block becomes the last step.
 * Without `steps`, feature fields go in the default slot above the contact block.
 */
const props = defineProps<{
  form: Record<string, any>
  errors: Record<string, string>
  status: 'idle' | 'sending' | 'success' | 'known' | 'error'
  submitLabel: string
  youLegend?: string
  messageLabel?: string
  messageRequired?: boolean
  steps?: { title: string; keys: string[] }[]
  check?: (keys: string[]) => boolean
}>()
const emit = defineEmits<{ submit: []; reset: [] }>()
const { t } = useI18n()
const localePath = useLocalePath()
const root = ref<HTMLElement | null>(null)
const live = ref<HTMLElement | null>(null)

const step = ref(0)
const dir = ref<1 | -1>(1)
const total = computed(() => (props.steps?.length ? props.steps.length + 1 : 1))
const isLast = computed(() => step.value === total.value - 1)
const titles = computed(() => [...(props.steps?.map(s => s.title) ?? []), props.youLegend ?? ''])
const hasErrors = computed(() => Object.keys(props.errors).length > 0)

function scrollToTop() {
  const el = root.value
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 96
  if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' })
}
function next() {
  const keys = props.steps?.[step.value]?.keys ?? []
  if (props.check && !props.check(keys)) return
  dir.value = 1
  step.value++
  nextTick(scrollToTop)
}
function back() {
  dir.value = -1
  step.value--
  nextTick(scrollToTop)
}
function onSubmit() {
  if (!isLast.value) return next()
  emit('submit')
}
function onReset() {
  step.value = 0
  emit('reset')
}

watch(() => props.status, s => (s === 'success' || s === 'known') && nextTick(() => live.value?.focus()))
</script>

<template>
  <div ref="root" class="relative scroll-mt-28 rounded-[var(--radius-hero)] bg-stone">
    <Transition name="fold" mode="out-in">
      <div v-if="status === 'success' || status === 'known'" key="done" ref="live" tabindex="-1" class="px-6 py-14 outline-none sm:px-10 sm:py-16" role="status">
        <span class="done-mark grid size-14 place-items-center rounded-full bg-ink text-white"><Check class="size-7" :stroke-width="1.8" /></span>
        <h2 class="mt-6 font-display text-[2.2rem] font-light leading-tight">{{ status === 'known' ? t('form.knownTitle') : t('form.successTitle') }}</h2>
        <p class="mt-3 max-w-md text-[1.0625rem] text-muted">{{ status === 'known' ? t('form.knownBody') : t('form.successBody') }}</p>
        <button type="button" class="btn btn-ghost mt-8" @click="onReset">
          <RotateCcw class="size-4" :stroke-width="1.8" /> {{ t('form.another') }}
        </button>
      </div>

      <form v-else key="form" novalidate class="@container" @submit.prevent="onSubmit">
        <!-- Progress -->
        <div v-if="steps?.length" class="px-5 pt-6 sm:px-10 sm:pt-9">
          <p class="flex items-baseline justify-between gap-4 text-[0.875rem] text-muted">
            <span class="tabular">{{ t('form.step', { n: step + 1, total }) }}</span>
            <span class="truncate">{{ titles[step + 1] ? `${t('form.next')}: ${titles[step + 1]}` : '' }}</span>
          </p>
          <ol class="mt-3 grid gap-1.5" :style="{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }" :aria-label="t('form.step', { n: step + 1, total })">
            <li v-for="(title, i) in titles" :key="i" class="h-1 overflow-hidden rounded-full bg-line" :aria-current="i === step ? 'step' : undefined">
              <span class="sr-only">{{ title }}</span>
              <span class="block h-full rounded-full bg-ink transition-transform duration-700 ease-[var(--ease-out)]" :class="i <= step ? 'scale-x-100' : 'scale-x-0'" style="transform-origin: left" />
            </li>
          </ol>
        </div>

        <div class="relative overflow-hidden px-5 pb-6 pt-7 sm:px-10 sm:pb-10 sm:pt-9">
          <Transition :name="dir > 0 ? 'step-next' : 'step-prev'" mode="out-in">
            <div :key="step" class="space-y-9">
              <template v-if="steps?.length && !isLast">
                <h2 class="font-display text-[1.9rem] font-light leading-tight">{{ steps[step]?.title }}</h2>
                <slot :name="`step-${step}`" />
              </template>

              <template v-else>
                <slot v-if="!steps?.length" />
                <fieldset class="space-y-5">
                  <legend v-if="youLegend" class="mb-6 w-full font-display text-[1.9rem] font-light leading-tight">{{ youLegend }}</legend>
                  <FormField id="name" :label="t('form.name')" :error="errors.name">
                    <template #default="{ describedBy, invalid }">
                      <input id="name" v-model="form.name" class="input" autocomplete="name" autocapitalize="words" enterkeyhint="next" :aria-invalid="invalid" :aria-describedby="describedBy" />
                    </template>
                  </FormField>
                  <div class="grid gap-5 @2xl:grid-cols-2">
                    <FormField id="email" :label="t('form.email')" :error="errors.email">
                      <template #default="{ describedBy, invalid }">
                        <input id="email" v-model="form.email" class="input" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" enterkeyhint="next" :aria-invalid="invalid" :aria-describedby="describedBy" />
                      </template>
                    </FormField>
                    <FormPhone v-model:dial="form.dialCode" v-model:phone="form.phone" :error="errors.phone || errors.dialCode" />
                  </div>
                  <FormField id="message" :label="messageLabel ?? t('form.messageOptional')" :error="errors.message" :optional="!messageRequired">
                    <template #default="{ describedBy, invalid }">
                      <textarea id="message" v-model="form.message" class="input" rows="4" :aria-invalid="invalid" :aria-describedby="describedBy" />
                    </template>
                  </FormField>
                  <slot name="after-contact" />
                </fieldset>

                <!-- Honeypot: invisible to people, tempting to bots. -->
                <div class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  <label>Website <input v-model="form.website" tabindex="-1" autocomplete="off" /></label>
                </div>

                <div class="space-y-5 border-t border-line pt-7">
                  <FormCheck id="consent" v-model="form.consent" :error="errors.consent">
                    <i18n-t keypath="form.consent" scope="global">
                      <template #privacy><NuxtLink :to="localePath('privacy')" class="underline hover:text-muted" target="_blank">{{ t('form.privacy') }}</NuxtLink></template>
                    </i18n-t>
                  </FormCheck>
                  <p v-if="hasErrors" class="text-[0.9375rem] font-medium text-alert" role="alert">{{ t('form.fixFields') }}</p>
                  <div v-if="status === 'error'" class="rounded-2xl border border-alert/30 bg-[#fbeee9] px-5 py-4 text-[0.9375rem]" role="alert">
                    <p class="font-medium text-alert">{{ t('form.errorTitle') }}</p>
                    <p class="text-ink">{{ t('form.errorBody') }}</p>
                  </div>
                </div>
              </template>
            </div>
          </Transition>
        </div>

        <!-- Actions: pinned to the bottom of the screen on phones while the form is in view -->
        <div class="actions sticky bottom-0 pb-[max(1rem,env(safe-area-inset-bottom))] z-10 flex items-center gap-3 rounded-b-[var(--radius-hero)] border-t border-line bg-stone/95 px-5 pt-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-10 sm:pb-10 sm:pt-0 sm:backdrop-blur-none">
          <button v-if="step > 0" type="button" class="btn btn-ghost px-5" @click="back">
            <ArrowLeft class="size-4" :stroke-width="1.8" /> <span class="max-sm:sr-only">{{ t('form.back') }}</span>
          </button>
          <button type="submit" class="btn group flex-1 sm:flex-none sm:min-w-56" :disabled="status === 'sending'" :aria-busy="status === 'sending'">
            <LoaderCircle v-if="status === 'sending'" class="size-4 animate-spin" />
            {{ status === 'sending' ? t('form.sending') : isLast ? submitLabel : t('form.next') }}
            <ArrowRight v-if="status !== 'sending'" class="nudge size-4" :stroke-width="1.8" />
          </button>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.fold-enter-active, .fold-leave-active { transition: opacity 0.4s var(--ease-out), transform 0.6s var(--ease-out); }
.fold-enter-from { opacity: 0; transform: translateY(12px); }
.fold-leave-to { opacity: 0; }
.step-next-enter-active, .step-next-leave-active, .step-prev-enter-active, .step-prev-leave-active { transition: opacity 0.35s var(--ease-soft), transform 0.5s var(--ease-out); }
.step-next-enter-from { opacity: 0; transform: translateX(28px); }
.step-next-leave-to { opacity: 0; transform: translateX(-28px); }
.step-prev-enter-from { opacity: 0; transform: translateX(-28px); }
.step-prev-leave-to { opacity: 0; transform: translateX(28px); }
.done-mark { animation: pop 0.7s var(--ease-out) both; }
@keyframes pop { from { transform: scale(0.6); opacity: 0; } }
</style>
