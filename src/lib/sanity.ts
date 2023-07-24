import PicoSanity from "picosanity";

//Sanity configuration
export const config = {
  dataset: "production",
  projectId: "dg86ajw4",
  apiVersion: "2021-10-21",
  useCdn: true,
};

export const client = new PicoSanity(config);

export const getTranslations = () => {
  return client.fetch(`*[_type=="translations"]`);
};

export const getInformation = (name: string) => {
  return client.fetch(`*[_type=="information" && name=="${name}"]`);
};

//Hook for using the current logged in user
// export const useCurrentUser = createCurrentUserHook(config);
