<script setup lang="ts">
import type { StepsType } from '~/types/steps';

const props = defineProps<{
  values: StepsType;
  errors: Partial<StepsType>;
  photoPreview: string | null;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
  (e: 'photo-change', event: Event): void;
  (e: 'remove-photo'): void;
  (e: 'update-values', field: keyof typeof props.values, value: string): void;
}>();

function handleChange(event: Event) {
  emit('photo-change', event);
}

function handleRemove() {
  // Reset input file
  if (fileInput.value) {
    fileInput.value.value = '';
  }

  emit('remove-photo');
}

function updateField(field: keyof typeof props.values, event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update-values', field, target.value);
}
</script>

<template>
  <div class="flex-1 flex flex-col gap-6">
    <h1 class="text-2xl font-semibold text-[#101828]">
      Créez votre espace de travail
    </h1>
    <div class="flex flex-col gap-1.5">
      <p class="text-xs leading-4">Logo de l’entreprise</p>
      <div class="flex items-center gap-8">
        <label
          class="h-[72px] w-[72px] flex justify-center items-center bg-[#f2f4f7] rounded-full border-[3px] border-white"
          style="
            box-shadow:
              0px 2px 4px -2px #1018280f,
              0px 4px 8px -2px #1018281a;
          "
        >
          <img
            v-if="photoPreview"
            :src="photoPreview"
            alt="Profil"
            class="w-full h-full rounded-full object-cover"
          />
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="29"
            viewBox="0 0 32 29"
            fill="none"
          >
            <path
              d="M9.25 13H4.9C4.05992 13 3.63988 13 3.31901 13.1635C3.03677 13.3073 2.8073 13.5368 2.66349 13.819C2.5 14.1399 2.5 14.5599 2.5 15.4V28M22.75 13H27.1C27.9401 13 28.3601 13 28.681 13.1635C28.9632 13.3073 29.1927 13.5368 29.3365 13.819C29.5 14.1399 29.5 14.5599 29.5 15.4V28M22.75 28V5.8C22.75 4.11984 22.75 3.27976 22.423 2.63803C22.1354 2.07354 21.6765 1.6146 21.112 1.32698C20.4702 1 19.6302 1 17.95 1H14.05C12.3698 1 11.5298 1 10.888 1.32698C10.3235 1.6146 9.8646 2.07354 9.57698 2.63803C9.25 3.27976 9.25 4.11984 9.25 5.8V28M31 28H1M14.5 7H17.5M14.5 13H17.5M14.5 19H17.5"
              stroke="#667085"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </label>
        <div class="text-xs flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <label
              for="file"
              class="text-[#475467] flex items-center gap-1.5 border border-[#D0D5DD] rounded-md px-2.5 py-2 cursor-pointer"
            >
              <input
                id="file"
                ref="fileInput"
                type="file"
                class="hidden"
                accept=".png,.jpeg"
                @change="handleChange"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M14 10V10.8C14 11.9201 14 12.4802 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.4802 14 11.9201 14 10.8 14H5.2C4.07989 14 3.51984 14 3.09202 13.782C2.71569 13.5903 2.40973 13.2843 2.21799 12.908C2 12.4802 2 11.9201 2 10.8V10M11.3333 5.33333L8 2M8 2L4.66667 5.33333M8 2V10"
                  stroke="#475467"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span> Ajouter une photo </span>
            </label>
            <button
              type="button"
              class="border px-3 py-2 rounded-md"
              :class="
                photoPreview
                  ? 'text-[#475467] border-[#D0D5DD] cursor-pointer'
                  : 'text-[#98A2B3] border-[#98A2B3]'
              "
              :disabled="!photoPreview"
              @click="handleRemove"
            >
              Supprimer
            </button>
          </div>
          <span class="text-[#667085] leading-4 font-normal"
            >au format *.png ou *.jpeg max 5mo</span
          >
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs"> Nom de l’entreprise * </label>
      <input
        :value="values.companyName"
        type="text"
        name="companyName"
        placeholder="Mon Entreprise"
        auto-complete="off"
        class="text-sm border bg-[#FFFFFF] rounded-md px-3 py-2"
        :class="errors.companyName ? 'border-red-500' : 'border-[#CAD5E2]'"
        @input="updateField('companyName', $event)"
      />
      <p v-if="errors.companyName" class="text-red-500 text-xs">
        {{ errors.companyName }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs">
        Description de l’entreprise
      </label>
      <textarea
        :value="values.companyDescription"
        type="text"
        name="companyDescription"
        placeholder="Décrivez votre entreprise brièvement :

        •   Histoire et chiffres clés
        •   Produits ou services commercialisés
        •   Culture et valeurs"
        auto-complete="off"
        rows="5"
        class="custom-scrollbar text-sm border bg-[#FFFFFF] rounded-md p-3 resize-none"
        :class="
          errors.companyDescription ? 'border-red-500' : 'border-[#CAD5E2]'
        "
        @input="updateField('companyDescription', $event)"
      />
      <p v-if="errors.companyDescription" class="text-red-500 text-xs">
        {{ errors.companyDescription }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs"> Site internet </label>
      <div class="relative w-full flex items-center">
        <p
          class="w-[76px] h-full absolute left-0 flex justify-center items-center text-[#475467] text-sm leading-5 bg-[#F9FAFB] border border-[#D0D5DD] rounded-l-md"
        >
          https://
        </p>
        <input
          :value="values.website"
          name="website"
          type="text"
          placeholder="votre-entreprise.com"
          auto-complete="off"
          class="w-full text-sm border bg-[#FFFFFF] rounded-md ps-22 pe-3 py-2"
          :class="errors.firstName ? 'border-red-500' : 'border-[#CAD5E2]'"
          @input="updateField('website', $event)"
        />
      </div>
      <p v-if="errors.website" class="text-red-500 text-xs">
        {{ errors.website }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs"> Adresse du siège social </label>
      <input
        :value="values.address"
        name="address"
        type="text"
        placeholder="Renseignez l’adresse de votre entreprise"
        auto-complete="off"
        class="w-full text-sm border bg-[#FFFFFF] rounded-md p-3 py-2"
        :class="errors.firstName ? 'border-red-500' : 'border-[#CAD5E2]'"
        @input="updateField('address', $event)"
      />
      <p v-if="errors.address" class="text-red-500 text-xs">
        {{ errors.address }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs"> Secteur d’activité </label>
      <input
        :value="values.sector"
        name="sector"
        type="text"
        placeholder="Renseignez le secteur d’activité de votre entreprise"
        auto-complete="off"
        class="w-full text-sm border bg-[#FFFFFF] rounded-md p-3 py-2"
        :class="errors.firstName ? 'border-red-500' : 'border-[#CAD5E2]'"
        @input="updateField('sector', $event)"
      />
      <p v-if="errors.sector" class="text-red-500 text-xs">
        {{ errors.sector }}
      </p>
    </div>
  </div>
</template>
