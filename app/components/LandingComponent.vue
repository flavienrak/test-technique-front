<script setup lang="ts">
import RightBox from '~/components/RightBox.vue';
import ClientOnly from '~/components/ClientOnly.vue';
import StepOne from './steps/StepOne.vue';
import StepTwo from './steps/StepTwo.vue';
import StepThree from './steps/StepThree.vue';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';

import { z } from 'zod';
import { ref, reactive } from 'vue';
import type { StepsType } from '~/types/steps';

const steps = ref([
  { id: 1, content: 'Faisons connaissance' },
  { id: 2, content: 'Créez votre espace de travail' },
  { id: 3, content: 'Pour mieux vous connaître' },
]);

const currentStep = ref(steps.value[0]?.id);
const initiales = ref('AP');
const loadingCompany = ref(false);

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

// Files
const userFile = ref<File | null>(null);
const userPreview = ref<string | null>(null);

const companyFile = ref<File | null>(null);
const companyPreview = ref<string | null>(null);

function handleChangeUserFile(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  userFile.value = target.files[0] as File;
  userPreview.value = URL.createObjectURL(userFile.value);
}

function handleChangeCompanyFile(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  companyFile.value = target.files[0] as File;
  companyPreview.value = URL.createObjectURL(companyFile.value);
}

function removeUserFile() {
  userFile.value = null;
  userPreview.value = null;
}

function removeCompanyFile() {
  companyFile.value = null;
  companyPreview.value = null;
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

const lastFetchedEmail = ref<string | null>(null);

// 🔹 Fonction pour récupérer les infos via l’API Clearbit
async function fetchCompanyInfo(email: string) {
  const domain = extractDomainFromEmail(email);
  if (!domain) return null;

  try {
    const response = await fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${domain}`,
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const company = data[0];
      return {
        companyName: company.name || domain,
        website: `https://${company.domain}`,
        companyDescription: `${company.name} est une entreprise reconnue.`,
        sector: '',
      };
    }
  } catch (err) {
    console.error('Erreur lors de la récupération Clearbit:', err);
  }

  return null;
}

function updateValues(field: keyof StepsType, value: string) {
  values[field] = value;
}

function resetForm() {
  // Reset des valeurs du formulaire
  Object.assign(values, {
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    companyDescription: '',
    website: '',
    address: '',
    sector: '',
  });

  // Reset des erreurs
  (Object.keys(errors) as (keyof typeof errors)[]).forEach((k) => {
    errors[k] = undefined;
  });

  // Reset autres refs
  userFile.value = null;
  userPreview.value = null;
  companyFile.value = null;
  companyPreview.value = null;
  initiales.value = 'AP';
  lastFetchedEmail.value = null;

  // Reset step
  currentStep.value = steps.value[0]?.id;
}

async function nextStep() {
  if (!validateCurrentStep()) return;

  // ⚙️ Pré-remplissage infos entreprise si step 1 et champs vides
  if (
    currentStep.value === 1 &&
    values.email &&
    !values.companyName &&
    !values.companyDescription &&
    !values.website &&
    values.email !== lastFetchedEmail.value
  ) {
    loadingCompany.value = true;
    const info = await fetchCompanyInfo(values.email);
    loadingCompany.value = false;

    if (info) {
      Object.assign(values, info);
      lastFetchedEmail.value = values.email;
    }
  }

  // ✅ Passer à l’étape suivante
  if (currentStep.value && currentStep.value < steps.value.length) {
    currentStep.value++;
  } else {
    // Lancer confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Afficher SweetAlert2
    Swal.fire({
      title: 'Félicitations !',
      text: 'Vous avez accompli toutes les étapes avec succès.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm();
      }
    });
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
              :user-preview="userPreview"
              :values="values"
              :errors="errors"
              @next="nextStep"
              @change-file="handleChangeUserFile"
              @remove-file="removeUserFile"
              @update-values="updateValues"
            />

            <StepTwo
              v-if="steps[1] && currentStep === steps[1].id"
              :company-preview="companyPreview"
              :values="values"
              :errors="errors"
              @next="nextStep"
              @change-file="handleChangeCompanyFile"
              @remove-file="removeCompanyFile"
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
              class="w-full h-9 flex items-center justify-center gap-1 bg-[#0072FF] rounded-[8px] text-sm text-white cursor-pointer hover:opacity-80 outline-0"
              :class="loadingCompany ? 'opacity-80' : ''"
              :disabled="loadingCompany"
              @click="nextStep"
            >
              <svg
                v-if="loadingCompany"
                aria-hidden="true"
                role="status"
                class="inline w-4 h-4 animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>

              <span>
                {{ currentStep === steps.length ? 'Soumettre' : 'Continuer' }}
              </span>
            </button>
          </div>
        </div>

        <RightBox
          v-if="currentStep"
          :current-step="currentStep"
          :initiales="initiales"
          :values="values"
          :user-preview="userPreview"
          :company-preview="companyPreview"
        />
      </div>
    </div>
  </ClientOnly>
</template>
