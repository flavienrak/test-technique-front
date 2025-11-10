<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type { StepsType } from '~/types/steps';

const props = defineProps<{
  values: StepsType;
  errors: Partial<StepsType>;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const emit = defineEmits<{
  (e: 'change-file', event: Event): void;
  (e: 'remove-file'): void;
  (e: 'update-values', field: keyof typeof props.values, value: string): void;
}>();

function updateField(field: keyof typeof props.values, event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update-values', field, target.value);
}

const professions = [
  'Développeur web',
  'Infirmier',
  'Enseignant',
  'Architecte',
  'Comptable',
  'Chef cuisinier',
  'Journaliste',
  'Ingénieur civil',
  'Designer graphique',
  'Mécanicien automobile',
].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));

const experiences = ['Débutant', 'Intermédiaire', 'Expert'];

const estimations = ['Moins de 10 personnes', '10-20', '20-30', 'Plus de 30'];

// Méthode pour mettre à jour la profession
function updateSelect(
  field: 'profession' | 'experience' | 'estimation',
  value: unknown,
) {
  // Convertir en string pour l’émettre
  const normalized = value == null ? '' : String(value);
  emit('update-values', field, normalized);
}

function autoResize() {
  if (!textareaRef.value) return;

  const textarea = textareaRef.value!;

  const style = window.getComputedStyle(textarea);
  const paddingTop = parseFloat(style.paddingTop);
  const paddingBottom = parseFloat(style.paddingBottom);

  textarea.style.height = 'auto';
  const newHeight = Math.min(
    textarea.scrollHeight - paddingTop - paddingBottom,
    125,
  );
  textarea.style.height = `${newHeight}px`;
}

// Optionnel : auto-resize si la valeur change depuis le code
watch(
  () => props.values.explanation,
  () => autoResize(),
);

onMounted(() => autoResize());
</script>

<template>
  <div class="flex-1 flex flex-col gap-6">
    <h1 class="text-2xl font-semibold text-[#101828]">
      Pour mieux vous connaître
    </h1>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs font-medium"> Votre métier * </label>
      <Select
        :model-value="values.profession"
        @update:model-value="(v) => updateSelect('profession', v)"
      >
        <SelectTrigger
          class="w-full rounded-md !bg-[#FFFFFF] !h-9"
          :class="'!border-[#CAD5E2]'"
        >
          <SelectValue placeholder="Choisir un métier" />
        </SelectTrigger>

        <SelectContent class="bg-[#FFFFFF] border-[#CAD5E2]">
          <SelectItem
            v-for="(item, index) in professions"
            :key="'profession-' + index"
            :value="item"
            class="!text-[#344054] hover:!bg-gray-100"
            :class="
              item === values.profession ? '!bg-gray-100' : '!bg-[#FFFFFF]'
            "
          >
            {{ item }}
          </SelectItem>
        </SelectContent>
      </Select>
      <p v-if="errors.profession" class="text-red-500 text-xs">
        {{ errors.profession }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs font-medium">
        Votre URL LinkedIn
      </label>
      <input
        :value="values.linkedin"
        type="text"
        name="linkedin"
        placeholder="https://"
        auto-complete="off"
        class="h-9 text-sm border bg-[#FFFFFF] font-normal rounded-md px-3"
        :class="errors.linkedin ? 'border-red-500' : 'border-[#CAD5E2]'"
        @input="updateField('linkedin', $event)"
      />
      <p v-if="errors.linkedin" class="text-red-500 text-xs">
        {{ errors.linkedin }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs font-medium">
        Quelle est votre expérience dans le recrutement ?
      </label>
      <Select
        :model-value="values.experience"
        @update:model-value="(v) => updateSelect('experience', v)"
      >
        <SelectTrigger
          class="w-full rounded-md !bg-[#FFFFFF] !h-9"
          :class="'!border-[#CAD5E2]'"
        >
          <SelectValue placeholder="Niveau d'expérience" />
        </SelectTrigger>

        <SelectContent class="bg-[#FFFFFF] border-[#CAD5E2]">
          <SelectItem
            v-for="(item, index) in experiences"
            :key="'experience-' + index"
            :value="item"
            class="!text-[#344054] hover:!bg-gray-100"
            :class="
              item === values.experience ? '!bg-gray-100' : '!bg-[#FFFFFF]'
            "
          >
            {{ item }}
          </SelectItem>
        </SelectContent>
      </Select>
      <p v-if="errors.experience" class="text-red-500 text-xs">
        {{ errors.experience }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs font-medium">
        Combien de personnes prévoyez-vous de recruter ? *
      </label>
      <Select
        :model-value="values.estimation"
        @update:model-value="(v) => updateSelect('estimation', v)"
      >
        <SelectTrigger
          class="w-full rounded-md !bg-[#FFFFFF] !h-9"
          :class="'!border-[#CAD5E2]'"
        >
          <SelectValue
            placeholder="Choisir une estimation"
            class="!font-normal"
          />
        </SelectTrigger>

        <SelectContent class="bg-[#FFFFFF] border-[#CAD5E2]">
          <SelectItem
            v-for="(item, index) in estimations"
            :key="'estimation-' + index"
            :value="item"
            class="!text-[#344054] hover:!bg-gray-100"
            :class="
              item === values.estimation ? '!bg-gray-100' : '!bg-[#FFFFFF]'
            "
          >
            {{ item }}
          </SelectItem>
        </SelectContent>
      </Select>
      <p v-if="errors.estimation" class="text-red-500 text-xs">
        {{ errors.estimation }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs font-medium">
        Pourquoi voulez-vous utiliser Wink ? *
      </label>
      <textarea
        ref="textareaRef"
        :value="values.explanation"
        type="text"
        name="explanation"
        placeholder="Votre réponse"
        auto-complete="off"
        class="h-10 max-h-[125px] custom-scrollbar text-sm border bg-[#FFFFFF] font-normal rounded-md px-3 py-2 resize-none leading-5"
        :class="errors.explanation ? 'border-red-500' : 'border-[#CAD5E2]'"
        @input="updateField('explanation', $event)"
      />
      <p v-if="errors.explanation" class="text-red-500 text-xs">
        {{ errors.explanation }}
      </p>
    </div>

    <p class="text-sm leading-5 font-normal text-[#667085]">
      Votre entreprise est-elle spécialisée dans le recrutement (recruteur
      indépendant, cabinet de recrutement, consultant en recrutement...) ?
    </p>
  </div>
</template>
