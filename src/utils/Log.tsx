// import { useAppState } from "../providers/AppStateProvider";

// const { state } = useAppState();

export const Log = (
  value: any,
  type: "verbose" | "debug" | "error" = "verbose",
  showInProd: boolean = false
) => {
  console.log(value);
  // if (state.isDev || showInProd) {
  // if (showInProd) {
  //   if (type == "error") {
  //     return console.error(value);
  //   }
  //   console.log(value);
  // }
};
