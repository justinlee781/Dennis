import { create } from 'zustand'

const useStore = create((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
  userID : '',
  setUserID :(id) => set(() => ({ userID: id  })),
  userData : null,
  setUserData :(data) => set(() => ({ userData: data  })),
  convoData : null,
  setConvoData :(data) => set(() => ({ convoData: data  })),
  step1Data: {
    fullName: '',
    email: '',
    phoneNumber: '',
    streetNumber: '',
    city: '',
    postalCode: '',
  },
  step2Data: {
    accountType: null,
    country: '',
    eNumber:'',
    companyName:''
  },
  step3Data: {
    selectedPaymentMethod: null,
  },
  step4Data: {
    bankAccountType: '',
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
  },
  setStep1Data: (data) => set((state) => ({ step1Data: { ...state.step1Data, ...data } })),
  setStep2Data: (data) => set((state) => ({ step2Data: { ...state.step2Data, ...data } })),
  setStep3Data: (data) => set((state) => ({ step3Data: { ...state.step3Data, ...data } })),
  setStep4Data: (data) => set((state) => ({ step4Data: { ...state.step4Data, ...data } })),
}))

export default useStore;