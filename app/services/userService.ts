export async function createUserService(data: FormData) {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBase;

  try {
    // const response = await $fetch(`${apiUrl}/api/user`, {
    //   method: 'POST',
    //   body: data,
    // });
    // return response;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Utilisateur créé avec succès !',
          data: {
            id: Math.floor(Math.random() * 1000), // ID simulé
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
          },
        });
      }, 3000); // attente 3 secondes
    });
  } catch (error) {
    console.error('API error :', error);
    throw error;
  }
}
