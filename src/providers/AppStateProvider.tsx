import React, { createContext, useContext } from "react";

export class AppState {
  isLoading: boolean = false;
}

//Creation of the Context
const AppStateContext = createContext<
  { state: AppState; setState: Function; patchState: Function } | undefined
>(undefined);

function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState(new AppState());

  const patchState = (key: string, value: string | string[]) => {
    //Enforce validation

    setState({
      ...state,
      [key]: value,
    });
  };

  //@@ NOTE: you *might* need to memoize this value
  //@@ Learn more in http://kcd.im/optimize-context
  return (
    <AppStateContext.Provider value={{ state, setState, patchState }}>
      {children}
    </AppStateContext.Provider>
  );
}

function useAppState(): {
  state: AppState;
  setState: Function;
  patchState: Function;
} {
  const context = useContext(AppStateContext);

  if (context == undefined) {
    throw new Error("useApPState must be used within AppStateProvider");
  }
  return context;
}

export { AppStateProvider, useAppState };
