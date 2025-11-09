<script setup lang="ts">
import RightBox from '~/components/RightBox.vue';
import ClientOnly from '~/components/ClientOnly.vue';
import StepOne from './steps/StepOne.vue';
import StepTwo from './steps/StepTwo.vue';

import { z } from 'zod';
import { ref, reactive } from 'vue';
import type { StepsType } from '~/types/steps';
import StepThree from './steps/StepThree.vue';

const steps = ref([
  { id: 1, content: 'Faisons connaissance' },
  { id: 2, content: 'Créez votre espace de travail' },
  { id: 3, content: 'Pour mieux vous connaître' },
]);

const currentStep = ref(steps.value[0]?.id);

const initiales = ref('AP');

const stepSchemas = {
  1: z.object({
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis'),
    email: z.string().min(1, 'Email requis').email('Email invalide'),
  }),
  2: z.object({
    companyName: z.string().min(1, 'Le nom de l’entreprise est requis'),
  }),
  3: z.object({}),
};

const values = reactive<StepsType>({
  firstName: '',
  lastName: '',
  email: '',
  companyName: '',
  companyDescription: '',
  website: '',
  address: '',
  sector: '',
});

const errors = reactive<Partial<StepsType>>({});

// Gestion de la photo
const photoFile = ref<File | null>(null);
const photoPreview = ref<string | null>(null);

function onPhotoChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  photoFile.value = target.files[0] as File;
  photoPreview.value = URL.createObjectURL(photoFile.value);
}

function removePhoto() {
  photoFile.value = null;
  photoPreview.value = null;
}

// Mettre à jour les initiales
function updateInitiales() {
  const firstLetter = values.firstName.trim().charAt(0).toUpperCase();
  const lastLetter = values.lastName.trim().charAt(0).toUpperCase();

  if (firstLetter && lastLetter) {
    initiales.value = firstLetter + lastLetter;
  } else if (firstLetter) {
    initiales.value = firstLetter;
  } else if (lastLetter) {
    initiales.value = lastLetter;
  } else {
    initiales.value = 'AP'; // fallback par défaut
  }
}

watch(() => [values.firstName, values.lastName], updateInitiales, {
  deep: true,
});

function validateCurrentStep() {
  // Reset errors
  (Object.keys(errors) as (keyof StepsType)[]).forEach((k) => {
    errors[k] = undefined;
  });

  const schema = stepSchemas[currentStep.value as keyof typeof stepSchemas];
  const result = schema.safeParse(values);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof StepsType;
      errors[key] = issue.message;
    });
    return false;
  }

  return true;
}

function updateValues(field: keyof StepsType, value: string) {
  values[field] = value;
}

// Passer à l'étape suivante
function nextStep() {
  if (!validateCurrentStep()) return;
  if (currentStep.value && currentStep.value < steps.value.length) {
    currentStep.value++;
  }
}

// Revenir à l'étape précédente
function prevStep() {
  if (currentStep.value && currentStep.value > 1) {
    currentStep.value--;
  }
}
</script>

<template>
  <ClientOnly>
    <div class="ps-20 py-10">
      <section class="w-[864px] flex justify-center items-center">
        <div
          v-for="item in steps"
          :key="'item-' + item.id"
          class="w-full flex flex-col justify-center items-center gap-1.5"
        >
          <div class="relative w-full flex justify-center items-center">
            <div class="px-4 bg-white z-10">
              <div
                class="text-sm h-6 w-6 flex justify-center items-center rounded-full"
                :class="
                  currentStep && currentStep >= item.id
                    ? 'bg-[#0072FF] text-white'
                    : 'text-[#667085] bg-[#F9FAFB]'
                "
              >
                {{ item.id }}
              </div>
            </div>
            <div
              v-if="item.id !== steps[0]?.id"
              class="absolute w-60 h-0.5 rounded-full -translate-x-[calc(50%+2rem)]"
              :class="
                currentStep && currentStep >= item.id
                  ? 'bg-[#0072FF]'
                  : 'bg-[#EAECF0]'
              "
            />
          </div>
          <p class="text-xs text-[#344054]">{{ item.content }}</p>
        </div>
      </section>

      <div class="flex gap-20">
        <div class="flex-1 pt-7 flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <button
              v-if="currentStep && steps[0] && currentStep > steps[0].id"
              class="flex items-center gap-2 cursor-pointer"
              @click="prevStep"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
              >
                <path
                  d="M4.69995 8.69995L0.699951 4.69995L4.69995 0.699951"
                  stroke="#475467"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="text-xs font-meidum leading-4">Retour</span>
            </button>

            <StepOne
              v-if="steps[0] && currentStep === steps[0].id"
              :initiales="initiales"
              :photo-preview="photoPreview"
              :values="values"
              :errors="errors"
              @next="nextStep"
              @photo-change="onPhotoChange"
              @remove-photo="removePhoto"
              @update-values="updateValues"
            />

            <StepTwo
              v-if="steps[1] && currentStep === steps[1].id"
              :photo-preview="photoPreview"
              :values="values"
              :errors="errors"
              @next="nextStep"
              @photo-change="onPhotoChange"
              @remove-photo="removePhoto"
              @update-values="updateValues"
            />

            <StepThree v-if="steps[2] && currentStep === steps[2].id" />
          </div>

          <div class="flex items-center gap-4">
            <button
              v-if="currentStep && currentStep > 1"
              class="w-[100px] h-9 rounded-[8px] flex justify-center items-center gap-2 cursor-pointer"
              @click="prevStep"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
              >
                <path
                  d="M14.0333 5.69995H0.699951M0.699951 5.69995L5.69995 10.7M0.699951 5.69995L5.69995 0.699951"
                  stroke="#475467"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="text-sm font-medium leading-5">Retour</span>
            </button>
            <button
              v-if="currentStep === steps.length"
              class="w-full h-9 bg-[#0072FF] rounded-[8px] text-sm text-white cursor-pointer hover:opacity-80 outline-0"
              @click="nextStep"
            >
              Soumettre
            </button>
            <button
              v-else
              class="w-full h-9 bg-[#0072FF] rounded-[8px] text-sm text-white cursor-pointer hover:opacity-80 outline-0"
              @click="nextStep"
            >
              Continuer
            </button>
          </div>
        </div>

        <RightBox />
      </div>
    </div>
  </ClientOnly>
</template>
