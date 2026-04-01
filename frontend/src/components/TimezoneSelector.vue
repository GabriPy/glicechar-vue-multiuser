<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

const timezoneGroups = computed(() => [
  {
    label: t('settings.continents.europe'),
    timezones: [
      { value: 'Europe/Rome', label: 'Italia (Roma)', code: 'it' },
      { value: 'Europe/London', label: 'Regno Unito (Londra)', code: 'gb' },
      { value: 'Europe/Paris', label: 'Francia (Parigi)', code: 'fr' },
      { value: 'Europe/Berlin', label: 'Germania (Berlino)', code: 'de' },
      { value: 'Europe/Madrid', label: 'Spagna (Madrid)', code: 'es' },
      { value: 'Europe/Zurich', label: 'Svizzera (Zurigo)', code: 'ch' },
      { value: 'Europe/Athens', label: 'Grecia (Atene)', code: 'gr' },
      { value: 'Europe/Moscow', label: 'Russia (Mosca)', code: 'ru' },
    ]
  },
  {
    label: t('settings.continents.americas'),
    timezones: [
      { value: 'America/New_York', label: 'USA (New York)', code: 'us' },
      { value: 'America/Chicago', label: 'USA (Chicago)', code: 'us' },
      { value: 'America/Denver', label: 'USA (Denver)', code: 'us' },
      { value: 'America/Los_Angeles', label: 'USA (Los Angeles)', code: 'us' },
      { value: 'America/Sao_Paulo', label: 'Brasile (San Paolo)', code: 'br' },
      { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (Buenos Aires)', code: 'ar' },
      { value: 'America/Mexico_City', label: 'Messico (Città del Messico)', code: 'mx' },
      { value: 'America/Toronto', label: 'Canada (Toronto)', code: 'ca' },
    ]
  },
  {
    label: t('settings.continents.asia_oceania'),
    timezones: [
      { value: 'Asia/Tokyo', label: 'Giappone (Tokyo)', code: 'jp' },
      { value: 'Asia/Shanghai', label: 'Cina (Shanghai)', code: 'cn' },
      { value: 'Asia/Dubai', label: 'Emirati Arabi (Dubai)', code: 'ae' },
      { value: 'Asia/Singapore', label: 'Singapore', code: 'sg' },
      { value: 'Asia/Kolkata', label: 'India (Calcutta)', code: 'in' },
      { value: 'Australia/Sydney', label: 'Australia (Sydney)', code: 'au' },
      { value: 'Australia/Perth', label: 'Australia (Perth)', code: 'au' },
      { value: 'Pacific/Auckland', label: 'Nuova Zelanda (Auckland)', code: 'nz' },
    ]
  },
  {
    label: t('settings.continents.africa'),
    timezones: [
      { value: 'Africa/Cairo', label: 'Egitto (Il Cairo)', code: 'eg' },
      { value: 'Africa/Johannesburg', label: 'Sudafrica (Johannesburg)', code: 'za' },
      { value: 'Africa/Lagos', label: 'Nigeria (Lagos)', code: 'ng' },
      { value: 'Africa/Nairobi', label: 'Kenya (Nairobi)', code: 'ke' },
    ]
  }
]);

const allTimezones = computed(() => timezoneGroups.value.flatMap(g => g.timezones));
const selectedTz = computed(() => allTimezones.value.find(t => t.value === props.modelValue) || { value: props.modelValue, label: props.modelValue, code: '' });

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  if (!props.modelValue) {
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    emit('update:modelValue', browserTz);
  }
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

function selectTz(value: string) {
  emit('update:modelValue', value);
  isOpen.value = false;
}
</script>

<template>
  <div class="relative w-full" :class="{ 'z-[200]': isOpen }" ref="containerRef">
    <!-- Trigger Button -->
    <button 
      type="button"
      class="btn btn-outline w-full justify-between font-black text-sm uppercase tracking-widest bg-base-100 hover:bg-base-200 border-base-content/20 h-12"
      @click.stop="isOpen = !isOpen"
    >
      <div class="flex items-center gap-3">
        <div v-if="selectedTz.code" class="w-6 h-4 overflow-hidden rounded-sm shadow-sm flex-shrink-0">
          <img :src="`https://flagcdn.com/w40/${selectedTz.code}.png`" :alt="selectedTz.code" class="w-full h-full object-cover" />
        </div>
        <span v-else class="text-lg">🌐</span>
        <span class="truncate">{{ selectedTz.label }}</span>
      </div>
      <i class="fi fi-sr-angle-small-down transition-transform text-xl" :class="{ 'rotate-180': isOpen }"></i>
    </button>
    
    <!-- Dropdown Panel -->
    <div 
      v-show="isOpen"
      class="absolute left-0 right-0 z-[999] p-2 shadow-2xl bg-base-100 border border-base-content/10 rounded-2xl mt-2 max-h-[300px] overflow-y-auto block scrollbar-hide"
    >
      <div v-for="group in timezoneGroups" :key="group.label" class="mb-4">
        <div class="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">
          {{ group.label }}
        </div>
        <div class="grid grid-cols-1 gap-1">
          <button 
            type="button"
            v-for="tz in group.timezones" 
            :key="tz.value"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 transition-all text-left w-full group"
            :class="{ 'bg-primary/5 text-primary': modelValue === tz.value }"
            @click="selectTz(tz.value)"
          >
            <div class="w-7 h-5 overflow-hidden rounded-sm shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
              <img :src="`https://flagcdn.com/w40/${tz.code}.png`" :alt="tz.code" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-black uppercase tracking-tight">{{ tz.label }}</span>
              <span class="text-[9px] font-bold opacity-30 tracking-widest">{{ tz.value }}</span>
            </div>
            <i v-if="modelValue === tz.value" class="fi fi-sr-check-circle ml-auto text-primary"></i>
          </button>
        </div>
      </div>
      
      <!-- Altri / Browser Default -->
      <div class="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1 mt-2">
        {{ $t('settings.continents.other') }}
      </div>
      <button 
        type="button"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 transition-all text-left w-full group"
        :class="{ 'bg-primary/5 text-primary': modelValue === 'UTC' }"
        @click="selectTz('UTC')"
      >
        <span class="text-xl group-hover:scale-125 transition-transform">🌐</span>
        <div class="flex flex-col">
          <span class="text-sm font-black uppercase tracking-tight">UTC (Greenwich)</span>
          <span class="text-[9px] font-bold opacity-30 tracking-widest">UTC</span>
        </div>
        <i v-if="modelValue === 'UTC'" class="fi fi-sr-check-circle ml-auto text-primary"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
