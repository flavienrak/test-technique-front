<script setup lang="ts">
import type { StepsType } from '~/types/steps';

const props = defineProps<{
  values: StepsType;
  errors: Partial<StepsType>;
  initiales: string;
  userPreview: string | null;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
  (e: 'change-file', event: Event): void;
  (e: 'remove-file'): void;
  (e: 'update-values', field: keyof typeof props.values, value: string): void;
}>();

function handleChangeFile(event: Event) {
  emit('change-file', event);
}

function handleRemoveFile() {
  // Reset input file
  if (fileInput.value) {
    fileInput.value.value = '';
  }

  emit('remove-file');
}

function updateField(field: keyof typeof props.values, event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update-values', field, target.value);
}
</script>

<template>
  <div class="flex-1 flex flex-col gap-6">
    <h1 class="text-2xl font-semibold text-[#101828]">Faisons connaissance</h1>
    <div class="flex flex-col gap-1.5">
      <p class="text-xs leading-4 text-[#344054] font-medium">
        Photo de profil
      </p>
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
            v-if="userPreview"
            :src="userPreview"
            alt="Profil"
            class="w-full h-full rounded-full object-cover"
          />
          <p
            v-else
            class="text-[#667085] leading-[38px] text-[30px] font-semibold select-none"
          >
            {{ initiales }}
          </p>
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
                @change="handleChangeFile"
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
                userPreview
                  ? 'text-[#475467] border-[#D0D5DD] cursor-pointer'
                  : 'text-[#98A2B3] border-[#98A2B3]'
              "
              :disabled="!userPreview"
              @click="handleRemoveFile"
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
      <label class="text-[#344054] text-xs font-medium"> Prénom </label>
      <input
        :value="values.firstName"
        type="text"
        name="firstName"
        placeholder="Alain"
        auto-complete="off"
        class="h-9 text-sm border bg-[#FFFFFF] rounded-md px-3"
        :class="errors.firstName ? 'border-red-500' : 'border-[#CAD5E2]'"
        @input="updateField('firstName', $event)"
      />
      <p v-if="errors.firstName" class="text-red-500 text-xs">
        {{ errors.firstName }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs font-medium"> Nom </label>
      <input
        :value="values.lastName"
        type="text"
        name="lastName"
        placeholder="Provist"
        auto-complete="off"
        class="h-9 text-sm border bg-[#FFFFFF] rounded-md px-3"
        :class="errors.firstName ? 'border-red-500' : 'border-[#CAD5E2]'"
        @input="updateField('lastName', $event)"
      />
      <p v-if="errors.lastName" class="text-red-500 text-xs">
        {{ errors.lastName }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[#344054] text-xs font-medium"> Adresse mail </label>
      <div class="relative w-full flex items-center">
        <span class="absolute left-3 w-5 h-5 text-[#90A1B9]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M18.3333 5.83337L10.8583 10.5834C10.6011 10.7446 10.3036 10.83 10 10.83C9.69641 10.83 9.39895 10.7446 9.14167 10.5834L1.66667 5.83337M3.33334 3.33337H16.6667C17.5871 3.33337 18.3333 4.07957 18.3333 5.00004V15C18.3333 15.9205 17.5871 16.6667 16.6667 16.6667H3.33334C2.41286 16.6667 1.66667 15.9205 1.66667 15V5.00004C1.66667 4.07957 2.41286 3.33337 3.33334 3.33337Z"
              stroke="#90A1B9"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <input
          :value="values.email"
          name="email"
          type="email"
          placeholder="alain.provist@peugeot.com"
          auto-complete="off"
          class="w-full h-9 text-sm border bg-[#FFFFFF] rounded-md ps-10 pe-3"
          :class="errors.firstName ? 'border-red-500' : 'border-[#CAD5E2]'"
          @input="updateField('email', $event)"
        />
      </div>
      <p v-if="errors.email" class="text-red-500 text-xs">
        {{ errors.email }}
      </p>
    </div>
  </div>
</template>
